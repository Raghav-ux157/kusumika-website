"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Header, Footer } from "@/components/layout";
import { Button, Input, Select, Checkbox, Radio, Badge } from "@/components/ui";
import { useStore } from "@/context/StoreContext";
import { formatPrice, cn } from "@/lib/utils";

const INDIAN_STATES = [
  "Rajasthan",
  "Delhi NCR",
  "Maharashtra",
  "Karnataka",
  "Gujarat",
  "Tamil Nadu",
  "Telangana",
  "Uttar Pradesh",
  "West Bengal",
  "Punjab",
  "Haryana",
  "Madhya Pradesh",
  "Kerala",
  "Goa",
];

export default function CheckoutPage() {
  const router = useRouter();
  const {
    user,
    cart,
    subtotal,
    discount,
    total,
    advancePayable,
    balanceDue,
    appliedCoupon,
    placeOrder,
    verifiedPincode,
    showToast,
  } = useStore();

  // Form states
  const [formData, setFormData] = useState({
    name: "Radhika Sharma",
    phone: "9876543210",
    email: "radhika.sharma@example.com",
    address: "B-42, Gulabi Bagh, Near Civil Lines",
    city: verifiedPincode?.city || "Jaipur",
    state: verifiedPincode?.state || "Rajasthan",
    pincode: verifiedPincode?.pincode || "302006",
    landmark: "Opposite Rajputana Haveli",
    whatsappOptIn: true,
  });

  const [shippingMethod, setShippingMethod] = useState<"standard" | "priority">("standard");
  const [paymentMode, setPaymentMode] = useState<"partial_cod" | "upi" | "cards" | "netbanking">("partial_cod");
  const [advanceSubmode, setAdvanceSubmode] = useState("upi");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  const [formErrors, setFormErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    pincode?: string;
    city?: string;
  }>({});

  // Failure & Abandonment Recovery State
  const [paymentNotice, setPaymentNotice] = useState<{
    type: "abandoned" | "failed" | "error";
    title: string;
    message: string;
  } | null>(null);

  const validateForm = () => {
    const errs: typeof formErrors = {};

    if (!formData.name.trim()) {
      errs.name = "Patron name is required for loom reservation";
    }

    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = "Please enter a valid email address for dispatch notification";
    }

    const cleanPhone = formData.phone.replace(/[\s\-\+]/g, "").slice(-10);
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      errs.phone = "Enter a valid 10-digit Indian mobile number (e.g. 9876543210)";
    }

    if (!formData.address.trim()) {
      errs.address = "Complete address is required for doorstep delivery";
    }

    const cleanPincode = formData.pincode.trim();
    if (!/^[1-9][0-9]{5}$/.test(cleanPincode)) {
      errs.pincode = "Enter a valid 6-digit Indian postal pincode";
    }

    if (!formData.city.trim()) {
      errs.city = "City / District is required";
    }

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const shippingFee = shippingMethod === "priority" ? 250 : 0;
  const effectiveTotal = total + shippingFee;
  const effectiveAdvance = paymentMode === "partial_cod" ? advancePayable : effectiveTotal;
  const effectiveBalanceDue = paymentMode === "partial_cod" ? effectiveTotal - advancePayable : 0;

  const advancePercentage =
    effectiveTotal > 0
      ? Math.round((effectiveAdvance / effectiveTotal) * 100)
      : 20;

  // Dynamically load Razorpay SDK
  useEffect(() => {
    if (typeof window === "undefined") return;

    if ((window as any).Razorpay) {
      setRazorpayLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    script.onerror = () => {
      console.warn("[Razorpay] CDN script could not be loaded; test sandbox simulation available.");
      setRazorpayLoaded(false);
    };
    document.body.appendChild(script);

    return () => {
      // Cleanup script tag if needed
    };
  }, []);

  // Complete Order Verification & Navigation
  const verifyAndCompleteOrder = async (params: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    isMock: boolean;
    orderNumber: string;
  }) => {
    try {
      const orderData = {
        order_number: params.orderNumber,
        customer_id: user?.id || null,
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: `+91 ${formData.phone}`,
        shipping_address: {
          address_line1: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          landmark: formData.landmark,
        },
        items: cart.map((item) => ({
          product_id: item.product.id,
          product_title: item.product.title,
          variant_size: item.selectedSize || "Standard",
          swatch_name: item.selectedSwatch?.name || null,
          image_url: item.product.images[0] || null,
          price: item.product.price,
          quantity: item.quantity,
          total: item.product.price * item.quantity,
        })),
        subtotal,
        discount,
        shipping_fee: shippingFee,
        total: effectiveTotal,
        payment_mode: paymentMode,
        advance_paid: effectiveAdvance,
        balance_due: effectiveBalanceDue,
        coupon_code: appliedCoupon?.code || null,
        notes: `Preservation method: ${shippingMethod === "priority" ? "Priority Haveli Express Air" : "Standard Insured Loom"}`,
      };

      const verifyRes = await fetch("/api/checkout/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpay_order_id: params.razorpay_order_id,
          razorpay_payment_id: params.razorpay_payment_id,
          razorpay_signature: params.razorpay_signature,
          isMock: params.isMock,
          orderData,
        }),
      });

      const verifyResult = await verifyRes.json();

      if (!verifyRes.ok) {
        throw new Error(verifyResult.error || "Payment verification failed.");
      }

      // Synchronize in local StoreContext (skip duplicate DB insert since backend already wrote it)
      placeOrder({
        orderId: params.orderNumber,
        customerName: formData.name,
        phone: `+91 ${formData.phone}`,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        items: cart,
        subtotal,
        discount,
        shippingFee,
        total: effectiveTotal,
        paymentMode,
        advancePaid: effectiveAdvance,
        balanceDue: effectiveBalanceDue,
        skipDbInsert: true,
      });

      showToast(`Payment confirmed! Order #${params.orderNumber} is assigned to loom.`);
      router.push(`/account/orders/${params.orderNumber}`);
    } catch (err: any) {
      console.error("[Verification Error]:", err);
      setIsPlacingOrder(false);
      setPaymentNotice({
        type: "error",
        title: "Order Finalization Issue",
        message: err.message || "We could not finalize your loom allocation. Please retry.",
      });
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (!validateForm()) {
      showToast("Please correct the highlighted contact and address details.");
      return;
    }

    setIsPlacingOrder(true);
    setPaymentNotice(null);

    const orderNumber = `KSM-${Math.floor(10000 + Math.random() * 90000)}`;
    const amountToPayInInr = effectiveAdvance;

    try {
      // 1. Create Order on Razorpay backend
      const createOrderRes = await fetch("/api/checkout/create-razorpay-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amountToPayInInr,
          currency: "INR",
          receipt: `rcpt_${orderNumber}`,
          notes: {
            order_number: orderNumber,
            customer_name: formData.name,
            customer_email: formData.email,
            payment_mode: paymentMode,
          },
        }),
      });

      if (!createOrderRes.ok) {
        const errorJson = await createOrderRes.json();
        throw new Error(errorJson.error || "Failed to create payment order with gateway.");
      }

      const rzpOrder = await createOrderRes.json();

      // 2. If Razorpay client is available on window and not blocked
      if (typeof window !== "undefined" && (window as any).Razorpay) {
        const options: any = {
          key: rzpOrder.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_kusumika_sandbox",
          amount: rzpOrder.amount,
          currency: rzpOrder.currency || "INR",
          name: "Kusumika Luxury Home Textiles",
          description:
            paymentMode === "partial_cod"
              ? `Artisan Loom Advance (${formatPrice(effectiveAdvance)}) for #${orderNumber}`
              : `Order Reservation #${orderNumber}`,
          image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=128&q=80",
          order_id: rzpOrder.isMock ? undefined : rzpOrder.id,
          handler: async function (response: any) {
            await verifyAndCompleteOrder({
              razorpay_order_id: response.razorpay_order_id || rzpOrder.id,
              razorpay_payment_id: response.razorpay_payment_id || `pay_test_${Date.now()}`,
              razorpay_signature: response.razorpay_signature || "simulated_valid_signature",
              isMock: rzpOrder.isMock,
              orderNumber,
            });
          },
          prefill: {
            name: formData.name,
            email: formData.email,
            contact: formData.phone.startsWith("+91") ? formData.phone : `+91${formData.phone}`,
          },
          theme: {
            color: "#5C181A", // Kusumika Heirloom Maroon
          },
          modal: {
            ondismiss: function () {
              setIsPlacingOrder(false);
              setPaymentNotice({
                type: "abandoned",
                title: "Loom Reservation Paused",
                message:
                  "You closed the payment modal before completing your reservation. Your cart and shipping details are safe. You can resume anytime.",
              });
            },
          },
        };

        const razorpayInstance = new (window as any).Razorpay(options);

        razorpayInstance.on("payment.failed", function (response: any) {
          setIsPlacingOrder(false);
          setPaymentNotice({
            type: "failed",
            title: "Payment Unsuccessful",
            message:
              response?.error?.description ||
              "Your bank or payment application declined the transaction. Please try another card or UPI app, or use Partial COD.",
          });
        });

        razorpayInstance.open();
      } else {
        // Fallback: Sandbox local simulation when Razorpay CDN is offline or blocked
        console.warn("[Razorpay] Executing seamless test sandbox simulation...");
        setTimeout(async () => {
          await verifyAndCompleteOrder({
            razorpay_order_id: rzpOrder.id,
            razorpay_payment_id: `pay_sandbox_${Date.now()}`,
            razorpay_signature: "sandbox_simulated_sig",
            isMock: true,
            orderNumber,
          });
        }, 1200);
      }
    } catch (err: any) {
      console.error("[Checkout Initiation Error]:", err);
      setIsPlacingOrder(false);
      setPaymentNotice({
        type: "error",
        title: "Payment Gateway Offline",
        message: err.message || "Could not reach the payment gateway. Please verify your connection.",
      });
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-surface text-on-surface">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center py-20 px-4 text-center">
          <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-outline mb-4">
            <span className="material-symbols-outlined text-[32px]">
              shopping_bag
            </span>
          </div>
          <h2 className="font-serif text-3xl text-primary font-normal mb-2">
            No items in checkout
          </h2>
          <p className="font-sans text-xs text-on-surface-variant max-w-sm mb-6">
            Please add an heirloom bedsheet or handloom quilt to proceed with checkout.
          </p>
          <Link href="/collections">
            <Button variant="primary" size="md">
              Browse Collections
            </Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      <Header />

      <main className="flex-1 w-full py-10 lg:py-14 px-4 sm:px-8 lg:px-12">
        <div className="max-w-[1360px] mx-auto space-y-8">
          {/* Checkout Header */}
          <div className="border-b border-outline-variant/40 pb-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="font-sans text-xs uppercase tracking-widest text-secondary font-bold">
                Secure Reservation & Loom Allocation
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl text-primary font-normal">
                Checkout & Loom Allocation
              </h1>
            </div>
            <Link
              href="/cart"
              className="text-xs font-sans uppercase font-bold tracking-wider text-secondary hover:text-primary underline underline-offset-4"
            >
              ← Edit Cart
            </Link>
          </div>

          {/* Payment Notice / Failure / Abandonment Banner */}
          {paymentNotice && (
            <div
              className={cn(
                "p-4 sm:p-5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2 duration-300",
                paymentNotice.type === "abandoned"
                  ? "bg-amber-50/90 border-amber-200 text-amber-950"
                  : "bg-red-50/90 border-red-200 text-red-950"
              )}
            >
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    "material-symbols-outlined text-[24px] shrink-0 mt-0.5",
                    paymentNotice.type === "abandoned" ? "text-amber-700" : "text-red-700"
                  )}
                >
                  {paymentNotice.type === "abandoned" ? "hourglass_pause" : "error"}
                </span>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-serif font-bold text-base">
                      {paymentNotice.title}
                    </h4>
                    <span className="text-[10px] uppercase font-sans font-bold px-2 py-0.5 rounded bg-white/80 border border-current/20">
                      Cart & Details Preserved
                    </span>
                  </div>
                  <p className="font-sans text-xs opacity-90 max-w-2xl leading-relaxed">
                    {paymentNotice.message}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0 self-end sm:self-center">
                {paymentMode !== "partial_cod" && (
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMode("partial_cod");
                      setPaymentNotice(null);
                    }}
                    className="text-xs font-sans font-semibold bg-white border border-outline-variant/60 hover:bg-surface px-3 py-1.5 rounded-lg shadow-sm text-primary"
                  >
                    Switch to Partial COD
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setPaymentNotice(null)}
                  className="text-xs font-sans font-medium text-outline hover:text-primary px-2 py-1.5"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handlePlaceOrder}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Left Column: Checkout Steps 1, 2, 3 (8 cols) */}
              <div className="lg:col-span-8 space-y-8">
                {/* STEP 1: CONTACT INFORMATION */}
                <section className="bg-surface-container-lowest p-6 sm:p-8 rounded-xl border border-outline-variant/50 shadow-sm space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[22px]">
                        person
                      </span>
                      <h2 className="font-serif text-xl sm:text-2xl text-primary font-normal">
                        1. Patron Contact Information
                      </h2>
                    </div>
                    <span className="text-[10px] font-sans uppercase tracking-widest text-secondary bg-surface-container px-2.5 py-1 rounded font-bold">
                      Step 1 of 3
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      placeholder="e.g. Radhika Sharma"
                      value={formData.name}
                      error={formErrors.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (formErrors.name) setFormErrors({ ...formErrors, name: undefined });
                      }}
                      required
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      placeholder="e.g. radhika@example.com"
                      value={formData.email}
                      error={formErrors.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (formErrors.email) setFormErrors({ ...formErrors, email: undefined });
                      }}
                      required
                    />
                  </div>

                  <Input
                    label="WhatsApp Phone Number"
                    type="tel"
                    placeholder="9876543210"
                    value={formData.phone}
                    error={formErrors.phone}
                    onChange={(e) => {
                      setFormData({ ...formData, phone: e.target.value });
                      if (formErrors.phone) setFormErrors({ ...formErrors, phone: undefined });
                    }}
                    leftIcon={<span className="text-xs font-bold font-sans">+91</span>}
                    helperText="10-digit mobile for dispatch alerts, BlueDart GPS tracking, & doorstep OTP."
                    required
                  />

                  <Checkbox
                    label="Receive live loom weaving updates & delivery OTP via WhatsApp"
                    sublabel="We never send spam. Only transaction receipts and courier dispatch notifications."
                    checked={formData.whatsappOptIn}
                    onChange={(e) =>
                      setFormData({ ...formData, whatsappOptIn: e.target.checked })
                    }
                  />
                </section>

                {/* STEP 2: SHIPPING ADDRESS */}
                <section className="bg-surface-container-lowest p-6 sm:p-8 rounded-xl border border-outline-variant/50 shadow-sm space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[22px]">
                        home_pin
                      </span>
                      <h2 className="font-serif text-xl sm:text-2xl text-primary font-normal">
                        2. Sanctuary Delivery Address
                      </h2>
                    </div>
                    <span className="text-[10px] font-sans uppercase tracking-widest text-secondary bg-surface-container px-2.5 py-1 rounded font-bold">
                      Step 2 of 3
                    </span>
                  </div>

                  <Input
                    label="Street Address / Flat / Villa / Haveli"
                    placeholder="e.g. B-42, Gulabi Bagh, Near Civil Lines"
                    value={formData.address}
                    error={formErrors.address}
                    onChange={(e) => {
                      setFormData({ ...formData, address: e.target.value });
                      if (formErrors.address) setFormErrors({ ...formErrors, address: undefined });
                    }}
                    required
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Input
                      label="Pincode"
                      placeholder="302006"
                      maxLength={6}
                      value={formData.pincode}
                      error={formErrors.pincode}
                      onChange={(e) => {
                        setFormData({ ...formData, pincode: e.target.value });
                        if (formErrors.pincode) setFormErrors({ ...formErrors, pincode: undefined });
                      }}
                      required
                    />
                    <Input
                      label="City / District"
                      placeholder="Jaipur"
                      value={formData.city}
                      error={formErrors.city}
                      onChange={(e) => {
                        setFormData({ ...formData, city: e.target.value });
                        if (formErrors.city) setFormErrors({ ...formErrors, city: undefined });
                      }}
                      required
                    />
                    <Select
                      label="State"
                      value={formData.state}
                      onChange={(e) =>
                        setFormData({ ...formData, state: e.target.value })
                      }
                      options={INDIAN_STATES.map((s) => ({ label: s, value: s }))}
                      required
                    />
                  </div>

                  <Input
                    label="Landmark (Optional)"
                    placeholder="e.g. Opposite Amber Fort turnoff"
                    value={formData.landmark}
                    onChange={(e) =>
                      setFormData({ ...formData, landmark: e.target.value })
                    }
                  />

                  {/* Shipping Speed Radio */}
                  <div className="space-y-3 pt-3 border-t border-outline-variant/30 font-sans">
                    <span className="text-xs uppercase tracking-wider text-primary font-bold">
                      Preservation & Transit Method
                    </span>
                    <div className="space-y-2">
                      <Radio
                        name="shipping_speed"
                        label="Standard Insured Loom Shipping (3–4 Business Days)"
                        sublabel="Free Pan-India • Dispatched in breathable compostable cotton muslin bag"
                        badge="FREE"
                        checked={shippingMethod === "standard"}
                        onChange={() => setShippingMethod("standard")}
                      />
                      <Radio
                        name="shipping_speed"
                        label="Priority Haveli Express Air (1–2 Days Delivery)"
                        sublabel="Next-day dispatch from Jaipur loom atelier • Insured express air transit"
                        badge="+ ₹250"
                        checked={shippingMethod === "priority"}
                        onChange={() => setShippingMethod("priority")}
                      />
                    </div>
                  </div>
                </section>

                {/* STEP 3: COMPREHENSIVE PAYMENT MODES (HIGHLIGHTING PARTIAL COD) */}
                <section className="bg-surface-container-lowest p-6 sm:p-8 rounded-xl border border-outline-variant/50 shadow-sm space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[22px]">
                        payments
                      </span>
                      <h2 className="font-serif text-xl sm:text-2xl text-primary font-normal">
                        3. Select Payment Experience
                      </h2>
                    </div>
                    <span className="text-[10px] font-sans uppercase tracking-widest text-secondary bg-surface-container px-2.5 py-1 rounded font-bold">
                      Step 3 of 3
                    </span>
                  </div>

                  <div className="space-y-4">
                    {/* OPTION 1: PARTIAL COD (HERO PROMINENT CARD) */}
                    <div
                      className={cn(
                        "rounded-xl p-5 border-2 transition-all cursor-pointer",
                        paymentMode === "partial_cod"
                          ? "border-primary-container bg-surface-container shadow-terracotta"
                          : "border-outline-variant/50 bg-surface hover:bg-surface-container-low"
                      )}
                      onClick={() => setPaymentMode("partial_cod")}
                    >
                      <label className="flex items-start gap-3.5 cursor-pointer">
                        <input
                          type="radio"
                          name="payment_experience"
                          checked={paymentMode === "partial_cod"}
                          onChange={() => setPaymentMode("partial_cod")}
                          className="mt-1 accent-primary h-5 w-5"
                        />
                        <div className="flex-1 space-y-2">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="font-serif text-xl text-primary font-medium">
                                Partial Cash On Delivery
                              </span>
                              <Badge variant="terracotta" size="sm">Recommended</Badge>
                            </div>
                            <span className="font-sans text-xs text-tertiary font-bold flex items-center gap-1">
                              <span className="material-symbols-outlined text-[16px]">verified</span>
                              <span>0% Extra COD Fee</span>
                            </span>
                          </div>

                          <p className="font-sans text-xs text-on-surface-variant">
                            Pay a nominal advance online to lock your loom reservation. Inspect the fabric at your doorstep and pay the balance via UPI or Cash.
                          </p>

                          {/* PAYMENT DISTRIBUTION METER */}
                          {paymentMode === "partial_cod" && (
                            <div className="mt-4 pt-4 border-t border-outline-variant/40 space-y-3 animate-in fade-in duration-200">
                              <div className="flex justify-between items-center text-[11px] font-sans uppercase tracking-wider text-outline">
                                <span>Loom Advance ({advancePercentage}%)</span>
                                <span>Doorstep Balance ({100 - advancePercentage}%)</span>
                              </div>
                              <div className="w-full h-2 rounded-full bg-surface-dim flex overflow-hidden">
                                <div
                                  className="bg-secondary h-full transition-all duration-500"
                                  style={{ width: `${advancePercentage}%` }}
                                />
                                <div
                                  className="bg-primary h-full transition-all duration-500"
                                  style={{ width: `${100 - advancePercentage}%` }}
                                />
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                <div className="p-3 rounded-lg bg-surface border border-outline-variant/40 space-y-1">
                                  <span className="font-sans text-[10px] uppercase tracking-wider text-secondary font-bold">
                                    Payable Now Online (Advance)
                                  </span>
                                  <div className="font-serif text-2xl text-secondary font-bold">
                                    {formatPrice(effectiveAdvance)}
                                  </div>
                                  <p className="font-sans text-[11px] text-outline">
                                    Locks artisan loom & triggers weaving
                                  </p>
                                </div>

                                <div className="p-3 rounded-lg bg-surface border border-outline-variant/40 space-y-1">
                                  <span className="font-sans text-[10px] uppercase tracking-wider text-primary font-bold">
                                    Balance on Doorstep Delivery
                                  </span>
                                  <div className="font-serif text-2xl text-primary font-bold">
                                    {formatPrice(effectiveBalanceDue)}
                                  </div>
                                  <p className="font-sans text-[11px] text-outline">
                                    Pay via UPI QR or Cash to delivery executive
                                  </p>
                                </div>
                              </div>

                              {/* Doorstep Inspection Guarantee Note */}
                              <div className="p-3 rounded-lg bg-surface/80 border border-outline-variant/30 flex items-start gap-2 text-xs font-sans text-on-surface-variant">
                                <span className="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">
                                  verified_user
                                </span>
                                <p className="leading-relaxed">
                                  <strong>Zero-Risk Doorstep Inspection:</strong> You will receive an SMS and WhatsApp OTP before courier delivery. You are warmly invited to inspect the intact <strong className="text-primary font-semibold">Kusumika Artisan Wax Seal</strong> and feel the organic cotton weave before completing the balance payment.
                                </p>
                              </div>

                              {/* Advance Payment Sub-Mode Selector */}
                              <div className="space-y-2 pt-2">
                                <span className="font-sans text-xs uppercase tracking-wider text-primary font-bold block">
                                  Select Mode for {formatPrice(effectiveAdvance)} Advance:
                                </span>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-sans">
                                  {[
                                    { id: "upi", label: "Instant UPI / QR Code" },
                                    { id: "gpay", label: "Google Pay / PhonePe" },
                                    { id: "cards", label: "Debit / Credit Card" },
                                  ].map((mode) => (
                                    <label
                                      key={mode.id}
                                      className={cn(
                                        "flex items-center gap-2 p-2.5 rounded border transition-colors cursor-pointer",
                                        advanceSubmode === mode.id
                                          ? "bg-surface border-primary font-bold text-primary"
                                          : "bg-surface border-outline-variant/40"
                                      )}
                                    >
                                      <input
                                        type="radio"
                                        name="advance_submode"
                                        checked={advanceSubmode === mode.id}
                                        onChange={() => setAdvanceSubmode(mode.id)}
                                        className="accent-primary"
                                      />
                                      <span>{mode.label}</span>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </label>
                    </div>

                    {/* OPTION 2: INSTANT UPI (EXTRA 2% OFF) */}
                    <div
                      className={cn(
                        "rounded-xl p-4 border transition-all cursor-pointer",
                        paymentMode === "upi"
                          ? "border-primary-container bg-surface-container"
                          : "border-outline-variant/50 bg-surface hover:bg-surface-container-low"
                      )}
                      onClick={() => setPaymentMode("upi")}
                    >
                      <label className="flex items-start gap-3.5 cursor-pointer">
                        <input
                          type="radio"
                          name="payment_experience"
                          checked={paymentMode === "upi"}
                          onChange={() => setPaymentMode("upi")}
                          className="mt-1 accent-primary h-4 w-4"
                        />
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-serif text-lg text-primary font-medium">
                              Instant UPI Transfer (Full Prepaid)
                            </span>
                            <span className="bg-tertiary text-surface text-[10px] font-sans uppercase font-bold px-2 py-0.5 rounded">
                              Fast Track Dispatch
                            </span>
                          </div>
                          <p className="font-sans text-xs text-on-surface-variant">
                            Google Pay, PhonePe, Paytm, BHIM, and Cred UPI. Zero surcharge.
                          </p>
                        </div>
                      </label>
                    </div>

                    {/* OPTION 3: CREDIT / DEBIT CARDS */}
                    <div
                      className={cn(
                        "rounded-xl p-4 border transition-all cursor-pointer",
                        paymentMode === "cards"
                          ? "border-primary-container bg-surface-container"
                          : "border-outline-variant/50 bg-surface hover:bg-surface-container-low"
                      )}
                      onClick={() => setPaymentMode("cards")}
                    >
                      <label className="flex items-start gap-3.5 cursor-pointer">
                        <input
                          type="radio"
                          name="payment_experience"
                          checked={paymentMode === "cards"}
                          onChange={() => setPaymentMode("cards")}
                          className="mt-1 accent-primary h-4 w-4"
                        />
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-serif text-lg text-primary font-medium">
                              Credit & Debit Cards (Full Prepaid)
                            </span>
                            <span className="text-[10px] font-sans text-outline uppercase font-semibold">
                              Visa • MC • RuPay • Amex
                            </span>
                          </div>
                          <p className="font-sans text-xs text-on-surface-variant">
                            Encrypted 256-Bit tokenized banking via Razorpay test gateway.
                          </p>
                        </div>
                      </label>
                    </div>

                    {/* OPTION 4: NET BANKING */}
                    <div
                      className={cn(
                        "rounded-xl p-4 border transition-all cursor-pointer",
                        paymentMode === "netbanking"
                          ? "border-primary-container bg-surface-container"
                          : "border-outline-variant/50 bg-surface hover:bg-surface-container-low"
                      )}
                      onClick={() => setPaymentMode("netbanking")}
                    >
                      <label className="flex items-start gap-3.5 cursor-pointer">
                        <input
                          type="radio"
                          name="payment_experience"
                          checked={paymentMode === "netbanking"}
                          onChange={() => setPaymentMode("netbanking")}
                          className="mt-1 accent-primary h-4 w-4"
                        />
                        <div className="flex-1 space-y-1">
                          <span className="font-serif text-lg text-primary font-medium">
                            Net Banking & Digital Wallets
                          </span>
                          <p className="font-sans text-xs text-on-surface-variant">
                            HDFC, ICICI, SBI, Axis, Kotak, and verified digital wallets.
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>
                </section>
              </div>

              {/* Right Column: Order Summary Sidebar (4 cols) */}
              <div className="lg:col-span-4 space-y-6 sticky top-28">
                <div className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/60 shadow-sm space-y-6">
                  <h3 className="font-serif text-2xl text-primary font-normal pb-3 border-b border-outline-variant/40">
                    Order Summary ({cart.length})
                  </h3>

                  {/* Thumbnail Items Preview */}
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                    {cart.map((item) => (
                      <div key={item.cartItemId} className="flex items-center gap-3 text-xs font-sans">
                        <div className="relative w-12 h-14 rounded bg-surface-dim overflow-hidden shrink-0 border border-outline-variant/40">
                          <Image
                            src={item.product.images[0] || "/placeholder.jpg"}
                            alt={item.product.title}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 space-y-0.5">
                          <h4 className="font-serif text-sm font-medium text-primary line-clamp-1">
                            {item.product.title}
                          </h4>
                          <span className="text-[11px] text-outline">
                            Qty: {item.quantity} • {item.selectedSize}
                          </span>
                        </div>
                        <span className="font-serif font-bold text-on-surface">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Financial Breakdown */}
                  <div className="space-y-2.5 text-xs font-sans pt-3 border-t border-outline-variant/40">
                    <div className="flex justify-between text-on-surface-variant">
                      <span>Merchandise Subtotal</span>
                      <span className="font-semibold text-on-surface">
                        {formatPrice(subtotal)}
                      </span>
                    </div>

                    {discount > 0 && (
                      <div className="flex justify-between text-secondary font-semibold">
                        <span>Privilege Voucher {appliedCoupon ? `(${appliedCoupon.code})` : ""}</span>
                        <span>−{formatPrice(discount)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-on-surface-variant">
                      <span>Preservation & Courier</span>
                      <span className={shippingFee === 0 ? "text-tertiary font-bold" : "font-bold text-on-surface"}>
                        {shippingFee === 0 ? "FREE" : formatPrice(shippingFee)}
                      </span>
                    </div>

                    <div className="flex justify-between text-base font-serif font-bold text-primary pt-3 border-t border-outline-variant/30">
                      <span>Total Order Amount</span>
                      <span>{formatPrice(effectiveTotal)}</span>
                    </div>
                  </div>

                  {/* Partial COD Settlement Box */}
                  {paymentMode === "partial_cod" ? (
                    <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/60 space-y-2 text-xs font-sans">
                      <div className="flex justify-between font-bold text-secondary text-sm">
                        <span>Online Advance Payable Today:</span>
                        <span>{formatPrice(effectiveAdvance)}</span>
                      </div>
                      <div className="flex justify-between text-outline text-[11px]">
                        <span>Doorstep Balance to Courier:</span>
                        <strong className="text-primary font-semibold">
                          {formatPrice(effectiveBalanceDue)}
                        </strong>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 rounded-lg bg-surface-container border border-outline-variant/50 text-xs font-sans text-center text-tertiary font-bold">
                      Prepaid Order: 100% Fully Settled Online
                    </div>
                  )}

                  {/* Submit Order Button */}
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth={true}
                    isLoading={isPlacingOrder}
                  >
                    {paymentMode === "partial_cod"
                      ? `Confirm & Pay ${formatPrice(effectiveAdvance)} Advance`
                      : `Confirm & Pay ${formatPrice(effectiveTotal)}`}
                  </Button>

                  <div className="flex items-center justify-center gap-2 text-[10px] font-sans text-outline">
                    <span className="material-symbols-outlined text-[14px]">
                      lock
                    </span>
                    <span>Razorpay Test Sandbox • 256-Bit Encrypted</span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
