import { GstInvoice, GstInvoiceLineItem } from "@/types/invoice";

export const KUSUMIKA_SUPPLIER_PROFILE = {
  legalName: "Kusumika Artisanal Textiles Private Limited",
  tradeName: "Kusumika Luxury Home Textiles",
  address: "Atelier Block, Weavers Colony, Bagru & Sanganer Artisanal Road",
  city: "Jaipur",
  state: "Rajasthan",
  stateCode: "08",
  pincode: "302029",
  gstin: "08AAAAK1234A1Z5",
  pan: "AAAAK1234A",
  cin: "U17299RJ2026PTC084920",
  contactEmail: "concierge@kusumika.com",
  contactPhone: "+91 141 2894 920",
};

export const INDIAN_STATE_CODES: Record<string, string> = {
  rajasthan: "08",
  maharashtra: "27",
  delhi: "07",
  karnataka: "29",
  tamilnadu: "33",
  "tamil nadu": "33",
  gujarat: "24",
  telangana: "36",
  "west bengal": "19",
  westbengal: "19",
  uttarpradesh: "09",
  "uttar pradesh": "09",
  haryana: "06",
  punjab: "03",
  kerala: "32",
  goa: "30",
  madhyapradesh: "23",
  "madhya pradesh": "23",
  bihar: "10",
  andhrapradesh: "37",
  "andhra pradesh": "37",
  odisha: "21",
};

export function getStateCode(stateName?: string): string {
  if (!stateName) return "08";
  const clean = stateName.toLowerCase().trim();
  return INDIAN_STATE_CODES[clean] || "08";
}

/**
 * Convert number to Indian Rupee Words (Lakhs & Crores system)
 */
export function numberToWordsInr(amount: number): string {
  const rounded = Math.round(amount);
  if (rounded === 0) return "Rupees Zero Only";

  const units = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen",
  ];
  const tens = [
    "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety",
  ];

  function convertTwoDigits(n: number): string {
    if (n < 20) return units[n];
    return tens[Math.floor(n / 10)] + (n % 10 ? " " + units[n % 10] : "");
  }

  function convertThreeDigits(n: number): string {
    const hundred = Math.floor(n / 100);
    const rest = n % 100;
    let res = "";
    if (hundred > 0) res += units[hundred] + " Hundred";
    if (rest > 0) res += (res ? " and " : "") + convertTwoDigits(rest);
    return res;
  }

  let crore = Math.floor(rounded / 10000000);
  let lakh = Math.floor((rounded % 10000000) / 100000);
  let thousand = Math.floor((rounded % 100000) / 1000);
  let remaining = rounded % 1000;

  let words = "";
  if (crore) words += convertThreeDigits(crore) + " Crore ";
  if (lakh) words += convertTwoDigits(lakh) + " Lakh ";
  if (thousand) words += convertTwoDigits(thousand) + " Thousand ";
  if (remaining) words += convertThreeDigits(remaining);

  return "Rupees " + words.trim() + " Only";
}

/**
 * Builds a certified GST Tax Invoice from Order Data
 */
export function generateGstTaxInvoice(orderData: {
  orderNumber: string;
  orderDate?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  items: Array<{
    title: string;
    variantSize?: string | null;
    swatchName?: string | null;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  advancePaid: number;
  balanceDue: number;
  paymentMode: string;
  razorpayPaymentId?: string;
  trackingNumber?: string;
  courierName?: string;
  customerGstin?: string | null;
}): GstInvoice {
  const recipientStateCode = getStateCode(orderData.state);
  const isInterState = recipientStateCode !== KUSUMIKA_SUPPLIER_PROFILE.stateCode;

  // Process Line Items with statutory HSN and tax breakdown
  let subtotalTaxable = 0;
  let totalCgst = 0;
  let totalSgst = 0;
  let totalIgst = 0;

  const invoiceItems: GstInvoiceLineItem[] = orderData.items.map((item, idx) => {
    // Bed linen & towels: HSN 6302. Dohars/quilts: HSN 9404.
    const isQuilt = item.title.toLowerCase().includes("dohar") || item.title.toLowerCase().includes("razai");
    const hsnCode = isQuilt ? "9404" : "6302";
    const gstRate = 12; // 12% standard GST for luxury home textiles

    const grossLineTotal = item.price * item.quantity;
    // Backward calculate taxable value from gross inclusive total
    const taxableValue = Math.round((grossLineTotal / (1 + gstRate / 100)) * 100) / 100;
    const taxTotal = Math.round((grossLineTotal - taxableValue) * 100) / 100;

    let cgst = 0;
    let sgst = 0;
    let igst = 0;

    if (isInterState) {
      igst = taxTotal;
      totalIgst += igst;
    } else {
      cgst = Math.round((taxTotal / 2) * 100) / 100;
      sgst = Math.round((taxTotal - cgst) * 100) / 100;
      totalCgst += cgst;
      totalSgst += sgst;
    }

    subtotalTaxable += taxableValue;

    const descParts = [item.title];
    if (item.variantSize) descParts.push(`Size: ${item.variantSize}`);
    if (item.swatchName) descParts.push(`Color: ${item.swatchName}`);

    return {
      id: `item-${idx + 1}`,
      itemDescription: descParts.join(" • "),
      hsnCode,
      quantity: item.quantity,
      unit: "SET",
      unitPrice: item.price,
      discount: 0,
      taxableValue,
      gstRate,
      cgstAmount: cgst,
      sgstAmount: sgst,
      igstAmount: igst,
      total: grossLineTotal,
    };
  });

  const totalTax = isInterState ? totalIgst : totalCgst + totalSgst;
  const calculatedGrandTotal = subtotalTaxable + totalTax;
  const roundOff = Math.round(orderData.total - calculatedGrandTotal);
  const grandTotal = orderData.total;

  const cleanNum = orderData.orderNumber.replace(/\D/g, "").slice(-5) || "08492";
  const invoiceNumber = `INV/KSM/26-27/${cleanNum}`;

  return {
    invoiceNumber,
    invoiceDate: new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    orderNumber: orderData.orderNumber,
    orderDate: orderData.orderDate || new Date().toLocaleDateString("en-IN"),
    paymentMode: orderData.paymentMode as any,
    razorpayPaymentId: orderData.razorpayPaymentId || "pay_rzp_captured_live",

    supplier: KUSUMIKA_SUPPLIER_PROFILE,

    recipient: {
      customerName: orderData.customerName,
      billingAddress: orderData.address,
      shippingAddress: orderData.address,
      city: orderData.city,
      state: orderData.state,
      stateCode: recipientStateCode,
      pincode: orderData.pincode,
      phone: orderData.customerPhone,
      email: orderData.customerEmail,
      gstin: orderData.customerGstin,
    },

    placeOfSupply: `${orderData.state} (${recipientStateCode})`,
    isInterState,

    items: invoiceItems,

    subtotalTaxable: Math.round(subtotalTaxable * 100) / 100,
    totalCgst: Math.round(totalCgst * 100) / 100,
    totalSgst: Math.round(totalSgst * 100) / 100,
    totalIgst: Math.round(totalIgst * 100) / 100,
    totalTax: Math.round(totalTax * 100) / 100,
    roundOff,
    grandTotal,
    amountInWords: numberToWordsInr(grandTotal),

    advancePaidOnline: orderData.advancePaid,
    doorstepBalanceDue: orderData.balanceDue,
    balanceInWords: numberToWordsInr(orderData.balanceDue),

    transporterName: orderData.courierName || "BlueDart Surface Express",
    awbNumber: orderData.trackingNumber || "SR-BD-889127394",
    reverseChargeApplicable: false,
  };
}
