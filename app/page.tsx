import Link from "next/link";
import {
  ArrowRight,
  BarChart2,
  Brain,
  CheckCircle2,
  ChevronRight,
  Clock,
  Shield,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* ── Background effects ──────────────────────────────────────────────── */}
      <div className="fixed inset-0 bg-grid opacity-100 pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-mesh pointer-events-none" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-cyan-500/[0.04] rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed top-20 right-1/4 w-[400px] h-[400px] bg-violet-500/[0.05] rounded-full blur-[100px] pointer-events-none" />

      {/* ── Navbar ──────────────────────────────────────────────────────────── */}
      <header className="relative z-10 flex items-center justify-between px-6 lg:px-12 h-16 border-b border-white/[0.05]">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 shadow-[0_0_16px_rgba(0,212,255,0.4)]">
            <Zap className="w-4 h-4 text-black" strokeWidth={2.5} />
          </div>
          <span
            className="text-base font-bold"
            style={{ fontFamily: "var(--font-display)" }}
          >
            CryptoAI <span className="gradient-text">Insights</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-foreground transition-colors">How it works</a>
          <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/auth"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/auth"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-400 text-black text-sm font-semibold hover:bg-cyan-300 transition-all shadow-[0_0_16px_rgba(0,212,255,0.3)] hover:shadow-[0_0_24px_rgba(0,212,255,0.5)] hover:scale-105"
          >
            Get Started
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
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

          {/* CTA */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in"
            style={{ animationDelay: "0.3s" }}
          >
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
          </div>

          {/* Social proof */}
          <p
            className="mt-8 text-xs text-muted-foreground/50 animate-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            50 free analysis points on signup · No credit card required
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
                <h3 className="text-md font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
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
            <p className="text-sm text-violet-400 font-semibold uppercase tracking-widest mb-3">
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
                    className="text-md font-bold gradient-text"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {i + 1}
                  </span>
                </div>
                <div>
                  <h3 className="text-md font-semibold text-foreground mb-1">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
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

      {/* ═══════════════════════════════════════════════════════════════════════
          CTA SECTION
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-xl mx-auto text-center">
          <div className="glass rounded-3xl p-10 border border-white/[0.08] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.04] to-violet-500/[0.04]" />
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center mx-auto mb-5 shadow-[0_0_20px_rgba(0,212,255,0.4)]">
                <Brain className="w-6 h-6 text-black" />
              </div>
              <h2
                className="text-3xl font-bold mb-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Start trading smarter today
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                Join traders using AI-powered analysis to make better decisions.
                Free to start.
              </p>
              <Link
                href="/auth"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-400 text-black font-semibold text-sm hover:bg-cyan-300 transition-all shadow-[0_0_20px_rgba(0,212,255,0.3)] hover:shadow-[0_0_30px_rgba(0,212,255,0.5)] hover:scale-105"
              >
                <Sparkles className="w-4 h-4" />
                Get started free
                <ArrowRight className="w-4 h-4" />
              </Link>
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

const LATENCY_SECTION = {
  title: "Stop Trading on Delayed Signals",
  description:
    "Most AI trading platforms analyze outdated snapshots of the market. By the time their signals reach you, the opportunity is already fading—leaving you stuck chasing price instead of leading it.",
  solution:
    "Our platform delivers ultra-fast, real-time analysis so you get signals when they matter most—right at the moment of opportunity.",
};
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
