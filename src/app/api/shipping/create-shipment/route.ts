import { NextRequest, NextResponse } from "next/server";
import { createShiprocketShipment } from "@/lib/shipping/shiprocket";
import { CreateShipmentPayload } from "@/types/shipping";

export async function POST(req: NextRequest) {
  try {
    const body: CreateShipmentPayload = await req.json();

    if (!body.orderId || !body.customerName || !body.deliveryAddress) {
      return NextResponse.json(
        { error: "Order ID, customer name, and delivery address are required." },
        { status: 400 }
      );
    }

    const shipment = await createShiprocketShipment(body);

    return NextResponse.json({
      success: true,
      shipment,
      message: `Shipment booked with ${shipment.courierName}. AWB: ${shipment.awbCode}`,
    });
  } catch (error: any) {
    console.error("[Create Shipment API Error]:", error);
    return NextResponse.json(
      { error: error.message || "Failed to book shipment with Shiprocket." },
      { status: 500 }
    );
  }
}
