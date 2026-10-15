import React from "react";
import Link from "next/link";
import { BrandLogo } from "../brand/BrandLogo";
import { LotusDivider } from "../brand/LotusDivider";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-surface-container-high border-t border-outline-variant/60 pt-16 pb-12 text-on-surface select-none">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* TOP: Brand Story & Newsletter Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-14 border-b border-outline-variant/50">
          {/* Brand Column (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <BrandLogo size="lg" />
            <p className="font-serif text-lg text-primary italic leading-snug mt-1">
              "Soft like Silk, Feels like a Hug"
            </p>
            <p className="font-sans text-sm text-on-surface-variant leading-relaxed max-w-md">
              Kusumika crafts artisanal bedsheets, dohars, towels, and home textiles rooted in centuries-old Rajasthani heritage. Hand-loomed with breathable 400–800 thread counts, pure botanical dyes, and gentle organic washes.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4 pt-2 text-outline">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <span className="material-symbols-outlined text-[20px]">
                  photo_camera
                </span>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <span className="material-symbols-outlined text-[20px]">
                  public
                </span>
              </a>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noreferrer"
                className="hover:text-primary transition-colors"
                aria-label="WhatsApp"
              >
                <span className="material-symbols-outlined text-[20px]">
                  chat
                </span>
              </a>
              <a
                href="mailto:care@kusumika.com"
                className="hover:text-primary transition-colors"
                aria-label="Email"
              >
                <span className="material-symbols-outlined text-[20px]">
                  mail
                </span>
              </a>
            </div>
          </div>

          {/* Quick Links Column 1: Collections (2 cols) */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <h4 className="font-sans text-xs uppercase tracking-widest text-primary font-bold">
              Collections
            </h4>
            <ul className="flex flex-col gap-2.5 font-sans text-sm text-on-surface-variant">
              <li>
                <Link
                  href="/collections/bedsheets"
                  className="hover:text-secondary transition-colors"
                >
                  Bedsheets & Linens
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/quilts"
                  className="hover:text-secondary transition-colors"
                >
                  Throws & Dohars
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/bath"
                  className="hover:text-secondary transition-colors"
                >
                  Towels & Bath Sets
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/decor"
                  className="hover:text-secondary transition-colors"
                >
                  Cushions & Living
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/festive"
                  className="hover:text-secondary transition-colors"
                >
                  Festive Heritage Edit
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links Column 2: Trade & Hospitality (2 cols) */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <h4 className="font-sans text-xs uppercase tracking-widest text-primary font-bold">
              Trade & Care
            </h4>
            <ul className="flex flex-col gap-2.5 font-sans text-sm text-on-surface-variant">
              <li>
                <Link
                  href="/bulk-enquiry"
                  className="hover:text-secondary transition-colors font-medium text-secondary"
                >
                  Bulk & Hospitality Form
                </Link>
              </li>
              <li>
                <Link
                  href="/track-order"
                  className="hover:text-secondary transition-colors"
                >
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link
                  href="/partial-cod"
                  className="hover:text-secondary transition-colors"
                >
                  Partial COD Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/wash-care"
                  className="hover:text-secondary transition-colors"
                >
                  Loom & Wash Care
                </Link>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="hover:text-secondary transition-colors text-xs text-outline"
                >
                  Operations Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Column (3 cols) */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <h4 className="font-sans text-xs uppercase tracking-widest text-primary font-bold">
              Artisan Gazette
            </h4>
            <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
              Subscribe to receive private invitations to rare seasonal hand-block editions and festive previews.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Thank you for joining the Kusumika Artisan Gazette!");
              }}
              className="flex flex-col sm:flex-row gap-2 mt-1"
            >
              <input
                type="email"
                required
                placeholder="Enter email address"
                className="w-full rounded bg-surface border border-outline-variant px-3 py-2 text-xs font-sans text-on-surface placeholder:text-outline focus:outline-none focus:border-primary-container"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-secondary text-surface text-xs font-sans uppercase font-bold tracking-wider rounded hover:bg-primary transition-colors shrink-0 shadow-sm"
              >
                Join
              </button>
            </form>
            <p className="text-[10px] text-outline font-sans">
              We respect your quiet moments. Unsubscribe anytime.
            </p>
          </div>
        </div>

        {/* MIDDLE: Trust Badges Bar */}
        <div className="py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center border-b border-outline-variant/40">
          <div className="flex flex-col items-center gap-1.5">
            <span className="material-symbols-outlined text-tertiary text-[24px]">
              eco
            </span>
            <span className="font-sans text-xs font-bold text-primary uppercase tracking-wider">
              100% GOTS Pure Cotton
            </span>
            <span className="font-sans text-[11px] text-outline">
              Zero harmful chemicals or bleaches
            </span>
          </div>

          <div className="flex flex-col items-center gap-1.5">
            <span className="material-symbols-outlined text-secondary text-[24px]">
              brush
            </span>
            <span className="font-sans text-xs font-bold text-primary uppercase tracking-wider">
              Artisanal Hand-Block
            </span>
            <span className="font-sans text-[11px] text-outline">
              Bagru & Sanganer village craft
            </span>
          </div>

          <div className="flex flex-col items-center gap-1.5">
            <span className="material-symbols-outlined text-secondary text-[24px]">
              payments
            </span>
            <span className="font-sans text-xs font-bold text-primary uppercase tracking-wider">
              Partial COD Option
            </span>
            <span className="font-sans text-[11px] text-outline">
              Pay ₹500 advance, rest on delivery
            </span>
          </div>

          <div className="flex flex-col items-center gap-1.5">
            <span className="material-symbols-outlined text-tertiary text-[24px]">
              local_shipping
            </span>
            <span className="font-sans text-xs font-bold text-primary uppercase tracking-wider">
              Complimentary Delivery
            </span>
            <span className="font-sans text-[11px] text-outline">
              Pan-India insured transit
            </span>
          </div>
        </div>

        {/* BOTTOM: Filigree Lotus & Copyright */}
        <div className="pt-8 flex flex-col items-center gap-4">
          <LotusDivider label="Kusumika" lineWidth="sm" />
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 font-sans text-xs text-outline">
            <p>© {new Date().getFullYear()} Kusumika Artisanal Home Textiles. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <span>•</span>
              <Link href="/terms" className="hover:text-primary transition-colors">
                Terms of Craft
              </Link>
              <span>•</span>
              <Link href="/shipping" className="hover:text-primary transition-colors">
                Shipping & Returns
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
