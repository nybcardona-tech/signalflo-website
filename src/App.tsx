import {
  Activity,
  ArrowRight,
  Bot,
  Check,
  CircleDollarSign,
  ClipboardCheck,
  Cpu,
  CreditCard,
  FileClock,
  Loader2,
  LockKeyhole,
  Mail,
  Menu,
  MessageCircle,
  MonitorSmartphone,
  RadioTower,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Target,
  TrendingUp,
  Workflow,
} from "lucide-react"
import { Fragment, useEffect, useState } from "react"
import type { ComponentType, FormEvent, ReactNode } from "react"
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
import {
  AI_ENGINE_PATH,
  APP_URL,
  LEGAL_PATH,
  LOGIN_PATH,
  PRICING_PATH,
  SIGNUP_PATH,
  SIGNUP_URL,
  SUPPORT_EMAIL,
  SUPPORT_URL,
  TERMS_PATH,
  VERIFICATION_REQUIRED_PATH,
  VERIFY_EMAIL_PATH,
  WELCOME_PATH,
} from "@/config/urls"
import { cn } from "@/lib/utils"

const LEGAL_URL = LEGAL_PATH
const LOGIN_PAGE_URL = LOGIN_PATH
const SIGNUP_PAGE_URL = SIGNUP_PATH
const TERMS_URL = TERMS_PATH
const PRICING_URL = PRICING_PATH
const AI_ENGINE_URL = AI_ENGINE_PATH
const WELCOME_URL = WELCOME_PATH
const VERIFY_EMAIL_URL = VERIFY_EMAIL_PATH
const VERIFICATION_REQUIRED_URL = VERIFICATION_REQUIRED_PATH
const LEGAL_VERSION = "v1.0"
const LEGAL_ACCEPTANCE_SOURCE = "pricing_page_before_whop_checkout"
const AUTH_TOKEN_STORAGE_KEY = "signalflo.auth.access_token"
const PENDING_VERIFICATION_EMAIL_KEY = "signalflo.auth.pending_email"
const LEGAL_ACKNOWLEDGMENT =
  "I have read and agree to the Terms, Risk Disclosure & Refund Policy, including the no-refund policy, risk disclosure, automatic renewal terms, and the fact that SignalFlo provides educational and informational content only, not personalized investment advice."

const supabaseConfig = {
  url: import.meta.env.VITE_SUPABASE_URL,
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
}

type SupabaseAuthUser = {
  id: string
  email?: string
  email_confirmed_at?: string | null
  confirmed_at?: string | null
}

type SupabaseAuthResponse = {
  access_token?: string
  user?: SupabaseAuthUser | null
  error?: string
  error_description?: string
  msg?: string
}

function getSupabaseAuthBaseUrl() {
  const { url, anonKey } = supabaseConfig

  if (!url || !anonKey) {
    throw new Error(`Authentication is temporarily unavailable. Please contact ${SUPPORT_EMAIL}.`)
  }

  return {
    authUrl: `${String(url).replace(/\/$/, "")}/auth/v1`,
    anonKey: String(anonKey),
  }
}

function getAuthRedirectUrl(path: string) {
  return `${APP_URL}${path}`
}

function getAuthErrorMessage(payload: SupabaseAuthResponse, fallback: string) {
  return payload.error_description || payload.msg || payload.error || fallback
}

function isEmailVerified(user: SupabaseAuthUser | null | undefined) {
  return Boolean(user?.email_confirmed_at || user?.confirmed_at)
}

async function signUpWithEmail(email: string, password: string) {
  const { authUrl, anonKey } = getSupabaseAuthBaseUrl()
  const response = await fetch(`${authUrl}/signup`, {
    method: "POST",
    headers: {
      apikey: anonKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      options: {
        emailRedirectTo: getAuthRedirectUrl(VERIFY_EMAIL_URL),
        email_redirect_to: getAuthRedirectUrl(VERIFY_EMAIL_URL),
      },
    }),
  })
  const payload = (await response.json().catch(() => ({}))) as SupabaseAuthResponse

  if (!response.ok) {
    throw new Error(getAuthErrorMessage(payload, "We could not create your account. Please try again."))
  }

  window.localStorage.setItem(PENDING_VERIFICATION_EMAIL_KEY, email)
  return payload
}

async function resendVerificationEmail(email: string) {
  const { authUrl, anonKey } = getSupabaseAuthBaseUrl()
  const response = await fetch(`${authUrl}/resend`, {
    method: "POST",
    headers: {
      apikey: anonKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type: "signup",
      email,
      options: {
        emailRedirectTo: getAuthRedirectUrl(VERIFY_EMAIL_URL),
        email_redirect_to: getAuthRedirectUrl(VERIFY_EMAIL_URL),
      },
    }),
  })
  const payload = (await response.json().catch(() => ({}))) as SupabaseAuthResponse

  if (!response.ok) {
    throw new Error(getAuthErrorMessage(payload, "We could not resend the verification email. Please try again."))
  }

  return payload
}

async function signInWithEmail(email: string, password: string) {
  const { authUrl, anonKey } = getSupabaseAuthBaseUrl()
  const response = await fetch(`${authUrl}/token?grant_type=password`, {
    method: "POST",
    headers: {
      apikey: anonKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })
  const payload = (await response.json().catch(() => ({}))) as SupabaseAuthResponse

  if (!response.ok) {
    const message = getAuthErrorMessage(payload, "We could not sign you in. Please check your email and password.")

    if (message.toLowerCase().includes("email not confirmed")) {
      window.localStorage.setItem(PENDING_VERIFICATION_EMAIL_KEY, email)
      window.location.href = `${VERIFICATION_REQUIRED_URL}?email=${encodeURIComponent(email)}`
      return null
    }

    throw new Error(message)
  }

  if (!isEmailVerified(payload.user)) {
    window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY)
    window.localStorage.setItem(PENDING_VERIFICATION_EMAIL_KEY, email)
    window.location.href = `${VERIFICATION_REQUIRED_URL}?email=${encodeURIComponent(email)}`
    return null
  }

  if (payload.access_token) {
    window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, payload.access_token)
  }

  return payload
}

async function getCurrentAuthUser() {
  const accessToken = window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)

  if (!accessToken) {
    return null
  }

  const { authUrl, anonKey } = getSupabaseAuthBaseUrl()
  const response = await fetch(`${authUrl}/user`, {
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY)
    return null
  }

  return (await response.json()) as SupabaseAuthUser
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
  "group relative h-full overflow-hidden rounded-xl border border-blue-300/12 bg-[#080d20]/92 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_18px_50px_rgba(2,8,23,0.36)] transition-all duration-300 hover:border-blue-300/26 hover:bg-[#0a1226] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_20px_70px_rgba(37,99,235,0.1),0_0_28px_rgba(124,58,237,0.06)]"

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

const homepageFaqs = [
  ["Do I need trading experience?", "No. SignalFlo is designed to present structured alerts with clear entry, target, stop loss, and confidence scoring so traders can evaluate opportunities more efficiently."],
  ["What markets do you cover?", "SignalFlo currently focuses on stocks and options, with additional intelligence layers and market coverage planned in future releases."],
  ["Are results guaranteed?", "No. Trading involves risk and no system can guarantee profits. SignalFlo provides research, analysis, and structured trade ideas for educational purposes only."],
  ["Is this financial advice?", "No. SignalFlo does not provide individualized financial advice or investment recommendations. Users remain responsible for their own trading decisions."],
] as const

const termsSections = [
  ["Acceptance of Terms", "By accessing or using SignalFlo, you agree to these Terms & Conditions and any policies referenced here. If you do not agree, do not access the website, dashboard, alerts, community channels, or related services."],
  ["Platform Overview", "SignalFlo provides trading alerts, AI-generated market intelligence, dashboard tools, watchlists, trade thesis content, risk levels, and educational or informational materials for traders reviewing public market opportunities."],
  ["Educational and Informational Purposes Only", "SignalFlo is an educational and informational platform only. Alerts, dashboards, examples, data, and market commentary are provided for general informational purposes and are not tailored to any individual user's financial situation."],
  ["No Financial, Investment, Legal, or Tax Advice", "SignalFlo is not a registered investment adviser, broker-dealer, financial planner, securities professional, legal adviser, tax adviser, or fiduciary. Nothing on the website or inside the platform should be interpreted as financial, investment, legal, tax, or trading advice. Consult a licensed financial professional before making trading decisions."],
  ["Trading Risk Disclosure", "Trading stocks, options, futures, crypto, ETFs, and other financial instruments involves substantial risk, including the possible loss of capital. Options and futures can involve leverage and may not be suitable for all traders."],
  ["No Guarantee of Results", "SignalFlo does not guarantee profits, returns, win rates, income, successful trades, execution quality, or any particular outcome. Past performance, examples, backtests, alerts, or demonstrations do not guarantee future results."],
  ["User Responsibility", "You are solely responsible for evaluating alerts, conducting independent research, sizing positions, managing risk, and deciding whether any trade idea is appropriate for your objectives, account size, risk tolerance, and circumstances."],
  ["Subscriptions, Billing, and Payments", "Paid plans may renew automatically based on the plan selected at checkout. You authorize the applicable third-party payment processor to charge your selected payment method for subscription fees, renewals, upgrades, taxes, and applicable charges."],
  ["Refund Policy", "Monthly subscription payments are not refundable unless required by law. Annual and Founder Lifetime plan payments are generally final and non-refundable unless otherwise stated in writing by SignalFlo or required by law. Access to platform features, community channels, alerts, or digital materials may begin immediately after purchase."],
  ["Account Access and Security", "You are responsible for maintaining the confidentiality of your login credentials and account access. Notify SignalFlo promptly if you believe your account has been compromised or used without authorization."],
  ["Acceptable Use", "You agree not to copy, resell, redistribute, scrape, reverse engineer, abuse, disrupt, or misuse SignalFlo content, alerts, data, systems, communities, or platform access. SignalFlo may suspend or terminate access for misuse."],
  ["Intellectual Property", "SignalFlo's website, platform design, alerts, dashboards, text, graphics, trade plan formatting, workflows, and proprietary materials are owned by SignalFlo or its licensors and are protected by intellectual property laws."],
  ["Third-Party Services and Data Providers", "SignalFlo may rely on third-party services, payment processors, communication platforms, hosting providers, data providers, and integrations. SignalFlo is not responsible for third-party outages, errors, terms, fees, or data inaccuracies."],
  ["Platform Availability", "SignalFlo may change, suspend, update, limit, or discontinue any part of the website, platform, alerts, community access, data, or features at any time. We do not guarantee uninterrupted or error-free availability."],
  ["Limitation of Liability", "To the maximum extent permitted by law, SignalFlo and its owners, operators, employees, contractors, affiliates, and partners will not be liable for trading losses, lost profits, lost data, indirect damages, consequential damages, or damages related to use of or inability to use the platform."],
  ["Indemnification", "You agree to indemnify and hold SignalFlo harmless from claims, losses, damages, liabilities, costs, and expenses arising from your use of the platform, trading decisions, breach of these terms, or misuse of SignalFlo materials."],
  ["Changes to the Terms", "SignalFlo may update these Terms & Conditions from time to time. Updated terms may be posted on this page with a revised effective date. Continued use of SignalFlo after updates means you accept the revised terms."],
  ["Contact Information", "Questions about these terms can be sent to SignalFlo support through the contact channels provided on the website or dashboard."],
] as const

const pricingIncludedItems = [
  "Real-Time Trade Alerts",
  "AI Confidence Scores",
  "Dashboard Access",
  "Historical Performance Tracking",
  "Stocks, Options & Futures Coverage",
  "Recent Alert Activity",
  "Trade Thesis and Risk Levels",
  "Platform Updates",
] as const

const pricingComparisonRows = [
  ["Dashboard Access", true, true, true],
  ["AI-Powered Alerts", true, true, true],
  ["Stocks Alerts", true, true, true],
  ["Options Alerts", true, true, true],
  ["Futures Coverage", false, true, true],
  ["AI Confidence Scores", true, true, true],
  ["Trade Thesis", true, true, true],
  ["Recent Alert Activity", true, true, true],
  ["Historical Performance Tracking", true, true, true],
  ["Priority Updates", false, true, true],
  ["Lifetime Access", false, false, true],
] as const

const pricingPageFaqs = [
  ["Is SignalFlo financial advice?", "No. SignalFlo provides educational and informational market intelligence, alerts, and dashboard tools only. It does not provide personalized investment advice."],
  ["Can I cancel anytime?", "Monthly and annual subscriptions can be canceled according to the billing terms shown at checkout. Canceling stops future renewals but does not guarantee a refund for prior payments."],
  ["What markets does SignalFlo cover?", "SignalFlo focuses on stocks, options, futures coverage, watchlists, and structured alert workflows. Available coverage may evolve as the platform expands."],
  ["Are results guaranteed?", "No. Trading involves risk and past performance does not guarantee future results. Users are responsible for their own trading decisions."],
  ["What is included with Founder Lifetime?", "Founder Lifetime includes one-time founding-member access during the life of the SignalFlo platform, future premium categories, and priority onboarding."],
  ["How are alerts delivered?", "Alerts and tracking are presented through the SignalFlo dashboard and may also be supported through community or notification channels such as Discord, Telegram, or email depending on plan availability."],
] as const

const memberAccessSteps = [
  ["Step 01", "Complete Member Setup", "Submit the onboarding form with the email used at checkout, your preferred login email, and your Discord or Telegram details.", ClipboardCheck],
  ["Step 02", "Payment Verification", "Our team verifies your payment and membership plan before activating account access.", CreditCard],
  ["Step 03", "Dashboard Access", "Once approved, you'll receive your SignalFlo login or password setup email for the member dashboard.", MonitorSmartphone],
  ["Step 04", "Community & Alert Access", "You'll receive access instructions for Discord and Telegram so you can follow alerts, updates, and member announcements.", MessageCircle],
] as const

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

const intelligenceNetworkMetrics = [
  ["24/7", "Market Monitoring", RadioTower],
  ["Stocks, Options & Futures", "Multi-market coverage", Activity],
  ["AI Confidence Scoring", "Structured setup quality", Bot],
  ["Automated Trade Tracking", "Entry, target, and stop monitoring", Workflow],
] as const

const recentAlertActivity = [
  ["NVDA", "Momentum Alert Published", "", "2m ago", "published"],
  ["SPY", "Day Trade Closed", "+12.8%", "18m ago", "closed"],
  ["AAPL", "Breakout Alert Published", "", "42m ago", "published"],
  ["TSLA", "Target Hit", "+15.1%", "1h ago", "closed"],
  ["MSFT", "Risk Level Updated", "", "1h ago", "published"],
  ["QQQ", "Target Hit", "+7.6%", "3h ago", "closed"],
] as const

void steps
void engineCopyBlocks
void Features
void PricingTrustSections
void Pricing

const protectedDashboardPaths = ["/dashboard", "/alerts", "/analytics", "/admin", "/member", "/account"] as const

function App() {
  const pathname = window.location.pathname

  useEffect(() => {
    const scrollToHash = () => {
      const targetId = decodeURIComponent(window.location.hash.slice(1))

      if (!targetId) {
        return
      }

      window.requestAnimationFrame(() => {
        document.getElementById(targetId)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      })
    }

    scrollToHash()
    window.addEventListener("hashchange", scrollToHash)

    return () => window.removeEventListener("hashchange", scrollToHash)
  }, [pathname])

  if (pathname === LEGAL_URL) {
    return <LegalPage />
  }

  if (pathname === LOGIN_PAGE_URL) {
    return <LoginPage />
  }

  if (pathname === SIGNUP_PAGE_URL) {
    return <SignupPage />
  }

  if (pathname === VERIFY_EMAIL_URL) {
    return <VerificationSuccessPage />
  }

  if (pathname === VERIFICATION_REQUIRED_URL) {
    return <VerificationRequiredPage />
  }

  if (pathname === TERMS_URL) {
    return <TermsPage />
  }

  if (pathname === PRICING_URL) {
    return <DedicatedPricingPage />
  }

  if (pathname === AI_ENGINE_URL) {
    return <AIEnginePage />
  }

  if (pathname === WELCOME_URL) {
    return <WelcomePage />
  }

  if (protectedDashboardPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`))) {
    return <ProtectedDashboardRoute routeLabel={pathname} />
  }

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Process />
      <AIEngineTeaser />
      <RealPerformance />
      <RoadMap />
      <Faq />
      <AIEngineCTA />
      <Footer />
    </main>
  )
}

function getSectionId(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

function boldSignalFlo(text: string) {
  return text.split(/(SignalFlo)/g).map((part, index) =>
    part === "SignalFlo" ? (
      <strong key={`${part}-${index}`} className="font-semibold text-inherit">
        {part}
      </strong>
    ) : (
      part
    ),
  )
}

function BrandLogo({ className }: { className?: string }) {
  return (
    <img
      src="/signalflo-logo.png"
      alt="SignalFlo"
      className={cn("block h-auto w-auto object-contain", className)}
    />
  )
}

function AuthPageShell({
  badge,
  title,
  description,
  children,
}: {
  badge: string
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <Navbar />
      <section className="relative flex min-h-screen items-center px-4 py-28 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_8%,rgba(34,211,238,0.16),transparent_34%),radial-gradient(circle_at_82%_18%,rgba(59,130,246,0.12),transparent_28%),linear-gradient(180deg,#07111f_0%,#050914_100%)]" />
        <div className="relative z-10 mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <Badge variant="outline" className="border-cyan-400/20 bg-cyan-400/5 text-cyan-200">
              {badge}
            </Badge>
            <h1 className="mt-5 font-display text-4xl font-bold tracking-[-0.025em] text-slate-50 sm:text-5xl">
              {title}
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-400">
              {description}
            </p>
          </div>
          <Card className="border-white/[0.08] bg-[#081225]/88 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_24px_100px_rgba(2,8,23,0.42)]">
            <CardContent className="p-6 sm:p-8">{children}</CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}

function AuthStatusMessage({ tone = "info", children }: { tone?: "info" | "error" | "success"; children: ReactNode }) {
  return (
    <div
      className={cn(
        "rounded-xl border px-4 py-3 text-sm leading-6",
        tone === "error" && "border-red-300/18 bg-red-400/8 text-red-100",
        tone === "success" && "border-emerald-300/18 bg-emerald-400/8 text-emerald-100",
        tone === "info" && "border-cyan-300/14 bg-cyan-300/8 text-cyan-100",
      )}
    >
      {children}
    </div>
  )
}

function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [error, setError] = useState("")
  const [notice, setNotice] = useState("")
  const [submittedEmail, setSubmittedEmail] = useState("")

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setNotice("")
    setIsSubmitting(true)

    try {
      await signUpWithEmail(email, password)
      setSubmittedEmail(email)
      setNotice("Verification email sent. Please check your inbox before signing in.")
    } catch (signUpError) {
      setError(signUpError instanceof Error ? signUpError.message : "We could not create your account. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleResend() {
    const targetEmail = submittedEmail || email

    if (!targetEmail) {
      setError("Enter your email address first so we can resend verification.")
      return
    }

    setError("")
    setNotice("")
    setIsResending(true)

    try {
      await resendVerificationEmail(targetEmail)
      setNotice("Verification email resent. Please check your inbox.")
    } catch (resendError) {
      setError(resendError instanceof Error ? resendError.message : "We could not resend verification. Please try again.")
    } finally {
      setIsResending(false)
    }
  }

  if (submittedEmail) {
    return (
      <AuthPageShell
        badge="Email Verification"
        title="Check your email"
        description="Your SignalFlo account was created, but dashboard access stays locked until you verify your email address."
      >
        <div className="space-y-5">
          <AuthStatusMessage tone="success">
            We sent a verification link to <span className="font-semibold">{submittedEmail}</span>. Open that email and confirm your address before accessing SignalFlo.
          </AuthStatusMessage>
          {notice && <AuthStatusMessage tone="info">{notice}</AuthStatusMessage>}
          {error && <AuthStatusMessage tone="error">{error}</AuthStatusMessage>}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="button" onClick={handleResend} disabled={isResending} variant="outline" className="border-white/10 bg-white/[0.035]">
              {isResending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Resending
                </>
              ) : (
                "Resend verification email"
              )}
            </Button>
            <Button asChild>
              <a href={APP_URL}>Go to Login</a>
            </Button>
          </div>
        </div>
      </AuthPageShell>
    )
  }

  return (
    <AuthPageShell
      badge="Create Account"
      title="Create your SignalFlo account"
      description="After signup, you will need to verify your email before dashboard access is enabled."
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        {error && <AuthStatusMessage tone="error">{error}</AuthStatusMessage>}
        {notice && <AuthStatusMessage tone="info">{notice}</AuthStatusMessage>}
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Email</span>
          <input
            required
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 h-12 w-full rounded-xl border border-white/[0.08] bg-slate-950/70 px-4 text-sm text-slate-100 outline-none transition-colors placeholder:text-slate-700 focus:border-cyan-300/35"
            placeholder="you@example.com"
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Password</span>
          <input
            required
            minLength={8}
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 h-12 w-full rounded-xl border border-white/[0.08] bg-slate-950/70 px-4 text-sm text-slate-100 outline-none transition-colors placeholder:text-slate-700 focus:border-cyan-300/35"
            placeholder="Minimum 8 characters"
          />
        </label>
        <Button type="submit" className="h-12 w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Creating account
            </>
          ) : (
            "Create Account"
          )}
        </Button>
        <p className="text-center text-xs leading-5 text-slate-500">
          Already have an account?{" "}
          <a href={APP_URL} className="text-cyan-300 hover:text-cyan-200">
            Log in
          </a>
        </p>
      </form>
    </AuthPageShell>
  )
}

function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      const payload = await signInWithEmail(email, password)

      if (payload) {
        window.location.href = "/dashboard"
      }
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "We could not sign you in. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthPageShell
      badge="Member Login"
      title="Log in to SignalFlo"
      description="Email verification is required before dashboard access. Unverified accounts will be sent to the verification-required screen."
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        {error && <AuthStatusMessage tone="error">{error}</AuthStatusMessage>}
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Email</span>
          <input
            required
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 h-12 w-full rounded-xl border border-white/[0.08] bg-slate-950/70 px-4 text-sm text-slate-100 outline-none transition-colors placeholder:text-slate-700 focus:border-cyan-300/35"
            placeholder="you@example.com"
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Password</span>
          <input
            required
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 h-12 w-full rounded-xl border border-white/[0.08] bg-slate-950/70 px-4 text-sm text-slate-100 outline-none transition-colors placeholder:text-slate-700 focus:border-cyan-300/35"
            placeholder="Your password"
          />
        </label>
        <Button type="submit" className="h-12 w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Checking account
            </>
          ) : (
            "Log In"
          )}
        </Button>
        <p className="text-center text-xs leading-5 text-slate-500">
          Need an account?{" "}
          <a href={SIGNUP_PAGE_URL} className="text-cyan-300 hover:text-cyan-200">
            Sign up
          </a>
        </p>
      </form>
    </AuthPageShell>
  )
}

function VerificationRequiredPage() {
  const params = new URLSearchParams(window.location.search)
  const initialEmail = params.get("email") || window.localStorage.getItem(PENDING_VERIFICATION_EMAIL_KEY) || ""
  const [email, setEmail] = useState(initialEmail)
  const [isResending, setIsResending] = useState(false)
  const [notice, setNotice] = useState("")
  const [error, setError] = useState("")

  async function handleResend() {
    if (!email) {
      setError("Enter the email used for signup so we can resend verification.")
      return
    }

    setError("")
    setNotice("")
    setIsResending(true)

    try {
      await resendVerificationEmail(email)
      window.localStorage.setItem(PENDING_VERIFICATION_EMAIL_KEY, email)
      setNotice("Verification email resent. Please check your inbox.")
    } catch (resendError) {
      setError(resendError instanceof Error ? resendError.message : "We could not resend verification. Please try again.")
    } finally {
      setIsResending(false)
    }
  }

  return (
    <AuthPageShell
      badge="Verification Required"
      title="Verify your email to continue"
      description="SignalFlo dashboard access is blocked until your email address is confirmed."
    >
      <div className="space-y-5">
        <AuthStatusMessage>
          Please verify your email before accessing SignalFlo. Once confirmed, log in again to enter the dashboard.
        </AuthStatusMessage>
        {notice && <AuthStatusMessage tone="success">{notice}</AuthStatusMessage>}
        {error && <AuthStatusMessage tone="error">{error}</AuthStatusMessage>}
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 h-12 w-full rounded-xl border border-white/[0.08] bg-slate-950/70 px-4 text-sm text-slate-100 outline-none transition-colors placeholder:text-slate-700 focus:border-cyan-300/35"
            placeholder="you@example.com"
          />
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button type="button" onClick={handleResend} disabled={isResending} variant="outline" className="border-white/10 bg-white/[0.035]">
            {isResending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Resending
              </>
            ) : (
              "Resend verification email"
            )}
          </Button>
          <Button asChild>
            <a href={APP_URL}>Back to Login</a>
          </Button>
        </div>
      </div>
    </AuthPageShell>
  )
}

function VerificationSuccessPage() {
  return (
    <AuthPageShell
      badge="Email Verified"
      title="Your email is verified"
      description="You can now log in to access SignalFlo. Dashboard routes remain protected until a verified session is present."
    >
      <div className="space-y-5">
        <AuthStatusMessage tone="success">
          Thanks for confirming your email. Log in with your verified account to continue.
        </AuthStatusMessage>
        <Button asChild className="h-12 w-full">
          <a href={APP_URL}>Go to Login</a>
        </Button>
      </div>
    </AuthPageShell>
  )
}

function ProtectedDashboardRoute({ routeLabel }: { routeLabel: string }) {
  const [status, setStatus] = useState<"checking" | "anonymous" | "unverified" | "verified" | "error">("checking")
  const [userEmail, setUserEmail] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    let isMounted = true

    async function checkAccess() {
      try {
        const user = await getCurrentAuthUser()

        if (!isMounted) {
          return
        }

        if (!user) {
          setStatus("anonymous")
          return
        }

        setUserEmail(user.email ?? "")

        if (!isEmailVerified(user)) {
          if (user.email) {
            window.localStorage.setItem(PENDING_VERIFICATION_EMAIL_KEY, user.email)
          }
          window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY)
          setStatus("unverified")
          return
        }

        setStatus("verified")
      } catch (accessError) {
        if (!isMounted) {
          return
        }

        setError(accessError instanceof Error ? accessError.message : "We could not verify dashboard access.")
        setStatus("error")
      }
    }

    checkAccess()

    return () => {
      isMounted = false
    }
  }, [])

  if (status === "checking") {
    return (
      <AuthPageShell badge="Checking Access" title="Verifying your session" description="SignalFlo is checking your verified email status before loading protected pages.">
        <div className="flex items-center gap-3 text-sm text-slate-300">
          <Loader2 className="size-4 animate-spin text-cyan-300" />
          Checking email verification...
        </div>
      </AuthPageShell>
    )
  }

  if (status === "anonymous") {
    return (
      <AuthPageShell badge="Login Required" title="Log in to continue" description="Protected SignalFlo pages require a verified account session.">
        <div className="space-y-5">
          <AuthStatusMessage>Please log in with your verified SignalFlo account before accessing {routeLabel}.</AuthStatusMessage>
          <Button asChild className="h-12 w-full">
            <a href={APP_URL}>Go to Login</a>
          </Button>
        </div>
      </AuthPageShell>
    )
  }

  if (status === "unverified") {
    const emailQuery = userEmail ? `?email=${encodeURIComponent(userEmail)}` : ""
    return (
      <AuthPageShell badge="Verification Required" title="Email verification required" description="Unverified users cannot access protected SignalFlo dashboard pages.">
        <div className="space-y-5">
          <AuthStatusMessage tone="error">Verify your email before accessing {routeLabel}.</AuthStatusMessage>
          <Button asChild className="h-12 w-full">
            <a href={`${VERIFICATION_REQUIRED_URL}${emailQuery}`}>Review Verification Steps</a>
          </Button>
        </div>
      </AuthPageShell>
    )
  }

  if (status === "error") {
    return (
      <AuthPageShell badge="Access Check Failed" title="We could not verify access" description="SignalFlo could not complete the verification check for this protected page.">
        <div className="space-y-5">
          <AuthStatusMessage tone="error">{error}</AuthStatusMessage>
          <Button asChild className="h-12 w-full">
            <a href={SUPPORT_URL}>Contact Support</a>
          </Button>
        </div>
      </AuthPageShell>
    )
  }

  return (
    <AuthPageShell badge="Verified Access" title="Dashboard access verified" description="Your email is confirmed. This protected route is cleared for the authenticated SignalFlo dashboard experience.">
      <div className="space-y-5">
        <AuthStatusMessage tone="success">
          Verified session detected for <span className="font-semibold">{userEmail || "your account"}</span>. The existing dashboard implementation can render here without changing role, alert, admin, or database logic.
        </AuthStatusMessage>
      </div>
    </AuthPageShell>
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
            Back to <strong className="font-semibold">SignalFlo</strong>
          </a>
          <Badge variant="outline" className="border-cyan-400/20 bg-cyan-400/5 text-cyan-200">
            Legal
          </Badge>
          <h1 className="mt-5 text-4xl font-extrabold tracking-[-0.025em] sm:text-5xl">
            Terms, Risk Disclosure & Refund Policy
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
            Please review these terms carefully before using <strong className="font-semibold">SignalFlo</strong> AI,
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
                <CardDescription className="text-sm leading-7 text-slate-400">{boldSignalFlo(copy)}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>
    </main>
  )
}

function TermsPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <Navbar />
      <section className="relative overflow-hidden border-b border-white/[0.06] px-4 pb-14 pt-28 sm:px-6 sm:pb-16 sm:pt-32 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.16),transparent_34%),radial-gradient(circle_at_82%_16%,rgba(124,58,237,0.13),transparent_28%),linear-gradient(180deg,#07111f_0%,#050914_100%)]" />
        <div className="relative z-10 mx-auto max-w-7xl">
          <a href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-cyan-300 transition-colors hover:text-cyan-200">
            <ArrowRight className="size-4 rotate-180" />
            Back to <strong className="font-semibold">SignalFlo</strong>
          </a>
          <Badge variant="outline" className="border-cyan-400/20 bg-cyan-400/5 text-cyan-200">
            Legal
          </Badge>
          <div className="mt-5 max-w-4xl">
            <h1 className="font-display text-4xl font-bold tracking-[-0.025em] text-slate-50 sm:text-6xl">
              Terms & Conditions
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400">
              Please read these terms carefully before using <strong className="font-semibold">SignalFlo</strong>.
            </p>
            <p className="mt-3 text-xs font-medium uppercase tracking-[0.18em] text-slate-600">
              Last updated: June 5, 2026
            </p>
          </div>

          <div className="mt-8 max-w-4xl rounded-2xl border border-cyan-300/14 bg-cyan-300/[0.035] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_20px_80px_rgba(14,165,233,0.08)]">
            <div className="flex flex-col gap-4 sm:flex-row">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-cyan-300/18 bg-cyan-300/10 text-cyan-200">
                <ShieldCheck className="size-5" />
              </span>
              <p className="text-sm leading-7 text-slate-300">
                <strong className="font-semibold">SignalFlo</strong> is an educational and informational platform only.
                Nothing on this website or inside the platform should be
                interpreted as financial, investment, legal, tax, or trading
                advice.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[280px_1fr] lg:gap-8">
          <aside className="lg:sticky lg:top-20 lg:self-start">
            <Card className="border-white/[0.07] bg-[#081225]/82 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
              <CardHeader className="p-5">
                <CardTitle className="text-sm">Table of Contents</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2 px-5 pb-5">
                {termsSections.map(([title], index) => (
                  <a
                    key={title}
                    href={`#${getSectionId(title)}`}
                    className="rounded-lg px-3 py-2 text-xs leading-5 text-slate-500 transition-colors hover:bg-white/[0.04] hover:text-cyan-300"
                  >
                    {String(index + 1).padStart(2, "0")} / {title}
                  </a>
                ))}
              </CardContent>
            </Card>
          </aside>

          <Card className="overflow-hidden border-white/[0.07] bg-[#081225]/82 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_24px_100px_rgba(2,8,23,0.35)]">
            <CardContent className="p-5 sm:p-8 lg:p-10">
              <div className="space-y-8">
                {termsSections.map(([title, copy], index) => (
                  <section key={title} id={getSectionId(title)} className="scroll-mt-24 border-b border-white/[0.06] pb-8 last:border-b-0 last:pb-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-300/80">
                      Section {String(index + 1).padStart(2, "0")}
                    </p>
                    <h2 className="mt-3 font-display text-2xl font-bold tracking-[-0.015em] text-slate-100">
                      {title}
                    </h2>
                    <p className="mt-4 text-sm leading-7 text-slate-400 sm:text-[15px]">
                      {boldSignalFlo(copy)}
                    </p>
                  </section>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24">
        <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-cyan-300/12 bg-[#081225]/82 p-7 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_26px_110px_rgba(14,165,233,0.11)] sm:p-10">
          <p className="font-display text-3xl font-bold tracking-[-0.02em] text-slate-50">
            Ready to use <strong className="font-semibold">SignalFlo</strong>?
          </p>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500">
            Review plan options and choose the access level that fits how you
            want to monitor alerts.
          </p>
          <Button asChild className="mt-6 bg-blue-500 text-white shadow-[0_0_28px_rgba(59,130,246,0.28)] hover:bg-blue-400">
            <a href={PRICING_URL}>
              View Pricing
              <ArrowRight className="size-4" />
            </a>
          </Button>
        </div>
      </section>
      <Footer />
    </main>
  )
}

async function submitOnboardingForm(payload: Record<string, string | boolean>) {
  const { url, anonKey } = supabaseConfig

  if (!url || !anonKey) {
    throw new Error(`Member setup is temporarily unavailable. Please contact ${SUPPORT_EMAIL}.`)
  }

  const response = await fetch(`${url.replace(/\/$/, "")}/rest/v1/onboarding_submissions`, {
    method: "POST",
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Onboarding submission failed: ${response.status} ${errorText}`)
  }
}

function MemberAccessTimeline() {
  return (
    <FadeUp as="section" className="px-4 py-[clamp(4rem,7vw,7rem)] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          kicker="Activation Process"
          title="Your Path to Member Access"
          highlight="Member Access"
          description="A clear four-step review process connects your purchase to the SignalFlo dashboard and member channels."
        />
        <div className="relative mt-12 grid gap-4 lg:grid-cols-4">
          <div className="pointer-events-none absolute left-[10%] right-[10%] top-7 hidden h-px bg-blue-300/15 lg:block" />
          {memberAccessSteps.map(([step, title, copy, Icon], index) => (
            <motion.div
              key={step}
              className="group relative overflow-hidden rounded-2xl border border-slate-400/15 bg-[rgba(8,13,28,0.72)] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-[18px] transition-colors hover:border-blue-300/28"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.45, delay: index * 0.07 }}
            >
              <div className="relative z-10 flex items-center justify-between gap-3">
                <span className="flex size-11 items-center justify-center rounded-xl border border-blue-300/15 bg-blue-300/8 text-blue-200">
                  <Icon className="size-5" />
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-300">{step}</span>
              </div>
              <h2 className="relative z-10 mt-6 text-lg font-semibold text-slate-100">{boldSignalFlo(title)}</h2>
              <p className="relative z-10 mt-3 text-sm leading-7 text-slate-500">{boldSignalFlo(copy)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </FadeUp>
  )
}

function WelcomePage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formError, setFormError] = useState("")
  const expectations = [
    "Most accounts are reviewed manually before access is activated.",
    "Use the same email you used at checkout whenever possible.",
    "Discord and Telegram access may require username verification.",
    "SignalFlo alerts are educational trade ideas, not financial advice.",
    "Never risk more than you can afford to lose.",
    "Support will contact you if any account details are missing.",
  ]
  const fieldClass =
    "min-h-12 w-full rounded-xl border border-white/[0.09] bg-[#050b16]/80 px-4 text-sm text-slate-200 outline-none transition-all placeholder:text-slate-600 focus:border-cyan-300/35 focus:shadow-[0_0_0_3px_rgba(34,211,238,0.07)]"
  const labelClass = "mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400"

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setFormError("")

    const form = event.currentTarget
    const data = new FormData(form)
    const payload = {
      full_name: String(data.get("full_name") ?? ""),
      checkout_email: String(data.get("checkout_email") ?? ""),
      dashboard_email: String(data.get("dashboard_email") ?? ""),
      phone: String(data.get("phone") ?? ""),
      discord_username: String(data.get("discord_username") ?? ""),
      telegram_contact: String(data.get("telegram_contact") ?? ""),
      membership_plan: String(data.get("membership_plan") ?? ""),
      markets_traded: String(data.get("markets_traded") ?? ""),
      experience_level: String(data.get("experience_level") ?? ""),
      referral_source: String(data.get("referral_source") ?? ""),
      notes: String(data.get("notes") ?? ""),
      risk_acknowledged: data.get("risk_acknowledged") === "on",
    }

    try {
      await submitOnboardingForm(payload)
      setIsSubmitted(true)
      form.reset()
    } catch (error) {
      console.error("SignalFlo onboarding submission failed.", error)
      setFormError(
        error instanceof Error
          ? error.message
          : `We could not submit your setup details. Please contact ${SUPPORT_EMAIL}.`,
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <Navbar />

      <section className="relative flex min-h-[100svh] items-center overflow-hidden border-b border-white/[0.06] px-4 py-24 sm:px-6 sm:py-28 lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_14%,rgba(34,211,238,0.15),transparent_30%),radial-gradient(circle_at_80%_30%,rgba(59,130,246,0.11),transparent_26%),linear-gradient(180deg,#07111f_0%,#050914_100%)]" />
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="relative z-10 mx-auto max-w-5xl text-center"
        >
          <Badge variant="outline" className="border-cyan-300/20 bg-cyan-300/[0.055] text-cyan-200">
            <motion.span
              className="size-1.5 rounded-full bg-cyan-300"
              animate={{ opacity: [0.45, 1, 0.45] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            Payment received · Setup pending
          </Badge>
          <h1 className="mx-auto mt-6 max-w-4xl font-display text-4xl font-bold leading-[1.03] tracking-[-0.04em] text-slate-50 sm:text-6xl lg:text-7xl">
            Welcome to <span className="heading-accent">SignalFlo</span>
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-slate-400">
            Your membership has been received. Complete the steps below so we can activate your dashboard access,
            Discord community access, and Telegram alert delivery.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-13 px-7 shadow-[0_0_30px_rgba(59,130,246,0.22)]">
              <a href="#member-setup">
                Complete Member Setup
                <ArrowRight className="size-4" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-13 border-white/10 bg-white/[0.03] px-7 hover:bg-white/[0.06]">
              <a href={SUPPORT_URL}>
                <Mail className="size-4" />
                Contact Support
              </a>
            </Button>
          </div>
        </motion.div>
      </section>

      <FadeUp as="section" className="border-y border-white/[0.06] bg-[#07101f] px-4 py-[clamp(3.5rem,6vw,6rem)] sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-center">
            <div>
              <p className="section-eyebrow text-blue-400">Before Activation</p>
              <h2 className="section-title font-display">What Happens Next</h2>
              <p className="section-subtitle mt-5 max-w-xl">
                Our team reviews each membership carefully so your account, plan, and community access are connected correctly.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {expectations.map((item) => (
                <div key={item} className="flex gap-3 rounded-xl border border-white/[0.07] bg-[#081225]/72 p-4">
                  <Check className="mt-0.5 size-4 shrink-0 text-cyan-300" />
                  <p className="text-sm leading-6 text-slate-400">{boldSignalFlo(item)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </FadeUp>

      <FadeUp as="section" id="member-setup" className="scroll-mt-24 px-4 py-[clamp(4rem,7vw,7rem)] sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <SectionHeading
            kicker="Member Onboarding"
            title="Complete Your Member Setup"
            highlight="Member Setup"
            description="Submit the details below so the SignalFlo team can verify your membership and activate access."
          />

          {isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto mt-10 max-w-3xl rounded-3xl border border-cyan-300/18 bg-[#081225]/82 p-7 text-center shadow-[0_24px_100px_rgba(14,165,233,0.12)] sm:p-10"
            >
              <span className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-200">
                <Check className="size-7" />
              </span>
              <h2 className="mt-6 text-2xl font-bold text-slate-100">Setup submitted successfully.</h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-400">
                Our team will verify your membership and send your dashboard access details shortly.
              </p>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-500">
                Check your inbox for your SignalFlo access email. If you do not receive anything, contact{" "}
                <a href={SUPPORT_URL} className="text-cyan-300 hover:text-cyan-200">{SUPPORT_EMAIL}</a>.
              </p>
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="relative mt-10 overflow-hidden rounded-3xl border border-slate-400/15 bg-[rgba(8,13,28,0.78)] p-5 shadow-[0_24px_100px_rgba(0,0,0,0.32)] backdrop-blur-[18px] sm:p-8 lg:p-10"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <label>
                  <span className={labelClass}>Full Name *</span>
                  <input className={fieldClass} name="full_name" autoComplete="name" required />
                </label>
                <label>
                  <span className={labelClass}>Email Used at Checkout *</span>
                  <input className={fieldClass} name="checkout_email" type="email" autoComplete="email" required />
                </label>
                <label>
                  <span className={labelClass}>Preferred Dashboard Login Email *</span>
                  <input className={fieldClass} name="dashboard_email" type="email" autoComplete="email" required />
                </label>
                <label>
                  <span className={labelClass}>Phone Number</span>
                  <input className={fieldClass} name="phone" type="tel" autoComplete="tel" />
                </label>
                <label>
                  <span className={labelClass}>Discord Username</span>
                  <input className={fieldClass} name="discord_username" placeholder="@username" />
                </label>
                <label>
                  <span className={labelClass}>Telegram Username or Phone Number</span>
                  <input className={fieldClass} name="telegram_contact" placeholder="@username or phone" />
                </label>
                <label>
                  <span className={labelClass}>Membership Plan Purchased *</span>
                  <select className={fieldClass} name="membership_plan" defaultValue="" required>
                    <option value="" disabled>Select your plan</option>
                    <option>Monthly</option>
                    <option>Yearly</option>
                    <option>Lifetime</option>
                    <option>Other</option>
                  </select>
                </label>
                <label>
                  <span className={labelClass}>Primary Markets Traded</span>
                  <select className={fieldClass} name="markets_traded" defaultValue="">
                    <option value="" disabled>Select a market</option>
                    <option>Stocks</option>
                    <option>Options</option>
                    <option>Futures</option>
                    <option>Crypto</option>
                    <option>Forex</option>
                    <option>Other</option>
                  </select>
                </label>
                <label>
                  <span className={labelClass}>Trading Experience Level</span>
                  <select className={fieldClass} name="experience_level" defaultValue="">
                    <option value="" disabled>Select your experience</option>
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </label>
                <label>
                  <span className={labelClass}>How Did You Hear About SignalFlo?</span>
                  <input className={fieldClass} name="referral_source" />
                </label>
                <label className="sm:col-span-2">
                  <span className={labelClass}>Notes / Questions</span>
                  <textarea className={`${fieldClass} min-h-32 resize-y py-3`} name="notes" />
                </label>
              </div>

              <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-xl border border-cyan-300/12 bg-cyan-300/[0.035] p-4">
                <input
                  type="checkbox"
                  name="risk_acknowledged"
                  required
                  className="mt-1 size-4 shrink-0 accent-cyan-400"
                />
                <span className="text-sm leading-7 text-slate-400">
                  I understand that SignalFlo provides educational market alerts and trade ideas only. SignalFlo does not
                  provide personalized financial advice, and all trading decisions are my responsibility.
                </span>
              </label>

              {formError && (
                <p role="alert" className="mt-5 rounded-xl border border-red-300/15 bg-red-300/[0.045] px-4 py-3 text-sm leading-6 text-red-200/80">
                  {formError}
                </p>
              )}

              <Button type="submit" size="lg" disabled={isSubmitting} className="mt-6 h-13 w-full sm:w-auto">
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Submitting Setup
                  </>
                ) : (
                  <>
                    Complete Member Setup
                    <ArrowRight className="size-4" />
                  </>
                )}
              </Button>
            </form>
          )}
        </div>
      </FadeUp>

      <FadeUp as="section" className="border-y border-white/[0.06] bg-[#07101f] px-4 py-[clamp(3.5rem,6vw,5.5rem)] sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 rounded-2xl border border-white/[0.08] bg-[#081225]/72 p-6 text-center sm:p-8 lg:flex-row lg:text-left">
          <div>
            <p className="section-eyebrow text-blue-400">Member Support</p>
            <h2 className="text-2xl font-bold text-slate-100">Need Help?</h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-500">
              If you completed checkout but cannot access your dashboard, Discord, or Telegram, contact support with the email used at checkout.
            </p>
          </div>
          <Button asChild variant="outline" size="lg" className="shrink-0 border-white/10 bg-white/[0.035]">
            <a href={SUPPORT_URL}>
              <Mail className="size-4" />
              Email Support
            </a>
          </Button>
        </div>
      </FadeUp>

      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-5xl gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-slate-500" />
          <p className="text-xs leading-6 text-slate-600">
            SignalFlo provides educational market alerts, analytics, and trade ideas. Nothing on this page or inside the
            member dashboard should be considered personalized financial, investment, tax, or legal advice. Trading
            involves substantial risk, including the possible loss of principal.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  )
}

function AIEnginePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <Navbar />
      <AIEnginePageHero />
      <SignalFloEngine />
      <Footer />
    </main>
  )
}

function AIEnginePageHero() {
  return (
    <section className="relative overflow-hidden border-b border-white/[0.06] px-4 pb-24 pt-32 sm:px-6 sm:pb-28 sm:pt-36 lg:px-8 lg:pb-32 lg:pt-40">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(0,212,255,0.18),transparent_30%),radial-gradient(circle_at_76%_28%,rgba(139,92,246,0.16),transparent_30%),radial-gradient(circle_at_28%_52%,rgba(59,130,246,0.13),transparent_28%),radial-gradient(circle_at_66%_64%,rgba(236,72,153,0.08),transparent_24%),linear-gradient(180deg,#07111f_0%,#050914_100%)]" />
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,#00D4FF,#8B5CF6,#EC4899,transparent)] opacity-70"
        animate={{ opacity: [0.35, 0.8, 0.35] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: "easeOut" }}
        className="relative z-10 mx-auto max-w-5xl text-center"
      >
        <Badge variant="outline" className="border-cyan-300/20 bg-cyan-300/[0.06] text-cyan-200 shadow-[0_0_28px_rgba(0,212,255,0.08)]">
          <motion.span
            className="size-1.5 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(0,212,255,0.9)]"
            animate={{ scale: [1, 1.55, 1], opacity: [0.65, 1, 0.65] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
          LIVE MARKET INTELLIGENCE
        </Badge>
        <h1 className="mx-auto mt-6 max-w-4xl font-display text-4xl font-semibold leading-[1.02] tracking-[-0.035em] text-slate-50 sm:text-6xl lg:text-7xl">
          The Intelligence Behind{" "}
          <span className="heading-accent">
            Every Alert
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-3xl text-sm leading-7 text-slate-400 sm:text-base sm:leading-8">
          <strong className="font-semibold text-slate-300">SignalFlo</strong> combines AI analysis, market structure,
          options flow, technical validation, and risk management into a single decision engine designed to identify
          high-probability trading opportunities.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild className="border border-white/10 bg-[linear-gradient(135deg,#00D4FF_0%,#3B82F6_35%,#8B5CF6_70%,#EC4899_100%)] text-white shadow-[0_0_34px_rgba(59,130,246,0.25)] transition-all hover:-translate-y-0.5 hover:brightness-110">
            <a href="#ai-engine-details">
              View Performance
              <ArrowRight className="size-4" />
            </a>
          </Button>
          <Button asChild variant="outline" className="border-white/10 bg-white/[0.035] transition-all hover:-translate-y-0.5 hover:border-purple-300/25 hover:bg-white/[0.06]">
            <a href={PRICING_URL}>Get Started</a>
          </Button>
        </div>
      </motion.div>
    </section>
  )
}

function AIEngineTeaserLegacy() {
  const marketInputs = [
    ["Options Flow", Activity],
    ["Market Structure", Workflow],
    ["Price Action", TrendingUp],
    ["Technical Indicators", Target],
    ["Market Sentiment", RadioTower],
    ["Institutional Activity", CircleDollarSign],
  ] as const
  const analysisChecks = [
    "Market Structure Validation",
    "Options Flow Analysis",
    "Technical Confirmation",
    "Risk Assessment",
    "Confidence Scoring",
  ]

  return (
    <FadeUp as="section" className="relative z-20 overflow-hidden border-y border-white/[0.06] bg-[#050914] px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_52%,rgba(59,130,246,0.12),transparent_31%),radial-gradient(circle_at_72%_58%,rgba(139,92,246,0.09),transparent_30%),radial-gradient(circle_at_28%_58%,rgba(0,212,255,0.08),transparent_28%)]" />
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="outline" className="border-cyan-300/20 bg-cyan-300/[0.06] text-cyan-200">
            <Sparkles className="size-3.5" />
            LIVE MARKET INTELLIGENCE
          </Badge>
          <h2 className="mt-5 font-display text-3xl font-bold tracking-[-0.025em] text-slate-50 sm:text-4xl">
            Inside the <span className="heading-accent">SignalFlo AI Engine</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-400">
            See how <strong className="font-semibold text-slate-300">SignalFlo</strong> validates trade opportunities,
            analyzes market conditions, and delivers high-confidence trading alerts.
          </p>
          <p className="mx-auto mt-5 max-w-3xl text-sm leading-7 text-slate-500">
            <strong className="font-semibold text-slate-300">SignalFlo</strong> continuously processes market data, validates trade opportunities, and scores each setup before generating an alert.
          </p>
        </div>

        <div className="relative mt-12 overflow-hidden rounded-3xl border border-white/[0.07] bg-[#07111f]/74 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_34px_140px_rgba(2,8,23,0.38)] sm:p-6 lg:p-8">
          <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(0,212,255,0.16),transparent_29%),radial-gradient(circle_at_50%_48%,rgba(139,92,246,0.1),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(236,72,153,0.05),transparent_28%)]" />
          <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.035)_1px,transparent_1px)] bg-[size:42px_42px] opacity-45" />

          <div className="relative z-10 grid gap-4 lg:grid-cols-[minmax(0,1fr)_3rem_minmax(0,2fr)_3rem_minmax(0,1fr)] lg:items-center">
            <motion.div
              className="group relative overflow-hidden rounded-2xl border border-cyan-300/14 bg-[#081225]/88 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_20px_70px_rgba(2,8,23,0.34)] sm:p-6"
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
            >
              <CardEffects />
              <div className="relative z-10">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-300">Step 01</p>
                <h3 className="mt-2 text-xl font-semibold text-slate-100">Raw Market Data</h3>
                <p className="mt-2 text-xs leading-5 text-slate-500"><strong className="font-semibold">SignalFlo</strong> continuously monitors multiple intelligence sources.</p>
                <div className="mt-6 grid gap-2">
                  {marketInputs.map(([label, Icon], index) => (
                    <motion.div
                      key={label}
                      className="flex items-center justify-between gap-3 rounded-lg border border-white/[0.06] bg-white/[0.025] px-3 py-2.5"
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.35, delay: 0.12 + index * 0.06 }}
                    >
                      <span className="flex items-center gap-2.5 text-xs text-slate-300">
                        <Icon className="size-3.5 text-cyan-300" />
                        {label}
                      </span>
                      <motion.span
                        className="size-1.5 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(0,212,255,0.75)]"
                        animate={{ opacity: [0.45, 1, 0.45] }}
                        transition={{ duration: 2.2, repeat: Infinity, delay: index * 0.16 }}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            <FlowConnector delay={0.25} />

            <motion.div
              className="group relative overflow-hidden rounded-3xl border border-purple-300/28 bg-[#091429]/94 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_0_120px_rgba(59,130,246,0.18),0_0_90px_rgba(139,92,246,0.15)] sm:p-8 lg:-my-5 lg:min-h-[620px]"
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.6, delay: 0.18, ease: "easeOut" }}
            >
              <CardEffects />
              <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(0,212,255,0.14),transparent_36%),radial-gradient(circle_at_80%_80%,rgba(139,92,246,0.12),transparent_34%)]" />
              <div className="relative z-10">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-purple-300">Step 02 · Analysis</p>
                <h3 className="mt-2 text-2xl font-semibold text-slate-50">SignalFlo AI Engine</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">Multiple intelligence layers are analyzed, scored, and validated before an alert is generated.</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {["6 Intelligence Layers", "24/7 Monitoring", "AI Confidence Scoring"].map((badge) => (
                    <span key={badge} className="rounded-full border border-purple-300/15 bg-white/[0.035] px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.14em] text-slate-400 shadow-[0_0_18px_rgba(139,92,246,0.06)]">
                      {badge}
                    </span>
                  ))}
                </div>
                <div className="mt-7 grid gap-2.5">
                  {analysisChecks.map((check, index) => (
                    <motion.div
                      key={check}
                      className="flex items-center gap-3 rounded-xl border border-white/[0.065] bg-white/[0.03] px-3.5 py-3 text-xs text-slate-300"
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.34 + index * 0.1 }}
                    >
                      <motion.span
                        className="flex size-6 shrink-0 items-center justify-center rounded-full border border-cyan-300/18 bg-cyan-300/8 shadow-[0_0_18px_rgba(0,212,255,0.1)]"
                        animate={{ boxShadow: ["0 0 8px rgba(0,212,255,0.06)", "0 0 22px rgba(139,92,246,0.18)", "0 0 8px rgba(0,212,255,0.06)"] }}
                        transition={{ duration: 2.6, repeat: Infinity, delay: index * 0.18 }}
                      >
                        <Check className="size-3.5 text-cyan-300" />
                      </motion.span>
                      <span className="min-w-0 flex-1">{check.replace("Market Structure Validation", "Analyzing Market Structure...").replace("Options Flow Analysis", "Analyzing Options Flow...").replace("Technical Confirmation", "Confirming Technicals...").replace("Risk Assessment", "Validating Risk...").replace("Confidence Scoring", "Calculating AI Confidence...")}</span>
                      <span className="shrink-0 text-[9px] font-semibold uppercase tracking-[0.14em] text-cyan-300">Complete</span>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-7 overflow-hidden rounded-2xl border border-cyan-300/14 bg-cyan-300/[0.045] p-5 text-center">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">AI Confidence Score</p>
                  <motion.p
                    className="heading-accent mt-2 text-6xl font-bold tracking-[-0.05em]"
                    animate={{ opacity: [0.75, 1, 0.75] }}
                    transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                  >
                    94
                  </motion.p>
                  <motion.div className="mx-auto mt-3 h-1.5 max-w-xs overflow-hidden rounded-full bg-slate-800/80">
                    <motion.div
                      className="h-full rounded-full bg-[linear-gradient(90deg,#00D4FF,#3B82F6,#8B5CF6,#EC4899)]"
                      initial={{ width: 0 }}
                      whileInView={{ width: "94%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: 0.65, ease: "easeOut" }}
                    />
                  </motion.div>
                </div>
              </div>
            </motion.div>

            <FlowConnector delay={0.65} />

            <motion.div
              className="group relative overflow-hidden rounded-2xl border border-cyan-300/16 bg-[#081225]/92 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_20px_70px_rgba(2,8,23,0.34)] sm:p-6"
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.55, delay: 0.52, ease: "easeOut" }}
            >
              <CardEffects />
              <div className="relative z-10">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-purple-300">Step 03</p>
                    <h3 className="mt-2 text-xl font-semibold text-slate-100">Trade Alert Generated</h3>
                  </div>
                  <motion.span
                    className="size-2 rounded-full bg-cyan-300 shadow-[0_0_16px_rgba(0,212,255,0.8)]"
                    animate={{ scale: [1, 1.45, 1], opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 1.8, repeat: Infinity }}
                  />
                </div>
                <div className="mt-6 rounded-xl border border-cyan-300/12 bg-black/20 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.035),0_0_32px_rgba(59,130,246,0.06)]">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-lg font-semibold text-slate-50">NVDA CALL</p>
                        <span className="rounded-full border border-purple-300/16 bg-purple-300/8 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-purple-200">Call</span>
                      </div>
                      <p className="mt-2 inline-flex rounded-full border border-cyan-300/14 bg-cyan-300/8 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.15em] text-cyan-300">Ready For Review</p>
                    </div>
                    <div className="rounded-lg border border-cyan-300/14 bg-cyan-300/8 px-3 py-2 text-center">
                      <p className="text-[9px] uppercase tracking-[0.15em] text-slate-500">AI Score</p>
                      <p className="text-2xl font-bold text-cyan-200">94</p>
                    </div>
                  </div>
                  <div className="mt-5 grid gap-2">
                    {[["Entry", "$924.20"], ["Take Profit", "$952.80"], ["Stop Loss", "$908.40"], ["Confidence", "High"]].map(([label, value], index) => (
                      <motion.div
                        key={label}
                        className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.025] px-3 py-2.5 text-xs"
                        initial={{ opacity: 0, y: 8 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.35, delay: 0.72 + index * 0.08 }}
                      >
                        <span className="text-slate-500">{label}</span>
                        <span className={label === "Take Profit" || label === "Confidence" ? "font-semibold text-cyan-300" : "font-semibold text-slate-200"}>{value}</span>
                      </motion.div>
                    ))}
                  </div>
                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-800/80">
                    <motion.div
                      className="h-full rounded-full bg-[linear-gradient(90deg,#00D4FF,#3B82F6,#8B5CF6,#EC4899)]"
                      initial={{ width: 0 }}
                      whileInView={{ width: "94%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.1, delay: 0.9, ease: "easeOut" }}
                    />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-slate-500">
                  <Check className="size-3.5 text-cyan-300" />
                  Validated and structured
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="relative mt-9 text-center">
          <motion.span
            className="pointer-events-none absolute left-1/2 -top-9 h-8 w-px -translate-x-1/2 bg-[linear-gradient(180deg,rgba(236,72,153,0.08),rgba(139,92,246,0.7),rgba(0,212,255,0.1))]"
            animate={{ opacity: [0.3, 1, 0.3], scaleY: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <span className="pointer-events-none absolute left-1/2 top-1/2 h-24 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.2),rgba(59,130,246,0.1),transparent_68%)] blur-xl" />
          <Button asChild size="lg" className="relative border border-white/10 bg-[linear-gradient(135deg,#00D4FF_0%,#3B82F6_35%,#8B5CF6_70%,#EC4899_100%)] px-7 text-white shadow-[0_0_42px_rgba(59,130,246,0.28),0_0_34px_rgba(139,92,246,0.16)] transition-all hover:-translate-y-1 hover:brightness-110">
            <a href={AI_ENGINE_URL}>
              Explore the AI Engine
              <ArrowRight className="size-4" />
            </a>
          </Button>
        </div>
      </div>
    </FadeUp>
  )
}

function FlowConnector({ delay }: { delay: number }) {
  return (
    <div className="relative flex min-h-12 items-center justify-center lg:min-h-0">
      <div className="absolute h-full w-px bg-[linear-gradient(180deg,#00D4FF,#3B82F6,#8B5CF6,#EC4899)] opacity-45 lg:h-px lg:w-full lg:bg-[linear-gradient(90deg,#00D4FF,#3B82F6,#8B5CF6,#EC4899)]" />
      <motion.span
        className="absolute size-2 rounded-full bg-cyan-300 shadow-[0_0_16px_rgba(0,212,255,0.85)]"
        animate={{ y: ["-160%", "160%"], opacity: [0, 1, 0] }}
        transition={{ duration: 2.1, repeat: Infinity, delay, ease: "easeInOut" }}
      />
      <motion.span
        className="absolute hidden size-2 rounded-full bg-purple-300 shadow-[0_0_16px_rgba(139,92,246,0.85)] lg:block"
        animate={{ x: ["-160%", "160%"], opacity: [0, 1, 0] }}
        transition={{ duration: 2.1, repeat: Infinity, delay, ease: "easeInOut" }}
      />
      <ArrowRight className="relative z-10 hidden size-4 text-purple-300/65 lg:block" />
    </div>
  )
}

void AIEngineTeaserLegacy

function AIEngineTeaserCompact() {
  const dataInputs = [
    ["Options Flow", Activity],
    ["Market Structure", Workflow],
    ["Price Action", TrendingUp],
    ["Risk Context", ShieldCheck],
  ] as const
  const analysisRows = [
    "Market structure validated",
    "Options flow analyzed",
    "Risk profile confirmed",
  ]

  return (
    <FadeUp as="section" className="relative z-20 overflow-hidden border-y border-white/[0.06] bg-[#050914] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_50%,rgba(59,130,246,0.13),transparent_34%),radial-gradient(circle_at_84%_62%,rgba(139,92,246,0.09),transparent_28%),radial-gradient(circle_at_60%_35%,rgba(0,212,255,0.07),transparent_28%)]" />
      <div className="relative z-10 mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:gap-16">
        <div className="max-w-xl">
          <p className="heading-accent text-[11px] font-semibold uppercase tracking-[0.24em]">
            Inside the SignalFlo AI Engine
          </p>
          <h2 className="mt-5 font-display text-4xl font-bold leading-[1.06] tracking-[-0.035em] text-slate-50 sm:text-5xl">
            How SignalFlo Turns Market Noise Into{" "}
            <span className="heading-accent">
              Trade Alerts
            </span>
          </h2>
          <p className="mt-5 max-w-lg text-sm leading-7 text-slate-400">
            SignalFlo continuously processes market data, validates trade opportunities, and scores each setup before
            delivering a structured alert for review.
          </p>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {["Raw Market Data", "Multi-Layer AI Analysis", "AI Confidence Scoring", "Structured Trade Alerts"].map((feature) => (
              <div key={feature} className="flex items-center gap-2.5 text-sm text-slate-300">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-cyan-300/18 bg-cyan-300/8">
                  <Check className="size-3 text-cyan-300" />
                </span>
                {feature}
              </div>
            ))}
          </div>
          <Button asChild size="lg" className="mt-8 border border-white/10 bg-[linear-gradient(135deg,#00D4FF_0%,#3B82F6_35%,#8B5CF6_70%,#EC4899_100%)] px-7 text-white shadow-[0_0_38px_rgba(59,130,246,0.24),0_0_28px_rgba(139,92,246,0.12)] transition-all hover:-translate-y-1 hover:brightness-110">
            <a href={AI_ENGINE_URL}>
              Explore the AI Engine
              <ArrowRight className="size-4" />
            </a>
          </Button>
        </div>

        <motion.div
          className="relative overflow-hidden rounded-3xl border border-cyan-300/14 bg-[#07111f]/90 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_30px_120px_rgba(59,130,246,0.14)] sm:p-5"
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <CardEffects />
          <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(0,212,255,0.11),transparent_32%),radial-gradient(circle_at_82%_72%,rgba(139,92,246,0.09),transparent_28%)]" />
          <div className="relative z-10 flex items-center justify-between gap-3 border-b border-white/[0.07] pb-3">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-purple-300">Live intelligence flow</p>
              <p className="mt-1 text-xs text-slate-500">Data → Analysis → Alert</p>
            </div>
            <span className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.15em] text-cyan-300">
              <motion.span
                className="size-1.5 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(0,212,255,0.8)]"
                animate={{ scale: [1, 1.5, 1], opacity: [0.55, 1, 0.55] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              />
              Processing
            </span>
          </div>

          <div className="relative z-10 mt-4 grid gap-3 lg:grid-cols-[0.78fr_1.1fr_0.78fr] lg:items-stretch">
            <div className="rounded-2xl border border-cyan-300/12 bg-[#081225]/88 p-3.5">
              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-cyan-300">Raw Market Data</p>
              <div className="mt-3 grid gap-2">
                {dataInputs.map(([label, Icon], index) => (
                  <motion.div
                    key={label}
                    className="flex items-center justify-between gap-2 rounded-lg border border-white/[0.06] bg-white/[0.025] px-2.5 py-2"
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.07 }}
                  >
                    <span className="flex items-center gap-2 text-[10px] text-slate-300">
                      <Icon className="size-3 text-cyan-300" />
                      {label}
                    </span>
                    <span className="size-1 rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(0,212,255,0.75)]" />
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-purple-300/22 bg-[#091429]/94 p-4 shadow-[0_0_54px_rgba(59,130,246,0.1),0_0_38px_rgba(139,92,246,0.08)]">
              <span className="pointer-events-none absolute inset-x-4 top-0 h-px bg-[linear-gradient(90deg,transparent,#00D4FF,#8B5CF6,#EC4899,transparent)] opacity-75" />
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-purple-300">SignalFlo AI Engine</p>
                  <p className="mt-1 text-sm font-semibold text-slate-100">Multi-layer validation</p>
                </div>
                <Bot className="size-5 text-cyan-200" />
              </div>
              <div className="relative z-10 mt-4 grid gap-2">
                {analysisRows.map((row, index) => (
                  <motion.div
                    key={row}
                    className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.025] px-2.5 py-2 text-[10px] text-slate-300"
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: 0.18 + index * 0.1 }}
                  >
                    <Check className="size-3 text-cyan-300" />
                    {row}
                  </motion.div>
                ))}
              </div>
              <div className="relative z-10 mt-4 flex items-end justify-between rounded-xl border border-cyan-300/12 bg-cyan-300/[0.045] px-3 py-2.5">
                <div>
                  <p className="text-[8px] uppercase tracking-[0.15em] text-slate-500">AI Confidence</p>
                  <p className="mt-1 text-[10px] text-cyan-300">High conviction</p>
                </div>
                <p className="text-3xl font-bold text-cyan-200">94</p>
              </div>
            </div>

            <div className="rounded-2xl border border-cyan-300/14 bg-[#081225]/92 p-3.5">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-purple-300">Alert Generated</p>
                  <p className="mt-1 text-sm font-semibold text-slate-100">NVDA CALL</p>
                </div>
                <div className="rounded-lg border border-cyan-300/14 bg-cyan-300/8 px-2 py-1 text-center">
                  <p className="text-[7px] uppercase tracking-[0.12em] text-slate-500">Score</p>
                  <p className="text-lg font-bold text-cyan-200">94</p>
                </div>
              </div>
              <span className="mt-3 inline-flex rounded-full border border-cyan-300/14 bg-cyan-300/8 px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.13em] text-cyan-300">
                Ready For Review
              </span>
              <div className="mt-3 grid gap-1.5">
                {[["Entry", "$924.20"], ["TP", "$952.80"], ["SL", "$908.40"]].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between rounded-md border border-white/[0.05] bg-white/[0.02] px-2 py-1.5 text-[9px]">
                    <span className="text-slate-500">{label}</span>
                    <span className={label === "TP" ? "font-semibold text-cyan-300" : "font-semibold text-slate-200"}>{value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 h-1 overflow-hidden rounded-full bg-slate-800/80">
                <motion.div
                  className="h-full rounded-full bg-[linear-gradient(90deg,#00D4FF,#3B82F6,#8B5CF6,#EC4899)]"
                  initial={{ width: 0 }}
                  whileInView={{ width: "94%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.55 }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </FadeUp>
  )
}

void AIEngineTeaserCompact

function AIEngineTeaser() {
  const benefits = [
    ["AI Signal Detection", "SignalFlo scans market structure, price action, options flow, and risk conditions to surface higher-quality setups.", RadioTower],
    ["Multi-Layer AI Analysis", "Each setup is analyzed across multiple intelligence layers before being scored.", Bot],
    ["AI Confidence Scoring", "Every alert includes a confidence score so traders can quickly understand signal quality.", Target],
    ["Structured Trade Alerts", "Alerts include entry, target, stop loss, status, and key context in one clean format.", Workflow],
  ] as const
  const dataInputs = [
    ["Options Flow", Activity],
    ["Market Structure", Workflow],
    ["Price Action", TrendingUp],
    ["Risk Context", ShieldCheck],
  ] as const
  const analysisRows = [
    "Market structure validated",
    "Options flow analyzed",
    "Risk profile confirmed",
    "Confidence calculated",
  ]

  return (
    <FadeUp as="section" id="ai-engine" className="relative z-20 overflow-hidden border-y border-white/[0.06] bg-[#050914] px-4 py-[clamp(4.5rem,8vw,8rem)] sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_48%,rgba(0,212,255,0.08),transparent_30%),radial-gradient(circle_at_78%_50%,rgba(139,92,246,0.11),transparent_32%),radial-gradient(circle_at_88%_64%,rgba(236,72,153,0.045),transparent_25%)]" />
      <div className="relative z-10 mx-auto grid max-w-[1280px] gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-20">
        <div className="max-w-xl">
          <p className="section-eyebrow heading-accent">
            Under the Hood
          </p>
          <h2 className="section-title font-display">
            The SignalFlo{" "}
            <span className="heading-accent">AI Engine</span>
          </h2>
          <p className="section-subtitle mt-6 max-w-[520px]">
            <strong className="font-semibold text-slate-300">SignalFlo</strong> continuously processes market data,
            validates trade opportunities, and scores each setup before delivering a structured alert for review.
          </p>

          <div className="mt-9 grid gap-7">
            {benefits.map(([title, copy, Icon], index) => (
              <motion.div
                key={title}
                className="flex items-start gap-4"
                initial={{ opacity: 0, x: -14 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.07 }}
              >
                <span className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-cyan-300/12 bg-[#081225]/88 text-cyan-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_0_24px_rgba(59,130,246,0.08)]">
                  <Icon className="size-5" />
                </span>
                <div>
                  <h3 className="text-base font-semibold text-slate-100">{title}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-slate-500">{boldSignalFlo(copy)}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <Button asChild size="lg" className="mt-10 h-14 rounded-xl border border-white/10 bg-[linear-gradient(135deg,#00D4FF_0%,#3B82F6_35%,#8B5CF6_70%,#EC4899_100%)] px-7 text-white shadow-[0_0_42px_rgba(59,130,246,0.28),0_0_30px_rgba(139,92,246,0.14)] transition-all hover:-translate-y-1 hover:brightness-110">
            <a href={AI_ENGINE_URL}>
              Explore the AI Engine
              <ArrowRight className="size-4" />
            </a>
          </Button>
        </div>

        <motion.div
          className="relative overflow-hidden rounded-3xl border border-cyan-300/14 bg-[#07111f]/92 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_34px_140px_rgba(59,130,246,0.16),0_0_90px_rgba(139,92,246,0.08)] sm:p-7 lg:p-8"
          initial={{ opacity: 0, x: 26 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
        >
          <CardEffects />
          <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.03)_1px,transparent_1px)] bg-[size:36px_36px] opacity-40" />
          <motion.span
            className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-cyan-300/10 to-transparent"
            animate={{ y: ["-40%", "700%"], opacity: [0, 0.65, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="relative z-10 flex items-center justify-between gap-4 border-b border-white/[0.07] pb-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-purple-300">Live Intelligence Flow</p>
              <p className="mt-1 text-xs text-slate-500">Data → Analysis → Alert</p>
            </div>
            <span className="flex items-center gap-2 rounded-full border border-cyan-300/14 bg-cyan-300/8 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.15em] text-cyan-300">
              <motion.span
                className="size-1.5 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(0,212,255,0.8)]"
                animate={{ scale: [1, 1.5, 1], opacity: [0.55, 1, 0.55] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              />
              Processing
            </span>
          </div>

          <div className="relative z-10 mt-5 grid gap-3">
            <motion.div
              className="rounded-2xl border border-cyan-300/12 bg-[#081225]/88 p-4"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-cyan-300">01 · Raw Market Data</p>
                  <p className="mt-1 text-xs text-slate-500">Continuous market intelligence intake</p>
                </div>
                <RadioTower className="size-4 text-cyan-200" />
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {dataInputs.map(([label, Icon], index) => (
                  <motion.div
                    key={label}
                    className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.025] px-3 py-2"
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.06 }}
                  >
                    <span className="flex items-center gap-2 text-[10px] text-slate-300">
                      <Icon className="size-3 text-cyan-300" />
                      {label}
                    </span>
                    <span className="size-1 rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(0,212,255,0.75)]" />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="relative overflow-hidden rounded-2xl border border-blue-300/18 bg-[rgba(8,13,28,0.72)] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-[18px]"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.18 }}
            >
              <span className="pointer-events-none absolute inset-x-6 top-0 h-px bg-[linear-gradient(90deg,transparent,#7DD3FC,#60A5FA,#3B82F6,transparent)] opacity-75" />
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-blue-300">02 · SignalFlo AI Engine</p>
                  <p className="mt-1 text-sm font-semibold text-slate-100">Multi-layer validation and scoring</p>
                </div>
                <Bot className="size-5 text-cyan-200" />
              </div>
              <div className="relative z-10 mt-4 grid gap-2 sm:grid-cols-2">
                {analysisRows.map((row, index) => (
                  <motion.div
                    key={row}
                    className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.025] px-3 py-2 text-[10px] text-slate-300"
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: 0.3 + index * 0.08 }}
                  >
                    <Check className="size-3 text-cyan-300" />
                    {row}
                  </motion.div>
                ))}
              </div>
              <div className="relative z-10 mt-4 flex items-center justify-between rounded-xl border border-cyan-300/12 bg-cyan-300/[0.045] px-4 py-3">
                <div>
                  <p className="text-[8px] uppercase tracking-[0.15em] text-slate-500">AI Confidence</p>
                  <p className="mt-1 text-[10px] text-cyan-300">High conviction setup</p>
                </div>
                <p className="text-3xl font-bold text-cyan-200">94</p>
              </div>
            </motion.div>

            <motion.div
              className="rounded-2xl border border-cyan-300/14 bg-[#081225]/92 p-4"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.42 }}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-blue-300">03 · Alert Generated</p>
                  <div className="mt-1 flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-100">NVDA CALL</p>
                    <span className="rounded-full border border-blue-300/14 bg-blue-300/8 px-2 py-0.5 text-[8px] uppercase tracking-[0.12em] text-blue-200">Call</span>
                  </div>
                </div>
                <div className="rounded-lg border border-cyan-300/14 bg-cyan-300/8 px-3 py-1.5 text-center">
                  <p className="text-[7px] uppercase tracking-[0.12em] text-slate-500">AI Score</p>
                  <p className="text-xl font-bold text-cyan-200">94</p>
                </div>
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {[["Entry", "$924.20"], ["TP", "$952.80"], ["SL", "$908.40"]].map(([label, value]) => (
                  <div key={label} className="rounded-lg border border-white/[0.055] bg-white/[0.025] px-3 py-2">
                    <p className="text-[8px] uppercase tracking-[0.12em] text-slate-500">{label}</p>
                    <p className={cn("mt-1 text-xs font-semibold", label === "TP" ? "text-cyan-300" : "text-slate-200")}>{value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="rounded-full border border-cyan-300/14 bg-cyan-300/8 px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.13em] text-cyan-300">Ready For Review</span>
                <span className="text-[9px] uppercase tracking-[0.13em] text-slate-600">Structured alert</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </FadeUp>
  )
}

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navLinks = [
    ["How It Works", "/#how-it-works"],
    ["Live Trade Example", "/#alert-example"],
    ["Features", "/#features"],
    ["AI Engine", "/#ai-engine"],
    ["FAQ", "/#faq"],
    ["Welcome", WELCOME_URL],
    ["Get Started", PRICING_URL],
  ] as const

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.07] bg-[#050a14]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="/" className="flex h-12 items-center py-1 pr-3" aria-label="SignalFlo home">
          <BrandLogo className="h-8 max-w-[132px] sm:h-10 sm:max-w-[158px] lg:h-11 lg:max-w-[174px]" />
        </a>
        <nav className="hidden items-center gap-6 text-xs text-slate-400 lg:flex">
          {navLinks.map(([label, href]) => (
            <a
              key={label}
              href={href}
              className={cn(
                "transition-all hover:text-white",
                label === "Get Started" &&
                  "rounded-md border border-blue-300/20 bg-gradient-to-r from-blue-500 to-cyan-400 px-3.5 py-2 font-semibold text-white shadow-[0_0_22px_rgba(59,130,246,0.24)] hover:-translate-y-0.5 hover:brightness-110",
              )}
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center sm:flex">
          <Button asChild variant="ghost" size="sm" className="h-8 text-xs transition-all hover:bg-white/[0.06]">
            <a href={APP_URL}>Login</a>
          </Button>
        </div>
        <Button
          className="sm:hidden"
          variant="outline"
          size="icon"
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          <Menu />
        </Button>
      </div>
      {mobileMenuOpen && (
        <nav className="border-t border-white/[0.07] bg-[#050a14]/96 px-4 py-3 backdrop-blur-xl sm:hidden">
          <div className="mx-auto grid max-w-7xl gap-1">
            {navLinks.map(([label, href]) => (
              <a
                key={label}
                href={href}
                className={cn(
                  "rounded-md px-3 py-2.5 text-sm text-slate-300 transition-all hover:bg-white/[0.05] hover:text-white",
                  label === "Get Started" &&
                    "mt-1 bg-gradient-to-r from-blue-500 to-cyan-400 text-center font-semibold text-white shadow-[0_0_22px_rgba(59,130,246,0.22)] hover:brightness-110",
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {label}
              </a>
            ))}
            <a
              href={APP_URL}
              className="mt-1 rounded-md border-t border-white/[0.07] px-3 py-3 text-sm font-medium text-slate-100"
            >
              Login
            </a>
          </div>
        </nav>
      )}
    </header>
  )
}

function Hero() {
  return (
    <section id="dashboard" className="relative z-10 mb-[-2.5rem] overflow-visible sm:mb-[-3rem]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_22%,rgba(0,212,255,0.2),transparent_28%),radial-gradient(circle_at_82%_35%,rgba(139,92,246,0.15),transparent_25%),radial-gradient(circle_at_18%_20%,rgba(59,130,246,0.16),transparent_24%),radial-gradient(circle_at_72%_14%,rgba(236,72,153,0.07),transparent_22%),linear-gradient(180deg,#07111f_0%,#050914_100%)]" />
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col px-4 pb-[clamp(3.5rem,6vw,6rem)] pt-[calc(3.5rem+clamp(1rem,2.4vh,1.75rem))] sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="mx-auto mt-[clamp(1.5rem,4vw,3rem)] max-w-4xl text-center"
        >
          <Badge variant="outline" className="border-cyan-400/20 bg-cyan-400/5 text-cyan-200">
            <Sparkles className="text-cyan-300" />
            AI watchlists, alerts, and trade plans
          </Badge>
          <h1 className="mx-auto mt-4 max-w-4xl text-[2.65rem] font-semibold leading-[0.96] tracking-[-0.03em] sm:text-5xl lg:text-[4.35rem]">
            <span className="block">AI-Powered Trading Alerts</span>
            <span className="mt-0.5 block sm:mt-1">
              <AnimatedGradientText>Built for Smarter Traders</AnimatedGradientText>
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-[15px]">
            Harness the power of AI trading. Get real-time stock, options, and
            futures signals generated by <strong className="font-semibold">SignalFlo</strong> AI, built to help you win
            more trades, more often.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild className="border border-white/10 bg-[linear-gradient(135deg,#00D4FF_0%,#3B82F6_35%,#8B5CF6_70%,#EC4899_100%)] text-white shadow-[0_0_28px_rgba(59,130,246,0.3)] transition-all hover:-translate-y-0.5 hover:brightness-110">
              <a href={SIGNUP_URL}>
                Start Receiving Alerts
                <ArrowRight />
              </a>
            </Button>
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
      className="relative mx-auto mt-[clamp(2rem,4vw,3rem)] -mb-[clamp(1.25rem,3vw,2.5rem)] w-full max-w-[78rem] overflow-visible rounded-t-[2rem]"
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
              <span className="text-cyan-300"><strong className="font-semibold">SignalFlo</strong> Command Center</span>
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

void MarketTicker

function Features() {
  const markets = [
    ["Stocks", TrendingUp],
    ["Options", CircleDollarSign],
    ["0DTE", Activity],
    ["Swing Trades", FileClock],
    ["Momentum", RadioTower],
    ["Breakouts", Target],
    ["Earnings", Sparkles],
    ["AI Ranked Setups", Bot],
  ] as const
  const structureCards = [
    ["ENTRY", Target, "Know exactly where to enter."],
    ["RISK", ShieldCheck, "Know exactly where to exit."],
    ["TRACKING", MonitorSmartphone, "Know exactly what happened."],
  ] as const

  return (
    <FadeUp as="section" id="features" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
      <SectionHeading
        kicker="Markets"
        title="Markets We Cover"
        highlight="We Cover"
        description="Focused alert categories for traders who want clear setups without extra noise."
      />
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:mt-10 lg:grid-cols-4">
        {markets.map(([title, Icon], index) => (
            <MotionCard key={title} delay={index * 0.035}>
              <Card className={cardSurfaceClass}>
                <CardEffects />
                <CardHeader className="relative z-10 flex min-h-32 flex-col justify-between p-5">
                  <span className="flex size-10 items-center justify-center rounded-lg border border-cyan-300/10 bg-gradient-to-br from-blue-500/30 via-cyan-300/14 to-purple-500/16 text-cyan-200 shadow-[0_0_24px_rgba(34,211,238,0.08)]">
                    <Icon className="size-4" />
                  </span>
                  <CardTitle className="mt-5 text-base font-semibold tracking-[-0.01em] text-slate-100">{title}</CardTitle>
                </CardHeader>
              </Card>
            </MotionCard>
        ))}
      </div>
      <div className="mt-10 border-t border-white/[0.06] pt-10">
        <SectionHeading
          kicker="Structure"
          title="Built for Traders Who Want Structure"
          highlight="Structure"
          description="SignalFlo keeps the trading workflow focused around levels, risk, and tracking."
        />
        <div className="mt-8 grid gap-3 lg:grid-cols-3">
          {structureCards.map(([title, Icon, copy], index) => (
            <MotionCard key={title} delay={index * 0.04}>
              <Card className={cardSurfaceClass}>
                <CardEffects />
                <CardHeader className="relative z-10 p-5">
                  <span className="flex size-10 items-center justify-center rounded-lg border border-cyan-300/10 bg-gradient-to-br from-blue-500/24 to-cyan-300/12 text-cyan-200 shadow-[0_0_24px_rgba(34,211,238,0.08)]">
                    <Icon className="size-4" />
                  </span>
                  <CardTitle className="mt-4 text-base font-semibold tracking-[-0.01em] text-slate-100">{title}</CardTitle>
                  <CardDescription className="mt-2 text-sm leading-6 text-slate-500">{boldSignalFlo(copy)}</CardDescription>
                </CardHeader>
              </Card>
            </MotionCard>
          ))}
        </div>
      </div>
    </FadeUp>
  )
}

function WhySignalFlo() {
  const reasons = [
    ["ENTRY", Target, "Know exactly where to enter."],
    ["RISK", ShieldCheck, "Know exactly where to exit."],
    ["TRACKING", MonitorSmartphone, "Know exactly what happened."],
  ] as const

  return (
    <FadeUp as="section" className="border-y border-white/[0.06] bg-[#07101f] px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          kicker="Structure"
          title="Built for Traders Who Want Structure"
          highlight="Structure"
          description="SignalFlo keeps the trading workflow focused around levels, risk, and tracking."
        />
        <div className="mt-8 grid gap-3 lg:mt-10 lg:grid-cols-3">
          {reasons.map(([title, Icon, copy], index) => (
            <MotionCard key={title} delay={index * 0.04}>
              <Card className={cardSurfaceClass}>
                <CardEffects />
                <CardHeader className="relative z-10 p-5">
                  <span className="flex size-10 items-center justify-center rounded-lg border border-cyan-300/10 bg-gradient-to-br from-blue-500/24 to-cyan-300/12 text-cyan-200 shadow-[0_0_24px_rgba(34,211,238,0.08)]">
                    <Icon className="size-4" />
                  </span>
                  <CardTitle className="mt-4 text-base font-semibold tracking-[-0.01em] text-slate-100">{title}</CardTitle>
                  <CardDescription className="mt-2 text-sm leading-6 text-slate-500">{boldSignalFlo(copy)}</CardDescription>
                </CardHeader>
              </Card>
            </MotionCard>
          ))}
        </div>
      </div>
    </FadeUp>
  )
}

void WhySignalFlo

function CardEffects() {
  return (
    <>
      <span className="pointer-events-none absolute -left-2 top-0 h-full w-16 -translate-x-24 rotate-12 bg-gradient-to-r from-transparent via-white/8 to-transparent opacity-0 blur-sm transition-all duration-700 group-hover:translate-x-[28rem] group-hover:opacity-100" />
      <span className="pointer-events-none absolute inset-x-4 bottom-0 h-px origin-left scale-x-0 rounded-full bg-[linear-gradient(90deg,#7DD3FC,#60A5FA,#3B82F6)] opacity-60 transition-transform duration-500 group-hover:scale-x-100" />
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
        <CardDescription className="mt-1 text-xs leading-5 text-slate-500">{boldSignalFlo(feature.copy)}</CardDescription>
        <div className="mt-auto flex items-center gap-2 pt-5 text-[10px] font-medium uppercase tracking-[0.16em] text-slate-600">
          <span className="size-1 rounded-full bg-cyan-300/80" />
          {detailLabels[index]}
        </div>
      </CardHeader>
    </Card>
  )
}

void FeatureCard

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
  const dashboardToastMessages = ["NVDA Alert Published", "SPY Target Hit"]
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
        kicker="Dashboard"
        title="See Exactly What Members See"
        highlight="Members See"
        description="Every alert includes entry, target, stop loss, confidence score, and live tracking."
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
            {dashboardToastMessages[updatedIndex % dashboardToastMessages.length]}
          </div>
          <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-slate-500">Updated recently</p>
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
                <span className="text-cyan-300"><strong className="font-semibold">SignalFlo</strong> Command Center</span>
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
                    <p>{dashboardToastMessages[updatedIndex % dashboardToastMessages.length]}</p>
                    <p className="mt-0.5 text-[9px] uppercase tracking-[0.16em] text-slate-500">Updated recently</p>
                  </motion.div>
                )}
                <div className="flex items-center justify-between">
                  <p className="flex items-center gap-2 text-xs font-medium text-slate-300">
                    <motion.span
                      className="size-1.5 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.8)]"
                      animate={{ scale: [1, 1.6, 1], opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    />
                    Recent alerts
                  </p>
                  <span className="text-[10px] text-cyan-300/75">{dashboardAlerts.length} active - Updated {updatedLabels[updatedIndex]} ago</span>
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
                      <div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-800/80">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-300 to-purple-400"
                          initial={{ width: 0 }}
                          whileInView={{ width: alert.score }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.7, delay: index * 0.06, ease: "easeOut" }}
                        />
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
        <strong className="font-semibold">SignalFlo</strong> tracking live
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
    <FadeUp as="section" id="ai-engine-details" className="relative overflow-hidden border-y border-white/[0.06] bg-[#050914] px-4 pb-24 pt-20 sm:px-6 sm:pb-28 sm:pt-24 lg:px-8 lg:pb-32 lg:pt-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_16%,rgba(59,130,246,0.2),transparent_34%),radial-gradient(circle_at_78%_28%,rgba(0,212,255,0.17),transparent_28%),radial-gradient(circle_at_76%_62%,rgba(139,92,246,0.1),transparent_28%),radial-gradient(circle_at_26%_72%,rgba(236,72,153,0.045),transparent_24%),linear-gradient(180deg,#050914_0%,#07101f_48%,#050914_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.035)_1px,transparent_1px)] bg-[size:56px_56px] opacity-45" />
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-cyan-300/8 to-transparent"
        animate={{ y: ["-20%", "520%"], opacity: [0, 0.7, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        <SectionHeading
          kicker="Market Intelligence Layer"
          title="The SignalFlo AI Engine"
          highlight="AI Engine"
          description="Built to filter market noise, identify institutional-grade confluence, and surface high-conviction trade opportunities in real time."
        />

        <EngineMetricStrip />

        <div className="mt-12 grid gap-8 xl:grid-cols-[0.82fr_1.38fr] xl:items-stretch">
          <div className="grid content-start gap-4">
            <EngineWorkflowStage stage={workflowStages[0]} index={0} />
            <EngineWorkflowStage stage={workflowStages[1]} index={1} />
            <EngineWorkflowStage stage={workflowStages[2]} index={2} />
          </div>
          <DecisionEngineVisual />
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {engineCopyBlocks.slice(0, 3).map((copy, index) => (
            <EngineParagraphCard key={copy} copy={copy} index={index} />
          ))}
        </div>

        <MarketIntelligenceStack />

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
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
        <p className="relative z-10 text-sm leading-7 text-slate-400 sm:leading-8">{boldSignalFlo(copy)}</p>
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
        <p className="relative z-10 mt-4 text-sm leading-6 text-slate-400">{boldSignalFlo(stage.copy)}</p>
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
      <SectionHeading
        kicker="Architecture"
        title="Market Intelligence Stack"
        highlight="Intelligence Stack"
        description="A layered scoring architecture that evaluates structure, flow, liquidity, catalysts, and risk before an alert reaches members."
      />
      <div className="relative mx-auto mt-10 max-w-6xl overflow-hidden rounded-3xl border border-cyan-300/14 bg-[#050b16]/86 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_32px_140px_rgba(14,165,233,0.16),0_0_80px_rgba(124,58,237,0.08),0_0_70px_rgba(236,72,153,0.035)] sm:p-6 lg:p-8">
        <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(0,212,255,0.19),transparent_38%),radial-gradient(circle_at_12%_20%,rgba(59,130,246,0.15),transparent_28%),radial-gradient(circle_at_86%_72%,rgba(139,92,246,0.14),transparent_28%),radial-gradient(circle_at_70%_18%,rgba(236,72,153,0.055),transparent_24%)]" />
        <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.035)_1px,transparent_1px)] bg-[size:34px_34px] opacity-50" />
        <motion.span
          className="pointer-events-none absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-transparent via-cyan-300/10 to-transparent"
          animate={{ x: ["-35%", "1120%"] }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />

        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.1fr_190px_1.1fr] lg:items-center">
          <div className="grid gap-4">
            {engineFeatures.slice(0, 3).map((feature, index) => (
              <EngineLayerModule key={feature.title} feature={feature} index={index} />
            ))}
          </div>

          <motion.div
            className="relative mx-auto flex size-44 items-center justify-center rounded-full border border-cyan-300/18 bg-cyan-300/8 shadow-[0_0_72px_rgba(34,211,238,0.2),0_0_42px_rgba(124,58,237,0.12)] lg:size-52"
            animate={{ boxShadow: ["0 0 72px rgba(34,211,238,0.16),0 0 36px rgba(124,58,237,0.1)", "0 0 112px rgba(34,211,238,0.28),0 0 70px rgba(124,58,237,0.16)", "0 0 72px rgba(34,211,238,0.16),0 0 36px rgba(124,58,237,0.1)"] }}
            transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <motion.span className="absolute -inset-8 rounded-full border border-cyan-300/10" animate={{ rotate: 360 }} transition={{ duration: 28, repeat: Infinity, ease: "linear" }} />
            <motion.span className="absolute -inset-4 rounded-full border border-blue-300/14" animate={{ rotate: -360 }} transition={{ duration: 22, repeat: Infinity, ease: "linear" }} />
            <motion.span className="absolute -inset-12 rounded-full border border-purple-300/6" animate={{ scale: [0.96, 1.04, 0.96], opacity: [0.25, 0.5, 0.25] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
            <div className="relative text-center">
              <Cpu className="mx-auto size-7 text-cyan-200" />
              <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">AI Confluence</p>
              <p className="mt-1 text-xl font-bold text-slate-100">Core</p>
            </div>
            <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-cyan-300/30 to-transparent lg:block" />
            <div className="absolute top-1/2 hidden h-px w-[calc(100vw)] -translate-y-1/2 bg-gradient-to-r from-transparent via-cyan-300/20 to-transparent lg:block" />
          </motion.div>

          <div className="grid gap-4">
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
        "group relative overflow-hidden rounded-2xl border border-blue-300/12 bg-[#081225]/86 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_20px_80px_rgba(2,8,23,0.34)] transition-all duration-300 hover:border-cyan-300/28 hover:bg-[#0a1428]/90 sm:p-6",
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
          <p className="mt-2 text-xs leading-5 text-slate-500">{boldSignalFlo(feature.copy)}</p>
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
  const intelligenceWorkflow = [
    "Market Structure Analysis",
    "Liquidity Validation",
    "Risk Modeling",
    "Context Confirmation",
    "AI Confidence Ranking",
    "Trade Published",
  ]

  return (
    <motion.div
      className="relative mt-20 overflow-hidden rounded-3xl border border-cyan-300/14 bg-[#07111f]/90 p-8 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_34px_150px_rgba(14,165,233,0.18)] sm:p-11 lg:p-14"
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
      <div className="relative z-10 mx-auto max-w-5xl">
        <div className="text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-400"><strong>SignalFlo</strong> Advantage</p>
        <div className="mx-auto mt-7 grid max-w-xl grid-cols-[1fr_auto_1fr] items-center gap-3 text-[10px] uppercase tracking-[0.18em] text-slate-600">
          <span className="h-px bg-gradient-to-r from-transparent to-cyan-300/24" />
          <span className="rounded-full border border-cyan-300/12 bg-cyan-300/8 px-3 py-1 text-cyan-200">Alert filtered through intelligence layers</span>
          <span className="h-px bg-gradient-to-l from-transparent to-cyan-300/24" />
        </div>
        <h3 className="mt-8 text-5xl font-semibold tracking-[-0.04em] text-slate-50 sm:text-7xl">
          Not More Alerts. <AnimatedGradientText>Better Intelligence.</AnimatedGradientText>
        </h3>
        </div>
        <div className="mx-auto mt-7 flex max-w-5xl flex-col items-stretch justify-center gap-3 lg:flex-row lg:items-center lg:gap-2">
          {intelligenceWorkflow.map((step, index) => (
            <Fragment key={step}>
              <motion.div
                className="group relative flex min-h-16 flex-1 items-center justify-center overflow-hidden rounded-2xl border border-cyan-300/12 bg-[#081225]/82 px-3 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_16px_48px_rgba(14,165,233,0.08)] transition-all duration-300 hover:border-cyan-300/32 hover:bg-[#0a1428]/92 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_18px_56px_rgba(14,165,233,0.16),0_0_24px_rgba(34,211,238,0.08)]"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.04 }}
              >
                <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.12),transparent_42%)] opacity-80" />
                <span className="relative z-10">{step}</span>
              </motion.div>
              {index < intelligenceWorkflow.length - 1 && (
                <span className="hidden text-cyan-300/50 lg:block">→</span>
              )}
            </Fragment>
          ))}
        </div>
        <div className="mx-auto mt-7 max-w-5xl">
          <div className="w-full px-5 py-2 text-center sm:px-6">
            <p className="mx-auto max-w-[690px] text-center text-base leading-[1.75] text-slate-400 sm:text-[17px]">
              <strong className="font-semibold text-slate-300">SignalFlo</strong> does not generate alerts because a single indicator crossed a line. Every opportunity must pass through multiple layers of market intelligence, confluence analysis, liquidity validation, risk modeling, and contextual confirmation before it reaches the platform. The result is <span className="font-medium text-slate-200">fewer alerts</span>, <span className="font-medium text-slate-200">higher conviction</span>, and a <span className="font-medium text-slate-200">disciplined approach</span> to identifying opportunities in today's markets.
            </p>
          </div>
          <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              type="button"
              onClick={() => {
                window.location.href = SIGNUP_URL
              }}
              className="group h-14 w-full justify-center gap-2 border border-cyan-300/24 bg-cyan-300/10 px-8 text-base font-bold text-cyan-100 shadow-[0_0_44px_rgba(34,211,238,0.2)] transition-all hover:-translate-y-1 hover:border-cyan-300/45 hover:bg-cyan-300/14 hover:shadow-[0_0_58px_rgba(34,211,238,0.28)] sm:w-auto"
              variant="outline"
            >
              <ArrowRight className="size-4" />
              START TRADING SMARTER
            </Button>
            <Button
              asChild
              className="h-14 w-full justify-center border border-white/10 bg-white/[0.03] px-8 text-base font-semibold text-slate-200 transition-all hover:-translate-y-1 hover:border-cyan-300/24 hover:bg-white/[0.06] sm:w-auto"
              variant="outline"
            >
              <a href={SUPPORT_URL}>Schedule A Live Demo</a>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function PricingTrustSections() {
  return (
    <FadeUp as="section" className="relative overflow-hidden border-b border-white/[0.06] bg-[#050914] px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_10%,rgba(37,99,235,0.16),transparent_32%),radial-gradient(circle_at_76%_42%,rgba(34,211,238,0.12),transparent_30%)]" />
      <div className="relative z-10 mx-auto max-w-7xl">
        <SectionHeading
          kicker="Intelligence network"
          title="SignalFlo Intelligence Network"
          highlight="Intelligence Network"
          description="Built to deliver institutional-grade market intelligence through AI-powered trade monitoring."
        />

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {intelligenceNetworkMetrics.map(([title, detail, Icon], index) => (
            <MotionCard key={title} delay={index * 0.045}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-cyan-300/10 bg-[#081225]/78 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_18px_70px_rgba(2,8,23,0.28)] transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/28 hover:bg-[#0a1428]/88">
                <CardEffects />
                <div className="relative z-10 flex items-start justify-between gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-cyan-300/12 bg-cyan-300/8 text-cyan-200 shadow-[0_0_26px_rgba(34,211,238,0.1)]">
                    <Icon className="size-4" />
                  </span>
                  <motion.span
                    className="mt-1 size-1.5 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(34,211,238,0.8)]"
                    animate={{ scale: [1, 1.7, 1], opacity: [0.55, 1, 0.55] }}
                    transition={{ duration: 1.8, repeat: Infinity, delay: index * 0.18, ease: "easeInOut" }}
                  />
                </div>
                <p className="relative z-10 mt-5 text-lg font-semibold tracking-[-0.01em] text-slate-100">{title}</p>
                <p className="relative z-10 mt-2 text-sm leading-6 text-slate-500">{detail}</p>
              </div>
            </MotionCard>
          ))}
        </div>

        <div className="mx-auto mt-10 max-w-4xl">
          <div className="relative overflow-hidden rounded-2xl border border-blue-300/10 bg-[#071326]/78 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_22px_90px_rgba(14,165,233,0.1)] sm:p-5">
            <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(34,211,238,0.14),transparent_36%)]" />
            <div className="relative z-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-100">Recent Alert Activity</p>
                <p className="mt-1 text-xs text-slate-500">Live-style product activity examples from the alert workflow.</p>
              </div>
              <span className="flex w-fit items-center gap-2 rounded-full border border-cyan-300/14 bg-cyan-300/8 px-3 py-1 text-[11px] text-cyan-200">
                <motion.span
                  className="size-1.5 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(34,211,238,0.85)]"
                  animate={{ scale: [1, 1.8, 1], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
                Monitoring live
              </span>
            </div>
            <div className="relative z-10 mt-4 grid gap-2">
              {recentAlertActivity.map(([ticker, action, outcome, time, state], index) => (
                <motion.div
                  key={`${ticker}-${action}`}
                  className="flex flex-col gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-3 text-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-300/22 hover:bg-cyan-300/[0.035] sm:flex-row sm:items-center sm:justify-between"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.32, delay: index * 0.05 }}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <motion.span
                      className={cn(
                        "size-2 shrink-0 rounded-full shadow-[0_0_14px_rgba(34,211,238,0.75)]",
                        state === "closed" ? "bg-emerald-300" : state === "published" ? "bg-cyan-300" : "bg-blue-300",
                      )}
                      animate={{ scale: [1, 1.55, 1], opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 1.8, repeat: Infinity, delay: index * 0.16, ease: "easeInOut" }}
                    />
                    <p className="min-w-0 text-slate-300">
                      <span className="font-semibold text-slate-100">{ticker}</span>{" "}
                        {action} {outcome && <span className="font-semibold text-emerald-300">{outcome}</span>}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-slate-600">{time}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </FadeUp>
  )
}

function RecentAlertActivityPanel() {
  return (
    <div className="relative flex flex-col overflow-hidden rounded-3xl border border-blue-300/10 bg-[#071326]/78 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_22px_90px_rgba(37,99,235,0.1)] sm:p-5 lg:h-full">
      <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(59,130,246,0.12),transparent_36%)]" />
      <div className="relative z-10 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-100">Recent Alert Activity</p>
          <p className="mt-1 text-xs text-slate-500">Live-style product activity examples from the alert workflow.</p>
        </div>
        <span className="flex shrink-0 items-center gap-2 pt-0.5 text-[11px] font-medium text-cyan-200 sm:self-center">
          <motion.span
            className="size-1.5 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(34,211,238,0.85)]"
            animate={{ scale: [1, 1.9, 1], opacity: [0.55, 1, 0.55] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
          Monitoring live.
        </span>
      </div>
      <div className="relative z-10 mt-5 flex flex-1 flex-col gap-3 lg:justify-between">
        {recentAlertActivity.map(([ticker, action, outcome, time, state], index) => (
          <motion.div
            key={`${ticker}-${action}`}
            className="group flex min-h-[4.15rem] flex-col gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-3.5 text-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-300/22 hover:bg-cyan-300/[0.035] hover:shadow-[0_14px_42px_rgba(14,165,233,0.08)] sm:flex-row sm:items-center sm:justify-between lg:min-h-[4.45rem]"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.32, delay: index * 0.05 }}
          >
            <div className="flex min-w-0 items-center gap-3">
              <motion.span
                className={cn(
                  "size-2 shrink-0 rounded-full shadow-[0_0_14px_rgba(59,130,246,0.65)]",
                  state === "closed" ? "bg-emerald-300" : state === "published" ? "bg-cyan-300" : "bg-blue-300",
                )}
                animate={{ scale: [1, 1.55, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1.8, repeat: Infinity, delay: index * 0.16, ease: "easeInOut" }}
              />
              <p className="min-w-0 text-slate-300">
                <span className="font-semibold text-slate-100">{ticker}</span>{" "}
                {action} {outcome && <span className="font-semibold text-emerald-300">{outcome}</span>}
              </p>
            </div>
            <span className="shrink-0 text-xs text-slate-600">{time}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

void RecentAlertActivityPanel

function AlertReadingGuide() {
  const guideItems = [
    ["Entry Price", "The ideal area to enter the trade.", Target],
    ["Take Profit", "The target level where gains may be taken.", TrendingUp],
    ["Stop Loss", "The level used to define risk.", ShieldCheck],
    ["AI Confidence Score", "SignalFlo's assessment of setup quality based on multiple intelligence layers.", Bot],
  ] as const

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-400/15 bg-[rgba(8,13,28,0.72)] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-[18px] sm:p-6">
      <div>
        <p className="section-eyebrow text-cyan-300">Alert Guide</p>
        <h3 className="text-xl font-bold text-slate-100">How To Read This Alert</h3>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Each level gives traders the context needed to evaluate and manage a setup.
        </p>
      </div>
      <div className="mt-6 grid flex-1 gap-3">
        {guideItems.map(([title, copy, Icon], index) => (
          <motion.div
            key={title}
            className="group flex items-start gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] p-4 transition-colors hover:border-cyan-300/22"
            initial={{ opacity: 0, x: 14 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.06 }}
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-cyan-300/14 bg-cyan-300/8 text-cyan-200">
              <Icon className="size-4" />
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-100">{title}</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">{boldSignalFlo(copy)}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function HowItWorks() {
  const workflow = [
    ["STEP 01", "AI scans market conditions", "SignalFlo monitors momentum, key levels, volatility, market structure, and broader context to identify potential opportunities.", Cpu],
    ["STEP 02", "SignalFlo monitors the setup", "Each alert is organized with entry, target, stop loss, confidence score, market context, and trade status.", RadioTower],
    ["STEP 03", "Act with clear levels", "When a setup is posted, you get the key levels and trade details needed to evaluate the opportunity fast.", Target],
  ] as const

  return (
    <FadeUp as="section" id="how-it-works" className="relative overflow-hidden bg-[#050914] px-4 py-[clamp(3rem,6vw,6rem)] sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#050914_0%,#050914_12%,transparent_35%),radial-gradient(circle_at_20%_28%,rgba(0,212,255,0.09),transparent_30%),radial-gradient(circle_at_82%_68%,rgba(139,92,246,0.08),transparent_30%)]" />
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mx-auto max-w-4xl text-center">
          <p className="section-eyebrow heading-accent">
            How It Works
          </p>
          <h2 className="section-title mx-auto max-w-4xl font-display">
            SignalFlo Intelligence{" "}
            <span className="heading-accent">Network</span>
          </h2>
        </div>

        <div className="mt-10 grid overflow-hidden rounded-3xl border border-white/[0.08] bg-[#081225]/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_30px_110px_rgba(2,8,23,0.36)] backdrop-blur lg:grid-cols-3">
          {workflow.map(([step, title, copy, Icon], index) => (
            <motion.div
              key={step}
              className={cn(
                "group relative overflow-hidden p-7 transition-colors duration-300 hover:bg-white/[0.025] sm:p-8 lg:p-9",
                index > 0 && "border-t border-white/[0.07] lg:border-l lg:border-t-0",
              )}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <CardEffects />
              <div className="relative z-10 flex items-center justify-between gap-4">
                <span className="flex size-12 items-center justify-center rounded-xl border border-blue-300/14 bg-[rgba(8,13,28,0.72)] text-blue-200 shadow-[0_0_28px_rgba(59,130,246,0.1)]">
                  <Icon className="size-5" />
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-blue-300">{step}</span>
              </div>
              <h3 className="relative z-10 mt-7 text-xl font-semibold tracking-[-0.02em] text-slate-100">{boldSignalFlo(title)}</h3>
              <p className="relative z-10 mt-3 text-sm leading-7 text-slate-500">{boldSignalFlo(copy)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </FadeUp>
  )
}

function AIEngineCTA() {
  return (
    <FadeUp as="section" id="cta" className="relative overflow-hidden bg-[#050814] px-4 pb-[clamp(6rem,10vw,10rem)] pt-[clamp(3.5rem,6vw,6rem)] sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-[1100px] px-6 py-[clamp(4rem,8vw,7rem)] text-center sm:px-10 lg:px-16">
        <motion.span
          className="pointer-events-none absolute left-[12%] top-[24%] size-1.5 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(125,211,252,0.6)]"
          animate={{ opacity: [0.35, 0.9, 0.35] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.span
          className="pointer-events-none absolute bottom-[22%] right-[14%] size-1 rounded-full bg-blue-400 shadow-[0_0_12px_rgba(96,165,250,0.55)]"
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
        />
        <div className="relative z-10 mx-auto max-w-[780px]">
          <p className="section-eyebrow heading-accent">Get Started</p>
          <h2 className="font-display text-[clamp(2.35rem,5.5vw,4.5rem)] font-bold leading-[1.02] tracking-[-0.045em] text-slate-50">
            Ready to see{" "}
            <span className="heading-accent">SignalFlo in action?</span>
          </h2>
          <p className="section-subtitle mx-auto mt-5">
            Built for traders who want structured alerts, AI confidence scoring, and transparent trade tracking in one clean platform.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-13 px-8 transition-transform hover:-translate-y-0.5">
              <a href={PRICING_URL}>
                Get Started
                <ArrowRight className="size-4" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-13 border-white/10 bg-white/[0.035] px-8 text-white transition-all hover:-translate-y-0.5 hover:border-blue-300/30 hover:bg-white/[0.06] hover:shadow-[0_0_26px_rgba(59,130,246,0.12)]">
              <a href={AI_ENGINE_URL}>Explore the AI Engine</a>
            </Button>
          </div>
          <p className="mt-5 text-xs leading-5 text-slate-500">
            No hype. No fabricated results. Just structured trading intelligence.
          </p>
        </div>
      </div>
    </FadeUp>
  )
}

function RealPerformance() {
  const stats = [
    ["Live Alerts", "Tracked outcomes"],
    ["Stocks + Options", "Multi-market coverage"],
    ["Entry / TP / SL", "Structured trade plans"],
    ["AI + Human", "Curated review process"],
  ] as const

  return (
    <FadeUp as="section" id="performance" className="relative overflow-hidden bg-[#07101f] px-4 py-[clamp(3rem,6vw,6rem)] sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(59,130,246,0.09),transparent_34%),radial-gradient(circle_at_76%_70%,rgba(236,72,153,0.04),transparent_25%)]" />
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mx-auto max-w-4xl text-center">
          <p className="section-eyebrow heading-accent">
            By The Numbers
          </p>
          <h2 className="section-title font-display">
            <span className="block">Built on real</span>
            <span className="heading-accent block">performance</span>
          </h2>
          <p className="section-subtitle mx-auto mt-4">
            No hype. No fabricated metrics. <strong className="font-semibold text-slate-400">SignalFlo</strong> is built around live alerts, tracked outcomes, and transparent trade history.
          </p>
        </div>

        <div className="mt-10 grid overflow-hidden rounded-3xl border border-white/[0.08] bg-[#081225]/72 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_30px_110px_rgba(2,8,23,0.36)] backdrop-blur sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(([value, label], index) => (
            <motion.div
              key={value}
              className={cn(
                "group relative overflow-hidden px-5 py-8 text-center transition-colors duration-300 hover:bg-white/[0.025] sm:px-6 sm:py-10",
                index > 0 && "border-t border-white/[0.07] sm:border-t-0",
                index % 2 === 1 && "sm:border-l",
                index > 1 && "sm:border-t lg:border-t-0",
                index > 0 && "lg:border-l",
              )}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <CardEffects />
              <p className="heading-accent relative z-10 font-display text-2xl font-bold tracking-[-0.025em] sm:text-3xl">
                {value}
              </p>
              <p className="relative z-10 mt-3 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">{label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </FadeUp>
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
    <FadeUp as="section" id="alert-example" className="overflow-hidden border-y border-white/[0.06] bg-[#07101f] px-4 py-[clamp(4.5rem,8vw,8rem)] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
      <SectionHeading
        kicker="Live Trade Example"
        title="What a SignalFlo Alert Looks Like"
        highlight="Alert Looks Like"
        description="Every SignalFlo alert includes structured entries, targets, stop losses, confidence scoring, and trade context."
      />
        <div className="mx-auto mt-10 grid min-w-0 max-w-7xl items-start gap-5 lg:mt-12 xl:grid-cols-[minmax(0,1fr)_minmax(18rem,0.38fr)] xl:items-stretch">
        <div className="group flex min-w-0 h-full items-center overflow-hidden rounded-3xl border border-cyan-300/14 bg-[#071121]/92 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_28px_110px_rgba(14,165,233,0.14)] transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/28 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_34px_130px_rgba(14,165,233,0.18)] sm:p-5">
          <div className="relative w-full overflow-hidden rounded-2xl border border-white/[0.07] bg-[#050b16]/88 p-4 sm:p-5">
            <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_0%,rgba(34,211,238,0.16),transparent_36%)]" />
            <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.035)_1px,transparent_1px)] bg-[size:34px_34px] opacity-45" />
            <div className="relative z-10 grid min-w-0 gap-6 xl:grid-cols-[0.92fr_1.08fr] xl:items-stretch">
              <div className="flex h-full items-center justify-center rounded-2xl border border-cyan-300/12 bg-cyan-300/[0.045] p-5 transition-all duration-300 group-hover:border-cyan-300/26 group-hover:bg-cyan-300/[0.06]">
                <div className="w-full">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className="bg-blue-500 text-white">NVDA CALL</Badge>
                    <Badge variant="outline" className="border-cyan-300/20 bg-cyan-300/8 text-cyan-200">Option</Badge>
                    <Badge variant="outline" className="border-cyan-300/20 bg-cyan-300/8 text-cyan-200">Bullish</Badge>
                  </div>
                  <div className="mt-5 rounded-xl border border-white/[0.07] bg-black/20 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">Live Trade Alert</p>
                        <h3 className="mt-1 text-xl font-semibold tracking-[-0.02em] text-slate-50 sm:text-2xl">
                          NVDA $950C Momentum Setup
                        </h3>
                      </div>
                      <span className="rounded-full border border-cyan-300/15 bg-cyan-300/8 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-200">
                        Active
                      </span>
                    </div>
                    <div className="mt-4 grid gap-2 text-xs text-slate-400 sm:grid-cols-2">
                      <div className="rounded-lg border border-white/[0.06] bg-white/[0.025] px-3 py-2">
                        Contract <span className="ml-1 font-semibold text-slate-200">NVDA 950C</span>
                      </div>
                      <div className="rounded-lg border border-white/[0.06] bg-white/[0.025] px-3 py-2">
                        Timeframe <span className="ml-1 font-semibold text-slate-200">Day trade</span>
                      </div>
                    </div>
                  </div>
                <div className="mt-3 rounded-xl border border-white/[0.07] bg-black/20 p-4">
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">Alert Lifecycle</p>
                      <span className="rounded-full border border-emerald-300/15 bg-emerald-300/8 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-200">
                        Target Hit
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs leading-5 text-slate-500">
                      Published alert is actively<br />
                      monitored through outcome review.
                    </p>
                  </div>
                  <div className="mt-3">
                    <div className="grid grid-cols-[auto_1fr_auto_1fr_auto] items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                      {["Published", "Monitoring", "Target Hit"].map((step, index) => (
                        <Fragment key={step}>
                          <div className="flex flex-col items-center gap-1.5">
                            <motion.span
                              className={cn(
                                "size-2.5 rounded-full border",
                                index < 2
                                  ? "border-cyan-300/30 bg-cyan-300 shadow-[0_0_16px_rgba(34,211,238,0.55)]"
                                  : "border-emerald-300/30 bg-emerald-300 shadow-[0_0_16px_rgba(110,231,183,0.55)]",
                              )}
                              animate={index === 2 ? { scale: [1, 1.55, 1], opacity: [0.65, 1, 0.65] } : {}}
                              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                            />
                            <span className={index < 2 ? "text-cyan-200" : "text-emerald-200/80"}>{step}</span>
                          </div>
                          {index < 2 && <span className="h-px bg-cyan-300/20" />}
                        </Fragment>
                      ))}
                    </div>
                  </div>
                </div>
                </div>
              </div>

              <div className="grid gap-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  {alertLevels.map(([label, value, detail], index) => (
                    <MotionCard key={label} delay={index * 0.05}>
                      <div
                        className={cn(
                          "group relative h-full overflow-hidden rounded-xl border bg-[#081225]/86 p-4 transition-all duration-300 hover:-translate-y-0.5",
                          label === "Take Profit" && "border-emerald-300/18 shadow-[0_0_34px_rgba(16,185,129,0.08)] hover:border-emerald-300/32",
                          label === "Confidence Score" && "border-cyan-300/18 hover:border-cyan-300/32",
                          label === "Entry Zone" && "border-blue-300/12 hover:border-blue-300/28",
                          label === "Stop Loss" && "border-red-300/10 hover:border-red-300/18",
                        )}
                      >
                        <CardEffects />
                        <p className="relative z-10 text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-300">{label}</p>
                        {label === "Confidence Score" ? (
                          <div className="relative z-10 mt-3 flex items-center gap-4">
                            <motion.div
                              className="grid size-16 place-items-center rounded-full shadow-[0_0_28px_rgba(34,211,238,0.14)]"
                              style={{ background: "conic-gradient(rgba(34,211,238,0.95) 0deg 338deg, rgba(30,41,59,0.85) 338deg 360deg)" }}
                              animate={{ filter: ["drop-shadow(0 0 0 rgba(34,211,238,0))", "drop-shadow(0 0 14px rgba(34,211,238,0.3))", "drop-shadow(0 0 0 rgba(34,211,238,0))"] }}
                              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                            >
                              <span className="grid size-[3.1rem] place-items-center rounded-full bg-[#081225] text-2xl font-bold text-cyan-200">94</span>
                            </motion.div>
                            <div>
                              <p className="text-sm font-semibold text-slate-100">AI Confidence</p>
                              <p className="mt-1 text-xs leading-5 text-slate-500">{detail}</p>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className={cn("relative z-10 mt-2 text-2xl font-semibold tracking-[-0.02em]", label === "Take Profit" ? "text-emerald-300" : label === "Stop Loss" ? "text-red-200/80" : "text-cyan-300")}>{value}</p>
                            <p className="relative z-10 mt-1 text-xs text-slate-500">{detail}</p>
                          </>
                        )}
                      </div>
                    </MotionCard>
                  ))}
                </div>
                <div className="group relative overflow-hidden rounded-xl border border-cyan-300/12 bg-[#081225]/86 p-6 transition-all duration-300 hover:border-cyan-300/26">
                  <CardEffects />
                  <p className="relative z-10 text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-300">Trade Thesis</p>
                  <div className="relative z-10 mt-3">
                    <div>
                      <p className="text-sm leading-7 text-slate-300">
                        Momentum breakout above resistance with strong volume
                        confirmation and favorable risk/reward.
                      </p>
                      <div className="mt-4 grid gap-2 sm:grid-cols-2">
                        {["Price holding above support", "Volume confirming move", "Bullish momentum trend", "AI validation passed"].map((factor) => (
                          <div key={factor} className="flex items-center gap-2 text-xs text-slate-400">
                            <Check className="size-3.5 text-cyan-300" />
                            {factor}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <motion.div
                    className="relative z-10 mt-4 h-1.5 overflow-hidden rounded-full bg-slate-800/80"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                  >
                    <motion.div
                      className="h-full rounded-full bg-blue-400"
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
        <AlertReadingGuide />
        </div>

        <div id="features" className="mx-auto mt-16 max-w-3xl text-center">
          <p className="section-eyebrow text-blue-400">Features</p>
          <h3 className="section-title font-display">
            Everything you need to <AnimatedGradientText>trade smarter</AnimatedGradientText>
          </h3>
          <p className="section-subtitle mx-auto mt-4">
            Institutional-grade tools to drive your trading journey.
          </p>
        </div>

        <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon

            return (
              <MotionCard key={feature.title} delay={index * 0.035}>
                <div className="group relative h-full overflow-hidden rounded-2xl border border-blue-300/10 bg-[#081225]/78 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.045),0_16px_54px_rgba(2,8,23,0.3)] transition-all duration-300 hover:-translate-y-1 hover:border-blue-300/24 hover:bg-[#0a1428]/86">
                  <CardEffects />
                  <span className="relative z-10 flex size-10 items-center justify-center rounded-xl border border-blue-300/12 bg-blue-300/8 text-blue-200 shadow-[0_0_22px_rgba(37,99,235,0.08)]">
                    <Icon className="size-4" />
                  </span>
                  <p className="relative z-10 mt-4 text-sm font-semibold text-slate-100">{feature.title}</p>
                  <p className="relative z-10 mt-2 text-xs leading-5 text-slate-500">{boldSignalFlo(feature.copy)}</p>
                </div>
              </MotionCard>
            )
          })}
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
            Before joining <strong className="font-semibold">SignalFlo</strong>, please review and acknowledge the following:
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
              renewal terms, and the fact that <strong className="font-semibold">SignalFlo</strong> provides AI-generated
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

function DedicatedPricingPage() {
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null)

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <Navbar />
      <section className="relative overflow-hidden border-b border-white/[0.06] px-4 pb-12 pt-28 sm:px-6 sm:pb-16 sm:pt-32 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.18),transparent_34%),radial-gradient(circle_at_80%_18%,rgba(124,58,237,0.14),transparent_30%),linear-gradient(180deg,#07111f_0%,#050914_100%)]" />
        <div className="relative z-10 mx-auto max-w-7xl text-center">
          <Badge variant="outline" className="border-cyan-400/20 bg-cyan-400/5 text-cyan-200">
            Pricing
          </Badge>
          <h1 className="mx-auto mt-5 max-w-4xl font-display text-4xl font-bold leading-[1.05] tracking-[-0.03em] text-slate-50 sm:text-6xl">
            <span className="block">Choose your</span>
            <span className="heading-accent block">SignalFlo plan</span>
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-slate-400">
            Get access to AI-powered trading alerts, confidence scoring,
            performance tracking, and real-time dashboard intelligence.
          </p>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Card className="relative overflow-hidden border-cyan-300/12 bg-[#081225]/82 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_24px_100px_rgba(14,165,233,0.1)]">
            <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(34,211,238,0.12),transparent_32%),radial-gradient(circle_at_90%_15%,rgba(124,58,237,0.1),transparent_30%)]" />
            <CardContent className="relative z-10 p-5 sm:p-7">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="font-display text-2xl font-bold tracking-[-0.02em] text-slate-50">
                    Everything Included
                  </p>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                    <strong className="font-semibold">SignalFlo</strong> plans include the core alert workflow, dashboard
                    intelligence, and tracking tools traders need to stay
                    organized.
                  </p>
                </div>
                <div className="grid gap-2 sm:grid-cols-2 lg:min-w-[560px]">
                  {pricingIncludedItems.map((item) => (
                    <div key={item} className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-2 text-sm text-slate-300">
                      <Check className="size-4 shrink-0 text-cyan-300" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="relative overflow-visible px-4 pb-12 pt-4 sm:px-6 sm:pb-16 sm:pt-5 lg:px-8 lg:pt-8">
        <div className="pointer-events-none absolute left-1/2 top-[44%] h-[620px] w-[1100px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.12),rgba(37,99,235,0.08),rgba(124,58,237,0.08),transparent_64%)] blur-2xl" />
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="grid items-stretch gap-5 lg:grid-cols-3">
            {pricingPlans.map((plan, index) => {
              const meta = pricingPlanMeta[plan.name]

              return (
                <MotionCard key={plan.name} delay={index * 0.06}>
                  <Card
                    className={cn(
                      "group relative flex h-full min-h-[650px] flex-col overflow-hidden rounded-2xl border border-blue-300/12 bg-[#081225]/88 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_18px_60px_rgba(2,8,23,0.38)] transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/34 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_24px_80px_rgba(14,165,233,0.15),0_0_34px_rgba(124,58,237,0.08)]",
                      plan.name === "Annual" && "border-cyan-300/70 bg-[#0a1428] shadow-[inset_0_1px_0_rgba(255,255,255,0.09),0_0_130px_rgba(34,211,238,0.36),0_0_86px_rgba(124,58,237,0.2)] lg:-translate-y-3 lg:scale-[1.035]",
                      plan.name === "Founder Lifetime" && "border-amber-300/24 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_0_72px_rgba(245,158,11,0.12),0_0_42px_rgba(34,211,238,0.06)]",
                    )}
                  >
                    <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.14),transparent_34%),radial-gradient(circle_at_85%_12%,rgba(124,58,237,0.1),transparent_32%)] opacity-90" />
                    <span className={cn("pointer-events-none absolute inset-x-5 top-0 h-px bg-blue-300/34", plan.name === "Annual" && "inset-x-0 h-1 bg-blue-400/80", plan.name === "Founder Lifetime" && "bg-amber-300/55")} />
                    <span className="pointer-events-none absolute -left-8 top-0 h-full w-16 -translate-x-24 rotate-12 bg-gradient-to-r from-transparent via-white/8 to-transparent opacity-0 blur-sm transition-all duration-700 group-hover:translate-x-[26rem] group-hover:opacity-100" />

                    <CardHeader className="relative z-10 p-5 pb-3 text-center sm:p-6 sm:pb-4">
                      <div className="flex flex-col items-center gap-2">
                        <CardTitle className="font-display text-2xl font-bold">{plan.name}</CardTitle>
                        <div className="flex flex-wrap justify-center gap-2">
                          <span className="inline-flex rounded-full border border-cyan-300/12 bg-cyan-300/8 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-cyan-200">
                            {meta.chip}
                          </span>
                          {plan.name === "Annual" && (
                            <Badge className="border border-blue-300/20 bg-blue-500 text-white shadow-[0_0_26px_rgba(59,130,246,0.24)]">
                              Most Popular
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="relative z-10 flex flex-1 flex-col px-5 pb-5 sm:px-6 sm:pb-6">
                      <div className="border-b border-white/[0.07] pb-5 text-center">
                        <div className="flex flex-wrap items-end justify-center gap-x-2 gap-y-1">
                          <p className="text-[2.85rem] font-extrabold leading-none tracking-[-0.04em] text-cyan-300 sm:text-[3.45rem]">
                            {meta.priceMain}
                          </p>
                          <p className="pb-2 text-sm font-medium text-slate-500">
                            {meta.unit}
                          </p>
                        </div>
                        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-400">
                          {boldSignalFlo(plan.copy)}
                        </p>
                        <p className="mt-2 text-xs text-slate-600">{meta.support}</p>
                      </div>

                      <div className="grid gap-2 border-b border-white/[0.07] py-4">
                        {meta.benefits.map((benefit) => (
                          <div key={benefit} className="flex items-start gap-2 text-sm leading-5 text-slate-400">
                            <Check className="mt-0.5 size-4 shrink-0 text-cyan-300" />
                            <span>{benefit}</span>
                          </div>
                        ))}
                      </div>

                      <div className="grid gap-2 py-4 text-sm">
                        {plan.features.map((feature) => (
                          <div key={feature} className="flex items-start gap-2 leading-5 text-slate-400">
                            <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border border-cyan-300/15 bg-cyan-300/8">
                              <Check className="size-2.5 text-cyan-300" />
                            </span>
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>

                      <Button
                        type="button"
                        onClick={() => setSelectedPlan(plan)}
                        className={cn(
                          "mt-auto h-12 w-full transition-all hover:-translate-y-0.5",
                          plan.name === "Annual"
                            ? "bg-blue-500 text-white shadow-[0_0_34px_rgba(59,130,246,0.28)] hover:bg-blue-400"
                            : "border-white/10 bg-white/[0.04] hover:bg-white/[0.07]",
                        )}
                        variant={plan.name === "Annual" ? "default" : "outline"}
                      >
                        {plan.cta}
                      </Button>
                    </CardContent>
                  </Card>
                </MotionCard>
              )
            })}
          </div>

          <p className="mx-auto mt-7 max-w-3xl text-center text-xs leading-5 text-slate-500">
            <strong className="font-semibold">SignalFlo</strong> is for educational and informational purposes only.
            Trading involves risk and past performance does not guarantee future
            results.
          </p>
        </div>
      </section>

      <MemberAccessTimeline />

      <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="section-eyebrow text-blue-400">Compare</p>
            <h2 className="section-title font-display">
              Plan <span className="heading-accent">Comparison</span>
            </h2>
          </div>
          <div className="mt-8 overflow-x-auto rounded-2xl border border-white/[0.07] bg-[#081225]/82 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-white/[0.07] text-xs uppercase tracking-[0.16em] text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-medium">Feature</th>
                  <th className="px-5 py-4 text-center font-medium">Monthly</th>
                  <th className="px-5 py-4 text-center font-medium text-cyan-300">Annual</th>
                  <th className="px-5 py-4 text-center font-medium">Founder Lifetime</th>
                </tr>
              </thead>
              <tbody>
                {pricingComparisonRows.map(([feature, monthly, annual, lifetime]) => (
                  <tr key={feature} className="border-b border-white/[0.05] last:border-b-0">
                    <td className="px-5 py-4 text-slate-300">{feature}</td>
                    {[monthly, annual, lifetime].map((included, index) => (
                      <td key={`${feature}-${index}`} className="px-5 py-4 text-center">
                        {included ? (
                          <span className="inline-flex size-7 items-center justify-center rounded-full border border-cyan-300/16 bg-cyan-300/8 text-cyan-300">
                            <Check className="size-4" />
                          </span>
                        ) : (
                          <span className="text-slate-700">-</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="border-y border-white/[0.06] bg-[#07101f] px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-3xl">
          <SectionHeading
            kicker="Pricing FAQ"
            title="Pricing Questions"
            highlight="Questions"
            description="A quick look at plan access, market coverage, and important risk context."
          />
          <Accordion type="single" collapsible className="mt-10 space-y-3">
            {pricingPageFaqs.map(([question, answer], index) => (
              <AccordionItem key={question} value={`pricing-faq-${index}`} className="rounded-lg border border-white/[0.07] bg-[#081225]/82 px-4">
                <AccordionTrigger className="text-left text-sm hover:text-cyan-300 hover:no-underline">
                  {question}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-6 text-slate-400">
                  {boldSignalFlo(answer)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-cyan-300/12 bg-[#081225]/82 p-7 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_26px_110px_rgba(14,165,233,0.11)] sm:p-10">
          <p className="font-display text-3xl font-bold tracking-[-0.02em] text-slate-50 sm:text-4xl">
            Start Trading Smarter With <strong className="font-semibold">SignalFlo</strong>
          </p>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500">
            Access AI-powered alerts, structured trade plans, and real-time
            market intelligence.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild className="bg-blue-500 text-white shadow-[0_0_28px_rgba(59,130,246,0.28)] hover:bg-blue-400">
              <a href={PRICING_URL}>
                Get Started
                <ArrowRight className="size-4" />
              </a>
            </Button>
            <Button asChild variant="outline" className="border-white/10 bg-white/[0.03] hover:bg-white/[0.06]">
              <a href={TERMS_URL}>Read Terms</a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
      <PricingCheckoutModal
        key={selectedPlan?.name ?? "closed"}
        plan={selectedPlan}
        onClose={() => setSelectedPlan(null)}
      />
    </main>
  )
}

function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null)

  return (
    <FadeUp as="section" id="pricing" className="relative overflow-hidden px-4 pb-20 pt-16 sm:px-6 sm:pb-24 sm:pt-20 lg:px-8 lg:pb-28 lg:pt-24">
      <div className="pointer-events-none absolute left-1/2 top-[58%] h-[560px] w-[980px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.14),rgba(37,99,235,0.09),rgba(124,58,237,0.08),transparent_64%)] blur-2xl" />
      <div className="relative z-10 mx-auto max-w-7xl">
      <div className="mx-auto max-w-3xl text-center">
        <p className="section-eyebrow text-blue-400">Pricing</p>
        <h2 className="section-title font-display">
          Choose <span className="heading-accent">Your Plan</span>
        </h2>
        <p className="section-subtitle mx-auto mt-4">
          Choose the plan that fits your goals. Whether you're just starting out
          or ready to trade with serious edge.
        </p>
      </div>
      <div className="mt-10 grid items-stretch gap-5 lg:mt-12 lg:grid-cols-3">
        {pricingPlans.map((plan, index) => {
          const meta = pricingPlanMeta[plan.name]

          return (
            <MotionCard key={plan.name} delay={index * 0.06}>
              <Card
                className={cn(
                  "group relative flex h-full min-h-[640px] flex-col overflow-hidden rounded-2xl border border-blue-300/12 bg-[#081225]/88 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_18px_60px_rgba(2,8,23,0.38)] transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/34 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_24px_80px_rgba(14,165,233,0.15),0_0_34px_rgba(124,58,237,0.08)] sm:min-h-[680px]",
                  plan.name === "Annual" && "border-cyan-300/70 bg-[#0a1428] shadow-[inset_0_1px_0_rgba(255,255,255,0.09),0_0_130px_rgba(34,211,238,0.4),0_0_86px_rgba(124,58,237,0.22)] lg:-translate-y-3 lg:scale-[1.04]",
                  plan.name === "Founder Lifetime" && "border-amber-300/24 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_0_70px_rgba(245,158,11,0.11),0_0_38px_rgba(34,211,238,0.06)]",
                )}
              >
                <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.14),transparent_34%),radial-gradient(circle_at_85%_12%,rgba(124,58,237,0.1),transparent_32%)] opacity-90" />
                <span className={cn("pointer-events-none absolute inset-x-5 top-0 h-px bg-blue-300/34", plan.name === "Annual" && "inset-x-0 h-1 bg-blue-400/80", plan.name === "Founder Lifetime" && "bg-amber-300/55")} />
                <span className="pointer-events-none absolute -left-8 top-0 h-full w-16 -translate-x-24 rotate-12 bg-gradient-to-r from-transparent via-white/8 to-transparent opacity-0 blur-sm transition-all duration-700 group-hover:translate-x-[26rem] group-hover:opacity-100" />

                <CardHeader className="relative z-10 p-5 pb-4 text-center sm:p-6 sm:pb-4">
                  <div className="flex flex-col items-center gap-2">
                    <div className="min-w-0 text-center">
                      <CardTitle className="text-xl">{plan.name}</CardTitle>
                      <span className="mt-2 inline-flex rounded-full border border-cyan-300/12 bg-cyan-300/8 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-cyan-200">
                        {meta.chip}
                      </span>
                    </div>
                    {plan.name === "Annual" && (
                      <Badge className="shrink-0 border border-blue-300/20 bg-blue-500 text-white shadow-[0_0_26px_rgba(59,130,246,0.24)]">Most Popular</Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="relative z-10 flex flex-1 flex-col px-5 pb-5 sm:px-6 sm:pb-6">
                  <div className="flex min-h-[180px] flex-col items-center justify-center border-b border-white/[0.07] pb-6 text-center">
                    <div className="flex flex-wrap items-end justify-center gap-x-2 gap-y-1">
                      <p className="text-[2.6rem] font-extrabold leading-none tracking-[-0.04em] text-cyan-300 sm:text-[3.25rem]">{meta.priceMain}</p>
                      <p className="pb-2 text-sm font-medium text-slate-500">{meta.unit}</p>
                    </div>
                    <p className="mx-auto mt-1.5 max-w-xs text-sm leading-5 text-slate-500">{boldSignalFlo(plan.copy)}</p>
                    <p className="mt-2 text-xs text-slate-600">{meta.support}</p>
                  </div>

                  <div className="pb-4 pt-3">
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
                      "mt-auto h-12 w-full transition-all hover:-translate-y-0.5",
                      plan.name === "Annual"
                        ? "bg-blue-500 text-white shadow-[0_0_34px_rgba(59,130,246,0.28)] hover:bg-blue-400"
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
        Trading involves substantial risk. <strong className="font-semibold">SignalFlo</strong> provides AI-generated market
        insights, alerts, and educational content only. Past performance does
        not guarantee future results.
      </p>
      </div>
      <PricingCheckoutModal
        key={selectedPlan?.name ?? "closed"}
        plan={selectedPlan}
        onClose={() => setSelectedPlan(null)}
      />
    </FadeUp>
  )
}

function RoadMap() {
  const roadmapItems = [
    {
      phase: "Phase 01",
      title: "AI Alert Optimization",
      description: "Improved alert scoring, cleaner trade logic, and stronger filtering for higher-quality setups.",
      status: "In Progress",
      icon: Bot,
      active: true,
    },
    {
      phase: "Phase 02",
      title: "Performance Analytics",
      description: "Deeper win-rate tracking, trade history insights, strategy breakdowns, and user-facing performance data.",
      status: "Coming Soon",
      icon: TrendingUp,
      active: true,
    },
    {
      phase: "Phase 03",
      title: "Futures Intelligence",
      description: "Dedicated futures tools including institutional scalping signals, ORB logic, and key level tracking.",
      status: "Planned",
      icon: Activity,
      active: false,
    },
    {
      phase: "Phase 04",
      title: "Personalized Watchlists",
      description: "User-specific watchlists, alert preferences, and cleaner notification controls.",
      status: "Planned",
      icon: Target,
      active: false,
    },
    {
      phase: "Phase 05",
      title: "Mobile Experience",
      description: "A faster mobile-first dashboard experience for monitoring alerts on the go.",
      status: "Planned",
      icon: Smartphone,
      active: false,
    },
  ] as const

  return (
    <FadeUp as="section" id="roadmap" className="relative overflow-hidden border-y border-white/[0.06] bg-[#050914] px-4 py-[clamp(4.5rem,8vw,8rem)] sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_28%,rgba(0,212,255,0.1),transparent_34%),radial-gradient(circle_at_78%_58%,rgba(139,92,246,0.09),transparent_28%),radial-gradient(circle_at_25%_68%,rgba(236,72,153,0.04),transparent_24%)]" />
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="section-eyebrow text-blue-300">COMING NEXT</p>
          <h2 className="section-title font-display">
            SignalFlo <span className="heading-accent">Road Map</span>
          </h2>
          <p className="section-subtitle mx-auto mt-4">
            A preview of upcoming features, platform upgrades, and intelligence layers being built into <strong className="font-semibold">SignalFlo</strong>.
          </p>
        </div>

        <div className="relative mt-12 lg:mt-16">
          <div className="pointer-events-none absolute bottom-0 left-2 top-0 w-px bg-[linear-gradient(180deg,#7DD3FC,#60A5FA,#3B82F6)] opacity-25 lg:bottom-auto lg:left-[8%] lg:right-[8%] lg:top-7 lg:h-px lg:w-auto" />
          <div className="grid gap-5 pl-8 lg:grid-cols-5 lg:gap-4 lg:pl-0">
            {roadmapItems.map((item, index) => {
              const Icon = item.icon

              return (
                <motion.div
                  key={item.phase}
                  className="group relative"
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 0.45, delay: index * 0.07, ease: "easeOut" }}
                >
                  <motion.div
                    className={cn(
                      "absolute -left-[2rem] top-6 z-20 grid size-4 place-items-center rounded-full border bg-[#07111f] lg:left-1/2 lg:-translate-x-1/2",
                      item.active
                        ? "border-cyan-300/50 shadow-[0_0_22px_rgba(96,165,250,0.35)]"
                        : "border-blue-300/25 shadow-[0_0_18px_rgba(59,130,246,0.14)]",
                    )}
                    animate={item.active ? { boxShadow: ["0 0 10px rgba(125,211,252,0.18)", "0 0 26px rgba(59,130,246,0.34)", "0 0 10px rgba(125,211,252,0.18)"] } : {}}
                    transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 }}
                  >
                    <span className={cn("absolute inset-1 rounded-full", item.active ? "bg-cyan-300" : "bg-blue-300/55")} />
                  </motion.div>

                  <motion.div
                    className="relative h-full overflow-hidden rounded-2xl border border-blue-300/12 bg-[rgba(8,13,28,0.72)] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-[18px] transition-colors duration-300 hover:border-blue-300/30 lg:mt-14"
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                  >
                    <CardEffects />
                    <span className="pointer-events-none absolute inset-x-5 top-0 h-px bg-[linear-gradient(90deg,transparent,#7DD3FC,#60A5FA,#3B82F6,transparent)] opacity-55" />
                    <div className="relative z-10 flex items-start justify-between gap-3">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-blue-300/12 bg-[rgba(8,13,28,0.72)] text-blue-200 shadow-[0_0_26px_rgba(59,130,246,0.08)]">
                        <Icon className="size-4" />
                      </span>
                      <span className={cn(
                        "rounded-full border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.15em]",
                        item.status === "In Progress"
                          ? "border-cyan-300/20 bg-cyan-300/8 text-cyan-200"
                          : item.status === "Coming Soon"
                            ? "border-blue-300/20 bg-blue-300/8 text-blue-200"
                            : "border-white/[0.08] bg-white/[0.035] text-slate-500",
                      )}>
                        {item.status}
                      </span>
                    </div>
                    <p className="relative z-10 mt-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-300">{item.phase}</p>
                    <h3 className="relative z-10 mt-2 text-base font-semibold tracking-[-0.01em] text-slate-100">{item.title}</h3>
                    <p className="relative z-10 mt-3 text-xs leading-5 text-slate-500">{item.description}</p>
                  </motion.div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </FadeUp>
  )
}

function Faq() {
  return (
    <FadeUp as="section" id="faq" className="border-y border-white/[0.06] bg-[#07101f] px-4 py-[clamp(3.5rem,6vw,6rem)] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[850px]">
        <SectionHeading
          kicker="FAQ"
          title="Still Have Questions?"
          highlight="Questions?"
          description="Quick answers to common questions before getting started."
        />
        <Accordion type="single" collapsible className="mt-8 space-y-2.5">
          {homepageFaqs.map(([question, answer], index) => (
            <AccordionItem key={question} value={`faq-${index}`} className="rounded-xl border border-slate-400/15 bg-[rgba(8,13,28,0.72)] px-5 shadow-[0_12px_36px_rgba(0,0,0,0.16)] backdrop-blur-[18px] transition-all duration-300 hover:border-blue-300/25 hover:bg-[#0a1428]/78">
              <AccordionTrigger className="min-h-14 py-4 text-left text-[15px] text-slate-200 hover:text-cyan-200 hover:no-underline sm:min-h-16 sm:py-5">
                {question}
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-sm leading-7 text-slate-400">
                {boldSignalFlo(answer)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </FadeUp>
  )
}

function Footer() {
  const footerColumns = [
    ["Product", "Features", "Dashboard", "Trade Alerts"],
    ["Company", "Pricing", "FAQ", "Login", "Contact", "Support"],
    ["Resources", "Trade Alerts", "Alert Tracking", "Risk Plans", "Market Coverage"],
    ["Legal", "Terms & Conditions", "Privacy Policy", "Risk Disclosure", "Refund Policy"],
  ]

  return (
    <footer className="border-t border-white/[0.06] bg-[#050914] px-4 pb-14 pt-16 sm:px-6 sm:pb-16 sm:pt-18 lg:px-8 lg:pb-20 lg:pt-18">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 md:grid-cols-[1.2fr_2fr]">
          <div>
            <a href="/" className="inline-flex items-center" aria-label="SignalFlo home">
              <BrandLogo className="h-14 max-w-[252px]" />
            </a>
            <p className="mt-5 max-w-sm text-sm leading-6 text-slate-500">
              AI-powered stock and options trade alerts with entry levels,
              targets, stop loss, confidence scoring, and real-time tracking.
            </p>
          </div>
          <div className="grid gap-10 sm:grid-cols-4">
            {footerColumns.map(([head, ...links]) => (
              <div key={head}>
                <p className="text-xs font-semibold text-slate-300">{head}</p>
                <div className="mt-4 space-y-3">
                  {links.map((link) => (
                    <a
                      key={link}
                      href={
                        link === "Login"
                          ? APP_URL
                          : link === "Pricing"
                            ? PRICING_URL
                            : link === "Terms & Conditions"
                              ? TERMS_URL
                              : ["Risk Disclosure", "Refund Policy", "Privacy Policy"].includes(link)
                                ? LEGAL_URL
                                : link === "Features"
                                  ? "/#features"
                                  : link === "Dashboard"
                                    ? APP_URL
                                    : link === "Trade Alerts"
                                      ? "/#alert-example"
                                      : link === "FAQ"
                                        ? "/#faq"
                                        : link === "Alert Tracking"
                                          ? "/#dashboard"
                                          : link === "Risk Plans" || link === "Market Coverage"
                                            ? "/#features"
                                            : SUPPORT_URL
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
        <div className="mt-12 flex flex-col gap-3 border-t border-white/[0.06] pt-6 lg:flex-row lg:items-start lg:gap-5">
          <div className="flex min-w-fit items-center gap-2">
            <ShieldCheck className="size-3.5 text-cyan-300" />
            <p className="text-xs font-semibold text-slate-300">Trading Risk Disclosure</p>
          </div>
          <p className="max-w-5xl text-xs leading-6 text-slate-600">
            <strong className="font-semibold">SignalFlo</strong> provides market alerts, trade ideas, research tools,
            and educational content. Trading involves risk, including possible loss of capital. Past performance does
            not guarantee future results. Users are responsible for their own trading decisions. <strong className="font-semibold">SignalFlo</strong> does not execute trades or provide individualized financial advice.
          </p>
        </div>
        <div className="mt-10 border-t border-white/[0.06] pt-6 text-center">
          <p className="text-xs text-slate-600">© 2026 <strong className="font-semibold">SignalFlo</strong> AI. All rights reserved.</p>
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
      <p className="section-eyebrow text-blue-400">{kicker}</p>
      <h2 className="section-title font-display">
        {boldSignalFlo(parts[0])}
        <span className="heading-accent">{highlight}</span>
        {boldSignalFlo(parts[1] ?? "")}
      </h2>
      <p className="section-subtitle mx-auto mt-4">{boldSignalFlo(description)}</p>
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

