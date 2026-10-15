"use client";

import React from "react";
import { useAdmin } from "@/context/AdminContext";
import { formatPrice } from "@/lib/utils";

export default function AdminReportsPage() {
  const { orders, showToast } = useAdmin();

  return (
    <div className="px-4 sm:px-8 py-6 space-y-6 max-w-[1700px] mx-auto">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between pb-2 border-b border-outline-variant/30 text-xs">
        <div className="flex items-center gap-2 uppercase tracking-widest text-on-surface-variant font-semibold">
          <span>Executive Intelligence</span>
          <span className="text-outline">/</span>
          <span className="text-primary">Financial & Loom Yield Reports</span>
        </div>
        <span className="text-outline">FY 2024–25 Certified Audit</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl text-primary font-normal tracking-tight">
            Financial & Operational Reports
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
            Reconciliation of online advance payments, doorstep courier cash collections, and artisan guild payouts.
          </p>
        </div>

        <button
          onClick={() => {
            window.print();
            showToast("Preparing Executive Dossier PDF export...");
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold rounded-lg shadow-sm transition-all uppercase tracking-wider"
        >
          <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span>
          <span>Download Audit Report</span>
        </button>
      </div>

      {/* Section 1: Financial Settlement Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-outline">Online Razorpay Settlements</span>
            <span className="material-symbols-outlined text-primary text-[18px]">credit_card</span>
          </div>
          <p className="font-serif text-3xl font-bold text-primary">₹88,04,250</p>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Directly deposited to HDFC Bank Escrow. 100% verified via HMAC-SHA256 test gateway tokens.
          </p>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-outline">Doorstep COD Reconciled</span>
            <span className="material-symbols-outlined text-secondary text-[18px]">payments</span>
          </div>
          <p className="font-serif text-3xl font-bold text-secondary">₹48,28,400</p>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Collected by BlueDart and Delhivery delivery personnel via cash and dynamic BharatQR.
          </p>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-outline">Artisan Loom Payouts</span>
            <span className="material-symbols-outlined text-tertiary text-[18px]">handshake</span>
          </div>
          <p className="font-serif text-3xl font-bold text-tertiary">₹62,40,000</p>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Fair-trade wages directly disbursed to master weaver collectives in Sanganer and Bagru.
          </p>
        </div>
      </div>

      {/* Section 2: Patron Cohort Retention Matrix */}
      <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-xl border border-outline-variant/30 shadow-sm space-y-4">
        <h3 className="font-serif text-2xl text-primary font-medium">
          Patron Cohort Retention & Repeat Rhythm
        </h3>
        <p className="text-xs text-on-surface-variant">
          Repeat purchase behaviour across 12-month patron cohorts.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-lg bg-surface-container-low border border-outline-variant/30 space-y-1">
            <span className="text-[10px] uppercase font-bold text-outline">Average Repeat Cadence</span>
            <p className="font-serif text-2xl font-bold text-on-surface">84 Days</p>
            <p className="text-[11px] text-tertiary font-medium">Top categories: Bedsheets + Waffle Towels</p>
          </div>

          <div className="p-4 rounded-lg bg-surface-container-low border border-outline-variant/30 space-y-1">
            <span className="text-[10px] uppercase font-bold text-outline">Repeat Buyer Share</span>
            <p className="font-serif text-2xl font-bold text-primary">41.8%</p>
            <p className="text-[11px] text-tertiary font-medium">Over 2x direct DTC benchmarks</p>
          </div>

          <div className="p-4 rounded-lg bg-surface-container-low border border-outline-variant/30 space-y-1">
            <span className="text-[10px] uppercase font-bold text-outline">Return on Artisan Trust</span>
            <p className="font-serif text-2xl font-bold text-secondary">3.8% RTO</p>
            <p className="text-[11px] text-on-surface-variant">Prevented through Partial COD advance</p>
          </div>
        </div>
      </div>
    </div>
  );
}
