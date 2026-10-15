"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BrandLogo } from "../brand/BrandLogo";
import { Drawer } from "../ui/Drawer";
import { NavigationItem } from "@/types";
import { cn } from "@/lib/utils";
import { useStore } from "@/context/StoreContext";

const NAV_ITEMS: NavigationItem[] = [
  { label: "Bedsheets & Linens", href: "/collections/bedsheets-linens", path: "bedsheets-linens" },
  { label: "Throws & Quilts", href: "/collections/throws-quilts", path: "throws-quilts" },
  { label: "Towels & Bath", href: "/collections/towels-bath", path: "towels-bath" },
  { label: "Cushions & Decor", href: "/collections/cushions-decor", path: "cushions-decor" },
  { label: "Festive Edit", href: "/collections/festive-edit", path: "festive-edit", badge: "New" },
  { label: "Business & Bulk", href: "/bulk-enquiry", path: "bulk-hospitality", isSpecial: true },
];

export interface HeaderProps {
  cartCount?: number;
  wishlistCount?: number;
  onOpenCart?: () => void;
  onOpenWishlist?: () => void;
  onOpenSearch?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenSearch,
}) => {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  let storeContext: ReturnType<typeof useStore> | undefined;
  try {
    storeContext = useStore();
  } catch {
    // rendered outside provider
  }

  const effectiveCartCount =
    cartCount !== undefined
      ? cartCount
      : storeContext
      ? storeContext.cart.reduce((sum, item) => sum + item.quantity, 0)
      : 0;

  const effectiveWishlistCount =
    wishlistCount !== undefined
      ? wishlistCount
      : storeContext
      ? storeContext.wishlist.length
      : 0;

  const handleOpenCart =
    onOpenCart || (() => storeContext?.setIsCartDrawerOpen(true));

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchOpen(false);
    setMobileMenuOpen(false);
    router.push(`/collections?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <header className="sticky top-0 w-full z-40 shadow-[0_1px_8px_rgba(45,36,33,0.04)] select-none">
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-primary text-surface px-4 py-2 text-center border-b border-outline-variant/30 flex items-center justify-center">
        <div className="w-full flex items-center justify-center flex-wrap gap-x-3 gap-y-1 font-sans text-[11px] uppercase tracking-wider">
          <span className="text-tertiary-fixed font-bold flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">local_florist</span>
            Festive Offering
          </span>
          <span className="opacity-40 hidden sm:inline">•</span>
          <span className="hidden sm:inline">
            Complimentary Festive Gift Box on orders above ₹2,999
          </span>
          <span className="opacity-40 hidden md:inline">|</span>
          <span className="hidden md:inline">
            Bulk & Hospitality:{" "}
            <a
              href="mailto:bulk@kusumika.com"
              className="underline decoration-outline-variant hover:text-primary-fixed transition-colors font-medium lowercase"
            >
              bulk@kusumika.com
            </a>
          </span>
          <span className="opacity-40 hidden lg:inline">|</span>
          <span className="text-surface/90">Complimentary Pan-India Shipping</span>
        </div>
      </div>

      {/* 2. MAIN NAVIGATION HEADER */}
      <div className="h-20 bg-surface-container/95 backdrop-blur-md px-4 sm:px-8 lg:px-12 border-b border-outline-variant/40">
        <div className="h-full max-w-[1360px] mx-auto flex items-center justify-between gap-4">
          {/* Left: Mobile hamburger & Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="xl:hidden p-2 text-on-surface hover:text-primary transition-colors focus:outline-none"
              aria-label="Open mobile menu"
            >
              <span className="material-symbols-outlined text-[26px]">menu</span>
            </button>
            <BrandLogo size="md" />
          </div>

          {/* Center: Desktop Navigation Bar */}
          <nav className="hidden xl:flex items-center gap-7">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                href={item.href}
                className={cn(
                  "font-sans text-xs uppercase tracking-wider text-on-surface-variant hover:text-primary pb-1 transition-colors relative group",
                  item.isSpecial && "text-secondary font-bold hover:text-primary-container"
                )}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-1 px-1.5 py-0.5 rounded-full bg-secondary text-surface text-[9px] font-bold uppercase tracking-wider">
                    {item.badge}
                  </span>
                )}
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-primary group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>

          {/* Right: Actions (Search, Wishlist, Cart, Account) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Button */}
            <button
              type="button"
              onClick={() => (onOpenSearch ? onOpenSearch() : setSearchOpen(!searchOpen))}
              className="p-2 text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center rounded-full hover:bg-surface-container"
              aria-label="Search collection"
            >
              <span className="material-symbols-outlined text-[22px]">search</span>
            </button>

            {/* Wishlist Link */}
            <Link
              href="/wishlist"
              onClick={(e) => {
                if (onOpenWishlist) {
                  e.preventDefault();
                  onOpenWishlist();
                }
              }}
              className="relative p-2 text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center rounded-full hover:bg-surface-container"
              aria-label="View Wishlist"
            >
              <span className="material-symbols-outlined text-[22px]">favorite</span>
              {effectiveWishlistCount > 0 && (
                <span className="absolute top-1 right-1 h-4 min-w-[16px] px-1 rounded-full bg-secondary text-surface font-sans text-[10px] leading-4 text-center font-bold">
                  {effectiveWishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Trigger */}
            <button
              type="button"
              onClick={handleOpenCart}
              className="relative p-2 text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center rounded-full hover:bg-surface-container"
              aria-label="View Cart"
            >
              <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
              {effectiveCartCount > 0 && (
                <span className="absolute top-1 right-1 h-4 min-w-[16px] px-1 rounded-full bg-primary-container text-surface font-sans text-[10px] leading-4 text-center font-bold">
                  {effectiveCartCount}
                </span>
              )}
            </button>

            {/* Account / Profile Icon */}
            <Link
              href="/account"
              className="w-8 h-8 rounded-full bg-primary-container hover:bg-secondary text-surface flex items-center justify-center ml-1 transition-colors shadow-sm"
              aria-label="My Account"
            >
              <span className="material-symbols-outlined text-[18px]">person</span>
            </Link>
          </div>
        </div>

        {/* Dropdown Desktop Search Bar */}
        {searchOpen && (
          <form
            onSubmit={handleSearchSubmit}
            className="absolute left-0 right-0 top-full bg-surface-container border-b border-outline-variant p-4 shadow-lg animate-in slide-in-from-top-2"
          >
            <div className="max-w-[700px] mx-auto relative flex items-center">
              <input
                type="text"
                autoFocus
                placeholder="Search bedsheets, dohars, towels, waffle weave, 400TC..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg bg-surface border border-outline-variant px-4 py-3 pl-11 text-sm font-sans text-on-surface placeholder:text-outline focus:outline-none focus:border-primary-container"
              />
              <span className="material-symbols-outlined text-outline absolute left-3.5 text-[22px]">
                search
              </span>
              <button
                type="submit"
                className="absolute right-2 px-4 py-1.5 bg-primary text-surface rounded text-xs font-sans uppercase font-bold tracking-wider hover:bg-secondary transition-colors"
              >
                Search
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 3. MOBILE NAVIGATION DRAWER */}
      <Drawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        position="left"
        width="md"
        title="Sanctuary Menu"
        subtitle="Artisanal Handlooms & Pure Cottons"
      >
        <div className="flex flex-col gap-6 py-2">
          {/* Quick Search */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search bedsheets, dohars, towels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded bg-surface border border-outline-variant px-3.5 py-2.5 pl-10 text-sm font-sans text-on-surface placeholder:text-outline"
            />
            <span className="material-symbols-outlined text-outline absolute left-3 top-3 text-[18px]">
              search
            </span>
          </form>

          {/* Navigation Category Links */}
          <nav className="flex flex-col divide-y divide-outline-variant/30">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-3.5 flex items-center justify-between font-serif text-lg text-on-surface hover:text-primary transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full bg-secondary text-surface text-[9px] font-sans font-bold uppercase tracking-wider">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="material-symbols-outlined text-[18px] text-outline">
                  chevron_right
                </span>
              </Link>
            ))}
          </nav>

          {/* Bulk & Hospitality Banner */}
          <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/60 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-secondary font-bold font-sans text-xs uppercase tracking-wider">
              <span className="material-symbols-outlined text-[16px]">domain</span>
              <span>Bespoke Hospitality & Bulk</span>
            </div>
            <p className="text-xs text-on-surface-variant font-sans leading-relaxed">
              Custom weave specs, 300–800 TC, embroidery, and GST invoices for boutique hotels and interior designers.
            </p>
            <Link
              href="/bulk-enquiry"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-1 text-xs font-sans font-bold text-primary underline underline-offset-4"
            >
              Request Trade Pricing →
            </Link>
          </div>

          {/* Customer Support Footer Info */}
          <div className="pt-4 border-t border-outline-variant/40 flex flex-col gap-2 text-xs font-sans text-outline">
            <p>
              WhatsApp Concierge:{" "}
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noreferrer"
                className="text-primary font-medium"
              >
                +91 98765 43210
              </a>
            </p>
            <p>Email: care@kusumika.com</p>
            <p className="text-[11px] text-outline/80 mt-1">
              Jaipur • Sanganer • Bagru • Pan-India
            </p>
          </div>
        </div>
      </Drawer>
    </header>
  );
};
