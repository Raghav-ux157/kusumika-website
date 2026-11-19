import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  verifyStaffSessionToken,
} from "@/lib/auth/adminAuth";

export async function GET(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    const session = await verifyStaffSessionToken(sessionCookie);

    if (!session) {
      return NextResponse.json(
        { authenticated: false, error: "Unauthorized. Staff session not found or expired." },
        { status: 401 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        userId: session.userId,
        email: session.email,
        fullName: session.fullName,
        role: session.role,
        expiresAt: session.expiresAt,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to inspect staff session." },
      { status: 500 }
    );
  }
}
