import { NextRequest, NextResponse } from "next/server";
import { generateGstTaxInvoice } from "@/lib/invoicing/gstInvoiceService";
import { MOCK_CATALOG } from "@/lib/mockCatalog";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id;
    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required." }, { status: 400 });
    }

    // Generate certified GST invoice
    const invoice = generateGstTaxInvoice({
      orderNumber: orderId,
      customerName: "Radhika Sharma",
      customerEmail: "radhika.sharma@example.com",
      customerPhone: "+91 98765 43210",
      address: "B-42, Gulabi Bagh, Near Civil Lines",
      city: "Jaipur",
      state: "Rajasthan",
      pincode: "302006",
      items: [
        {
          title: MOCK_CATALOG[0].title,
          variantSize: "King Palatial (108x108\")",
          swatchName: "Natural Indigo",
          quantity: 1,
          price: MOCK_CATALOG[0].price,
        },
      ],
      subtotal: MOCK_CATALOG[0].price,
      discount: 0,
      shippingFee: 0,
      total: MOCK_CATALOG[0].price,
      advancePaid: 500,
      balanceDue: MOCK_CATALOG[0].price - 500,
      paymentMode: "partial_cod",
      razorpayPaymentId: `pay_rzp_${Date.now()}`,
      trackingNumber: "SR-BD-889127394",
      courierName: "BlueDart Air Express",
    });

    return NextResponse.json({ success: true, invoice });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to generate invoice." },
      { status: 500 }
    );
  }
}
