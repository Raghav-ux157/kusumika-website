"use client";

import React from "react";
import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import { ProductCard } from "@/components/commerce";
import { Button } from "@/components/ui";
import { useStore } from "@/context/StoreContext";
import { MOCK_CATALOG } from "@/lib/mockCatalog";

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart, isInWishlist } = useStore();

  const wishlistedProducts = MOCK_CATALOG.filter((p) =>
    wishlist.includes(p.id)
  );

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      <Header />

      <main className="flex-1 w-full py-10 lg:py-16 px-4 sm:px-8 lg:px-12">
        <div className="max-w-[1360px] mx-auto space-y-8">
          <div className="border-b border-outline-variant/40 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <span className="font-sans text-xs uppercase tracking-widest text-secondary font-bold">
                Private Curation
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl text-primary font-normal">
                Your Saved Heirloom Pieces
              </h1>
            </div>
            <span className="text-xs font-sans text-on-surface-variant">
              {wishlistedProducts.length} {wishlistedProducts.length === 1 ? "Heirloom" : "Heirlooms"} Saved
            </span>
          </div>

          {wishlistedProducts.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-center gap-4 bg-surface-container-low rounded-2xl border border-outline-variant/40 p-8">
              <div className="w-20 h-20 rounded-full bg-surface-container flex items-center justify-center text-outline">
                <span className="material-symbols-outlined text-[36px]">
                  favorite_border
                </span>
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-2xl text-primary font-normal">
                  Your Wishlist is Empty
                </h3>
                <p className="font-sans text-sm text-on-surface-variant max-w-md">
                  Click the heart icon on any bedsheet or handloom quilt to preserve it for your sanctuary.
                </p>
              </div>
              <Link href="/collections">
                <Button variant="primary" size="md">
                  Explore Bed Linen Collections
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {wishlistedProducts.map((prod) => (
                <div key={prod.id} className="flex flex-col gap-2">
                  <ProductCard
                    product={prod}
                    initialWishlisted={true}
                    onQuickAdd={(p) => addToCart(p)}
                    onWishlistToggle={(p) => toggleWishlist(p)}
                  />
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      fullWidth={true}
                      onClick={() => addToCart(prod)}
                    >
                      Move to Sanctuary Cart
                    </Button>
                    <button
                      type="button"
                      onClick={() => toggleWishlist(prod)}
                      className="px-3 py-1.5 rounded border border-outline-variant text-xs font-sans text-outline hover:text-error hover:border-error transition-colors"
                      title="Remove from wishlist"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
