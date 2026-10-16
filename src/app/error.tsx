"use client";

import React, { useEffect } from "react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log unexpected runtime errors for observability
    console.error("[Kusumika Application Error]:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#FFF8F6] text-[#2C2220] flex flex-col justify-between selection:bg-[#994534]/15">
      {/* Top Heritage Ornament Bar */}
      <header className="w-full border-b border-[#5C181A]/10 py-5 px-6 sm:px-12 flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <span className="w-7 h-7 rounded-full bg-[#5C181A]/10 text-[#5C181A] flex items-center justify-center font-serif text-sm font-bold group-hover:scale-105 transition-transform">
            ❀
          </span>
          <span className="font-serif tracking-[0.25em] text-lg font-bold text-[#5C181A] uppercase">
            Kusumika
          </span>
        </Link>
        <span className="font-sans text-[11px] uppercase tracking-widest text-[#616136] font-semibold hidden sm:inline-block">
          Artisanal Home Textiles • Est. Jaipur
        </span>
      </header>

      {/* Main Error Canvas */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 sm:py-20">
        <div className="max-w-xl w-full text-center space-y-8">
          {/* Architectural Jharokha Arch Frame */}
          <div className="relative mx-auto w-32 h-44 rounded-t-full rounded-b-2xl bg-gradient-to-b from-[#5C181A]/10 to-[#994534]/5 border-2 border-[#5C181A]/20 flex flex-col items-center justify-center p-6 shadow-sm overflow-hidden">
            <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#5C181A_1px,transparent_1px)] [background-size:12px_12px]" />
            <span className="text-4xl text-[#994534] mb-2 animate-pulse">
              ❀
            </span>
            <span className="font-serif text-xs uppercase tracking-widest text-[#5C181A] font-semibold">
              Loom Shuttle
            </span>
            <span className="font-serif text-[10px] tracking-wider text-[#616136] italic">
              Realignment
            </span>
          </div>

          <div className="space-y-3">
            <span className="font-sans text-xs uppercase tracking-[0.25em] text-[#994534] font-bold">
              Artisanal Pause • System Notice
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#5C181A] font-normal leading-tight">
              A Moment of Loom Realignment
            </h1>
            <p className="font-sans text-sm sm:text-base text-[#2C2220]/80 max-w-md mx-auto leading-relaxed">
              Our digital looms encountered an unexpected interruption while preparing your sanctuary textiles. No craft or cart data has been lost.
            </p>
          </div>

          {/* Action CTA Group */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => reset()}
              type="button"
              className="w-full sm:w-auto px-7 py-3 rounded-full bg-[#5C181A] text-[#FFF8F6] font-sans text-xs uppercase tracking-widest font-semibold hover:bg-[#431012] transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Realign Loom & Retry</span>
              <span>↺</span>
            </button>

            <a
              href="https://wa.me/919876543210?text=Hello%20Kusumika%20team,%20I%20encountered%20an%20unexpected%20error%20on%20the%20website"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 rounded-full border border-[#5C181A]/25 text-[#5C181A] font-sans text-xs uppercase tracking-widest font-semibold hover:bg-[#5C181A]/5 transition-colors flex items-center justify-center gap-2"
            >
              <span>WhatsApp Concierge</span>
              <span>💬</span>
            </a>
          </div>

          <div className="pt-2">
            <Link
              href="/"
              className="inline-block text-xs font-sans uppercase font-bold tracking-wider text-[#616136] hover:text-[#5C181A] transition-colors underline underline-offset-4"
            >
              ← Return to Main Sanctuary
            </Link>
          </div>

          {/* Diagnostic footprint (in dev or when digest available) */}
          {error.digest && (
            <p className="font-mono text-[10px] text-[#2C2220]/40 pt-4">
              Incident Trace Ref: {error.digest}
            </p>
          )}
        </div>
      </main>

      {/* Subtle Heritage Footer */}
      <footer className="w-full border-t border-[#5C181A]/10 py-4 px-6 text-center text-xs font-serif text-[#616136]">
        Kusumika • "Soft like Silk, Feels like a Hug" • Jaipur Handcrafted Textiles
      </footer>
    </div>
  );
}
