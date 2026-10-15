export type ProductCategory =
  | "bedsheets-linens"
  | "throws-quilts"
  | "towels-bath"
  | "cushions-decor"
  | "festive-edit"
  | "bulk-hospitality";

export interface ProductSwatch {
  name: string;
  hex: string;
  image?: string;
}

export interface ProductVariant {
  id: string;
  size: "Single / Twin (60x90\")" | "Double / Queen (84x100\")" | "King Set (108x108\")" | "Fitted Elastic Corner";
  colorName: string;
  colorHex: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  stockCount: number;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  category: ProductCategory;
  price: number;
  compareAtPrice?: number;
  discountPercent?: number;
  threadCount?: number;
  material: string;
  craftTechnique: string;
  origin: string;
  rating: number;
  reviewCount: number;
  images: string[];
  swatches: ProductSwatch[];
  variants?: ProductVariant[];
  inStock: boolean;
  partialCodEligible: boolean;
  minAdvanceAmount?: number;
  badges?: string[];
  dimensions?: string;
  careInstructions?: string[];
}

export interface CartItem {
  product: Product;
  selectedVariant?: ProductVariant;
  selectedSwatch?: ProductSwatch;
  quantity: number;
}

export interface NavigationItem {
  label: string;
  href: string;
  path: ProductCategory | string;
  badge?: string;
  isSpecial?: boolean;
}
