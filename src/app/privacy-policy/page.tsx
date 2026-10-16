import React from "react";
import { Header, Footer } from "@/components/layout";
import { LotusDivider } from "@/components/brand";

export const metadata = {
  title: "Privacy Policy | Kusumika Luxury Home Textiles",
  description:
    "Learn about Kusumika's commitment to patron privacy under the Digital Personal Data Protection (DPDP) Act, 2023, cookie consent mechanisms, and 256-bit data encryption.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      <Header />

      <main className="flex-1 w-full py-12 sm:py-16 px-4 sm:px-8 lg:px-12 max-w-[960px] mx-auto space-y-10 font-sans text-xs sm:text-sm text-on-surface-variant leading-relaxed">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-secondary font-sans text-xs uppercase tracking-widest font-semibold">
            <span className="material-symbols-outlined text-[16px]">lock</span>
            <span>Digital Personal Data Protection (DPDP) 2023</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl text-primary font-normal tracking-tight">
            Patron Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-outline">
            Effective Date: 16 October 2026 • Last Reviewed: Q4 2026
          </p>
        </div>

        <section className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-6 sm:p-10 shadow-sm space-y-6">
          <div className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl text-primary font-bold">1. Data Fiduciary Identity</h2>
            <p>
              This Privacy Policy applies to personal data collected by <strong>Kusumika Artisanal Textiles Private Limited</strong> ("Kusumika", "we", "us", or "our"), having its registered artisanal facility at <em>Atelier Block, Weavers Colony, Bagru & Sanganer Artisanal Road, Jaipur, Rajasthan 302029</em>.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl text-primary font-bold">2. Personal Data We Collect</h2>
            <ul className="list-disc pl-5 space-y-1.5 text-on-surface">
              <li><strong>Contact & Shipping Data:</strong> Name, delivery address, postal pincode, email address, and mobile phone number (utilized strictly for courier OTP dispatch and WhatsApp tracking notifications).</li>
              <li><strong>Payment & Settlement Data:</strong> Transaction IDs, advance deposit amounts, and Partial COD balance records. Raw credit/debit card numbers and UPI MPINs are <strong>never</strong> processed or stored on Kusumika servers; all financial exchanges are tokenized directly through RBI-licensed payment gateway partners (Razorpay).</li>
              <li><strong>B2B Trade Inquiries:</strong> Hotel/haveli establishment name, GSTIN (optional for tax invoices), and bespoke suite textile specifications.</li>
              <li><strong>Technical & Measurement Data:</strong> Anonymous analytics data collected strictly upon your opt-in consent via our Cookie Consent Manager.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl text-primary font-bold">3. Google Consent Mode v2 & Marketing Measurement</h2>
            <p>
              Our website respects your autonomy under the <strong>Digital Personal Data Protection Act, 2023</strong> and the <strong>EU GDPR/ePrivacy Directive</strong>:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-on-surface">
              <li><strong>Strictly Necessary Cookies:</strong> Essential for cart preservation, Partial COD calculations, and session tokens. Always active.</li>
              <li><strong>Performance & Analytics (GA4):</strong> Collects anonymous navigation signals only after you select "Accept All" or toggle Analytics in our consent modal.</li>
              <li><strong>Marketing Pixels (Meta Pixel):</strong> Only activated upon explicit marketing consent, allowing us to connect with patrons without selling data to data brokers.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl text-primary font-bold">4. Zero Data Selling Commitment</h2>
            <p>
              Kusumika upholds the quiet dignity of slow craft. <strong>We do not sell, rent, or trade your personal data or phone number to third-party telemarketers or external brokerages.</strong> Data is shared solely with verified logistics couriers (BlueDart / Shiprocket) strictly to deliver your textiles to your sanctuary.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl text-primary font-bold">5. Your Statutory Rights</h2>
            <p>
              As a valued patron, you have the right to request access to your stored personal records, correct inaccurate shipping details, or request full deletion of non-statutory records by writing to our Data Protection Officer at:
            </p>
            <div className="p-4 rounded-xl bg-surface-container font-mono text-xs text-primary space-y-1">
              <div><strong>Data Protection Officer:</strong> Kusumika Legal & Patron Privacy Guild</div>
              <div><strong>Email:</strong> privacy@kusumika.com</div>
              <div><strong>Atelier Address:</strong> Jaipur Central Depot, Bagru-Sanganer Road, Jaipur, RJ 302029</div>
            </div>
          </div>
        </section>

        <LotusDivider label="Kusumika Atelier" lineWidth="sm" />
      </main>

      <Footer />
    </div>
  );
}
