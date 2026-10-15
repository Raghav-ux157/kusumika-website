export interface GstTaxBreakdown {
  taxableAmount: number;
  gstRate: number; // e.g. 5 or 12
  isInterState: boolean;
  cgstRate?: number; // e.g. 2.5 or 6
  cgstAmount?: number;
  sgstRate?: number; // e.g. 2.5 or 6
  sgstAmount?: number;
  igstRate?: number; // e.g. 5 or 12
  igstAmount?: number;
  totalTax: number;
}

export interface GstInvoiceLineItem {
  id: string;
  itemDescription: string;
  hsnCode: string; // "6302" for Bed linen, "9404" for Dohars/Razais
  quantity: number;
  unit: string; // "SET", "PCS"
  unitPrice: number;
  discount: number;
  taxableValue: number;
  gstRate: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  total: number;
}

export interface GstInvoice {
  invoiceNumber: string; // e.g. "INV/KSM/26-27/08492"
  invoiceDate: string;
  orderNumber: string;
  orderDate: string;
  paymentMode: "partial_cod" | "prepaid" | "full_cod";
  razorpayPaymentId?: string;

  // Supplier
  supplier: {
    legalName: string;
    tradeName: string;
    address: string;
    city: string;
    state: string;
    stateCode: string; // "08"
    pincode: string;
    gstin: string; // "08AAAAK1234A1Z5"
    pan: string;
    cin?: string;
    contactEmail: string;
    contactPhone: string;
  };

  // Recipient / Patron
  recipient: {
    customerName: string;
    billingAddress: string;
    shippingAddress: string;
    city: string;
    state: string;
    stateCode: string;
    pincode: string;
    phone: string;
    email: string;
    gstin?: string | null; // Customer GSTIN if hospitality B2B
  };

  // Place of Supply
  placeOfSupply: string;
  isInterState: boolean;

  // Line items
  items: GstInvoiceLineItem[];

  // Financial Totals
  subtotalTaxable: number;
  totalCgst: number;
  totalSgst: number;
  totalIgst: number;
  totalTax: number;
  roundOff: number;
  grandTotal: number;
  amountInWords: string;

  // Partial COD Ledger
  advancePaidOnline: number;
  doorstepBalanceDue: number;
  balanceInWords: string;

  // Logistics
  transporterName?: string;
  awbNumber?: string;
  reverseChargeApplicable: boolean;
}
