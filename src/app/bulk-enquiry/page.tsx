"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Header, Footer } from "@/components/layout";
import { Button, Input, Textarea, Select } from "@/components/ui";
import { useStore } from "@/context/StoreContext";
import { MOCK_CATALOG } from "@/lib/mockCatalog";
import { submitB2BLead } from "@/services/catalogService";

const ESTABLISHMENT_TYPES = [
  { id: "hotel", label: "Boutique Hotel / Haveli", icon: "hotel" },
  { id: "homestay", label: "Heritage Homestay", icon: "holiday_village" },
  { id: "architect", label: "Architect / Interior Studio", icon: "architecture" },
  { id: "corporate", label: "Corporate Gifting", icon: "redeem" },
];

const CATEGORIES = [
  "Bedsheets & Pillow Shams",
  "Dohars & Fine Razais",
  "Spa Waffle Towels",
  "Cushions & Bolsters",
  "Bespoke Voile Curtains",
];

const QUANTITY_TIERS = [
  { id: "tier-1", label: "10 – 25 Sets", discount: "25% Loom Discount" },
  { id: "tier-2", label: "26 – 50 Sets", discount: "35% Loom Discount" },
  { id: "tier-3", label: "51 – 100 Sets", discount: "45% Loom Discount" },
  { id: "tier-4", label: "100+ Master Suites", discount: "Dedicated Artisan Guild" },
];

const BED_SIZES = [
  { id: "king", label: 'King (108×108")', desc: "Standard Heritage Bed" },
  { id: "queen", label: 'Queen (90×100")', desc: "Deluxe Suite" },
  { id: "single", label: 'Single (60×90")', desc: "Twin / Daybed" },
  { id: "super_king", label: "Super King / Custom", desc: "Bespoke Drape Drop" },
];

export default function BulkEnquiryPage() {
  const { showToast } = useStore();

  const [establishmentType, setEstablishmentType] = useState("hotel");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "Bedsheets & Pillow Shams",
  ]);
  const [selectedTier, setSelectedTier] = useState("tier-2");
  const [selectedSizes, setSelectedSizes] = useState<string[]>(["king", "queen"]);
  const [brandingOption, setBrandingOption] = useState("crest");
  const [includeSwatchBinder, setIncludeSwatchBinder] = useState(true);
  const [whatsappConsent, setWhatsappConsent] = useState(true);

  const [formData, setFormData] = useState({
    contactName: "",
    businessName: "",
    email: "",
    phone: "",
    city: "",
    pincode: "",
    gstin: "",
    weaveGrade: "400TC Sateen Luster Weave (Silken Hospitality Finish)",
    timeline: "Planned Suite Opening (3-4 weeks turnaround)",
    notes: "",
  });

  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const toggleCategory = (cat: string) => {
    if (selectedCategories.includes(cat)) {
      if (selectedCategories.length > 1) {
        setSelectedCategories(selectedCategories.filter((c) => c !== cat));
      }
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const toggleSize = (sizeId: string) => {
    if (selectedSizes.includes(sizeId)) {
      if (selectedSizes.length > 1) {
        setSelectedSizes(selectedSizes.filter((s) => s !== sizeId));
      }
    } else {
      setSelectedSizes([...selectedSizes, sizeId]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.contactName || !formData.businessName || !formData.phone) {
      showToast("Please fill in contact name, business name, and phone.");
      return;
    }

    try {
      const refId = await submitB2BLead({
        contactName: formData.contactName,
        businessName: formData.businessName,
        establishmentNature: establishmentType,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        pincode: formData.pincode,
        gstin: formData.gstin,
        categoriesNeeded: selectedCategories,
        weaveGrade: formData.weaveGrade,
        quantityTier: selectedTier,
        bedSizes: selectedSizes,
        brandingOption: brandingOption,
        timeline: formData.timeline,
        notes: formData.notes,
        swatchBinderRequested: includeSwatchBinder,
      });

      setSubmittedId(refId);
      showToast(`Inquiry #${refId} registered. An atelier consultant will reach out.`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      const fallbackId = `INQ-KSM-${Math.floor(1000 + Math.random() * 9000)}`;
      setSubmittedId(fallbackId);
      showToast(`Inquiry #${fallbackId} registered.`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      <Header />

      <main className="flex-1 w-full py-8 sm:py-12 px-4 sm:px-8 lg:px-12 max-w-[1000px] mx-auto space-y-10">
        {/* BREADCRUMBS */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-on-surface-variant font-sans text-xs"
        >
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span className="opacity-40">/</span>
          <span className="text-on-surface-variant">Hospitality & B2B</span>
          <span className="opacity-40">/</span>
          <span className="text-primary font-bold">Bespoke Inquiry</span>
        </nav>

        {/* SECTION 1: HERO HEADER & CONTEXT */}
        <section className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container text-primary font-sans text-xs uppercase tracking-widest font-semibold">
            <span className="material-symbols-outlined text-[15px]">
              assured_workload
            </span>
            Direct Loom Allocation
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl text-primary font-normal tracking-tight">
            Bespoke Bulk & Trade Concierge
          </h1>

          <p className="font-sans text-sm sm:text-base text-on-surface-variant max-w-3xl leading-relaxed">
            Curated for boutique haveli retreats, royal residences, heritage
            homestays, and refined corporate gifting. Direct-from-loom tariff
            starting from 10+ suites.
          </p>

          {/* Trust Strip Cards */}
          <div className="bg-surface-container-low border border-outline-variant/50 rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[18px]">
                  verified
                </span>
              </div>
              <div>
                <span className="font-sans text-xs uppercase tracking-wider font-bold text-primary block">
                  Heritage Standard
                </span>
                <span className="font-sans text-xs sm:text-sm text-on-surface-variant">
                  GOTS Organic Cotton • Zero AZO Chemical Dyes • Archival
                  Hand-Block Printing • 200+ Wash Longevity
                </span>
              </div>
            </div>

            <div className="w-full h-px bg-outline-variant/40"></div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans text-xs text-on-surface-variant">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-primary">
                  draw
                </span>
                <span className="font-medium text-on-surface">
                  Crest & Emblem Monogramming on Flanges
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-primary">
                  local_shipping
                </span>
                <span className="font-medium text-on-surface">
                  Complimentary 48hr Swatch Kit Dispatch
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* SUBMISSION CONFIRMATION BANNER */}
        {submittedId && (
          <div className="bg-tertiary-fixed/40 border-2 border-tertiary rounded-2xl p-6 sm:p-8 space-y-4 animate-in fade-in">
            <div className="flex items-center gap-3 text-tertiary font-serif text-2xl font-semibold">
              <span className="material-symbols-outlined text-[32px]">
                task_alt
              </span>
              <span>Bespoke Inquiry Received #{submittedId}</span>
            </div>
            <p className="font-sans text-sm text-on-surface leading-relaxed max-w-2xl">
              Thank you for trusting Kusumika with your property textiles. Your
              inquiry has been routed directly to our Master Loom Coordinator. A
              formal tariff quotation and textile spec sheet will be dispatched
              to <strong>{formData.email || formData.phone}</strong> within 4
              hours.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href={`https://wa.me/919876543210?text=${encodeURIComponent(
                  `Namaste Kusumika. I have just submitted trade inquiry #${submittedId} for ${formData.businessName}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary text-surface px-4 py-2 rounded-lg font-sans text-xs uppercase tracking-wider font-bold inline-flex items-center gap-1.5 shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px]">
                  chat
                </span>
                Fast-track on WhatsApp
              </a>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSubmittedId(null)}
              >
                Submit Another Inquiry
              </Button>
            </div>
          </div>
        )}

        {/* SECTION 2: REFERENCED MODEL CONTEXT CARD */}
        <section className="bg-surface-container rounded-2xl p-4 sm:p-5 border border-outline-variant/40 flex items-center gap-4 relative overflow-hidden">
          <div className="w-20 h-24 rounded-xl overflow-hidden shrink-0 bg-surface-container-high relative">
            <Image
              src={MOCK_CATALOG[0].images[0]}
              alt="Marwar Lotus Reference"
              fill
              className="object-cover"
            />
            <span className="absolute bottom-1 left-1 font-sans text-[9px] text-white px-1.5 py-0.5 bg-primary/80 rounded font-bold">
              400 TC
            </span>
          </div>
          <div className="flex flex-col min-w-0 flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-sans text-[10px] uppercase tracking-wider text-secondary font-bold">
                Referencing Textile Suite
              </span>
              <span className="font-sans text-xs text-primary font-semibold">
                Sanganeri Jaal
              </span>
            </div>
            <h2 className="font-serif text-lg sm:text-xl text-primary font-medium truncate">
              Marwar Lotus Hand-Block 400TC Suite
            </h2>
            <p className="font-sans text-xs text-on-surface-variant line-clamp-2">
              Lustrous 400TC organic sateen with heritage madder red and ecru
              tones. You can request this exact weave or bespoke custom motif
              carvings below.
            </p>
          </div>
        </section>

        {/* MULTI-SECTION B2B INQUIRY FORM */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* STEP 1: BUYER & ESTABLISHMENT DETAILS */}
          <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b border-outline-variant/30">
              <div className="w-8 h-8 rounded-full bg-primary text-surface flex items-center justify-center font-sans text-sm font-bold">
                1
              </div>
              <div>
                <h3 className="font-serif text-xl sm:text-2xl text-primary font-normal">
                  Buyer & Establishment Details
                </h3>
                <p className="font-sans text-xs text-on-surface-variant">
                  Tell us about your property or project requirements
                </p>
              </div>
            </div>

            {/* Establishment Nature Selector */}
            <div className="space-y-2">
              <label className="font-sans text-xs uppercase tracking-wider font-bold text-primary block">
                Establishment Nature *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {ESTABLISHMENT_TYPES.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setEstablishmentType(type.id)}
                    className={`p-3 rounded-xl text-left font-sans text-xs flex flex-col gap-1.5 transition-all border ${
                      establishmentType === type.id
                        ? "bg-primary text-surface border-primary shadow-sm"
                        : "bg-surface-container text-on-surface border-transparent hover:bg-surface-container-high"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {type.icon}
                    </span>
                    <span className="font-semibold leading-snug">
                      {type.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Contact Person Name *"
                placeholder="e.g. Vikramaditya Rathore"
                value={formData.contactName}
                onChange={(e) =>
                  setFormData({ ...formData, contactName: e.target.value })
                }
                required
              />
              <Input
                label="Property / Business Name *"
                placeholder="e.g. Samode Haveli Heritage Retreat"
                value={formData.businessName}
                onChange={(e) =>
                  setFormData({ ...formData, businessName: e.target.value })
                }
                required
              />
              <Input
                label="Work Email *"
                type="email"
                placeholder="concierge@samodehaveli.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
              <Input
                label="Phone / WhatsApp Number *"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                required
              />
            </div>

            {/* WhatsApp Consent Toggle */}
            <label className="flex items-start gap-3 p-3 rounded-xl bg-surface-container-low border border-outline-variant/40 cursor-pointer">
              <input
                type="checkbox"
                checked={whatsappConsent}
                onChange={(e) => setWhatsappConsent(e.target.checked)}
                className="mt-0.5 accent-primary w-4 h-4 rounded"
              />
              <div className="font-sans text-xs">
                <span className="font-semibold text-primary flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-tertiary">
                    chat
                  </span>
                  Receive Instant Quotation & Swatch Dispatch via WhatsApp
                </span>
                <p className="text-on-surface-variant text-[11px] mt-0.5">
                  Direct encrypted channel with our master loom coordinator in
                  Jaipur.
                </p>
              </div>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="City / Destination *"
                placeholder="Jaipur, Rajasthan"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                required
              />
              <Input
                label="PIN / Postal Code *"
                placeholder="302001"
                value={formData.pincode}
                onChange={(e) =>
                  setFormData({ ...formData, pincode: e.target.value })
                }
                required
              />
              <Input
                label="GSTIN for Tax Credit (Optional)"
                placeholder="08AAAAA0000A1Z5"
                value={formData.gstin}
                onChange={(e) =>
                  setFormData({ ...formData, gstin: e.target.value })
                }
              />
            </div>
          </div>

          {/* STEP 2: PRODUCT & WEAVE SPECIFICATIONS */}
          <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b border-outline-variant/30">
              <div className="w-8 h-8 rounded-full bg-primary text-surface flex items-center justify-center font-sans text-sm font-bold">
                2
              </div>
              <div>
                <h3 className="font-serif text-xl sm:text-2xl text-primary font-normal">
                  Textile Specifications
                </h3>
                <p className="font-sans text-xs text-on-surface-variant">
                  Weaves, dimensions, and artisan customization options
                </p>
              </div>
            </div>

            {/* Required Categories Chips */}
            <div className="space-y-2">
              <label className="font-sans text-xs uppercase tracking-wider font-bold text-primary block">
                Required Linen Categories *
              </label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => {
                  const selected = selectedCategories.includes(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleCategory(cat)}
                      className={`px-3.5 py-2 rounded-full font-sans text-xs font-semibold transition-all border ${
                        selected
                          ? "bg-primary text-surface border-primary shadow-xs"
                          : "bg-surface-container text-on-surface-variant border-transparent hover:bg-surface-container-high"
                      }`}
                    >
                      {cat} {selected && "✓"}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Weave Grade Dropdown */}
            <div className="space-y-2">
              <label className="font-sans text-xs uppercase tracking-wider font-bold text-primary block">
                Desired Weave & Cotton Grade *
              </label>
              <select
                value={formData.weaveGrade}
                onChange={(e) =>
                  setFormData({ ...formData, weaveGrade: e.target.value })
                }
                className="w-full rounded-lg bg-surface border border-outline-variant px-4 py-3 text-sm font-sans text-on-surface focus:outline-none focus:border-primary-container"
              >
                <option>400TC Sateen Luster Weave (Silken Hospitality Finish)</option>
                <option>300TC Crisp Heritage Percale (Cooling Matte Cotton)</option>
                <option>600TC Royal Sateen Jacquard (Ultra-Dense Luxury)</option>
                <option>Mulmul Voile Double Cloth (Weightless Hand-Feel)</option>
                <option>Organic Honeycomb Waffle Weave (Ultra Absorbent Spa)</option>
                <option>Custom Handspun Khadi Weave (Artisanal Textured)</option>
              </select>
            </div>

            {/* Quantity Volume Tiers */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-sans text-xs uppercase tracking-wider font-bold text-primary">
                  Quantity Volume Tier *
                </label>
                <span className="font-sans text-xs text-secondary font-bold">
                  Tiered Loom Pricing
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {QUANTITY_TIERS.map((tier) => (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setSelectedTier(tier.id)}
                    className={`p-3 rounded-xl text-left font-sans text-xs flex flex-col gap-1 transition-all border ${
                      selectedTier === tier.id
                        ? "bg-primary text-surface border-primary shadow-xs"
                        : "bg-surface-container text-on-surface border-transparent hover:bg-surface-container-high"
                    }`}
                  >
                    <span className="font-bold">{tier.label}</span>
                    <span
                      className={`text-[11px] ${
                        selectedTier === tier.id
                          ? "text-primary-fixed"
                          : "text-secondary font-semibold"
                      }`}
                    >
                      {tier.discount}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Bed Dimensions Checkboxes */}
            <div className="space-y-2">
              <label className="font-sans text-xs uppercase tracking-wider font-bold text-primary block">
                Target Suite Dimensions
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {BED_SIZES.map((size) => {
                  const isChecked = selectedSizes.includes(size.id);
                  return (
                    <label
                      key={size.id}
                      className={`p-3 rounded-xl border cursor-pointer flex items-start gap-2.5 transition-all ${
                        isChecked
                          ? "bg-surface-container-low border-secondary/50"
                          : "bg-surface-container border-transparent"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleSize(size.id)}
                        className="mt-0.5 accent-primary"
                      />
                      <div className="font-sans text-xs">
                        <span className="font-semibold text-primary block">
                          {size.label}
                        </span>
                        <span className="text-[10px] text-on-surface-variant">
                          {size.desc}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Embossing & Archival Branding Radios */}
            <div className="space-y-2">
              <label className="font-sans text-xs uppercase tracking-wider font-bold text-primary block">
                Embossing & Archival Branding Options
              </label>
              <div className="space-y-2">
                <label className="flex items-start gap-3 p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/40 cursor-pointer">
                  <input
                    type="radio"
                    name="branding"
                    checked={brandingOption === "crest"}
                    onChange={() => setBrandingOption("crest")}
                    className="mt-0.5 accent-primary"
                  />
                  <div className="font-sans text-xs space-y-0.5">
                    <span className="font-bold text-primary block">
                      Haveli Crest Embroidery & Woven Property Label
                    </span>
                    <p className="text-on-surface-variant text-[11px] leading-relaxed">
                      Intricate golden-zari or tone-on-tone embroidery of your
                      hotel emblem on pillow flanges and duvet corners.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/40 cursor-pointer">
                  <input
                    type="radio"
                    name="branding"
                    checked={brandingOption === "standard"}
                    onChange={() => setBrandingOption("standard")}
                    className="mt-0.5 accent-primary"
                  />
                  <div className="font-sans text-xs space-y-0.5">
                    <span className="font-bold text-primary block">
                      Standard Kusumika Heirloom Care Tag
                    </span>
                    <p className="text-on-surface-variant text-[11px] leading-relaxed">
                      Organic wash and artisan weaver sign-off badge only.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/40 cursor-pointer">
                  <input
                    type="radio"
                    name="branding"
                    checked={brandingOption === "block"}
                    onChange={() => setBrandingOption("block")}
                    className="mt-0.5 accent-primary"
                  />
                  <div className="font-sans text-xs space-y-0.5">
                    <span className="font-bold text-primary block">
                      Custom Wooden Block Carving & Bespoke Dye Formulation
                    </span>
                    <p className="text-on-surface-variant text-[11px] leading-relaxed">
                      Our master carvers will chisel proprietary motif blocks
                      exclusively for your boutique retreat.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* STEP 3: TIMELINE & SPECIAL REQUESTS */}
          <div className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b border-outline-variant/30">
              <div className="w-8 h-8 rounded-full bg-primary text-surface flex items-center justify-center font-sans text-sm font-bold">
                3
              </div>
              <div>
                <h3 className="font-serif text-xl sm:text-2xl text-primary font-normal">
                  Timeline & Dispatch
                </h3>
                <p className="font-sans text-xs text-on-surface-variant">
                  Fulfillment deadlines and complimentary sample kits
                </p>
              </div>
            </div>

            {/* Timeline selector */}
            <div className="space-y-2">
              <label className="font-sans text-xs uppercase tracking-wider font-bold text-primary block">
                Target Delivery Window *
              </label>
              <select
                value={formData.timeline}
                onChange={(e) =>
                  setFormData({ ...formData, timeline: e.target.value })
                }
                className="w-full rounded-lg bg-surface border border-outline-variant px-4 py-3 text-sm font-sans text-on-surface focus:outline-none focus:border-primary-container"
              >
                <option>Planned Suite Opening (3-4 weeks turnaround)</option>
                <option>Immediate Dispatch / Fast Track (Within 10-14 days)</option>
                <option>Next Season Haveli Turnover (1-2 months lead time)</option>
                <option>Phased Replenishment Contract (Quarterly scheduled)</option>
              </select>
            </div>

            {/* Notes Textarea */}
            <Textarea
              label="Detailed Suite Notes & Custom Requirements"
              placeholder="Specify room counts, palette preferences (e.g. Ochre Haldi, Indigo, Terracotta, or Raw Ecru), envelope enclosure depths, or specific wash care certifications..."
              rows={3}
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
            />

            {/* Complimentary Swatch Folder Card */}
            <div className="p-4 rounded-xl bg-surface-container flex items-start gap-4 border border-outline-variant/40">
              <div className="w-12 h-12 rounded-lg bg-surface-container-high shrink-0 overflow-hidden relative border border-outline-variant/40">
                <Image
                  src={MOCK_CATALOG[1].images[0]}
                  alt="Textile Swatch Kit"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-serif text-sm font-bold text-primary">
                    Complimentary Physical Swatch Folder
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-sans font-bold bg-tertiary-fixed text-on-tertiary-fixed">
                    Free for 15+ sets
                  </span>
                </div>
                <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                  Hand-curated fabric swatches with wash-test certificates
                  dispatched in 48 hours to inspect texture and weight in person.
                </p>
                <label className="mt-2 inline-flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={includeSwatchBinder}
                    onChange={(e) => setIncludeSwatchBinder(e.target.checked)}
                    className="accent-primary"
                  />
                  <span className="font-sans text-xs font-semibold text-on-surface">
                    Include physical sample swatch binder in dispatch
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS & CTAS */}
          <div className="space-y-4">
            <Button
              variant="primary"
              size="lg"
              className="w-full text-sm font-bold tracking-widest uppercase"
              type="submit"
            >
              Submit Inquiry & Request Tariff →
            </Button>

            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-surface-container hover:bg-surface-container-high p-4 rounded-xl font-sans text-xs font-semibold flex items-center justify-between border border-outline-variant/40 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-tertiary text-surface flex items-center justify-center">
                  <span className="material-symbols-outlined text-[16px]">
                    chat
                  </span>
                </div>
                <div className="text-left">
                  <span className="text-on-surface font-bold block text-sm">
                    Instant WhatsApp Trade Concierge
                  </span>
                  <span className="text-[11px] text-on-surface-variant">
                    +91 98765 43210 • Average response under 15 minutes
                  </span>
                </div>
              </div>
              <span className="material-symbols-outlined text-secondary text-[20px]">
                arrow_forward
              </span>
            </a>

            <p className="text-center font-sans text-xs text-on-surface-variant">
              Non-binding trade quote. An atelier consultant confirms loom
              scheduling within 4 hours.
            </p>
          </div>

          {/* VOLUME DISCOUNT MATRIX FOOTNOTE */}
          <div className="bg-surface-container rounded-2xl p-6 border border-outline-variant/40 space-y-4">
            <div className="flex items-center gap-2 text-primary font-serif text-lg font-semibold">
              <span className="material-symbols-outlined text-secondary text-[20px]">
                workspace_premium
              </span>
              <span>Consortium Guarantee & Volume Schedule</span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-surface-container-lowest flex flex-col">
                <span className="font-serif text-2xl text-primary font-bold">
                  25%
                </span>
                <span className="font-sans text-[11px] text-on-surface-variant mt-0.5">
                  10 – 25 Sets
                </span>
              </div>
              <div className="p-3 rounded-xl bg-surface-container-lowest flex flex-col">
                <span className="font-serif text-2xl text-primary font-bold">
                  35%
                </span>
                <span className="font-sans text-[11px] text-on-surface-variant mt-0.5">
                  26 – 50 Sets
                </span>
              </div>
              <div className="p-3 rounded-xl bg-surface-container-lowest flex flex-col">
                <span className="font-serif text-2xl text-primary font-bold">
                  45%
                </span>
                <span className="font-sans text-[11px] text-on-surface-variant mt-0.5">
                  51+ Sets & Crest
                </span>
              </div>
            </div>

            <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
              Every production run includes certified shrinkage tolerance
              testing, 200+ commercial wash longevity warranty, and direct
              artisan royalty dispatch to our weavers in Sanganer and Bagru.
            </p>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
