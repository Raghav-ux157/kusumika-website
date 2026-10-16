import React from "react";
import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import { LotusDivider } from "@/components/brand";
import { FaqJsonLd } from "@/components/seo/JsonLd";

export const metadata = {
  title: "Shipping & Partial COD Policy | Kusumika Luxury Home Textiles",
  description:
    "Learn about Kusumika's Pan-India insured shipping, BlueDart courier partnership, Doorstep Open-Box Inspection Guarantee, and Partial Cash on Delivery (COD) terms.",
};

const SHIPPING_FAQS = [
  {
    question: "How does Kusumika's Partial Cash on Delivery (COD) work?",
    answer:
      "For eligible bedsheets and home textiles, patrons settle a nominal advance deposit online (typically ₹500 or 20% for orders above ₹2,500) to lock their artisan loom allocation. The remaining balance is payable directly at your doorstep to the courier executive via Cash or dynamic UPI QR code.",
  },
  {
    question: "What is the Doorstep Open-Box Inspection Guarantee?",
    answer:
      "We believe in uncompromising artisanal transparency. Our BlueDart delivery rider will wait while you inspect the intact heirloom wax seal and feel the 400TC weave softness before you hand over the balance or share the delivery OTP.",
  },
  {
    question: "What are the shipping charges and delivery timelines?",
    answer:
      "We offer complimentary insured shipping across all 28 Indian states. Orders are hand-inspected in Jaipur within 24–48 hours and typically arrive within 2–4 business days in major metros and 3–6 business days across other regions.",
  },
  {
    question: "How do I track my active consignment?",
    answer:
      "Once dispatched via Shiprocket/BlueDart, an Air Waybill (AWB) tracking number and live radar link are sent to your WhatsApp and email. You can also track your parcel anytime at kusumika.com/track-order.",
  },
];

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      <FaqJsonLd questions={SHIPPING_FAQS} />
      <Header />

      <main className="flex-1 w-full py-12 sm:py-16 px-4 sm:px-8 lg:px-12 max-w-[960px] mx-auto space-y-10">
        {/* HERO TITLE */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-secondary font-sans text-xs uppercase tracking-widest font-semibold">
            <span className="material-symbols-outlined text-[16px]">local_shipping</span>
            <span>Artisanal Logistics Charter</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl text-primary font-normal tracking-tight">
            Shipping & Partial COD Policy
          </h1>
          <p className="font-sans text-sm sm:text-base text-on-surface-variant max-w-xl mx-auto leading-relaxed">
            From our ancestral handlooms in Sanganer and Bagru directly to your sanctuary with unhurried care and door-to-door insurance.
          </p>
        </div>

        {/* SECTION 1: PAN-INDIA FULFILLMENT */}
        <section className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 sm:p-10 shadow-sm space-y-6">
          <div className="flex items-center gap-3 text-primary border-b border-outline-variant/30 pb-4">
            <span className="material-symbols-outlined text-secondary text-[26px]">flight_takeoff</span>
            <h2 className="font-serif text-xl sm:text-2xl font-bold">Pan-India Courier Network</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/40 space-y-1.5">
              <span className="font-bold uppercase tracking-wider text-primary text-[11px]">Dispatch Atelier</span>
              <p className="text-on-surface-variant">Jaipur Central Depot, Bagru-Sanganer Artisanal Belt, Rajasthan (Pincode: 302029).</p>
            </div>
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/40 space-y-1.5">
              <span className="font-bold uppercase tracking-wider text-primary text-[11px]">Primary Logistics Partner</span>
              <p className="text-on-surface-variant">BlueDart Air Express via Shiprocket API with full real-time GPS checkpoint telemetry.</p>
            </div>
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/40 space-y-1.5">
              <span className="font-bold uppercase tracking-wider text-primary text-[11px]">Shipping Tariffs</span>
              <p className="text-secondary font-bold">100% Complimentary Pan-India Delivery on all standard and bespoke orders.</p>
            </div>
          </div>
        </section>

        {/* SECTION 2: THE PARTIAL COD REVOLUTION */}
        <section className="bg-surface-container border border-outline-variant/60 rounded-2xl p-6 sm:p-10 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-outline-variant/40 pb-4">
            <div className="flex items-center gap-3 text-primary">
              <span className="material-symbols-outlined text-secondary text-[26px]">payments</span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold">Partial Cash on Delivery (COD) Terms</h2>
            </div>
            <span className="px-3 py-1 rounded-full bg-secondary text-surface text-xs font-bold uppercase tracking-wider">
              Patron-First Security
            </span>
          </div>

          <div className="space-y-4 font-sans text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            <p>
              We understand that luxury hand-loomed textiles are deeply tactile. To provide total confidence without demanding full upfront payment, Kusumika introduced <strong>Partial Cash on Delivery</strong>:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-on-surface">
              <li>
                <strong>Advance Online Deposit:</strong> A nominal advance (₹500 for orders up to ₹2,500; 20% rounded to ₹50 for larger orders, capped at ₹2,000) is paid via Razorpay (UPI, Credit/Debit Cards, Netbanking).
              </li>
              <li>
                <strong>Loom Batch Locking:</strong> This advance reserves the slow-weave artisan capacity and registers your consignment with our Jaipur packaging guild.
              </li>
              <li>
                <strong>Doorstep Balance Collection:</strong> The exact remaining balance is clearly printed on your Tax Invoice. Upon delivery, pay the BlueDart rider via <strong>Cash or dynamic UPI QR scan</strong>.
              </li>
              <li>
                <strong>Zero Surcharge:</strong> Unlike mass-market marketplaces, Kusumika levies <strong>zero additional COD handling convenience fees</strong>.
              </li>
            </ul>
          </div>

          {/* Doorstep Inspection Callout */}
          <div className="p-4 rounded-xl bg-surface-container-highest border-l-4 border-secondary space-y-1.5">
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span>The Artisan Wax Seal Guarantee</span>
            </div>
            <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
              Every parcel leaves our atelier with an intact red shellac wax seal stamped with our lotus crest. You are entitled to inspect this seal and touch the organic cotton weave before sharing the delivery verification OTP.
            </p>
          </div>
        </section>

        {/* SECTION 3: FAQS ACCORDION / LIST */}
        <section className="space-y-4">
          <div className="text-center space-y-1">
            <h2 className="font-serif text-2xl text-primary font-bold">Frequently Asked Questions</h2>
            <p className="font-sans text-xs text-outline">Everything you need to know about delivery and care</p>
          </div>

          <div className="space-y-3 font-sans">
            {SHIPPING_FAQS.map((faq, i) => (
              <div key={i} className="p-5 rounded-xl bg-surface-container-lowest border border-outline-variant/50 space-y-2">
                <h3 className="font-serif text-base font-semibold text-primary">{faq.question}</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* HELP & CONCIERGE BANNER */}
        <div className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <h4 className="font-serif text-lg font-bold text-primary">Need an Urgent Festive or Suite Delivery?</h4>
            <p className="font-sans text-xs text-outline">Our Jaipur concierge can arrange same-day priority air cargo.</p>
          </div>
          <Link
            href="/track-order"
            className="px-5 py-2.5 rounded-lg bg-primary text-on-primary text-xs font-bold uppercase tracking-wider shrink-0 hover:opacity-90 transition-opacity"
          >
            Track Active Parcel
          </Link>
        </div>

        <LotusDivider label="Kusumika Atelier" lineWidth="sm" />
      </main>

      <Footer />
    </div>
  );
}
