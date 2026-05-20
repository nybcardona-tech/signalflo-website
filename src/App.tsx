import {
  Activity,
  ArrowRight,
  Bot,
  Check,
  CircleDollarSign,
  Cpu,
  FileClock,
  LockKeyhole,
  Menu,
  MonitorSmartphone,
  RadioTower,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Target,
  TrendingUp,
  Workflow,
} from "lucide-react"
import { useEffect, useState } from "react"
import type { ComponentType, ReactNode } from "react"
import { motion } from "motion/react"
import { AnimatedGradientText } from "@/components/magic/animated-gradient-text"
import { BorderBeam } from "@/components/magic/border-beam"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { cn } from "@/lib/utils"

const APP_URL = "https://signal-flo-ai.vercel.app"

const alertCards = [
  { ticker: "NVDA", direction: "Bullish", confidence: "94%", entry: "$924.20", tp: "$952.80", sl: "$908.40", status: "Live" },
  { ticker: "SPY 525C", direction: "Bullish", confidence: "88%", entry: "$3.20", tp: "$4.10", sl: "$2.65", status: "Watching" },
  { ticker: "TSLA", direction: "Bearish", confidence: "81%", entry: "$178.30", tp: "$171.50", sl: "$182.90", status: "Alert" },
  { ticker: "MSFT", direction: "Bullish", confidence: "86%", entry: "$421.10", tp: "$431.40", sl: "$416.20", status: "Live" },
]

const heroAlerts = [
  { ticker: "NVDA", asset: "Stock", direction: "Long", score: 94, entry: "$924.20", target: "$952.80", stop: "$908.40", status: "Active", time: "2m ago" },
  { ticker: "SPY 525C", asset: "Option", direction: "Call", score: 88, entry: "$3.20", target: "$4.10", stop: "$2.65", status: "Watching", time: "5m ago" },
  { ticker: "TSLA", asset: "Stock", direction: "Breakout", score: 81, entry: "$178.30", target: "$171.50", stop: "$182.90", status: "Triggered", time: "8m ago" },
  { ticker: "MSFT", asset: "Stock", direction: "Long", score: 86, entry: "$421.10", target: "$431.40", stop: "$416.20", status: "Active", time: "12m ago" },
]

const cardSurfaceClass =
  "group relative h-full overflow-hidden rounded-xl border border-blue-300/10 bg-[#080d20]/92 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_18px_50px_rgba(2,8,23,0.36)] transition-all duration-300 hover:border-cyan-300/28 hover:bg-[#0a1226] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_20px_70px_rgba(14,165,233,0.12)]"

const features = [
  { title: "AI-Ranked Alerts", icon: Bot, copy: "Signals are organized by confidence, trade setup quality, and market conditions." },
  { title: "Stock & Options Alerts", icon: CircleDollarSign, copy: "Follow trade ideas across equities, options, ETFs, and short-term market opportunities." },
  { title: "Entry & Exit Levels", icon: Target, copy: "Each alert includes entry zone, take-profit targets, stop loss, and trade notes." },
  { title: "Live Price Tracking", icon: RadioTower, copy: "Monitor active alerts as prices update through the dashboard." },
  { title: "Auto TP/SL Monitoring", icon: Workflow, copy: "Track when alerts reach target or stop-loss levels." },
  { title: "Historical Performance", icon: FileClock, copy: "Review closed alerts, wins, losses, and alert history." },
  { title: "Mobile Dashboard", icon: Smartphone, copy: "Follow alerts from desktop or mobile without relying on messy chat rooms." },
  { title: "Risk-Aware Trade Plans", icon: ShieldCheck, copy: "Every alert is structured with predefined risk levels and trade context." },
]

const steps = [
  { title: "AI Scans the Market", icon: Cpu, copy: "SignalFlo analyzes market activity, technical levels, momentum, and volatility to surface potential setups." },
  { title: "Alerts Are Reviewed", icon: LockKeyhole, copy: "Trade ideas are organized with entry levels, targets, stop loss, confidence score, and notes." },
  { title: "Users Track in Real Time", icon: MonitorSmartphone, copy: "Members follow active alerts, monitor price movement, and review closed trade history." },
]

const testimonials = [
  ["The alerts are easier to follow than most trading groups I have tried, especially because each setup has clear risk levels.", "Maya R.", "Independent trader"],
  ["I like that every setup includes entry, target, and stop-loss levels. It makes the alert easier to review before I act.", "Jordan K.", "Options trader"],
  ["The dashboard makes it easier to track active trades and review closed alert history without relying on chat threads.", "Elena S.", "Market analyst"],
]

const pricingPlans = [
  {
    name: "Starter",
    price: "$99/mo",
    copy: "For traders who want clean stock alerts and dashboard access.",
    cta: "Get Started",
    features: ["Stock alerts", "Basic dashboard access", "Recent alerts", "Email support"],
  },
  {
    name: "Pro",
    price: "$299/mo",
    copy: "For active traders tracking stocks, options, and alert history.",
    cta: "Start Free Trial",
    features: ["Stocks + options alerts", "Active trade dashboard", "Confidence scoring", "Historical alert tracking", "Priority support"],
  },
  {
    name: "Elite",
    price: "$999/mo",
    copy: "For advanced users who want expanded coverage and onboarding.",
    cta: "Get Started",
    features: ["Everything in Pro", "Futures section when available", "Advanced market insights", "Premium alert categories", "Priority onboarding"],
  },
]

const faqs = [
  ["How often are alerts sent?", "Alert frequency depends on market conditions and setup quality. SignalFlo prioritizes clear trade ideas over constant noise."],
  ["Do I need trading experience?", "Some trading familiarity helps. SignalFlo makes alerts easier to review, but users should manage their own risk."],
  ["Are results guaranteed?", "No. SignalFlo provides trade alerts, market research, and educational tools. Trading involves risk, and users are responsible for their own decisions."],
  ["What markets do you cover?", "SignalFlo focuses on stocks and options, with support for ETFs and short-term market opportunities."],
  ["Is this financial advice?", "No. SignalFlo is software for alerts, research, and education. It does not provide individualized financial advice."],
]

const dashboardTabs = ["Overview", "Active Alerts", "Closed Trades"]

const dashboardAlerts = [
  { ticker: "NVDA", detail: "Entry zone watched", score: "92%", state: "Live" },
  { ticker: "SPY 525C", detail: "Target 1 near", score: "88%", state: "Active" },
  { ticker: "MSFT", detail: "Momentum confirmed", score: "84%", state: "Tracking" },
  { ticker: "AMD", detail: "Stop level guarded", score: "79%", state: "Review" },
  { ticker: "AAPL", detail: "Closed setup logged", score: "76%", state: "Closed" },
]

const tabPanelContent = {
  Overview: {
    headline: "Portfolio watch",
    subline: "+$2,436 tracked",
    rows: ["Live alerts", "Open trade plans", "Closed history"],
  },
  "Active Alerts": {
    headline: "Active setups",
    subline: "7 being tracked",
    rows: ["NVDA above entry", "SPY call target near", "MSFT momentum watch"],
  },
  "Closed Trades": {
    headline: "Closed review",
    subline: "12 logged today",
    rows: ["TP hit records", "Stop outcomes", "Admin notes"],
  },
}

const analyticsBars = [
  ["TP watched", 82],
  ["SL guarded", 68],
  ["History", 74],
  ["Admin log", 58],
]

function App() {
  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <Navbar />
      <Hero />
      <Process />
      <Features />
      <DashboardCommandCenter />
      <AlertCards />
      <Pricing />
      <Testimonials />
      <Faq />
      <FinalCta />
      <Footer />
    </main>
  )
}

function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.07] bg-[#050a14]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#" className="flex items-center gap-2.5 text-sm font-semibold">
          <span className="flex size-8 items-center justify-center rounded-md bg-cyan-400 text-slate-950 shadow-[0_0_26px_rgba(34,211,238,0.35)]">
            <Activity className="size-4" />
          </span>
          SignalFlo AI
        </a>
        <nav className="hidden items-center gap-8 text-xs text-slate-400 lg:flex">
          <a href="#features" className="transition-colors hover:text-white">Features</a>
          <a href="#dashboard" className="transition-colors hover:text-white">Dashboard</a>
          <a href="#alerts" className="transition-colors hover:text-white">Trade Alerts</a>
          <a href="#pricing" className="transition-colors hover:text-white">Pricing</a>
          <a href="#faq" className="transition-colors hover:text-white">FAQ</a>
        </nav>
        <div className="hidden items-center gap-2 sm:flex">
          <Button asChild variant="ghost" size="sm" className="h-8 text-xs transition-all hover:bg-white/[0.06]">
            <a href={APP_URL}>Login</a>
          </Button>
          <Button asChild size="sm" className="h-8 bg-blue-500 text-xs text-white shadow-[0_0_20px_rgba(59,130,246,0.28)] transition-all hover:-translate-y-0.5 hover:bg-blue-400">
            <a href={APP_URL}>Start Free Trial</a>
          </Button>
        </div>
        <Button asChild className="sm:hidden" variant="outline" size="icon" aria-label="Open dashboard">
          <a href={APP_URL}>
            <Menu />
          </a>
        </Button>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="relative border-b border-white/[0.06] pt-14">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_28%,rgba(56,189,248,0.2),transparent_28%),radial-gradient(circle_at_24%_18%,rgba(37,99,235,0.18),transparent_25%),linear-gradient(180deg,#07111f_0%,#050914_100%)]" />
      <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:48px_48px]" />
      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-7 px-4 py-8 sm:px-6 sm:py-10 lg:min-h-[540px] lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-12">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="max-w-xl pt-2 lg:pt-0"
        >
          <Badge variant="outline" className="border-cyan-400/20 bg-cyan-400/5 text-cyan-200">
            <Sparkles className="text-cyan-300" />
            AI watchlists, alerts, and trade plans
          </Badge>
          <h1 className="mt-4 max-w-2xl text-[2.65rem] font-semibold leading-[0.96] tracking-tight sm:text-5xl lg:text-[3.55rem]">
            <span className="block">AI-Powered Trading Alerts</span>
            <span className="mt-0.5 block sm:mt-1">
              <AnimatedGradientText>Built for Smarter Traders</AnimatedGradientText>
            </span>
          </h1>
          <p className="mt-4 max-w-lg text-sm leading-6 text-slate-400 sm:text-[15px]">
            SignalFlo AI delivers stock and options trade alerts with clear entry
            levels, targets, stop loss, confidence scoring, and real-time tracking
            from one clean dashboard.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button asChild className="bg-blue-500 text-white shadow-[0_0_28px_rgba(59,130,246,0.3)] transition-all hover:-translate-y-0.5 hover:bg-blue-400">
              <a href={APP_URL}>
                Start Receiving Alerts
                <ArrowRight />
              </a>
            </Button>
            <Button asChild variant="outline" className="border-white/10 bg-white/[0.03] transition-all hover:-translate-y-0.5 hover:bg-white/[0.06]">
              <a href={APP_URL}>View Dashboard</a>
            </Button>
          </div>
          <p className="mt-4 text-xs text-slate-500">
            Stock alerts, options alerts, real-time tracking, risk levels, and AI confidence scoring.
          </p>
        </motion.div>
        <HeroDashboardCard />
      </div>
    </section>
  )
}

function HeroDashboardCard() {
  const [activeAlert, setActiveAlert] = useState(0)
  const [showToast, setShowToast] = useState(true)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveAlert((current) => (current + 1) % heroAlerts.length)
      setShowToast(true)
      window.setTimeout(() => setShowToast(false), 1700)
    }, 3200)

    return () => window.clearInterval(interval)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.12 }}
      className="relative overflow-hidden rounded-[2rem]"
    >
      <motion.div
        className="absolute inset-0 scale-[1.04] rounded-[2rem] bg-cyan-400/12 blur-3xl"
        animate={{ opacity: [0.55, 0.9, 0.55], scale: [0.98, 1.02, 0.98] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative overflow-hidden rounded-xl border border-cyan-300/15 bg-[#071121]/94 p-3 shadow-2xl shadow-cyan-950/50">
        <motion.div
          className="pointer-events-none absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-transparent via-cyan-200/8 to-transparent"
          animate={{ x: ["-120%", "620%"] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "linear" }}
        />
        <div className="relative z-10 mb-3 flex flex-col gap-2.5 border-b border-white/[0.07] pb-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <motion.span
                className="size-2 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(34,211,238,0.9)]"
                animate={{ scale: [1, 1.45, 1], opacity: [0.65, 1, 0.65] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
              <p className="text-sm font-semibold text-slate-100">Live Alert Feed</p>
            </div>
            <p className="mt-0.5 text-[11px] text-slate-500">AI-ranked setups updating in real time</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-cyan-400/20 bg-cyan-400/5 text-cyan-200">
              {heroAlerts.length} live setups
            </Badge>
            <span className="text-[10px] uppercase tracking-[0.18em] text-slate-600">signal delivery</span>
          </div>
        </div>

        {showToast && (
          <motion.div
            className="absolute right-4 top-16 z-20 rounded-lg border border-cyan-300/20 bg-[#071121]/95 px-3 py-1.5 text-[11px] text-cyan-100 shadow-[0_0_28px_rgba(34,211,238,0.16)]"
            initial={{ opacity: 0, y: -10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            New alert received
          </motion.div>
        )}

        <div className="relative z-10 grid gap-2.5 sm:grid-cols-2">
          {heroAlerts.map((alert, index) => (
            <HeroAlertCard
              key={alert.ticker}
              alert={alert}
              active={activeAlert === index}
              index={index}
            />
          ))}
        </div>

        <div className="relative z-10 mt-3 grid gap-2 sm:grid-cols-3">
          <div className="rounded-lg border border-white/[0.07] bg-white/[0.03] px-3 py-1.5">
            <p className="text-[10px] uppercase tracking-[0.16em] text-slate-600">Avg AI score</p>
            <p className="mt-0.5 text-base font-semibold text-cyan-300">87</p>
          </div>
          <div className="rounded-lg border border-white/[0.07] bg-white/[0.03] px-3 py-1.5">
            <p className="text-[10px] uppercase tracking-[0.16em] text-slate-600">Active now</p>
            <p className="mt-0.5 text-base font-semibold text-blue-300">2</p>
          </div>
          <div className="rounded-lg border border-white/[0.07] bg-white/[0.03] px-3 py-1.5">
            <p className="text-[10px] uppercase tracking-[0.16em] text-slate-600">Refresh</p>
            <p className="mt-0.5 text-base font-semibold text-cyan-300">Live</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function HeroAlertCard({
  alert,
  active,
  index,
}: {
  alert: (typeof heroAlerts)[number]
  active: boolean
  index: number
}) {
  return (
    <motion.div
      className={cn(
        "group relative overflow-hidden rounded-lg border bg-[#080f20]/86 p-2.5 transition-all duration-300",
        active
          ? "border-cyan-300/35 shadow-[0_0_34px_rgba(34,211,238,0.14)]"
          : "border-white/[0.07] hover:border-cyan-300/24 hover:bg-[#0a1529]",
      )}
      animate={active ? { y: [0, -2, 0], scale: [1, 1.01, 1] } : { y: 0, scale: 1 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.45, delay: index * 0.02, ease: "easeOut" }}
    >
      <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(34,211,238,0.12),transparent_35%)] opacity-70" />
      <span className="pointer-events-none absolute inset-x-3 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-blue-500 via-cyan-300 to-transparent transition-transform duration-500 group-hover:scale-x-100" />
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-blue-300/10 bg-blue-500/16 text-[10px] font-semibold text-blue-200">
              {alert.ticker.slice(0, 2)}
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[13px] font-semibold text-slate-100">{alert.ticker}</p>
                <span className="rounded border border-cyan-300/10 bg-cyan-300/8 px-1.5 py-px text-[9px] font-semibold uppercase tracking-wide text-cyan-300">
                  {alert.asset}
                </span>
                <span className="rounded border border-blue-300/10 bg-blue-400/8 px-1.5 py-px text-[9px] font-semibold uppercase tracking-wide text-blue-200">
                  {alert.direction}
                </span>
              </div>
              <p className="mt-0.5 text-[10px] text-slate-600">{alert.time}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-[0.16em] text-slate-600">AI Score</p>
            <p className="text-[13px] font-semibold text-cyan-300">{alert.score}</p>
          </div>
        </div>

        <div className="mt-2.5 grid grid-cols-3 gap-1.5 text-[10px]">
          <HeroAlertLevel label="Entry" value={alert.entry} />
          <HeroAlertLevel label="Target" value={alert.target} />
          <HeroAlertLevel label="Stop" value={alert.stop} />
        </div>

        <div className="mt-2.5 flex items-center gap-3">
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-slate-800/90">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-300"
              initial={{ width: 0 }}
              whileInView={{ width: `${alert.score}%` }}
              animate={active ? { opacity: [0.75, 1, 0.75] } : { opacity: 0.9 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: index * 0.08, ease: "easeOut" }}
            />
          </div>
          <span className="flex items-center gap-1.5 text-[10px] text-slate-400">
            <motion.span
              className={cn("size-1.5 rounded-full", active ? "bg-cyan-300" : "bg-blue-300/70")}
              animate={active ? { scale: [1, 1.6, 1], opacity: [0.7, 1, 0.7] } : {}}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            />
            {alert.status}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

function HeroAlertLevel({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-white/[0.06] bg-white/[0.025] px-2 py-1">
      <p className="text-[10px] text-slate-600">{label}</p>
      <p className="mt-0.5 font-medium text-slate-200">{value}</p>
    </div>
  )
}

function AlertCards() {
  return (
    <FadeUp as="section" id="alerts" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-400">Live Alert Examples</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            Active trade alert previews
          </h2>
        </div>
        <p className="max-w-md text-sm leading-6 text-slate-500">
          Compact examples of the structured signal cards traders follow inside SignalFlo.
        </p>
      </div>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-background to-transparent" />
        <div className="flex snap-x gap-3 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {alertCards.map((alert, index) => (
            <MotionCard key={alert.ticker} delay={index * 0.04}>
              <div className="w-[280px] snap-start sm:w-[310px] lg:w-[330px]">
                <AlertPreviewCard alert={alert} index={index} />
              </div>
            </MotionCard>
          ))}
        </div>
      </div>
    </FadeUp>
  )
}

function Features() {
  return (
    <FadeUp as="section" id="features" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <SectionHeading
        kicker="Platform features"
        title="Everything You Need to Trade Smarter"
        highlight="Trade Smarter"
        description="A compact toolkit for publishing, monitoring, and reviewing AI-assisted trade alerts."
      />
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:mt-10 lg:grid-cols-4">
        {features.map((feature, index) => {
          return (
            <MotionCard key={feature.title} delay={index * 0.035}>
              <FeatureCard feature={feature} index={index} />
            </MotionCard>
          )
        })}
      </div>
    </FadeUp>
  )
}

function CardEffects() {
  return (
    <>
      <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(56,189,248,0.12),transparent_34%)] opacity-70" />
      <span className="pointer-events-none absolute -left-2 top-0 h-full w-16 -translate-x-24 rotate-12 bg-gradient-to-r from-transparent via-white/8 to-transparent opacity-0 blur-sm transition-all duration-700 group-hover:translate-x-[28rem] group-hover:opacity-100" />
      <span className="pointer-events-none absolute inset-x-4 bottom-0 h-px origin-left scale-x-0 rounded-full bg-gradient-to-r from-blue-500 via-cyan-300 to-transparent transition-transform duration-500 group-hover:scale-x-100" />
    </>
  )
}

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof features)[number]
  index: number
}) {
  const Icon = feature.icon
  const detailLabels = ["confidence ranked", "equity + options", "entry + exits", "live refresh", "target tracking", "closed history", "mobile ready", "risk defined"]

  return (
    <Card className={cardSurfaceClass}>
      <CardEffects />
      <CardHeader className="relative z-10 flex h-full flex-col p-5">
        <span className="flex size-10 items-center justify-center rounded-lg border border-cyan-300/10 bg-gradient-to-br from-blue-500/28 to-cyan-300/12 text-cyan-200 shadow-[0_0_24px_rgba(34,211,238,0.08)] transition-all duration-300 group-hover:border-cyan-300/25 group-hover:shadow-[0_0_28px_rgba(34,211,238,0.18)]">
          <Icon className="size-4" />
        </span>
        <CardTitle className="mt-4 text-sm font-semibold tracking-tight text-slate-100">{feature.title}</CardTitle>
        <CardDescription className="mt-1 text-xs leading-5 text-slate-500">{feature.copy}</CardDescription>
        <div className="mt-auto flex items-center gap-2 pt-5 text-[10px] font-medium uppercase tracking-[0.16em] text-slate-600">
          <span className="size-1 rounded-full bg-cyan-300/80" />
          {detailLabels[index]}
        </div>
      </CardHeader>
    </Card>
  )
}

function AlertPreviewCard({
  alert,
  index,
}: {
  alert: (typeof alertCards)[number]
  index: number
}) {
  const confidence = Number.parseInt(alert.confidence, 10)
  const symbol = alert.ticker.replace(/\s.*$/, "")
  const initials = symbol.slice(0, 2)
  const type = alert.ticker.includes("C") || alert.ticker.includes("P") ? "Option" : "Equity"
  const timestamps = ["2m", "5m", "8m", "12m"]
  const moves = ["+2.8%", "+8.2%", "-1.4%", "+0.6%"]

  return (
    <Card className={cardSurfaceClass}>
      <CardEffects />
      <CardContent className="relative z-10 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-blue-300/10 bg-blue-500/16 text-[11px] font-semibold text-blue-200">
              {initials}
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-semibold text-slate-100">{alert.ticker}</p>
                <span className="rounded border border-cyan-300/10 bg-cyan-300/8 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-cyan-300">
                  {type}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-slate-500">{alert.direction} setup</p>
            </div>
          </div>
          <span className="shrink-0 text-[10px] text-slate-600">{timestamps[index]}</span>
        </div>

        <p className="mt-4 truncate text-[11px] text-slate-500">
          Entry {alert.entry} / TP {alert.tp} / SL {alert.sl}
        </p>
        <div className="mt-3 flex items-center gap-2">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-800/80">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-300"
              initial={{ width: 0 }}
              whileInView={{ width: `${confidence}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: index * 0.08, ease: "easeOut" }}
            />
          </div>
          <span className="text-[10px] text-blue-200">{alert.confidence}</span>
        </div>
        <div className="mt-5 flex items-end justify-between">
          <div>
            <p className={cn("text-xl font-semibold", alert.status === "Alert" ? "text-blue-300" : "text-cyan-300")}>
              {alert.status === "Alert" ? "ALERT" : moves[index]}
            </p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-slate-600">{alert.status}</p>
          </div>
          <span className="size-2 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(34,211,238,0.8)]" />
        </div>
      </CardContent>
    </Card>
  )
}

function DashboardCommandCenter() {
  const [activeTab, setActiveTab] = useState(dashboardTabs[0])
  const [activeAlert, setActiveAlert] = useState(0)
  const [updatedIndex, setUpdatedIndex] = useState(0)
  const [showToast, setShowToast] = useState(true)
  const updatedLabels = ["8s", "12s", "18s"]
  const panel = tabPanelContent[activeTab as keyof typeof tabPanelContent]

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveAlert((current) => (current + 1) % dashboardAlerts.length)
      setUpdatedIndex((current) => (current + 1) % updatedLabels.length)
      setShowToast(true)
      window.setTimeout(() => setShowToast(false), 1900)
    }, 3400)

    return () => window.clearInterval(interval)
  }, [updatedLabels.length])

  return (
    <FadeUp as="section" id="dashboard" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <SectionHeading
        kicker="Live dashboard"
        title="Your Trading Command Center"
        highlight="Command Center"
        description="Monitor active trade alerts, review closed setups, track performance, and stay organized from one clean SignalFlo dashboard."
      />
      <div className="relative mx-auto mt-8 max-w-6xl overflow-hidden rounded-[2rem] lg:mt-10">
        <motion.div
          className="absolute inset-0 scale-[1.03] rounded-[2rem] bg-[radial-gradient(circle,rgba(34,211,238,0.18),rgba(37,99,235,0.08),transparent_65%)] blur-3xl"
          animate={{ opacity: [0.55, 0.9, 0.55] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative overflow-hidden rounded-xl border border-cyan-300/15 bg-[#071121]/95 p-3 shadow-2xl shadow-cyan-950/40 sm:p-4">
          <BorderBeam />
          <motion.div
            className="pointer-events-none absolute inset-x-0 top-0 z-10 h-20 bg-gradient-to-b from-cyan-300/10 via-cyan-300/3 to-transparent"
            animate={{ y: ["-30%", "520%"] }}
            transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
          />
          <div className="relative z-10">
            <div className="mb-4 flex flex-col gap-3 border-b border-white/[0.07] pb-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-1.5">
                <span className="size-2.5 rounded-full bg-red-400" />
                <span className="size-2.5 rounded-full bg-yellow-400" />
                <span className="size-2.5 rounded-full bg-green-400" />
              </div>
              <div className="flex flex-wrap items-center gap-3 text-[11px]">
                <span className="flex items-center gap-2 text-cyan-300">
                  <motion.span
                    className="size-2 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(34,211,238,0.85)]"
                    animate={{ scale: [1, 1.45, 1], opacity: [0.65, 1, 0.65] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                  />
                  Live
                </span>
                <span className="text-slate-500">Updated {updatedLabels[updatedIndex]} ago</span>
                <span className="text-cyan-300">SignalFlo Command Center</span>
              </div>
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
              {dashboardTabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "rounded-md border px-3 py-1.5 text-[11px] font-medium transition-all duration-300",
                    activeTab === tab
                      ? "border-cyan-300/25 bg-cyan-300/10 text-cyan-200 shadow-[0_0_22px_rgba(34,211,238,0.12)]"
                      : "border-white/[0.07] bg-white/[0.03] text-slate-500 hover:border-cyan-300/20 hover:text-slate-200",
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            <motion.div
              key={activeTab}
              className="grid gap-3 lg:grid-cols-[1.05fr_0.75fr_0.75fr]"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <DashboardPanel className="p-4">
                <div className="mb-3 flex flex-col gap-2 text-xs sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <span className="font-medium text-slate-300">{panel.headline}</span>
                    <p className="mt-1 text-[11px] text-slate-500">{panel.rows.join(" / ")}</p>
                  </div>
                  <span className="text-cyan-300">{panel.subline}</span>
                </div>
                <AnimatedDashboardChart className="h-52 sm:h-64" />
              </DashboardPanel>

              <DashboardPanel className="relative p-4">
                {showToast && (
                  <motion.div
                    className="absolute right-3 top-3 z-20 rounded-md border border-cyan-300/20 bg-[#071121]/95 px-3 py-2 text-[11px] text-cyan-200 shadow-[0_0_28px_rgba(34,211,238,0.14)]"
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  >
                    New alert received
                  </motion.div>
                )}
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-slate-300">Recent alerts</p>
                  <span className="text-[10px] text-slate-600">{dashboardAlerts.length} active</span>
                </div>
                <div className="mt-4 space-y-3">
                  {dashboardAlerts.map((alert, index) => (
                    <motion.div
                      key={alert.ticker}
                      className={cn(
                        "rounded-md border px-3 py-2 text-xs transition-colors",
                        activeAlert === index
                          ? "border-cyan-300/25 bg-cyan-300/10"
                          : "border-white/[0.06] bg-white/[0.025]",
                      )}
                      animate={activeAlert === index ? { x: [0, 2, 0] } : { x: 0 }}
                      transition={{ duration: 0.45 }}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-medium text-slate-200">{alert.ticker}</span>
                        <span className={index === 1 ? "text-blue-300" : "text-cyan-300"}>{alert.score}</span>
                      </div>
                      <div className="mt-1 flex items-center justify-between gap-3 text-[10px] text-slate-500">
                        <span>{alert.detail}</span>
                        <span>{alert.state}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </DashboardPanel>

              <div className="grid gap-3">
                <AnimatedMetricCard title="Open trades" value={7} icon={TrendingUp} tone="text-cyan-300" trend="+2 active" />
                <AnimatedMetricCard title="Closed today" value={12} icon={Check} tone="text-blue-300" trend="4 reviewed" />
                <DashboardPanel className="p-4">
                  <p className="text-xs text-slate-400">Analytics</p>
                  <div className="mt-3 space-y-3">
                    {analyticsBars.map(([label, value], index) => (
                      <div key={label}>
                        <div className="mb-1 flex items-center justify-between text-[10px]">
                          <span className="text-slate-500">{label}</span>
                          <span className="text-slate-400">{value}%</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-slate-800/80">
                          <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-300"
                            initial={{ width: 0 }}
                            whileInView={{ width: `${value}%` }}
                            whileHover={{ width: "100%" }}
                            viewport={{ once: true, amount: 0.7 }}
                            transition={{ duration: 0.8, delay: index * 0.08, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </DashboardPanel>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </FadeUp>
  )
}

function DashboardPanel({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div
      className={cn(
        "group relative overflow-hidden rounded-lg border border-white/[0.07] bg-black/18 transition-all duration-300 hover:border-cyan-300/25 hover:bg-white/[0.04] hover:shadow-[0_16px_50px_rgba(14,165,233,0.1)]",
        className,
      )}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_0%,rgba(34,211,238,0.12),transparent_30%)] opacity-70" />
      <span className="pointer-events-none absolute -left-12 top-0 h-full w-14 -translate-x-20 rotate-12 bg-gradient-to-r from-transparent via-white/8 to-transparent opacity-0 blur-sm transition-all duration-700 group-hover:translate-x-96 group-hover:opacity-100" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}

function AnimatedDashboardChart({ className }: { className?: string }) {
  const points = [
    [0, 158],
    [45, 142],
    [88, 118],
    [130, 124],
    [174, 88],
    [220, 76],
    [264, 92],
    [314, 54],
    [362, 44],
    [420, 28],
  ]
  const path = "M0 158 C 42 148, 58 132, 88 118 S 140 118, 174 88 S 226 72, 264 92 S 314 54, 362 44 S 396 36, 420 28"

  return (
    <div className={cn("relative overflow-hidden rounded-md bg-[#05101d]", className)}>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:42px_42px]" />
      <motion.div
        className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-cyan-300/8 to-transparent"
        animate={{ x: ["-30%", "560%"] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: "linear" }}
      />
      <svg className="absolute inset-0 size-full" viewBox="0 0 420 180" preserveAspectRatio="none">
        <defs>
          <linearGradient id="dashboard-chart-gradient" x1="0" x2="1">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="52%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
          <filter id="dashboard-chart-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <motion.path
          d={path}
          fill="none"
          stroke="rgba(34,211,238,0.12)"
          strokeWidth="10"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: "easeOut" }}
        />
        <motion.path
          d={path}
          fill="none"
          stroke="url(#dashboard-chart-gradient)"
          strokeWidth="3"
          filter="url(#dashboard-chart-glow)"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: "easeOut" }}
        />
        {points.slice(1).map(([cx, cy], index) => (
          <motion.circle
            key={`${cx}-${cy}`}
            cx={cx}
            cy={cy}
            r="4"
            fill="#22d3ee"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: [0.45, 1, 0.65], scale: [0.8, 1.35, 1] }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.45 + index * 0.08, ease: "easeOut" }}
          />
        ))}
      </svg>
      <div className="absolute bottom-3 left-3 rounded-md border border-cyan-300/15 bg-cyan-300/8 px-2 py-1 text-[10px] text-cyan-200">
        Alert trend active
      </div>
    </div>
  )
}

function AnimatedMetricCard({
  title,
  value,
  icon: Icon,
  tone,
  trend,
}: {
  title: string
  value: number
  icon: ComponentType<{ className?: string }>
  tone: string
  trend: string
}) {
  return (
    <DashboardPanel className="p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-400">{title}</p>
        <span className="flex items-center gap-1 text-[10px] text-cyan-300">
          <ArrowRight className="size-3 -rotate-45" />
          {trend}
        </span>
      </div>
      <div className="mt-3 flex items-end justify-between">
        <p className={cn("text-2xl font-semibold", tone)}>
          <CountUp to={value} />
        </p>
        <Icon className={cn("size-4", tone)} />
      </div>
    </DashboardPanel>
  )
}

function CountUp({ to }: { to: number }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let frame = 0
    const totalFrames = 28
    const interval = window.setInterval(() => {
      frame += 1
      setCount(Math.round((to * frame) / totalFrames))
      if (frame >= totalFrames) {
        window.clearInterval(interval)
      }
    }, 28)

    return () => window.clearInterval(interval)
  }, [to])

  return <>{count}</>
}

function Process() {
  return (
    <FadeUp as="section" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <SectionHeading
        kicker="How it works"
        title="Three Steps to Smarter Trading"
        highlight="Smarter Trading"
        description="A simple workflow from market scan to alert review and real-time tracking."
      />
      <div className="mt-8 grid gap-4 lg:mt-10 lg:grid-cols-3">
        {steps.map((step, index) => {
          const Icon = step.icon

          return (
            <MotionCard key={step.title} delay={index * 0.06}>
              <Card className="relative h-full overflow-hidden bg-[#081225]/82 transition hover:border-cyan-300/25">
                <CardHeader className="p-5">
                  <span className="absolute right-5 top-4 text-4xl font-semibold text-white/[0.03]">0{index + 1}</span>
                  <span className="flex size-10 items-center justify-center rounded-md bg-cyan-400/12 text-cyan-300">
                    <Icon className="size-5" />
                  </span>
                  <CardTitle className="text-base">{step.title}</CardTitle>
                  <CardDescription>{step.copy}</CardDescription>
                </CardHeader>
              </Card>
            </MotionCard>
          )
        })}
      </div>
    </FadeUp>
  )
}

function Testimonials() {
  return (
    <FadeUp as="section" className="border-y border-white/[0.06] bg-[#07101f] px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          kicker="Social proof"
          title="Trusted by Serious Traders"
          highlight="Serious Traders"
          description="Realistic workflows for teams that need structure, not hype."
        />
        <div className="mt-8 grid gap-4 lg:mt-10 lg:grid-cols-3">
          {testimonials.map(([quote, name, role], index) => (
            <MotionCard key={name} delay={index * 0.06}>
              <Card className="h-full bg-[#081225]/82 transition hover:border-cyan-300/25">
                <CardContent className="p-5">
                  <div className="text-xs text-cyan-300">*****</div>
                  <p className="mt-4 text-sm leading-6 text-slate-300">"{quote}"</p>
                  <MiniChart className="mt-5 h-14 opacity-70" />
                  <div className="mt-4 flex items-center gap-3 border-t border-white/[0.07] pt-4">
                    <span className="flex size-8 items-center justify-center rounded-full bg-blue-500 text-xs font-semibold text-white">
                      {name.charAt(0)}
                    </span>
                    <div>
                      <p className="text-sm font-medium">{name}</p>
                      <p className="text-xs text-slate-500">{role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </MotionCard>
          ))}
        </div>
      </div>
    </FadeUp>
  )
}

function Pricing() {
  return (
    <FadeUp as="section" id="pricing" className="relative overflow-hidden px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(34,211,238,0.12),transparent_34%)]" />
      <div className="relative z-10 mx-auto max-w-7xl">
      <SectionHeading
        kicker="Pricing"
        title="Choose Your Plan"
        highlight="Your Plan"
        description="Simple options for traders who want structured alerts, tracking, and clearer trade plans."
      />
      <div className="mt-8 grid gap-5 lg:mt-10 lg:grid-cols-3">
        {pricingPlans.map((plan, index) => (
          <MotionCard key={plan.name} delay={index * 0.06}>
            <Card
              className={cn(
                "group relative h-full overflow-hidden rounded-2xl border border-blue-300/10 bg-[#081225]/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_22px_70px_rgba(2,8,23,0.42)] transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/30 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_28px_90px_rgba(14,165,233,0.14)]",
                plan.name === "Pro" && "border-cyan-300/30 bg-[#0a1428] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_0_60px_rgba(34,211,238,0.14)]",
              )}
            >
              <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.16),transparent_36%)] opacity-80" />
              <span className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent" />
              <span className="pointer-events-none absolute -left-8 top-0 h-full w-16 -translate-x-24 rotate-12 bg-gradient-to-r from-transparent via-white/8 to-transparent opacity-0 blur-sm transition-all duration-700 group-hover:translate-x-[26rem] group-hover:opacity-100" />
              <CardHeader className="relative z-10 p-6 sm:p-7">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <CardDescription className="mt-2 min-h-10 text-sm leading-6 text-slate-500">{plan.copy}</CardDescription>
                  </div>
                  {plan.name === "Pro" && (
                    <Badge className="shrink-0 bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.25)]">Most Popular</Badge>
                  )}
                </div>
                <div className="mt-6 flex items-end gap-2">
                  <p className="text-4xl font-semibold tracking-tight text-cyan-300">{plan.price.replace("/mo", "")}</p>
                  <span className="pb-1 text-sm text-slate-500">/mo</span>
                </div>
              </CardHeader>
              <CardContent className="relative z-10 px-6 pb-6 sm:px-7 sm:pb-7">
                <Button
                  asChild
                  className={cn(
                    "h-10 w-full transition-all hover:-translate-y-0.5",
                    plan.name === "Pro"
                      ? "bg-blue-500 text-white shadow-[0_0_26px_rgba(59,130,246,0.24)] hover:bg-blue-400"
                      : "border-white/10 bg-white/[0.04] hover:bg-white/[0.07]",
                  )}
                  variant={plan.name === "Pro" ? "default" : "outline"}
                >
                  <a href={APP_URL}>{plan.cta}</a>
                </Button>
                <div className="mt-6 space-y-3.5">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3 text-sm text-slate-400">
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-cyan-300/15 bg-cyan-300/8">
                        <Check className="size-3 text-cyan-300" />
                      </span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </MotionCard>
        ))}
      </div>
      <p className="mt-5 text-center text-xs text-slate-500">
        Pricing and features can be adjusted before launch.
      </p>
      </div>
    </FadeUp>
  )
}

function Faq() {
  return (
    <FadeUp as="section" id="faq" className="border-y border-white/[0.06] bg-[#07101f] px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-3xl">
        <SectionHeading
          kicker="FAQ"
          title="Frequently Asked Questions"
          highlight="Questions"
          description="Everything you need to know before getting started."
        />
        <Accordion type="single" collapsible className="mt-8 space-y-3">
          {faqs.map(([question, answer], index) => (
            <AccordionItem key={question} value={`faq-${index}`} className="rounded-lg border border-white/[0.07] bg-[#081225]/82 px-4">
              <AccordionTrigger className="text-left text-sm hover:text-cyan-300 hover:no-underline">
                {question}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-6 text-slate-400">
                {answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </FadeUp>
  )
}

function FinalCta() {
  return (
    <FadeUp as="section" className="relative px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(34,211,238,0.2),rgba(37,99,235,0.12),transparent_42%)]"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <Badge variant="outline" className="border-cyan-400/20 bg-cyan-400/5 text-cyan-200">
          <Sparkles className="text-cyan-300" />
          Start your alert workflow
        </Badge>
        <h2 className="mt-5 text-3xl font-semibold sm:text-5xl">
          Trade Smarter <AnimatedGradientText>With AI</AnimatedGradientText>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-400">
          Join traders using SignalFlo to discover, track, and manage AI-powered
          trade alerts from one clean dashboard.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild className="bg-blue-500 text-white transition-all hover:-translate-y-0.5 hover:bg-blue-400">
            <a href={APP_URL}>Start Trading</a>
          </Button>
          <Button asChild variant="outline" className="border-white/10 bg-white/[0.03] transition-all hover:-translate-y-0.5 hover:bg-white/[0.06]">
            <a href={APP_URL}>View Plans</a>
          </Button>
        </div>
      </div>
    </FadeUp>
  )
}

function Footer() {
  return (
    <footer className="border-t border-white/[0.06] px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-lg border border-white/[0.07] bg-[#081225]/70 px-4 py-3 text-[11px] text-slate-500">
          SignalFlo AI provides trade alerts, market research, and educational tools. Trading involves risk, and users are responsible for their own decisions.
        </div>
        <div className="grid gap-10 md:grid-cols-[1.4fr_2fr]">
          <div>
            <div className="flex items-center gap-2.5 text-sm font-semibold">
              <span className="flex size-8 items-center justify-center rounded-md bg-cyan-400 text-slate-950">
                <Activity className="size-4" />
              </span>
              SignalFlo AI
            </div>
            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-500">
              AI-powered stock and options trade alerts with entry levels,
              targets, stop loss, confidence scoring, and real-time tracking.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-4">
            {[
              ["Product", "Features", "Dashboard", "Trade Alerts"],
              ["Company", "Pricing", "FAQ", "Login"],
              ["Resources", "Analytics", "Risk Plans", "Admin Tools"],
              ["Legal", "Disclaimer", "Terms", "Privacy"],
            ].map(([head, ...links]) => (
              <div key={head}>
                <p className="text-xs font-semibold text-slate-300">{head}</p>
                <div className="mt-3 space-y-2">
                  {links.map((link) => (
                    <a key={link} href={link === "Login" ? APP_URL : "#"} className="block text-xs text-slate-500 transition-colors hover:text-cyan-300">
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-10 border-t border-white/[0.06] pt-6 text-[11px] leading-5 text-slate-600">
          Trading involves substantial risk, including possible loss of capital.
          SignalFlo AI does not guarantee results and does not provide
          individualized financial advice. All trade alerts, research, and
          educational tools are for informational purposes only; all decisions
          remain the responsibility of the user.
        </p>
      </div>
    </footer>
  )
}

function SectionHeading({
  kicker,
  title,
  highlight,
  description,
}: {
  kicker: string
  title: string
  highlight: string
  description: string
}) {
  const parts = title.split(highlight)

  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-400">{kicker}</p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
        {parts[0]}
        <span className="text-cyan-300">{highlight}</span>
        {parts[1]}
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500">{description}</p>
    </div>
  )
}

function MiniChart({ className }: { className?: string }) {
  return (
    <div className={cn("relative overflow-hidden rounded-md bg-[#05101d]", className)}>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:42px_42px]" />
      <svg className="absolute inset-0 size-full" viewBox="0 0 420 180" preserveAspectRatio="none">
        <motion.path
          d="M0 145 C 42 136, 74 118, 112 96 S 176 76, 214 72 S 276 66, 318 42 S 378 34, 420 28"
          fill="none"
          stroke="url(#chart-gradient)"
          strokeWidth="3"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4 }}
        />
        <defs>
          <linearGradient id="chart-gradient" x1="0" x2="1">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}

function FadeUp({
  children,
  className,
  id,
  as = "div",
}: {
  children: ReactNode
  className?: string
  id?: string
  as?: "div" | "section"
}) {
  const Component = motion[as]

  return (
    <Component
      id={id}
      className={className}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
    >
      {children}
    </Component>
  )
}

function MotionCard({
  children,
  delay = 0,
}: {
  children: ReactNode
  delay?: number
}) {
  return (
    <motion.div
      className="h-full shrink-0"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  )
}

export default App
