"use client";

import React, { useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import { StaffRole } from "@/types/admin";

export default function AdminSettingsPage() {
  const { activeRole, setActiveRole, showToast } = useAdmin();

  const [settings, setSettings] = useState({
    partialCodEnabled: true,
    minCodAdvance: 500,
    codPercentage: 20,
    maxCodAdvance: 2000,
    doorstepInspectionOtp: true,
    autoAssignLooms: true,
    enableWhatsAppAlerts: true,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Atelier operational configurations saved successfully.");
  };

  return (
    <div className="px-4 sm:px-8 py-6 space-y-6 max-w-[1200px] mx-auto">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between pb-2 border-b border-outline-variant/30 text-xs">
        <div className="flex items-center gap-2 uppercase tracking-widest text-on-surface-variant font-semibold">
          <span>Operations Administration</span>
          <span className="text-outline">/</span>
          <span className="text-primary">Atelier Configurations & Roles</span>
        </div>
      </div>

      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl sm:text-4xl text-primary font-normal tracking-tight">
          Settings & Staff Governance
        </h1>
        <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
          Configure Partial COD deposit formulas, doorstep inspection rules, and staff access roles.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs font-sans">
        {/* Partial COD Policy Settings */}
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-outline-variant/20">
            <span className="material-symbols-outlined text-primary text-[20px]">payments</span>
            <h3 className="font-serif text-lg text-primary font-semibold">
              Partial Cash on Delivery (COD) Rules
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-on-surface">Base Advance (Orders ≤ ₹2,500)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-outline font-bold">₹</span>
                <input
                  type="number"
                  value={settings.minCodAdvance}
                  onChange={(e) => setSettings({ ...settings, minCodAdvance: Number(e.target.value) })}
                  className="w-full bg-surface-container-low pl-7 pr-3 py-2 rounded-lg border border-outline-variant/30"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-on-surface">Advance Percentage (Orders &gt; ₹2,500)</label>
              <div className="relative">
                <input
                  type="number"
                  value={settings.codPercentage}
                  onChange={(e) => setSettings({ ...settings, codPercentage: Number(e.target.value) })}
                  className="w-full bg-surface-container-low pl-3 pr-7 py-2 rounded-lg border border-outline-variant/30"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-outline font-bold">%</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-on-surface">Maximum Advance Cap</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-outline font-bold">₹</span>
                <input
                  type="number"
                  value={settings.maxCodAdvance}
                  onChange={(e) => setSettings({ ...settings, maxCodAdvance: Number(e.target.value) })}
                  className="w-full bg-surface-container-low pl-7 pr-3 py-2 rounded-lg border border-outline-variant/30"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Doorstep Inspection & Dispatch Protocol */}
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-outline-variant/20">
            <span className="material-symbols-outlined text-secondary text-[20px]">local_shipping</span>
            <h3 className="font-serif text-lg text-primary font-semibold">
              Courier Dispatch & Inspection Guarantees
            </h3>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.doorstepInspectionOtp}
                onChange={(e) => setSettings({ ...settings, doorstepInspectionOtp: e.target.checked })}
                className="accent-primary h-4 w-4"
              />
              <div>
                <strong className="text-on-surface block">Enforce Doorstep Inspection OTP</strong>
                <span className="text-on-surface-variant text-[11px]">
                  Courier requires patron to verify OTP after unboxing the wax seal and touching the fabric.
                </span>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableWhatsAppAlerts}
                onChange={(e) => setSettings({ ...settings, enableWhatsAppAlerts: e.target.checked })}
                className="accent-primary h-4 w-4"
              />
              <div>
                <strong className="text-on-surface block">Automated WhatsApp Progress Alerts</strong>
                <span className="text-on-surface-variant text-[11px]">
                  Sends weaving video updates and live air transit AWB notifications to patron phone.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Staff Role Governance */}
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/30 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-outline-variant/20">
            <span className="material-symbols-outlined text-tertiary text-[20px]">shield_person</span>
            <h3 className="font-serif text-lg text-primary font-semibold">
              Role-Based Access Control (RBAC) Switcher
            </h3>
          </div>

          <p className="text-on-surface-variant">
            Select the active role persona to experience the interface as different operational team members:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            {[
              { id: "admin", label: "Admin", desc: "Full atelier access, ledgers, reports, settings." },
              { id: "sales", label: "Sales Concierge", desc: "Leads pipeline, quotes, abandoned carts." },
              { id: "support", label: "Support Care", desc: "Tickets, patron dossiers, communication." },
              { id: "warehouse", label: "Warehouse", desc: "Consignments, inventory, stock adjustments." },
            ].map((r) => (
              <div
                key={r.id}
                onClick={() => setActiveRole(r.id as StaffRole)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  activeRole === r.id
                    ? "bg-primary text-on-primary border-primary shadow-sm"
                    : "bg-surface-container-low hover:bg-surface-container border-outline-variant/30 text-on-surface"
                }`}
              >
                <div className="font-serif font-bold text-sm">{r.label}</div>
                <p className={`text-[11px] mt-1 ${activeRole === r.id ? "text-on-primary/80" : "text-outline"}`}>
                  {r.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold rounded-lg shadow-sm transition-all uppercase tracking-wider"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}
