import { CookieConsentPreferences } from "@/types/analytics";

const CONSENT_STORAGE_KEY = "kusumika_cookie_consent_v1";

export const DEFAULT_CONSENT: CookieConsentPreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
  timestamp: "",
};

export function getStoredConsent(): CookieConsentPreferences | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveConsent(preferences: Partial<CookieConsentPreferences>): CookieConsentPreferences {
  const fullPreferences: CookieConsentPreferences = {
    necessary: true,
    analytics: Boolean(preferences.analytics),
    marketing: Boolean(preferences.marketing),
    timestamp: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(fullPreferences));
    } catch (e) {
      console.warn("Failed to persist consent:", e);
    }

    // Update Google Consent Mode v2
    if (typeof (window as any).gtag === "function") {
      (window as any).gtag("consent", "update", {
        analytics_storage: fullPreferences.analytics ? "granted" : "denied",
        ad_storage: fullPreferences.marketing ? "granted" : "denied",
        ad_user_data: fullPreferences.marketing ? "granted" : "denied",
        ad_personalization: fullPreferences.marketing ? "granted" : "denied",
      });
    }

    // Update Meta Pixel Consent
    if (typeof (window as any).fbq === "function") {
      (window as any).fbq(
        "consent",
        fullPreferences.marketing ? "grant" : "revoke"
      );
    }

    window.dispatchEvent(
      new CustomEvent("kusumika_consent_updated", { detail: fullPreferences })
    );
  }

  return fullPreferences;
}
