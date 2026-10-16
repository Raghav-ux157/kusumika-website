import React from "react";
import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import { LotusDivider } from "@/components/brand";
import { FaqJsonLd } from "@/components/seo/JsonLd";

export const metadata = {
  title: "7-Day Artisanal Exchange & Returns | Kusumika Luxury Home Textiles",
  description:
    "Learn about Kusumika's 7-Day Doorstep Exchange Policy, free BlueDart reverse pickup, size swap guarantees, and fast refund processing.",
};

const RETURN_FAQS = [
  {
    question: "What is Kusumika's return and exchange window?",
    answer:
      "We offer a 7-day hassle-free exchange and return window starting from the exact date of delivery. If you need a different bed size, organic shade, or wish to return an unwashed piece, we arrange free doorstep reverse pickup.",
  },
  {
    question: "How do I initiate a return or size exchange?",
    answer:
      "Simply navigate to your Patron Account under Orders, click 'Request Exchange', or message our WhatsApp Concierge at +91 98765 43210 with your order number. Our team will schedule a BlueDart rider to collect the parcel.",
  },
  {
    question: "What condition must the textiles be in?",
    answer:
      "Textiles must be in their original unwashed state with intact woven heirloom tags and original unbleached mulmul cloth packaging.",
  },
  {
    question: "How are refunds settled for Partial COD orders?",
    answer:
      "The advance paid online is refunded to your original payment method (UPI/card), and if any doorstep balance was collected, our concierge will request your preferred UPI ID or bank account for instant NEFT transfer within 48 hours of inspection.",
  },
];

export default function ReturnsExchangePage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      <FaqJsonLd questions={RETURN_FAQS} />
      <Header />

      <main className="flex-1 w-full py-12 sm:py-16 px-4 sm:px-8 lg:px-12 max-w-[960px] mx-auto space-y-10">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-secondary font-sans text-xs uppercase tracking-widest font-semibold">
            <span className="material-symbols-outlined text-[16px]">sync_alt</span>
            <span>7-Day Slow-Craft Exchange</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl text-primary font-normal tracking-tight">
            Artisanal Exchange & Return Charter
          </h1>
          <p className="font-sans text-sm sm:text-base text-on-surface-variant max-w-xl mx-auto leading-relaxed">
            Every Kusumika textile is handcrafted with immense patience. If a size, drape, or pigment tone doesn't harmonize with your bedroom sanctuary, we ensure seamless exchanges.
          </p>
        </div>

        {/* 3 STEPS TO EXCHANGE */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-surface-container border border-outline-variant/60 space-y-3">
            <div className="w-10 h-10 rounded-full bg-secondary/15 flex items-center justify-center text-secondary font-serif font-bold text-lg">
              1
            </div>
            <h3 className="font-serif text-lg font-bold text-primary">Inform Our Concierge</h3>
            <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
              Message us on WhatsApp or tap "Request Exchange" in your order dashboard within 7 days of delivery.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-surface-container border border-outline-variant/60 space-y-3">
            <div className="w-10 h-10 rounded-full bg-secondary/15 flex items-center justify-center text-secondary font-serif font-bold text-lg">
              2
            </div>
            <h3 className="font-serif text-lg font-bold text-primary">Complimentary Pickup</h3>
            <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
              We dispatch a BlueDart courier executive directly to your doorstep with pre-printed return labels and packaging.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-surface-container border border-outline-variant/60 space-y-3">
            <div className="w-10 h-10 rounded-full bg-secondary/15 flex items-center justify-center text-secondary font-serif font-bold text-lg">
              3
            </div>
            <h3 className="font-serif text-lg font-bold text-primary">Priority Replacement / Refund</h3>
            <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
              Your exchange piece is air-couriered immediately, or your full payment is returned within 48 hours.
            </p>
          </div>
        </section>

        {/* POLICY DETAILS & CONDITIONS */}
        <section className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 sm:p-10 shadow-sm space-y-5 font-sans text-xs sm:text-sm text-on-surface-variant leading-relaxed">
          <h2 className="font-serif text-xl sm:text-2xl text-primary font-bold border-b border-outline-variant/30 pb-3">
            Conditions for Return & Exchange
          </h2>
          <ul className="list-disc pl-5 space-y-2.5 text-on-surface">
            <li>
              <strong>Unwashed & Unused:</strong> Because fine long-staple organic cotton changes hand-feel when washed, returned bedsheets and quilts must be unwashed, clean, and free of household fragrances.
            </li>
            <li>
              <strong>Heirloom Packaging:</strong> Please place the items back into the original unbleached mulmul storage envelope and protective craft carton.
            </li>
            <li>
              <strong>Bespoke & Custom Sizes:</strong> Custom bed dimensions woven specifically for private havelis or oversized heritage beds can only be exchanged in case of dimensional defects.
            </li>
          </ul>
        </section>

        {/* FAQS */}
        <section className="space-y-4">
          <div className="text-center space-y-1">
            <h2 className="font-serif text-2xl text-primary font-bold">Frequently Asked Questions</h2>
            <p className="font-sans text-xs text-outline">Clear guidance on exchanges and care</p>
          </div>
          <div className="space-y-3 font-sans">
            {RETURN_FAQS.map((faq, idx) => (
              <div key={idx} className="p-5 rounded-xl bg-surface-container-lowest border border-outline-variant/50 space-y-2">
                <h3 className="font-serif text-base font-semibold text-primary">{faq.question}</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <LotusDivider label="Kusumika Atelier" lineWidth="sm" />
      </main>

      <Footer />
    </div>
  );
}
