import {
  Activity,
  ArrowRight,
  Bot,
  Check,
  CircleDollarSign,
  Cpu,
  FileClock,
  Loader2,
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
const LEGAL_URL = "/legal"
const LEGAL_VERSION = "v1.0"
const LEGAL_ACCEPTANCE_SOURCE = "pricing_page_before_whop_checkout"
const LEGAL_ACKNOWLEDGMENT =
  "I have read and agree to the Terms, Risk Disclosure & Refund Policy, including the no-refund policy, risk disclosure, automatic renewal terms, and the fact that SignalFlo provides educational and informational content only, not personalized investment advice."

const supabaseConfig = {
  url: import.meta.env.VITE_SUPABASE_URL,
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
}

const whopCheckoutUrls = {
  monthly: import.meta.env.VITE_WHOP_MONTHLY_URL,
  annual: import.meta.env.VITE_WHOP_ANNUAL_URL,
  lifetime: import.meta.env.VITE_WHOP_LIFETIME_URL,
}

const tickerTape = [
  ["NVDA", "+2.84%", "up"],
  ["SPY", "+0.82%", "up"],
  ["TSLA", "-0.31%", "down"],
  ["AAPL", "+0.64%", "up"],
  ["MSFT", "+1.12%", "up"],
  ["COIN", "+3.40%", "up"],
  ["AMD", "+1.75%", "up"],
  ["QQQ", "+0.58%", "up"],
  ["NQ", "+148 pts", "up"],
  ["BTC", "+4.18%", "up"],
]

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

const corePricingFeatures = [
  "Real-time AI trade alerts",
  "Stock alerts",
  "Options alerts",
  "Active trade dashboard",
  "Historical trade tracking",
  "AI confidence scoring",
  "Discord access",
  "Telegram access",
  "Email support",
]

const pricingPlans = [
  {
    id: "monthly",
    name: "Monthly",
    price: "$295/month",
    copy: "Flexible month-to-month access to the full SignalFlo platform.",
    cta: "Choose Monthly",
    checkoutUrl: whopCheckoutUrls.monthly,
    checkoutEnvName: "VITE_WHOP_MONTHLY_URL",
    details: ["Full platform access", "Billed monthly", "Renews monthly until canceled"],
    features: corePricingFeatures,
  },
  {
    id: "annual",
    name: "Annual",
    price: "$2,395/year",
    copy: "Best value for traders committed to consistent alert tracking.",
    cta: "Choose Annual",
    checkoutUrl: whopCheckoutUrls.annual,
    checkoutEnvName: "VITE_WHOP_ANNUAL_URL",
    details: ["Full platform access", "Billed annually", "$199.58/month", "Save $1,145 per year", "Renews annually until canceled"],
    features: corePricingFeatures,
  },
  {
    id: "lifetime",
    name: "Founder Lifetime",
    price: "$4,995 one-time",
    copy: "Founding-member access with platform-lifetime benefits and bonuses.",
    cta: "Choose Founder Lifetime",
    checkoutUrl: whopCheckoutUrls.lifetime,
    checkoutEnvName: "VITE_WHOP_LIFETIME_URL",
    details: [
      "One-time payment",
      "Lifetime access during the life of the SignalFlo platform",
      "Limited founding-member pricing",
      "Future premium categories included",
      "Futures section access when available",
      "Priority onboarding",
    ],
    features: corePricingFeatures,
  },
]

type PricingPlan = (typeof pricingPlans)[number]

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

const engineLabels = [
  "Options Flow",
  "Gamma Exposure",
  "Liquidity Zones",
  "Volatility Regimes",
  "Institutional Positioning",
  "Market Structure",
  "Sector Rotation",
  "Risk Asymmetry",
  "Macro Catalysts",
  "Relative Strength",
]

const engineCopyBlocks = [
  "SignalFlo AI was designed to solve a fundamental problem facing modern traders: there is more market data available today than any individual can realistically process.",
  "Our proprietary market intelligence engine continuously analyzes multiple layers of market behavior across equities, options, volatility, liquidity, market structure, institutional positioning, sector rotation, and macroeconomic developments in real time.",
  "Rather than relying on isolated indicators or simplistic signal generation models, SignalFlo evaluates the interaction between numerous market variables simultaneously. The system monitors options flow, dealer gamma exposure, liquidity concentrations, volume dynamics, volatility conditions, relative strength, momentum characteristics, earnings catalysts, economic events, and broader market context to identify opportunities where multiple independent factors align.",
  "Every potential trade is subjected to a structured evaluation framework designed to measure opportunity quality, risk asymmetry, market participation, and contextual confirmation before an alert is generated. The objective is not to produce more alerts, but to filter out low-quality setups and surface only those opportunities that demonstrate the strongest evidence of institutional participation and favorable risk-to-reward characteristics.",
  "By automating the research process traditionally performed across multiple platforms, SignalFlo condenses hours of chart analysis, options flow monitoring, market surveillance, and trade validation into a streamlined intelligence layer that operates continuously throughout the trading day.",
  "The result is a disciplined, data-driven decision framework that helps traders focus less on searching for opportunities and more on executing them.",
]

const engineFeatures = [
  { title: "Options Intelligence", icon: Activity, copy: "Monitors unusual options activity, chain structure, premium flow, and contract behavior." },
  { title: "Liquidity Mapping", icon: Target, copy: "Tracks liquidity concentrations, support/resistance zones, volume behavior, and price reaction areas." },
  { title: "Dealer Positioning", icon: Workflow, copy: "Evaluates gamma exposure, volatility conditions, and positioning pressure." },
  { title: "Market Structure", icon: TrendingUp, copy: "Studies trend alignment, momentum shifts, relative strength, and multi-timeframe confirmation." },
  { title: "Catalyst Awareness", icon: RadioTower, copy: "Factors in earnings, economic events, sector rotation, and broader market context." },
  { title: "Risk Framework", icon: ShieldCheck, copy: "Scores opportunities based on risk-to-reward quality, confirmation strength, and trade structure." },
]

const engineMetrics = [
  ["24/7", "Market Surveillance"],
  ["Real-Time", "Signal Validation"],
  ["Multi-Layer", "Intelligence Engine"],
  ["Institutional", "Data Analysis"],
  ["High-Conviction", "Opportunity Scoring"],
]

const intelligenceDiscoveries = [
  ["UNUSUAL FLOW DETECTED", "AAPL 220C", "$4.2M PREMIUM"],
  ["LIQUIDITY CLUSTER", "SPY 590.50", "Price reaction zone"],
  ["GAMMA WALL", "QQQ 530", "Dealer pressure"],
  ["VOLATILITY EXPANSION", "VIX +8.2%", "Regime shift"],
  ["DARK POOL ACTIVITY", "Institutional accumulation", "Detected"],
  ["SECTOR ROTATION", "Technology Leading", "Relative strength"],
]

const workflowStages = [
  {
    step: "STEP 01",
    title: "DATA INGESTION",
    copy: "SignalFlo continuously monitors multiple layers of market intelligence.",
    chips: ["Options Flow", "Dark Pools", "Gamma Exposure", "Liquidity Zones", "Volatility", "Macro Events", "Relative Strength", "Institutional Positioning"],
  },
  {
    step: "STEP 02",
    title: "AI ANALYSIS",
    copy: "The engine evaluates relationships between market variables to identify institutional-grade confluence and favorable opportunity structures.",
    chips: ["Confluence Map", "Signal Integrity", "Context Filter", "Participation Model"],
  },
  {
    step: "STEP 03",
    title: "OPPORTUNITY SCORING",
    copy: "Only opportunities with strong structure, confirmation, and risk characteristics reach the platform.",
    score: "92",
    chips: ["Risk Profile", "Trend Alignment", "Liquidity Quality", "Confirmation Strength"],
  },
]

const engineLayerChips = [
  ["Flow", "OI", "Skew"],
  ["HVN", "LVN", "Order Book"],
  ["GEX", "IV", "Delta"],
  ["Trend", "Momentum", "Breadth"],
  ["Earnings", "Macro", "Sector"],
  ["R:R", "Confirmation", "Probability"],
]

const engineParagraphLabels = [
  ["01 / Market Load", Activity],
  ["02 / Intelligence", Cpu],
  ["03 / Confluence", Workflow],
  ["01 / Evaluate", Target],
  ["02 / Automate", Bot],
  ["03 / Execute", TrendingUp],
]

function App() {
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null)

  if (window.location.pathname === LEGAL_URL) {
    return <LegalPage />
  }

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <Navbar />
      <Hero />
      <MarketTicker />
      <Process />
      <Features />
      <DashboardCommandCenter />
      <AlertCards />
      <SignalFloEngine />
      <Pricing onSelectPlan={setSelectedPlan} />
      <Testimonials />
      <Faq />
      <FinalCta />
      <Footer />
      <LegalAcknowledgmentModal
        plan={selectedPlan}
        onClose={() => setSelectedPlan(null)}
      />
    </main>
  )
}

function LegalPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="relative overflow-hidden border-b border-white/[0.06] px-4 py-14 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.16),transparent_35%),linear-gradient(180deg,#07111f_0%,#050914_100%)]" />
        <div className="relative z-10 mx-auto max-w-4xl">
          <a href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-cyan-300 transition-colors hover:text-cyan-200">
            <ArrowRight className="size-4 rotate-180" />
            Back to SignalFlo
          </a>
          <Badge variant="outline" className="border-cyan-400/20 bg-cyan-400/5 text-cyan-200">
            Legal
          </Badge>
          <h1 className="mt-5 text-4xl font-extrabold tracking-[-0.025em] sm:text-5xl">
            Terms, Risk Disclosure & Refund Policy
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
            Please review these terms carefully before using SignalFlo AI,
            purchasing a plan, subscribing, or upgrading your account.
          </p>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto grid max-w-4xl gap-5">
          {[
            [
              "Informational and Educational Use Only",
              "SignalFlo provides AI-generated market analysis, trade alerts, educational content, software tools, and informational materials only. SignalFlo does not provide individualized investment, tax, legal, accounting, or financial advice.",
            ],
            [
              "No Adviser, Broker-Dealer, Planner, or Fiduciary Relationship",
              "SignalFlo is not a registered investment adviser, broker-dealer, financial planner, or fiduciary. Use of SignalFlo does not create an advisory, brokerage, fiduciary, or planner-client relationship.",
            ],
            [
              "Trading Risk Disclosure",
              "Trading stocks, options, futures, crypto, ETFs, and other financial instruments involves substantial risk. You may lose money, including your entire principal. Market conditions can change quickly, and past examples, alerts, or analysis do not guarantee future results.",
            ],
            [
              "User Responsibility",
              "All trading and investment decisions are made solely by you. You are responsible for evaluating alerts, conducting your own research, managing risk, sizing positions, and deciding whether any trade idea is appropriate for your circumstances.",
            ],
            [
              "No Performance Guarantees",
              "SignalFlo does not guarantee profits, returns, win rates, income, successful trades, or specific outcomes. Any examples shown on the website or in the product are for product demonstration, educational, or informational purposes.",
            ],
            [
              "Refund Policy",
              "Monthly plan payments are not refundable after access is granted. Annual plan payments are refundable only within 7 calendar days if access has not been materially used. Founder Lifetime payments are non-refundable after access is granted.",
            ],
            [
              "Account and Subscription Terms",
              "The Monthly plan is $295/month, billed monthly, and renews monthly until canceled. The Annual plan is $2,395/year, billed annually, equals $199.58/month, saves $1,145 per year compared with monthly billing, and renews annually until canceled. The Founder Lifetime plan is $4,995 one-time for lifetime access during the life of the SignalFlo platform and is not a recurring subscription.",
            ],
            [
              "Required Checkout Acknowledgment",
              `Before payment, subscription, or upgrade confirmation, users must check a required, unchecked acknowledgment box that states: "${LEGAL_ACKNOWLEDGMENT}"`,
            ],
            [
              "Acknowledgment",
              LEGAL_ACKNOWLEDGMENT,
            ],
          ].map(([title, copy]) => (
            <Card key={title} className="border-white/[0.07] bg-[#081225]/82">
              <CardHeader className="p-5">
                <CardTitle className="text-lg">{title}</CardTitle>
                <CardDescription className="text-sm leading-7 text-slate-400">{copy}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>
    </main>
  )
}

function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.07] bg-[#050a14]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#" className="flex items-center gap-2.5 text-sm font-semibold tracking-[0.01em]">
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
          <h1 className="mt-4 max-w-2xl text-[2.65rem] font-extrabold leading-[0.94] tracking-[-0.035em] sm:text-5xl lg:text-[3.55rem]">
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
            <p className="text-sm font-semibold tracking-[0.01em] text-slate-100">Live Alert Feed</p>
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

function MarketTicker() {
  const tickerItems = [...tickerTape, ...tickerTape]

  return (
    <section className="border-y border-white/[0.06] bg-[#050914]/95 py-2">
      <div className="ticker-mask mx-auto max-w-7xl overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="animate-ticker flex w-max gap-6 text-[11px]">
          {tickerItems.map(([symbol, change, dir], index) => (
            <div key={`${symbol}-${index}`} className="flex shrink-0 items-center gap-2 text-slate-500">
              <span className="font-medium text-slate-200">{symbol}</span>
              <span className={dir === "up" ? "text-cyan-300" : "text-red-300"}>{change}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function AlertCards() {
  const scrollingAlerts = [...alertCards, ...alertCards]

  return (
    <FadeUp as="section" id="alerts" className="mx-auto max-w-7xl px-4 pb-14 pt-4 sm:px-6 sm:pb-16 sm:pt-5 lg:px-8 lg:pt-6">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-400">Live Alert Examples</p>
          <h2 className="mt-2 text-2xl font-bold tracking-[-0.015em] sm:text-3xl">
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
        <div className="overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="animate-ticker flex w-max snap-x gap-3 hover:[animation-play-state:paused]">
          {scrollingAlerts.map((alert, index) => (
            <MotionCard key={`${alert.ticker}-${index}`} delay={(index % alertCards.length) * 0.04}>
              <div className="w-[280px] snap-start sm:w-[310px] lg:w-[330px]">
                <AlertPreviewCard alert={alert} index={index % alertCards.length} />
              </div>
            </MotionCard>
          ))}
          </div>
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
        <CardTitle className="mt-4 text-sm font-semibold tracking-[-0.005em] text-slate-100">{feature.title}</CardTitle>
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
    <FadeUp as="section" id="dashboard" className="mx-auto max-w-7xl px-4 pb-8 pt-14 sm:px-6 sm:pb-10 sm:pt-16 lg:px-8 lg:pb-12 lg:pt-20">
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
  const candles = [
    { x: 34, wickTop: 118, wickBottom: 154, bodyY: 128, bodyH: 18, up: true },
    { x: 68, wickTop: 104, wickBottom: 148, bodyY: 112, bodyH: 24, up: true },
    { x: 102, wickTop: 92, wickBottom: 138, bodyY: 100, bodyH: 28, up: false },
    { x: 136, wickTop: 82, wickBottom: 128, bodyY: 92, bodyH: 22, up: true },
    { x: 170, wickTop: 72, wickBottom: 118, bodyY: 80, bodyH: 26, up: true },
    { x: 204, wickTop: 76, wickBottom: 126, bodyY: 88, bodyH: 24, up: false },
    { x: 238, wickTop: 62, wickBottom: 108, bodyY: 70, bodyH: 24, up: true },
    { x: 272, wickTop: 52, wickBottom: 98, bodyY: 60, bodyH: 28, up: true },
    { x: 306, wickTop: 58, wickBottom: 106, bodyY: 70, bodyH: 22, up: false },
    { x: 340, wickTop: 42, wickBottom: 88, bodyY: 50, bodyH: 26, up: true },
    { x: 374, wickTop: 34, wickBottom: 78, bodyY: 44, bodyH: 22, up: true },
  ]
  const averagePath = "M28 142 C 82 126, 126 116, 170 98 S 246 88, 292 76 S 350 58, 392 48"

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
          <linearGradient id="dashboard-average-gradient" x1="0" x2="1">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
          <filter id="dashboard-candle-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <motion.path
          d={averagePath}
          fill="none"
          stroke="url(#dashboard-average-gradient)"
          strokeWidth="2"
          strokeDasharray="4 7"
          opacity="0.55"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: "easeOut" }}
        />
        {candles.map((candle, index) => (
          <motion.g
            key={`${candle.x}-${index}`}
            initial={{ opacity: 0, y: 12, scaleY: 0.7 }}
            whileInView={{ opacity: 1, y: 0, scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: index * 0.06, ease: "easeOut" }}
            style={{ transformOrigin: `${candle.x}px ${candle.wickBottom}px` }}
          >
            <line
              x1={candle.x}
              x2={candle.x}
              y1={candle.wickTop}
              y2={candle.wickBottom}
              stroke={candle.up ? "#67e8f9" : "#f87171"}
              strokeOpacity={candle.up ? 0.7 : 0.45}
              strokeWidth="2"
            />
            <rect
              x={candle.x - 7}
              y={candle.bodyY}
              width="14"
              height={candle.bodyH}
              rx="3"
              fill={candle.up ? "#22d3ee" : "#ef4444"}
              fillOpacity={candle.up ? 0.72 : 0.42}
              stroke={candle.up ? "#a5f3fc" : "#fca5a5"}
              strokeOpacity={candle.up ? 0.7 : 0.45}
              filter={candle.up ? "url(#dashboard-candle-glow)" : undefined}
            />
          </motion.g>
        ))}
      </svg>
      <div className="absolute bottom-3 left-3 rounded-md border border-cyan-300/15 bg-cyan-300/8 px-2 py-1 text-[10px] text-cyan-200">
        Candlestick trend active
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

function SignalFloEngine() {
  return (
    <FadeUp as="section" className="relative overflow-hidden border-y border-white/[0.06] bg-[#050914] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_16%,rgba(37,99,235,0.22),transparent_34%),radial-gradient(circle_at_78%_28%,rgba(34,211,238,0.18),transparent_28%),linear-gradient(180deg,#050914_0%,#07101f_48%,#050914_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.035)_1px,transparent_1px)] bg-[size:56px_56px] opacity-45" />
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-cyan-300/8 to-transparent"
        animate={{ y: ["-20%", "520%"], opacity: [0, 0.7, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="outline" className="border-cyan-400/20 bg-cyan-400/5 text-cyan-200">
            <Cpu className="text-cyan-300" />
            Market intelligence layer
          </Badge>
          <h2 className="mt-5 text-3xl font-extrabold tracking-[-0.03em] text-slate-50 sm:text-5xl lg:text-6xl">
            THE SIGNALFLO <AnimatedGradientText>AI ENGINE</AnimatedGradientText>
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-sm leading-7 text-slate-400 sm:text-base">
            Built to filter market noise, identify institutional-grade
            confluence, and surface high-conviction trade opportunities in
            real time.
          </p>
        </div>

        <EngineMetricStrip />

        <div className="mt-10 grid gap-8 xl:grid-cols-[0.82fr_1.38fr] xl:items-stretch">
          <div className="grid content-start gap-4">
            <EngineWorkflowStage stage={workflowStages[0]} index={0} />
            <EngineWorkflowStage stage={workflowStages[1]} index={1} />
            <EngineWorkflowStage stage={workflowStages[2]} index={2} />
          </div>
          <DecisionEngineVisual />
        </div>

        <div className="mt-8 grid gap-3 lg:grid-cols-3">
          {engineCopyBlocks.slice(0, 3).map((copy, index) => (
            <EngineParagraphCard key={copy} copy={copy} index={index} />
          ))}
        </div>

        <MarketIntelligenceStack />

        <div className="mt-8 grid gap-3 lg:grid-cols-3">
          {engineCopyBlocks.slice(3).map((copy, index) => (
            <EngineParagraphCard key={copy} copy={copy} index={index + 3} />
          ))}
        </div>

        <EngineClosingStatement />
      </div>
    </FadeUp>
  )
}

function EngineParagraphCard({
  copy,
  index,
}: {
  copy: string
  index: number
}) {
  const [label, Icon] = engineParagraphLabels[index] as [
    string,
    ComponentType<{ className?: string }>,
  ]

  return (
    <MotionCard delay={(index % 3) * 0.05}>
      <div className="group relative h-full overflow-hidden rounded-2xl border border-blue-300/10 bg-[#081225]/78 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_18px_70px_rgba(2,8,23,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-300/28 hover:bg-[#0a1428]/90 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_24px_90px_rgba(14,165,233,0.11)] sm:p-6">
        <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(34,211,238,0.12),transparent_36%),linear-gradient(135deg,rgba(37,99,235,0.08),transparent_48%)]" />
        <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.035)_1px,transparent_1px)] bg-[size:28px_28px] opacity-35" />
        <span className="pointer-events-none absolute left-0 top-0 size-8 border-l border-t border-cyan-300/24" />
        <span className="pointer-events-none absolute bottom-0 right-0 size-8 border-b border-r border-blue-300/18" />
        <span className="pointer-events-none absolute inset-x-5 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-cyan-300 via-blue-400 to-transparent transition-transform duration-500 group-hover:scale-x-100" />
        <span className="pointer-events-none absolute -left-8 top-0 h-full w-16 -translate-x-24 rotate-12 bg-gradient-to-r from-transparent via-white/8 to-transparent opacity-0 blur-sm transition-all duration-700 group-hover:translate-x-[26rem] group-hover:opacity-100" />
        <div className="relative z-10 mb-4 flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg border border-cyan-300/12 bg-cyan-300/8 text-cyan-200 shadow-[0_0_22px_rgba(34,211,238,0.08)]">
            <Icon className="size-3.5" />
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-300">{label}</span>
        </div>
        <p className="relative z-10 text-sm leading-7 text-slate-400 sm:leading-8">{copy}</p>
      </div>
    </MotionCard>
  )
}

function EngineMetricStrip() {
  return (
    <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {engineMetrics.map(([value, label], index) => (
        <MotionCard key={label} delay={index * 0.035}>
          <div className="group relative h-full overflow-hidden rounded-xl border border-cyan-300/10 bg-[#081225]/74 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-300/24">
            <CardEffects />
            <p className="relative z-10 text-xl font-bold tracking-[-0.01em] text-cyan-200">{value}</p>
            <p className="relative z-10 mt-2 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">{label}</p>
          </div>
        </MotionCard>
      ))}
    </div>
  )
}

function EngineWorkflowStage({
  stage,
  index,
}: {
  stage: (typeof workflowStages)[number]
  index: number
}) {
  return (
    <MotionCard delay={index * 0.06}>
      <div className="group relative overflow-hidden rounded-2xl border border-blue-300/10 bg-[#071326]/82 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_18px_60px_rgba(2,8,23,0.32)] transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-300/24">
        <CardEffects />
        <div className="relative z-10 flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-blue-300">{stage.step}</p>
            <h3 className="mt-2 text-lg font-bold tracking-[-0.01em] text-slate-100">{stage.title}</h3>
          </div>
          {stage.score ? (
            <div className="rounded-xl border border-cyan-300/15 bg-cyan-300/8 px-4 py-3 text-center shadow-[0_0_30px_rgba(34,211,238,0.08)]">
              <p className="text-3xl font-semibold text-cyan-300">{stage.score}</p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">High Conviction</p>
            </div>
          ) : (
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-cyan-300/10 bg-cyan-300/8 text-cyan-200">
              {index === 0 ? <RadioTower className="size-4" /> : <Bot className="size-4" />}
            </span>
          )}
        </div>
        <p className="relative z-10 mt-4 text-sm leading-6 text-slate-400">{stage.copy}</p>
        <div className="relative z-10 mt-5 flex flex-wrap gap-2">
          {stage.chips.map((chip, chipIndex) => (
            <motion.span
              key={chip}
              className="rounded-full border border-white/[0.07] bg-white/[0.035] px-2.5 py-1 text-[10px] text-slate-400"
              animate={{ opacity: [0.55, 1, 0.55] }}
              transition={{ duration: 2.6, repeat: Infinity, delay: chipIndex * 0.13, ease: "easeInOut" }}
            >
              {chip}
            </motion.span>
          ))}
        </div>
        {index === 1 && (
          <div className="relative z-10 mt-5 h-16 overflow-hidden rounded-lg border border-white/[0.06] bg-black/18">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(34,211,238,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(34,211,238,0.08)_1px,transparent_1px)] bg-[size:28px_28px]" />
            <motion.div
              className="absolute left-3 top-1/2 size-2 rounded-full bg-cyan-300 shadow-[0_0_16px_rgba(34,211,238,0.9)]"
              animate={{ x: [0, 250, 0], y: [-10, 8, -10] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute inset-y-0 w-16 bg-gradient-to-r from-transparent via-cyan-300/10 to-transparent"
              animate={{ x: ["-20%", "620%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
          </div>
        )}
      </div>
    </MotionCard>
  )
}

function DecisionEngineVisual() {
  const networkPaths = [
    "M88 88 C210 156, 258 196, 360 252 S520 362, 660 420",
    "M88 420 C216 340, 270 306, 360 252 S520 144, 660 88",
    "M72 254 C200 252, 268 252, 360 252 S520 254, 676 254",
    "M360 58 C360 162, 360 190, 360 252 S360 354, 360 454",
    "M150 150 C238 184, 284 210, 360 252 S474 302, 574 356",
    "M150 354 C238 310, 284 284, 360 252 S474 198, 574 150",
  ]

  return (
    <motion.div
      className="group relative min-h-[620px] overflow-hidden rounded-3xl border border-cyan-300/14 bg-[#07111f]/90 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_36px_140px_rgba(14,165,233,0.16)] sm:p-5 lg:min-h-[720px]"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
    >
      <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(34,211,238,0.2),transparent_38%),radial-gradient(circle_at_22%_20%,rgba(37,99,235,0.18),transparent_26%)]" />
      <motion.span
        className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-cyan-300/16 to-transparent"
        animate={{ y: ["-35%", "650%"], opacity: [0, 0.9, 0] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
      />
      <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.055)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.055)_1px,transparent_1px)] bg-[size:38px_38px]" />

      <div className="relative z-10 flex items-center justify-between gap-4 rounded-2xl border border-white/[0.07] bg-black/20 p-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Decision engine</p>
          <p className="mt-1 text-sm text-slate-500">AI Evaluating... confluence scan active</p>
        </div>
        <span className="flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/8 px-3 py-1 text-xs text-cyan-200">
          <motion.span
            className="size-1.5 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(34,211,238,0.8)]"
            animate={{ scale: [1, 1.9, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
          Live
        </span>
      </div>

      <div className="relative mt-4 min-h-[520px] overflow-hidden rounded-2xl border border-white/[0.06] bg-[#050b16]/86 p-4 lg:min-h-[620px]">
        <svg className="absolute inset-0 size-full opacity-85" viewBox="0 0 720 520" preserveAspectRatio="none">
          <defs>
            <linearGradient id="engine-line-gradient" x1="0" x2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.08" />
              <stop offset="55%" stopColor="#22d3ee" stopOpacity="0.78" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0.08" />
            </linearGradient>
            <filter id="engine-node-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {networkPaths.map((path, index) => (
            <g key={path}>
              <motion.path
                d={path}
                fill="none"
                stroke="url(#engine-line-gradient)"
                strokeWidth="1.4"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.35, delay: index * 0.1, ease: "easeOut" }}
              />
              <motion.circle
                r="3.2"
                fill="#67e8f9"
                filter="url(#engine-node-glow)"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, delay: index * 0.35, ease: "easeInOut" }}
              >
                <animateMotion dur={`${4.5 + index * 0.35}s`} repeatCount="indefinite" path={path} />
              </motion.circle>
            </g>
          ))}
        </svg>

        <motion.div
          className="absolute left-1/2 top-1/2 flex size-48 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-cyan-300/25 bg-cyan-300/8 shadow-[0_0_92px_rgba(34,211,238,0.22)] sm:size-56"
          animate={{ boxShadow: ["0 0 54px rgba(34,211,238,0.15)", "0 0 118px rgba(34,211,238,0.3)", "0 0 54px rgba(34,211,238,0.15)"] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.span className="absolute -inset-8 rounded-full border border-cyan-300/10" animate={{ scale: [0.94, 1.08, 0.94], opacity: [0.25, 0.6, 0.25] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
          <motion.span className="absolute -inset-2 rounded-full border border-blue-300/12" animate={{ rotate: 360 }} transition={{ duration: 18, repeat: Infinity, ease: "linear" }} />
          <motion.span className="absolute inset-4 rounded-full border border-cyan-300/15" animate={{ rotate: -360 }} transition={{ duration: 24, repeat: Infinity, ease: "linear" }} />
          <motion.span
            className="absolute left-1/2 top-1/2 h-px w-28 origin-left bg-gradient-to-r from-cyan-300/80 to-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 4.2, repeat: Infinity, ease: "linear" }}
          />
          <div className="relative text-center">
            <Bot className="mx-auto size-8 text-cyan-200" />
            <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">AI Evaluating...</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-200">Signal score</p>
            <motion.p className="mt-1 text-5xl font-semibold text-cyan-300" animate={{ opacity: [0.78, 1, 0.78] }} transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}>
              94.2
            </motion.p>
          </div>
        </motion.div>

        <div className="relative z-10 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {engineLabels.map((label, index) => (
            <motion.div
              key={label}
              className={cn(
                "relative rounded-lg border border-white/[0.07] bg-[#071326]/86 px-3 py-2 text-[11px] text-slate-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)] backdrop-blur",
                index % 3 === 1 && "sm:mt-10",
                index % 3 === 2 && "sm:mt-20",
              )}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              animate={{ boxShadow: ["inset 0 1px 0 rgba(255,255,255,0.035),0 0 0 rgba(34,211,238,0)", "inset 0 1px 0 rgba(255,255,255,0.05),0 0 22px rgba(34,211,238,0.08)", "inset 0 1px 0 rgba(255,255,255,0.035),0 0 0 rgba(34,211,238,0)"] }}
              transition={{ duration: 3.2, repeat: Infinity, delay: index * 0.13, ease: "easeInOut" }}
              whileHover={{ y: -3, borderColor: "rgba(34,211,238,0.28)" }}
            >
              <span className="absolute left-2 top-2 size-1 rounded-full bg-cyan-300/80" />
              <span className="pl-3">{label}</span>
            </motion.div>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-x-4 bottom-4 z-10 grid gap-2 sm:grid-cols-3">
          {[
            ["Noise filtered", "Low-quality setups removed"],
            ["Confluence", "Independent factors aligned"],
            ["Risk profile", "Structure and asymmetry scored"],
          ].map(([title, copy]) => (
            <div key={title} className="rounded-lg border border-cyan-300/10 bg-cyan-300/[0.045] p-3 backdrop-blur">
              <p className="text-xs font-medium text-cyan-200">{title}</p>
              <p className="mt-1 text-[11px] leading-4 text-slate-500">{copy}</p>
            </div>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-4 hidden sm:block">
          {intelligenceDiscoveries.map(([title, subject, value], index) => (
            <motion.div
              key={title}
              className={cn(
                "absolute w-44 rounded-xl border border-cyan-300/12 bg-[#081225]/88 p-3 shadow-[0_18px_50px_rgba(2,8,23,0.36)] backdrop-blur",
                index === 0 && "left-5 top-12",
                index === 1 && "right-8 top-20",
                index === 2 && "left-10 bottom-28",
                index === 3 && "right-6 bottom-32",
                index === 4 && "left-1/2 top-6 -translate-x-1/2",
                index === 5 && "left-1/2 bottom-20 -translate-x-1/2",
              )}
              animate={{ opacity: [0.28, 1, 0.28], y: [0, -8, 0] }}
              transition={{ duration: 5.2, repeat: Infinity, delay: index * 0.55, ease: "easeInOut" }}
            >
              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-cyan-300">{title}</p>
              <p className="mt-2 text-sm font-semibold text-slate-100">{subject}</p>
              <p className="mt-1 text-[11px] text-slate-500">{value}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

function MarketIntelligenceStack() {
  return (
    <div className="mt-14">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-400">Architecture</p>
        <h3 className="mt-3 text-3xl font-bold tracking-[-0.02em] text-slate-50 sm:text-4xl">
          MARKET INTELLIGENCE <AnimatedGradientText>STACK</AnimatedGradientText>
        </h3>
      </div>
      <div className="relative mx-auto mt-8 max-w-6xl overflow-hidden rounded-3xl border border-cyan-300/10 bg-[#050b16]/82 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_28px_120px_rgba(2,8,23,0.42)] sm:p-6 lg:p-8">
        <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(34,211,238,0.14),transparent_38%),radial-gradient(circle_at_12%_20%,rgba(37,99,235,0.14),transparent_28%)]" />
        <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.035)_1px,transparent_1px)] bg-[size:34px_34px] opacity-50" />
        <motion.span
          className="pointer-events-none absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-transparent via-cyan-300/10 to-transparent"
          animate={{ x: ["-35%", "1120%"] }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />

        <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr_230px_1fr] lg:items-center">
          <div className="grid gap-3">
            {engineFeatures.slice(0, 3).map((feature, index) => (
              <EngineLayerModule key={feature.title} feature={feature} index={index} />
            ))}
          </div>

          <div className="relative mx-auto flex size-48 items-center justify-center rounded-full border border-cyan-300/14 bg-cyan-300/8 shadow-[0_0_72px_rgba(34,211,238,0.16)] lg:size-56">
            <motion.span className="absolute -inset-8 rounded-full border border-cyan-300/8" animate={{ rotate: 360 }} transition={{ duration: 28, repeat: Infinity, ease: "linear" }} />
            <motion.span className="absolute -inset-3 rounded-full border border-blue-300/10" animate={{ rotate: -360 }} transition={{ duration: 22, repeat: Infinity, ease: "linear" }} />
            <div className="relative text-center">
              <Cpu className="mx-auto size-7 text-cyan-200" />
              <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">AI Confluence</p>
              <p className="mt-1 text-xl font-bold text-slate-100">Core</p>
            </div>
            <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-cyan-300/30 to-transparent lg:block" />
            <div className="absolute top-1/2 hidden h-px w-[calc(100vw)] -translate-y-1/2 bg-gradient-to-r from-transparent via-cyan-300/20 to-transparent lg:block" />
          </div>

          <div className="grid gap-3">
            {engineFeatures.slice(3).map((feature, index) => (
              <EngineLayerModule key={feature.title} feature={feature} index={index + 3} alignRight />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function EngineLayerModule({
  feature,
  index,
  alignRight = false,
}: {
  feature: (typeof engineFeatures)[number]
  index: number
  alignRight?: boolean
}) {
  const Icon = feature.icon

  return (
    <motion.div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-blue-300/10 bg-[#081225]/82 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_18px_70px_rgba(2,8,23,0.3)] transition-all duration-300 hover:border-cyan-300/28 hover:bg-[#0a1428]/88 sm:p-5",
        alignRight ? "lg:translate-x-4" : "lg:-translate-x-4",
      )}
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: "easeOut" }}
      whileHover={{ y: -4, x: alignRight ? -4 : 4 }}
    >
      <CardEffects />
      <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(34,211,238,0.08),transparent_42%)] opacity-80" />
      <div className="relative z-10 flex items-start gap-4">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-cyan-300/12 bg-cyan-300/8 text-cyan-200 shadow-[0_0_28px_rgba(34,211,238,0.08)] transition-all duration-300 group-hover:shadow-[0_0_36px_rgba(34,211,238,0.18)]">
          <Icon className="size-4" />
        </span>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-300">Layer 0{index + 1}</p>
          <h4 className="mt-1 text-base font-semibold tracking-[-0.01em] text-slate-100">{feature.title}</h4>
          <p className="mt-2 text-xs leading-5 text-slate-500">{feature.copy}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {engineLayerChips[index].map((chip) => (
              <span key={chip} className="rounded-full border border-white/[0.07] bg-white/[0.035] px-2 py-0.5 text-[10px] text-slate-500">
                {chip}
              </span>
            ))}
          </div>
        </div>
      </div>
      <span className={cn("absolute top-1/2 hidden size-2 -translate-y-1/2 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.8)] lg:block", alignRight ? "-left-1" : "-right-1")} />
    </motion.div>
  )
}

function EngineClosingStatement() {
  const scrollToPricing = () => {
    document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <motion.div
      className="relative mt-14 overflow-hidden rounded-3xl border border-cyan-300/14 bg-[#07111f]/90 p-6 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_32px_130px_rgba(14,165,233,0.16)] sm:p-10 lg:p-12"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
    >
      <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(34,211,238,0.24),transparent_42%),radial-gradient(circle_at_50%_70%,rgba(37,99,235,0.16),transparent_44%)]" />
      <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.035)_1px,transparent_1px)] bg-[size:36px_36px] opacity-45" />
      <motion.span
        className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-transparent via-cyan-300/10 to-transparent"
        animate={{ x: ["-40%", "1280%"] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "linear" }}
      />
      <span className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />
      <div className="relative z-10 mx-auto max-w-4xl">
        <Badge variant="outline" className="border-cyan-400/20 bg-cyan-400/5 text-cyan-200">
          <Sparkles className="text-cyan-300" />
          SignalFlo Advantage
        </Badge>
        <div className="mx-auto mt-7 grid max-w-xl grid-cols-[1fr_auto_1fr] items-center gap-3 text-[10px] uppercase tracking-[0.18em] text-slate-600">
          <span className="h-px bg-gradient-to-r from-transparent to-cyan-300/24" />
          <span className="rounded-full border border-cyan-300/12 bg-cyan-300/8 px-3 py-1 text-cyan-200">Alert filtered through intelligence layers</span>
          <span className="h-px bg-gradient-to-l from-transparent to-cyan-300/24" />
        </div>
        <h3 className="mt-6 text-3xl font-extrabold tracking-[-0.03em] text-slate-50 sm:text-5xl">
          NOT MORE ALERTS. <AnimatedGradientText>BETTER INTELLIGENCE.</AnimatedGradientText>
        </h3>
        <p className="mx-auto mt-5 max-w-3xl text-sm leading-7 text-slate-400 sm:text-base">
          SignalFlo does not generate alerts because a single indicator crossed
          a line.
        </p>
        <p className="mx-auto mt-4 max-w-4xl text-sm leading-7 text-slate-400 sm:text-base">
          Every opportunity must pass through multiple layers of market
          intelligence, confluence analysis, liquidity validation, risk
          modeling, and contextual confirmation before it reaches the platform.
        </p>
        <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
          The result is fewer alerts, higher conviction, and a more disciplined
          approach to identifying opportunities in today's markets.
        </p>
        <Button
          type="button"
          onClick={scrollToPricing}
          className="group mt-8 h-12 border border-cyan-300/20 bg-cyan-300/8 px-6 text-cyan-100 shadow-[0_0_34px_rgba(34,211,238,0.14)] transition-all hover:-translate-y-0.5 hover:border-cyan-300/40 hover:bg-cyan-300/12 hover:shadow-[0_0_48px_rgba(34,211,238,0.22)]"
          variant="outline"
        >
          JOIN NOW
          <motion.span
            className="ml-1 inline-block"
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          >
            ↓
          </motion.span>
        </Button>
      </div>
    </motion.div>
  )
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

async function recordLegalAcceptance(plan: PricingPlan) {
  const { url, anonKey } = supabaseConfig

  if (!url || !anonKey) {
    console.warn(
      "SignalFlo legal acceptance was not saved because VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is missing.",
    )
    return
  }

  const response = await fetch(`${url.replace(/\/$/, "")}/rest/v1/legal_acceptances`, {
    method: "POST",
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      selected_plan: plan.name,
      legal_version: LEGAL_VERSION,
      source: LEGAL_ACCEPTANCE_SOURCE,
      user_agent: window.navigator.userAgent,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Supabase legal acceptance insert failed: ${response.status} ${errorText}`)
  }
}

function LegalAcknowledgmentModal({
  plan,
  onClose,
}: {
  plan: PricingPlan | null
  onClose: () => void
}) {
  const [accepted, setAccepted] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    setAccepted(false)
    setIsProcessing(false)

    if (!plan) {
      document.body.style.overflow = ""
      return
    }

    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  }, [plan])

  if (!plan) {
    return null
  }

  const handleContinue = async () => {
    if (!accepted || isProcessing) {
      return
    }

    if (!plan.checkoutUrl) {
      console.warn(
        `SignalFlo checkout redirect prevented: missing Whop checkout URL for ${plan.name}. Configure ${plan.checkoutEnvName}.`,
      )
      return
    }

    setIsProcessing(true)

    try {
      await recordLegalAcceptance(plan)
    } catch (error) {
      console.error("SignalFlo legal acceptance could not be saved before Whop redirect. Continuing to checkout.", error)
    }

    window.location.href = plan.checkoutUrl
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
      <button
        type="button"
        aria-label="Close checkout acknowledgment"
        className="absolute inset-0 bg-slate-950/82 backdrop-blur-md"
        onClick={isProcessing ? undefined : onClose}
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="legal-acknowledgment-title"
        className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-cyan-300/14 bg-[#07111f]/96 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_30px_120px_rgba(2,8,23,0.72)] sm:p-6"
        initial={{ opacity: 0, y: 18, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
      >
        <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.17),transparent_42%)]" />
        <span className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />
        <div className="relative z-10">
          <Badge variant="outline" className="border-cyan-400/20 bg-cyan-400/5 text-cyan-200">
            Checkout protection
          </Badge>
          <h2 id="legal-acknowledgment-title" className="mt-4 text-2xl font-bold tracking-[-0.015em] text-slate-50">
            Before You Continue
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Before joining SignalFlo, please review and acknowledge the following:
          </p>
          <div className="mt-5 rounded-xl border border-white/[0.07] bg-white/[0.025] p-4">
            <p className="text-sm font-medium text-slate-200">{plan.name}</p>
            <p className="mt-1 text-2xl font-semibold text-cyan-300">{plan.price}</p>
          </div>

          <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl border border-blue-300/10 bg-[#081225]/86 p-4 transition-colors hover:border-cyan-300/22">
            <input
              type="checkbox"
              required
              checked={accepted}
              onChange={(event) => setAccepted(event.target.checked)}
              className="mt-1 size-4 shrink-0 rounded border-cyan-300/25 bg-slate-950 accent-cyan-400"
            />
            <span className="text-sm leading-6 text-slate-400">
              I have read and agree to the{" "}
              <a
                href={LEGAL_URL}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-cyan-300 underline-offset-4 transition-colors hover:text-cyan-200 hover:underline"
                onClick={(event) => event.stopPropagation()}
              >
                Terms, Risk Disclosure & Refund Policy
              </a>
              , including the no-refund policy, risk disclosure, automatic
              renewal terms, and the fact that SignalFlo provides AI-generated
              market insights, alerts, and educational content only, not
              personalized investment advice.
            </span>
          </label>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              className="border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
              onClick={onClose}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-blue-500 text-white shadow-[0_0_26px_rgba(59,130,246,0.24)] transition-all hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={handleContinue}
              disabled={!accepted || isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Processing
                </>
              ) : (
                "Continue to Checkout"
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function Pricing({ onSelectPlan }: { onSelectPlan: (plan: PricingPlan) => void }) {
  return (
    <FadeUp as="section" id="pricing" className="relative overflow-hidden px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="pointer-events-none absolute left-1/2 top-[58%] h-[560px] w-[980px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.13),rgba(37,99,235,0.08),transparent_62%)] blur-2xl" />
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
                "group relative flex h-full min-h-[690px] flex-col overflow-hidden rounded-2xl border border-blue-300/10 bg-[#081225]/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_22px_70px_rgba(2,8,23,0.42)] transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/30 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_28px_90px_rgba(14,165,233,0.14)]",
                plan.name === "Annual" && "border-cyan-300/30 bg-[#0a1428] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_0_60px_rgba(34,211,238,0.14)]",
                plan.name === "Founder Lifetime" && "border-blue-300/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_0_50px_rgba(59,130,246,0.1)]",
              )}
            >
              <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.16),transparent_36%)] opacity-80" />
              <span className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent" />
              <span className="pointer-events-none absolute -left-8 top-0 h-full w-16 -translate-x-24 rotate-12 bg-gradient-to-r from-transparent via-white/8 to-transparent opacity-0 blur-sm transition-all duration-700 group-hover:translate-x-[26rem] group-hover:opacity-100" />
              <CardHeader className="relative z-10 min-h-[340px] p-6 sm:p-7">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <CardDescription className="mt-2 min-h-10 text-sm leading-6 text-slate-500">{plan.copy}</CardDescription>
                  </div>
                  {plan.name === "Annual" && (
                    <Badge className="shrink-0 bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.25)]">Most Popular</Badge>
                  )}
                </div>
                <div className="mt-6 flex items-end gap-2">
                  <p className="text-4xl font-bold tracking-[-0.02em] text-cyan-300">{plan.price}</p>
                </div>
                <div className="mt-6 min-h-40 space-y-2.5 text-xs text-slate-500">
                  {plan.details.map((detail) => (
                    <p
                      key={detail}
                      className={cn(
                        detail.includes("Save") || detail.includes("Limited") ? "text-blue-300" : "",
                        detail.includes("$199.58") || detail.includes("Lifetime") || detail.includes("Future") ? "text-cyan-300" : "",
                      )}
                    >
                      {detail}
                    </p>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="relative z-10 flex flex-1 flex-col px-6 pb-6 sm:px-7 sm:pb-7">
                <Button
                  type="button"
                  onClick={() => onSelectPlan(plan)}
                  className={cn(
                    "h-10 w-full transition-all hover:-translate-y-0.5",
                    plan.name === "Annual"
                      ? "bg-blue-500 text-white shadow-[0_0_26px_rgba(59,130,246,0.24)] hover:bg-blue-400"
                      : "border-white/10 bg-white/[0.04] hover:bg-white/[0.07]",
                  )}
                  variant={plan.name === "Annual" ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>
                <div className="mt-8 space-y-3.5">
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
        Annual savings are calculated against the $295 monthly plan billed for 12 months.
      </p>
      <p className="mx-auto mt-3 max-w-3xl text-center text-xs leading-5 text-slate-500">
        Trading involves substantial risk. SignalFlo provides AI-generated market
        insights, alerts, and educational content only. Past performance does
        not guarantee future results.
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
        <h2 className="mt-5 text-3xl font-bold tracking-[-0.02em] sm:text-5xl">
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
              ["Legal", "Terms, Risk Disclosure & Refund Policy", "Disclaimer", "Privacy"],
            ].map(([head, ...links]) => (
              <div key={head}>
                <p className="text-xs font-semibold text-slate-300">{head}</p>
                <div className="mt-3 space-y-2">
                  {links.map((link) => (
                    <a
                      key={link}
                      href={
                        link === "Login"
                          ? APP_URL
                          : link === "Terms, Risk Disclosure & Refund Policy"
                            ? LEGAL_URL
                            : "#"
                      }
                      className="block text-xs text-slate-500 transition-colors hover:text-cyan-300"
                    >
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
      <h2 className="mt-3 text-3xl font-bold tracking-[-0.02em] sm:text-4xl">
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
