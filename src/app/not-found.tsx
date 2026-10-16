import React from "react";
import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import { LotusDivider } from "@/components/brand";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      <Header />

      <main className="flex-1 w-full py-16 sm:py-24 px-4 sm:px-8 lg:px-12 flex items-center justify-center">
        <div className="max-w-xl w-full text-center space-y-6">
          {/* Architectural Jharokha Arch Frame for 404 */}
          <div className="relative mx-auto w-40 h-48 sm:w-48 sm:h-56 bg-surface-container rounded-t-[100px] border-2 border-primary/40 shadow-xl flex flex-col items-center justify-center p-4 overflow-hidden">
            <div className="absolute inset-0 bg-radial-gradient from-secondary/15 to-transparent pointer-events-none" />
            <span className="font-serif text-5xl sm:text-6xl text-primary font-bold tracking-tight">
              404
            </span>
            <span className="font-serif italic text-xs text-secondary mt-1">
              "Loom Thread Unfound"
            </span>
            <div className="mt-3 w-8 h-0.5 bg-secondary/40 rounded-full" />
          </div>

          <div className="space-y-2">
            <h1 className="font-serif text-2xl sm:text-4xl text-primary font-normal tracking-tight">
              This Textile Has Wandered Into the Archives
            </h1>
            <p className="font-sans text-xs sm:text-sm text-on-surface-variant max-w-md mx-auto leading-relaxed">
              The artisanal page or handloom piece you are seeking might have been re-allocated to our private haveli collections or does not exist at this address.
            </p>
          </div>

          {/* Quick Search & Explore Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/"
              className="px-6 py-3 rounded-lg bg-primary text-on-primary font-sans text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity shadow-md"
            >
              Return to Sanctuary Home
            </Link>
            <Link
              href="/collections/bedsheets-linens"
              className="px-6 py-3 rounded-lg border border-outline-variant bg-surface hover:bg-surface-container font-sans text-xs font-bold uppercase tracking-wider text-primary transition-colors shadow-sm"
            >
              Explore 400TC Linens
            </Link>
          </div>

          {/* Suggested Links */}
          <div className="pt-6 border-t border-outline-variant/30 text-xs font-sans text-outline space-y-2">
            <span>Popular Destinations:</span>
            <div className="flex flex-wrap items-center justify-center gap-4 text-primary font-medium">
              <Link href="/collections/throws-quilts" className="hover:text-secondary transition-colors">
                Mulberry Silk Dohars
              </Link>
              <span>•</span>
              <Link href="/collections/towels-bath" className="hover:text-secondary transition-colors">
                Waffle Bath Linen
              </Link>
              <span>•</span>
              <Link href="/bulk-enquiry" className="hover:text-secondary transition-colors">
                Hospitality Trade Form
              </Link>
              <span>•</span>
              <Link href="/track-order" className="hover:text-secondary transition-colors">
                Track Consignment
              </Link>
            </div>
          </div>

          <LotusDivider label="Kusumika" lineWidth="sm" />
        </div>
      </main>

      <Footer />
    </div>
  );
}
