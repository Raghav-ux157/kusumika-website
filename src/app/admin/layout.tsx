"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdminProvider, useAdmin } from "@/context/AdminContext";
import { StaffRole } from "@/types/admin";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    path: "/admin",
    id: "overview",
    label: "Overview / Dashboard",
    icon: "dashboard",
    roles: ["admin", "sales", "support", "warehouse"],
  },
  {
    path: "/admin/leads",
    id: "leads",
    label: "Leads & Inquiries",
    icon: "filter_list",
    badge: "24",
    roles: ["admin", "sales"],
  },
  {
    path: "/admin/orders",
    id: "orders",
    label: "Orders & Consignments",
    icon: "receipt_long",
    badge: "COD Due",
    roles: ["admin", "sales", "warehouse", "support"],
  },
  {
    path: "/admin/customers",
    id: "customers",
    label: "Customers & Patrons",
    icon: "groups",
    roles: ["admin", "sales", "support"],
  },
  {
    path: "/admin/inventory",
    id: "inventory",
    label: "Inventory & Godown Stock",
    icon: "inventory_2",
    roles: ["admin", "warehouse"],
  },
  {
    path: "/admin/tickets",
    id: "tickets",
    label: "Support & Care Tickets",
    icon: "support_agent",
    badge: "8 Open",
    roles: ["admin", "support"],
  },
  {
    path: "/admin/abandoned-carts",
    id: "abandoned-carts",
    label: "Abandoned Carts",
    icon: "shopping_cart_checkout",
    badge: "₹6.8L",
    roles: ["admin", "sales"],
  },
  {
    path: "/admin/reports",
    id: "reports",
    label: "Reports & Analytics",
    icon: "analytics",
    roles: ["admin"],
  },
  {
    path: "/admin/settings",
    id: "settings",
    label: "Settings",
    icon: "settings",
    roles: ["admin"],
  },
];

function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const {
    activeRole,
    setActiveRole,
    hasAccess,
    selectedCluster,
    setSelectedCluster,
    addLead,
    toastMessage,
  } = useAdmin();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quickLeadModalOpen, setQuickLeadModalOpen] = useState(false);
  const [newLeadForm, setNewLeadForm] = useState({
    business_name: "",
    contact_name: "",
    phone: "",
    email: "",
    city: "Jaipur",
    proposed_value: 250000,
    notes: "",
  });

  const handleCreateQuickLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadForm.business_name || !newLeadForm.contact_name) return;
    addLead({
      business_name: newLeadForm.business_name,
      contact_name: newLeadForm.contact_name,
      phone: newLeadForm.phone,
      email: newLeadForm.email,
      city: newLeadForm.city,
      proposed_value: Number(newLeadForm.proposed_value),
      notes: newLeadForm.notes,
    });
    setNewLeadForm({
      business_name: "",
      contact_name: "",
      phone: "",
      email: "",
      city: "Jaipur",
      proposed_value: 250000,
      notes: "",
    });
    setQuickLeadModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-background font-sans text-on-surface flex flex-col antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-primary text-on-primary px-4 py-3 rounded-xl shadow-lg border border-primary-container flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-bottom-3 duration-200">
          <span className="material-symbols-outlined text-[18px]">info</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* FIXED SIDEBAR (DESKTOP: w-72) */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full w-72 bg-surface-container-low z-50 flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)] transition-transform duration-300 lg:translate-x-0 border-r border-outline-variant/30",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col flex-1 min-h-0">
          {/* Atelier Brand Header */}
          <div className="h-20 flex items-center justify-between px-6 bg-surface-container-low border-b border-outline-variant/20">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-surface-container-lowest p-1 shadow-sm flex items-center justify-center overflow-hidden border border-outline-variant/30 shrink-0">
                <span className="text-2xl" role="img" aria-label="lotus">
                  🪷
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-lg tracking-tight text-primary font-bold leading-tight">
                  Kusumika
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">
                  Atelier Operations
                </span>
              </div>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-outline hover:text-primary"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.path === "/admin"
                  ? pathname === "/admin"
                  : pathname?.startsWith(item.path);
              const allowed = hasAccess(item.id);

              return (
                <Link
                  key={item.path}
                  href={allowed ? item.path : "#"}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all group",
                    isActive
                      ? "bg-primary-container text-on-primary font-semibold shadow-sm"
                      : allowed
                      ? "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                      : "text-outline/50 cursor-not-allowed opacity-60 hover:bg-transparent"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "material-symbols-outlined text-[20px] transition-colors",
                        isActive
                          ? "text-on-primary"
                          : allowed
                          ? "text-on-surface-variant group-hover:text-primary"
                          : "text-outline/40"
                      )}
                    >
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {!allowed && (
                      <span
                        className="material-symbols-outlined text-[14px] text-outline/50"
                        title="Restricted by current Role"
                      >
                        lock
                      </span>
                    )}
                    {item.badge && allowed && (
                      <span
                        className={cn(
                          "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
                          isActive
                            ? "bg-on-primary/20 text-on-primary"
                            : "bg-surface-container-highest text-primary font-semibold"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Live Loom Network Monitor Ribbon */}
        <div className="p-4 bg-surface-container-low border-t border-outline-variant/30 space-y-2">
          <div className="bg-surface-container p-3 rounded-lg flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-tertiary"></span>
              </span>
              <div className="flex flex-col">
                <span className="text-xs text-on-surface font-semibold">
                  Loom Network
                </span>
                <span className="text-[10px] text-on-surface-variant">
                  14 Looms Live (Sanganer)
                </span>
              </div>
            </div>
            <span className="text-[10px] bg-tertiary/20 text-tertiary px-2 py-0.5 rounded font-bold uppercase">
              Active
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px] text-on-surface-variant px-1">
            <Link
              href="/"
              target="_blank"
              className="hover:text-primary flex items-center gap-1 underline underline-offset-2"
            >
              <span className="material-symbols-outlined text-[14px]">storefront</span>
              View Live Store
            </Link>
            <span className="font-mono text-[10px]">v1.4-p4</span>
          </div>
        </div>
      </aside>

      {/* MOBILE BACKDROP */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-on-surface/30 z-40 lg:hidden backdrop-blur-sm"
        />
      )}

      {/* TOP HEADER & MAIN VIEWPORT (pl-72 on desktop) */}
      <div className="lg:pl-72 flex-1 flex flex-col">
        {/* Fixed Top Bar */}
        <header className="fixed top-0 right-0 left-0 lg:left-72 h-20 bg-surface/90 backdrop-blur-xl z-30 flex items-center justify-between px-4 sm:px-8 border-b border-outline-variant/30 shadow-[0_1px_8px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-3 flex-1 max-w-2xl">
            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg text-on-surface hover:bg-surface-container"
            >
              <span className="material-symbols-outlined text-[24px]">menu</span>
            </button>

            {/* Global Search Bar */}
            <div className="relative w-full max-w-xs sm:max-w-sm hidden sm:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                search
              </span>
              <input
                className="w-full bg-surface-container-lowest text-on-surface placeholder:text-outline text-xs pl-9 pr-3 py-2 rounded-lg border border-outline-variant/40 shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Search orders, artisans, patrons, leads..."
                type="text"
              />
            </div>

            {/* Cluster Selector */}
            <div className="relative hidden md:block">
              <select
                value={selectedCluster}
                onChange={(e) => setSelectedCluster(e.target.value)}
                className="appearance-none bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-semibold pl-3 pr-8 py-2 rounded-lg cursor-pointer border border-outline-variant/40 focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="All Clusters: Sanganer, Bagru, Jaipur">All Clusters (Sanganer, Bagru, Jaipur)</option>
                <option value="Sanganer Cambric Guild">Sanganer Cambric Guild</option>
                <option value="Bagru Mud-Resist Collective">Bagru Mud-Resist Collective</option>
                <option value="Barmer Heritage Quilt Unit">Barmer Heritage Quilt Unit</option>
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[16px] text-outline">
                arrow_drop_down
              </span>
            </div>

            {/* RBAC ROLE SELECTOR (HERO CONTROL) */}
            <div className="relative">
              <select
                aria-label="Role Selector"
                value={activeRole}
                onChange={(e) => setActiveRole(e.target.value as StaffRole)}
                className="appearance-none bg-surface-container-high hover:bg-surface-container-highest text-primary font-bold text-xs pl-3 pr-8 py-2 rounded-lg cursor-pointer transition-colors border border-primary/20 shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="admin">Role: Admin (Full Access)</option>
                <option value="sales">Role: Sales & Concierge</option>
                <option value="support">Role: Support & Patron Care</option>
                <option value="warehouse">Role: Warehouse & Dispatch</option>
              </select>
              <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[16px] text-primary">
                expand_more
              </span>
            </div>
          </div>

          {/* Right Action Icons & Avatar */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuickLeadModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 bg-surface-container hover:bg-surface-container-high text-on-surface px-3 py-2 rounded-lg text-xs font-semibold transition-colors border border-outline-variant/40 shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px] text-primary">add</span>
              <span>+ New Lead</span>
            </button>

            <Link
              href="/admin/orders"
              className="flex items-center gap-1.5 bg-primary hover:bg-primary-container text-on-primary px-3 py-2 rounded-lg text-xs font-semibold transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">receipt_long</span>
              <span className="hidden sm:inline">Orders</span>
            </Link>

            <div className="h-5 w-[1px] bg-outline-variant/40 mx-1 hidden sm:block" />

            {/* User Profile */}
            <div className="flex items-center gap-2.5 pl-1">
              <div className="flex flex-col text-right hidden xl:flex">
                <span className="text-xs text-on-surface font-semibold leading-tight">
                  Devika Sharma
                </span>
                <span className="text-[10px] text-on-surface-variant uppercase font-medium">
                  {activeRole === "admin"
                    ? "Head of Operations"
                    : activeRole === "sales"
                    ? "Trade Concierge"
                    : activeRole === "support"
                    ? "Patron Care"
                    : "Dispatch Lead"}
                </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs shadow-sm">
                DS
              </div>
            </div>
          </div>
        </header>

        {/* MAIN BODY AREA */}
        <main className="pt-20 flex-1 w-full bg-background min-h-screen">
          {children}
        </main>
      </div>

      {/* QUICK NEW LEAD MODAL */}
      {quickLeadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface-container-lowest max-w-lg w-full rounded-2xl p-6 sm:p-8 shadow-2xl border border-outline-variant/40 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">
                  business_center
                </span>
                <h3 className="font-serif text-2xl text-primary font-normal">
                  Create Trade Inquiry
                </h3>
              </div>
              <button
                onClick={() => setQuickLeadModalOpen(false)}
                className="text-outline hover:text-primary p-1"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateQuickLead} className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-on-surface">Property / Business Name *</label>
                  <input
                    required
                    placeholder="e.g. Suryagarh Palace"
                    value={newLeadForm.business_name}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, business_name: e.target.value })}
                    className="w-full bg-surface-container-low p-2.5 rounded-lg border border-outline-variant/40 focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-on-surface">Contact Person *</label>
                  <input
                    required
                    placeholder="e.g. Vikramaditya Singh"
                    value={newLeadForm.contact_name}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, contact_name: e.target.value })}
                    className="w-full bg-surface-container-low p-2.5 rounded-lg border border-outline-variant/40 focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-on-surface">Phone Number *</label>
                  <input
                    required
                    placeholder="+91 98290 12345"
                    value={newLeadForm.phone}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, phone: e.target.value })}
                    className="w-full bg-surface-container-low p-2.5 rounded-lg border border-outline-variant/40 focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-on-surface">Email Address</label>
                  <input
                    type="email"
                    placeholder="concierge@hotel.com"
                    value={newLeadForm.email}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, email: e.target.value })}
                    className="w-full bg-surface-container-low p-2.5 rounded-lg border border-outline-variant/40 focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-on-surface">City / Destination</label>
                  <input
                    placeholder="e.g. Jaisalmer"
                    value={newLeadForm.city}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, city: e.target.value })}
                    className="w-full bg-surface-container-low p-2.5 rounded-lg border border-outline-variant/40 focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-on-surface">Proposed Value (INR)</label>
                  <input
                    type="number"
                    value={newLeadForm.proposed_value}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, proposed_value: Number(e.target.value) })}
                    className="w-full bg-surface-container-low p-2.5 rounded-lg border border-outline-variant/40 focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-on-surface">Atelier Inscription / Specifications</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Requested 400TC cambric samples with lotus seal."
                  value={newLeadForm.notes}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, notes: e.target.value })}
                  className="w-full bg-surface-container-low p-2.5 rounded-lg border border-outline-variant/40 focus:ring-1 focus:ring-primary focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-outline-variant/30">
                <button
                  type="button"
                  onClick={() => setQuickLeadModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-outline hover:text-on-surface font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-semibold shadow-sm"
                >
                  Create & Ingest Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <AdminShell>{children}</AdminShell>
    </AdminProvider>
  );
}
