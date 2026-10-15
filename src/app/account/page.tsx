"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Header, Footer } from "@/components/layout";
import { Button, Input, Badge } from "@/components/ui";
import { useStore, PlacedOrder } from "@/context/StoreContext";
import { formatPrice } from "@/lib/utils";
import { MOCK_CATALOG } from "@/lib/mockCatalog";

interface SavedAddress {
  id: string;
  label: string;
  isDefault: boolean;
  name: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  type: "Residence" | "Studio" | "Haven";
}

const INITIAL_SAVED_ADDRESSES: SavedAddress[] = [
  {
    id: "addr-1",
    label: "Jaipur Residence",
    isDefault: true,
    name: "Radhika Sharma",
    addressLine: "B-42, Gulabi Bagh, Near Raj Bhavan, Civil Lines",
    city: "Jaipur",
    state: "Rajasthan",
    pincode: "302006",
    phone: "+91 98765 43210",
    type: "Residence",
  },
  {
    id: "addr-2",
    label: "Delhi Design Studio",
    isDefault: false,
    name: "Radhika Sharma",
    addressLine: "Heritage Design Studio, Plot 14, Okhla Phase-III",
    city: "New Delhi",
    state: "Delhi NCR",
    pincode: "110020",
    phone: "+91 98110 54321",
    type: "Studio",
  },
];

const ARCHIVED_ORDERS = [
  {
    orderId: "KSM-76190",
    date: "12 Aug 2026",
    items: [
      {
        title: "Gulabi Bagh 600TC Cotton Sateen King Bed Set",
        image: MOCK_CATALOG[2]?.images[0] || MOCK_CATALOG[0].images[0],
        variant: "King (108x108\") • Rose Madder",
        price: 3650,
        quantity: 1,
      },
      {
        title: "Jodhpur Heritage Velvet Cushions (Pair)",
        image: MOCK_CATALOG[6]?.images[0] || MOCK_CATALOG[1].images[0],
        variant: "18x18\" • Royal Peacock & Rust",
        price: 1299,
        quantity: 1,
      },
    ],
    total: 4949,
    paymentMode: "Net Banking",
    status: "Delivered",
    deliveredOn: "16 Aug 2026",
  },
  {
    orderId: "KSM-61024",
    date: "24 May 2026",
    items: [
      {
        title: "Shekhawati Chintz Floral 300TC Bed Linen Set",
        image: MOCK_CATALOG[1]?.images[0] || MOCK_CATALOG[0].images[0],
        variant: "Queen (90x100\") • Indigo Kashish",
        price: 2550,
        quantity: 1,
      },
    ],
    total: 2550,
    paymentMode: "UPI",
    status: "Delivered",
    deliveredOn: "28 May 2026",
  },
];

export default function AccountPage() {
  const { orders, addToCart, showToast } = useStore();
  const [activeTab, setActiveTab] = useState<
    "orders" | "addresses" | "rewards" | "trade" | "settings"
  >("orders");

  const [savedAddresses, setSavedAddresses] =
    useState<SavedAddress[]>(INITIAL_SAVED_ADDRESSES);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: "",
    name: "",
    addressLine: "",
    city: "",
    state: "Rajasthan",
    pincode: "",
    phone: "",
    type: "Residence" as const,
  });

  // Active consignment (the most recent order)
  const activeOrder: PlacedOrder | undefined = orders[0];

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.label || !newAddress.name || !newAddress.addressLine) return;
    const added: SavedAddress = {
      id: `addr-${Date.now()}`,
      label: newAddress.label,
      isDefault: savedAddresses.length === 0,
      name: newAddress.name,
      addressLine: newAddress.addressLine,
      city: newAddress.city || "Jaipur",
      state: newAddress.state || "Rajasthan",
      pincode: newAddress.pincode || "302001",
      phone: newAddress.phone || "+91 98765 43210",
      type: newAddress.type,
    };
    setSavedAddresses([...savedAddresses, added]);
    setIsAddingAddress(false);
    setNewAddress({
      label: "",
      name: "",
      addressLine: "",
      city: "",
      state: "Rajasthan",
      pincode: "",
      phone: "",
      type: "Residence",
    });
    showToast("New sanctuary address registered.");
  };

  const handleSetDefaultAddress = (id: string) => {
    setSavedAddresses(
      savedAddresses.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }))
    );
    showToast("Default delivery address updated.");
  };

  const handleDeleteAddress = (id: string) => {
    setSavedAddresses(savedAddresses.filter((a) => a.id !== id));
    showToast("Address removed from registry.");
  };

  const handleBuyAgain = (itemTitle: string) => {
    const matched =
      MOCK_CATALOG.find((p) =>
        p.title.toLowerCase().includes(itemTitle.toLowerCase().split(" ")[0])
      ) || MOCK_CATALOG[0];
    addToCart(matched, matched.variants?.[0]?.size, matched.swatches?.[0], 1);
    showToast(`${matched.title} added to your cart.`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      <Header />

      <main className="flex-1 w-full py-8 sm:py-12 px-4 sm:px-8 lg:px-12 max-w-[1360px] mx-auto">
        {/* TOP AMBIENT DECORATIVE GLOW */}
        <div className="relative w-full space-y-8">
          {/* PATRON DOSSIER HEADER CARD */}
          <section className="relative bg-surface-container-low border border-outline-variant/60 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-sm overflow-hidden">
            {/* Architectural Arch Watermark */}
            <div className="absolute -right-16 -bottom-16 w-64 h-64 opacity-5 pointer-events-none text-primary">
              <svg className="w-full h-full fill-current" viewBox="0 0 200 200">
                <path d="M100 0 C105 50 150 95 200 100 C150 105 105 150 100 200 C95 150 50 105 0 100 C50 95 95 50 100 0 Z"></path>
              </svg>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-secondary font-sans text-xs uppercase tracking-widest font-semibold">
                  <span className="material-symbols-outlined text-[16px]">
                    verified
                  </span>
                  <span>Atelier Patronage Dossier</span>
                </div>
                <h1 className="font-serif text-3xl sm:text-4xl text-primary font-normal tracking-tight">
                  Welcome back, {activeOrder?.customerName || "Radhika Sharma"}
                </h1>
                <p className="font-sans text-sm text-on-surface-variant max-w-xl leading-relaxed">
                  Honored guardian of slow textile traditions. Your ongoing
                  patronage directly sustains forty-two multigenerational
                  hand-block carving and weaving families in Bagru and Sanganer.
                </p>
              </div>

              {/* LOYALTY TIER BADGE */}
              <div className="flex items-center gap-4 bg-surface p-4 sm:p-5 rounded-xl border border-outline-variant/60 shadow-xs shrink-0">
                <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-primary-container text-surface flex items-center justify-center shrink-0 shadow-inner">
                  <span className="material-symbols-outlined text-[28px] text-primary-fixed">
                    workspace_premium
                  </span>
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-sans text-[10px] uppercase tracking-wider font-bold">
                      Tier II
                    </span>
                    <span className="font-serif text-lg text-primary font-semibold">
                      Loom Patron
                    </span>
                  </div>
                  <div className="font-sans text-xs text-on-surface">
                    <span className="font-bold text-secondary">
                      1,420 Atelier Points
                    </span>
                    <span className="text-on-surface-variant block sm:inline sm:ml-1">
                      (Redeemable for ₹1,420 off next bespoke order)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* NAVIGATION SUB-MENU TABS */}
            <div className="mt-8 pt-4 border-t border-outline-variant/40 flex flex-wrap items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("orders")}
                className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-lg font-sans text-xs uppercase tracking-wider font-semibold transition-all ${
                  activeTab === "orders"
                    ? "bg-primary text-surface shadow-xs"
                    : "text-on-surface hover:bg-surface-container"
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  local_shipping
                </span>
                <span>Orders & Live Tracking ({orders.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("addresses")}
                className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-lg font-sans text-xs uppercase tracking-wider font-semibold transition-all ${
                  activeTab === "addresses"
                    ? "bg-primary text-surface shadow-xs"
                    : "text-on-surface hover:bg-surface-container"
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  home_pin
                </span>
                <span>Saved Addresses ({savedAddresses.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("rewards")}
                className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-lg font-sans text-xs uppercase tracking-wider font-semibold transition-all ${
                  activeTab === "rewards"
                    ? "bg-primary text-surface shadow-xs"
                    : "text-on-surface hover:bg-surface-container"
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  stars
                </span>
                <span>Atelier Rewards & Points</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("trade")}
                className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-lg font-sans text-xs uppercase tracking-wider font-semibold transition-all ${
                  activeTab === "trade"
                    ? "bg-primary text-surface shadow-xs"
                    : "text-on-surface hover:bg-surface-container"
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  apartment
                </span>
                <span>Trade & Bulk Quotes</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("settings")}
                className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-lg font-sans text-xs uppercase tracking-wider font-semibold transition-all ${
                  activeTab === "settings"
                    ? "bg-primary text-surface shadow-xs"
                    : "text-on-surface hover:bg-surface-container"
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  manage_accounts
                </span>
                <span>Account Settings</span>
              </button>
            </div>
          </section>

          {/* TAB 1: ORDERS & LIVE TRACKING */}
          {activeTab === "orders" && (
            <div className="space-y-8">
              {/* ACTIVE ORDER LIVE TRACKING CARD */}
              {activeOrder && (
                <section className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-sm space-y-6">
                  {/* Order Header Strip */}
                  <div className="flex flex-col xl:flex-row xl:items-center justify-between pb-6 border-b border-outline-variant/30 gap-4">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="px-2.5 py-0.5 rounded bg-primary text-surface font-sans text-[10px] uppercase tracking-widest font-bold">
                          {activeOrder.status === "Delivered"
                            ? "Completed Delivery"
                            : "Active Dispatch"}
                        </span>
                        <span className="font-serif text-2xl text-primary font-medium">
                          Consignment #{activeOrder.orderId}
                        </span>
                        <span className="text-on-surface-variant font-sans text-xs">
                          • Placed on {activeOrder.date}
                        </span>
                      </div>
                      <p className="font-sans text-xs sm:text-sm text-on-surface-variant">
                        Delivery Partner:{" "}
                        <strong className="text-on-surface font-semibold">
                          Shiprocket Express / Blue Dart Artisan
                        </strong>{" "}
                        • AWB Tracking:{" "}
                        <span className="font-mono font-bold text-secondary tracking-wider bg-surface-container px-2 py-0.5 rounded text-xs">
                          {activeOrder.trackingNumber}
                        </span>
                      </p>
                    </div>

                    {/* Financial Settlement Snapshot */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-surface-container-low p-4 rounded-xl border border-outline-variant/40">
                      <div className="space-y-0.5">
                        <div className="font-sans text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">
                          Total Consignment
                        </div>
                        <div className="font-serif text-2xl text-primary font-medium">
                          {formatPrice(activeOrder.total)}
                        </div>
                      </div>

                      {activeOrder.paymentMode === "partial_cod" && (
                        <>
                          <div className="hidden sm:block w-px h-8 bg-outline-variant/60"></div>
                          <div className="space-y-0.5">
                            <div className="font-sans text-[10px] text-secondary uppercase tracking-wider font-bold">
                              Partial COD Balance Due
                            </div>
                            <div className="font-sans text-xs text-on-surface">
                              <span className="text-tertiary font-bold">
                                {formatPrice(activeOrder.advancePaid)} Paid
                              </span>{" "}
                              •{" "}
                              <strong className="text-primary font-bold">
                                {formatPrice(activeOrder.balanceDue)} at Doorstep
                              </strong>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Consignment Items Row */}
                  <div className="bg-surface-container-low/70 rounded-xl p-4 sm:p-5 border border-outline-variant/30 space-y-3">
                    <div className="font-sans text-xs uppercase tracking-wider font-bold text-primary flex items-center justify-between">
                      <span>
                        Articles Included In This Shipment (
                        {activeOrder.items.length})
                      </span>
                      <Link
                        href={`/account/orders/${activeOrder.orderId}`}
                        className="text-secondary hover:text-primary underline underline-offset-4 lowercase text-xs font-normal"
                      >
                        view tracking journey →
                      </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {activeOrder.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 bg-surface p-3 rounded-lg border border-outline-variant/40"
                        >
                          <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-surface-container relative">
                            <Image
                              src={item.product.images[0]}
                              alt={item.product.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-serif text-sm text-primary font-semibold truncate">
                              {item.product.title}
                            </h4>
                            <p className="font-sans text-xs text-on-surface-variant truncate">
                              {item.selectedSize || "Standard"} • Qty:{" "}
                              {item.quantity}
                            </p>
                            <span className="font-sans text-[10px] text-tertiary font-bold uppercase tracking-wider">
                              Natural Dye Certified
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Expected Arrival Strip */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-surface-container rounded-xl gap-3">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-secondary text-[24px]">
                        schedule
                      </span>
                      <div>
                        <div className="font-serif text-base text-primary font-semibold">
                          Estimated Doorstep Delivery: {activeOrder.estimatedDelivery}
                        </div>
                        <p className="font-sans text-xs text-on-surface-variant">
                          Destination: {activeOrder.city}, {activeOrder.state} (
                          {activeOrder.pincode}) • Open-box doorstep inspection guaranteed
                        </p>
                      </div>
                    </div>

                    <Link href={`/account/orders/${activeOrder.orderId}`}>
                      <Button variant="primary" size="sm">
                        Track Consignment Journey
                      </Button>
                    </Link>
                  </div>

                  {/* Loom-to-Doorstep 5-step Stepper Strip */}
                  <div className="pt-2">
                    <h3 className="font-sans text-xs uppercase tracking-wider font-bold text-primary mb-4">
                      Loom-to-Doorstep Progress
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      <div className="p-3 rounded-lg bg-surface-container border border-outline-variant/30 flex flex-col gap-1">
                        <span className="text-[10px] font-sans font-bold text-tertiary uppercase flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">check_circle</span>
                          Stage 1
                        </span>
                        <span className="font-serif text-sm font-semibold text-primary">Loom Reserved</span>
                        <span className="font-sans text-[11px] text-on-surface-variant">Deposit confirmed</span>
                      </div>

                      <div className="p-3 rounded-lg bg-surface-container border border-outline-variant/30 flex flex-col gap-1">
                        <span className="text-[10px] font-sans font-bold text-tertiary uppercase flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">check_circle</span>
                          Stage 2
                        </span>
                        <span className="font-serif text-sm font-semibold text-primary">Hand-Block QC</span>
                        <span className="font-sans text-[11px] text-on-surface-variant">400TC verified</span>
                      </div>

                      <div className="p-3 rounded-lg bg-surface-container border border-outline-variant/30 flex flex-col gap-1">
                        <span className="text-[10px] font-sans font-bold text-tertiary uppercase flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">check_circle</span>
                          Stage 3
                        </span>
                        <span className="font-serif text-sm font-semibold text-primary">Jaipur Haveli Hub</span>
                        <span className="font-sans text-[11px] text-on-surface-variant">Mulmul bagged</span>
                      </div>

                      <div className="p-3 rounded-lg bg-surface-container-high border-2 border-secondary/50 flex flex-col gap-1 shadow-xs">
                        <span className="text-[10px] font-sans font-bold text-secondary uppercase flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px] animate-pulse">local_shipping</span>
                          Stage 4
                        </span>
                        <span className="font-serif text-sm font-semibold text-primary">Out for Delivery</span>
                        <span className="font-sans text-[11px] text-on-surface">Doorstep OTP active</span>
                      </div>

                      <div className="p-3 rounded-lg bg-surface-container/50 border border-outline-variant/20 flex flex-col gap-1 opacity-60">
                        <span className="text-[10px] font-sans font-bold text-outline uppercase flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">inventory_2</span>
                          Stage 5
                        </span>
                        <span className="font-serif text-sm font-semibold text-on-surface">Artisanal Unboxing</span>
                        <span className="font-sans text-[11px] text-on-surface-variant">Lavender sachet</span>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* PAST ORDER HISTORY */}
              <section className="space-y-4">
                <div className="flex items-center justify-between pb-2">
                  <div>
                    <span className="font-sans text-xs uppercase tracking-widest text-secondary font-bold">
                      Archival Dossier
                    </span>
                    <h2 className="font-serif text-2xl sm:text-3xl text-primary font-normal">
                      Past Order History
                    </h2>
                  </div>
                  <span className="font-sans text-xs text-on-surface-variant">
                    {ARCHIVED_ORDERS.length} past consignments
                  </span>
                </div>

                <div className="space-y-4">
                  {ARCHIVED_ORDERS.map((archOrder) => (
                    <div
                      key={archOrder.orderId}
                      className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-5 sm:p-6 shadow-sm space-y-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-outline-variant/30">
                        <div>
                          <span className="font-serif text-lg text-primary font-semibold">
                            Consignment #{archOrder.orderId}
                          </span>
                          <span className="text-on-surface-variant font-sans text-xs ml-2">
                            Delivered on {archOrder.deliveredOn}
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-tertiary/15 text-tertiary font-sans text-xs font-semibold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">
                            done_all
                          </span>
                          {archOrder.status}
                        </span>
                      </div>

                      {/* Items */}
                      <div className="space-y-3">
                        {archOrder.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between gap-4"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-surface-container relative">
                                <Image
                                  src={item.image}
                                  alt={item.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div>
                                <h5 className="font-serif text-sm sm:text-base text-primary font-medium">
                                  {item.title}
                                </h5>
                                <span className="font-sans text-xs text-on-surface-variant">
                                  Qty: {item.quantity} • {item.variant}
                                </span>
                              </div>
                            </div>
                            <span className="font-sans text-sm text-on-surface font-semibold shrink-0">
                              {formatPrice(item.price)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 bg-surface-container-low p-3 rounded-lg">
                        <span className="font-sans text-xs text-on-surface">
                          Total Paid:{" "}
                          <strong className="text-primary font-serif text-base">
                            {formatPrice(archOrder.total)}
                          </strong>{" "}
                          via {archOrder.paymentMode}
                        </span>

                        <div className="flex flex-wrap items-center gap-2">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() =>
                              handleBuyAgain(archOrder.items[0].title)
                            }
                          >
                            Buy Again
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() =>
                              showToast("Review modal submitted for 200 Atelier Points.")
                            }
                          >
                            Write Review (+200 pts)
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              showToast(`Invoice downloaded for #${archOrder.orderId}`)
                            }
                          >
                            Invoice
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* TAB 2: SAVED ADDRESSES */}
          {activeTab === "addresses" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-sans text-xs uppercase tracking-widest text-secondary font-bold">
                    Shipping Registry
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl text-primary font-normal">
                    Saved Havens & Residences
                  </h2>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setIsAddingAddress(true)}
                >
                  + Add New Address
                </Button>
              </div>

              {/* Add New Address Form Modal/Panel */}
              {isAddingAddress && (
                <form
                  onSubmit={handleSaveAddress}
                  className="bg-surface-container-lowest border-2 border-secondary/40 rounded-xl p-6 shadow-sm space-y-4 animate-in fade-in"
                >
                  <h3 className="font-serif text-xl text-primary font-normal">
                    Add New Delivery Sanctuary
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Address Label (e.g. Home, Studio, Retreat)"
                      placeholder="e.g. Goa Villa"
                      value={newAddress.label}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, label: e.target.value })
                      }
                      required
                    />
                    <Input
                      label="Recipient Full Name"
                      placeholder="e.g. Radhika Sharma"
                      value={newAddress.name}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, name: e.target.value })
                      }
                      required
                    />
                    <div className="sm:col-span-2">
                      <Input
                        label="Full Address (House, Street, Area)"
                        placeholder="House / Flat No., Landmark"
                        value={newAddress.addressLine}
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            addressLine: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <Input
                      label="City"
                      placeholder="Jaipur"
                      value={newAddress.city}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, city: e.target.value })
                      }
                      required
                    />
                    <Input
                      label="Postal PIN Code"
                      placeholder="302001"
                      value={newAddress.pincode}
                      onChange={(e) =>
                        setNewAddress({
                          ...newAddress,
                          pincode: e.target.value,
                        })
                      }
                      required
                    />
                    <Input
                      label="Contact Phone"
                      placeholder="+91 98765 43210"
                      value={newAddress.phone}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, phone: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      type="button"
                      onClick={() => setIsAddingAddress(false)}
                    >
                      Cancel
                    </Button>
                    <Button variant="primary" size="sm" type="submit">
                      Save to Registry
                    </Button>
                  </div>
                </form>
              )}

              {/* Address Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {savedAddresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-6 shadow-sm space-y-4 relative flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-secondary text-[22px]">
                            {addr.type === "Residence" ? "villa" : "business"}
                          </span>
                          <span className="font-serif text-lg text-primary font-semibold">
                            {addr.label}
                          </span>
                        </div>
                        {addr.isDefault ? (
                          <span className="px-2.5 py-0.5 rounded bg-primary text-surface font-sans text-[10px] uppercase tracking-widest font-bold">
                            Default
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSetDefaultAddress(addr.id)}
                            className="font-sans text-xs text-secondary hover:text-primary underline underline-offset-2"
                          >
                            Set Default
                          </button>
                        )}
                      </div>

                      <div className="font-sans text-sm text-on-surface space-y-1">
                        <p className="font-bold text-primary">{addr.name}</p>
                        <p className="text-on-surface-variant leading-relaxed">
                          {addr.addressLine}
                        </p>
                        <p className="text-on-surface-variant">
                          {addr.city}, {addr.state} — {addr.pincode}
                        </p>
                        <p className="text-on-surface font-semibold pt-1 flex items-center gap-1.5 text-xs">
                          <span className="material-symbols-outlined text-[16px] text-outline">
                            call
                          </span>
                          {addr.phone}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-outline-variant/30 text-xs font-sans uppercase font-semibold">
                      <button
                        type="button"
                        onClick={() =>
                          showToast("Address editor ready for modification.")
                        }
                        className="text-secondary hover:text-primary transition-colors flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          edit
                        </span>
                        Edit
                      </button>
                      <span className="text-outline-variant">•</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteAddress(addr.id)}
                        className="text-error hover:opacity-80 transition-opacity flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          delete
                        </span>
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: REWARDS & POINTS */}
          {activeTab === "rewards" && (
            <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-outline-variant/30">
                <div>
                  <span className="font-sans text-xs uppercase tracking-widest text-secondary font-bold">
                    Weavers Guild Fellowship
                  </span>
                  <h2 className="font-serif text-3xl text-primary font-normal">
                    Atelier Loyalty & Rewards
                  </h2>
                </div>
                <div className="bg-surface-container p-4 rounded-xl text-center sm:text-right">
                  <div className="font-serif text-3xl text-secondary font-bold">
                    1,420
                  </div>
                  <span className="font-sans text-xs text-on-surface-variant">
                    Available Points (₹1,420 Value)
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-5 rounded-xl bg-surface-container-low border border-outline-variant/40 space-y-2">
                  <div className="w-10 h-10 rounded-full bg-primary text-surface flex items-center justify-center font-bold">
                    1
                  </div>
                  <h4 className="font-serif text-lg text-primary font-semibold">
                    Acquire & Earn
                  </h4>
                  <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                    Earn 1 Atelier Point for every ₹10 invested into ancestral
                    bedsheets, quilts, and towels.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-surface-container-low border border-outline-variant/40 space-y-2">
                  <div className="w-10 h-10 rounded-full bg-secondary text-surface flex items-center justify-center font-bold">
                    2
                  </div>
                  <h4 className="font-serif text-lg text-primary font-semibold">
                    Review Handloom Weaves
                  </h4>
                  <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                    Write verified reviews with photos of your sanctuary bed
                    setting to earn 200 points per review.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-surface-container-low border border-outline-variant/40 space-y-2">
                  <div className="w-10 h-10 rounded-full bg-tertiary text-surface flex items-center justify-center font-bold">
                    3
                  </div>
                  <h4 className="font-serif text-lg text-primary font-semibold">
                    Direct Point Redemption
                  </h4>
                  <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                    Redeem points at checkout with 1 point = ₹1 direct reduction
                    on your final invoice.
                  </p>
                </div>
              </div>

              <div className="bg-surface-container p-5 rounded-xl flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h4 className="font-serif text-base text-primary font-semibold">
                    Have an Atelier Gift Certificate or Referral Code?
                  </h4>
                  <p className="font-sans text-xs text-on-surface-variant">
                    Redeem gift vouchers gifted by friends or wedding registries.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Enter code e.g. PATRON500"
                    className="bg-surface px-3 py-2 rounded border border-outline-variant text-xs font-sans uppercase"
                  />
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() =>
                      showToast("Voucher code applied to loyalty balance.")
                    }
                  >
                    Redeem
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: TRADE & BULK QUOTES */}
          {activeTab === "trade" && (
            <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-outline-variant/30">
                <div>
                  <span className="font-sans text-xs uppercase tracking-widest text-secondary font-bold">
                    Hospitality & Trade Program
                  </span>
                  <h2 className="font-serif text-3xl text-primary font-normal">
                    Bulk Orders & Crest Monogramming
                  </h2>
                </div>
                <Link href="/bulk-enquiry">
                  <Button variant="primary" size="md">
                    Open Dedicated B2B Form →
                  </Button>
                </Link>
              </div>

              <p className="font-sans text-sm text-on-surface-variant leading-relaxed max-w-3xl">
                For heritage havelis, luxury boutique hotels, wellness resorts,
                and corporate gifting suites. We provide direct loom pricing
                with tiered discounts starting at 25% off for 10+ sets, custom
                thread counts (300TC to 800TC), and tone-on-tone emblem
                embroidery.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-surface-container text-center space-y-1">
                  <span className="font-serif text-2xl text-primary font-bold">
                    25% Off
                  </span>
                  <p className="font-sans text-xs text-on-surface-variant">
                    10 – 25 Suites
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-surface-container text-center space-y-1">
                  <span className="font-serif text-2xl text-primary font-bold">
                    35% Off
                  </span>
                  <p className="font-sans text-xs text-on-surface-variant">
                    26 – 50 Suites
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-surface-container text-center space-y-1">
                  <span className="font-serif text-2xl text-primary font-bold">
                    45% Off
                  </span>
                  <p className="font-sans text-xs text-on-surface-variant">
                    51+ Suites + Monogramming
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: ACCOUNT SETTINGS */}
          {activeTab === "settings" && (
            <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <span className="font-sans text-xs uppercase tracking-widest text-secondary font-bold">
                  Profile Registry
                </span>
                <h2 className="font-serif text-3xl text-primary font-normal">
                  Account Preferences
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
                <Input
                  label="Registered Name"
                  defaultValue={activeOrder?.customerName || "Radhika Sharma"}
                />
                <Input
                  label="Contact Phone"
                  defaultValue={activeOrder?.phone || "+91 98765 43210"}
                />
                <Input
                  label="Personal Email"
                  defaultValue={activeOrder?.email || "radhika.sharma@example.com"}
                />
                <Input
                  label="Preferred Language"
                  defaultValue="English / Hindi"
                />
              </div>

              <div className="pt-4 border-t border-outline-variant/30 space-y-3">
                <h4 className="font-serif text-lg text-primary font-semibold">
                  Notification Channels
                </h4>
                <div className="space-y-2 font-sans text-xs text-on-surface">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="accent-primary"
                    />
                    <span>
                      WhatsApp dispatch updates & courier OTP alerts (Recommended)
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="accent-primary"
                    />
                    <span>
                      Private invitations to limited seasonal vegetable dye releases
                    </span>
                  </label>
                </div>
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={() => showToast("Account settings updated successfully.")}
              >
                Save Preferences
              </Button>
            </div>
          )}

          {/* SECTION 4: DIRECT ATELIER CONCIERGE BANNER */}
          <section className="bg-primary text-surface rounded-2xl p-6 sm:p-8 lg:p-10 shadow-lg relative overflow-hidden">
            {/* Arch Background Decoration */}
            <div className="absolute -right-20 -bottom-20 w-80 h-80 opacity-10 pointer-events-none text-surface">
              <svg className="w-full h-full fill-current" viewBox="0 0 100 100">
                <path d="M50 0 C65 25 100 35 100 50 C100 65 65 75 50 100 C35 75 0 65 0 50 C0 35 35 25 50 0 Z"></path>
              </svg>
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-8 space-y-2">
                <div className="flex items-center gap-1.5 text-secondary-fixed font-sans text-xs uppercase tracking-widest font-semibold">
                  <span className="material-symbols-outlined text-[18px]">
                    handshake
                  </span>
                  <span>Direct Atelier Concierge</span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-medium">
                  Direct Line to Your Sanganer Weaver Guild
                </h3>
                <p className="font-sans text-xs sm:text-sm text-surface/80 max-w-2xl leading-relaxed">
                  Unsure about hand-washing natural indigo? Need custom drop
                  lengths for ancestral four-poster beds or festive dining
                  ensembles? Your dedicated textile steward is available daily
                  9:00 AM – 8:00 PM IST.
                </p>
              </div>

              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-center gap-2">
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-tertiary-fixed text-on-tertiary-fixed hover:bg-tertiary-fixed-dim px-5 py-3 rounded-lg font-sans text-xs uppercase tracking-wider font-bold shadow-md transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    chat
                  </span>
                  <span>WhatsApp Concierge: +91 98765 43210</span>
                </a>
                <span className="font-sans text-[11px] text-surface/70">
                  Average reply window: Under 8 minutes
                </span>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
