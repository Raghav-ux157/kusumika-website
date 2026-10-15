"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAdmin } from "@/context/AdminContext";
import { formatPrice } from "@/lib/utils";

export default function AdminOverviewPage() {
  const { orders, leads, activeRole, showToast } = useAdmin();
  const [period, setPeriod] = useState<"month" | "quarter" | "ytd">("ytd");

  const pendingCodOrders = orders.filter((o) => o.payment_mode === "partial_cod" && !o.cod_collected);
  const totalPendingCodAmount = pendingCodOrders.reduce((sum, o) => sum + o.balance_due, 0);

  const handleExportCsv = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Order Number,Patron,Total,Payment Mode,Advance Paid,Balance Due,Status,Cluster\n" +
      orders
        .map(
          (o) =>
            `"${o.order_number}","${o.customer_name}","${o.total}","${o.payment_mode}","${o.advance_paid}","${o.balance_due}","${o.status}","${o.cluster}"`
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Kusumika_Financial_Ledger_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Downloaded Financial Ledger CSV.");
  };

  const handleExportPdf = () => {
    window.print();
  };

  return (
    <div className="px-4 sm:px-8 py-6 space-y-8 max-w-[1600px] mx-auto">
      {/* Top Breadcrumb & Metadata Accent */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-outline-variant/30">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-on-surface-variant font-semibold">
          <span>Atelier Intelligence</span>
          <span className="text-outline">/</span>
          <span className="text-primary">Ledger & Operational Cadence</span>
          <span className="text-outline">/</span>
          <span>Audit FY 2024–25</span>
        </div>
        <div className="flex items-center gap-2 bg-surface-container-high px-3 py-1 rounded-full text-on-surface-variant text-xs">
          <span className="inline-block w-2 h-2 rounded-full bg-tertiary animate-pulse" />
          <span>Ledger synchronized with Jaipur Loom Network: Live</span>
        </div>
      </div>

      {/* Executive Header Module */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container text-primary text-xs font-semibold tracking-wider uppercase">
            <span className="material-symbols-outlined text-[16px]">verified</span>
            <span>Executive Operations & Yield Report</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-primary font-normal tracking-tight">
            Executive Reports & Artisan Operations Analytics
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            In-depth performance breakdown across direct-to-consumer sales, luxury hotel commissions, loom cluster velocity, and doorstep COD settlement.
          </p>
        </div>

        {/* Global Period Controls & Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-surface-container p-1 rounded-xl shadow-sm text-xs font-semibold">
            <button
              onClick={() => setPeriod("month")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                period === "month"
                  ? "bg-surface-container-lowest text-primary shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              This Month
            </button>
            <button
              onClick={() => setPeriod("quarter")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                period === "quarter"
                  ? "bg-surface-container-lowest text-primary shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Last Quarter
            </button>
            <button
              onClick={() => setPeriod("ytd")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                period === "ytd"
                  ? "bg-surface-container-lowest text-primary shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Year to Date (FY 24-25)
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold rounded-lg shadow-sm transition-all"
            >
              <span className="material-symbols-outlined text-[16px] text-primary">table_view</span>
              <span>Ledger CSV</span>
            </button>
            <button
              onClick={handleExportPdf}
              className="flex items-center gap-1.5 px-4 py-2 bg-primary text-on-primary hover:bg-primary-container text-xs font-semibold rounded-lg shadow-sm transition-all uppercase tracking-wider"
            >
              <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span>
              <span>Dossier PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Top KPI Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* KPI Card 1: Billed GMV */}
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30 relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-widest text-on-surface-variant font-semibold">
                Consolidated Volume
              </span>
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-tertiary/15 text-tertiary text-xs font-bold">
                <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
                24.5% YoY
              </span>
            </div>
            <p className="font-serif text-sm text-on-surface-variant">Total Billed GMV</p>
            <h2 className="font-serif text-4xl text-primary font-normal tracking-tight">
              ₹1.42 <span className="text-xl text-on-surface-variant">Cr</span>
            </h2>
          </div>
          <div className="pt-3 mt-4 border-t border-outline-variant/20 flex items-center justify-between text-xs text-on-surface-variant">
            <span>Baseline: ₹1.14 Cr</span>
            <span className="text-tertiary font-bold">Pacing +8% vs Target</span>
          </div>
        </div>

        {/* KPI Card 2: Doorstep COD Success */}
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30 relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-widest text-on-surface-variant font-semibold">
                Dispute Protection
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container text-primary text-[11px] font-bold">
                ₹500–₹2,000 Adv.
              </span>
            </div>
            <p className="font-serif text-sm text-on-surface-variant">Doorstep COD Settlement</p>
            <h2 className="font-serif text-4xl text-on-surface font-normal tracking-tight">
              96.2<span className="text-xl text-on-surface-variant">%</span>
            </h2>
          </div>
          <div className="pt-3 mt-4 border-t border-outline-variant/20 flex items-center justify-between text-xs text-on-surface-variant">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-tertiary">verified_user</span>
              <span>RTO restricted to <strong className="text-primary font-bold">3.8%</strong></span>
            </div>
            <span className="font-mono text-tertiary font-semibold">₹4.8L saved</span>
          </div>
        </div>

        {/* KPI Card 3: Trade & B2B Volume */}
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30 relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-widest text-on-surface-variant font-semibold">
                Hospitality Pipeline
              </span>
              <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface text-[11px] font-bold">
                {leads.length} Properties
              </span>
            </div>
            <p className="font-serif text-sm text-on-surface-variant">Trade & B2B Volume</p>
            <h2 className="font-serif text-4xl text-on-surface font-normal tracking-tight">
              ₹48.6 <span className="text-xl text-on-surface-variant">L</span>
            </h2>
          </div>
          <div className="pt-3 mt-4 border-t border-outline-variant/20 flex items-center justify-between text-xs text-on-surface-variant">
            <span>Aman, Raas, Taj Palaces</span>
            <span className="text-secondary font-bold">100% On-spec</span>
          </div>
        </div>

        {/* KPI Card 4: Net Patron LTV */}
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30 relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-widest text-on-surface-variant font-semibold">
                Patron Cohort Strength
              </span>
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-tertiary/15 text-tertiary text-xs font-bold">
                <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
                18.2%
              </span>
            </div>
            <p className="font-serif text-sm text-on-surface-variant">Net Patron LTV</p>
            <h2 className="font-serif text-4xl text-on-surface font-normal tracking-tight">
              ₹14,250
            </h2>
          </div>
          <div className="pt-3 mt-4 border-t border-outline-variant/20 flex items-center justify-between text-xs text-on-surface-variant">
            <span>Repeat window: 84 days</span>
            <span className="text-primary font-bold">41.8% Retention</span>
          </div>
        </div>
      </div>

      {/* Dual Analytical Workspace: Revenue Settlement Mix & Partial COD Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Revenue Settlement Mix */}
        <div className="lg:col-span-7 bg-surface-container-lowest rounded-xl p-6 sm:p-8 shadow-sm border border-outline-variant/30 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-sans uppercase tracking-widest text-secondary font-bold">
                Liquidity & Risk Matrix
              </span>
              <h3 className="font-serif text-2xl text-primary font-medium">
                Revenue & Settlement Mix
              </h3>
            </div>
            <div className="flex items-center gap-3 text-xs text-on-surface-variant">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                <span>UPI/Cards (62%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
                <span>Partial COD (34%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-tertiary" />
                <span>B2B Net (4%)</span>
              </div>
            </div>
          </div>

          {/* Visual Stacked Bar */}
          <div className="w-full h-4 rounded-full overflow-hidden bg-surface-dim flex">
            <div className="bg-primary h-full" style={{ width: "62%" }} title="Online Advance / Prepaid: 62%" />
            <div className="bg-secondary h-full" style={{ width: "34%" }} title="Partial COD Doorstep: 34%" />
            <div className="bg-tertiary h-full" style={{ width: "4%" }} title="B2B Net-30 Invoices: 4%" />
          </div>

          {/* Deep Dive Breakdown Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-on-surface-variant">
                Advance Online (Settled)
              </span>
              <p className="font-serif text-2xl text-primary font-bold">₹88.04 L</p>
              <p className="text-[11px] text-on-surface-variant">UPI, Razorpay, NetBanking</p>
              <div className="pt-2 text-[11px] text-tertiary font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                <span>Zero gateway chargebacks</span>
              </div>
            </div>

            <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-on-surface-variant">
                Doorstep COD Collected
              </span>
              <p className="font-serif text-2xl text-secondary font-bold">₹48.28 L</p>
              <p className="text-[11px] text-on-surface-variant">Cash & Dynamic QR Handoff</p>
              <div className="pt-2 text-[11px] text-tertiary font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">pin</span>
                <span>99.2% OTP verified</span>
              </div>
            </div>

            <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-on-surface-variant">
                Institutional B2B
              </span>
              <p className="font-serif text-2xl text-tertiary font-bold">₹5.68 L</p>
              <p className="text-[11px] text-on-surface-variant">Luxury Hotel Commission</p>
              <div className="pt-2 text-[11px] text-primary font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">schedule</span>
                <span>Net-30 verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Active Weaving Clusters & Godowns */}
        <div className="lg:col-span-5 bg-surface-container-lowest rounded-xl p-6 sm:p-8 shadow-sm border border-outline-variant/30 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-sans uppercase tracking-widest text-secondary font-bold">
                Artisan Velocity
              </span>
              <h3 className="font-serif text-2xl text-primary font-medium">
                Live Weaving Clusters
              </h3>
            </div>
            <span className="text-xs bg-tertiary/20 text-tertiary px-2.5 py-1 rounded-full font-bold">
              14 Looms Engaged
            </span>
          </div>

          <div className="space-y-3 text-xs font-sans">
            {[
              {
                name: "Sanganer Cambric Guild",
                craft: "400TC Hand-Block Print",
                looms: "8 Looms Live",
                velocity: "92% Capacity",
                color: "bg-primary",
              },
              {
                name: "Bagru Mud-Resist Collective",
                craft: "Natural Indigo & Dabu Dyeing",
                looms: "4 Looms Live",
                velocity: "88% Capacity",
                color: "bg-secondary",
              },
              {
                name: "Barmer Heritage Quilt Unit",
                craft: "Pure Silk & Voile Razai Batting",
                looms: "2 Looms Live",
                velocity: "96% Capacity",
                color: "bg-tertiary",
              },
            ].map((cluster, i) => (
              <div key={i} className="p-3.5 rounded-lg bg-surface-container-low border border-outline-variant/30 space-y-2">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-on-surface font-serif text-sm">{cluster.name}</span>
                  <span className="text-tertiary text-xs">{cluster.velocity}</span>
                </div>
                <div className="flex items-center justify-between text-on-surface-variant text-[11px]">
                  <span>{cluster.craft}</span>
                  <span>{cluster.looms}</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-surface-dim overflow-hidden">
                  <div
                    className={`${cluster.color} h-full rounded-full`}
                    style={{ width: cluster.velocity.split("%")[0] + "%" }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <Link
              href="/admin/inventory"
              className="text-xs text-primary hover:text-secondary font-semibold flex items-center justify-between p-2 rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors"
            >
              <span>Manage Godown Inventory & Stock Levels</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Orders & Consignments Snapshot */}
      <div className="bg-surface-container-lowest rounded-xl p-6 sm:p-8 shadow-sm border border-outline-variant/30 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-2xl text-primary font-medium">
              Recent Consignments & Partial COD Ledger
            </h3>
            <p className="text-xs text-on-surface-variant">
              Live orders being woven and dispatched across India.
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs text-secondary hover:text-primary font-bold uppercase tracking-wider"
          >
            View All ({orders.length}) →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="bg-surface-container-low text-on-surface uppercase tracking-wider border-b border-outline-variant/30">
                <th className="py-3 px-4 font-semibold">Consignment</th>
                <th className="py-3 px-4 font-semibold">Patron</th>
                <th className="py-3 px-4 font-semibold">Craft Cluster</th>
                <th className="py-3 px-4 font-semibold text-right">Order Value</th>
                <th className="py-3 px-4 font-semibold">Payment Distribution</th>
                <th className="py-3 px-4 font-semibold">Loom / Transit State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {orders.slice(0, 4).map((order) => (
                <tr key={order.id} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-primary">
                    {order.order_number}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-on-surface">{order.customer_name}</div>
                    <div className="text-[11px] text-outline">{order.shipping_address.city}</div>
                  </td>
                  <td className="py-3.5 px-4 text-on-surface-variant">
                    {order.cluster}
                  </td>
                  <td className="py-3.5 px-4 text-right font-serif font-bold text-on-surface">
                    {formatPrice(order.total)}
                  </td>
                  <td className="py-3.5 px-4">
                    {order.payment_mode === "partial_cod" ? (
                      <div className="space-y-0.5">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-secondary/15 text-secondary">
                          Advance: {formatPrice(order.advance_paid)} (Razorpay)
                        </span>
                        <div className="text-[11px] text-primary font-medium">
                          {order.cod_collected ? (
                            <span className="text-tertiary font-semibold">✓ Doorstep Collected</span>
                          ) : (
                            <span>Doorstep Due: {formatPrice(order.balance_due)}</span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-tertiary/15 text-tertiary">
                        100% Fully Prepaid Online
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-surface-container text-on-surface">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {order.status}
                    </span>
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
