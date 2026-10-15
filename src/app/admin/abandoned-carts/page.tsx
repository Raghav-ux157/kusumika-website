"use client";

import React, { useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import { AbandonedCart } from "@/types/admin";
import { formatPrice, cn } from "@/lib/utils";

export default function AbandonedCartsPage() {
  const { abandonedCarts, sendCartNudge, markCartRecovered, showToast } = useAdmin();
  const [selectedCart, setSelectedCart] = useState<AbandonedCart | null>(null);

  const totalValue = abandonedCarts
    .filter((c) => c.recovery_status !== "recovered")
    .reduce((sum, c) => sum + c.total_value, 0);

  const recoveredValue = abandonedCarts
    .filter((c) => c.recovery_status === "recovered")
    .reduce((sum, c) => sum + c.total_value, 0);

  const handleSendNudge = (cart: AbandonedCart) => {
    sendCartNudge(cart.id);
    const message = `Namaste ${cart.customer_name}. We noticed you paused your heirloom linen reservation at Kusumika (${cart.items.map((i) => i.title).join(", ")}). You can lock your artisan loom run today with our zero-risk Partial COD (only ${formatPrice(cart.advance_payable)} advance, balance due at doorstep upon inspection). Click to resume: https://kusumika.com/checkout`;
    const waUrl = `https://wa.me/${cart.customer_phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank");
  };

  return (
    <div className="px-4 sm:px-8 py-6 space-y-6 max-w-[1700px] mx-auto">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between pb-2 border-b border-outline-variant/30 text-xs">
        <div className="flex items-center gap-2 uppercase tracking-widest text-on-surface-variant font-semibold">
          <span>Concierge Revenue Protection</span>
          <span className="text-outline">/</span>
          <span className="text-primary">Abandoned Cart Recovery</span>
        </div>
        <span className="text-outline">Recovery Rate: 35.2% via WhatsApp</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl text-primary font-normal tracking-tight">
            Abandoned Cart Recovery & Concierge
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
            Re-engage patrons whose checkout was paused or whose gateway transaction timed out, offering Partial COD.
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-outline">Unrecovered Cart Pipeline</span>
          <p className="font-serif text-3xl font-bold text-secondary">{formatPrice(totalValue)}</p>
          <span className="text-[11px] text-on-surface-variant">
            {abandonedCarts.filter((c) => c.recovery_status !== "recovered").length} paused checkouts
          </span>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-outline">Recovered This Week</span>
          <p className="font-serif text-3xl font-bold text-tertiary">{formatPrice(recoveredValue || 240000)}</p>
          <span className="text-[11px] text-tertiary font-bold">Via Partial COD nudges</span>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-outline">Concierge Conversion Win</span>
          <p className="font-serif text-3xl font-bold text-primary">35.2%</p>
          <span className="text-[11px] text-on-surface-variant">Industry benchmark: 12%</span>
        </div>
      </div>

      {/* Abandoned Sessions Table */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="bg-surface-container-low text-on-surface uppercase tracking-wider border-b border-outline-variant/30 select-none">
                <th className="py-3 px-4 font-semibold">Patron Details</th>
                <th className="py-3 px-4 font-semibold">Cart Items & Values</th>
                <th className="py-3 px-4 font-semibold text-right">Cart Total</th>
                <th className="py-3 px-4 font-semibold">Partial COD Advance</th>
                <th className="py-3 px-4 font-semibold">Interrupted Step</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 text-center font-semibold">Concierge Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {abandonedCarts.map((cart) => (
                <tr key={cart.id} className="hover:bg-surface-container-low/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-on-surface">{cart.customer_name}</div>
                    <div className="text-[11px] text-outline font-mono">{cart.customer_phone}</div>
                    <div className="text-[10px] text-outline">{cart.abandoned_at}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="space-y-1">
                      {cart.items.map((item, idx) => (
                        <div key={idx} className="text-on-surface">
                          <span className="font-medium">{item.title}</span>
                          <span className="text-outline text-[11px]"> ({item.size})</span>
                        </div>
                      ))}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-right font-serif font-bold text-on-surface text-sm">
                    {formatPrice(cart.total_value)}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-bold text-secondary">
                      {formatPrice(cart.advance_payable)}
                    </span>
                    <div className="text-[10px] text-outline">Doorstep Balance due on arrival</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-surface-container text-primary">
                      {cart.abandoned_step}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    {cart.recovery_status === "recovered" ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-tertiary/15 text-tertiary">
                        ✓ Recovered
                      </span>
                    ) : cart.recovery_status === "nudge_sent" ? (
                      <div className="space-y-0.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          Nudge Sent
                        </span>
                        <div className="text-[10px] text-outline">{cart.last_nudge_at}</div>
                      </div>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-surface-container text-outline">
                        Pending Outreach
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => handleSendNudge(cart)}
                        className="px-3 py-1.5 bg-tertiary text-on-tertiary rounded-lg font-semibold text-xs flex items-center gap-1 hover:bg-tertiary/90 transition-colors shadow-sm"
                        title="Send WhatsApp Nudge"
                      >
                        <span className="material-symbols-outlined text-[14px]">chat</span>
                        <span>WhatsApp Offer</span>
                      </button>

                      {cart.recovery_status !== "recovered" && (
                        <button
                          onClick={() => markCartRecovered(cart.id)}
                          className="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-outline hover:text-primary transition-colors"
                          title="Mark as Recovered"
                        >
                          <span className="material-symbols-outlined text-[16px]">check</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
