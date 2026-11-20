import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key") || "operational_policy";

    const supabase = getSupabaseAdminClient();

    if (supabase) {
      const { data, error } = await (supabase as any)
        .from("site_settings")
        .select("*")
        .eq("key", key)
        .maybeSingle();

      if (!error && data) {
        return NextResponse.json({ success: true, key: data.key, value: data.value });
      }
    }

    // Default operational settings if not yet in database
    const defaultSettings: Record<string, any> = {
      operational_policy: {
        partialCodEnabled: true,
        minCodAdvance: 500,
        codPercentage: 20,
        maxCodAdvance: 2000,
        doorstepInspectionOtp: true,
        autoAssignLooms: true,
        enableWhatsAppAlerts: true,
      },
    };

    return NextResponse.json({
      success: true,
      key,
      value: defaultSettings[key] || {},
      isDefault: true,
    });
  } catch (error: any) {
    console.error("[Site Settings GET Error]:", error);
    return NextResponse.json(
      { error: error.message || "Failed to retrieve site settings." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { key, value, description } = body;

    if (!key || value === undefined) {
      return NextResponse.json(
        { error: "Setting key and value are required." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdminClient();

    if (supabase) {
      const { data, error } = await (supabase as any)
        .from("site_settings")
        .upsert(
          {
            key,
            value,
            description: description || `Configuration for ${key}`,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "key" }
        )
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ success: true, setting: data });
    }

    return NextResponse.json({
      success: true,
      key,
      value,
      message: "Setting saved in local memory simulation.",
    });
  } catch (error: any) {
    console.error("[Site Settings POST Error]:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save site settings." },
      { status: 500 }
    );
  }
}
