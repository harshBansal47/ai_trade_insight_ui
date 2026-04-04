"use client";

import { useState, useEffect, useId } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Home,
  Loader2,
  Mail,
  Shield,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/services/auth.service";
import { useCountdown } from "@/hooks/useCountdown";
import {
  validateEmail,
  validatePassword,
  validateOtp,
  validateName,
  validateConfirmPassword,
} from "@/lib/validations";

// ═══════════════════════════════════════════════════════
// SHARED PRIMITIVES
// ═══════════════════════════════════════════════════════

function Field({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  disabled,
  required,
  error,
  hint,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  hint?: string;
}) {
  const id = useId();
  const [show, setShow] = useState(false);
  const isPass = type === "password";

  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="flex items-center gap-1.5 text-sm font-medium text-foreground/80"
      >
        {label}
        {required && <span className="text-red-400 text-xs">*</span>}
      </label>
      <div className="relative">
        <input
          id={id}
          type={isPass ? (show ? "text" : "password") : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "w-full px-4 py-3 rounded-xl border text-sm text-foreground",
            "bg-white/[0.04] placeholder:text-muted-foreground/40",
            "outline-none transition-all duration-200",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error
              ? "border-red-400/60 focus:border-red-400 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]"
              : "border-white/[0.12] hover:border-white/[0.2] focus:border-cyan-400/60 focus:shadow-[0_0_0_3px_rgba(0,212,255,0.08)] focus:bg-white/[0.06]",
            isPass && "pr-12"
          )}
        />
        {isPass && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShow(!show)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
          >
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-400 flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-red-400 shrink-0" />{error}</p>}
      {hint && !error && <p className="text-xs text-muted-foreground/60">{hint}</p>}
    </div>
  );
}

function OtpInput({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  const length = 6;
  const digits = Array.from({ length }, (_, i) => value[i] ?? "");

  const handleChange = (i: number, ch: string) => {
    const d = ch.replace(/\D/g, "").slice(-1);
    const arr = [...digits];
    arr[i] = d;
    onChange(arr.join(""));
    if (d && i < length - 1) document.getElementById(`otp-${i + 1}`)?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[i] && i > 0)
      document.getElementById(`otp-${i - 1}`)?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    onChange(text);
    document.getElementById(`otp-${Math.min(text.length, length - 1)}`)?.focus();
  };

  return (
    <div className="flex gap-3 justify-center">
      {digits.map((d, i) => (
        <input
          key={i}
          id={`otp-${i}`}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d}
          disabled={disabled}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className={cn(
            "w-12 h-14 text-center text-xl font-bold rounded-xl border",
            "bg-white/[0.04] text-foreground outline-none transition-all duration-200",
            "disabled:opacity-50 hover:border-white/[0.2]",
            d
              ? "border-cyan-400/60 bg-cyan-400/8 text-cyan-400 shadow-[0_0_0_3px_rgba(0,212,255,0.1)]"
              : "border-white/[0.12] focus:border-cyan-400/60 focus:shadow-[0_0_0_3px_rgba(0,212,255,0.08)]"
          )}
        />
      ))}
    </div>
  );
}

function PrimaryBtn({
  loading,
  disabled,
  children,
  onClick,
  type = "submit",
}: {
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: "submit" | "button";
}) {
  return (
    <button
      type={type}
      disabled={loading || disabled}
      onClick={onClick}
      className={cn(
        "w-full flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl",
        "bg-cyan-400 text-black font-semibold text-sm",
        "transition-all duration-200",
        "shadow-[0_0_20px_rgba(0,212,255,0.3)]",
        "hover:bg-cyan-300 hover:shadow-[0_0_28px_rgba(0,212,255,0.5)] hover:scale-[1.02]",
        "active:scale-[0.98]",
        "disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none"
      )}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : children}
    </button>
  );
}

function SecondaryBtn({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-white/[0.12] text-sm text-muted-foreground hover:text-foreground hover:border-white/[0.22] hover:bg-white/[0.04] transition-all duration-200"
    >
      {children}
    </button>
  );
}

function StepIndicator({
  steps,
  current,
}: {
  steps: string[];
  current: number;
}) {
  return (
    <div className="flex items-center gap-0">
      {steps.map((label, i) => (
        <div key={label} className="flex items-center">
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300",
                i < current
                  ? "bg-cyan-400 text-black"
                  : i === current
                  ? "bg-cyan-400/15 text-cyan-400 border border-cyan-400/40 shadow-[0_0_8px_rgba(0,212,255,0.3)]"
                  : "bg-white/[0.06] text-muted-foreground border border-white/[0.1]"
              )}
            >
              {i < current ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
            </div>
            <span
              className={cn(
                "text-[10px] font-medium whitespace-nowrap",
                i === current ? "text-cyan-400" : "text-muted-foreground/50"
              )}
            >
              {label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={cn(
                "w-12 h-px mb-5 mx-1 transition-all duration-500",
                i < current ? "bg-cyan-400/60" : "bg-white/[0.1]"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// LOGIN FORM
// ═══════════════════════════════════════════════════════

function LoginForm({
  onForgot,
  onSuccess,
}: {
  onForgot: () => void;
  onSuccess: () => void;
}) {
  const [method, setMethod] = useState<"password" | "otp">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { login } = useAuthStore();
  const { seconds, isRunning, start } = useCountdown();

  const handleSendOtp = async () => {
    const ev = validateEmail(email);
    if (!ev.valid) { setErrors({ email: ev.error! }); return; }
    setLoading(true);
    try {
      await authService.sendOtp({ email, purpose: "login" });
      setOtpSent(true);
      start(60);
      toast.success("OTP sent to your email");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    const ev = validateEmail(email);
    if (!ev.valid) errs.email = ev.error!;
    if (method === "password" && !password) errs.password = "Password is required";
    if (method === "otp" && otpSent) {
      const ov = validateOtp(otp);
      if (!ov.valid) errs.otp = ov.error!;
    }
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const res =
        method === "password"
          ? await authService.loginWithPassword({ email, password })
          : await authService.loginWithOtp({ email, otp });
      login(res.user, res.token, res.points);
      document.cookie = `auth-token=${res.token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Strict`;
      toast.success(`Welcome back, ${res.user.name}!`);
      onSuccess();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Method toggle */}
      <div className="flex p-1.5 bg-white/[0.04] rounded-2xl gap-1.5 border border-white/[0.08]">
        {(["password", "otp"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setMethod(m);
              setOtpSent(false);
              setOtp("");
              setErrors({});
            }}
            className={cn(
              "flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
              method === m
                ? "bg-white/[0.1] text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {m === "password" ? "🔑  Password" : "📱  One-time code"}
          </button>
        ))}
      </div>

      <Field
        label="Email address"
        type="email"
        value={email}
        onChange={(v) => { setEmail(v); setErrors((p) => ({ ...p, email: "" })); }}
        placeholder="you@example.com"
        required
        disabled={loading}
        error={errors.email}
      />

      {method === "password" ? (
        <>
          <Field
            label="Password"
            type="password"
            value={password}
            onChange={(v) => { setPassword(v); setErrors((p) => ({ ...p, password: "" })); }}
            placeholder="Enter your password"
            required
            disabled={loading}
            error={errors.password}
          />
          <div className="flex justify-between items-center">
            <span />
            <button
              type="button"
              onClick={onForgot}
              className="text-sm text-muted-foreground hover:text-cyan-400 transition-colors font-medium"
            >
              Forgot password?
            </button>
          </div>
        </>
      ) : (
        <div className="space-y-4">
          {!otpSent ? (
            <SecondaryBtn onClick={handleSendOtp}>
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Mail className="w-4 h-4" />
              )}
              Send one-time code to email
            </SecondaryBtn>
          ) : (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <p className="text-sm font-medium text-foreground">Check your inbox</p>
                <p className="text-sm text-muted-foreground">
                  We sent a code to{" "}
                  <span className="text-foreground font-medium">{email}</span>
                </p>
              </div>
              <OtpInput
                value={otp}
                onChange={(v) => { setOtp(v); setErrors((p) => ({ ...p, otp: "" })); }}
                disabled={loading}
              />
              {errors.otp && (
                <p className="text-sm text-red-400 text-center">{errors.otp}</p>
              )}
              <div className="text-center text-sm text-muted-foreground">
                {isRunning ? (
                  <span>
                    Resend in{" "}
                    <span className="text-foreground font-mono font-semibold">{seconds}s</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
                  >
                    Resend code
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <PrimaryBtn loading={loading}>
        Sign in
        <ArrowRight className="w-4 h-4" />
      </PrimaryBtn>
    </form>
  );
}

// ═══════════════════════════════════════════════════════
// SIGNUP FORM
// ═══════════════════════════════════════════════════════

type SStep = "info" | "otp" | "password";

function SignupForm({ onSuccess }: { onSuccess: () => void }) {
  const [step, setStep] = useState<SStep>("info");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { login } = useAuthStore();
  const { seconds, isRunning, start } = useCountdown();

  const STEPS = ["Your info", "Verify email", "Set password"];
  const stepIndex: Record<SStep, number> = { info: 0, otp: 1, password: 2 };

  const handleSendOtp = async () => {
    const ne = validateName(name);
    const ee = validateEmail(email);
    const errs: Record<string, string> = {};
    if (!ne.valid) errs.name = ne.error!;
    if (!ee.valid) errs.email = ee.error!;
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await authService.sendOtp({ email, purpose: "signup" });
      setStep("otp");
      start(60);
      toast.success("Verification code sent!");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const ov = validateOtp(otp);
    if (!ov.valid) { setErrors({ otp: ov.error! }); return; }
    setLoading(true);
    try {
      const res = await authService.verifyOtp({ email, otp, purpose: "signup" });
      if (res.verified) {
        setStep("password");
        toast.success("Email verified!");
      } else {
        setErrors({ otp: "Invalid code. Please try again." });
      }
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const pe = validatePassword(password);
    const ce = validateConfirmPassword(password, confirm);
    const errs: Record<string, string> = {};
    if (!pe.valid) errs.password = pe.error!;
    if (!ce.valid) errs.confirm = ce.error!;
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const res = await authService.signup({ name, email, password, otp });
      login(res.user, res.token, res.points);
      document.cookie = `auth-token=${res.token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Strict`;
      toast.success(`Welcome aboard, ${res.user.name}! 🎉`, {
        description: "50 free analysis points have been added.",
      });
      onSuccess();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Step indicator */}
      <div className="flex justify-center">
        <StepIndicator steps={STEPS} current={stepIndex[step]} />
      </div>

      {/* Step: Info */}
      {step === "info" && (
        <div className="space-y-5">
          <Field
            label="Full name"
            value={name}
            onChange={(v) => { setName(v); setErrors((p) => ({ ...p, name: "" })); }}
            placeholder="Satoshi Nakamoto"
            required
            disabled={loading}
            error={errors.name}
          />
          <Field
            label="Email address"
            type="email"
            value={email}
            onChange={(v) => { setEmail(v); setErrors((p) => ({ ...p, email: "" })); }}
            placeholder="you@example.com"
            required
            disabled={loading}
            error={errors.email}
          />
          <PrimaryBtn type="button" loading={loading} onClick={handleSendOtp} disabled={!name || !email}>
            <Mail className="w-4 h-4" />
            Continue with email
          </PrimaryBtn>
        </div>
      )}

      {/* Step: OTP */}
      {step === "otp" && (
        <div className="space-y-5">
          <div className="text-center space-y-1.5 py-2">
            <div className="w-12 h-12 rounded-2xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center mx-auto mb-3">
              <Mail className="w-6 h-6 text-cyan-400" />
            </div>
            <p className="text-base font-semibold text-foreground">Check your inbox</p>
            <p className="text-sm text-muted-foreground">
              We sent a 6-digit code to{" "}
              <span className="text-foreground font-medium">{email}</span>
            </p>
          </div>

          <OtpInput
            value={otp}
            onChange={(v) => { setOtp(v); setErrors((p) => ({ ...p, otp: "" })); }}
            disabled={loading}
          />
          {errors.otp && (
            <p className="text-sm text-red-400 text-center">{errors.otp}</p>
          )}

          <div className="text-center text-sm text-muted-foreground">
            {isRunning ? (
              <span>
                Resend available in{" "}
                <span className="text-foreground font-mono font-semibold">{seconds}s</span>
              </span>
            ) : (
              <button
                type="button"
                onClick={handleSendOtp}
                className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
              >
                Resend code
              </button>
            )}
          </div>

          <PrimaryBtn
            type="button"
            loading={loading}
            onClick={handleVerifyOtp}
            disabled={otp.length < 6}
          >
            Verify email
            <ArrowRight className="w-4 h-4" />
          </PrimaryBtn>

          <SecondaryBtn onClick={() => { setStep("info"); setOtp(""); setErrors({}); }}>
            <ArrowLeft className="w-4 h-4" />
            Back
          </SecondaryBtn>
        </div>
      )}

      {/* Step: Password */}
      {step === "password" && (
        <form onSubmit={handleSignup} className="space-y-5">
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-green-400/5 border border-green-400/20">
            <div className="w-8 h-8 rounded-lg bg-green-400/15 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-green-400">Email verified</p>
              <p className="text-xs text-muted-foreground">{email}</p>
            </div>
          </div>

          <Field
            label="Create a password"
            type="password"
            value={password}
            onChange={(v) => { setPassword(v); setErrors((p) => ({ ...p, password: "" })); }}
            placeholder="Minimum 8 characters"
            required
            disabled={loading}
            error={errors.password}
          />
          <Field
            label="Confirm password"
            type="password"
            value={confirm}
            onChange={(v) => { setConfirm(v); setErrors((p) => ({ ...p, confirm: "" })); }}
            placeholder="Repeat your password"
            required
            disabled={loading}
            error={errors.confirm}
          />

          {/* Strength indicators */}
          <div className="flex items-center gap-2">
            {[
              { label: "8+ chars",  ok: password.length >= 8 },
              { label: "Uppercase", ok: /[A-Z]/.test(password) },
              { label: "Number",    ok: /[0-9]/.test(password) },
            ].map(({ label, ok }) => (
              <div
                key={label}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200",
                  ok
                    ? "bg-green-400/10 text-green-400 border border-green-400/20"
                    : "bg-white/[0.04] text-muted-foreground border border-white/[0.08]"
                )}
              >
                {ok && <CheckCircle2 className="w-3 h-3" />}
                {label}
              </div>
            ))}
          </div>

          <PrimaryBtn loading={loading}>
            Create account
            <Sparkles className="w-4 h-4" />
          </PrimaryBtn>
        </form>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// FORGOT PASSWORD
// ═══════════════════════════════════════════════════════

type FStep = "email" | "otp" | "reset";

function ForgotPasswordForm({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState<FStep>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { seconds, isRunning, start } = useCountdown();

  const STEPS = ["Your email", "Verify code", "New password"];
  const stepIndex: Record<FStep, number> = { email: 0, otp: 1, reset: 2 };

  const sendOtp = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const ev = validateEmail(email);
    if (!ev.valid) { setErrors({ email: ev.error! }); return; }
    setLoading(true);
    try {
      await authService.sendOtp({ email, purpose: "forgot_password" });
      setStep("otp");
      start(60);
      toast.success("Reset code sent to your email");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    const ov = validateOtp(otp);
    if (!ov.valid) { setErrors({ otp: ov.error! }); return; }
    setLoading(true);
    try {
      const res = await authService.verifyOtp({ email, otp, purpose: "forgot_password" });
      if (res.verified) setStep("reset");
      else setErrors({ otp: "Invalid code." });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const pe = validatePassword(password);
    const ce = validateConfirmPassword(password, confirm);
    const errs: Record<string, string> = {};
    if (!pe.valid) errs.password = pe.error!;
    if (!ce.valid) errs.confirm = ce.error!;
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await authService.forgotPassword({ email, otp, new_password: password });
      toast.success("Password reset successfully! Please sign in.");
      onBack();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to sign in
      </button>

      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
          Reset password
        </h2>
        <p className="text-sm text-muted-foreground">
          {step === "email"
            ? "Enter your email address and we'll send a reset code"
            : step === "otp"
            ? "Enter the 6-digit code we sent to your email"
            : "Choose a strong new password for your account"}
        </p>
      </div>

      <div className="flex justify-center">
        <StepIndicator steps={STEPS} current={stepIndex[step]} />
      </div>

      {step === "email" && (
        <form onSubmit={sendOtp} className="space-y-5">
          <Field
            label="Email address"
            type="email"
            value={email}
            onChange={(v) => { setEmail(v); setErrors((p) => ({ ...p, email: "" })); }}
            placeholder="you@example.com"
            required
            disabled={loading}
            error={errors.email}
          />
          <PrimaryBtn loading={loading}>
            Send reset code
            <ArrowRight className="w-4 h-4" />
          </PrimaryBtn>
        </form>
      )}

      {step === "otp" && (
        <div className="space-y-5">
          <OtpInput
            value={otp}
            onChange={(v) => { setOtp(v); setErrors((p) => ({ ...p, otp: "" })); }}
            disabled={loading}
          />
          {errors.otp && <p className="text-sm text-red-400 text-center">{errors.otp}</p>}
          <div className="text-center text-sm text-muted-foreground">
            {isRunning ? (
              <span>Resend in <span className="font-mono font-semibold text-foreground">{seconds}s</span></span>
            ) : (
              <button type="button" onClick={() => sendOtp()} className="text-cyan-400 hover:text-cyan-300 font-semibold">
                Resend code
              </button>
            )}
          </div>
          <PrimaryBtn type="button" loading={loading} onClick={verifyOtp} disabled={otp.length < 6}>
            Verify code
            <ArrowRight className="w-4 h-4" />
          </PrimaryBtn>
        </div>
      )}

      {step === "reset" && (
        <form onSubmit={resetPassword} className="space-y-5">
          <Field
            label="New password"
            type="password"
            value={password}
            onChange={(v) => { setPassword(v); setErrors((p) => ({ ...p, password: "" })); }}
            placeholder="Minimum 8 characters"
            required
            disabled={loading}
            error={errors.password}
          />
          <Field
            label="Confirm new password"
            type="password"
            value={confirm}
            onChange={(v) => { setConfirm(v); setErrors((p) => ({ ...p, confirm: "" })); }}
            placeholder="Repeat your new password"
            required
            disabled={loading}
            error={errors.confirm}
          />
          <PrimaryBtn loading={loading}>
            Set new password
            <CheckCircle2 className="w-4 h-4" />
          </PrimaryBtn>
        </form>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// LEFT PANEL — rich marketing content
// ═══════════════════════════════════════════════════════

function LeftPanel() {
  return (
    <div className="hidden lg:flex flex-col h-full p-10 xl:p-12">
      {/* Logo + back to home */}
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 shadow-[0_0_20px_rgba(0,212,255,0.4)] group-hover:shadow-[0_0_28px_rgba(0,212,255,0.6)] transition-shadow">
            <Zap className="w-5 h-5 text-black" strokeWidth={2.5} />
          </div>
          <span className="text-lg font-bold" style={{ fontFamily: "var(--font-display)" }}>
            CryptoAI <span className="gradient-text">Insights</span>
          </span>
        </Link>
        <Link
          href="/"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <Home className="w-4 h-4" />
          Home
        </Link>
      </div>

      {/* Main headline */}
      <div className="flex-1 flex flex-col justify-center space-y-8 py-8">
        <div className="space-y-3">
          <h2
            className="text-4xl xl:text-5xl font-bold leading-[1.1] tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Trade smarter with{" "}
            <span className="gradient-text">AI clarity</span>
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed max-w-sm">
            Real-time AI-powered crypto analysis. Get structured LONG / SHORT / WAIT decisions backed by multi-timeframe data.
          </p>
        </div>

        {/* Free points banner */}
        <div className="relative glass rounded-2xl p-5 border border-cyan-400/25 bg-cyan-400/[0.04] overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/[0.06] rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
          <div className="relative flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-400/30 to-violet-400/20 border border-cyan-400/30 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="space-y-1">
              <p className="text-base font-semibold text-foreground">
                50 free points on signup
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                That&apos;s 5 full AI analyses — completely free. No credit card required.
              </p>
            </div>
          </div>
        </div>

        {/* Feature list */}
        <div className="space-y-4">
          {[
            {
              icon: TrendingUp,
              color: "text-green-400",
              bg: "bg-green-400/10",
              title: "Clear trade signals",
              desc: "LONG / SHORT / WAIT with confidence score and full reasoning",
            },
            {
              icon: Zap,
              color: "text-cyan-400",
              bg: "bg-cyan-400/10",
              title: "3 strategy modes",
              desc: "Scalper (1m–15m), Swing (1h–1D), Conservative (1D–1W)",
            },
            {
              icon: Shield,
              color: "text-violet-400",
              bg: "bg-violet-400/10",
              title: "Risk-first analysis",
              desc: "Entry, target, and stop-loss prices with every signal",
            },
          ].map(({ icon: Icon, color, bg, title, desc }) => (
            <div key={title} className="flex items-start gap-4">
              <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5", bg)}>
                <Icon className={cn("w-4.5 h-4.5", color)} />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{title}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Social proof / stats */}
        <div className="grid grid-cols-3 gap-3 pt-2 border-t border-white/[0.06]">
          {[
            { value: "25+",    label: "Coins supported" },
            { value: "3",      label: "Strategy modes" },
            { value: "< 10s",  label: "Analysis time" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center space-y-0.5">
              <p className="text-xl font-bold gradient-text" style={{ fontFamily: "var(--font-display)" }}>
                {value}
              </p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-muted-foreground/30">
        Not financial advice. Past results do not guarantee future performance.
      </p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// MAIN AUTH PAGE
// ═══════════════════════════════════════════════════════

type AuthView = "login" | "signup" | "forgot";

export default function AuthPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [view, setView] = useState<AuthView>("login");
  const [tab, setTab] = useState<"login" | "signup">("login");
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) router.replace(params.get("redirect") || "/dashboard");
  }, [isAuthenticated, router, params]);

  const handleSuccess = () => router.push(params.get("redirect") || "/dashboard");

  return (
    <div className="min-h-screen bg-background flex relative">
      {/* ── Background effects ─────────────────────────────── */}
      <div className="fixed inset-0 bg-grid pointer-events-none opacity-50" />
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-violet-500/[0.05] rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/[0.04] rounded-full blur-[120px] pointer-events-none" />

      {/* ── Left panel ────────────────────────────────────── */}
      <div className="hidden lg:block w-[520px] xl:w-[580px] shrink-0 border-r border-white/[0.06] relative">
        <LeftPanel />
      </div>

      {/* ── Right panel — form ────────────────────────────── */}
      <div className="flex-1 flex flex-col">
        {/* Mobile top bar */}
        <div className="flex lg:hidden items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center shadow-[0_0_12px_rgba(0,212,255,0.4)]">
              <Zap className="w-4 h-4 text-black" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-base" style={{ fontFamily: "var(--font-display)" }}>
              CryptoAI <span className="gradient-text">Insights</span>
            </span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:block">Home</span>
          </Link>
        </div>

        {/* Form content */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-[440px] animate-fade-in">
            {view === "forgot" ? (
              <ForgotPasswordForm onBack={() => setView("login")} />
            ) : (
              <div className="space-y-7">
                {/* Header */}
                <div className="space-y-1.5">
                  <h1
                    className="text-3xl font-bold text-foreground tracking-tight"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {tab === "login" ? "Welcome back" : "Create your account"}
                  </h1>
                  <p className="text-base text-muted-foreground">
                    {tab === "login"
                      ? "Sign in to access your AI trading insights"
                      : "Start with 50 free points — no card required"}
                  </p>
                </div>

                {/* Tab switcher */}
                <div className="flex p-1.5 bg-white/[0.04] rounded-2xl gap-1.5 border border-white/[0.08]">
                  {(["login", "signup"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTab(t)}
                      className={cn(
                        "flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200",
                        tab === t
                          ? "bg-white/[0.1] text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {t === "login" ? "Sign in" : "Sign up"}
                    </button>
                  ))}
                </div>

                {/* Form */}
                {tab === "login" ? (
                  <LoginForm
                    onForgot={() => setView("forgot")}
                    onSuccess={handleSuccess}
                  />
                ) : (
                  <SignupForm onSuccess={handleSuccess} />
                )}

                {/* Switch prompt */}
                <p className="text-center text-sm text-muted-foreground">
                  {tab === "login" ? (
                    <>
                      Don&apos;t have an account?{" "}
                      <button
                        onClick={() => setTab("signup")}
                        className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
                      >
                        Sign up free
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{" "}
                      <button
                        onClick={() => setTab("login")}
                        className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
                      >
                        Sign in
                      </button>
                    </>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 