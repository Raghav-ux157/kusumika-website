"use client";

import React, { useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import { AdminOrder } from "@/types/admin";
import { formatPrice, cn } from "@/lib/utils";

const ORDER_STATUS_FLOW: AdminOrder["status"][] = [
  "Order Placed",
  "Loom Assigned",
  "Natural Dyeing",
  "Quality Inspected",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus, markCodBalanceCollected, showToast } = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer_phone.includes(searchTerm) ||
      o.tracking_awb.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.shipping_address.city?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPayment =
      paymentFilter === "all" ||
      (paymentFilter === "cod_due" && o.payment_mode === "partial_cod" && !o.cod_collected) ||
      (paymentFilter === "prepaid" && o.payment_mode !== "partial_cod") ||
      (paymentFilter === "cod_collected" && o.cod_collected);

    const matchesStatus = statusFilter === "all" || o.status === statusFilter;

    return matchesSearch && matchesPayment && matchesStatus;
  });

  const pendingCodOrders = orders.filter((o) => o.payment_mode === "partial_cod" && !o.cod_collected);
  const totalCodDueAmount = pendingCodOrders.reduce((sum, o) => sum + o.balance_due, 0);

  const handlePrintAwb = (order: AdminOrder) => {
    showToast(`Generating BlueDart Air Waybill: ${order.tracking_awb}`);
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Kusumika AWB - ${order.order_number}</title>
            <style>
              body { font-family: monospace; padding: 24px; color: #221a17; }
              .box { border: 2px solid #5c181a; padding: 20px; border-radius: 8px; max-width: 500px; margin: auto; }
              h2 { margin: 0 0 10px 0; color: #5c181a; }
              .barcode { font-size: 28px; letter-spacing: 4px; margin: 15px 0; text-align: center; }
            </style>
          </head>
          <body>
            <div class="box">
              <h2>🪷 KUSUMIKA LUXURY TEXTILES</h2>
              <p><strong>AWB:</strong> ${order.tracking_awb} (${order.tracking_carrier})</p>
              <div class="barcode">||| | ||||| |||| | |||||||</div>
              <p><strong>Order Ref:</strong> ${order.order_number}</p>
              <p><strong>To:</strong> ${order.customer_name}<br>${order.shipping_address.address_line1}, ${order.shipping_address.city} - ${order.shipping_address.pincode}</p>
              <p><strong>Phone:</strong> ${order.customer_phone}</p>
              <hr/>
              <p><strong>Payment Mode:</strong> ${order.payment_mode === "partial_cod" ? "PARTIAL COD" : "PREPAID ONLINE"}</p>
              <p><strong>Doorstep COD Cash/UPI Due:</strong> ₹${order.balance_due.toLocaleString("en-IN")}</p>
              <p><em>* Doorstep Inspection Wax Seal Permitted Prior to Payment Collection.</em></p>
            </div>
            <script>window.print();</script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <div className="px-4 sm:px-8 py-6 space-y-6 max-w-[1700px] mx-auto">
      {/* Top Breadcrumb & Metadata */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-outline-variant/30">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-on-surface-variant font-semibold">
          <span>Orders</span>
          <span className="text-outline">/</span>
          <span className="text-primary">All Orders & Doorstep Payments</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-on-surface-variant bg-surface-container-high px-3 py-1 rounded-full">
          <span className="w-2 h-2 rounded-full bg-tertiary" />
          <span>Synchronized with 3 Weaving Clusters: 2 mins ago</span>
        </div>
      </div>

      {/* Page Title & Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl text-primary font-normal tracking-tight">
            Orders & Delivery Payments
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
            Track all active orders, partial cash-on-delivery payments, and prepaid hotel consignments.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              const codPending = orders.filter((o) => o.payment_mode === "partial_cod" && !o.cod_collected);
              showToast(`WhatsApp payment reminders queued for ${codPending.length} patrons with balance due.`);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold shadow-sm border border-outline-variant/30"
          >
            <span className="material-symbols-outlined text-[16px] text-tertiary">notifications_active</span>
            <span>Send Payment Reminders</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-outline font-semibold">
              Total Active Orders
            </span>
            <span className="material-symbols-outlined text-primary text-[18px]">receipt_long</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl font-bold text-on-surface">{orders.length}</span>
            <span className="text-xs text-on-surface-variant">Consignments</span>
          </div>
          <p className="text-[11px] text-on-surface-variant">Pan-India insured transit</p>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-outline font-semibold">
              Ready to Ship
            </span>
            <span className="material-symbols-outlined text-secondary text-[18px]">inventory_2</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl font-bold text-secondary">
              {orders.filter((o) => o.status === "Quality Inspected").length}
            </span>
            <span className="text-xs text-secondary font-medium">Packages Ready</span>
          </div>
          <p className="text-[11px] text-on-surface-variant">BlueDart pickup scheduled</p>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-outline font-semibold">
              In Loom Weaving
            </span>
            <span className="material-symbols-outlined text-tertiary text-[18px]">texture</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl font-bold text-on-surface">
              {orders.filter((o) => o.status === "Loom Assigned" || o.status === "Natural Dyeing").length}
            </span>
            <span className="text-xs text-tertiary font-medium">Active Looms</span>
          </div>
          <p className="text-[11px] text-on-surface-variant">Sanganer (8) • Bagru (4)</p>
        </div>

        {/* Highlight Card: Partial COD Balance Due */}
        <div className="bg-surface-container-high p-4 rounded-xl border-2 border-primary/20 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-primary font-bold">
              Pending Delivery Balance
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-secondary text-on-secondary">
              Due at Doorstep
            </span>
          </div>
          <div className="font-serif text-2xl font-bold text-primary">
            {formatPrice(totalCodDueAmount)}
          </div>
          <div className="flex items-center justify-between text-[11px] text-on-surface-variant">
            <span>{pendingCodOrders.length} orders awaiting balance</span>
            <span className="font-semibold text-secondary">BlueDart QR</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-outline font-semibold">
              Delivered Today
            </span>
            <span className="material-symbols-outlined text-tertiary text-[18px]">verified</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl font-bold text-tertiary">
              {orders.filter((o) => o.status === "Delivered").length}
            </span>
            <span className="text-xs text-tertiary font-medium">Reconciled</span>
          </div>
          <p className="text-[11px] text-on-surface-variant">100% OTP verified at doorstep</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
            search
          </span>
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface-container-low text-on-surface placeholder:text-outline text-xs pl-9 pr-3 py-2 rounded-lg border border-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Search Order ID (#KSM-...), Patron Name, Phone, or BlueDart AWB..."
            type="text"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="bg-surface-container-low text-on-surface text-xs font-semibold px-3 py-2 rounded-lg border border-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">Payment: All Types</option>
            <option value="cod_due">Partial COD - Balance Due ({pendingCodOrders.length})</option>
            <option value="cod_collected">Doorstep Balance Collected</option>
            <option value="prepaid">100% Fully Prepaid</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-surface-container-low text-on-surface text-xs font-semibold px-3 py-2 rounded-lg border border-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">Loom State: All Stages</option>
            {ORDER_STATUS_FLOW.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Consignments Table */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="bg-surface-container-low text-on-surface uppercase tracking-wider border-b border-outline-variant/30 select-none">
                <th className="py-3.5 px-4 font-semibold">Order ID & Date</th>
                <th className="py-3.5 px-4 font-semibold">Patron & Destination</th>
                <th className="py-3.5 px-4 font-semibold">Items & Weaving Cluster</th>
                <th className="py-3.5 px-4 font-semibold text-right">Order Value</th>
                <th className="py-3.5 px-4 font-semibold min-w-[240px]">Payment Breakdown & COD Status</th>
                <th className="py-3.5 px-4 font-semibold">Delivery State</th>
                <th className="py-3.5 px-4 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-surface-container-low/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-mono font-bold text-primary text-sm">{order.order_number}</div>
                    <div className="text-[11px] text-outline font-mono mt-0.5">{order.tracking_awb}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-on-surface">{order.customer_name}</div>
                    <div className="text-[11px] text-outline font-mono">{order.customer_phone}</div>
                    <div className="text-[11px] text-on-surface-variant truncate max-w-xs">
                      {order.shipping_address.city}, {order.shipping_address.state}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="space-y-1">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="text-on-surface">
                          <span className="font-medium">{item.product_title}</span>
                          <span className="text-outline text-[11px]"> ({item.quantity}x • {item.variant_size})</span>
                        </div>
                      ))}
                      <div className="text-[11px] text-tertiary font-semibold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px]">palette</span>
                        <span>{order.cluster}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-right font-serif font-bold text-on-surface text-sm">
                    {formatPrice(order.total)}
                  </td>

                  {/* Payment Breakdown & Partial COD Ledger */}
                  <td className="py-3.5 px-4">
                    {order.payment_mode === "partial_cod" ? (
                      <div className="p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-on-surface-variant font-medium">Online Advance:</span>
                          <span className="font-bold text-secondary text-xs">
                            {formatPrice(order.advance_paid)} (Paid)
                          </span>
                        </div>
                        <div className="flex items-center justify-between border-t border-outline-variant/20 pt-1">
                          <span className="text-[10px] text-on-surface-variant font-medium">Doorstep Balance:</span>
                          <span className="font-bold text-primary text-xs">
                            {formatPrice(order.balance_due)}
                          </span>
                        </div>
                        <div className="pt-1 flex items-center justify-between">
                          {order.cod_collected ? (
                            <span className="text-[10px] font-bold text-tertiary flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">done_all</span>
                              Collected via {order.cod_collection_method?.toUpperCase()}
                            </span>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => markCodBalanceCollected(order.id, "upi")}
                                className="px-2 py-0.5 rounded bg-tertiary text-on-tertiary text-[10px] font-bold hover:bg-tertiary/90 transition-colors"
                              >
                                Collect UPI
                              </button>
                              <button
                                onClick={() => markCodBalanceCollected(order.id, "cash")}
                                className="px-2 py-0.5 rounded bg-surface-container-highest hover:bg-surface-container text-on-surface text-[10px] font-bold transition-colors"
                              >
                                Cash
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="p-2 rounded-lg bg-tertiary/10 text-tertiary text-xs font-semibold flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px]">verified</span>
                        <span>100% Prepaid Online via Razorpay</span>
                      </div>
                    )}
                  </td>

                  {/* Delivery Status Stepper */}
                  <td className="py-3.5 px-4">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value as AdminOrder["status"])}
                      className="text-xs font-semibold bg-surface-container-low px-2.5 py-1.5 rounded-lg border border-outline-variant/30 text-primary cursor-pointer"
                    >
                      {ORDER_STATUS_FLOW.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <div className="text-[10px] text-outline mt-1">{order.estimated_delivery}</div>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => handlePrintAwb(order)}
                        className="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary transition-colors"
                        title="Print BlueDart Air Waybill Label"
                      >
                        <span className="material-symbols-outlined text-[16px]">local_printshop</span>
                      </button>
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-outline hover:text-primary transition-colors"
                        title="View Full Consignment Dossier"
                      >
                        <span className="material-symbols-outlined text-[16px]">visibility</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL CONSIGNMENT MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface-container-lowest max-w-xl w-full rounded-2xl p-6 sm:p-8 shadow-2xl border border-outline-variant/40 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
              <div>
                <span className="text-[10px] font-sans uppercase tracking-widest text-secondary font-bold">
                  Consignment Dossier
                </span>
                <h3 className="font-serif text-2xl text-primary font-normal">
                  Order #{selectedOrder.order_number}
                </h3>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-outline hover:text-primary p-1">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="space-y-4 text-xs font-sans">
              <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/30 space-y-1">
                <span className="text-[10px] uppercase font-bold text-outline">Shipping Destination</span>
                <p className="text-on-surface font-medium leading-relaxed">
                  <strong>{selectedOrder.customer_name}</strong> ({selectedOrder.customer_phone})<br />
                  {selectedOrder.shipping_address.address_line1}<br />
                  {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} - {selectedOrder.shipping_address.pincode}
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-outline">Line Items</span>
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2 rounded bg-surface border border-outline-variant/20">
                    <div>
                      <strong className="text-on-surface">{item.product_title}</strong>
                      <div className="text-[11px] text-outline">Size: {item.variant_size} • Qty: {item.quantity}</div>
                    </div>
                    <span className="font-serif font-bold text-primary">{formatPrice(item.total)}</span>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-lg bg-surface-container border border-outline-variant/30 space-y-1">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatPrice(selectedOrder.subtotal)}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-secondary">
                    <span>Voucher Discount:</span>
                    <span>- {formatPrice(selectedOrder.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-primary text-sm pt-1 border-t border-outline-variant/30">
                  <span>Order Total:</span>
                  <span>{formatPrice(selectedOrder.total)}</span>
                </div>
                {selectedOrder.payment_mode === "partial_cod" && (
                  <div className="pt-2 text-[11px] space-y-0.5">
                    <div className="flex justify-between text-secondary font-semibold">
                      <span>Advance Paid Online:</span>
                      <span>{formatPrice(selectedOrder.advance_paid)}</span>
                    </div>
                    <div className="flex justify-between text-primary font-bold">
                      <span>Doorstep Balance Due:</span>
                      <span>{formatPrice(selectedOrder.balance_due)}</span>
                    </div>
                  </div>
                )}
              </div>

              {selectedOrder.notes && (
                <p className="text-on-surface-variant italic p-2 bg-surface-container-low rounded">
                  Notes: {selectedOrder.notes}
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-outline-variant/30">
              <button
                onClick={() => handlePrintAwb(selectedOrder)}
                className="px-4 py-2 bg-surface-container hover:bg-surface-container-high rounded-lg text-xs font-semibold text-primary"
              >
                Print BlueDart AWB
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-primary hover:bg-primary-container rounded-lg text-xs font-semibold text-on-primary"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
