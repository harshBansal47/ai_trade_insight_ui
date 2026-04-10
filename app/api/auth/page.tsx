"use client";

import { useState, useEffect, useId } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
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
import { authService } from "@/services/auth.service";
import { useCountdown } from "@/hooks/useCountdown";
import {
  validateEmail,
  validatePassword,
  validateOtp,
  validateName,
  validateConfirmPassword,
} from "@/lib/validations";

// ═══════════════════════════════════════════════════
// PRIMITIVES
// ═══════════════════════════════════════════════════

function Field({
  label, type = "text", value, onChange,
  placeholder, disabled, required, error, hint,
}: {
  label: string; type?: string; value: string; onChange: (v: string) => void;
  placeholder?: string; disabled?: boolean; required?: boolean; error?: string; hint?: string;
}) {
  const id = useId();
  const [show, setShow] = useState(false);
  const isPass = type === "password";
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="flex items-center gap-1.5 text-sm font-medium text-foreground/80">
        {label}{required && <span className="text-red-400 text-xs">*</span>}
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
            "outline-none transition-all duration-200 disabled:opacity-50",
            error
              ? "border-red-400/60 focus:border-red-400 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]"
              : "border-white/[0.12] hover:border-white/[0.2] focus:border-cyan-400/60 focus:shadow-[0_0_0_3px_rgba(0,212,255,0.08)] focus:bg-white/[0.06]",
            isPass && "pr-12"
          )}
        />
        {isPass && (
          <button type="button" tabIndex={-1} onClick={() => setShow(!show)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground transition-colors">
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-400 flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-red-400 shrink-0" />{error}</p>}
      {hint && !error && <p className="text-xs text-muted-foreground/60">{hint}</p>}
    </div>
  );
}

function OtpInput({ value, onChange, disabled }: {
  value: string; onChange: (v: string) => void; disabled?: boolean;
}) {
  const length = 6;
  const digits = Array.from({ length }, (_, i) => value[i] ?? "");
  const set = (i: number, ch: string) => {
    const d = ch.replace(/\D/g, "").slice(-1);
    const arr = [...digits]; arr[i] = d;
    onChange(arr.join(""));
    if (d && i < length - 1) document.getElementById(`otp-${i + 1}`)?.focus();
  };
  const onKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) document.getElementById(`otp-${i - 1}`)?.focus();
  };
  const onPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    onChange(text);
    document.getElementById(`otp-${Math.min(text.length, length - 1)}`)?.focus();
  };
  return (
    <div className="flex gap-3 justify-center">
      {digits.map((d, i) => (
        <input key={i} id={`otp-${i}`} type="text" inputMode="numeric" maxLength={1}
          value={d} disabled={disabled}
          onChange={(e) => set(i, e.target.value)}
          onKeyDown={(e) => onKeyDown(i, e)}
          onPaste={onPaste}
          className={cn(
            "w-12 h-14 text-center text-xl font-bold rounded-xl border",
            "bg-white/[0.04] text-foreground outline-none transition-all disabled:opacity-50 hover:border-white/[0.2]",
            d ? "border-cyan-400/60 bg-cyan-400/[0.08] text-cyan-400 shadow-[0_0_0_3px_rgba(0,212,255,0.1)]"
              : "border-white/[0.12] focus:border-cyan-400/60 focus:shadow-[0_0_0_3px_rgba(0,212,255,0.08)]"
          )} />
      ))}
    </div>
  );
}

function PrimaryBtn({ loading, disabled, children, onClick, type = "submit" }: {
  loading?: boolean; disabled?: boolean; children: React.ReactNode;
  onClick?: () => void; type?: "submit" | "button";
}) {
  return (
    <button type={type} disabled={loading || disabled} onClick={onClick}
      className="w-full flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl bg-cyan-400 text-black font-semibold text-sm transition-all duration-200 shadow-[0_0_20px_rgba(0,212,255,0.3)] hover:bg-cyan-300 hover:shadow-[0_0_28px_rgba(0,212,255,0.5)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100">
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : children}
    </button>
  );
}

function SecondaryBtn({ children, onClick, disabled }: {
  children: React.ReactNode; onClick: () => void; disabled?: boolean;
}) {
  return (
    <button type="button" onClick={onClick} disabled={disabled}
      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-white/[0.12] text-sm text-muted-foreground hover:text-foreground hover:border-white/[0.22] hover:bg-white/[0.04] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
      {children}
    </button>
  );
}

function StepIndicator({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div className="flex items-center gap-0 justify-center">
      {steps.map((label, i) => (
        <div key={label} className="flex items-center">
          <div className="flex flex-col items-center gap-1.5">
            <div className={cn(
              "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300",
              i < current ? "bg-cyan-400 text-black"
                : i === current ? "bg-cyan-400/15 text-cyan-400 border border-cyan-400/40 shadow-[0_0_8px_rgba(0,212,255,0.3)]"
                  : "bg-white/[0.06] text-muted-foreground border border-white/[0.1]"
            )}>
              {i < current ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
            </div>
            <span className={cn("text-[10px] font-medium whitespace-nowrap",
              i === current ? "text-cyan-400" : "text-muted-foreground/50")}>
              {label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={cn("w-12 h-px mb-5 mx-1 transition-all duration-500",
              i < current ? "bg-cyan-400/60" : "bg-white/[0.1]")} />
          )}
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════
// GOOGLE BUTTON
// ═══════════════════════════════════════════════════

function GoogleButton({ loading, onClick }: { loading: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-white/[0.12] bg-white/[0.03] hover:bg-white/[0.07] hover:border-white/[0.2] text-sm font-medium text-foreground transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <svg className="w-5 h-5 shrink-0" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
          <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
        </svg>
      )}
      Continue with Google
    </button>
  );
}

// ═══════════════════════════════════════════════════
// DIVIDER
// ═══════════════════════════════════════════════════

function Divider() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-px bg-white/[0.08]" />
      <span className="text-xs text-muted-foreground/50 font-medium">or</span>
      <div className="flex-1 h-px bg-white/[0.08]" />
    </div>
  );
}

// ═══════════════════════════════════════════════════
// LOGIN FORM
// ═══════════════════════════════════════════════════

function LoginForm({ onForgot, callbackUrl }: {
  onForgot: () => void; callbackUrl: string;
}) {
 const [method, setMethod] = useState<"password" | "otp">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { seconds, isRunning, start } = useCountdown();

  // ── Set-password sub-flow (for Google-only accounts) ──────────────────────
  type SetPassStep = null | "otp" | "password";
  const [setPassStep, setSetPassStep] = useState<SetPassStep>(null);
  const [setPassOtp, setSetPassOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { seconds: spSeconds, isRunning: spRunning, start: spStart } = useCountdown();

 const handleSendSetPassOtp = async () => {
    setLoading(true);
    setSetPassOtp("");
    try {
      // Reuses the "forgot_password" OTP purpose — same backend flow
      await authService.sendOtp({ email, purpose: "forgot_password" });
      setSetPassStep("otp");
      spStart(60);
      toast.success("Verification code sent to your email");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to send code");
    } finally { setLoading(false); }
  };

  const handleVerifySetPassOtp = async () => {
    const ov = validateOtp(setPassOtp);
    if (!ov.valid) { setErrors({ setPassOtp: ov.error! }); return; }
    setLoading(true);
    try {
      const res = await authService.verifyOtp({ email, otp: setPassOtp, purpose: "forgot_password" });
      if (res.verified) { setSetPassStep("password"); toast.success("Email verified!"); }
      else setErrors({ setPassOtp: "Invalid or expired code." });
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally { setLoading(false); }
  };

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const pe = validatePassword(newPassword);
    const ce = validateConfirmPassword(newPassword, confirmPassword);
    const errs: Record<string, string> = {};
    if (!pe.valid) errs.newPassword = pe.error!;
    if (!ce.valid) errs.confirmPassword = ce.error!;
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      await authService.setPassword({ email, otp: setPassOtp, new_password: newPassword });
      toast.success("Password set! Signing you in…");

      // Auto-login with the newly created password
      const result = await signIn("credentials-password", {
        email, password: newPassword, redirect: false,
      });
      if (result?.ok) {
        window.location.href = callbackUrl;
      } else {
        toast.info("Password set. Please sign in.");
        setSetPassStep(null);
        setMethod("password");
        setPassword(newPassword);
      }
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to set password");
    } finally { setLoading(false); }
  };

  // ── Google ─────────────────────────────────────────────────────────────────
  const handleGoogle = async () => {
    setGoogleLoading(true);
    await signIn("google", { callbackUrl });
  };

  // ── OTP login ──────────────────────────────────────────────────────────────
  const handleSendOtp = async () => {
    const ev = validateEmail(email);
    if (!ev.valid) { setErrors({ email: ev.error! }); return; }
    setLoading(true);
    try {
      await authService.sendOtp({ email, purpose: "login" });
      setOtpSent(true); start(60);
      toast.success("OTP sent to your email");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to send OTP");
    } finally { setLoading(false); }
  };

  // ── Normal login submit ────────────────────────────────────────────────────
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
      const providerId = method === "password" ? "credentials-password" : "credentials-otp";
      const credentials = method === "password" ? { email, password } : { email, otp };

      const result = await signIn(providerId, { ...credentials, redirect: false });

      if (result?.error) {
        const msg: string = result.error === "CredentialsSignin" ? "Invalid credentials" : result.error;

        // ← KEY CHANGE: detect the "no password" case and offer to set one
        if (msg.toLowerCase().includes("not set password") || msg.toLowerCase().includes("google or otp")) {
          toast.info("This account has no password yet. Let's set one up.", { duration: 4000 });
          setSetPassStep("otp"); // jump straight to sending the OTP
          await handleSendSetPassOtp();
        } else {
          toast.error(msg);
        }
      } else if (result?.ok) {
        window.location.href = callbackUrl;
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally { setLoading(false); }
  };

  // ── Set-password flow UI ───────────────────────────────────────────────────
  if (setPassStep !== null) {
    const STEPS = ["Send code", "Verify", "Set password"];
    const si = { otp: 0, password: 1 } as const;

    return (
      <div className="space-y-6">
        {/* Back */}
        <button
          type="button"
          onClick={() => { setSetPassStep(null); setSetPassOtp(""); setNewPassword(""); setConfirmPassword(""); setErrors({}); }}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to sign in
        </button>

        <div className="space-y-1">
          <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
            Set a password
          </h2>
          <p className="text-sm text-muted-foreground">
            Your account uses Google sign-in. Verify your email to add a password.
          </p>
        </div>

        <div className="flex justify-center">
          <StepIndicator steps={STEPS} current={si[setPassStep as keyof typeof si] ?? 1} />
        </div>

        {setPassStep === "otp" && (
          <div className="space-y-5">
            <div className="text-center space-y-1.5 py-2">
              <div className="w-12 h-12 rounded-2xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center mx-auto mb-3">
                <Mail className="w-6 h-6 text-cyan-400" />
              </div>
              <p className="text-base font-semibold text-foreground">Check your inbox</p>
              <p className="text-sm text-muted-foreground">
                Code sent to <span className="text-foreground font-medium">{email}</span>
              </p>
            </div>
            <OtpInput
              value={setPassOtp}
              onChange={(v) => { setSetPassOtp(v); setErrors((p) => ({ ...p, setPassOtp: "" })); }}
              disabled={loading}
            />
            {errors.setPassOtp && <p className="text-sm text-red-400 text-center">{errors.setPassOtp}</p>}
            <div className="text-center text-sm text-muted-foreground">
              {spRunning
                ? <span>Resend in <span className="text-foreground font-mono font-semibold">{spSeconds}s</span></span>
                : <button type="button" onClick={handleSendSetPassOtp} className="text-cyan-400 hover:text-cyan-300 font-semibold">Resend code</button>
              }
            </div>
            <PrimaryBtn type="button" loading={loading} onClick={handleVerifySetPassOtp} disabled={setPassOtp.length < 6}>
              Verify email <ArrowRight className="w-4 h-4" />
            </PrimaryBtn>
          </div>
        )}

        {setPassStep === "password" && (
          <form onSubmit={handleSetPassword} className="space-y-5">
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-green-400/5 border border-green-400/20">
              <div className="w-8 h-8 rounded-lg bg-green-400/15 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-400">Email verified</p>
                <p className="text-xs text-muted-foreground">{email}</p>
              </div>
            </div>
            <Field label="New password" type="password" value={newPassword}
              onChange={(v) => { setNewPassword(v); setErrors((p) => ({ ...p, newPassword: "" })); }}
              placeholder="Minimum 8 characters" required disabled={loading} error={errors.newPassword} />
            <Field label="Confirm password" type="password" value={confirmPassword}
              onChange={(v) => { setConfirmPassword(v); setErrors((p) => ({ ...p, confirmPassword: "" })); }}
              placeholder="Repeat your password" required disabled={loading} error={errors.confirmPassword} />
            <div className="flex items-center gap-2">
              {[{ label: "8+ chars", ok: newPassword.length >= 8 },
                { label: "Uppercase", ok: /[A-Z]/.test(newPassword) },
                { label: "Number", ok: /[0-9]/.test(newPassword) }].map(({ label, ok }) => (
                <div key={label} className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200",
                  ok ? "bg-green-400/10 text-green-400 border border-green-400/20"
                    : "bg-white/[0.04] text-muted-foreground border border-white/[0.08]")}>
                  {ok && <CheckCircle2 className="w-3 h-3" />}{label}
                </div>
              ))}
            </div>
            <PrimaryBtn loading={loading}>
              Set password & sign in <Sparkles className="w-4 h-4" />
            </PrimaryBtn>
          </form>
        )}
      </div>
    );
  }


  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Google */}
      <GoogleButton loading={googleLoading} onClick={handleGoogle} />
      <Divider />

      {/* Method toggle */}
      <div className="flex p-1.5 bg-white/[0.04] rounded-2xl gap-1.5 border border-white/[0.08]">
        {(["password", "otp"] as const).map((m) => (
          <button key={m} type="button"
            onClick={() => { setMethod(m); setOtpSent(false); setOtp(""); setErrors({}); }}
            className={cn("flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
              method === m ? "bg-white/[0.1] text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>
            {m === "password" ? "🔑  Password" : "📱  One-time code"}
          </button>
        ))}
      </div>

      <Field label="Email address" type="email" value={email}
        onChange={(v) => { setEmail(v); setErrors((p) => ({ ...p, email: "" })); }}
        placeholder="you@example.com" required disabled={loading} error={errors.email} />

      {method === "password" ? (
        <>
          <Field label="Password" type="password" value={password}
            onChange={(v) => { setPassword(v); setErrors((p) => ({ ...p, password: "" })); }}
            placeholder="Enter your password" required disabled={loading} error={errors.password} />
          <div className="flex justify-end">
            <button type="button" onClick={onForgot}
              className="text-sm text-muted-foreground hover:text-cyan-400 transition-colors font-medium">
              Forgot password?
            </button>
          </div>
        </>
      ) : (
        <div className="space-y-4">
          {!otpSent ? (
            <SecondaryBtn onClick={handleSendOtp} disabled={loading || !email}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
              Send one-time code
            </SecondaryBtn>
          ) : (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <p className="text-sm font-medium text-foreground">Check your inbox</p>
                <p className="text-sm text-muted-foreground">
                  Code sent to <span className="text-foreground font-medium">{email}</span>
                </p>
              </div>
              <OtpInput value={otp} onChange={(v) => { setOtp(v); setErrors((p) => ({ ...p, otp: "" })); }} disabled={loading} />
              {errors.otp && <p className="text-sm text-red-400 text-center">{errors.otp}</p>}
              <div className="text-center text-sm text-muted-foreground">
                {isRunning
                  ? <span>Resend in <span className="text-foreground font-mono font-semibold">{seconds}s</span></span>
                  : <button type="button" onClick={handleSendOtp} className="text-cyan-400 hover:text-cyan-300 font-semibold">Resend code</button>}
              </div>
            </div>
          )}
        </div>
      )}

      <PrimaryBtn loading={loading}>
        Sign in <ArrowRight className="w-4 h-4" />
      </PrimaryBtn>
    </form>
  );
}

// ═══════════════════════════════════════════════════
// SIGNUP FORM
// ═══════════════════════════════════════════════════

type SStep = "info" | "otp" | "password";

function SignupForm({ callbackUrl }: { callbackUrl: string }) {
  const [step, setStep] = useState<SStep>("info");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { seconds, isRunning, start } = useCountdown();
  const STEPS = ["Your info", "Verify email", "Set password"];
  const si: Record<SStep, number> = { info: 0, otp: 1, password: 2 };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    await signIn("google", { callbackUrl });
  };

  const handleSendOtp = async () => {
    const ne = validateName(name); const ee = validateEmail(email);
    const errs: Record<string, string> = {};
    if (!ne.valid) errs.name = ne.error!;
    if (!ee.valid) errs.email = ee.error!;
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await authService.sendOtp({ email, purpose: "signup" });
      setStep("otp"); start(60); toast.success("Verification code sent!");
    } catch (e: unknown) { toast.error(e instanceof Error ? e.message : "Failed"); }
    finally { setLoading(false); }
  };

  const handleVerifyOtp = async () => {
    const ov = validateOtp(otp);
    if (!ov.valid) { setErrors({ otp: ov.error! }); return; }
    setLoading(true);
    try {
      const res = await authService.verifyOtp({ email, otp, purpose: "signup" });
      if (res.verified) { setStep("password"); toast.success("Email verified!"); }
      else setErrors({ otp: "Invalid code. Please try again." });
    } catch (e: unknown) { toast.error(e instanceof Error ? e.message : "Failed"); }
    finally { setLoading(false); }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const pe = validatePassword(password); const ce = validateConfirmPassword(password, confirm);
    const errs: Record<string, string> = {};
    if (!pe.valid) errs.password = pe.error!;
    if (!ce.valid) errs.confirm = ce.error!;
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      // 1. Create account via FastAPI
      await authService.signup({ name, email, password, otp });

      // 2. Sign in via NextAuth so the session is populated with apiToken + points
      const result = await signIn("credentials-password", {
        email, password, redirect: false,
      });

      if (result?.ok) {
        toast.success(`Welcome, ${name}! 🎉`, { description: "50 free points added." });
        window.location.href = callbackUrl;
      } else {
        toast.error("Account created but login failed. Please sign in manually.");
      }
    } catch (e: unknown) { toast.error(e instanceof Error ? e.message : "Signup failed"); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      {/* Google — only show on step 1 */}
      {step === "info" && (
        <>
          <GoogleButton loading={googleLoading} onClick={handleGoogle} />
          <Divider />
        </>
      )}

      <div className="flex justify-center">
        <StepIndicator steps={STEPS} current={si[step]} />
      </div>

      {step === "info" && (
        <div className="space-y-5">
          <Field label="Full name" value={name}
            onChange={(v) => { setName(v); setErrors((p) => ({ ...p, name: "" })); }}
            placeholder="Satoshi Nakamoto" required disabled={loading} error={errors.name} />
          <Field label="Email address" type="email" value={email}
            onChange={(v) => { setEmail(v); setErrors((p) => ({ ...p, email: "" })); }}
            placeholder="you@example.com" required disabled={loading} error={errors.email} />
          <PrimaryBtn type="button" loading={loading} onClick={handleSendOtp} disabled={!name || !email}>
            <Mail className="w-4 h-4" /> Continue with email
          </PrimaryBtn>
        </div>
      )}

      {step === "otp" && (
        <div className="space-y-5">
          <div className="text-center space-y-1.5 py-2">
            <div className="w-12 h-12 rounded-2xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center mx-auto mb-3">
              <Mail className="w-6 h-6 text-cyan-400" />
            </div>
            <p className="text-base font-semibold text-foreground">Check your inbox</p>
            <p className="text-sm text-muted-foreground">
              6-digit code sent to <span className="text-foreground font-medium">{email}</span>
            </p>
          </div>
          <OtpInput value={otp} onChange={(v) => { setOtp(v); setErrors((p) => ({ ...p, otp: "" })); }} disabled={loading} />
          {errors.otp && <p className="text-sm text-red-400 text-center">{errors.otp}</p>}
          <div className="text-center text-sm text-muted-foreground">
            {isRunning
              ? <span>Resend in <span className="text-foreground font-mono font-semibold">{seconds}s</span></span>
              : <button type="button" onClick={handleSendOtp} className="text-cyan-400 hover:text-cyan-300 font-semibold">Resend code</button>}
          </div>
          <PrimaryBtn type="button" loading={loading} onClick={handleVerifyOtp} disabled={otp.length < 6}>
            Verify email <ArrowRight className="w-4 h-4" />
          </PrimaryBtn>
          <SecondaryBtn onClick={() => { setStep("info"); setOtp(""); setErrors({}); }}>
            <ArrowLeft className="w-4 h-4" /> Back
          </SecondaryBtn>
        </div>
      )}

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
          <Field label="Create a password" type="password" value={password}
            onChange={(v) => { setPassword(v); setErrors((p) => ({ ...p, password: "" })); }}
            placeholder="Minimum 8 characters" required disabled={loading} error={errors.password} />
          <Field label="Confirm password" type="password" value={confirm}
            onChange={(v) => { setConfirm(v); setErrors((p) => ({ ...p, confirm: "" })); }}
            placeholder="Repeat your password" required disabled={loading} error={errors.confirm} />
          <div className="flex items-center gap-2">
            {[{ label: "8+ chars", ok: password.length >= 8 },
            { label: "Uppercase", ok: /[A-Z]/.test(password) },
            { label: "Number", ok: /[0-9]/.test(password) }].map(({ label, ok }) => (
              <div key={label} className={cn(
                "flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200",
                ok ? "bg-green-400/10 text-green-400 border border-green-400/20"
                  : "bg-white/[0.04] text-muted-foreground border border-white/[0.08]")}>
                {ok && <CheckCircle2 className="w-3 h-3" />}{label}
              </div>
            ))}
          </div>
          <PrimaryBtn loading={loading}>
            Create account <Sparkles className="w-4 h-4" />
          </PrimaryBtn>
        </form>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════
// FORGOT PASSWORD
// ═══════════════════════════════════════════════════

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
  const si: Record<FStep, number> = { email: 0, otp: 1, reset: 2 };

  const sendOtp = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const ev = validateEmail(email);
    if (!ev.valid) { setErrors({ email: ev.error! }); return; }
    setLoading(true);
    try {
      await authService.sendOtp({ email, purpose: "forgot_password" });
      setStep("otp"); start(60); toast.success("Reset code sent");
    } catch (err: unknown) { toast.error(err instanceof Error ? err.message : "Failed"); }
    finally { setLoading(false); }
  };

  const verifyOtp = async () => {
    const ov = validateOtp(otp);
    if (!ov.valid) { setErrors({ otp: ov.error! }); return; }
    setLoading(true);
    try {
      const res = await authService.verifyOtp({ email, otp, purpose: "forgot_password" });
      if (res.verified) setStep("reset"); else setErrors({ otp: "Invalid code." });
    } catch (err: unknown) { toast.error(err instanceof Error ? err.message : "Failed"); }
    finally { setLoading(false); }
  };

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const pe = validatePassword(password); const ce = validateConfirmPassword(password, confirm);
    const errs: Record<string, string> = {};
    if (!pe.valid) errs.password = pe.error!;
    if (!ce.valid) errs.confirm = ce.error!;
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await authService.forgotPassword({ email, otp, new_password: password });
      toast.success("Password reset! Please sign in."); onBack();
    } catch (err: unknown) { toast.error(err instanceof Error ? err.message : "Reset failed"); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <button onClick={onBack}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">
        <ArrowLeft className="w-4 h-4" /> Back to sign in
      </button>
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>Reset password</h2>
        <p className="text-sm text-muted-foreground">
          {step === "email" ? "Enter your email to receive a reset code"
            : step === "otp" ? "Enter the 6-digit code from your email"
              : "Choose a strong new password"}
        </p>
      </div>
      <div className="flex justify-center"><StepIndicator steps={STEPS} current={si[step]} /></div>

      {step === "email" && (
        <form onSubmit={sendOtp} className="space-y-5">
          <Field label="Email address" type="email" value={email}
            onChange={(v) => { setEmail(v); setErrors((p) => ({ ...p, email: "" })); }}
            placeholder="you@example.com" required disabled={loading} error={errors.email} />
          <PrimaryBtn loading={loading}>Send reset code <ArrowRight className="w-4 h-4" /></PrimaryBtn>
        </form>
      )}
      {step === "otp" && (
        <div className="space-y-5">
          <OtpInput value={otp} onChange={(v) => { setOtp(v); setErrors((p) => ({ ...p, otp: "" })); }} disabled={loading} />
          {errors.otp && <p className="text-sm text-red-400 text-center">{errors.otp}</p>}
          <div className="text-center text-sm text-muted-foreground">
            {isRunning
              ? <span>Resend in <span className="font-mono font-semibold text-foreground">{seconds}s</span></span>
              : <button type="button" onClick={() => sendOtp()} className="text-cyan-400 hover:text-cyan-300 font-semibold">Resend</button>}
          </div>
          <PrimaryBtn type="button" loading={loading} onClick={verifyOtp} disabled={otp.length < 6}>
            Verify code <ArrowRight className="w-4 h-4" />
          </PrimaryBtn>
        </div>
      )}
      {step === "reset" && (
        <form onSubmit={resetPassword} className="space-y-5">
          <Field label="New password" type="password" value={password}
            onChange={(v) => { setPassword(v); setErrors((p) => ({ ...p, password: "" })); }}
            placeholder="Minimum 8 characters" required disabled={loading} error={errors.password} />
          <Field label="Confirm new password" type="password" value={confirm}
            onChange={(v) => { setConfirm(v); setErrors((p) => ({ ...p, confirm: "" })); }}
            placeholder="Repeat your new password" required disabled={loading} error={errors.confirm} />
          <PrimaryBtn loading={loading}>Set new password <CheckCircle2 className="w-4 h-4" /></PrimaryBtn>
        </form>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════
// LEFT PANEL
// ═══════════════════════════════════════════════════


export function LeftPanel() {
  const features = [
    {
      icon: TrendingUp,
      color: "text-green-400",
      bg: "bg-green-400/10",
      title: "Clear trade signals",
      desc: "LONG / SHORT / WAIT with confidence score and full reasoning"
    },
    {
      icon: Zap,
      color: "text-cyan-400",
      bg: "bg-cyan-400/10",
      title: "3 strategy modes",
      desc: "Scalper (1m–15m), Swing (1h–1D), Conservative (1D–1W)"
    },
    {
      icon: Shield,
      color: "text-violet-400",
      bg: "bg-violet-400/10",
      title: "Risk-first analysis",
      desc: "Entry, target, and stop-loss prices with every signal"
    }
  ];

  const stats = [
    { value: "25+", label: "Coins" },
    { value: "3", label: "Modes" },
    { value: "< 10s", label: "Analysis" }
  ];

  return (
    <div className="hidden lg:flex flex-col h-full p-10 xl:p-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 shadow-[0_0_20px_rgba(0,212,255,0.4)] group-hover:shadow-[0_0_28px_rgba(0,212,255,0.6)] transition-all duration-300">
            <Zap className="w-5 h-5 text-black" strokeWidth={2.5} />
          </div>
          <span className="text-lg font-bold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
            CryptoAI <span className="bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">Insights</span>
          </span>
        </Link>
        <Link
          href="/"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
        >
          <Home className="w-4 h-4" />
          Home
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center space-y-8 py-8">
        {/* Hero Section */}
        <div className="space-y-3">
          <h2 className="text-4xl xl:text-5xl font-bold leading-[1.1] tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
            Trade smarter with{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
              AI clarity
            </span>
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed max-w-sm">
            Real-time AI-powered crypto analysis. LONG / SHORT / WAIT decisions backed by multi-timeframe data.
          </p>
        </div>

        {/* Offer Card */}
        <div className="relative rounded-2xl border border-cyan-400/25 bg-cyan-400/[0.04] p-5 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/[0.06] rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
          <div className="relative flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-400/30 to-violet-400/20 border border-cyan-400/30 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="space-y-1">
              <p className="text-base font-semibold text-foreground">50 free points on signup</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                5 full AI analyses — completely free. No credit card required.
              </p>
            </div>
          </div>
        </div>

        {/* Features List */}
        <div className="space-y-4">
          {features.map(({ icon: Icon, color, bg, title, desc }) => (
            <div key={title} className="flex items-start gap-4 group">
              <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-all duration-200 group-hover:scale-105", bg)}>
                <Icon className={cn("w-4 h-4 transition-colors", color)} />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{title}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 pt-2 border-t border-white/[0.06]">
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center space-y-0.5">
              <p className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent" style={{ fontFamily: "var(--font-display)" }}>
                {value}
              </p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <p className="text-xs text-muted-foreground/30 text-center">
        Not financial advice. Past results do not guarantee future performance.
      </p>
    </div>
  );
}
// ═══════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════

type AuthView = "login" | "signup" | "forgot";

export default function AuthPage() {
  const router = useRouter();
  const params = useSearchParams();
  const { status } = useSession();
  const [view, setView] = useState<AuthView>("login");
  const [tab, setTab] = useState<"login" | "signup">("login");

  const callbackUrl = params.get("redirect") ?? params.get("callbackUrl") ?? "/dashboard";

  // If already authenticated, redirect away
  useEffect(() => {
    if (status === "authenticated") router.replace(callbackUrl);
  }, [status, router, callbackUrl]);

  // Show error from URL (e.g. ?error=GoogleFailed)
  const urlError = params.get("error");
  useEffect(() => {
    if (urlError) {
      const messages: Record<string, string> = {
        GoogleFailed: "Google sign-in failed. Try again.",
        CredentialsSignin: "Invalid credentials.",
        OAuthAccountNotLinked: "This email is linked to a different sign-in method.",
        Default: "Authentication failed.",
      };
      toast.error(messages[urlError] ?? messages.Default);
    }
  }, [urlError]);

  return (
    <div className="min-h-screen bg-background flex relative">
      <div className="fixed inset-0 bg-grid pointer-events-none opacity-50" />
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-violet-500/[0.05] rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/[0.04] rounded-full blur-[120px] pointer-events-none" />

      {/* Left panel */}
      <div className="hidden lg:block w-[520px] xl:w-[580px] shrink-0 border-r border-white/[0.06] relative">
        <LeftPanel />
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col">
        {/* Mobile top bar */}
        <div className="flex lg:hidden items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center">
              <Zap className="w-4 h-4 text-black" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-base" style={{ fontFamily: "var(--font-display)" }}>
              CryptoAI <span className="gradient-text">Insights</span>
            </span>
          </Link>
          <Link href="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Home className="w-4 h-4" /><span className="hidden sm:block">Home</span>
          </Link>
        </div>

        {/* Form content */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-[440px] animate-fade-in">
            {view === "forgot" ? (
              <ForgotPasswordForm onBack={() => setView("login")} />
            ) : (
              <div className="space-y-7">
                <div className="space-y-1.5">
                  <h1 className="text-3xl font-bold text-foreground tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                    {tab === "login" ? "Welcome back" : "Create your account"}
                  </h1>
                  <p className="text-base text-muted-foreground">
                    {tab === "login"
                      ? "Sign in to access your AI trading insights"
                      : "Start with 50 free points — no card required"}
                  </p>
                </div>

                <div className="flex p-1.5 bg-white/[0.04] rounded-2xl gap-1.5 border border-white/[0.08]">
                  {(["login", "signup"] as const).map((t) => (
                    <button key={t} onClick={() => setTab(t)}
                      className={cn("flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200",
                        tab === t ? "bg-white/[0.1] text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>
                      {t === "login" ? "Sign in" : "Sign up"}
                    </button>
                  ))}
                </div>

                {tab === "login"
                  ? <LoginForm onForgot={() => setView("forgot")} callbackUrl={callbackUrl} />
                  : <SignupForm callbackUrl={callbackUrl} />}

                <p className="text-center text-sm text-muted-foreground">
                  {tab === "login" ? (
                    <>Don&apos;t have an account?{" "}
                      <button onClick={() => setTab("signup")} className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">Sign up free</button>
                    </>
                  ) : (
                    <>Already have an account?{" "}
                      <button onClick={() => setTab("login")} className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">Sign in</button>
                    </>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-white/[0.05] text-xs text-muted-foreground/40">
          <span>© 2024 CryptoAI Insights</span>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-muted-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-muted-foreground transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </div>
  );
}