"use client";

import React from "react";
import { GstInvoice } from "@/types/invoice";
import { formatPrice } from "@/lib/utils";

interface GstInvoiceViewProps {
  invoice: GstInvoice;
  showPrintButton?: boolean;
}

export const GstInvoiceView: React.FC<GstInvoiceViewProps> = ({
  invoice,
  showPrintButton = true,
}) => {
  const isPartialCod = invoice.doorstepBalanceDue > 0;

  return (
    <div className="bg-surface text-on-surface">
      {/* ACTION BAR (Hidden when printing) */}
      {showPrintButton && (
        <div className="print:hidden flex items-center justify-between bg-surface-container p-4 rounded-xl mb-6 border border-outline-variant/60 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">
              receipt_long
            </span>
            <span className="font-serif text-lg text-primary font-bold">
              Tax Invoice #{invoice.invoiceNumber}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-4 py-2 rounded-lg bg-primary text-on-primary font-sans text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center gap-2 shadow"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>Print Tax Invoice (A4)</span>
            </button>
          </div>
        </div>
      )}

      {/* A4 PRINTABLE INVOICE SHEET */}
      <div className="bg-surface border border-outline-variant/60 p-6 sm:p-10 rounded-2xl shadow-md max-w-[850px] mx-auto text-xs font-sans print:border-none print:shadow-none print:p-0 print:max-w-none">
        {/* HEADER BAR */}
        <div className="flex justify-between items-start border-b-2 border-primary pb-6 gap-6">
          <div className="space-y-1 max-w-sm">
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl font-bold tracking-tight text-primary">
                KUSUMIKA
              </span>
              <span className="px-2 py-0.5 rounded bg-surface-container text-[10px] uppercase font-bold tracking-widest text-secondary border border-outline-variant/40">
                Atelier Handlooms
              </span>
            </div>
            <p className="font-serif italic text-xs text-secondary">
              "Soft like Silk, Feels like a Hug"
            </p>
            <p className="text-[11px] text-on-surface-variant leading-relaxed pt-1">
              <strong>{invoice.supplier.legalName}</strong><br />
              {invoice.supplier.address}, {invoice.supplier.city}, {invoice.supplier.state} - {invoice.supplier.pincode}<br />
              <strong>GSTIN:</strong> {invoice.supplier.gstin} | <strong>State Code:</strong> {invoice.supplier.stateCode}<br />
              <strong>PAN:</strong> {invoice.supplier.pan} | <strong>CIN:</strong> {invoice.supplier.cin}
            </p>
          </div>

          <div className="text-right space-y-1">
            <div className="inline-block px-3 py-1 bg-surface-container text-primary font-serif font-bold text-sm uppercase tracking-wider rounded border border-outline-variant/60 mb-1">
              TAX INVOICE
            </div>
            <div className="font-mono text-xs">
              <strong>Invoice No:</strong> {invoice.invoiceNumber}
            </div>
            <div className="text-on-surface-variant">
              <strong>Invoice Date:</strong> {invoice.invoiceDate}
            </div>
            <div className="text-on-surface-variant">
              <strong>Order No:</strong> #{invoice.orderNumber}
            </div>
            <div className="text-on-surface-variant">
              <strong>Place of Supply:</strong> {invoice.placeOfSupply}
            </div>
            <div className="text-[10px] text-tertiary font-medium">
              Reverse Charge: {invoice.reverseChargeApplicable ? "Yes" : "No"}
            </div>
          </div>
        </div>

        {/* RECIPIENT & DISPATCH META */}
        <div className="grid grid-cols-2 gap-6 py-5 border-b border-outline-variant/40">
          <div>
            <div className="font-bold uppercase tracking-wider text-[11px] text-primary mb-1">
              Billed & Shipped To (Patron):
            </div>
            <div className="font-semibold text-sm text-on-surface">
              {invoice.recipient.customerName}
            </div>
            <div className="text-on-surface-variant leading-relaxed">
              {invoice.recipient.shippingAddress}<br />
              {invoice.recipient.city}, {invoice.recipient.state} - {invoice.recipient.pincode}<br />
              <strong>Phone:</strong> {invoice.recipient.phone} | <strong>Email:</strong> {invoice.recipient.email}
            </div>
            {invoice.recipient.gstin && (
              <div className="mt-1 text-[11px] font-mono text-primary font-bold">
                Customer GSTIN: {invoice.recipient.gstin}
              </div>
            )}
          </div>

          <div className="bg-surface-container-low p-3.5 rounded-lg border border-outline-variant/30 space-y-1">
            <div className="font-bold uppercase tracking-wider text-[11px] text-secondary">
              Logistics & Settlement Radar
            </div>
            <div>
              <strong>Courier Partner:</strong> {invoice.transporterName}
            </div>
            <div>
              <strong>AWB Consignment No:</strong> {invoice.awbNumber}
            </div>
            <div>
              <strong>Payment Mode:</strong>{" "}
              <span className="capitalize font-bold text-primary">
                {invoice.paymentMode.replace("_", " ")}
              </span>
            </div>
            <div>
              <strong>Razorpay Reference:</strong>{" "}
              <span className="font-mono text-[11px]">
                {invoice.razorpayPaymentId}
              </span>
            </div>
          </div>
        </div>

        {/* LINE ITEMS TABLE */}
        <div className="py-4">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-outline-variant text-[11px] font-bold uppercase tracking-wider text-primary bg-surface-container-lowest">
                <th className="py-2.5 px-2">#</th>
                <th className="py-2.5 px-2">Product Description</th>
                <th className="py-2.5 px-2 text-center">HSN</th>
                <th className="py-2.5 px-2 text-center">Qty</th>
                <th className="py-2.5 px-2 text-right">Unit Rate</th>
                <th className="py-2.5 px-2 text-right">Taxable Val</th>
                <th className="py-2.5 px-2 text-center">GST</th>
                {invoice.isInterState ? (
                  <th className="py-2.5 px-2 text-right">IGST</th>
                ) : (
                  <>
                    <th className="py-2.5 px-2 text-right">CGST</th>
                    <th className="py-2.5 px-2 text-right">SGST</th>
                  </>
                )}
                <th className="py-2.5 px-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30 text-[11px]">
              {invoice.items.map((item, idx) => (
                <tr key={item.id} className="hover:bg-surface-container-lowest">
                  <td className="py-2.5 px-2 text-on-surface-variant">{idx + 1}</td>
                  <td className="py-2.5 px-2 font-medium text-on-surface">
                    {item.itemDescription}
                  </td>
                  <td className="py-2.5 px-2 text-center font-mono">{item.hsnCode}</td>
                  <td className="py-2.5 px-2 text-center">{item.quantity}</td>
                  <td className="py-2.5 px-2 text-right">₹{item.unitPrice.toLocaleString("en-IN")}</td>
                  <td className="py-2.5 px-2 text-right">₹{item.taxableValue.toLocaleString("en-IN")}</td>
                  <td className="py-2.5 px-2 text-center font-mono">{item.gstRate}%</td>
                  {invoice.isInterState ? (
                    <td className="py-2.5 px-2 text-right">₹{item.igstAmount.toLocaleString("en-IN")}</td>
                  ) : (
                    <>
                      <td className="py-2.5 px-2 text-right">₹{item.cgstAmount.toLocaleString("en-IN")}</td>
                      <td className="py-2.5 px-2 text-right">₹{item.sgstAmount.toLocaleString("en-IN")}</td>
                    </>
                  )}
                  <td className="py-2.5 px-2 text-right font-bold text-primary">
                    ₹{item.total.toLocaleString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* TOTALS & FINANCIAL SUMMARY */}
        <div className="grid grid-cols-12 gap-6 pt-3 border-t-2 border-outline-variant">
          <div className="col-span-7 space-y-3">
            <div>
              <span className="font-bold uppercase tracking-wider text-[10px] text-outline">
                Total Invoice Value (in words):
              </span>
              <p className="font-serif italic text-xs font-semibold text-primary pt-0.5">
                {invoice.amountInWords}
              </p>
            </div>

            {/* PARTIAL COD RECONCILIATION HIGHLIGHT */}
            <div className="p-3 rounded-lg bg-surface-container border border-outline-variant/60 space-y-1.5">
              <div className="flex items-center gap-1.5 text-secondary font-bold text-[11px] uppercase tracking-wider">
                <span className="material-symbols-outlined text-[16px]">payments</span>
                <span>Partial COD Settlement Ledger</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-1.5 rounded bg-surface border border-outline-variant/30">
                  <span className="text-[10px] text-outline uppercase block">Advance Settled Online</span>
                  <span className="font-bold text-secondary text-sm">₹{invoice.advancePaidOnline.toLocaleString("en-IN")}</span>
                </div>
                <div className="p-1.5 rounded bg-surface border border-outline-variant/30">
                  <span className="text-[10px] text-outline uppercase block">Doorstep Balance Due</span>
                  <span className="font-bold text-primary text-sm">₹{invoice.doorstepBalanceDue.toLocaleString("en-IN")}</span>
                </div>
              </div>
              {isPartialCod && (
                <p className="text-[10px] text-outline pt-0.5">
                  Balance in words: <em>{invoice.balanceInWords}</em>
                </p>
              )}
            </div>

            <div className="text-[10px] text-on-surface-variant leading-relaxed">
              <strong>Declaration:</strong> We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct. Handcrafted in Bagru & Sanganer craft clusters under fair artisan compensation.
            </div>
          </div>

          <div className="col-span-5 space-y-2 text-xs">
            <div className="flex justify-between py-1 text-on-surface-variant">
              <span>Total Taxable Value:</span>
              <span className="font-mono">₹{invoice.subtotalTaxable.toLocaleString("en-IN")}</span>
            </div>
            {invoice.isInterState ? (
              <div className="flex justify-between py-1 text-on-surface-variant">
                <span>Integrated GST (IGST):</span>
                <span className="font-mono">₹{invoice.totalIgst.toLocaleString("en-IN")}</span>
              </div>
            ) : (
              <>
                <div className="flex justify-between py-1 text-on-surface-variant">
                  <span>Central GST (CGST):</span>
                  <span className="font-mono">₹{invoice.totalCgst.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between py-1 text-on-surface-variant">
                  <span>State GST (SGST):</span>
                  <span className="font-mono">₹{invoice.totalSgst.toLocaleString("en-IN")}</span>
                </div>
              </>
            )}
            <div className="flex justify-between py-1 text-on-surface-variant">
              <span>Total Tax:</span>
              <span className="font-mono">₹{invoice.totalTax.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between py-1 text-on-surface-variant">
              <span>Round Off:</span>
              <span className="font-mono">₹{invoice.roundOff.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between py-2 border-t-2 border-primary text-sm font-bold text-primary">
              <span>Grand Total:</span>
              <span>₹{invoice.grandTotal.toLocaleString("en-IN")}</span>
            </div>

            {/* AUTHORIZED SIGNATORY STAMP */}
            <div className="pt-6 text-center space-y-1">
              <div className="inline-block p-2 rounded-full border border-primary/40 bg-surface-container text-primary">
                <span className="material-symbols-outlined text-[28px]">verified</span>
              </div>
              <div className="text-[11px] font-bold text-primary">
                For Kusumika Artisanal Textiles Pvt. Ltd.
              </div>
              <div className="text-[10px] text-outline">
                Authorized Signatory & Loom QA Registrar
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
