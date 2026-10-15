"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header, Footer } from "@/components/layout";
import { Button, Input } from "@/components/ui";
import { useStore } from "@/context/StoreContext";

export default function TrackOrderPage() {
  const router = useRouter();
  const { orders, showToast } = useStore();
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const target = params.get("awb") || params.get("orderId");
      if (target) {
        setQuery(target);
        router.push(`/account/orders/${target}`);
      }
    }
  }, [router]);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = query.trim().toUpperCase();
    if (!clean) {
      setError("Please enter a valid Consignment ID or Phone Number.");
      return;
    }

    // Try finding order in context
    const matched = orders.find(
      (o) =>
        o.orderId.toUpperCase() === clean ||
        o.phone.replace(/\D/g, "").includes(clean.replace(/\D/g, "")) ||
        o.trackingNumber.toUpperCase() === clean
    );

    if (matched) {
      router.push(`/account/orders/${matched.orderId}`);
    } else if (clean.startsWith("KSM") || clean.startsWith("KS-") || clean.length >= 6) {
      // Proceed to order detail for the given ID (with fallback support)
      router.push(`/account/orders/${clean}`);
    } else {
      setError(
        "Could not locate an active consignment with this identifier. Please verify your order number (e.g. KSM-84920) or WhatsApp our concierge."
      );
    }
  };

  const handleQuickLookup = (orderId: string) => {
    setQuery(orderId);
    router.push(`/account/orders/${orderId}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      <Header />

      <main className="flex-1 w-full py-12 sm:py-16 px-4 sm:px-8 lg:px-12 max-w-[1000px] mx-auto space-y-12">
        {/* HERO TITLE & CONTEXT */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-secondary font-sans text-xs uppercase tracking-widest font-semibold">
            <span className="material-symbols-outlined text-[16px]">
              local_shipping
            </span>
            <span>Real-time Consignment Radar</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl text-primary font-normal tracking-tight">
            Track Your Loom Consignment
          </h1>

          <p className="font-sans text-sm sm:text-base text-on-surface-variant leading-relaxed">
            Follow your slow-crafted textiles journey from our ancestral
            Rajasthani looms in Sanganer and Bagru directly to your sanctuary.
          </p>
        </div>

        {/* LOOKUP INPUT CARD */}
        <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 sm:p-10 shadow-sm max-w-xl mx-auto space-y-6">
          <form onSubmit={handleTrackSubmit} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="tracking-input"
                className="font-sans text-xs uppercase tracking-wider font-bold text-primary block"
              >
                Order Reference / AWB / Phone Number
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined text-outline absolute left-3.5 text-[22px]">
                  search
                </span>
                <input
                  id="tracking-input"
                  type="text"
                  placeholder="e.g. KSM-84920 or 9876543210"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    if (error) setError(null);
                  }}
                  className="w-full rounded-lg bg-surface border border-outline-variant px-4 py-3.5 pl-11 text-sm font-sans text-on-surface uppercase placeholder:normal-case placeholder:text-outline focus:outline-none focus:border-primary-container"
                  required
                />
              </div>
            </div>

            {error && (
              <p className="font-sans text-xs text-error bg-error-container/30 p-3 rounded-lg leading-relaxed">
                {error}
              </p>
            )}

            <Button variant="primary" size="lg" className="w-full" type="submit">
              Track Consignment
            </Button>
          </form>

          {/* Quick Demo Clickers */}
          <div className="pt-2 border-t border-outline-variant/30 space-y-2">
            <span className="font-sans text-xs text-on-surface-variant block text-center">
              Looking for a sample lookup?
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => handleQuickLookup("KSM-84920")}
                className="font-sans text-xs bg-surface-container hover:bg-surface-container-high px-3 py-1.5 rounded-full text-primary font-semibold transition-colors"
              >
                Sample Order #KSM-84920
              </button>
              {orders[0] && orders[0].orderId !== "KSM-84920" && (
                <button
                  type="button"
                  onClick={() => handleQuickLookup(orders[0].orderId)}
                  className="font-sans text-xs bg-surface-container hover:bg-surface-container-high px-3 py-1.5 rounded-full text-secondary font-semibold transition-colors"
                >
                  Your Order #{orders[0].orderId}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* TRUST ACCORDIONS / FAQS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/40 space-y-2">
            <div className="w-10 h-10 rounded-full bg-primary-container text-surface flex items-center justify-center mb-2">
              <span className="material-symbols-outlined text-[20px]">
                payments
              </span>
            </div>
            <h3 className="font-serif text-lg text-primary font-semibold">
              Partial COD Settlement
            </h3>
            <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
              If you opted for Partial COD, you can pay the remaining doorstep
              balance via UPI QR code on the delivery agent's scanner or cash.
            </p>
          </div>

          <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/40 space-y-2">
            <div className="w-10 h-10 rounded-full bg-secondary text-surface flex items-center justify-center mb-2">
              <span className="material-symbols-outlined text-[20px]">
                verified_user
              </span>
            </div>
            <h3 className="font-serif text-lg text-primary font-semibold">
              Open-Box Inspection
            </h3>
            <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
              Open the tamper-evident craft box and feel the organic handloom
              cotton before sharing your delivery OTP.
            </p>
          </div>

          <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/40 space-y-2">
            <div className="w-10 h-10 rounded-full bg-tertiary text-surface flex items-center justify-center mb-2">
              <span className="material-symbols-outlined text-[20px]">
                support_agent
              </span>
            </div>
            <h3 className="font-serif text-lg text-primary font-semibold">
              WhatsApp Concierge
            </h3>
            <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
              Need immediate dispatch updates or address modifications? Reach
              our master loom coordinator on WhatsApp at +91 98765 43210.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
