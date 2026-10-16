import React from "react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#FFF8F6] text-[#2C2220] flex flex-col justify-between selection:bg-[#994534]/15">
      {/* Header Skeleton Bar */}
      <div className="w-full border-b border-[#5C181A]/10 py-5 px-6 sm:px-12 flex items-center justify-between animate-pulse">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[#5C181A]/15" />
          <div className="h-5 w-28 bg-[#5C181A]/15 rounded" />
        </div>
        <div className="hidden sm:flex items-center gap-6">
          <div className="h-3 w-16 bg-[#5C181A]/10 rounded" />
          <div className="h-3 w-20 bg-[#5C181A]/10 rounded" />
          <div className="h-3 w-16 bg-[#5C181A]/10 rounded" />
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#5C181A]/10" />
          <div className="w-8 h-8 rounded-full bg-[#5C181A]/10" />
        </div>
      </div>

      {/* Centerpiece Atmospheric Lotus Loom Pulse */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center space-y-6">
          {/* Architectural Jharokha Arch with Pulsing Golden Lotus */}
          <div className="relative mx-auto w-28 h-36 rounded-t-full rounded-b-2xl bg-gradient-to-b from-[#5C181A]/10 to-[#994534]/5 border border-[#5C181A]/20 flex flex-col items-center justify-center p-4 shadow-sm overflow-hidden animate-pulse">
            <span className="text-4xl text-[#994534] animate-bounce duration-1000">
              ❀
            </span>
            <div className="w-10 h-0.5 bg-[#994534]/30 rounded-full mt-3" />
          </div>

          <div className="space-y-2">
            <p className="font-sans text-xs uppercase tracking-[0.25em] text-[#994534] font-bold animate-pulse">
              Artisanal Weft & Warp
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#5C181A] font-normal">
              Weaving your sanctuary…
            </h2>
            <p className="font-sans text-xs text-[#616136] tracking-wider italic">
              "Soft like Silk, Feels like a Hug"
            </p>
          </div>

          {/* Shimmering Progress Ribbon */}
          <div className="w-48 mx-auto h-1 bg-[#5C181A]/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#994534] via-[#5C181A] to-[#616136] w-full animate-[shimmer_2s_infinite]" />
          </div>
        </div>
      </main>

      {/* Bottom subtle bar */}
      <div className="w-full border-t border-[#5C181A]/10 py-4 px-6 text-center">
        <span className="font-serif text-xs text-[#616136]/70">
          Handcrafted in Jaipur • Pure Natural Fibers
        </span>
      </div>
    </div>
  );
}
