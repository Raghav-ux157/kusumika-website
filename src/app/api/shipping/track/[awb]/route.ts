import { NextRequest, NextResponse } from "next/server";
import { trackShipment } from "@/lib/shipping/shiprocket";

export async function GET(
  req: NextRequest,
  { params }: { params: { awb: string } }
) {
  try {
    const awb = params.awb;
    if (!awb) {
      return NextResponse.json(
        { error: "AWB or Order ID parameter is required." },
        { status: 400 }
      );
    }

    const shipment = await trackShipment(awb);

    if (!shipment) {
      return NextResponse.json(
        { error: `No active shipment found for identifier: ${awb}` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      shipment,
    });
  } catch (error: any) {
    console.error("[Track Shipment API Error]:", error);
    return NextResponse.json(
      { error: error.message || "Failed to retrieve tracking data." },
      { status: 500 }
    );
  }
}
