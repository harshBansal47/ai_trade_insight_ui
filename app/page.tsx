"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import {
  ArrowRight,
  BarChart2,
  Brain,
  CheckCircle2,
  ChevronRight,
  Clock,
  LayoutDashboard,
  LogOut,
  Menu,
  Shield,
  Sparkles,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "#features",     label: "Features"     },
  { href: "#how-it-works", label: "How it works" },
  { href: "#pricing",      label: "Pricing"      },
];

// ── User menu (shown when signed in) ─────────────────────────────────────────

function UserMenu() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  const user   = session?.user;
  const points = session?.points ?? 0;
  const initial = user?.name?.charAt(0)?.toUpperCase() ?? "U";

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-xl hover:bg-white/[0.06] transition-all duration-200 group"
      >
        {/* Avatar */}
        {user?.image ? (
          <img
            src={user.image}
            alt={user.name ?? ""}
            className="w-7 h-7 rounded-full object-cover ring-1 ring-white/[0.12]"
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center text-[11px] font-bold text-black shrink-0">
            {initial}
          </div>
        )}

        {/* Name + points (desktop) */}
        <div className="hidden sm:flex flex-col items-start leading-none gap-0.5">
          <span className="text-xs font-semibold text-foreground max-w-[80px] truncate">
            {user?.name ?? "User"}
          </span>
          <span className="text-[10px] text-cyan-400 font-medium">
            {points} pts
          </span>
        </div>

        <ChevronRight
          className={cn(
            "hidden sm:block w-3.5 h-3.5 text-muted-foreground/50 transition-transform duration-200",
            open && "rotate-90"
          )}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-56 glass rounded-2xl border border-white/[0.1] shadow-2xl z-50 overflow-hidden animate-fade-in">
            {/* Profile header */}
            <div className="px-4 py-4 border-b border-white/[0.07]">
              <div className="flex items-center gap-3">
                {user?.image ? (
                  <img
                    src={user.image}
                    alt={user.name ?? ""}
                    className="w-9 h-9 rounded-xl object-cover ring-1 ring-white/[0.12]"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center text-sm font-bold text-black shrink-0">
                    {initial}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {user?.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.email}
                  </p>
                </div>
              </div>

              {/* Points bar */}
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-xs font-semibold text-cyan-400">
                    {points} points
                  </span>
                </div>
                <Link
                  href="/pricing"
                  onClick={() => setOpen(false)}
                  className="text-[10px] text-muted-foreground hover:text-cyan-400 transition-colors"
                >
                  Buy more →
                </Link>
              </div>
            </div>

            {/* Menu actions */}
            <div className="py-1.5">
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-white/[0.05] transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" />
                Go to Dashboard
              </Link>
            </div>

            <div className="border-t border-white/[0.07] py-1.5">
              <button
                onClick={() => { setOpen(false); signOut({ callbackUrl: "/" }); }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:bg-red-400/[0.06] transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ── Navbar right side — switches based on session ─────────────────────────────

function NavRight({ onMenuToggle }: { onMenuToggle: () => void }) {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const isLoading       = status === "loading";

  return (
    <div className="flex items-center gap-2.5">
      {isLoading ? (
        /* Skeleton while session loads — prevents layout shift */
        <div className="w-24 h-8 rounded-xl bg-white/[0.05] animate-pulse" />
      ) : isAuthenticated ? (
        /* ── Signed-in state ─────────────────────────────────── */
        <>
          <Link
            href="/dashboard"
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-400 text-black text-sm font-semibold hover:bg-cyan-300 transition-all shadow-[0_0_16px_rgba(0,212,255,0.3)] hover:shadow-[0_0_24px_rgba(0,212,255,0.5)] hover:scale-105 active:scale-95"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            Dashboard
          </Link>
          <UserMenu />
        </>
      ) : (
        /* ── Signed-out state ────────────────────────────────── */
        <>
          <Link
            href="/auth"
            className="hidden sm:block text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            Sign in
          </Link>
          <Link
            href="/auth"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-400 text-black text-sm font-semibold hover:bg-cyan-300 transition-all shadow-[0_0_16px_rgba(0,212,255,0.3)] hover:shadow-[0_0_24px_rgba(0,212,255,0.5)] hover:scale-105 active:scale-95"
          >
            Get Started
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </>
      )}

      {/* Hamburger — always shown on mobile */}
      <button
        type="button"
        onClick={onMenuToggle}
        className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center border border-white/[0.1] bg-white/[0.04] hover:bg-white/[0.08] text-muted-foreground hover:text-foreground transition-all"
      >
        <Menu className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function LandingPage() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* ── Background effects ──────────────────────────────────────────────── */}
      <div className="fixed inset-0 bg-grid opacity-100 pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-mesh pointer-events-none" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-cyan-500/[0.04] rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed top-20 right-1/4 w-[400px] h-[400px] bg-violet-500/[0.05] rounded-full blur-[100px] pointer-events-none" />

      {/* ── Navbar ──────────────────────────────────────────────────────────── */}
      <header className="relative z-20">
        <div className="flex items-center justify-between px-5 lg:px-12 h-16 border-b border-white/[0.06] bg-[hsl(220_20%_6%/0.7)] backdrop-blur-md">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 shadow-[0_0_16px_rgba(0,212,255,0.4)]">
              <Zap className="w-4 h-4 text-black" strokeWidth={2.5} />
            </div>
            <span className="text-base font-bold" style={{ fontFamily: "var(--font-display)" }}>
              CryptoAI <span className="gradient-text">Insights</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ href, label }) => (
              <a key={href} href={href}
                className="px-3.5 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-white/[0.05] transition-all duration-200">
                {label}
              </a>
            ))}
          </nav>

          {/* Right side — session-aware */}
          <NavRight onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
        </div>

        {/* Mobile drawer */}
        {mobileMenuOpen && (
          <>
            <div className="fixed inset-0 top-16 bg-black/40 backdrop-blur-sm z-10"
              onClick={() => setMobileMenuOpen(false)} />
            <div className="absolute top-full left-0 right-0 z-20 bg-[hsl(220_18%_8%)] border-b border-white/[0.08] animate-fade-in shadow-2xl">
              <nav className="flex flex-col px-4 py-3 gap-1">
                {NAV_LINKS.map(({ href, label }) => (
                  <a key={href} href={href} onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center px-4 py-3 rounded-xl text-base text-muted-foreground hover:text-foreground hover:bg-white/[0.05] transition-all">
                    {label}
                  </a>
                ))}

                <div className="h-px bg-white/[0.07] my-1" />

                {isAuthenticated ? (
                  /* Signed-in mobile drawer */
                  <>
                    {/* Mini profile card */}
                    <div className="flex items-center gap-3 px-4 py-3">
                      {session?.user?.image ? (
                        <img src={session.user.image} alt="" className="w-9 h-9 rounded-xl object-cover" />
                      ) : (
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center text-sm font-bold text-black shrink-0">
                          {session?.user?.name?.charAt(0)?.toUpperCase() ?? "U"}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {session?.user?.name}
                        </p>
                        <p className="text-xs text-cyan-400 font-medium">
                          {session?.points ?? 0} points
                        </p>
                      </div>
                    </div>

                    <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-base text-muted-foreground hover:text-foreground hover:bg-white/[0.05] transition-all">
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>

                    <button
                      onClick={() => { setMobileMenuOpen(false); signOut({ callbackUrl: "/" }); }}
                      className="w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-base text-red-400 hover:bg-red-400/[0.06] transition-all">
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </button>
                  </>
                ) : (
                  /* Signed-out mobile drawer */
                  <Link href="/auth" onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center px-4 py-3 rounded-xl text-base text-muted-foreground hover:text-foreground hover:bg-white/[0.05] transition-all">
                    Sign in
                  </Link>
                )}
              </nav>
            </div>
          </>
        )}
      </header>

      {/* ═══════════════════════════════════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 pt-24 pb-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-400/20 bg-cyan-400/5 mb-8 animate-fade-in">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs text-cyan-400 font-medium">
              AI-Powered · Real-time · Multi-mode
            </span>
          </div>

          {/* Headline */}
          <h1
            className="text-5xl lg:text-7xl font-bold tracking-tight mb-6 animate-fade-in leading-[1.05]"
            style={{ fontFamily: "var(--font-display)", animationDelay: "0.1s" }}
          >
            Trade with{" "}
            <span className="gradient-text text-glow-cyan">AI clarity.</span>
            <br />
            Not noise.
          </h1>

          <p
            className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in leading-relaxed"
            style={{ animationDelay: "0.2s" }}
          >
            Get structured{" "}
            <span className="text-foreground font-medium">LONG / SHORT / WAIT</span>{" "}
            decisions powered by real-time market data and AI reasoning. Built
            for scalpers, swing traders, and conservative investors.
          </p>

          {/* CTA — session-aware */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in"
            style={{ animationDelay: "0.3s" }}
          >
            {isAuthenticated ? (
              /* ── Returning user ──────────────────────────── */
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-cyan-400 text-black font-semibold text-sm hover:bg-cyan-300 transition-all shadow-[0_0_24px_rgba(0,212,255,0.4)] hover:shadow-[0_0_32px_rgba(0,212,255,0.6)] hover:scale-105 active:scale-95"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#features"
                  className="flex items-center gap-2 px-6 py-3.5 rounded-xl border border-white/[0.1] text-muted-foreground text-sm hover:text-foreground hover:border-white/[0.2] transition-all hover:bg-white/[0.03]"
                >
                  Explore features
                </a>
              </>
            ) : (
              /* ── New visitor ─────────────────────────────── */
              <>
                <Link
                  href="/auth"
                  className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-cyan-400 text-black font-semibold text-sm hover:bg-cyan-300 transition-all shadow-[0_0_24px_rgba(0,212,255,0.4)] hover:shadow-[0_0_32px_rgba(0,212,255,0.6)] hover:scale-105 active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  Start for free
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#how-it-works"
                  className="flex items-center gap-2 px-6 py-3.5 rounded-xl border border-white/[0.1] text-muted-foreground text-sm hover:text-foreground hover:border-white/[0.2] transition-all hover:bg-white/[0.03]"
                >
                  See how it works
                </a>
              </>
            )}
          </div>

          {/* Social proof — hide "no credit card" note if already signed in */}
          <p
            className="mt-8 text-xs text-muted-foreground/50 animate-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            {isAuthenticated
              ? `Welcome back, ${session?.user?.name?.split(" ")[0]} · ${session?.points ?? 0} points available`
              : "50 free analysis points on signup · No credit card required"}
          </p>
        </div>

        {/* ── Mock dashboard preview ───────────────────────── */}
        <div
          className="relative max-w-3xl mx-auto mt-16 animate-fade-in"
          style={{ animationDelay: "0.5s" }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background z-10 pointer-events-none" />
          <div className="glass rounded-2xl border border-white/[0.08] overflow-hidden shadow-2xl">
            {/* Mock top bar */}
            <div className="h-10 border-b border-white/[0.06] flex items-center px-4 gap-2">
              <div className="flex gap-1.5">
                {["bg-red-500", "bg-yellow-500", "bg-green-500"].map((c) => (
                  <div key={c} className={`w-2.5 h-2.5 rounded-full ${c} opacity-60`} />
                ))}
              </div>
              <div className="flex-1 flex items-center justify-center">
                <div className="h-4 w-40 shimmer rounded-md" />
              </div>
            </div>

            {/* Mock content */}
            <div className="p-5 space-y-4">
              <div className="flex gap-3">
                <div className="flex-1 h-10 shimmer rounded-xl" />
                <div className="w-28 h-10 shimmer rounded-xl" />
              </div>
              <div className="h-20 shimmer rounded-xl" />
              <div className="grid grid-cols-3 gap-2">
                {["LONG", "SHORT", "WAIT"].map((action, i) => (
                  <div
                    key={action}
                    className={`p-4 rounded-xl glass border ${
                      i === 0
                        ? "border-green-400/30 bg-green-400/5"
                        : i === 1
                        ? "border-red-400/30 bg-red-400/5"
                        : "border-yellow-400/30 bg-yellow-400/5"
                    }`}
                  >
                    <div
                      className={`text-lg font-bold ${
                        i === 0
                          ? "text-green-400"
                          : i === 1
                          ? "text-red-400"
                          : "text-yellow-400"
                      }`}
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {action}
                    </div>
                    <div className="h-2 w-16 shimmer rounded mt-2" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          FEATURES SECTION
      ══════════════════════════════════════════════════════════════════════════ */}
      <section id="features" className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs text-cyan-400 font-semibold uppercase tracking-widest mb-3">
              Features
            </p>
            <h2
              className="text-4xl font-bold tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Everything you need to trade smarter
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((feature, i) => (
              <div
                key={feature.title}
                className="glass rounded-2xl p-6 border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 group"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${feature.iconBg}`}
                >
                  <feature.icon className={`w-5 h-5 ${feature.iconColor}`} />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════════════════════════════════════ */}
      <section id="how-it-works" className="relative z-10 py-24 px-6 border-y border-white/[0.04]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs text-violet-400 font-semibold uppercase tracking-widest mb-3">
              How it works
            </p>
            <h2
              className="text-4xl font-bold tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              From input to insight in seconds
            </h2>
          </div>

          <div className="space-y-4">
            {HOW_IT_WORKS.map((step, i) => (
              <div
                key={step.title}
                className="flex items-start gap-5 p-5 glass rounded-2xl border border-white/[0.06]"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-xl glass-strong border border-white/[0.1] flex items-center justify-center">
                  <span
                    className="text-sm font-bold gradient-text"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {i + 1}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">
                    {step.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          PRICING SECTION
      ══════════════════════════════════════════════════════════════════════════ */}
      <section id="pricing" className="relative z-10 py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs text-green-400 font-semibold uppercase tracking-widest mb-3">
              Pricing
            </p>
            <h2
              className="text-4xl font-bold tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Simple, transparent pricing
            </h2>
            <p className="text-muted-foreground text-sm mt-4">
              Pay only for what you use. No subscriptions, no hidden fees.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {PRICING_PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`relative glass rounded-2xl p-6 border transition-all ${
                  plan.popular
                    ? "border-cyan-400/40 shadow-[0_0_30px_rgba(0,212,255,0.1)]"
                    : "border-white/[0.08]"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="text-[10px] font-semibold px-3 py-1 rounded-full bg-cyan-400 text-black">
                      MOST POPULAR
                    </span>
                  </div>
                )}
                <div className="text-center space-y-1 mb-4">
                  <p className="text-xs text-muted-foreground">{plan.name}</p>
                  <p
                    className="text-3xl font-bold"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    ${plan.price}
                  </p>
                  <p className="text-xs text-cyan-400 font-semibold">
                    {plan.points} points
                  </p>
                </div>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-muted-foreground mt-8">
            🎁 New accounts receive{" "}
            <span className="text-cyan-400 font-semibold">50 free points</span>{" "}
            — that&apos;s 5 analyses completely free.
          </p>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-xl mx-auto text-center">
          <div className="glass rounded-3xl p-10 border border-white/[0.08] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.04] to-violet-500/[0.04]" />
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center mx-auto mb-5 shadow-[0_0_20px_rgba(0,212,255,0.4)]">
                <Brain className="w-6 h-6 text-black" />
              </div>
              {isAuthenticated ? (
                <>
                  <h2 className="text-3xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>
                    Ready to analyze?
                  </h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    You have{" "}
                    <span className="text-cyan-400 font-semibold">{session?.points ?? 0} points</span>{" "}
                    available &mdash; that&apos;s{" "}
                    <span className="text-foreground font-medium">{Math.floor((session?.points ?? 0) / 10)} analyses.</span>
                  </p>
                  <Link href="/dashboard"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-400 text-black font-semibold text-sm hover:bg-cyan-300 transition-all shadow-[0_0_20px_rgba(0,212,255,0.3)] hover:shadow-[0_0_30px_rgba(0,212,255,0.5)] hover:scale-105">
                    <LayoutDashboard className="w-4 h-4" />
                    Open Dashboard
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </>
              ) : (
                <>
                  <h2 className="text-3xl font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>
                    Start trading smarter today
                  </h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    Join traders using AI-powered analysis to make better decisions. Free to start.
                  </p>
                  <Link href="/auth"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-400 text-black font-semibold text-sm hover:bg-cyan-300 transition-all shadow-[0_0_20px_rgba(0,212,255,0.3)] hover:shadow-[0_0_30px_rgba(0,212,255,0.5)] hover:scale-105">
                    <Sparkles className="w-4 h-4" />
                    Get started free
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="relative z-10 py-8 px-6 border-t border-white/[0.04]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center">
              <Zap className="w-3 h-3 text-black" />
            </div>
            <span className="text-xs text-muted-foreground">
              CryptoAI Insights
            </span>
          </div>
          <p className="text-xs text-muted-foreground/40">
            © 2024 CryptoAI Insights. Not financial advice.
          </p>
        </div>
      </footer>
    </div>
  );
}

// ── Data ──────────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: Brain,
    iconBg: "bg-violet-400/10",
    iconColor: "text-violet-400",
    title: "No More Guesswork",
    description:
      "Most AI tools overwhelm you with indicators and unclear signals. We simplify everything into clear LONG, SHORT, or WAIT decisions—so you can act with confidence, not confusion.",
  },
  {
    icon: Zap,
    iconBg: "bg-cyan-400/10",
    iconColor: "text-cyan-400",
    title: "Speed That Gives You an Edge",
    description:
      "Delayed signals cost profits. Our system delivers insights in real time, helping you enter trades at the right moment—not after the move has already started.",
  },
  {
    icon: BarChart2,
    iconBg: "bg-orange-400/10",
    iconColor: "text-orange-400",
    title: "Built for Real Trading Styles",
    description:
      "Generic strategies don’t work for everyone. Whether you trade fast moves, ride trends, or play it safe—adapt your strategy to match how you actually trade.",
  },
  {
    icon: Shield,
    iconBg: "bg-green-400/10",
    iconColor: "text-green-400",
    title: "Clarity in Every Trade",
    description:
      "Many platforms leave you guessing your risk. We give you clear entry, target, and stop-loss levels—so every decision is structured and controlled.",
  },
  {
    icon: Clock,
    iconBg: "bg-blue-400/10",
    iconColor: "text-blue-400",
    title: "Learn From Every Move",
    description:
      "Most tools don’t help you improve. Track past signals, review outcomes, and build a smarter trading approach over time.",
  },
  {
    icon: TrendingUp,
    iconBg: "bg-pink-400/10",
    iconColor: "text-pink-400",
    title: "Never Miss Opportunities",
    description:
      "Opportunities don’t wait. Stay on top of the market with coverage across major cryptocurrencies—so you’re always ready to act.",
  },
];
const HOW_IT_WORKS = [
  {
    title: "Pick your market",
    description:
      "Choose the cryptocurrency you want to trade and the strategy that fits your style—fast, balanced, or risk-conscious.",
  },
  {
    title: "Let the system do the heavy lifting",
    description:
      "Instead of manually analyzing charts and indicators, the platform instantly evaluates market conditions for you.",
  },
  {
    title: "Get real-time trade signals",
    description:
      "Receive clear, actionable decisions at the moment they matter—so you can enter with confidence, not hesitation.",
  },
  {
    title: "Execute with clarity",
    description:
      "Every signal comes with defined levels and direction, helping you trade with structure, discipline, and control.",
  },
];


const PRICING_PLANS = [
  {
    name: "Starter",
    price: 5,
    points: 50,
    popular: false,
    features: ["5 analyses"],
  },
  {
    name: "Pro",
    price: 12,
    points: 150,
    popular: true,
    features: ["15 analyses"],
  },
  {
    name: "Elite",
    price: 35,
    points: 500,
    popular: false,
    features: [
      "50 analyses"
    ],
  },
];
