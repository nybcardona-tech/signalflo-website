const trimTrailingSlash = (url: string) => url.replace(/\/+$/, "")

export const SITE_URL = trimTrailingSlash(import.meta.env.VITE_SITE_URL || "https://signalfloai.com")
export const APP_URL = trimTrailingSlash(import.meta.env.VITE_APP_URL || "https://app.signalfloai.com")

export const LOGIN_URL = `${APP_URL}/login`
export const SIGNUP_URL = `${APP_URL}/signup`

export const LOGIN_PATH = "/login"
export const SIGNUP_PATH = "/signup"
export const VERIFY_EMAIL_PATH = "/verify-email"
export const VERIFICATION_REQUIRED_PATH = "/verification-required"
export const PRICING_PATH = "/pricing"
export const TERMS_PATH = "/terms"
export const LEGAL_PATH = "/legal"
export const AI_ENGINE_PATH = "/ai-engine"
export const WELCOME_PATH = "/welcome"
export const SUPPORT_PATH = "/support"
export const CONTACT_PATH = "/contact"

export const PRICING_URL = `${SITE_URL}${PRICING_PATH}`
export const TERMS_URL = `${SITE_URL}${TERMS_PATH}`
export const SUPPORT_EMAIL = "support@signalfloai.com"
export const SUPPORT_URL = `mailto:${SUPPORT_EMAIL}`
