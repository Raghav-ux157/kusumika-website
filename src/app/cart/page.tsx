"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Header, Footer } from "@/components/layout";
import { Button, Input, Badge } from "@/components/ui";
import { useStore } from "@/context/StoreContext";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    subtotal,
    discount,
    appliedCoupon,
    couponError,
    applyCoupon,
    removeCoupon,
    total,
    advancePayable,
    balanceDue,
  } = useStore();

  const [couponInput, setCouponInput] = useState("");

  const giftThreshold = 2999;
  const remainingForGift = Math.max(0, giftThreshold - subtotal);
  const giftProgress = Math.min(100, (subtotal / giftThreshold) * 100);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const success = applyCoupon(couponInput.trim());
    if (success) setCouponInput("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      <Header />

      <main className="flex-1 w-full py-10 lg:py-16 px-4 sm:px-8 lg:px-12">
        <div className="max-w-[1360px] mx-auto space-y-8">
          {/* Header Title */}
          <div className="border-b border-outline-variant/40 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <span className="font-sans text-xs uppercase tracking-widest text-secondary font-bold">
                Order Review
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl text-primary font-normal">
                Your Sanctuary Cart
              </h1>
            </div>
            <Link
              href="/collections"
              className="text-xs font-sans uppercase font-bold tracking-wider text-secondary hover:text-primary underline underline-offset-4"
            >
              ← Continue Shopping
            </Link>
          </div>

          {cart.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-center gap-4 bg-surface-container-low rounded-2xl border border-outline-variant/40 p-8">
              <div className="w-20 h-20 rounded-full bg-surface-container flex items-center justify-center text-outline">
                <span className="material-symbols-outlined text-[36px]">
                  shopping_bag
                </span>
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-2xl text-primary font-normal">
                  Your Sanctuary Cart is Empty
                </h3>
                <p className="font-sans text-sm text-on-surface-variant max-w-md">
                  Experience the soothing touch of 400TC single-ply pure cotton and botanical block prints.
                </p>
              </div>
              <Link href="/collections">
                <Button variant="primary" size="md">
                  Explore Handloom Collections
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Left Column: Cart Items & Gift Meter (8 cols) */}
              <div className="lg:col-span-8 space-y-6">
                {/* Festive Gift Meter */}
                <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/60 flex flex-col gap-2 shadow-sm font-sans">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-primary flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[18px] text-tertiary">
                        redeem
                      </span>
                      <span>Complimentary Festive Keepsake Gift Box</span>
                    </span>
                    <span className="text-secondary font-bold text-xs">
                      {remainingForGift === 0
                        ? "Unlocked! Included with your order"
                        : `Add ${formatPrice(remainingForGift)} more to unlock`}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-surface rounded-full overflow-hidden">
                    <div
                      className="h-full bg-secondary rounded-full transition-all duration-300"
                      style={{ width: `${giftProgress}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-outline">
                    Handmade pine-wood gift box with gold foil lotus seal on orders above ₹2,999.
                  </p>
                </div>

                {/* Items List */}
                <div className="bg-surface rounded-xl border border-outline-variant/50 divide-y divide-outline-variant/30 overflow-hidden shadow-sm">
                  {cart.map((item) => (
                    <div
                      key={item.cartItemId}
                      className="p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
                    >
                      {/* Image & Title */}
                      <div className="flex items-center gap-4 flex-1">
                        <div className="relative w-20 h-24 rounded-lg overflow-hidden bg-surface-dim shrink-0 border border-outline-variant/40">
                          <Image
                            src={item.product.images[0] || "/placeholder.jpg"}
                            alt={item.product.title}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        </div>

                        <div className="space-y-1">
                          <Link
                            href={`/products/${item.product.slug}`}
                            className="font-serif text-base text-primary hover:text-secondary font-medium transition-colors line-clamp-1"
                          >
                            {item.product.title}
                          </Link>
                          <div className="flex flex-wrap items-center gap-2 text-xs font-sans text-outline">
                            <span>{item.selectedSize}</span>
                            {item.selectedSwatch && (
                              <>
                                <span>•</span>
                                <div className="flex items-center gap-1">
                                  <span
                                    className="w-2.5 h-2.5 rounded-full inline-block border border-outline/30"
                                    style={{
                                      backgroundColor: item.selectedSwatch.hex,
                                    }}
                                  />
                                  <span>{item.selectedSwatch.name}</span>
                                </div>
                              </>
                            )}
                          </div>
                          <div className="text-xs font-sans text-secondary font-semibold">
                            Partial COD Eligible
                          </div>
                        </div>
                      </div>

                      {/* Quantity & Price */}
                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                        <div className="flex items-center border border-outline-variant rounded bg-surface">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.cartItemId, item.quantity - 1)
                            }
                            className="px-2.5 py-1 text-sm text-on-surface hover:bg-surface-container rounded-l"
                          >
                            −
                          </button>
                          <span className="px-3 py-1 text-xs font-sans font-bold">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.cartItemId, item.quantity + 1)
                            }
                            className="px-2.5 py-1 text-sm text-on-surface hover:bg-surface-container rounded-r"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-right min-w-[90px]">
                          <span className="font-serif text-lg font-bold text-on-surface">
                            {formatPrice(item.product.price * item.quantity)}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="text-outline hover:text-error transition-colors p-1"
                          title="Remove item"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            delete
                          </span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Coupon Code Section */}
                <div className="p-5 rounded-xl bg-surface-container-low border border-outline-variant/50 space-y-3 font-sans">
                  <span className="text-xs uppercase tracking-wider text-primary font-bold">
                    Sanctuary Privileges & Promotional Vouchers
                  </span>
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-surface border border-tertiary/40 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-tertiary text-[18px]">
                          check_circle
                        </span>
                        <div>
                          <strong className="text-primary font-bold">
                            {appliedCoupon.code}
                          </strong>{" "}
                          applied ({appliedCoupon.description})
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeCoupon}
                        className="text-error font-semibold underline hover:opacity-80"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApply} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Try 'FESTIVE500' or 'KUSUMIKA10'"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="w-full rounded bg-surface border border-outline-variant px-3 py-2 text-xs font-sans text-on-surface placeholder:text-outline uppercase"
                      />
                      <Button type="submit" variant="outline" size="sm" className="shrink-0">
                        Apply Voucher
                      </Button>
                    </form>
                  )}
                  {couponError && (
                    <p className="text-xs text-error">{couponError}</p>
                  )}
                </div>
              </div>

              {/* Right Column: Financial Summary & Partial COD (4 cols) */}
              <div className="lg:col-span-4 space-y-6">
                <div className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/60 shadow-sm space-y-6">
                  <h3 className="font-serif text-2xl text-primary font-normal pb-3 border-b border-outline-variant/40">
                    Order Summary
                  </h3>

                  <div className="space-y-3 text-xs font-sans">
                    <div className="flex justify-between text-on-surface-variant">
                      <span>Merchandise Subtotal</span>
                      <span className="font-semibold text-on-surface">
                        {formatPrice(subtotal)}
                      </span>
                    </div>

                    {discount > 0 && (
                      <div className="flex justify-between text-secondary font-semibold">
                        <span>Privilege Discount</span>
                        <span>−{formatPrice(discount)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-on-surface-variant">
                      <span>Insured Loom Delivery</span>
                      <span className="text-tertiary font-bold">FREE</span>
                    </div>

                    <div className="flex justify-between text-base font-serif font-bold text-primary pt-3 border-t border-outline-variant/30">
                      <span>Total Order Value</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>

                  {/* PARTIAL COD SETTLEMENT BREAKDOWN */}
                  <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/60 space-y-3 font-sans">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-primary">
                        Partial COD Breakdown
                      </span>
                      <Badge variant="terracotta" size="sm">Recommended</Badge>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="p-2.5 rounded bg-surface border border-outline-variant/40 flex justify-between items-center">
                        <span className="text-outline">Pay Online Now (Loom Advance):</span>
                        <strong className="text-secondary font-serif text-base">
                          {formatPrice(advancePayable)}
                        </strong>
                      </div>

                      <div className="p-2.5 rounded bg-surface border border-outline-variant/40 flex justify-between items-center">
                        <span className="text-outline">Balance Due on Doorstep Delivery:</span>
                        <strong className="text-primary font-serif text-base">
                          {formatPrice(balanceDue)}
                        </strong>
                      </div>
                    </div>

                    <p className="text-[11px] text-outline leading-tight">
                      Inspect the intact artisan seal upon courier arrival. Pay the balance via UPI QR code or Cash at your door.
                    </p>
                  </div>

                  {/* Proceed to Checkout Button */}
                  <div className="space-y-2">
                    <Link href="/checkout">
                      <Button variant="primary" fullWidth={true} size="lg">
                        Proceed to Checkout
                      </Button>
                    </Link>
                    <p className="text-[10px] text-center text-outline font-sans">
                      256-Bit Encrypted Payment • Free Pan-India Delivery
                    </p>
                  </div>
                </div>

                {/* Assurance Badges */}
                <div className="p-4 rounded-xl bg-surface border border-outline-variant/40 space-y-2 text-xs font-sans text-on-surface-variant">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-tertiary text-[18px]">
                      verified
                    </span>
                    <span>100% Handcrafted Artisan Guarantee</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[18px]">
                      local_shipping
                    </span>
                    <span>Free Pan-India Carbon-Neutral Dispatch</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px]">
                      security
                    </span>
                    <span>Doorstep OTP Verification</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
