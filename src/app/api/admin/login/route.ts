import { NextRequest, NextResponse } from "next/server";
import {
  authenticateStaffCredentials,
  createStaffSessionToken,
  ADMIN_SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
} from "@/lib/auth/adminAuth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    const result = await authenticateStaffCredentials(email, password);

    if (!result.success || !result.session) {
      return NextResponse.json(
        { error: result.error || "Authentication failed." },
        { status: 401 }
      );
    }

    const token = await createStaffSessionToken(result.session);

    const response = NextResponse.json({
      success: true,
      user: {
        userId: result.session.userId,
        email: result.session.email,
        fullName: result.session.fullName,
        role: result.session.role,
      },
    });

    // Set secure HTTP-only cookie
    response.cookies.set({
      name: ADMIN_SESSION_COOKIE,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_MAX_AGE_SECONDS,
      path: "/",
    });

    return response;
  } catch (err: any) {
    console.error("[Admin Login Route Error]:", err);
    return NextResponse.json(
      { error: err.message || "An unexpected error occurred during login." },
      { status: 500 }
    );
  }
}
