"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { GstInvoiceView } from "@/components/commerce/GstInvoiceView";
import { generateGstTaxInvoice } from "@/lib/invoicing/gstInvoiceService";
import { useStore } from "@/context/StoreContext";
import { MOCK_CATALOG } from "@/lib/mockCatalog";

export default function OrderInvoicePage() {
  const params = useParams();
  const orderId = (params?.id as string) || "KSM-84920";
  const { getOrderById, orders } = useStore();

  const existingOrder = getOrderById(orderId);
  const order =
    existingOrder ||
    orders[0] || {
      orderId,
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
      trackingNumber: "SR-BD-889127394",
      estimatedDelivery: "18 Oct 2026",
    };

  const invoice = useMemo(() => {
    return generateGstTaxInvoice({
      orderNumber: order.orderId,
      orderDate: order.date,
      customerName: order.customerName,
      customerEmail: order.email,
      customerPhone: order.phone,
      address: order.address,
      city: order.city,
      state: order.state || "Rajasthan",
      pincode: order.pincode,
      items: order.items.map((i) => ({
        title: i.product.title,
        variantSize: i.selectedSize,
        swatchName: i.selectedSwatch?.name,
        quantity: i.quantity,
        price: i.product.price,
      })),
      subtotal: order.subtotal,
      discount: order.discount,
      shippingFee: order.shippingFee,
      total: order.total,
      advancePaid: order.advancePaid,
      balanceDue: order.balanceDue,
      paymentMode: order.paymentMode,
      razorpayPaymentId: `pay_rzp_${order.orderId.replace(/\D/g, "") || "84920"}`,
      trackingNumber: order.trackingNumber || "SR-BD-889127394",
      courierName: "BlueDart Air Express",
    });
  }, [order]);

  return (
    <div className="min-h-screen bg-surface-container-lowest p-4 sm:p-8 lg:p-12 print:p-0 print:bg-surface">
      <div className="max-w-[850px] mx-auto mb-4 print:hidden flex items-center justify-between text-xs font-sans text-on-surface-variant">
        <Link
          href={`/account/orders/${order.orderId}`}
          className="hover:text-primary transition-colors flex items-center gap-1 font-bold"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Back to Consignment Radar</span>
        </Link>
        <span>Government of India GST Compliant (Rule 46)</span>
      </div>

      <GstInvoiceView invoice={invoice} showPrintButton={true} />
    </div>
  );
}
