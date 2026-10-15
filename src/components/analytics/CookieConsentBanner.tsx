"use client";

import React, { useEffect, useState } from "react";
import { getStoredConsent, saveConsent } from "@/lib/analytics/consentStore";
import { CookieConsentPreferences } from "@/types/analytics";

export const CookieConsentBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<CookieConsentPreferences>({
    necessary: true,
    analytics: true,
    marketing: true,
    timestamp: "",
  });

  useEffect(() => {
    const existing = getStoredConsent();
    if (!existing) {
      // Delay slightly for smooth entrance animation
      const timer = setTimeout(() => setIsVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    saveConsent({ necessary: true, analytics: true, marketing: true });
    setIsVisible(false);
    setShowPreferences(false);
  };

  const handleDeclineOptional = () => {
    saveConsent({ necessary: true, analytics: false, marketing: false });
    setIsVisible(false);
    setShowPreferences(false);
  };

  const handleSaveCustom = () => {
    saveConsent(preferences);
    setIsVisible(false);
    setShowPreferences(false);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* BOTTOM SLIDE-UP CONSENT BANNER */}
      <aside
        aria-label="Privacy & Cookie Preferences"
        className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 bg-surface/95 backdrop-blur-md border-t border-outline-variant/60 shadow-2xl transition-all animate-in fade-in slide-in-from-bottom duration-500"
      >
        <div className="max-w-[1240px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-5 text-xs font-sans text-on-surface">
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[20px]">
                cookie
              </span>
              <h2 className="font-serif text-base font-bold text-primary">
                Atelier Privacy & Textile Measurement Consent
              </h2>
            </div>
            <p className="text-on-surface-variant leading-relaxed">
              We use necessary cookies to preserve your cart reservations, authenticate patron accounts, and ensure secure payment settlement. With your consent, we also utilize privacy-centric analytics (Google Analytics) and marketing measurements (Meta Pixel) to celebrate artisanal slow-craft textiles.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full md:w-auto">
            <button
              type="button"
              onClick={() => setShowPreferences(true)}
              className="px-4 py-2.5 rounded-lg border border-outline-variant bg-surface hover:bg-surface-container font-sans text-xs font-bold uppercase tracking-wider text-on-surface transition-colors flex-1 md:flex-none text-center"
            >
              Customize
            </button>
            <button
              type="button"
              onClick={handleDeclineOptional}
              className="px-4 py-2.5 rounded-lg border border-outline-variant bg-surface-container-high hover:bg-surface-variant font-sans text-xs font-bold uppercase tracking-wider text-outline hover:text-on-surface transition-colors flex-1 md:flex-none text-center"
            >
              Essential Only
            </button>
            <button
              type="button"
              onClick={handleAcceptAll}
              className="px-6 py-2.5 rounded-lg bg-primary text-on-primary hover:opacity-90 font-sans text-xs font-bold uppercase tracking-wider transition-opacity shadow-md flex-1 md:flex-none text-center"
            >
              Accept All
            </button>
          </div>
        </div>
      </aside>

      {/* CUSTOM PREFERENCES MODAL */}
      {showPreferences && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-surface border border-outline-variant/60 rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-outline-variant/40 pb-4">
              <div className="space-y-1">
                <h3 className="font-serif text-xl font-bold text-primary">
                  Privacy Preferences
                </h3>
                <p className="font-sans text-xs text-outline">
                  Indian DPDP Act & Privacy Standards
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowPreferences(false)}
                className="text-outline hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="space-y-4 text-xs font-sans">
              {/* Category 1: Strictly Necessary */}
              <div className="p-3.5 rounded-xl bg-surface-container border border-outline-variant/40 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="font-bold text-primary flex items-center gap-1.5">
                    <span>Strictly Necessary</span>
                    <span className="text-[10px] uppercase font-bold text-secondary bg-surface px-2 py-0.5 rounded border border-outline-variant/30">
                      Always Active
                    </span>
                  </div>
                  <p className="text-on-surface-variant text-[11px] leading-relaxed">
                    Required for cart persistence, Partial COD calculation, Razorpay security tokens, and patron account sessions.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={true}
                  disabled={true}
                  className="rounded text-primary focus:ring-primary mt-1"
                />
              </div>

              {/* Category 2: Performance & Analytics */}
              <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/40 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="font-bold text-primary">
                    Performance & Analytics (Google Analytics 4)
                  </div>
                  <p className="text-on-surface-variant text-[11px] leading-relaxed">
                    Measures weave category popularity, scroll depth, and anonymous site engagement to improve the digital atelier.
                  </p>
                </div>
                <input
                  type="checkbox"
                  id="consent-analytics"
                  checked={preferences.analytics}
                  onChange={(e) =>
                    setPreferences({ ...preferences, analytics: e.target.checked })
                  }
                  className="rounded text-primary focus:ring-primary h-4 w-4 mt-1 accent-primary cursor-pointer"
                />
              </div>

              {/* Category 3: Marketing & Meta Pixel */}
              <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/40 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="font-bold text-primary">
                    Marketing & Social Pixel (Meta Pixel)
                  </div>
                  <p className="text-on-surface-variant text-[11px] leading-relaxed">
                    Helps us reach patrons who appreciate handloom craft on Instagram and Facebook without third-party tracking brokers.
                  </p>
                </div>
                <input
                  type="checkbox"
                  id="consent-marketing"
                  checked={preferences.marketing}
                  onChange={(e) =>
                    setPreferences({ ...preferences, marketing: e.target.checked })
                  }
                  className="rounded text-primary focus:ring-primary h-4 w-4 mt-1 accent-primary cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant/40">
              <button
                type="button"
                onClick={handleDeclineOptional}
                className="px-4 py-2 rounded-lg border border-outline-variant text-xs font-bold uppercase tracking-wider text-outline hover:text-on-surface"
              >
                Reject Optional
              </button>
              <button
                type="button"
                onClick={handleSaveCustom}
                className="px-5 py-2 rounded-lg bg-primary text-on-primary text-xs font-bold uppercase tracking-wider shadow"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
