import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { Product, ProductCategory, ProductSwatch, ProductVariant } from "@/types";
import { MOCK_CATALOG } from "@/lib/mockCatalog";

export interface CategoryItem {
  id: string;
  slug: ProductCategory;
  name: string;
  description: string;
  heroImage: string;
}

export const FALLBACK_CATEGORIES: CategoryItem[] = [
  {
    id: "c1",
    slug: "bedsheets-linens",
    name: "Bedsheets & Linens",
    description: "Breathable 400–800 thread count sateen and cambric hand-block printed bed linens crafted with unbleached organic cotton.",
    heroImage: MOCK_CATALOG[0].images[0],
  },
  {
    id: "c2",
    slug: "throws-quilts",
    name: "Throws & Quilts",
    description: "Weightless cotton mulmul dohars and fine Jaipur razais quilted by hand with pure carded surgical cotton batting.",
    heroImage: MOCK_CATALOG[1].images[0],
  },
  {
    id: "c3",
    slug: "towels-bath",
    name: "Towels & Bath",
    description: "Ultra-absorbent honeycombed waffle-weave spa towels pre-washed with natural desert soapnuts for skin-soothing softness.",
    heroImage: MOCK_CATALOG[3].images[0],
  },
  {
    id: "c4",
    slug: "cushions-decor",
    name: "Cushions & Living",
    description: "Heritage jewel-toned velvet and textured raw slub cotton cushions finished with antique zari and kantha stitching.",
    heroImage: MOCK_CATALOG[5].images[0],
  },
  {
    id: "c5",
    slug: "festive-edit",
    name: "Festive Heritage Edit",
    description: "Limited-batch festive treasures infused with natural madder, wild turmeric haldi, and deep Persian indigo vat dyes.",
    heroImage: MOCK_CATALOG[2].images[0],
  },
];

export async function fetchCategories(): Promise<CategoryItem[]> {
  const supabase: any = getSupabaseBrowserClient();
  if (!supabase) return FALLBACK_CATEGORIES;

  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return FALLBACK_CATEGORIES;
    }

    return data.map((c: any) => ({
      id: c.id,
      slug: c.slug as ProductCategory,
      name: c.name,
      description: c.description || "",
      heroImage: c.hero_image || MOCK_CATALOG[0].images[0],
    }));
  } catch {
    return FALLBACK_CATEGORIES;
  }
}

export async function fetchProducts(): Promise<Product[]> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return MOCK_CATALOG;

  try {
    const { data, error } = await supabase
      .from("products")
      .select("*, categories(slug), product_variants(*), product_swatches(*), product_images(*)")
      .eq("is_active", true);

    if (error || !data || data.length === 0) {
      return MOCK_CATALOG;
    }

    return data.map((p: any) => {
      const swatches: ProductSwatch[] = (p.product_swatches || []).map((s: any) => ({
        name: s.name,
        hex: s.color_code,
        image: s.image_url,
      }));

      const variants: ProductVariant[] = (p.product_variants || []).map((v: any) => ({
        id: v.id,
        size: v.size as any,
        colorName: swatches[0]?.name || "Default",
        colorHex: swatches[0]?.hex || "#7A2E2E",
        sku: v.sku,
        price: Number(p.base_price) + Number(v.price_adjustment || 0),
        compareAtPrice: Number(p.mrp),
        stockCount: v.stock_count,
      }));

      const images: string[] = (p.product_images || [])
        .sort((a: any, b: any) => a.sort_order - b.sort_order)
        .map((img: any) => img.image_url);

      const categorySlug = (p.categories?.slug || "bedsheets-linens") as ProductCategory;

      return {
        id: p.id,
        title: p.title,
        slug: p.slug,
        subtitle: p.subtitle || "",
        category: categorySlug,
        price: Number(p.base_price),
        compareAtPrice: Number(p.mrp),
        discountPercent: Math.round(((Number(p.mrp) - Number(p.base_price)) / Number(p.mrp)) * 100),
        threadCount: p.thread_count,
        material: p.material,
        craftTechnique: p.weave_type,
        origin: "Bagru & Sanganer, Rajasthan",
        rating: 4.9,
        reviewCount: 38,
        images: images.length > 0 ? images : [MOCK_CATALOG[0].images[0]],
        swatches: swatches.length > 0 ? swatches : MOCK_CATALOG[0].swatches,
        variants: variants.length > 0 ? variants : MOCK_CATALOG[0].variants,
        inStock: true,
        partialCodEligible: p.partial_cod_eligible ?? true,
        minAdvanceAmount: Number(p.cod_advance_amount || 500),
        badges: p.is_festive ? ["Festive Edit"] : ["GOTS Organic"],
        dimensions: p.dimensions || undefined,
        careInstructions: p.care_instructions ? p.care_instructions.split(". ") : undefined,
      };
    });
  } catch {
    return MOCK_CATALOG;
  }
}

export async function fetchProductBySlug(slug: string): Promise<Product | undefined> {
  const all = await fetchProducts();
  return all.find((p) => p.slug === slug);
}

export async function submitB2BLead(leadData: {
  contactName: string;
  businessName: string;
  establishmentNature: string;
  email: string;
  phone: string;
  city: string;
  pincode: string;
  gstin?: string;
  categoriesNeeded: string[];
  weaveGrade: string;
  quantityTier: string;
  bedSizes: string[];
  brandingOption: string;
  timeline: string;
  notes?: string;
  swatchBinderRequested: boolean;
}): Promise<string> {
  const inquiryNumber = `INQ-KSM-${Math.floor(1000 + Math.random() * 9000)}`;
  const supabase: any = getSupabaseBrowserClient();

  if (supabase) {
    try {
      await supabase.from("leads").insert({
        inquiry_number: inquiryNumber,
        contact_name: leadData.contactName,
        business_name: leadData.businessName,
        establishment_nature: leadData.establishmentNature,
        email: leadData.email,
        phone: leadData.phone,
        city: leadData.city,
        pincode: leadData.pincode,
        gstin: leadData.gstin || null,
        categories_needed: leadData.categoriesNeeded,
        weave_grade: leadData.weaveGrade,
        quantity_tier: leadData.quantityTier,
        bed_sizes: leadData.bedSizes,
        branding_option: leadData.brandingOption,
        timeline: leadData.timeline,
        notes: leadData.notes || null,
        swatch_binder_requested: leadData.swatchBinderRequested,
        status: "new",
      });
    } catch (e) {
      console.warn("Supabase lead submission fallback:", e);
    }
  }

  return inquiryNumber;
}
