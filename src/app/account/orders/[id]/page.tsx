"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Header, Footer } from "@/components/layout";
import { Button, Badge, Modal } from "@/components/ui";
import { useStore, PlacedOrder } from "@/context/StoreContext";
import { formatPrice } from "@/lib/utils";
import { MOCK_CATALOG } from "@/lib/mockCatalog";

export default function OrderTrackingDetailPage() {
  const params = useParams();
  const orderId = (params?.id as string) || "KSM-84920";
  const { getOrderById, orders, showToast } = useStore();

  const [mapModalOpen, setMapModalOpen] = useState(false);

  // Look up order in context or fallback to demo order
  const existingOrder = getOrderById(orderId);
  const order: PlacedOrder =
    existingOrder ||
    orders[0] || {
      orderId: orderId,
      date: "14 Oct 2026",
      customerName: "Radhika Sharma",
      phone: "+91 98765 43210",
      email: "radhika.sharma@example.com",
      address: "B-42, Gulabi Bagh, Near Civil Lines",
      city: "Jaipur",
      state: "Rajasthan",
      pincode: "302006",
      items: [
        {
          cartItemId: "demo-item-1",
          product: MOCK_CATALOG[0],
          selectedSize: "Double / Queen (84x100\")",
          selectedSwatch: MOCK_CATALOG[0].swatches[0],
          quantity: 1,
        },
      ],
      subtotal: 2850,
      discount: 500,
      shippingFee: 0,
      total: 2350,
      paymentMode: "partial_cod",
      advancePaid: 500,
      balanceDue: 1850,
      status: "Shipped",
      trackingNumber: "SR-IN-889127394",
      estimatedDelivery: "18 Oct 2026",
    };

  const handleCopyAWB = () => {
    navigator.clipboard.writeText(order.trackingNumber);
    showToast(`AWB Tracking #${order.trackingNumber} copied.`);
  };

  const handleDownloadInvoice = () => {
    showToast(`Generating GST Tax Invoice for Consignment #${order.orderId}...`);
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      <Header />

      <main className="flex-1 w-full py-8 sm:py-12 px-4 sm:px-8 lg:px-12 max-w-[1240px] mx-auto space-y-8">
        {/* BREADCRUMB */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-on-surface-variant font-sans text-xs"
        >
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span className="opacity-40">/</span>
          <Link href="/account" className="hover:text-primary transition-colors">
            Patron Account
          </Link>
          <span className="opacity-40">/</span>
          <span className="text-primary font-bold">
            Consignment #{order.orderId}
          </span>
        </nav>

        {/* TOP STATUS HERO CARD */}
        <section className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-sm space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 border-b border-outline-variant/30 gap-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3 py-1 rounded bg-secondary text-surface font-sans text-xs uppercase tracking-widest font-bold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px] animate-pulse">
                    local_shipping
                  </span>
                  Stage 4 of 5 • Out for Delivery
                </span>
                <span className="text-on-surface-variant font-sans text-xs">
                  Ordered on {order.date}
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl text-primary font-normal tracking-tight">
                Consignment #{order.orderId}
              </h1>

              <div className="flex flex-wrap items-center gap-2 font-sans text-xs sm:text-sm text-on-surface-variant">
                <span>
                  Logistics Carrier:{" "}
                  <strong className="text-on-surface font-semibold">
                    Shiprocket Express / Blue Dart Artisan
                  </strong>
                </span>
                <span className="opacity-40">•</span>
                <div className="flex items-center gap-1 bg-surface-container px-2.5 py-1 rounded">
                  <span className="text-on-surface-variant">AWB:</span>
                  <span className="font-mono font-bold text-secondary">
                    {order.trackingNumber}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyAWB}
                    className="text-primary hover:text-secondary ml-1"
                    title="Copy AWB Number"
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      content_copy
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* FINANCIAL SETTLEMENT SNAPSHOT */}
            <div className="bg-surface-container-low border border-outline-variant/50 p-5 rounded-xl space-y-3 shrink-0 lg:min-w-[320px]">
              <div className="flex items-center justify-between pb-2 border-b border-outline-variant/30">
                <span className="font-sans text-xs text-on-surface-variant">
                  Total Consignment
                </span>
                <span className="font-serif text-2xl text-primary font-semibold">
                  {formatPrice(order.total)}
                </span>
              </div>

              {order.paymentMode === "partial_cod" ? (
                <div className="space-y-1.5 text-xs font-sans">
                  <div className="flex items-center justify-between text-tertiary font-bold">
                    <span>Advance Online Paid</span>
                    <span>✓ {formatPrice(order.advancePaid)}</span>
                  </div>
                  <div className="flex items-center justify-between text-primary font-bold text-sm bg-surface-container p-2 rounded">
                    <span>Doorstep Balance Due</span>
                    <span>{formatPrice(order.balanceDue)}</span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant leading-tight pt-1">
                    Payable via UPI QR code, Debit/Credit Card, or Cash to the
                    delivery agent after doorstep open-box inspection.
                  </p>
                </div>
              ) : (
                <div className="text-xs font-sans text-tertiary font-bold">
                  ✓ 100% Pre-paid via Online Payment
                </div>
              )}
            </div>
          </div>

          {/* EXPECTED DELIVERY BANNER */}
          <div className="bg-surface-container rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-secondary shrink-0">
                <span className="material-symbols-outlined text-[22px]">
                  schedule
                </span>
              </div>
              <div>
                <h3 className="font-serif text-lg text-primary font-semibold">
                  Estimated Delivery: {order.estimatedDelivery} by 4:00 PM IST
                </h3>
                <p className="font-sans text-xs text-on-surface-variant">
                  Delivery Van en route in {order.city} • Open-box doorstep
                  verification guaranteed
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setMapModalOpen(true)}
              className="bg-surface text-primary border border-outline-variant/60 hover:bg-surface-container-high px-4 py-2 rounded-lg font-sans text-xs uppercase tracking-wider font-bold flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
            >
              <span className="material-symbols-outlined text-[16px]">
                map
              </span>
              <span>View Route Map</span>
            </button>
          </div>

          {/* 5-STEP CRAFT TRACKING JOURNEY STEPPER */}
          <div className="pt-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-sans text-xs uppercase tracking-wider font-bold text-primary">
                Loom-to-Doorstep Journey Timeline
              </h2>
              <span className="font-sans text-xs text-secondary font-semibold">
                Live GPS Sync Active
              </span>
            </div>

            {/* Desktop Stepper */}
            <div className="hidden lg:grid grid-cols-5 gap-4 relative">
              {/* Connector line behind steps */}
              <div className="absolute top-6 left-10 right-10 h-0.5 bg-outline-variant/50 -z-0">
                <div className="h-full bg-secondary w-3/4"></div>
              </div>

              {/* Step 1 */}
              <div className="flex flex-col items-start gap-2 relative z-10">
                <div className="w-12 h-12 rounded-full bg-tertiary text-surface flex items-center justify-center font-bold shadow-sm">
                  <span className="material-symbols-outlined text-[20px]">
                    check
                  </span>
                </div>
                <div className="space-y-0.5">
                  <span className="font-sans text-[10px] text-tertiary font-bold uppercase tracking-wider">
                    14 Oct • 10:30 AM
                  </span>
                  <h4 className="font-serif text-sm font-semibold text-primary">
                    Loom Reservation
                  </h4>
                  <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                    Advance deposit confirmed. Master weaver loom batch
                    allocated.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-start gap-2 relative z-10">
                <div className="w-12 h-12 rounded-full bg-tertiary text-surface flex items-center justify-center font-bold shadow-sm">
                  <span className="material-symbols-outlined text-[20px]">
                    check
                  </span>
                </div>
                <div className="space-y-0.5">
                  <span className="font-sans text-[10px] text-tertiary font-bold uppercase tracking-wider">
                    15 Oct • 03:15 PM
                  </span>
                  <h4 className="font-serif text-sm font-semibold text-primary">
                    Hand-Block Print & QC
                  </h4>
                  <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                    Sanganer collective passed rigorous 400TC shrinkage & rub
                    test.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-start gap-2 relative z-10">
                <div className="w-12 h-12 rounded-full bg-tertiary text-surface flex items-center justify-center font-bold shadow-sm">
                  <span className="material-symbols-outlined text-[20px]">
                    check
                  </span>
                </div>
                <div className="space-y-0.5">
                  <span className="font-sans text-[10px] text-tertiary font-bold uppercase tracking-wider">
                    16 Oct • 11:00 AM
                  </span>
                  <h4 className="font-serif text-sm font-semibold text-primary">
                    Jaipur Haveli Hub
                  </h4>
                  <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                    Packaged in unbleached mulmul bags and dispatched for express
                    air transit.
                  </p>
                </div>
              </div>

              {/* Step 4 (Active) */}
              <div className="flex flex-col items-start gap-2 relative z-10">
                <div className="w-12 h-12 rounded-full bg-secondary text-surface flex items-center justify-center font-bold shadow-md ring-4 ring-secondary/20 animate-pulse">
                  <span className="material-symbols-outlined text-[20px]">
                    local_shipping
                  </span>
                </div>
                <div className="space-y-0.5">
                  <span className="font-sans text-[10px] text-secondary font-bold uppercase tracking-wider">
                    Today • 08:30 AM
                  </span>
                  <h4 className="font-serif text-sm font-semibold text-primary">
                    Out for Delivery
                  </h4>
                  <p className="font-sans text-xs text-on-surface font-medium leading-relaxed">
                    Courier rider en route with parcel. Doorstep inspection OTP
                    ready.
                  </p>
                </div>
              </div>

              {/* Step 5 */}
              <div className="flex flex-col items-start gap-2 relative z-10 opacity-50">
                <div className="w-12 h-12 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[20px]">
                    inventory_2
                  </span>
                </div>
                <div className="space-y-0.5">
                  <span className="font-sans text-[10px] text-on-surface-variant uppercase tracking-wider">
                    Expected 18 Oct
                  </span>
                  <h4 className="font-serif text-sm font-semibold text-on-surface">
                    Artisanal Unboxing
                  </h4>
                  <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                    Unpack hand-loomed comfort with complimentary dried lavender
                    sachet.
                  </p>
                </div>
              </div>
            </div>

            {/* Mobile Vertical Stepper */}
            <div className="lg:hidden space-y-6 pl-4 border-l-2 border-outline-variant/60 ml-3">
              <div className="relative pl-6">
                <div className="absolute -left-[27px] top-0 w-6 h-6 rounded-full bg-tertiary text-surface flex items-center justify-center text-xs">
                  ✓
                </div>
                <span className="font-sans text-[10px] text-tertiary font-bold uppercase">
                  14 Oct • 10:30 AM
                </span>
                <h4 className="font-serif text-base font-semibold text-primary">
                  Loom Reservation Confirmed
                </h4>
                <p className="font-sans text-xs text-on-surface-variant">
                  Advance payment received, weavers allocated.
                </p>
              </div>

              <div className="relative pl-6">
                <div className="absolute -left-[27px] top-0 w-6 h-6 rounded-full bg-tertiary text-surface flex items-center justify-center text-xs">
                  ✓
                </div>
                <span className="font-sans text-[10px] text-tertiary font-bold uppercase">
                  15 Oct • 03:15 PM
                </span>
                <h4 className="font-serif text-base font-semibold text-primary">
                  Hand-Block QC Passed
                </h4>
                <p className="font-sans text-xs text-on-surface-variant">
                  Natural dye washfastness and dimensions verified.
                </p>
              </div>

              <div className="relative pl-6">
                <div className="absolute -left-[27px] top-0 w-6 h-6 rounded-full bg-tertiary text-surface flex items-center justify-center text-xs">
                  ✓
                </div>
                <span className="font-sans text-[10px] text-tertiary font-bold uppercase">
                  16 Oct • 11:00 AM
                </span>
                <h4 className="font-serif text-base font-semibold text-primary">
                  Jaipur Central Hub Dispatched
                </h4>
                <p className="font-sans text-xs text-on-surface-variant">
                  Air express consignment handed to delivery partner.
                </p>
              </div>

              <div className="relative pl-6">
                <div className="absolute -left-[27px] top-0 w-6 h-6 rounded-full bg-secondary text-surface flex items-center justify-center text-xs ring-4 ring-secondary/20 animate-pulse">
                  ●
                </div>
                <span className="font-sans text-[10px] text-secondary font-bold uppercase">
                  Today • 08:30 AM
                </span>
                <h4 className="font-serif text-base font-semibold text-primary">
                  Out for Delivery
                </h4>
                <p className="font-sans text-xs text-on-surface font-medium">
                  {order.paymentMode === "partial_cod"
                    ? `Balance ${formatPrice(order.balanceDue)} payable upon doorstep inspection.`
                    : "Delivering to your doorstep today."}
                </p>
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS TOOLBAR */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-outline-variant/30 bg-surface-container-low p-4 rounded-xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <Button
                variant="primary"
                size="sm"
                onClick={handleDownloadInvoice}
              >
                <span className="material-symbols-outlined text-[16px] mr-1">
                  receipt_long
                </span>
                Download Tax Invoice (GST)
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMapModalOpen(true)}
              >
                <span className="material-symbols-outlined text-[16px] mr-1">
                  navigation
                </span>
                Live Courier Map
              </Button>
            </div>

            <a
              href={`https://wa.me/919876543210?text=${encodeURIComponent(
                `Namaste Kusumika Atelier. I would like assistance with my Consignment #${order.orderId}.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary hover:text-primary font-sans text-xs uppercase tracking-wider font-bold flex items-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">
                support_agent
              </span>
              <span>Need Assistance? WhatsApp Concierge</span>
            </a>
          </div>
        </section>

        {/* TWO COLUMN GRID: CONSIGNMENT ITEMS & DELIVERY DETAILS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: CONSIGNMENT ARTICLES (7 cols) */}
          <div className="lg:col-span-7 bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-outline-variant/30">
              <h3 className="font-serif text-xl text-primary font-normal">
                Articles in Consignment ({order.items.length})
              </h3>
              <span className="font-sans text-xs text-on-surface-variant">
                100% GOTS Organic Cotton
              </span>
            </div>

            <div className="space-y-4">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-4 pb-4 border-b border-outline-variant/20 last:border-b-0 last:pb-0"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 bg-surface-container relative border border-outline-variant/40">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-serif text-base text-primary font-medium">
                        {item.product.title}
                      </h4>
                      <p className="font-sans text-xs text-on-surface-variant mt-0.5">
                        {item.selectedSize || "Standard Size"}
                        {item.selectedSwatch && ` • ${item.selectedSwatch.name}`}
                      </p>
                      <span className="font-sans text-xs text-secondary font-semibold">
                        Quantity: {item.quantity}
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-serif text-base sm:text-lg text-primary font-semibold">
                      {formatPrice(item.product.price * item.quantity)}
                    </div>
                    <span className="font-sans text-[11px] text-tertiary">
                      Pure Handloom
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: DESTINATION & DOORSTEP VERIFICATION GUARANTEE (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Address Card */}
            <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-primary font-serif text-lg font-medium pb-2 border-b border-outline-variant/30">
                <span className="material-symbols-outlined text-secondary text-[20px]">
                  home_pin
                </span>
                <span>Delivery Haven Destination</span>
              </div>

              <div className="font-sans text-sm text-on-surface space-y-1">
                <p className="font-bold text-primary">{order.customerName}</p>
                <p className="text-on-surface-variant leading-relaxed">
                  {order.address}
                </p>
                <p className="text-on-surface-variant">
                  {order.city}, {order.state} — {order.pincode}
                </p>
                <p className="text-on-surface font-semibold pt-1 flex items-center gap-1.5 text-xs">
                  <span className="material-symbols-outlined text-[16px] text-outline">
                    call
                  </span>
                  {order.phone}
                </p>
                <p className="text-on-surface-variant flex items-center gap-1.5 text-xs">
                  <span className="material-symbols-outlined text-[16px] text-outline">
                    mail
                  </span>
                  {order.email}
                </p>
              </div>
            </div>

            {/* Doorstep Inspection Guarantee Card */}
            <div className="bg-surface-container-low border border-outline-variant/60 rounded-2xl p-6 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined text-secondary text-[22px]">
                  verified_user
                </span>
                <h4 className="font-serif text-base font-semibold">
                  Doorstep Open-Box Inspection Guarantee
                </h4>
              </div>
              <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                We believe in uncompromising quality. Our courier agent will
                patiently wait while you unseal the tamper-evident box, feel
                the weave softness, and inspect block-print edges before sharing
                the delivery OTP or paying the balance amount.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL: LIVE ROUTE SIMULATION MAP */}
      <Modal
        isOpen={mapModalOpen}
        onClose={() => setMapModalOpen(false)}
        title="Live Consignment Radar"
        maxWidth="md"
      >
        <div className="space-y-4 py-2">
          <div className="h-64 rounded-xl bg-surface-container relative overflow-hidden flex flex-col items-center justify-center p-6 text-center border border-outline-variant/40">
            {/* Atmospheric Map Graphic Placeholder */}
            <div className="w-16 h-16 rounded-full bg-secondary/15 flex items-center justify-center text-secondary mb-3 animate-pulse">
              <span className="material-symbols-outlined text-[32px]">
                local_shipping
              </span>
            </div>
            <h4 className="font-serif text-lg text-primary font-semibold">
              Consignment #{order.orderId}
            </h4>
            <p className="font-sans text-xs text-on-surface-variant max-w-xs mt-1">
              Delivery van currently 4.2 km from destination ({order.city},{" "}
              {order.pincode}). Rider: Mahesh K. (Contact via OTP upon arrival).
            </p>
            <div className="mt-4 px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-sans text-[11px] font-bold">
              ETA: Approximately 45 minutes
            </div>
          </div>

          <div className="flex items-center justify-end">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setMapModalOpen(false)}
            >
              Close Radar
            </Button>
          </div>
        </div>
      </Modal>

      <Footer />
    </div>
  );
}
