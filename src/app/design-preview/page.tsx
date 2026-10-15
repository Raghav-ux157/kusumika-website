"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Button,
  Input,
  Textarea,
  Select,
  Checkbox,
  Radio,
  Badge,
  Card,
  EditorialCard,
  Modal,
  Drawer,
} from "@/components/ui";
import {
  BrandLogo,
  ArchImageFrame,
  LotusDivider,
  ArtisanProvenanceStamp,
  WeaveMeter,
} from "@/components/brand";
import {
  ProductCard,
  PriceDisplay,
  RatingStars,
  PartialCodBadge,
} from "@/components/commerce";
import { Header, Footer } from "@/components/layout";
import { MOCK_PRODUCTS } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export default function DesignPreviewPage() {
  // Interactive preview states
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedThreadCount, setSelectedThreadCount] = useState(400);
  const [paymentOption, setPaymentOption] = useState("partial-cod");
  const [checkboxState, setCheckboxState] = useState(true);
  const [textInputValue, setTextInputValue] = useState("Jaipur Sanganeri Edit");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const copyToClipboard = (hex: string, name: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedToken(name);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const COLOR_SWATCHES = [
    {
      category: "Surfaces & Canvas",
      colors: [
        { name: "surface (Soft Ivory)", hex: "#FFF8F6", token: "bg-surface", textDark: true },
        { name: "surface-container (Warm Cream)", hex: "#FBEAE5", token: "bg-surface-container", textDark: true },
        { name: "surface-container-high", hex: "#F5E5E0", token: "bg-surface-container-high", textDark: true },
        { name: "surface-container-low", hex: "#FFF1EC", token: "bg-surface-container-low", textDark: true },
        { name: "surface-container-lowest", hex: "#FFFFFF", token: "bg-surface-container-lowest", textDark: true },
        { name: "surface-dim", hex: "#E7D7D2", token: "bg-surface-dim", textDark: true },
      ],
    },
    {
      category: "Brand Primary & Secondary",
      colors: [
        { name: "primary (Deepest Maroon)", hex: "#5C181A", token: "bg-primary", textDark: false },
        { name: "primary-container (Deep Maroon)", hex: "#7A2E2E", token: "bg-primary-container", textDark: false },
        { name: "secondary (Baked Terracotta)", hex: "#994534", token: "bg-secondary", textDark: false },
        { name: "brand-terracotta", hex: "#B85C4A", token: "bg-brand-terracotta", textDark: false },
        { name: "secondary-container", hex: "#FE947E", token: "bg-secondary-container", textDark: true },
        { name: "primary-fixed", hex: "#FFDAD8", token: "bg-primary-fixed", textDark: true },
      ],
    },
    {
      category: "Botanical Olive & Luxury Gold",
      colors: [
        { name: "tertiary (Muted Olive Leaf)", hex: "#616136", token: "bg-tertiary", textDark: false },
        { name: "brand-olive", hex: "#6B6B3F", token: "bg-brand-olive", textDark: false },
        { name: "tertiary-container", hex: "#AFAE7C", token: "bg-tertiary-container", textDark: true },
        { name: "accent-gold (Antique Zari)", hex: "#C9A24D", token: "bg-brand-gold", textDark: true },
        { name: "tertiary-fixed", hex: "#E7E5AF", token: "bg-tertiary-fixed", textDark: true },
      ],
    },
    {
      category: "Ink & Architectural Outlines",
      colors: [
        { name: "on-surface (Deep Charcoal Bark)", hex: "#221A17", token: "bg-on-surface", textDark: false },
        { name: "on-surface-variant (Desert Sand)", hex: "#544241", token: "bg-on-surface-variant", textDark: false },
        { name: "outline", hex: "#877271", token: "bg-outline", textDark: false },
        { name: "outline-variant (Lime Mortar)", hex: "#DAC1BF", token: "bg-outline-variant", textDark: true },
        { name: "border-subtle", hex: "#E3D3C1", token: "bg-[#e3d3c1]", textDark: true },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-primary-container text-surface px-5 py-3 rounded-lg shadow-elevation-2 font-sans text-xs uppercase tracking-wider flex items-center gap-2 border border-outline-variant/50 animate-in fade-in slide-in-from-bottom-4">
          <span className="material-symbols-outlined text-[18px]">verified</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Header Preview */}
      <Header
        onOpenCart={() => setIsDrawerOpen(true)}
        onOpenSearch={() => setIsModalOpen(true)}
        onOpenWishlist={() => showToast("Navigating to Wishlist...")}
      />

      {/* Subnav Index Ribbon */}
      <div className="sticky top-20 z-30 bg-surface-container border-b border-outline-variant/40 px-4 sm:px-8 py-3 backdrop-blur shadow-sm">
        <div className="max-w-[1360px] mx-auto flex items-center justify-between gap-4 overflow-x-auto text-xs font-sans whitespace-nowrap">
          <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-primary">
            <span className="material-symbols-outlined text-[16px]">palette</span>
            <span>Atelier Heritage Design System</span>
          </div>
          <div className="flex items-center gap-4 text-on-surface-variant">
            <a href="#colors" className="hover:text-primary transition-colors">1. Palette Swatches</a>
            <span>•</span>
            <a href="#typography" className="hover:text-primary transition-colors">2. Typography</a>
            <span>•</span>
            <a href="#buttons" className="hover:text-primary transition-colors">3. Buttons</a>
            <span>•</span>
            <a href="#forms" className="hover:text-primary transition-colors">4. Form Elements</a>
            <span>•</span>
            <a href="#heritage" className="hover:text-primary transition-colors">5. Heritage Motifs</a>
            <span>•</span>
            <a href="#commerce" className="hover:text-primary transition-colors">6. Commerce Cards</a>
            <span>•</span>
            <a href="#dialogs" className="hover:text-primary transition-colors">7. Modal & Drawer</a>
          </div>
        </div>
      </div>

      <main className="max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-12 py-12 flex flex-col gap-20">
        {/* HERO TITLE BANNER */}
        <div className="flex flex-col gap-4 border-b border-outline-variant/50 pb-8">
          <div className="flex items-center gap-2 text-secondary font-sans text-xs font-bold uppercase tracking-widest">
            <span className="material-symbols-outlined text-[16px]">verified</span>
            <span>Phase 0 • Component Library & Design Tokens</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <h1 className="font-serif text-4xl sm:text-5xl text-primary font-normal">
                Atelier Heritage Design System
              </h1>
              <p className="font-serif text-xl italic text-secondary">
                "Soft like Silk, Feels like a Hug"
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/">
                <Button variant="outline" size="sm">
                  View Home Screen
                </Button>
              </Link>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsDrawerOpen(true)}
              >
                Test Cart Drawer
              </Button>
            </div>
          </div>
          <p className="font-sans text-sm text-on-surface-variant leading-relaxed max-w-3xl">
            This live preview renders every approved design token, typography weight, button variant, form input, signature Jharokha arch frame, lotus divider, thread count weave meter, and product card extracted from Stitch project <code>18093954457664837866</code>.
          </p>
        </div>

        {/* SECTION 1: COLOR PALETTE */}
        <section id="colors" className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-outline-variant/40 pb-3">
            <div className="space-y-1">
              <span className="font-sans text-xs uppercase tracking-widest text-secondary font-bold">
                Design Tokens
              </span>
              <h2 className="font-serif text-3xl text-primary">
                1. Natural Pigment Color Tokens
              </h2>
            </div>
            <span className="text-xs font-sans text-outline">
              Click swatch to copy hex code
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {COLOR_SWATCHES.map((group) => (
              <div
                key={group.category}
                className="p-5 rounded-xl bg-surface-container-low border border-outline-variant/50 flex flex-col gap-3"
              >
                <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-primary">
                  {group.category}
                </h3>
                <div className="flex flex-col gap-2">
                  {group.colors.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => copyToClipboard(c.hex, c.name)}
                      className="group flex items-center justify-between p-2 rounded-lg border border-outline-variant/40 hover:border-primary transition-all text-left"
                      style={{ backgroundColor: c.hex }}
                    >
                      <div className="flex flex-col">
                        <span
                          className={cn(
                            "font-sans text-xs font-bold leading-tight",
                            c.textDark ? "text-[#221a17]" : "text-[#ffffff]"
                          )}
                        >
                          {c.name}
                        </span>
                        <span
                          className={cn(
                            "font-mono text-[10px] opacity-80",
                            c.textDark ? "text-[#221a17]" : "text-[#ffffff]"
                          )}
                        >
                          {c.hex}
                        </span>
                      </div>
                      <span
                        className={cn(
                          "font-sans text-[10px] font-bold uppercase px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity",
                          c.textDark
                            ? "bg-black/10 text-[#221a17]"
                            : "bg-white/20 text-[#ffffff]"
                        )}
                      >
                        {copiedToken === c.name ? "Copied!" : "Copy"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <LotusDivider label="Typography" lineWidth="sm" />

        {/* SECTION 2: TYPOGRAPHY */}
        <section id="typography" className="flex flex-col gap-6">
          <div className="space-y-1 border-b border-outline-variant/40 pb-3">
            <span className="font-sans text-xs uppercase tracking-widest text-secondary font-bold">
              Literary Serifs & Humanist Grotesque
            </span>
            <h2 className="font-serif text-3xl text-primary">
              2. Typographic Scale & Editorial Hierarchy
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* EB Garamond Display & Headlines */}
            <div className="lg:col-span-7 p-6 rounded-xl bg-surface-container-low border border-outline-variant/50 space-y-6">
              <span className="font-sans text-xs uppercase tracking-widest text-primary font-bold">
                Headlines & Editorial: EB Garamond
              </span>

              <div className="space-y-4">
                <div className="border-b border-outline-variant/30 pb-3">
                  <span className="text-[10px] font-sans text-outline uppercase tracking-wider block">
                    display-lg (3.5rem / 56px • line-height 4rem)
                  </span>
                  <p className="font-serif text-4xl sm:text-5xl lg:text-6xl text-primary leading-tight font-normal">
                    Soft like Silk,<br />
                    <span className="italic text-secondary">Feels like a Hug</span>
                  </p>
                </div>

                <div className="border-b border-outline-variant/30 pb-3">
                  <span className="text-[10px] font-sans text-outline uppercase tracking-wider block">
                    headline-xl (2.5rem / 40px)
                  </span>
                  <p className="font-serif text-3xl sm:text-4xl text-primary font-normal">
                    Hand-Loomed Bedsheets & Pure Cottons
                  </p>
                </div>

                <div className="border-b border-outline-variant/30 pb-3">
                  <span className="text-[10px] font-sans text-outline uppercase tracking-wider block">
                    headline-lg (2.0rem / 32px)
                  </span>
                  <p className="font-serif text-2xl sm:text-3xl text-primary font-medium">
                    The Marwar Lotus 400TC Heirloom Edition
                  </p>
                </div>

                <div className="border-b border-outline-variant/30 pb-3">
                  <span className="text-[10px] font-sans text-outline uppercase tracking-wider block">
                    headline-md (1.5rem / 24px)
                  </span>
                  <p className="font-serif text-xl sm:text-2xl text-primary font-medium">
                    Pure Vegetable Wash & Sanganeri Block Prints
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-sans text-outline uppercase tracking-wider block">
                    headline-sm (1.25rem / 20px)
                  </span>
                  <p className="font-serif text-lg sm:text-xl text-primary font-semibold">
                    Includes 2 Matching King Flanged Pillowcases
                  </p>
                </div>
              </div>
            </div>

            {/* Manrope Body & Labels */}
            <div className="lg:col-span-5 p-6 rounded-xl bg-surface-container-low border border-outline-variant/50 space-y-6">
              <span className="font-sans text-xs uppercase tracking-widest text-primary font-bold">
                Body & Specifications: Manrope
              </span>

              <div className="space-y-4 font-sans">
                <div className="border-b border-outline-variant/30 pb-3">
                  <span className="text-[10px] text-outline uppercase tracking-wider block">
                    body-lg (1.125rem / 18px)
                  </span>
                  <p className="text-base sm:text-lg text-on-surface-variant leading-relaxed">
                    Immerse your sanctuary in pure 400-thread-count organic cotton and mulberry silk weaves.
                  </p>
                </div>

                <div className="border-b border-outline-variant/30 pb-3">
                  <span className="text-[10px] text-outline uppercase tracking-wider block">
                    body-md (1rem / 16px)
                  </span>
                  <p className="text-sm sm:text-base text-on-surface leading-normal">
                    Woven with centuries-old Sanganeri botanicals, breathable thread counts, and gentle vegetable washes.
                  </p>
                </div>

                <div className="border-b border-outline-variant/30 pb-3">
                  <span className="text-[10px] text-outline uppercase tracking-wider block">
                    body-sm (0.875rem / 14px)
                  </span>
                  <p className="text-xs sm:text-sm text-on-surface-variant leading-normal">
                    Double/Queen: 90 x 108 inches | Machine wash cold on gentle cycle.
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-[10px] text-outline uppercase tracking-wider block">
                    stamped textile tags (label-lg, md, sm)
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-secondary bg-surface-container px-2.5 py-1 rounded">
                      LABEL-LG • 100% GOTS COTTON
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-primary bg-surface-container-high px-2 py-0.5 rounded">
                      LABEL-MD • BAGRU LOOM
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-tertiary bg-surface-container-highest px-1.5 py-0.5 rounded">
                      LABEL-SM • PARTIAL COD
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <LotusDivider label="Action Controls" lineWidth="sm" />

        {/* SECTION 3: BUTTONS & INTERACTIVE CONTROLS */}
        <section id="buttons" className="flex flex-col gap-6">
          <div className="space-y-1 border-b border-outline-variant/40 pb-3">
            <span className="font-sans text-xs uppercase tracking-widest text-secondary font-bold">
              Action Elements
            </span>
            <h2 className="font-serif text-3xl text-primary">
              3. Button Variants, Sizes & States
            </h2>
          </div>

          <div className="p-6 rounded-xl bg-surface-container-low border border-outline-variant/50 flex flex-col gap-8">
            {/* Variants row */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-sans font-bold uppercase tracking-wider text-outline">
                Variants Matrix
              </span>
              <div className="flex flex-wrap items-center gap-4">
                <Button variant="primary" onClick={() => showToast("Clicked Primary Button")}>
                  Primary Maroon
                </Button>
                <Button variant="secondary" onClick={() => showToast("Clicked Terracotta Button")}>
                  Baked Terracotta
                </Button>
                <Button variant="outline" onClick={() => showToast("Clicked Atelier Outline Button")}>
                  Atelier Outline
                </Button>
                <Button variant="gold" onClick={() => showToast("Clicked Antique Zari Gold Button")}>
                  Antique Gold
                </Button>
                <Button variant="ghost" onClick={() => showToast("Clicked Ghost Button")}>
                  Ghost Link
                </Button>
                <Button variant="link" onClick={() => showToast("Clicked Underline Link")}>
                  Text Underline
                </Button>
              </div>
            </div>

            {/* Sizes row */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-sans font-bold uppercase tracking-wider text-outline">
                Size Scale (Small, Medium, Large)
              </span>
              <div className="flex flex-wrap items-center gap-4">
                <Button variant="primary" size="sm">
                  Small CTA
                </Button>
                <Button variant="primary" size="md">
                  Medium CTA (Default)
                </Button>
                <Button variant="primary" size="lg">
                  Large Hero CTA
                </Button>
              </div>
            </div>

            {/* Icons & Loading States */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-sans font-bold uppercase tracking-wider text-outline">
                Icons, Loaders & Disabled States
              </span>
              <div className="flex flex-wrap items-center gap-4">
                <Button
                  variant="primary"
                  leftIcon={<span className="material-symbols-outlined text-[18px]">shopping_bag</span>}
                >
                  With Left Icon
                </Button>
                <Button
                  variant="secondary"
                  rightIcon={<span className="material-symbols-outlined text-[18px]">arrow_forward</span>}
                >
                  With Right Icon
                </Button>
                <Button variant="primary" isLoading={true}>
                  Saving Details
                </Button>
                <Button variant="outline" disabled={true}>
                  Disabled Action
                </Button>
              </div>
            </div>
          </div>
        </section>

        <LotusDivider label="Form Elements" lineWidth="sm" />

        {/* SECTION 4: FORM CONTROLS */}
        <section id="forms" className="flex flex-col gap-6">
          <div className="space-y-1 border-b border-outline-variant/40 pb-3">
            <span className="font-sans text-xs uppercase tracking-widest text-secondary font-bold">
              Inputs & Selectors
            </span>
            <h2 className="font-serif text-3xl text-primary">
              4. Tactile Heritage Form Elements
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 rounded-xl bg-surface-container-low border border-outline-variant/50">
            {/* Standard Text Input */}
            <Input
              label="Customer Full Name"
              placeholder="e.g. Maharani Gayatri Devi"
              defaultValue="Radhika Sharma"
              helperText="As printed on your shipping invoice."
              required
            />

            {/* Input with Icon */}
            <Input
              label="Contact WhatsApp Phone"
              placeholder="+91 98765 43210"
              leftIcon={<span className="material-symbols-outlined text-[18px]">phone</span>}
              helperText="Order confirmations and tracking dispatch via WhatsApp."
              required
            />

            {/* Error State Input */}
            <Input
              label="Pincode / Postal Code"
              defaultValue="30200"
              error="Indian pincodes must be exactly 6 numeric digits."
              required
            />

            {/* Select Dropdown */}
            <Select
              label="Select Bed Linen Size"
              options={[
                { label: "Double / Queen Set (84 x 100 inches)", value: "queen" },
                { label: "King Palatial Set (108 x 108 inches)", value: "king" },
                { label: "Single / Twin Set (60 x 90 inches)", value: "single" },
                { label: "Fitted Elastic Corner Set", value: "fitted" },
              ]}
              helperText="All sets include 2 matching pillowcases."
            />

            {/* Checkboxes */}
            <div className="flex flex-col gap-3">
              <span className="font-sans text-xs uppercase tracking-wider font-semibold text-on-surface">
                Craft Preferences
              </span>
              <div className="space-y-2">
                <Checkbox
                  label="Include Festive Gift Box"
                  sublabel="Complimentary wooden inlay gift box on orders above ₹2,999."
                  checked={checkboxState}
                  onChange={(e) => setCheckboxState(e.target.checked)}
                />
                <Checkbox
                  label="Request GST Business Invoice"
                  sublabel="For bulk hospitality & corporate tax credits."
                />
                <Checkbox
                  label="Sample Swatch Booklet (Out of Stock)"
                  disabled={true}
                />
              </div>
            </div>

            {/* Payment Radio Group */}
            <div className="flex flex-col gap-3">
              <span className="font-sans text-xs uppercase tracking-wider font-semibold text-on-surface">
                Payment Option (Partial COD)
              </span>
              <div className="space-y-2">
                <Radio
                  name="payment"
                  label="Partial Cash on Delivery (COD)"
                  sublabel="Pay ₹500 advance now, balance on doorstep delivery."
                  badge="Popular"
                  checked={paymentOption === "partial-cod"}
                  onChange={() => setPaymentOption("partial-cod")}
                />
                <Radio
                  name="payment"
                  label="Prepaid Online (UPI / Card / NetBanking)"
                  sublabel="Instant 5% discount applied at checkout."
                  checked={paymentOption === "prepaid"}
                  onChange={() => setPaymentOption("prepaid")}
                />
              </div>
            </div>

            {/* Textarea */}
            <div className="lg:col-span-3">
              <Textarea
                label="Custom Embroidery & Special Instructions"
                placeholder="Specify monogramming initials, delivery landmark, or bespoke size requirements..."
                defaultValue="Please package in festive mulberry tissue with a handwritten artisan note for an anniversary gift."
                rows={3}
              />
            </div>
          </div>
        </section>

        <LotusDivider label="Heritage Elements" lineWidth="sm" />

        {/* SECTION 5: SIGNATURE HERITAGE MOTIFS */}
        <section id="heritage" className="flex flex-col gap-6">
          <div className="space-y-1 border-b border-outline-variant/40 pb-3">
            <span className="font-sans text-xs uppercase tracking-widest text-secondary font-bold">
              Brand Identity Elements
            </span>
            <h2 className="font-serif text-3xl text-primary">
              5. Jharokha Arch Frames, Seals & Weave Meters
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Jharokha Arch Frame Demo */}
            <div className="lg:col-span-6 flex flex-col items-center">
              <span className="text-xs font-sans font-bold uppercase tracking-wider text-outline mb-3">
                Hero Display Arch Silhouette (rounded-t-[280px])
              </span>
              <ArchImageFrame
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRMIchdugj20pPdd_lSPpXZWh0B-iMTnXxw7Pnoo9XIzrypUR09G8ecgnRktlUqm6CduhjxafsAorjHSwOYkAcTtqw0ZA37zU8ihpsMySVuFciOsdnkgm4TabUJucGKvYlJiroBceAlhqFKrUdj8Aq9mvAUNRIhDFRRN-THsieH-YlTYH_1Ibp9mZZ5iWJRfYMWp-A2a3Ah3AJVdz-NsYrRhfxZwqepS5DSGHbUqoMtzznMbCjZG9M4g"
                alt="Rajasthani bedroom"
                variant="hero"
                aspectRatio="aspect-[4/3]"
                badgeText="Bagru Loom"
              />
            </div>

            {/* Weave Meter & Seals */}
            <div className="lg:col-span-6 flex flex-col gap-6">
              <EditorialCard>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-xs uppercase tracking-wider text-secondary font-bold">
                      Interactive Thread Count Meter
                    </span>
                    <div className="flex items-center gap-1.5">
                      {[300, 400, 600, 800].map((tc) => (
                        <button
                          key={tc}
                          type="button"
                          onClick={() => setSelectedThreadCount(tc)}
                          className={cn(
                            "px-2 py-0.5 rounded text-[11px] font-sans font-bold transition-all",
                            selectedThreadCount === tc
                              ? "bg-primary text-surface"
                              : "bg-surface-container text-outline hover:text-primary"
                          )}
                        >
                          {tc} TC
                        </button>
                      ))}
                    </div>
                  </div>

                  <WeaveMeter threadCount={selectedThreadCount} />

                  <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                    Higher thread count in single-ply cotton creates an extraordinarily supple, smooth feel without compromising breathability in warm tropical climates.
                  </p>
                </div>
              </EditorialCard>

              {/* Provenance Seals Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ArtisanProvenanceStamp
                  variant="horizontal"
                  village="Sanganer Collective"
                  sealText="Hand-carved teakwood block print certification."
                />
                <ArtisanProvenanceStamp
                  variant="badge"
                  village="Bagru Guild"
                  craft="Natural Dabu Mud-Resist"
                />
              </div>
            </div>
          </div>
        </section>

        <LotusDivider label="Commerce Cards" lineWidth="sm" />

        {/* SECTION 6: COMMERCE COMPONENTS */}
        <section id="commerce" className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-outline-variant/40 pb-3">
            <div className="space-y-1">
              <span className="font-sans text-xs uppercase tracking-widest text-secondary font-bold">
                E-Commerce Catalog Components
              </span>
              <h2 className="font-serif text-3xl text-primary">
                6. Product Cards, Partial COD Badges & Pricing
              </h2>
            </div>
            <span className="text-xs font-sans text-outline">
              Interactive: hover over cards to see quick add, test heart wishlist toggle & swatch colors
            </span>
          </div>

          {/* Pricing & Badges Preview Strip */}
          <div className="p-4 rounded-xl bg-surface-container flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="font-sans text-xs font-bold uppercase tracking-wider text-outline">
                Price Display:
              </span>
              <PriceDisplay price={2850} compareAtPrice={3500} size="md" />
              <span className="text-outline">|</span>
              <PartialCodBadge minAdvanceAmount={500} variant="pill" />
            </div>

            <div className="flex items-center gap-3">
              <span className="font-sans text-xs font-bold uppercase tracking-wider text-outline">
                Ratings:
              </span>
              <RatingStars rating={4.9} reviewCount={184} size="md" />
            </div>
          </div>

          {/* 3-Column Product Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {MOCK_PRODUCTS.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onQuickAdd={(p) => showToast(`Added "${p.title}" to Cart!`)}
                onWishlistToggle={(p, wish) =>
                  showToast(
                    wish
                      ? `Added "${p.title}" to Wishlist!`
                      : `Removed "${p.title}" from Wishlist.`
                  )
                }
              />
            ))}
          </div>
        </section>

        <LotusDivider label="Dialogs & Overlays" lineWidth="sm" />

        {/* SECTION 7: MODAL & DRAWER PREVIEWS */}
        <section id="dialogs" className="flex flex-col gap-6 pb-12">
          <div className="space-y-1 border-b border-outline-variant/40 pb-3">
            <span className="font-sans text-xs uppercase tracking-widest text-secondary font-bold">
              Overlays & Drawers
            </span>
            <h2 className="font-serif text-3xl text-primary">
              7. Slide-Over Cart Drawer & Accessible Dialog Modal
            </h2>
          </div>

          <div className="p-6 rounded-xl bg-surface-container-low border border-outline-variant/50 flex flex-wrap items-center gap-4">
            <Button
              variant="primary"
              onClick={() => setIsModalOpen(true)}
              leftIcon={<span className="material-symbols-outlined text-[18px]">open_in_new</span>}
            >
              Open Test Modal
            </Button>
            <Button
              variant="secondary"
              onClick={() => setIsDrawerOpen(true)}
              leftIcon={<span className="material-symbols-outlined text-[18px]">shopping_bag</span>}
            >
              Open Slide-Over Cart Drawer
            </Button>
          </div>
        </section>
      </main>

      {/* TEST MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Artisan Provenance & Craft Pledge"
        subtitle="100% GOTS Pure Cotton & Sanganeri Hand-Block Tradition"
        maxWidth="md"
      >
        <div className="space-y-4">
          <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
            Every Kusumika textile is block printed by generational master artisans in Bagru and Sanganer, Rajasthan. Each motif is carved by hand onto seasoned teak blocks and stamped with vegetable dyes.
          </p>

          <PartialCodBadge minAdvanceAmount={500} variant="banner" />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant/40">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setIsModalOpen(false);
                showToast("Confirmed artisan pledge!");
              }}
            >
              Acknowledge & Continue
            </Button>
          </div>
        </div>
      </Modal>

      {/* TEST SLIDE-OVER DRAWER (CART PREVIEW) */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        position="right"
        width="md"
        title="Your Sanctuary Cart"
        subtitle="2 Heirloom Items • Free Pan-India Shipping"
      >
        <div className="flex flex-col h-full justify-between gap-6">
          <div className="flex flex-col gap-4 divide-y divide-outline-variant/30">
            {MOCK_PRODUCTS.slice(0, 2).map((item) => (
              <div key={item.id} className="pt-3 first:pt-0 flex gap-3">
                <div className="w-16 h-20 rounded bg-surface-dim relative overflow-hidden shrink-0 border border-outline-variant/40">
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col flex-1 justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-serif text-sm font-medium text-primary line-clamp-1">
                      {item.title}
                    </h4>
                    <p className="font-sans text-[11px] text-outline">
                      Queen Set • Terracotta
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-xs font-bold text-on-surface">
                      ₹{item.price.toLocaleString("en-IN")}
                    </span>
                    <span className="text-xs font-sans text-outline">Qty: 1</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Drawer Footer Checkout Summary */}
          <div className="space-y-4 pt-4 border-t border-outline-variant/50">
            <div className="space-y-2 text-xs font-sans">
              <div className="flex justify-between text-on-surface-variant">
                <span>Subtotal</span>
                <span>₹6,050</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Festive Shipping</span>
                <span className="text-tertiary font-bold">Complimentary</span>
              </div>
              <div className="flex justify-between text-base font-serif font-bold text-primary pt-2 border-t border-outline-variant/30">
                <span>Total Due</span>
                <span>₹6,050</span>
              </div>
            </div>

            <PartialCodBadge minAdvanceAmount={500} variant="compact" />

            <div className="flex flex-col gap-2">
              <Button
                variant="primary"
                fullWidth={true}
                onClick={() => {
                  setIsDrawerOpen(false);
                  showToast("Proceeding to Partial COD Checkout...");
                }}
              >
                Checkout (Pay ₹500 or Full)
              </Button>
              <Button
                variant="ghost"
                size="sm"
                fullWidth={true}
                onClick={() => setIsDrawerOpen(false)}
              >
                Continue Browsing
              </Button>
            </div>
          </div>
        </div>
      </Drawer>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
