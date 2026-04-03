"use client";
// Full auth page — see full version in repository
// This file is the entry point; all form logic lives in sub-components below.

import { useState, useEffect, useId } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, CheckCircle2, Eye, EyeOff, Loader2, Mail, Sparkles, Zap } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/services/auth.service";
import { useCountdown } from "@/hooks/useCountdown";
import { validateEmail, validatePassword, validateOtp, validateName, validateConfirmPassword } from "@/lib/validations";

// ─── Primitives ────────────────────────────────────────────────────────────────

function Field({ label, type = "text", value, onChange, placeholder, disabled, required, error }: {
  label: string; type?: string; value: string; onChange: (v: string) => void;
  placeholder?: string; disabled?: boolean; required?: boolean; error?: string;
}) {
  const id = useId();
  const [show, setShow] = useState(false);
  const isPass = type === "password";
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
        {label}{required && <span className="text-red-400">*</span>}
      </label>
      <div className="relative">
        <input id={id} type={isPass ? (show ? "text" : "password") : type} value={value}
          onChange={(e) => onChange(e.target.value)} placeholder={placeholder} disabled={disabled}
          className={cn(
            "w-full px-3.5 py-2.5 rounded-xl border bg-white/[0.03] text-sm text-foreground",
            "placeholder:text-muted-foreground/35 outline-none transition-all duration-200 disabled:opacity-50",
            error ? "border-red-400/50 focus:border-red-400/60 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.08)]"
                  : "border-white/[0.09] focus:border-cyan-400/40 focus:shadow-[0_0_0_3px_rgba(0,212,255,0.06)]",
            isPass && "pr-10"
          )} />
        {isPass && (
          <button type="button" tabIndex={-1} onClick={() => setShow(!show)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground transition-colors">
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error && <p className="text-[11px] text-red-400">{error}</p>}
    </div>
  );
}

function OtpInput({ value, onChange, disabled }: { value: string; onChange: (v: string) => void; disabled?: boolean }) {
  const length = 6;
  const digits = Array.from({ length }, (_, i) => value[i] ?? "");
  const handleChange = (i: number, ch: string) => {
    const d = ch.replace(/\D/g, "").slice(-1);
    const arr = [...digits]; arr[i] = d;
    onChange(arr.join(""));
    if (d && i < length - 1) document.getElementById(`otp-${i + 1}`)?.focus();
  };
  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) document.getElementById(`otp-${i - 1}`)?.focus();
  };
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    onChange(text);
    document.getElementById(`otp-${Math.min(text.length, length - 1)}`)?.focus();
  };
  return (
    <div className="flex gap-2 justify-center">
      {digits.map((d, i) => (
        <input key={i} id={`otp-${i}`} type="text" inputMode="numeric" maxLength={1} value={d} disabled={disabled}
          onChange={(e) => handleChange(i, e.target.value)} onKeyDown={(e) => handleKeyDown(i, e)} onPaste={handlePaste}
          className={cn(
            "w-11 h-12 text-center text-lg font-bold rounded-xl border bg-white/[0.03] text-foreground outline-none transition-all disabled:opacity-50",
            d ? "border-cyan-400/50 bg-cyan-400/5 shadow-[0_0_0_2px_rgba(0,212,255,0.12)]"
              : "border-white/[0.09] focus:border-cyan-400/40 focus:shadow-[0_0_0_2px_rgba(0,212,255,0.08)]"
          )} />
      ))}
    </div>
  );
}

function PrimaryBtn({ loading, disabled, children, onClick, type = "submit" }: {
  loading?: boolean; disabled?: boolean; children: React.ReactNode; onClick?: () => void; type?: "submit" | "button";
}) {
  return (
    <button type={type} disabled={loading || disabled} onClick={onClick}
      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-cyan-400 text-black font-semibold text-sm transition-all duration-200 shadow-[0_0_16px_rgba(0,212,255,0.25)] hover:bg-cyan-300 hover:shadow-[0_0_24px_rgba(0,212,255,0.4)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100">
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : children}
    </button>
  );
}

function StepDots({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className={cn("rounded-full transition-all duration-300",
          i <= current ? "w-4 h-1.5 bg-cyan-400" : "w-1.5 h-1.5 bg-white/[0.12]")} />
      ))}
    </div>
  );
}

// ─── Login ─────────────────────────────────────────────────────────────────────

function LoginForm({ onForgot, onSuccess }: { onForgot: () => void; onSuccess: () => void }) {
  const [method, setMethod]   = useState<"password" | "otp">("password");
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp]         = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors]   = useState<Record<string, string>>({});
  const { login }             = useAuthStore();
  const { seconds, isRunning, start } = useCountdown();

  const handleSendOtp = async () => {
    const ev = validateEmail(email);
    if (!ev.valid) { setErrors({ email: ev.error! }); return; }
    setLoading(true);
    try {
      await authService.sendOtp({ email, purpose: "login" });
      setOtpSent(true); start(60); toast.success("OTP sent");
    } catch (e: unknown) { toast.error(e instanceof Error ? e.message : "Failed"); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    const ev = validateEmail(email);
    if (!ev.valid) errs.email = ev.error!;
    if (method === "password" && !password) errs.password = "Password is required";
    if (method === "otp" && otpSent) { const ov = validateOtp(otp); if (!ov.valid) errs.otp = ov.error!; }
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const res = method === "password"
        ? await authService.loginWithPassword({ email, password })
        : await authService.loginWithOtp({ email, otp });
      login(res.user, res.token, res.points);
      document.cookie = `auth-token=${res.token}; path=/; max-age=${60*60*24*7}; SameSite=Strict`;
      toast.success(`Welcome back, ${res.user.name}!`);
      onSuccess();
    } catch (e: unknown) { toast.error(e instanceof Error ? e.message : "Login failed"); }
    finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex p-1 bg-white/[0.04] rounded-xl gap-1 border border-white/[0.05]">
        {(["password", "otp"] as const).map((m) => (
          <button key={m} type="button" onClick={() => { setMethod(m); setOtpSent(false); setOtp(""); setErrors({}); }}
            className={cn("flex-1 py-2 rounded-lg text-xs font-medium transition-all",
              method === m ? "bg-white/[0.08] text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>
            {m === "password" ? "🔑  Password" : "📱  OTP Login"}
          </button>
        ))}
      </div>

      <Field label="Email" type="email" value={email} onChange={(v) => { setEmail(v); setErrors((p) => ({...p, email:""})); }}
        placeholder="you@example.com" required disabled={loading} error={errors.email} />

      {method === "password" ? (
        <>
          <Field label="Password" type="password" value={password} onChange={(v) => { setPassword(v); setErrors((p) => ({...p, password:""})); }}
            placeholder="Enter your password" required disabled={loading} error={errors.password} />
          <div className="flex justify-end -mt-1">
            <button type="button" onClick={onForgot} className="text-xs text-muted-foreground hover:text-cyan-400 transition-colors">
              Forgot password?
            </button>
          </div>
        </>
      ) : (
        <div className="space-y-3">
          {!otpSent ? (
            <button type="button" onClick={handleSendOtp} disabled={loading || !email}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/[0.09] text-xs font-medium text-muted-foreground hover:text-foreground hover:border-white/[0.18] transition-all disabled:opacity-50">
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Mail className="w-3.5 h-3.5" />} Send OTP
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-center text-muted-foreground">
                Code sent to <span className="text-foreground font-medium">{email}</span>
              </p>
              <OtpInput value={otp} onChange={(v) => { setOtp(v); setErrors((p) => ({...p, otp:""})); }} disabled={loading} />
              {errors.otp && <p className="text-[11px] text-red-400 text-center">{errors.otp}</p>}
              <div className="text-center text-xs text-muted-foreground">
                {isRunning ? <span>Resend in <span className="font-mono text-foreground">{seconds}s</span></span>
                  : <button type="button" onClick={handleSendOtp} className="text-cyan-400 hover:text-cyan-300 font-medium">Resend OTP</button>}
              </div>
            </div>
          )}
        </div>
      )}
      <PrimaryBtn loading={loading}>Sign in</PrimaryBtn>
    </form>
  );
}

// ─── Signup ────────────────────────────────────────────────────────────────────

type SStep = "info" | "otp" | "password";

function SignupForm({ onSuccess }: { onSuccess: () => void }) {
  const [step, setStep]       = useState<SStep>("info");
  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [otp, setOtp]         = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors]   = useState<Record<string, string>>({});
  const { login }             = useAuthStore();
  const { seconds, isRunning, start } = useCountdown();
  const si: Record<SStep, number> = { info: 0, otp: 1, password: 2 };

  const handleSendOtp = async () => {
    const ne = validateName(name); const ee = validateEmail(email);
    const errs: Record<string, string> = {};
    if (!ne.valid) errs.name = ne.error!; if (!ee.valid) errs.email = ee.error!;
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await authService.sendOtp({ email, purpose: "signup" });
      setStep("otp"); start(60); toast.success("Verification code sent!");
    } catch (e: unknown) { toast.error(e instanceof Error ? e.message : "Failed"); }
    finally { setLoading(false); }
  };

  const handleVerifyOtp = async () => {
    const ov = validateOtp(otp); if (!ov.valid) { setErrors({ otp: ov.error! }); return; }
    setLoading(true);
    try {
      const res = await authService.verifyOtp({ email, otp, purpose: "signup" });
      if (res.verified) { setStep("password"); toast.success("Email verified!"); }
      else setErrors({ otp: "Invalid code." });
    } catch (e: unknown) { toast.error(e instanceof Error ? e.message : "Failed"); }
    finally { setLoading(false); }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const pe = validatePassword(password); const ce = validateConfirmPassword(password, confirm);
    const errs: Record<string, string> = {};
    if (!pe.valid) errs.password = pe.error!; if (!ce.valid) errs.confirm = ce.error!;
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const res = await authService.signup({ name, email, password, otp });
      login(res.user, res.token, res.points);
      document.cookie = `auth-token=${res.token}; path=/; max-age=${60*60*24*7}; SameSite=Strict`;
      toast.success(`Welcome, ${res.user.name}! 🎉`, { description: "50 free points added." });
      onSuccess();
    } catch (e: unknown) { toast.error(e instanceof Error ? e.message : "Signup failed"); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-5">
      <StepDots total={3} current={si[step]} />
      {step === "info" && (
        <div className="space-y-4">
          <Field label="Full Name" value={name} onChange={(v) => { setName(v); setErrors((p) => ({...p,name:""})); }}
            placeholder="Satoshi Nakamoto" required disabled={loading} error={errors.name} />
          <Field label="Email" type="email" value={email} onChange={(v) => { setEmail(v); setErrors((p) => ({...p,email:""})); }}
            placeholder="you@example.com" required disabled={loading} error={errors.email} />
          <PrimaryBtn type="button" loading={loading} onClick={handleSendOtp} disabled={!name||!email}>
            <Mail className="w-4 h-4" /> Send verification code
          </PrimaryBtn>
        </div>
      )}
      {step === "otp" && (
        <div className="space-y-4">
          <p className="text-xs text-center text-muted-foreground">
            Code sent to <span className="text-foreground font-medium">{email}</span>
          </p>
          <OtpInput value={otp} onChange={(v) => { setOtp(v); setErrors((p) => ({...p,otp:""})); }} disabled={loading} />
          {errors.otp && <p className="text-[11px] text-red-400 text-center">{errors.otp}</p>}
          <div className="text-center text-xs text-muted-foreground">
            {isRunning ? <span>Resend in <span className="font-mono text-foreground">{seconds}s</span></span>
              : <button type="button" onClick={handleSendOtp} className="text-cyan-400 hover:text-cyan-300 font-medium">Resend</button>}
          </div>
          <PrimaryBtn type="button" loading={loading} onClick={handleVerifyOtp} disabled={otp.length<6}>Verify email</PrimaryBtn>
          <button type="button" onClick={() => { setStep("info"); setOtp(""); setErrors({}); }}
            className="w-full flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>
        </div>
      )}
      {step === "password" && (
        <form onSubmit={handleSignup} className="space-y-4">
          <div className="flex items-center gap-2 p-3 rounded-xl bg-green-400/5 border border-green-400/20">
            <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
            <p className="text-xs text-green-400 font-medium">Email verified: {email}</p>
          </div>
          <Field label="Password" type="password" value={password} onChange={(v) => { setPassword(v); setErrors((p) => ({...p,password:""})); }}
            placeholder="Min. 8 chars, 1 uppercase, 1 number" required disabled={loading} error={errors.password} />
          <Field label="Confirm Password" type="password" value={confirm} onChange={(v) => { setConfirm(v); setErrors((p) => ({...p,confirm:""})); }}
            placeholder="Repeat your password" required disabled={loading} error={errors.confirm} />
          <div className="grid grid-cols-3 gap-1.5">
            {[{label:"8+ chars",ok:password.length>=8},{label:"Uppercase",ok:/[A-Z]/.test(password)},{label:"Number",ok:/[0-9]/.test(password)}].map(({label,ok})=>(
              <div key={label} className={cn("flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium transition-all",
                ok ? "bg-green-400/10 text-green-400" : "bg-white/[0.04] text-muted-foreground")}>
                <div className={cn("w-1 h-1 rounded-full", ok ? "bg-green-400":"bg-white/[0.15]")} />{label}
              </div>
            ))}
          </div>
          <PrimaryBtn loading={loading}>Create account</PrimaryBtn>
        </form>
      )}
    </div>
  );
}

// ─── Forgot Password ────────────────────────────────────────────────────────────

type FStep = "email" | "otp" | "reset";
function ForgotPasswordForm({ onBack }: { onBack: () => void }) {
  const [step, setStep]         = useState<FStep>("email");
  const [email, setEmail]       = useState("");
  const [otp, setOtp]           = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [loading, setLoading]   = useState(false);
  const [errors, setErrors]     = useState<Record<string, string>>({});
  const { seconds, isRunning, start } = useCountdown();
  const si: Record<FStep, number> = { email: 0, otp: 1, reset: 2 };

  const sendOtp = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const ev = validateEmail(email); if (!ev.valid) { setErrors({ email: ev.error! }); return; }
    setLoading(true);
    try {
      await authService.sendOtp({ email, purpose: "forgot_password" });
      setStep("otp"); start(60); toast.success("Reset code sent");
    } catch (err: unknown) { toast.error(err instanceof Error ? err.message : "Failed"); }
    finally { setLoading(false); }
  };

  const verifyOtp = async () => {
    const ov = validateOtp(otp); if (!ov.valid) { setErrors({ otp: ov.error! }); return; }
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
    if (!pe.valid) errs.password = pe.error!; if (!ce.valid) errs.confirm = ce.error!;
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await authService.forgotPassword({ email, otp, new_password: password });
      toast.success("Password reset! Please sign in."); onBack();
    } catch (err: unknown) { toast.error(err instanceof Error ? err.message : "Reset failed"); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-5">
      <button onClick={onBack} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
      </button>
      <div>
        <h3 className="text-base font-semibold text-foreground" style={{ fontFamily: "var(--font-display)" }}>Reset password</h3>
        <p className="text-xs text-muted-foreground mt-1">
          {step==="email" ? "Enter your email for a reset code" : step==="otp" ? "Enter the code we sent" : "Set your new password"}
        </p>
      </div>
      <StepDots total={3} current={si[step]} />
      {step === "email" && (
        <form onSubmit={sendOtp} className="space-y-4">
          <Field label="Email" type="email" value={email} onChange={(v) => { setEmail(v); setErrors((p)=>({...p,email:""})); }}
            placeholder="you@example.com" required disabled={loading} error={errors.email} />
          <PrimaryBtn loading={loading}>Send reset code</PrimaryBtn>
        </form>
      )}
      {step === "otp" && (
        <div className="space-y-4">
          <OtpInput value={otp} onChange={(v)=>{ setOtp(v); setErrors((p)=>({...p,otp:""})); }} disabled={loading} />
          {errors.otp && <p className="text-[11px] text-red-400 text-center">{errors.otp}</p>}
          <div className="text-center text-xs text-muted-foreground">
            {isRunning ? <span>Resend in <span className="font-mono text-foreground">{seconds}s</span></span>
              : <button type="button" onClick={()=>sendOtp()} className="text-cyan-400 hover:text-cyan-300 font-medium">Resend</button>}
          </div>
          <PrimaryBtn type="button" loading={loading} onClick={verifyOtp} disabled={otp.length<6}>Verify code</PrimaryBtn>
        </div>
      )}
      {step === "reset" && (
        <form onSubmit={resetPassword} className="space-y-4">
          <Field label="New Password" type="password" value={password} onChange={(v)=>{ setPassword(v); setErrors((p)=>({...p,password:""})); }}
            placeholder="Min. 8 chars, 1 uppercase, 1 number" required disabled={loading} error={errors.password} />
          <Field label="Confirm Password" type="password" value={confirm} onChange={(v)=>{ setConfirm(v); setErrors((p)=>({...p,confirm:""})); }}
            placeholder="Repeat new password" required disabled={loading} error={errors.confirm} />
          <PrimaryBtn loading={loading}>Reset password</PrimaryBtn>
        </form>
      )}
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

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
    <div className="min-h-screen bg-background flex relative overflow-hidden">
      <div className="fixed inset-0 bg-grid pointer-events-none opacity-60" />
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-violet-500/[0.04] rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/[0.04] rounded-full blur-[100px] pointer-events-none" />

      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] shrink-0 p-10 border-r border-white/[0.05]">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center shadow-[0_0_16px_rgba(0,212,255,0.4)]">
            <Zap className="w-4 h-4 text-black" strokeWidth={2.5} />
          </div>
          <span className="font-bold" style={{ fontFamily: "var(--font-display)" }}>CryptoAI <span className="gradient-text">Insights</span></span>
        </Link>
        <div className="space-y-5">
          <div className="glass rounded-2xl p-5 border border-cyan-400/20 bg-cyan-400/[0.03]">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-400/15 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground mb-1">50 free points on signup</p>
                <p className="text-xs text-muted-foreground leading-relaxed">5 free AI analyses, no card required.</p>
              </div>
            </div>
          </div>
          {[
            { icon: "⚡", text: "Real-time AI analysis in seconds" },
            { icon: "📊", text: "LONG / SHORT / WAIT decisions" },
            { icon: "🎯", text: "3 modes: Scalper, Swing, Conservative" },
            { icon: "🔒", text: "Secure JWT auth, your data stays yours" },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="text-base w-5 shrink-0">{icon}</span>{text}
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground/30">Not financial advice. Trade responsibly.</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-[380px] space-y-6 animate-fade-in">
          <div className="flex lg:hidden items-center justify-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center">
              <Zap className="w-4 h-4 text-black" />
            </div>
            <span className="font-bold text-lg" style={{ fontFamily: "var(--font-display)" }}>CryptoAI <span className="gradient-text">Insights</span></span>
          </div>
          {view === "forgot" ? (
            <ForgotPasswordForm onBack={() => setView("login")} />
          ) : (
            <>
              <div>
                <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
                  {tab === "login" ? "Welcome back" : "Create account"}
                </h1>
                <p className="text-xs text-muted-foreground mt-1">
                  {tab === "login" ? "Sign in to continue" : "Join thousands of traders using AI insights"}
                </p>
              </div>
              <div className="flex p-1 bg-white/[0.03] rounded-xl gap-1 border border-white/[0.06]">
                {(["login","signup"] as const).map((t) => (
                  <button key={t} onClick={() => setTab(t)}
                    className={cn("flex-1 py-2 rounded-lg text-xs font-medium transition-all",
                      tab === t ? "bg-white/[0.08] text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>
                    {t === "login" ? "Sign in" : "Sign up"}
                  </button>
                ))}
              </div>
              {tab === "login"
                ? <LoginForm onForgot={() => setView("forgot")} onSuccess={handleSuccess} />
                : <SignupForm onSuccess={handleSuccess} />}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
