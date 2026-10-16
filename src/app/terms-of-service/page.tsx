import React from "react";
import { Header, Footer } from "@/components/layout";
import { LotusDivider } from "@/components/brand";

export const metadata = {
  title: "Terms of Craft & Service | Kusumika Luxury Home Textiles",
  description:
    "Review Kusumika's Terms of Craft, handloom variation disclosures, Partial COD contractual terms, intellectual property, and Jaipur legal jurisdiction.",
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      <Header />

      <main className="flex-1 w-full py-12 sm:py-16 px-4 sm:px-8 lg:px-12 max-w-[960px] mx-auto space-y-10 font-sans text-xs sm:text-sm text-on-surface-variant leading-relaxed">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-secondary font-sans text-xs uppercase tracking-widest font-semibold">
            <span className="material-symbols-outlined text-[16px]">gavel</span>
            <span>Commercial & Craft Charter</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl text-primary font-normal tracking-tight">
            Terms of Craft & Service
          </h1>
          <p className="text-xs sm:text-sm text-outline">
            Effective Date: 16 October 2026 • Governing Law: Jaipur, Rajasthan, India
          </p>
        </div>

        <section className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 sm:p-10 shadow-sm space-y-6">
          <div className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl text-primary font-bold">1. Nature of Handloom & Slow Craft</h2>
            <p>
              By reserving a textile on Kusumika, you acknowledge and celebrate the inherent nature of artisanal handloom weaving, Sanganeri block printing, and Bagru natural dyeing:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-on-surface">
              <li><strong>Natural Pigment Nuances:</strong> Organic vegetable dyes (madder root, natural indigo, harda, and iron pomegranate ferment) react uniquely to atmospheric humidity and river washes. Subtle variations in hue are not flaws; they are the fingerprint of human hands.</li>
              <li><strong>Carved Wooden Block Alignment:</strong> Minor overlaps and ink density shifts are the certified proof of hand-stamping by master chipas, not automated screen printing.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl text-primary font-bold">2. Partial Cash on Delivery (COD) Contract</h2>
            <p>
              When selecting our signature <strong>Partial COD</strong> payment option:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-on-surface">
              <li>The online advance is processed immediately to lock your loom reservation.</li>
              <li>You agree to receive the BlueDart courier executive at your designated shipping address and settle the exact Doorstep Balance printed on your Tax Invoice via Cash or dynamic UPI QR.</li>
              <li>You are entitled to verify the intact lac wax seal prior to payment. In the rare event of severe carton tampering, you may refuse delivery without penalty.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl text-primary font-bold">3. Trade & Hospitality Orders</h2>
            <p>
              Quotations issued through our Bespoke Hospitality & Trade portal (`/bulk-enquiry`) are valid for 30 calendar days. Custom loom dimensions, boutique haveli monograms, and institutional thread-count tests are governed by the dedicated trade contract signed between your firm and Kusumika Artisanal Textiles Pvt. Ltd.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl text-primary font-bold">4. Intellectual Property</h2>
            <p>
              All textile motif patterns, archival block carvings, editorial photography, typography layouts, and the trademarked motto <em>"Soft like Silk, Feels like a Hug"</em> are the exclusive intellectual property of Kusumika Artisanal Textiles Pvt. Ltd. Unauthorized commercial reproduction is strictly prohibited.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl text-primary font-bold">5. Governing Law & Jurisdiction</h2>
            <p>
              These Terms shall be interpreted and governed by the laws of India. Any dispute, claim, or controversy arising from orders placed on Kusumika shall be subject to the exclusive jurisdiction of the competent courts in <strong>Jaipur, Rajasthan, India</strong>.
            </p>
          </div>
        </section>

        <LotusDivider label="Kusumika Atelier" lineWidth="sm" />
      </main>

      <Footer />
    </div>
  );
}
