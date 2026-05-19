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
import { cn } from "@/lib/utils"

const DASHBOARD_LOGIN_ROUTE = "/dashboard/login"

const tickerTape = [
  ["SPY", "+0.42%", "up"],
  ["QQQ", "+0.71%", "up"],
  ["AAPL 220C", "+12.8%", "up"],
  ["NVDA", "+2.14%", "up"],
  ["TSLA 250P", "-6.3%", "down"],
  ["MSFT", "+0.36%", "up"],
  ["AMD", "+1.08%", "up"],
  ["META", "-0.22%", "down"],
  ["IWM", "+0.18%", "up"],
]

const alertCards = [
  {
    ticker: "NVDA",
    direction: "Bullish",
    confidence: "94%",
    entry: "$924.20",
    tp: "$952.80",
    sl: "$908.40",
    status: "Live",
  },
  {
    ticker: "SPY 525C",
    direction: "Bullish",
    confidence: "88%",
    entry: "$3.20",
    tp: "$4.10",
    sl: "$2.65",
    status: "Watching",
  },
  {
    ticker: "TSLA",
    direction: "Bearish",
    confidence: "81%",
    entry: "$178.30",
    tp: "$171.50",
    sl: "$182.90",
    status: "Alert",
  },
  {
    ticker: "MSFT",
    direction: "Bullish",
    confidence: "86%",
    entry: "$421.10",
    tp: "$431.40",
    sl: "$416.20",
    status: "Live",
  },
]

const features = [
  { title: "AI-ranked alerts", icon: Bot, copy: "Scores catalysts, trend quality, confidence, and risk before alerts reach users." },
  { title: "Stock & options signals", icon: CircleDollarSign, copy: "Publish stock and contract ideas with structured entry, target, and stop previews." },
  { title: "Live price tracking", icon: RadioTower, copy: "Keep alerts current with compact market state, price refreshes, and movement summaries." },
  { title: "Auto TP/SL monitoring", icon: Target, copy: "Mark trade plans as open, hit target, stopped, or closed through rule-based status logic." },
  { title: "Admin publishing workflow", icon: Workflow, copy: "Let admins review, approve, edit, and publish alerts before they reach subscribers." },
  { title: "Historical analytics", icon: FileClock, copy: "Track prior alerts, outcomes, timing, and engagement without making performance promises." },
  { title: "Mobile-ready dashboard", icon: Smartphone, copy: "Responsive layouts keep watchlists, alerts, and plans readable from any screen." },
  { title: "Risk-managed trade plans", icon: ShieldCheck, copy: "Every alert includes entry, take-profit, stop-loss, confidence, and rationale fields." },
]

const stats = [
  ["5-10", "Active alerts", "Typical active watchlist range"],
  ["60s", "Price refresh cycle", "Designed for regular updates"],
  ["Stocks + options", "Signal coverage", "Structured multi-asset alerts"],
  ["Auto close", "Status logic", "TP, SL, and manual close states"],
  ["History", "Alert tracking", "Review prior signals and notes"],
]

const steps = [
  { title: "AI scans the market", icon: Cpu, copy: "SignalFlo reviews market movement, catalyst context, and alert quality indicators." },
  { title: "Admin reviews and publishes", icon: LockKeyhole, copy: "Admins approve alert details, trade plan fields, and user-facing rationale." },
  { title: "Users track alerts in real time", icon: MonitorSmartphone, copy: "Subscribers follow live status, TP/SL levels, notes, and historical updates." },
]

const testimonials = [
  ["The interface makes signal review calmer. I can see the setup, risk notes, and status without digging across tools.", "Maya R.", "Independent trader"],
  ["SignalFlo gives our community a cleaner way to publish alerts with context. The admin review flow is the key part for us.", "Jordan K.", "Trading educator"],
  ["The dashboard format helps separate interesting movement from actionable alerts. It feels structured and easy to audit.", "Elena S.", "Market analyst"],
]

function App() {
  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <Navbar />
      <Hero />
      <MarketTicker />
      <AlertCards />
      <Features />
      <DashboardCommandCenter />
      <Numbers />
      <Process />
      <Testimonials />
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
          <a href="#features" className="hover:text-white">Features</a>
          <a href="#dashboard" className="hover:text-white">Dashboard</a>
          <a href="#alerts" className="hover:text-white">Trade Alerts</a>
          <a href="#pricing" className="hover:text-white">Pricing</a>
          <a href="#faq" className="hover:text-white">FAQ</a>
        </nav>
        <div className="hidden items-center gap-2 sm:flex">
          <Button asChild variant="ghost" size="sm" className="h-8 text-xs">
            <a href={DASHBOARD_LOGIN_ROUTE}>Login</a>
          </Button>
          <Button asChild size="sm" className="h-8 bg-blue-500 text-xs text-white hover:bg-blue-400">
            <a href={DASHBOARD_LOGIN_ROUTE}>Start Free Trial</a>
          </Button>
        </div>
        <Button className="sm:hidden" variant="outline" size="icon" aria-label="Open navigation">
          <Menu />
        </Button>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="relative border-b border-white/[0.06] pt-14">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_28%,rgba(37,99,235,0.18),transparent_30%),radial-gradient(circle_at_20%_24%,rgba(34,211,238,0.1),transparent_24%),linear-gradient(180deg,#07101f_0%,#050914_100%)]" />
      <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:48px_48px]" />
      <div className="relative z-10 mx-auto grid min-h-[620px] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="max-w-xl"
        >
          <Badge variant="outline" className="border-cyan-400/20 bg-cyan-400/5 text-cyan-200">
            <Sparkles className="text-cyan-300" />
            AI watchlists, alerts, and trade plans
          </Badge>
          <h1 className="mt-5 text-4xl font-semibold leading-[0.98] tracking-tight sm:text-6xl">
            AI-powered trading signals{" "}
            <AnimatedGradientText>built for professionals</AnimatedGradientText>
          </h1>
          <p className="mt-5 max-w-lg text-sm leading-7 text-slate-400 sm:text-base">
            SignalFlo AI helps teams publish structured stock and options alerts,
            monitor TP/SL status, and keep users aligned from one premium dashboard.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button asChild className="bg-blue-500 text-white shadow-[0_0_28px_rgba(59,130,246,0.3)] hover:bg-blue-400">
              <a href={DASHBOARD_LOGIN_ROUTE}>
                Start Free Trial
                <ArrowRight />
              </a>
            </Button>
            <Button asChild variant="outline" className="border-white/10 bg-white/[0.03]">
              <a href="#dashboard">View Dashboard</a>
            </Button>
          </div>
          <p className="mt-5 text-xs text-slate-500">
            No execution automation. Human-reviewed alerts and dashboard tracking only.
          </p>
        </motion.div>
        <HeroDashboardCard />
      </div>
    </section>
  )
}

function HeroDashboardCard() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.12 }}
      className="relative"
    >
      <div className="absolute -inset-5 rounded-[2rem] bg-cyan-400/10 blur-3xl" />
      <div className="relative overflow-hidden rounded-xl border border-cyan-300/15 bg-[#071121]/92 p-4 shadow-2xl shadow-cyan-950/50">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-red-400" />
            <span className="size-2.5 rounded-full bg-yellow-400" />
            <span className="size-2.5 rounded-full bg-green-400" />
          </div>
          <Badge variant="outline" className="border-cyan-400/20 bg-cyan-400/5 text-cyan-200">
            94.2 score
          </Badge>
        </div>
        <div className="grid gap-3 sm:grid-cols-[1.4fr_0.9fr]">
          <div className="rounded-lg border border-white/[0.07] bg-black/18 p-4">
            <div className="mb-3 flex items-center justify-between text-xs">
              <span className="text-slate-400">NVDA alert stream</span>
              <span className="text-cyan-300">+2.84%</span>
            </div>
            <MiniChart className="h-48" />
          </div>
          <div className="space-y-3">
            <Metric label="Account value" value="$52,436" tone="text-cyan-300" />
            <Metric label="Active alerts" value="7" tone="text-blue-300" />
            <Metric label="Refresh cycle" value="60s" tone="text-cyan-300" />
          </div>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {["SPY 525C", "MSFT", "AMD"].map((item, index) => (
            <div key={item} className="rounded-lg border border-white/[0.07] bg-white/[0.03] p-3">
              <p className="text-xs font-medium">{item}</p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800">
                <motion.div
                  className="h-full rounded-full bg-cyan-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${78 - index * 11}%` }}
                  transition={{ duration: 1, delay: 0.35 + index * 0.08 }}
                />
              </div>
              <p className="mt-2 text-[11px] text-cyan-300">+{(1.8 + index * 0.7).toFixed(1)}%</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

function MarketTicker() {
  return (
    <section className="border-y border-white/[0.06] bg-[#050914] py-3">
      <div className="mx-auto flex max-w-7xl gap-6 overflow-hidden px-4 text-[11px] sm:px-6 lg:px-8">
        {tickerTape.map(([symbol, change, dir]) => (
          <div key={symbol} className="flex shrink-0 items-center gap-2 text-slate-400">
            <span className="font-medium text-slate-200">{symbol}</span>
            <span className={dir === "up" ? "text-cyan-300" : "text-red-300"}>{change}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

function AlertCards() {
  return (
    <section id="alerts" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {alertCards.map((alert) => (
          <Card key={alert.ticker} className="bg-[#081225]/82 shadow-[0_0_24px_rgba(15,23,42,0.45)]">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={cn("size-2 rounded-full", alert.status === "Alert" ? "bg-yellow-300" : "bg-cyan-300")} />
                    <p className="text-sm font-semibold">{alert.ticker}</p>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{alert.direction} setup</p>
                </div>
                <Badge variant="outline" className="border-cyan-400/20 bg-cyan-400/5 text-cyan-200">
                  {alert.confidence}
                </Badge>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-[11px]">
                <TradeLevel label="Entry" value={alert.entry} />
                <TradeLevel label="TP" value={alert.tp} />
                <TradeLevel label="SL" value={alert.sl} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

function Features() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        kicker="Platform features"
        title="Everything You Need to Trade Smarter"
        highlight="Trade Smarter"
        description="A compact toolkit for publishing, monitoring, and reviewing AI-assisted trade alerts."
      />
      <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => {
          const Icon = feature.icon

          return (
          <Card key={feature.title} className="bg-[#081225]/82 transition hover:border-cyan-300/25 hover:bg-[#0a152a]">
            <CardHeader className="p-4">
              <span className="flex size-9 items-center justify-center rounded-md bg-cyan-400/12 text-cyan-300">
                <Icon className="size-4" />
              </span>
              <CardTitle className="text-sm">{feature.title}</CardTitle>
              <CardDescription className="text-xs leading-5">{feature.copy}</CardDescription>
            </CardHeader>
          </Card>
          )
        })}
      </div>
    </section>
  )
}

function DashboardCommandCenter() {
  return (
    <section id="dashboard" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        kicker="Live dashboard"
        title="Your Trading Command Center"
        highlight="Command Center"
        description="Monitor alerts, open trades, closed outcomes, and price action from one high-trust view."
      />
      <div className="relative mx-auto mt-10 max-w-6xl">
        <div className="absolute -inset-6 rounded-[2rem] bg-cyan-400/10 blur-3xl" />
        <div className="relative overflow-hidden rounded-xl border border-cyan-300/15 bg-[#071121]/95 p-4 shadow-2xl shadow-cyan-950/40">
          <BorderBeam />
          <div className="relative z-10">
            <div className="mb-4 flex items-center justify-between border-b border-white/[0.07] pb-3">
              <div className="flex gap-1.5">
                <span className="size-2.5 rounded-full bg-red-400" />
                <span className="size-2.5 rounded-full bg-yellow-400" />
                <span className="size-2.5 rounded-full bg-green-400" />
              </div>
              <span className="text-[11px] text-cyan-300">SignalFlo Command Center</span>
            </div>
            <div className="grid gap-3 lg:grid-cols-[1.05fr_0.75fr_0.75fr]">
              <div className="rounded-lg border border-white/[0.07] bg-black/18 p-4">
                <div className="mb-3 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Portfolio watch</span>
                  <span className="text-cyan-300">+$2,436 tracked</span>
                </div>
                <MiniChart className="h-64" />
              </div>
              <div className="rounded-lg border border-white/[0.07] bg-white/[0.03] p-4">
                <p className="text-xs font-medium text-slate-300">Recent alerts</p>
                <div className="mt-4 space-y-3">
                  {["NVDA", "SPY 525C", "MSFT", "AMD", "AAPL"].map((item, index) => (
                    <div key={item} className="flex items-center justify-between text-xs">
                      <span className="text-slate-300">{item}</span>
                      <span className={index === 1 ? "text-blue-300" : "text-cyan-300"}>{86 - index * 4}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid gap-3">
                <StatusCard title="Open trades" value="7" icon={TrendingUp} tone="text-cyan-300" />
                <StatusCard title="Closed today" value="12" icon={Check} tone="text-blue-300" />
                <div className="rounded-lg border border-white/[0.07] bg-black/18 p-4">
                  <p className="text-xs text-slate-400">Analytics</p>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                    <span className="rounded bg-cyan-400/10 px-2 py-1 text-cyan-200">TP watched</span>
                    <span className="rounded bg-blue-400/10 px-2 py-1 text-blue-200">SL guarded</span>
                    <span className="rounded bg-slate-800 px-2 py-1 text-slate-300">History</span>
                    <span className="rounded bg-slate-800 px-2 py-1 text-slate-300">Admin log</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Numbers() {
  return (
    <section className="border-y border-white/[0.06] bg-[#07101f] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          kicker="Platform metrics"
          title="Numbers That Speak for Themselves"
          highlight="Speak for Themselves"
          description="Operational metrics for alert publishing and tracking. No profit guarantees, just clearer workflow."
        />
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {stats.map(([value, label, copy]) => (
            <Card key={label} className="bg-[#081225]/82">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-semibold text-cyan-300">{value}</p>
                <p className="mt-1 text-xs font-medium">{label}</p>
                <p className="mt-2 text-[11px] leading-4 text-slate-500">{copy}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

function Process() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        kicker="How it works"
        title="Three Steps to Smarter Trading"
        highlight="Smarter Trading"
        description="A simple human-reviewed workflow from market scan to real-time tracking."
      />
      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        {steps.map((step, index) => {
          const Icon = step.icon

          return (
          <Card key={step.title} className="relative overflow-hidden bg-[#081225]/82">
            <CardHeader className="p-5">
              <span className="absolute right-5 top-4 text-4xl font-semibold text-white/[0.03]">0{index + 1}</span>
              <span className="flex size-10 items-center justify-center rounded-md bg-cyan-400/12 text-cyan-300">
                <Icon className="size-5" />
              </span>
              <CardTitle className="text-base">{step.title}</CardTitle>
              <CardDescription>{step.copy}</CardDescription>
            </CardHeader>
          </Card>
          )
        })}
      </div>
    </section>
  )
}

function Testimonials() {
  return (
    <section className="border-y border-white/[0.06] bg-[#07101f] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          kicker="Social proof"
          title="Trusted by Serious Traders"
          highlight="Serious Traders"
          description="Realistic workflows for teams that need structure, not hype."
        />
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {testimonials.map(([quote, name, role]) => (
            <Card key={name} className="bg-[#081225]/82">
              <CardContent className="p-5">
                <div className="text-xs text-yellow-300">★★★★★</div>
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
          ))}
        </div>
      </div>
    </section>
  )
}

function FinalCta() {
  return (
    <section className="relative px-4 py-24 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(37,99,235,0.24),transparent_38%)]" />
      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <Badge variant="outline" className="border-cyan-400/20 bg-cyan-400/5 text-cyan-200">
          <Sparkles className="text-cyan-300" />
          Start your alert workflow
        </Badge>
        <h2 className="mt-5 text-4xl font-semibold sm:text-5xl">
          Trade Smarter <AnimatedGradientText>With AI</AnimatedGradientText>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-400">
          Give users a clean dashboard for structured alerts, real-time status,
          and human-reviewed trade plans.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild className="bg-blue-500 text-white hover:bg-blue-400">
            <a href={DASHBOARD_LOGIN_ROUTE}>Start Free Trial</a>
          </Button>
          <Button asChild variant="outline" className="border-white/10 bg-white/[0.03]">
            <a href="#dashboard">View Dashboard</a>
          </Button>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer id="faq" className="border-t border-white/[0.06] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-lg border border-white/[0.07] bg-[#081225]/70 px-4 py-3 text-[11px] text-slate-500">
          SignalFlo AI is an alert publishing and tracking interface. It does not provide individualized financial advice or guarantee outcomes.
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
              Premium AI trading alert workflows for stock and options communities,
              analysts, and market teams.
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
                    <a key={link} href={link === "Login" ? DASHBOARD_LOGIN_ROUTE : "#"} className="block text-xs text-slate-500 hover:text-cyan-300">
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-10 border-t border-white/[0.06] pt-6 text-[11px] leading-5 text-slate-600">
          Trading involves risk. SignalFlo AI provides software for organizing and
          monitoring alerts; all decisions remain the responsibility of the user.
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

function Metric({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="rounded-lg border border-white/[0.07] bg-white/[0.03] p-4">
      <p className="text-[11px] text-slate-500">{label}</p>
      <p className={cn("mt-2 text-lg font-semibold", tone)}>{value}</p>
    </div>
  )
}

function TradeLevel({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-white/[0.03] px-2 py-2">
      <p className="text-slate-500">{label}</p>
      <p className="mt-1 font-medium text-slate-200">{value}</p>
    </div>
  )
}

function StatusCard({
  title,
  value,
  icon: Icon,
  tone,
}: {
  title: string
  value: string
  icon: React.ComponentType<{ className?: string }>
  tone: string
}) {
  return (
    <div className="rounded-lg border border-white/[0.07] bg-white/[0.03] p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-400">{title}</p>
        <Icon className={cn("size-4", tone)} />
      </div>
      <p className={cn("mt-3 text-2xl font-semibold", tone)}>{value}</p>
    </div>
  )
}

export default App
