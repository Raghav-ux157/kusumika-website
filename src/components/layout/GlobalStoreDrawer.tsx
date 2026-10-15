"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useStore } from "@/context/StoreContext";
import { Drawer, Button } from "@/components/ui";
import { PartialCodBadge } from "@/components/commerce/PartialCodBadge";
import { formatPrice } from "@/lib/utils";

export const GlobalStoreDrawer: React.FC = () => {
  const {
    cart,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    total,
    advancePayable,
    balanceDue,
    toastMessage,
  } = useStore();

  const giftThreshold = 2999;
  const remainingForGift = Math.max(0, giftThreshold - subtotal);
  const giftProgress = Math.min(100, (subtotal / giftThreshold) * 100);

  return (
    <>
      {/* Global Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-primary-container text-surface px-5 py-3 rounded-lg shadow-elevation-2 font-sans text-xs uppercase tracking-wider flex items-center gap-2 border border-outline-variant/50 animate-in fade-in slide-in-from-bottom-4">
          <span className="material-symbols-outlined text-[18px]">verified</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global Slide-Over Cart Drawer */}
      <Drawer
        isOpen={isCartDrawerOpen}
        onClose={() => setIsCartDrawerOpen(false)}
        position="right"
        width="md"
        title="Your Sanctuary Cart"
        subtitle={
          cart.length === 0
            ? "Your cart is waiting for heirlooms"
            : `${cart.length} Handcrafted ${cart.length === 1 ? "Item" : "Items"} • Free Pan-India Shipping`
        }
      >
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-outline">
              <span className="material-symbols-outlined text-[32px]">
                shopping_bag
              </span>
            </div>
            <div className="space-y-1">
              <h4 className="font-serif text-xl text-primary font-normal">
                Your Sanctuary Cart is Empty
              </h4>
              <p className="font-sans text-xs text-on-surface-variant max-w-xs">
                Bring the serene comfort of 400TC handloom cotton and botanical prints into your sanctuary.
              </p>
            </div>
            <Link href="/collections" onClick={() => setIsCartDrawerOpen(false)}>
              <Button variant="primary" size="sm">
                Explore Bed Linens
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col h-full justify-between gap-6">
            {/* Free Festive Gift Progress Meter */}
            <div className="p-3.5 rounded-xl bg-surface-container border border-outline-variant/60 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-sans">
                <span className="font-semibold text-primary flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-tertiary">
                    redeem
                  </span>
                  <span>Festive Keepsake Box</span>
                </span>
                <span className="text-[11px] text-secondary font-bold">
                  {remainingForGift === 0
                    ? "Unlocked! Complimentary Box Included"
                    : `Add ${formatPrice(remainingForGift)} for Gift Box`}
                </span>
              </div>
              <div className="w-full h-1.5 bg-surface rounded-full overflow-hidden">
                <div
                  className="h-full bg-secondary rounded-full transition-all duration-300"
                  style={{ width: `${giftProgress}%` }}
                />
              </div>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto divide-y divide-outline-variant/30 pr-1 space-y-4">
              {cart.map((item) => (
                <div key={item.cartItemId} className="pt-4 first:pt-0 flex gap-3.5">
                  {/* Thumbnail */}
                  <div className="w-20 h-24 rounded-lg bg-surface-dim relative overflow-hidden shrink-0 border border-outline-variant/40">
                    <Image
                      src={item.product.images[0] || "/placeholder.jpg"}
                      alt={item.product.title}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex flex-col flex-1 justify-between py-0.5">
                    <div className="space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/products/${item.product.slug}`}
                          onClick={() => setIsCartDrawerOpen(false)}
                          className="font-serif text-sm font-medium text-primary hover:text-secondary line-clamp-1 leading-snug"
                        >
                          {item.product.title}
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="text-outline hover:text-error transition-colors p-0.5"
                          title="Remove item"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            close
                          </span>
                        </button>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] font-sans text-outline">
                        <span>{item.selectedSize || "Standard"}</span>
                        {item.selectedSwatch && (
                          <>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <span
                                className="w-2.5 h-2.5 rounded-full inline-block border border-outline/30"
                                style={{ backgroundColor: item.selectedSwatch.hex }}
                              />
                              <span>{item.selectedSwatch.name}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Quantity & Price */}
                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-outline-variant/20">
                      <div className="flex items-center border border-outline-variant rounded bg-surface">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.cartItemId, item.quantity - 1)
                          }
                          className="px-2 py-0.5 text-xs text-on-surface hover:bg-surface-container"
                        >
                          −
                        </button>
                        <span className="px-2 py-0.5 text-xs font-sans font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.cartItemId, item.quantity + 1)
                          }
                          className="px-2 py-0.5 text-xs text-on-surface hover:bg-surface-container"
                        >
                          +
                        </button>
                      </div>

                      <span className="font-serif text-sm font-bold text-on-surface">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Checkout Panel */}
            <div className="space-y-4 pt-4 border-t border-outline-variant/50 bg-surface">
              <div className="space-y-1.5 text-xs font-sans">
                <div className="flex justify-between text-on-surface-variant">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>Pan-India Delivery</span>
                  <span className="text-tertiary font-bold">Complimentary</span>
                </div>
                <div className="flex justify-between text-base font-serif font-bold text-primary pt-2 border-t border-outline-variant/30">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              {/* Partial COD Advance Banner */}
              <div className="p-3 rounded-lg bg-surface-container-high border border-outline-variant/50 flex flex-col gap-1 text-xs font-sans">
                <div className="flex items-center justify-between font-bold text-secondary">
                  <span>Partial COD Option:</span>
                  <span>Pay {formatPrice(advancePayable)} Now</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-outline">
                  <span>Doorstep Balance Due:</span>
                  <span>{formatPrice(balanceDue)}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Link
                  href="/checkout"
                  onClick={() => setIsCartDrawerOpen(false)}
                >
                  <Button variant="primary" fullWidth={true} size="md">
                    Proceed to Checkout
                  </Button>
                </Link>
                <Link
                  href="/cart"
                  onClick={() => setIsCartDrawerOpen(false)}
                >
                  <Button variant="outline" fullWidth={true} size="sm">
                    View Full Cart & Apply Coupons
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </>
  );
};
