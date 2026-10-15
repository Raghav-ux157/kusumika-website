"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, ProductVariant, ProductSwatch } from "@/types";
import { MOCK_CATALOG } from "@/lib/mockCatalog";

export interface CartItem {
  cartItemId: string;
  product: Product;
  selectedSize?: string;
  selectedSwatch?: ProductSwatch;
  quantity: number;
}

export interface Coupon {
  code: string;
  type: "flat" | "percent";
  value: number;
  minOrder?: number;
  description: string;
}

export interface PlacedOrder {
  orderId: string;
  date: string;
  customerName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  paymentMode: "partial_cod" | "upi" | "cards" | "netbanking";
  advancePaid: number;
  balanceDue: number;
  status: "Order Placed" | "Loom Assigned" | "Natural Dyeing" | "Quality Inspected" | "Shipped" | "Out for Delivery" | "Delivered";
  trackingNumber: string;
  estimatedDelivery: string;
}

interface StoreContextType {
  cart: CartItem[];
  addToCart: (
    product: Product,
    selectedSize?: string,
    selectedSwatch?: ProductSwatch,
    quantity?: number
  ) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;

  wishlist: string[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;

  appliedCoupon: Coupon | null;
  couponError: string | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;

  verifiedPincode: {
    pincode: string;
    city: string;
    state: string;
    days: number;
    codAvailable: boolean;
  } | null;
  checkPincode: (pin: string) => {
    valid: boolean;
    city?: string;
    days?: number;
    message: string;
  };

  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  advancePayable: number;
  balanceDue: number;

  orders: PlacedOrder[];
  placeOrder: (
    orderDetails: Omit<
      PlacedOrder,
      "orderId" | "date" | "status" | "trackingNumber" | "estimatedDelivery"
    >
  ) => PlacedOrder;
  getOrderById: (orderId: string) => PlacedOrder | undefined;

  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const VALID_COUPONS: Record<string, Coupon> = {
  FESTIVE500: {
    code: "FESTIVE500",
    type: "flat",
    value: 500,
    minOrder: 2500,
    description: "₹500 flat off on festive orders above ₹2,500",
  },
  KUSUMIKA10: {
    code: "KUSUMIKA10",
    type: "percent",
    value: 10,
    description: "10% privilege discount on all handloom weaves",
  },
  WELCOME15: {
    code: "WELCOME15",
    type: "percent",
    value: 15,
    minOrder: 3000,
    description: "15% off on your first sanctuary acquisition",
  },
};

const DEFAULT_ORDERS: PlacedOrder[] = [
  {
    orderId: "KSM-84920",
    date: "14 Oct 2026",
    customerName: "Radhika Sharma",
    phone: "+91 98765 43210",
    email: "radhika.sharma@example.com",
    address: "B-42, Gulabi Bagh, Near Civil Lines",
    city: "Jaipur",
    state: "Rajasthan",
    pincode: "302006",
    items: [
      {
        cartItemId: "item-init-1",
        product: MOCK_CATALOG[0],
        selectedSize: "Double / Queen (84x100\")",
        selectedSwatch: MOCK_CATALOG[0].swatches[0],
        quantity: 1,
      },
    ],
    subtotal: 2850,
    discount: 500,
    shippingFee: 0,
    total: 2350,
    paymentMode: "partial_cod",
    advancePaid: 500,
    balanceDue: 1850,
    status: "Shipped",
    trackingNumber: "SR-IN-889127394",
    estimatedDelivery: "18 Oct 2026",
  },
];

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>(["prod-1", "prod-3"]);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [verifiedPincode, setVerifiedPincode] = useState<{
    pincode: string;
    city: string;
    state: string;
    days: number;
    codAvailable: boolean;
  } | null>({
    pincode: "302001",
    city: "Jaipur",
    state: "Rajasthan",
    days: 3,
    codAvailable: true,
  });
  const [orders, setOrders] = useState<PlacedOrder[]>(DEFAULT_ORDERS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize with initial cart item from mock catalog
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("kusumika_cart");
      const savedWishlist = localStorage.getItem("kusumika_wishlist");
      const savedOrders = localStorage.getItem("kusumika_orders");

      if (savedCart) {
        setCart(JSON.parse(savedCart));
      } else {
        // Seed initial items for realistic demonstration
        setCart([
          {
            cartItemId: "seed-1",
            product: MOCK_CATALOG[0],
            selectedSize: "Double / Queen (84x100\")",
            selectedSwatch: MOCK_CATALOG[0].swatches[0],
            quantity: 1,
          },
          {
            cartItemId: "seed-2",
            product: MOCK_CATALOG[2],
            selectedSize: "Double Quilt (90x100\")",
            selectedSwatch: MOCK_CATALOG[2].swatches[0],
            quantity: 1,
          },
        ]);
      }

      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      }

      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      }
    } catch {
      // Fallback
    }
    setIsInitialized(true);
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem("kusumika_cart", JSON.stringify(cart));
      localStorage.setItem("kusumika_wishlist", JSON.stringify(wishlist));
      localStorage.setItem("kusumika_orders", JSON.stringify(orders));
    } catch {
      // Ignore
    }
  }, [cart, wishlist, orders, isInitialized]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const addToCart = (
    product: Product,
    selectedSize = "Double / Queen (84x100\")",
    selectedSwatch = product.swatches[0],
    quantity = 1
  ) => {
    const existingIndex = cart.findIndex(
      (item) =>
        item.product.id === product.id &&
        item.selectedSize === selectedSize &&
        item.selectedSwatch?.name === selectedSwatch?.name
    );

    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += quantity;
      setCart(updated);
    } else {
      const newItem: CartItem = {
        cartItemId: `${product.id}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        product,
        selectedSize,
        selectedSwatch,
        quantity,
      };
      setCart([...cart, newItem]);
    }

    showToast(`Added "${product.title}" to your sanctuary cart!`);
    setIsCartDrawerOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    const removedItem = cart.find((i) => i.cartItemId === cartItemId);
    setCart(cart.filter((item) => item.cartItemId !== cartItemId));
    if (removedItem) {
      showToast(`Removed "${removedItem.product.title}" from cart.`);
    }
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(
      cart.map((item) =>
        item.cartItemId === cartItemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (product: Product) => {
    if (wishlist.includes(product.id)) {
      setWishlist(wishlist.filter((id) => id !== product.id));
      showToast(`Removed "${product.title}" from your wishlist.`);
    } else {
      setWishlist([...wishlist, product.id]);
      showToast(`Saved "${product.title}" to your wishlist!`);
    }
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const applyCoupon = (code: string): boolean => {
    const cleanCode = code.trim().toUpperCase();
    const found = VALID_COUPONS[cleanCode];
    if (!found) {
      setCouponError("Invalid coupon code. Try 'FESTIVE500' or 'KUSUMIKA10'.");
      return false;
    }
    if (found.minOrder && subtotal < found.minOrder) {
      setCouponError(`This code requires a minimum order of ₹${found.minOrder}.`);
      return false;
    }
    setAppliedCoupon(found);
    setCouponError(null);
    showToast(`Coupon "${cleanCode}" applied successfully!`);
    return true;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
    showToast("Coupon removed.");
  };

  const checkPincode = (pin: string) => {
    const cleanPin = pin.trim();
    if (!/^\d{6}$/.test(cleanPin)) {
      return {
        valid: false,
        message: "Please enter a valid 6-digit Indian postal pincode.",
      };
    }

    // Realistic delivery estimation based on pincode prefix
    let city = "Jaipur / Rajasthan Hub";
    let state = "Rajasthan";
    let days = 2;

    if (cleanPin.startsWith("11") || cleanPin.startsWith("12") || cleanPin.startsWith("20")) {
      city = "Delhi NCR";
      state = "Delhi NCR";
      days = 3;
    } else if (cleanPin.startsWith("40") || cleanPin.startsWith("41")) {
      city = "Mumbai / Pune Region";
      state = "Maharashtra";
      days = 3;
    } else if (cleanPin.startsWith("56")) {
      city = "Bengaluru Urban";
      state = "Karnataka";
      days = 4;
    } else if (cleanPin.startsWith("60")) {
      city = "Chennai";
      state = "Tamil Nadu";
      days = 4;
    } else if (cleanPin.startsWith("70")) {
      city = "Kolkata";
      state = "West Bengal";
      days = 4;
    } else {
      city = "Pan-India Hub";
      state = "India";
      days = 4;
    }

    const verified = {
      pincode: cleanPin,
      city,
      state,
      days,
      codAvailable: true,
    };

    setVerifiedPincode(verified);
    return {
      valid: true,
      city,
      days,
      message: `Delivery to ${cleanPin} (${city}) in ${days}–${days + 1} business days • Partial COD Eligible.`,
    };
  };

  // Calculations
  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === "flat") {
      discount = appliedCoupon.value;
    } else if (appliedCoupon.type === "percent") {
      discount = Math.round((subtotal * appliedCoupon.value) / 100);
    }
  }

  const shippingFee = 0; // Complimentary Pan-India delivery
  const total = Math.max(0, subtotal - discount + shippingFee);

  // Partial COD calculation rule:
  // Advance is min ₹500, or 20% of order if order > ₹3000, rounded to nearest ₹50
  const advancePayable =
    total > 0
      ? total <= 2500
        ? Math.min(500, total)
        : Math.min(2000, Math.round((total * 0.2) / 50) * 50)
      : 0;

  const balanceDue = Math.max(0, total - advancePayable);

  const placeOrder = (
    orderDetails: Omit<
      PlacedOrder,
      "orderId" | "date" | "status" | "trackingNumber" | "estimatedDelivery"
    >
  ): PlacedOrder => {
    const orderNumber = Math.floor(10000 + Math.random() * 90000);
    const trackingSuffix = Math.floor(100000000 + Math.random() * 900000000);

    const newOrder: PlacedOrder = {
      ...orderDetails,
      orderId: `KSM-${orderNumber}`,
      date: new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date()),
      status: "Order Placed",
      trackingNumber: `SR-IN-${trackingSuffix}`,
      estimatedDelivery: "In 3–4 business days",
    };

    const updated = [newOrder, ...orders];
    setOrders(updated);
    clearCart();
    showToast(`Order ${newOrder.orderId} placed successfully!`);
    return newOrder;
  };

  const getOrderById = (orderId: string) => {
    return orders.find(
      (o) => o.orderId.toLowerCase() === orderId.toLowerCase()
    );
  };

  return (
    <StoreContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        wishlist,
        toggleWishlist,
        isInWishlist,
        appliedCoupon,
        couponError,
        applyCoupon,
        removeCoupon,
        verifiedPincode,
        checkPincode,
        subtotal,
        discount,
        shippingFee,
        total,
        advancePayable,
        balanceDue,
        orders,
        placeOrder,
        getOrderById,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};
