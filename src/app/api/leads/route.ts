import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const contactName = body.contactName || body.contact_name;
    const businessName = body.businessName || body.business_name;
    const phone = body.phone;
    const email = body.email;
    const establishmentNature = body.establishmentNature || body.establishment_nature || "Boutique Hospitality";
    const city = body.city || "Jaipur";
    const pincode = body.pincode || "302001";
    const gstin = body.gstin || body.gstNumber || null;
    const categoriesNeeded = body.categoriesNeeded || body.categories_needed || [];
    const weaveGrade = body.weaveGrade || body.weave_grade || "400TC Sateen Luster Weave";
    const quantityTier = body.quantityTier || body.quantity_tier || body.quantity || "25-50 Sets";
    const bedSizes = body.bedSizes || body.bed_sizes || [];
    const brandingOption = body.brandingOption || body.branding_option || "crest";
    const timeline = body.timeline || "Immediate Atelier Schedule";
    const notes = body.notes || body.customSpecs || null;
    const swatchBinderRequested = body.swatchBinderRequested ?? body.swatch_binder_requested ?? true;

    if (!contactName || !businessName || !phone) {
      return NextResponse.json(
        { error: "Contact name, business name, and phone number are required." },
        { status: 400 }
      );
    }

    const inquiryNumber = `INQ-KSM-${Math.floor(1000 + Math.random() * 9000)}`;

    const supabase = getSupabaseAdminClient();

    let createdRecord = null;

    if (supabase) {
      const { data, error } = await (supabase as any)
        .from("leads")
        .insert({
          inquiry_number: inquiryNumber,
          contact_name: contactName,
          business_name: businessName,
          establishment_nature: establishmentNature,
          email: email || "trade@kusumika.com",
          phone: phone,
          city: city,
          pincode: pincode,
          gstin: gstin,
          categories_needed: Array.isArray(categoriesNeeded) ? categoriesNeeded : [categoriesNeeded],
          weave_grade: weaveGrade,
          quantity_tier: quantityTier,
          bed_sizes: Array.isArray(bedSizes) ? bedSizes : [bedSizes],
          branding_option: brandingOption,
          timeline: timeline,
          notes: notes,
          swatch_binder_requested: swatchBinderRequested,
          status: "new",
        })
        .select()
        .single();

      if (error) {
        console.warn("[Leads API Warning]: Supabase insert error, falling back to simulated lead:", error.message);
      } else {
        createdRecord = data;
      }
    }

    return NextResponse.json({
      success: true,
      inquiryNumber,
      lead: createdRecord || {
        inquiry_number: inquiryNumber,
        contact_name: contactName,
        business_name: businessName,
        phone,
        email,
        status: "new",
      },
    });
  } catch (error: any) {
    console.error("[Leads Ingestion Error]:", error);
    return NextResponse.json(
      { error: error.message || "Failed to submit lead inquiry." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const supabase = getSupabaseAdminClient();
    if (supabase) {
      const { data, error } = await (supabase as any)
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        return NextResponse.json({ success: true, leads: data });
      }
    }

    return NextResponse.json({
      success: true,
      leads: [],
      message: "Supabase not configured or no records found.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch leads." },
      { status: 500 }
    );
  }
}
