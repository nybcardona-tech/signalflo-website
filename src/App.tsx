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

const commandCenterAlerts = [
  { ticker: "NVDA CALL", direction: "Call", score: 94, entry: "$924.20", tp: "$952.80", sl: "$908.40", status: "Active" },
  { ticker: "SPY 525C", direction: "Option", score: 88, entry: "$3.20", tp: "$4.10", sl: "$2.65", status: "Watching" },
  { ticker: "TSLA", direction: "Short", score: 81, entry: "$178.30", tp: "$171.50", sl: "$182.90", status: "Triggered" },
  { ticker: "MSFT", direction: "Long", score: 86, entry: "$421.10", tp: "$431.40", sl: "$416.20", status: "Active" },
] as const

const cardSurfaceClass =
  "group relative h-full overflow-hidden rounded-xl border border-blue-300/12 bg-[#080d20]/92 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_18px_50px_rgba(2,8,23,0.36)] transition-all duration-300 hover:border-cyan-300/30 hover:bg-[#0a1226] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_20px_70px_rgba(14,165,233,0.12),0_0_36px_rgba(124,58,237,0.08)]"

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
      "Priority onboarding",
    ],
    features: corePricingFeatures,
  },
]

type PricingPlan = (typeof pricingPlans)[number]
type PricingPlanName = PricingPlan["name"]

const pricingBaseFeatures = [
  "AI trade alerts",
  "Stock alerts",
  "Options alerts",
  "Active dashboard",
  "Historical tracking",
  "AI confidence scoring",
  "Discord access",
  "Telegram access",
  "Email support",
]

const pricingPlanMeta: Record<PricingPlanName, {
  chip: string
  priceMain: string
  unit: string
  support: string
  cta: string
  benefits: string[]
}> = {
  Monthly: {
    chip: "Best Flexibility",
    priceMain: "$295",
    unit: "/month",
    support: "Billed monthly",
    cta: "Start Monthly Access",
    benefits: ["Full platform access", "Renews monthly until canceled"],
  },
  Annual: {
    chip: "Best Value",
    priceMain: "$2,395",
    unit: "/year",
    support: "Billed annually",
    cta: "Get Annual Access",
    benefits: ["$199.58/month equivalent", "Save $1,145/year"],
  },
  "Founder Lifetime": {
    chip: "Founding Member",
    priceMain: "$4,995",
    unit: "one-time",
    support: "One-time founding member access",
    cta: "Become a Founding Member",
    benefits: [
      "One-time payment",
      "Lifetime platform access",
      "Future premium categories included",
      "Priority onboarding",
    ],
  },
}

const faqs = [
  ["How often are alerts sent?", "Alert frequency depends on market conditions and setup quality. SignalFlo prioritizes clear trade ideas over constant noise."],
  ["Do I need trading experience?", "Some trading familiarity helps. SignalFlo makes alerts easier to review, but users should manage their own risk."],
  ["Are results guaranteed?", "No. SignalFlo provides trade alerts, market research, and educational tools. Trading involves risk, and users are responsible for their own decisions."],
  ["What markets do you cover?", "SignalFlo focuses on stocks and options, with support for ETFs and short-term market opportunities."],
  ["Is this financial advice?", "No. SignalFlo is software for alerts, research, and education. It does not provide individualized financial advice."],
]

const dashboardTabs = ["Overview", "Active Alerts", "Closed Trades"]

const dashboardAlerts = [
  { ticker: "NVDA", detail: "Entry zone watched", score: "92%", state: "Live", time: "2m ago" },
  { ticker: "SPY 525C", detail: "Target 1 near", score: "88%", state: "Active", time: "5m ago" },
  { ticker: "MSFT", detail: "Momentum confirmed", score: "84%", state: "Tracking", time: "9m ago" },
  { ticker: "AMD", detail: "Stop level guarded", score: "79%", state: "Review", time: "14m ago" },
  { ticker: "AAPL", detail: "Closed setup logged", score: "76%", state: "Closed", time: "18m ago" },
]

const closedDashboardAlerts = [
  ["TSLA", "Closed TP1", "11:42 AM"],
  ["QQQ 530C", "Stopped", "10:18 AM"],
  ["COIN", "Closed review", "9:36 AM"],
]

const closedTradeExamples = [
  ["NVDA", "+128%", "Target Hit"],
  ["COIN", "+118%", "Breakout Closed"],
  ["SPY", "+82%", "Call Spread"],
  ["AAPL", "+64%", "Momentum"],
  ["QQQ", "+58%", "Closed Win"],
  ["TSLA", "ALERT", "Review"],
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
  if (window.location.pathname === LEGAL_URL) {
    return <LegalPage />
  }

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <Navbar />
      <Hero />
      <Features />
      <Process />
      <WhySignalFlo />
      <SignalFloEngine />
      <Pricing />
      <Faq />
      <Footer />
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
    <section id="dashboard" className="relative min-h-[100svh] overflow-hidden border-b border-white/[0.06] lg:min-h-screen">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_22%,rgba(56,189,248,0.2),transparent_28%),radial-gradient(circle_at_82%_35%,rgba(124,58,237,0.14),transparent_25%),radial-gradient(circle_at_18%_20%,rgba(37,99,235,0.16),transparent_24%),linear-gradient(180deg,#07111f_0%,#050914_100%)]" />
      <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:48px_48px]" />
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col px-4 pb-0 pt-[calc(3.5rem+clamp(1rem,2.4vh,1.75rem))] sm:px-6 lg:min-h-screen lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="mx-auto max-w-4xl text-center"
        >
          <Badge variant="outline" className="border-cyan-400/20 bg-cyan-400/5 text-cyan-200">
            <Sparkles className="text-cyan-300" />
            AI watchlists, alerts, and trade plans
          </Badge>
          <h1 className="mx-auto mt-4 max-w-4xl text-[2.65rem] font-extrabold leading-[0.94] tracking-[-0.035em] sm:text-5xl lg:text-[4.35rem]">
            <span className="block">AI-Powered Trading Alerts</span>
            <span className="mt-0.5 block sm:mt-1">
              <AnimatedGradientText>Built for Smarter Traders</AnimatedGradientText>
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-[15px]">
            SignalFlo AI delivers stock and options trade alerts with clear entry
            levels, targets, stop loss, confidence scoring, and real-time tracking
            from one clean dashboard.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
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
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {["Stock alerts", "Options alerts", "Real-time tracking", "Risk levels", "AI confidence scoring"].map((chip) => (
              <span key={chip} className="rounded-full border border-cyan-300/10 bg-cyan-300/6 px-3 py-1 text-[11px] font-medium text-slate-400">
                {chip}
              </span>
            ))}
          </div>
        </motion.div>
        <HeroDashboardCard />
      </div>
    </section>
  )
}

function HeroDashboardCard() {
  const [activeAlert, setActiveAlert] = useState(0)
  const [updatedIndex, setUpdatedIndex] = useState(0)
  const [showToast, setShowToast] = useState(true)
  const updatedLabels = ["8s", "12s", "18s"]

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveAlert((current) => (current + 1) % dashboardAlerts.length)
      setUpdatedIndex((current) => (current + 1) % updatedLabels.length)
      setShowToast(true)
      window.setTimeout(() => setShowToast(false), 1800)
    }, 3300)

    return () => window.clearInterval(interval)
  }, [updatedLabels.length])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.12 }}
      className="relative mx-auto mt-[clamp(1.75rem,4vh,3rem)] -mb-[clamp(2rem,7vh,4.5rem)] w-full max-w-[78rem] overflow-visible rounded-t-[2rem]"
    >
      <motion.div
        className="absolute inset-0 scale-[1.04] rounded-[2rem] bg-[radial-gradient(circle_at_50%_18%,rgba(34,211,238,0.18),rgba(124,58,237,0.12),transparent_68%)] blur-3xl"
        animate={{ opacity: [0.5, 0.9, 0.5], scale: [0.98, 1.02, 0.98] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative overflow-hidden rounded-t-xl border border-b-0 border-cyan-300/18 bg-[#071121]/95 p-2 shadow-2xl shadow-cyan-950/50 ring-1 ring-purple-400/10 sm:p-2.5">
        <BorderBeam />
        <motion.div
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-20 bg-gradient-to-b from-cyan-300/10 via-cyan-300/3 to-transparent"
          animate={{ y: ["-30%", "520%"] }}
          transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
        />
        <div className="relative z-10">
          <div className="mb-2 flex flex-col gap-2 border-b border-white/[0.07] pb-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-1.5">
              <span className="size-2.5 rounded-full bg-red-400" />
              <span className="size-2.5 rounded-full bg-yellow-400" />
              <span className="size-2.5 rounded-full bg-green-400" />
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] sm:justify-end">
              <span className="flex items-center gap-2 text-cyan-300">
                <motion.span
                  className="size-2 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(34,211,238,0.85)]"
                  animate={{ scale: [1, 1.45, 1], opacity: [0.65, 1, 0.65] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                />
                Live
              </span>
              <span className="text-slate-400">Updated {updatedLabels[updatedIndex]} ago</span>
              <span className="rounded-full border border-cyan-300/12 bg-cyan-300/8 px-2 py-1 text-cyan-200">US cash session open</span>
              <span className="text-cyan-300">SignalFlo Command Center</span>
            </div>
          </div>

          <div className="mb-2 grid gap-1.5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Market Session", "Regular Hours", "Live tape"],
              ["Active Alerts", "7", "2 new today"],
              ["Watchlist", "24", "Stocks + options"],
              ["Recent Closed", "12", "Reviewed today"],
            ].map(([label, value, detail], index) => (
              <motion.div
                key={label}
                className="rounded-lg border border-white/[0.07] bg-white/[0.025] px-2.5 py-1"
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
              >
                <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">{label}</p>
                <p className="mt-1 text-sm font-semibold text-slate-200">{value}</p>
                <p className="mt-0.5 text-[10px] text-cyan-200/85">{detail}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="grid items-start gap-2.5 lg:grid-cols-[1.72fr_0.54fr]"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <DashboardPanel className="p-2.5">
              <div className="mb-1.5 flex flex-col gap-2 text-xs sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className="font-medium text-slate-300">Portfolio watch</span>
                  <p className="mt-1 text-[11px] text-slate-400">Live alerts / Open trade plans / Closed history</p>
                </div>
                <span className="text-cyan-300">+$2,436 tracked</span>
              </div>
              <LiveAlertCommandCenter activeAlert={activeAlert} />
              <ClosedTradesCarousel />
            </DashboardPanel>

            <div className="grid content-start gap-2.5 sm:grid-cols-2 lg:grid-cols-1">
              <DashboardPanel className="relative p-2.5">
                {showToast && (
                  <motion.div
                    className="absolute right-3 top-3 z-20 rounded-md border border-cyan-300/20 bg-[#071121]/95 px-3 py-2 text-[11px] text-cyan-200 shadow-[0_0_28px_rgba(34,211,238,0.14)]"
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  >
                    <p>New Alert Received</p>
                    <p className="mt-0.5 text-[9px] uppercase tracking-[0.16em] text-slate-500">AI Score 94</p>
                  </motion.div>
                )}
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-slate-200">Live Signal Feed</p>
                  <span className="text-[10px] text-cyan-200/75">{dashboardAlerts.length} active</span>
                </div>
                <div className="mt-2 space-y-1.5">
                  {dashboardAlerts.slice(0, 4).map((alert, index) => (
                    <motion.div
                      key={alert.ticker}
                      className={cn(
                        "rounded-md border px-2.5 py-1.5 text-xs transition-colors",
                        activeAlert === index
                          ? "border-cyan-300/30 bg-cyan-300/10 shadow-[0_0_20px_rgba(34,211,238,0.08)]"
                          : "border-white/[0.06] bg-white/[0.025] hover:border-blue-300/18 hover:bg-blue-400/[0.035]",
                      )}
                      animate={activeAlert === index ? { x: [0, 2, 0] } : { x: 0 }}
                      transition={{ duration: 0.45 }}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-medium text-slate-200">{alert.ticker}</span>
                        <span className={index === 1 ? "text-blue-300" : "text-cyan-300"}>{alert.score}</span>
                      </div>
                      <div className="mt-1 flex items-center justify-between gap-3 text-[10px] text-slate-400">
                        <span>{alert.detail}</span>
                        <span className="text-slate-500">{alert.time}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </DashboardPanel>

              <StocksWatchlistPanel />
            </div>
          </motion.div>

        </div>
      </div>
    </motion.div>
  )
}

function ClosedTradesCarousel() {
  const items = [...closedTradeExamples, ...closedTradeExamples]

  return (
    <div className="mt-2 rounded-lg border border-white/[0.07] bg-white/[0.018] p-2.5">
      <div className="mb-1.5 flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-200">Recently Closed Trades</p>
        <span className="text-[10px] uppercase tracking-[0.18em] text-cyan-300/70">Alert - Track - Close - Review</span>
      </div>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-[#071121] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-[#071121] to-transparent" />
        <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="animate-ticker flex w-max gap-2.5 pr-2 hover:[animation-play-state:paused]">
            {items.map(([ticker, result, note], index) => (
              <motion.div
                key={`${ticker}-${index}`}
                className="group relative w-[172px] shrink-0 overflow-hidden rounded-lg border border-cyan-300/12 bg-[#081326]/92 px-3 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_14px_36px_rgba(2,8,23,0.24)] transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-300/24 hover:bg-emerald-300/[0.035] hover:shadow-[0_18px_48px_rgba(16,185,129,0.08)]"
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.28, delay: (index % closedTradeExamples.length) * 0.035 }}
              >
                <span className="pointer-events-none absolute inset-x-3 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-blue-500 via-cyan-300 to-purple-500 transition-transform duration-500 group-hover:scale-x-100" />
                <div className="relative z-10 flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-100">{ticker}</p>
                    <p className="mt-0.5 text-[10px] text-slate-400">{note}</p>
                  </div>
                  <span className={cn("text-lg font-bold tracking-[-0.02em]", result === "ALERT" ? "text-purple-300" : "text-emerald-300")}>
                    {result}
                  </span>
                </div>
                <div className="relative z-10 mt-2 h-1 overflow-hidden rounded-full bg-slate-800/80">
                  <span className="block h-full w-4/5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-300" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function StocksWatchlistPanel() {
  const watchlist = [
    ["NVDA", "AI momentum", "+2.84%", "up"],
    ["AAPL", "Large cap watch", "+0.64%", "up"],
    ["MSFT", "Trend holding", "+1.12%", "up"],
    ["AMD", "Semis active", "+1.75%", "up"],
    ["COIN", "Volatility bid", "+3.40%", "up"],
  ]

  return (
    <DashboardPanel className="p-2.5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-slate-200">Stocks Watchlist</p>
        <span className="text-[10px] text-cyan-300/80">Live tape</span>
      </div>
      <div className="mt-2 space-y-1.5">
        {watchlist.map(([ticker, note, move, direction], index) => (
          <motion.div
            key={ticker}
            className="flex items-center justify-between gap-3 rounded-md border border-white/[0.06] bg-white/[0.025] px-2.5 py-1.5 text-xs transition-colors hover:border-cyan-300/20 hover:bg-cyan-300/[0.035] hover:shadow-[0_0_18px_rgba(34,211,238,0.06)]"
            initial={{ opacity: 0, x: 8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: index * 0.04 }}
          >
            <div className="min-w-0">
              <p className="font-medium text-slate-200">{ticker}</p>
              <p className="mt-0.5 truncate text-[10px] text-slate-400">{note}</p>
            </div>
            <span className={cn("shrink-0 text-[11px] font-semibold", direction === "down" ? "text-red-300/80" : "text-emerald-300")}>
              {direction === "down" ? "↓" : "↑"} {move}
            </span>
          </motion.div>
        ))}
      </div>
    </DashboardPanel>
  )
}

function LiveAlertCommandCenter({ activeAlert }: { activeAlert: number }) {
  const activity = ["New Alert Received", "AI Score Updated", "Target Adjusted", "Monitoring Live"]

  return (
    <div className="relative overflow-hidden rounded-xl border border-cyan-300/12 bg-[#04101d] p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_0_34px_rgba(34,211,238,0.05)]">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.055)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.055)_1px,transparent_1px)] bg-[size:42px_42px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_8%,rgba(34,211,238,0.12),transparent_30%),radial-gradient(circle_at_18%_82%,rgba(124,58,237,0.1),transparent_28%)]" />
      <motion.div
        className="pointer-events-none absolute inset-y-0 w-28 bg-gradient-to-r from-transparent via-cyan-300/7 to-transparent"
        animate={{ x: ["-35%", "560%"] }}
        transition={{ duration: 5.6, repeat: Infinity, ease: "linear" }}
      />

      <div className="relative z-10 mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-100">LIVE ALERT COMMAND CENTER</p>
          <p className="mt-1 text-[11px] text-slate-400">AI Alert - Track - Manage - Close</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {activity.map((item, index) => (
            <motion.span
              key={item}
              className={cn(
                "rounded-full border px-2 py-0.5 text-[10px] font-medium",
                index === 0 && "border-cyan-300/14 bg-cyan-300/8 text-cyan-200",
                index === 1 && "border-blue-300/14 bg-blue-400/8 text-blue-200",
                index === 2 && "border-purple-300/14 bg-purple-400/8 text-purple-200",
                index === 3 && "border-emerald-300/14 bg-emerald-400/8 text-emerald-200",
              )}
              animate={{ opacity: activeAlert % activity.length === index ? 1 : 0.46 }}
              transition={{ duration: 0.35 }}
            >
              {item}
            </motion.span>
          ))}
        </div>
      </div>

      <div className="relative z-10 grid gap-2 sm:grid-cols-2">
        {commandCenterAlerts.map((alert, index) => (
          <CommandAlertCard
            key={alert.ticker}
            alert={alert}
            active={activeAlert % commandCenterAlerts.length === index}
            index={index}
          />
        ))}
      </div>
    </div>
  )
}

function CommandAlertCard({
  alert,
  active,
  index,
}: {
  alert: (typeof commandCenterAlerts)[number]
  active: boolean
  index: number
}) {
  const statusStyles = {
    Active: "border-cyan-300/24 bg-cyan-300/8 text-cyan-200",
    Watching: "border-blue-300/24 bg-blue-400/8 text-blue-200",
    Triggered: "border-purple-300/24 bg-purple-400/8 text-purple-200",
    Closed: "border-emerald-300/24 bg-emerald-400/8 text-emerald-200",
  } as const
  const dotStyles = {
    Active: "bg-cyan-300 shadow-[0_0_14px_rgba(34,211,238,0.9)]",
    Watching: "bg-blue-300 shadow-[0_0_14px_rgba(96,165,250,0.75)]",
    Triggered: "bg-purple-300 shadow-[0_0_14px_rgba(216,180,254,0.7)]",
    Closed: "bg-emerald-300 shadow-[0_0_14px_rgba(110,231,183,0.75)]",
  } as const

  return (
    <motion.div
      className={cn(
        "group relative overflow-hidden rounded-xl border bg-[#071326]/92 p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_16px_44px_rgba(2,8,23,0.28)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#091832]",
        active ? "border-cyan-300/34 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_0_42px_rgba(34,211,238,0.12)]" : "border-white/[0.07] hover:border-blue-300/22 hover:shadow-[0_0_28px_rgba(59,130,246,0.07)]",
      )}
      animate={active ? { y: [0, -2, 0] } : { y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.03 }}
    >
      <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(34,211,238,0.12),transparent_34%),radial-gradient(circle_at_92%_14%,rgba(124,58,237,0.1),transparent_30%)]" />
      <span className="pointer-events-none absolute -left-10 top-0 h-full w-12 -translate-x-20 rotate-12 bg-gradient-to-r from-transparent via-white/8 to-transparent opacity-0 blur-sm transition-all duration-700 group-hover:translate-x-80 group-hover:opacity-100" />
      <span className="pointer-events-none absolute inset-x-4 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-blue-500 via-cyan-300 to-purple-500 transition-transform duration-500 group-hover:scale-x-100" />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold tracking-[-0.01em] text-slate-100">{alert.ticker}</p>
              <span className="rounded-md border border-blue-300/12 bg-blue-400/8 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-blue-200">
                {alert.direction}
              </span>
            </div>
            <div className={cn("mt-1.5 inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-medium", statusStyles[alert.status])}>
              <motion.span
                className={cn("size-1.5 rounded-full", dotStyles[alert.status])}
                animate={active ? { scale: [1, 1.7, 1], opacity: [0.7, 1, 0.7] } : { scale: 1 }}
                transition={{ duration: 1.4, repeat: active ? Infinity : 0, ease: "easeInOut" }}
              />
              {alert.status}
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-[0.16em] text-slate-600">AI Score</p>
            <p className="text-xl font-bold tracking-[-0.03em] text-cyan-300">{alert.score}</p>
          </div>
        </div>

        <div className="mt-2.5 grid grid-cols-3 gap-1.5">
          {[
            ["Entry", alert.entry],
            ["TP", alert.tp],
            ["SL", alert.sl],
          ].map(([label, value]) => (
            <div key={label} className="rounded-md border border-white/[0.06] bg-white/[0.025] px-2 py-1.5">
              <p className="text-[9px] uppercase tracking-[0.14em] text-slate-600">{label}</p>
              <p className="mt-0.5 text-[11px] font-semibold text-slate-200">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-2.5 flex items-center gap-3">
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-slate-800/90">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-300 to-purple-400"
              initial={{ width: 0 }}
              whileInView={{ width: `${alert.score}%` }}
              animate={active ? { opacity: [0.75, 1, 0.75] } : { opacity: 0.92 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: index * 0.08, ease: "easeOut" }}
            />
          </div>
          <span className="text-[10px] text-slate-500">confidence</span>
        </div>
      </div>
    </motion.div>
  )
}

function MarketTicker() {
  const tickerItems = [...tickerTape, ...tickerTape]

  return (
    <section className="border-y border-cyan-300/10 bg-[#06101d]/96 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)]">
      <div className="ticker-mask mx-auto max-w-7xl overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="animate-ticker flex w-max gap-3 text-xs hover:[animation-play-state:paused] sm:text-[13px]">
          {tickerItems.map(([symbol, change, dir], index) => (
            <div
              key={`${symbol}-${index}`}
              className="flex shrink-0 items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-1.5 text-slate-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)]"
            >
              <span className="font-semibold tracking-[0.02em] text-slate-100">{symbol}</span>
              <span className={dir === "up" ? "font-semibold text-emerald-300" : "font-semibold text-red-300"}>{change}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
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

function WhySignalFlo() {
  const reasons = [
    ["Structured Alerts", Target, "Each alert is formatted around entry, target, stop, thesis, and status so the trade plan is clear."],
    ["AI-Ranked Setups", Bot, "Signals are organized by confidence and setup quality so traders can focus on stronger opportunities."],
    ["Active Trade Tracking", RadioTower, "Follow open alerts, status changes, and monitored levels from one dashboard."],
    ["Historical Review", FileClock, "Review active and closed alerts without losing context across chat threads."],
    ["Cleaner Than Discord-Only Rooms", ShieldCheck, "Use chat for community, but keep the actual alert workflow structured and searchable."],
    ["Dashboard-First Workflow", MonitorSmartphone, "Track alerts from desktop or mobile with a cleaner command center experience."],
  ] as const

  return (
    <FadeUp as="section" className="border-y border-white/[0.06] bg-[#07101f] px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          kicker="Why SignalFlo"
          title="Why Traders Use SignalFlo"
          highlight="Use SignalFlo"
          description="SignalFlo is built for traders who want structured alerts, cleaner tracking, and less noise."
        />
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:mt-10 lg:grid-cols-3">
          {reasons.map(([title, Icon, copy], index) => (
            <MotionCard key={title} delay={index * 0.04}>
              <Card className={cardSurfaceClass}>
                <CardEffects />
                <CardHeader className="relative z-10 p-5">
                  <span className="flex size-10 items-center justify-center rounded-lg border border-cyan-300/10 bg-gradient-to-br from-blue-500/24 to-cyan-300/12 text-cyan-200 shadow-[0_0_24px_rgba(34,211,238,0.08)]">
                    <Icon className="size-4" />
                  </span>
                  <CardTitle className="mt-4 text-base font-semibold tracking-[-0.01em] text-slate-100">{title}</CardTitle>
                  <CardDescription className="mt-2 text-sm leading-6 text-slate-500">{copy}</CardDescription>
                </CardHeader>
              </Card>
            </MotionCard>
          ))}
        </div>
      </div>
    </FadeUp>
  )
}

function CardEffects() {
  return (
    <>
      <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(56,189,248,0.13),transparent_34%),radial-gradient(circle_at_88%_12%,rgba(124,58,237,0.09),transparent_32%)] opacity-75" />
      <span className="pointer-events-none absolute -left-2 top-0 h-full w-16 -translate-x-24 rotate-12 bg-gradient-to-r from-transparent via-white/8 to-transparent opacity-0 blur-sm transition-all duration-700 group-hover:translate-x-[28rem] group-hover:opacity-100" />
      <span className="pointer-events-none absolute inset-x-4 bottom-0 h-px origin-left scale-x-0 rounded-full bg-gradient-to-r from-blue-500 via-cyan-300 to-purple-500 transition-transform duration-500 group-hover:scale-x-100" />
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
        <span className="flex size-10 items-center justify-center rounded-lg border border-cyan-300/10 bg-gradient-to-br from-blue-500/30 via-cyan-300/14 to-purple-500/16 text-cyan-200 shadow-[0_0_24px_rgba(34,211,238,0.08)] transition-all duration-300 group-hover:border-cyan-300/25 group-hover:shadow-[0_0_28px_rgba(34,211,238,0.18),0_0_24px_rgba(124,58,237,0.08)]">
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
  compact = false,
}: {
  alert: (typeof alertCards)[number]
  index: number
  compact?: boolean
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
      <CardContent className={cn("relative z-10", compact ? "p-3" : "p-4")}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className={cn(
              "flex shrink-0 items-center justify-center rounded-lg border border-blue-300/10 bg-blue-500/16 font-semibold text-blue-200",
              compact ? "size-8 text-[10px]" : "size-9 text-[11px]",
            )}>
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

        <p className={cn("truncate text-[11px] text-slate-500", compact ? "mt-3" : "mt-4")}>
          Entry {alert.entry} / TP {alert.tp} / SL {alert.sl}
        </p>
        <div className={cn("flex items-center gap-2", compact ? "mt-2" : "mt-3")}>
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
        <div className={cn("flex items-end justify-between", compact ? "mt-3" : "mt-5")}>
          <div>
            <p className={cn(compact ? "text-base" : "text-xl", "font-semibold", alert.status === "Alert" ? "text-blue-300" : "text-cyan-300")}>
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
  const floatingPlacements = [
    "-left-5 top-24 xl:-left-12 xl:top-28",
    "-right-5 top-28 xl:-right-12 xl:top-32",
    "bottom-8 left-8 xl:-bottom-2 xl:left-12",
    "bottom-10 right-8 xl:-bottom-3 xl:right-12",
  ]

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
    <FadeUp as="section" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
      <SectionHeading
        kicker="Product showcase"
        title="SignalFlo In Action"
        highlight="In Action"
        description="See how live alerts, dashboard tracking, trade review, and AI scoring work together inside one clean SignalFlo command center."
      />
      <div className="relative mx-auto mt-7 max-w-6xl overflow-visible rounded-[2rem] lg:mt-8">
        <motion.div
          className="absolute inset-0 scale-[1.03] rounded-[2rem] bg-[radial-gradient(circle_at_50%_20%,rgba(34,211,238,0.18),rgba(124,58,237,0.12),transparent_66%)] blur-3xl"
          animate={{ opacity: [0.55, 0.9, 0.55] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="pointer-events-none absolute inset-0 hidden lg:block">
          {alertCards.map((alert, index) => (
            <motion.div
              key={alert.ticker}
              className={cn("pointer-events-auto absolute z-30 w-[230px]", floatingPlacements[index])}
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.09, ease: "easeOut" }}
              whileHover={{ y: -6, scale: 1.025 }}
            >
              <AlertPreviewCard alert={alert} index={index} compact />
            </motion.div>
          ))}
        </div>
        <motion.div
          className="absolute right-3 top-3 z-40 hidden rounded-xl border border-cyan-300/20 bg-[#071121]/90 px-3 py-2 text-xs shadow-[0_18px_55px_rgba(34,211,238,0.16)] backdrop-blur-xl sm:block lg:right-8 lg:top-7"
          animate={{ opacity: showToast ? 1 : 0.42, y: showToast ? 0 : -5 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-2 text-cyan-200">
            <span className="size-2 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(34,211,238,0.85)]" />
            New Alert Received
          </div>
          <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-slate-500">AI Score 94</p>
        </motion.div>
        <div className="relative overflow-hidden rounded-xl border border-cyan-300/18 bg-[#071121]/95 p-2.5 shadow-2xl shadow-cyan-950/40 ring-1 ring-purple-400/10 sm:p-3">
          <BorderBeam />
          <motion.div
            className="pointer-events-none absolute inset-x-0 top-0 z-10 h-20 bg-gradient-to-b from-cyan-300/10 via-cyan-300/3 to-transparent"
            animate={{ y: ["-30%", "520%"] }}
            transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
          />
          <div className="relative z-10">
            <div className="mb-3 flex flex-col gap-2 border-b border-white/[0.07] pb-2.5 sm:flex-row sm:items-center sm:justify-between">
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
                <span className="rounded-full border border-cyan-300/12 bg-cyan-300/8 px-2 py-1 text-cyan-200">US cash session open</span>
                <span className="text-cyan-300">SignalFlo Command Center</span>
              </div>
            </div>

            <div className="mb-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["Market Session", "Regular Hours", "Live tape"],
                ["Active Alerts", "7", "2 new today"],
                ["Watchlist", "24", "Stocks + options"],
                ["Recent Closed", "12", "Reviewed today"],
              ].map(([label, value, detail], index) => (
                <motion.div
                  key={label}
                  className="rounded-lg border border-white/[0.07] bg-white/[0.025] px-3 py-1.5"
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: index * 0.05 }}
                >
                  <p className="text-[10px] uppercase tracking-[0.16em] text-slate-600">{label}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-200">{value}</p>
                  <p className="mt-0.5 text-[10px] text-cyan-300/80">{detail}</p>
                </motion.div>
              ))}
            </div>

            <div className="mb-3 flex flex-wrap gap-2">
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
              className="grid gap-3 lg:grid-cols-[1.1fr_0.78fr_0.72fr]"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <DashboardPanel className="p-3">
                <div className="mb-2 flex flex-col gap-2 text-xs sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <span className="font-medium text-slate-300">{panel.headline}</span>
                    <p className="mt-1 text-[11px] text-slate-500">{panel.rows.join(" / ")}</p>
                  </div>
                  <span className="text-cyan-300">{panel.subline}</span>
                </div>
                <AnimatedDashboardChart className="h-44 sm:h-52" />
              </DashboardPanel>

              <DashboardPanel className="relative p-3">
                {showToast && (
                  <motion.div
                    className="absolute right-3 top-3 z-20 rounded-md border border-cyan-300/20 bg-[#071121]/95 px-3 py-2 text-[11px] text-cyan-200 shadow-[0_0_28px_rgba(34,211,238,0.14)]"
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  >
                    <p>New Alert Received</p>
                    <p className="mt-0.5 text-[9px] uppercase tracking-[0.16em] text-slate-500">AI Score 94</p>
                  </motion.div>
                )}
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-slate-300">Recent alerts</p>
                  <span className="text-[10px] text-slate-600">{dashboardAlerts.length} active</span>
                </div>
                <div className="mt-3 space-y-2">
                  {dashboardAlerts.map((alert, index) => (
                    <motion.div
                      key={alert.ticker}
                      className={cn(
                        "rounded-md border px-3 py-1.5 text-xs transition-colors",
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
                        <span>{alert.time}</span>
                      </div>
                      <div className="mt-2 flex items-center justify-between gap-3 text-[10px]">
                        <span className="text-slate-600">Status</span>
                        <span className="text-cyan-300">{alert.state}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </DashboardPanel>

              <div className="grid gap-3">
                <AnimatedMetricCard title="Open trades" value={7} icon={TrendingUp} tone="text-cyan-300" trend="+2 active" />
                <AnimatedMetricCard title="Closed today" value={12} icon={Check} tone="text-blue-300" trend="4 reviewed" />
                <DashboardPanel className="p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-400">Recent closed</p>
                    <span className="text-[10px] text-slate-600">Today</span>
                  </div>
                  <div className="mt-2 space-y-1.5">
                    {closedDashboardAlerts.map(([ticker, state, time], index) => (
                      <motion.div
                        key={ticker}
                        className="flex items-center justify-between gap-3 rounded-md border border-white/[0.06] bg-white/[0.025] px-3 py-1.5 text-[10px]"
                        initial={{ opacity: 0, x: 8 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.35, delay: index * 0.05 }}
                      >
                        <span className="font-medium text-slate-300">{ticker}</span>
                        <span className="text-slate-500">{state}</span>
                        <span className="text-slate-600">{time}</span>
                      </motion.div>
                    ))}
                  </div>
                </DashboardPanel>
                <DashboardPanel className="p-3">
                  <p className="text-xs text-slate-400">Analytics</p>
                  <div className="mt-2 space-y-2">
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

            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:hidden">
              {alertCards.map((alert, index) => (
                <MotionCard key={alert.ticker} delay={index * 0.04}>
                  <AlertPreviewCard alert={alert} index={index} compact />
                </MotionCard>
              ))}
            </div>
          </div>
        </div>
      </div>
    </FadeUp>
  )
}

void DashboardCommandCenter

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
      <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_0%,rgba(34,211,238,0.12),transparent_30%),radial-gradient(circle_at_100%_0%,rgba(124,58,237,0.08),transparent_28%)] opacity-75" />
      <span className="pointer-events-none absolute -left-12 top-0 h-full w-14 -translate-x-20 rotate-12 bg-gradient-to-r from-transparent via-white/8 to-transparent opacity-0 blur-sm transition-all duration-700 group-hover:translate-x-96 group-hover:opacity-100" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}

function AnimatedDashboardChart({ className }: { className?: string }) {
  const candles = [
    { x: 30, wickTop: 128, wickBottom: 168, bodyY: 138, bodyH: 22, volume: 24, up: true },
    { x: 62, wickTop: 112, wickBottom: 166, bodyY: 124, bodyH: 30, volume: 42, up: true },
    { x: 94, wickTop: 104, wickBottom: 158, bodyY: 112, bodyH: 34, volume: 36, up: false },
    { x: 126, wickTop: 116, wickBottom: 174, bodyY: 128, bodyH: 28, volume: 33, up: false },
    { x: 158, wickTop: 92, wickBottom: 150, bodyY: 106, bodyH: 32, volume: 51, up: true },
    { x: 190, wickTop: 82, wickBottom: 142, bodyY: 94, bodyH: 36, volume: 58, up: true },
    { x: 222, wickTop: 88, wickBottom: 148, bodyY: 100, bodyH: 30, volume: 40, up: false },
    { x: 254, wickTop: 70, wickBottom: 128, bodyY: 82, bodyH: 34, volume: 64, up: true },
    { x: 286, wickTop: 58, wickBottom: 118, bodyY: 70, bodyH: 38, volume: 72, up: true },
    { x: 318, wickTop: 64, wickBottom: 126, bodyY: 78, bodyH: 28, volume: 46, up: false },
    { x: 350, wickTop: 46, wickBottom: 104, bodyY: 58, bodyH: 34, volume: 76, up: true },
    { x: 382, wickTop: 34, wickBottom: 92, bodyY: 46, bodyH: 32, volume: 88, up: true },
  ]
  const levels = [
    { label: "TP $952.80", y: 46, tone: "#67e8f9", bg: "rgba(34,211,238,0.1)" },
    { label: "Entry $924.20", y: 96, tone: "#60a5fa", bg: "rgba(59,130,246,0.1)" },
    { label: "SL $908.40", y: 146, tone: "#f87171", bg: "rgba(248,113,113,0.09)" },
  ]
  const priceLabels = [["953", 47], ["938", 78], ["924", 98], ["908", 148]]
  const timeLabels = [["10:00", 42], ["11:30", 146], ["1:00", 250], ["2:30", 354]]

  return (
    <div className={cn("relative overflow-hidden rounded-md border border-white/[0.05] bg-[#04101b]", className)}>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.07)_1px,transparent_1px)] bg-[size:44px_38px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_24%,rgba(34,211,238,0.12),transparent_34%)]" />
      <motion.div
        className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-cyan-300/7 to-transparent"
        animate={{ x: ["-30%", "560%"] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: "linear" }}
      />
      <svg className="absolute inset-0 size-full" viewBox="0 0 430 220" preserveAspectRatio="none">
        <defs>
          <filter id="dashboard-candle-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {levels.map((level, index) => (
          <motion.g
            key={level.label}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.25 + index * 0.08 }}
          >
            <line x1="18" x2="392" y1={level.y} y2={level.y} stroke={level.tone} strokeDasharray="6 8" strokeOpacity="0.48" strokeWidth="1.5" />
            <rect x="22" y={level.y - 10} width="86" height="20" rx="6" fill={level.bg} stroke={level.tone} strokeOpacity="0.36" />
            <text x="32" y={level.y + 4} fill={level.tone} fontSize="10" fontWeight="600">{level.label}</text>
          </motion.g>
        ))}
        {candles.map((candle, index) => (
          <motion.g
            key={`${candle.x}-${index}`}
            initial={{ opacity: 0, y: 12, scaleY: 0.7 }}
            whileInView={{ opacity: 1, y: 0, scaleY: 1 }}
            animate={
              index === candles.length - 1
                ? { filter: ["drop-shadow(0 0 4px rgba(34,211,238,0.2))", "drop-shadow(0 0 16px rgba(34,211,238,0.75))", "drop-shadow(0 0 4px rgba(34,211,238,0.2))"] }
                : undefined
            }
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: index * 0.055, ease: "easeOut", repeat: index === candles.length - 1 ? Infinity : 0, repeatDelay: 0.8 }}
            style={{ transformOrigin: `${candle.x}px ${candle.wickBottom}px` }}
          >
            <line
              x1={candle.x}
              x2={candle.x}
              y1={candle.wickTop}
              y2={candle.wickBottom}
              stroke={candle.up ? "#67e8f9" : "#f87171"}
              strokeOpacity={candle.up ? 0.82 : 0.48}
              strokeWidth="2.5"
            />
            <rect
              x={candle.x - 10}
              y={candle.bodyY}
              width="20"
              height={candle.bodyH}
              rx="4"
              fill={candle.up ? "#22d3ee" : "#ef4444"}
              fillOpacity={candle.up ? 0.92 : 0.42}
              stroke={candle.up ? "#a5f3fc" : "#fca5a5"}
              strokeOpacity={candle.up ? 0.82 : 0.42}
              filter={candle.up ? "url(#dashboard-candle-glow)" : undefined}
            />
            <motion.rect
              x={candle.x - 9}
              y={205 - candle.volume}
              width="18"
              height={candle.volume}
              rx="3"
              fill={candle.up ? "#22d3ee" : "#ef4444"}
              fillOpacity={candle.up ? 0.22 : 0.15}
              initial={{ height: 0, y: 205 }}
              whileInView={{ height: candle.volume, y: 205 - candle.volume }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.15 + index * 0.04, ease: "easeOut" }}
            />
          </motion.g>
        ))}
        <motion.g
          initial={{ opacity: 0, y: 10, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.65 }}
        >
          <path d="M286 60 L304 80" stroke="#22d3ee" strokeOpacity="0.55" strokeWidth="1.5" />
          <rect x="212" y="20" width="118" height="48" rx="10" fill="rgba(7,17,33,0.92)" stroke="#22d3ee" strokeOpacity="0.28" />
          <text x="224" y="38" fill="#f8fafc" fontSize="12" fontWeight="700">NVDA CALL</text>
          <text x="292" y="38" fill="#22d3ee" fontSize="10" fontWeight="700">94</text>
          <text x="224" y="55" fill="#64748b" fontSize="10">Momentum setup active</text>
        </motion.g>
        {priceLabels.map(([label, y]) => (
          <text key={label} x="398" y={y} fill="#64748b" fontSize="9">{label}</text>
        ))}
        {timeLabels.map(([label, x]) => (
          <text key={label} x={x} y="214" fill="#475569" fontSize="9">{label}</text>
        ))}
      </svg>
      <div className="absolute left-3 top-3 rounded-md border border-cyan-300/15 bg-cyan-300/8 px-2 py-1 text-[10px] text-cyan-200">
        Active alert chart
      </div>
      <div className="absolute bottom-3 right-3 rounded-md border border-cyan-300/15 bg-black/25 px-2 py-1 text-[10px] text-cyan-200/85">
        Entry / TP / SL mapped
      </div>
      <div className="absolute bottom-3 left-3 rounded-md border border-white/[0.07] bg-black/20 px-2 py-1 text-[10px] text-slate-500">
        SignalFlo tracking live
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

        <div className="mt-8">
          <MarketTicker />
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
  const alertLevels = [
    ["Entry Zone", "$924.20", "Review before trigger"],
    ["Take Profit", "$952.80", "Target level"],
    ["Stop Loss", "$908.40", "Risk boundary"],
    ["Confidence Score", "94", "AI-ranked setup"],
  ]

  return (
    <FadeUp as="section" className="border-y border-white/[0.06] bg-[#07101f] px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
      <SectionHeading
        kicker="Workflow + product demo"
        title="From Market Scan to Structured Alert"
        highlight="Structured Alert"
        description="See how SignalFlo moves from AI research to reviewed alerts, then presents a clear trade plan traders can track."
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

        <div className="mx-auto mt-8 max-w-6xl overflow-hidden rounded-3xl border border-cyan-300/14 bg-[#071121]/92 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_28px_110px_rgba(14,165,233,0.14)] sm:p-6 lg:mt-10">
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#050b16]/88 p-5">
            <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_0%,rgba(34,211,238,0.16),transparent_36%)]" />
            <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.035)_1px,transparent_1px)] bg-[size:34px_34px] opacity-45" />
            <div className="relative z-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
              <div className="flex flex-col justify-between rounded-2xl border border-cyan-300/12 bg-cyan-300/[0.045] p-5">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className="bg-blue-500 text-white">NVDA CALL</Badge>
                    <Badge variant="outline" className="border-cyan-300/20 bg-cyan-300/8 text-cyan-200">Option</Badge>
                    <Badge variant="outline" className="border-cyan-300/20 bg-cyan-300/8 text-cyan-200">Bullish</Badge>
                  </div>
                  <h3 className="mt-5 text-3xl font-extrabold tracking-[-0.03em] text-slate-50 sm:text-4xl">
                    What an alert looks like
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-slate-400">
                    A compact trade plan with asset type, direction, entry,
                    target, stop, confidence score, and thesis in one place.
                  </p>
                </div>
                <div className="mt-6 flex items-center justify-between rounded-xl border border-white/[0.07] bg-black/20 p-4">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">Status</p>
                    <p className="mt-1 text-sm font-semibold text-cyan-300">Active</p>
                  </div>
                  <motion.span
                    className="size-2 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.9)]"
                    animate={{ scale: [1, 1.8, 1], opacity: [0.65, 1, 0.65] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
              </div>

              <div className="grid gap-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  {alertLevels.map(([label, value, detail], index) => (
                    <MotionCard key={label} delay={index * 0.05}>
                      <div className="group relative overflow-hidden rounded-xl border border-blue-300/10 bg-[#081225]/86 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-300/26">
                        <CardEffects />
                        <p className="relative z-10 text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-300">{label}</p>
                        <p className="relative z-10 mt-2 text-2xl font-bold tracking-[-0.02em] text-cyan-300">{value}</p>
                        <p className="relative z-10 mt-1 text-xs text-slate-500">{detail}</p>
                      </div>
                    </MotionCard>
                  ))}
                </div>
                <div className="group relative overflow-hidden rounded-xl border border-cyan-300/12 bg-[#081225]/86 p-5 transition-all duration-300 hover:border-cyan-300/26">
                  <CardEffects />
                  <p className="relative z-10 text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-300">Trade Thesis</p>
                  <p className="relative z-10 mt-3 text-sm leading-7 text-slate-300">
                    Momentum continuation setup with price holding above key
                    support and volume confirming the move.
                  </p>
                  <motion.div
                    className="relative z-10 mt-4 h-1.5 overflow-hidden rounded-full bg-slate-800/80"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                  >
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-300"
                      initial={{ width: 0 }}
                      whileInView={{ width: "94%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.9, ease: "easeOut" }}
                    />
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
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

function PricingCheckoutModal({
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
        aria-labelledby="pricing-checkout-title"
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
          <h2 id="pricing-checkout-title" className="mt-4 text-2xl font-bold tracking-[-0.015em] text-slate-50">
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

function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null)

  return (
    <FadeUp as="section" id="pricing" className="relative overflow-hidden px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="pointer-events-none absolute left-1/2 top-[58%] h-[560px] w-[980px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.14),rgba(37,99,235,0.09),rgba(124,58,237,0.08),transparent_64%)] blur-2xl" />
      <div className="relative z-10 mx-auto max-w-7xl">
      <SectionHeading
        kicker="Pricing"
        title="Choose Your Plan"
        highlight="Your Plan"
        description="Simple options for traders who want structured alerts, tracking, and clearer trade plans."
      />
      <div className="mx-auto mt-6 flex max-w-4xl flex-wrap justify-center gap-2">
        {["Dashboard included", "Discord + Telegram included", "Stocks + options alerts", "Mobile access"].map((item) => (
          <span key={item} className="rounded-full border border-cyan-300/12 bg-cyan-300/8 px-3 py-1 text-[11px] font-medium text-cyan-200">
            {item}
          </span>
        ))}
      </div>
      <div className="mt-7 grid gap-4 lg:mt-9 lg:grid-cols-3">
        {pricingPlans.map((plan, index) => {
          const meta = pricingPlanMeta[plan.name]

          return (
            <MotionCard key={plan.name} delay={index * 0.06}>
              <Card
                className={cn(
                  "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-blue-300/12 bg-[#081225]/88 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_18px_60px_rgba(2,8,23,0.38)] transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/34 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_24px_80px_rgba(14,165,233,0.15),0_0_34px_rgba(124,58,237,0.08)]",
                  plan.name === "Annual" && "border-cyan-300/50 bg-[#0a1428] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_0_96px_rgba(34,211,238,0.28),0_0_58px_rgba(124,58,237,0.16)] lg:-translate-y-1 lg:scale-[1.015]",
                  plan.name === "Founder Lifetime" && "border-cyan-300/18 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_0_70px_rgba(124,58,237,0.12),0_0_38px_rgba(34,211,238,0.08)]",
                )}
              >
                <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.18),transparent_34%),radial-gradient(circle_at_85%_12%,rgba(124,58,237,0.13),transparent_32%),linear-gradient(135deg,rgba(37,99,235,0.08),transparent_44%)] opacity-90" />
                <span className={cn("pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent", plan.name === "Annual" && "inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-300 to-purple-500")} />
                <span className="pointer-events-none absolute -left-8 top-0 h-full w-16 -translate-x-24 rotate-12 bg-gradient-to-r from-transparent via-white/8 to-transparent opacity-0 blur-sm transition-all duration-700 group-hover:translate-x-[26rem] group-hover:opacity-100" />

                <CardHeader className="relative z-10 p-4 pb-3 text-center sm:p-5 sm:pb-3">
                  <div className="flex flex-col items-center gap-2">
                    <div className="min-w-0 text-center">
                      <CardTitle className="text-xl">{plan.name}</CardTitle>
                      <span className="mt-2 inline-flex rounded-full border border-cyan-300/12 bg-cyan-300/8 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-cyan-200">
                        {meta.chip}
                      </span>
                    </div>
                    {plan.name === "Annual" && (
                      <Badge className="shrink-0 border border-cyan-300/20 bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-[0_0_26px_rgba(34,211,238,0.28)]">Most Popular</Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="relative z-10 flex flex-1 flex-col px-4 pb-4 sm:px-5 sm:pb-5">
                  <div className="border-b border-white/[0.07] pb-4 text-center">
                    <div className="flex flex-wrap items-end justify-center gap-x-2 gap-y-1">
                      <p className="text-4xl font-extrabold tracking-[-0.04em] text-cyan-300 sm:text-5xl">{meta.priceMain}</p>
                      <p className="pb-1.5 text-sm font-medium text-slate-500">{meta.unit}</p>
                    </div>
                    <p className="mx-auto mt-1.5 max-w-xs text-sm leading-5 text-slate-500">{plan.copy}</p>
                    <p className="mt-2 text-xs text-slate-600">{meta.support}</p>
                  </div>

                  <div className="py-4">
                    <div className="grid grid-cols-1 gap-x-3 gap-y-2 text-[13px] sm:grid-cols-2">
                      {[...meta.benefits, ...pricingBaseFeatures].map((feature) => (
                        <div key={feature} className="flex min-w-0 items-start gap-2 leading-5 text-slate-400">
                          <span className="flex size-4 shrink-0 items-center justify-center rounded-full border border-cyan-300/15 bg-cyan-300/8">
                            <Check className="size-2.5 text-cyan-300" />
                          </span>
                          <span className="min-w-0 whitespace-normal break-words">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={() => setSelectedPlan(plan)}
                    className={cn(
                      "mt-auto h-11 w-full transition-all hover:-translate-y-0.5",
                      plan.name === "Annual"
                        ? "bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-[0_0_38px_rgba(34,211,238,0.32)] hover:from-blue-400 hover:to-cyan-300"
                        : "border-white/10 bg-white/[0.04] hover:bg-white/[0.07]",
                    )}
                    variant={plan.name === "Annual" ? "default" : "outline"}
                  >
                    {meta.cta}
                  </Button>
                </CardContent>
              </Card>
            </MotionCard>
          )
        })}
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
      <PricingCheckoutModal
        plan={selectedPlan}
        onClose={() => setSelectedPlan(null)}
      />
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

function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#050914] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <form
          className="relative mb-8 overflow-hidden rounded-3xl border border-cyan-300/12 bg-[#081225]/82 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_24px_100px_rgba(14,165,233,0.12)] sm:p-6"
          onSubmit={(event) => event.preventDefault()}
        >
          <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(34,211,238,0.15),transparent_34%),radial-gradient(circle_at_88%_10%,rgba(37,99,235,0.12),transparent_30%)]" />
          <span className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent" />
          <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xl font-bold tracking-[-0.01em] text-slate-100">Stay Updated With SignalFlo</p>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                Get launch updates, new features, and alert platform news.
              </p>
              <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.16em] text-cyan-300/80">
                No spam. Product updates only.
              </p>
            </div>
            <div className="flex w-full flex-col gap-2 sm:flex-row lg:max-w-md">
              <input
                type="email"
                placeholder="Enter your email"
                className="min-h-11 flex-1 rounded-md border border-white/[0.08] bg-black/20 px-3 text-sm text-slate-200 outline-none transition-colors placeholder:text-slate-600 focus:border-cyan-300/35"
              />
              <Button type="submit" className="min-h-11 bg-blue-500 px-5 text-white hover:bg-blue-400">
                Join List
              </Button>
            </div>
          </div>
          <div className="relative z-10 mt-5 border-t border-white/[0.07] pt-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:gap-5">
              <div className="flex min-w-fit items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-md border border-cyan-300/12 bg-cyan-300/8 text-cyan-200">
                  <ShieldCheck className="size-3.5" />
                </span>
                <p className="text-sm font-semibold text-slate-200">Trading Risk Disclosure</p>
              </div>
              <p className="text-xs leading-6 text-slate-500">
                SignalFlo provides market alerts, trade ideas, research tools,
                and educational content. Trading involves risk, including
                possible loss of capital. Past performance does not guarantee
                future results. Users are responsible for their own trading
                decisions. SignalFlo does not execute trades or provide
                individualized financial advice.
              </p>
            </div>
          </div>
        </form>

        <div className="grid gap-10 md:grid-cols-[1.2fr_2fr]">
          <div>
            <div className="flex items-center gap-3 text-base font-bold tracking-[-0.01em] text-slate-100">
              <span className="flex size-10 items-center justify-center rounded-xl bg-cyan-400 text-slate-950 shadow-[0_0_28px_rgba(34,211,238,0.18)]">
                <Activity className="size-5" />
              </span>
              SignalFlo AI
            </div>
            <p className="mt-5 max-w-sm text-sm leading-6 text-slate-500">
              AI-powered stock and options trade alerts with entry levels,
              targets, stop loss, confidence scoring, and real-time tracking.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-4">
            {[
              ["Product", "Features", "Dashboard", "Trade Alerts"],
              ["Company", "Pricing", "FAQ", "Login"],
              ["Resources", "Trade Alerts", "Alert Tracking", "Risk Plans", "Market Coverage"],
              ["Legal", "Terms & Conditions", "Risk Disclosure", "Refund Policy", "Privacy Policy"],
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
                          : ["Terms & Conditions", "Risk Disclosure", "Refund Policy", "Privacy Policy"].includes(link)
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
        <div className="mt-8 border-t border-white/[0.06] pt-5 text-center">
          <p className="text-xs text-slate-600">© 2026 SignalFlo AI. All rights reserved.</p>
          <p className="mt-1 text-xs text-slate-700">Built for structured trade alerts, tracking, and market monitoring.</p>
        </div>
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
