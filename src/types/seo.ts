export interface PageSeoConfig {
  id: string;
  path: string;
  name: string;
  category: "Storefront" | "Collections" | "Products" | "B2B" | "Statutory";
  title: string;
  metaDescription: string;
  focusKeywords: string[];
  canonicalUrl: string;
  ogImage: string;
  ogType: "website" | "product" | "article";
  robotsIndex: boolean;
  robotsFollow: boolean;
  structuredDataType: "Organization" | "Product" | "WebSite" | "FAQPage" | "None";
  faqItems?: Array<{ question: string; answer: string }>;
  lastModified: string;
}

export interface SeoAuditIssue {
  id: string;
  severity: "critical" | "warning" | "good";
  title: string;
  description: string;
  recommendation: string;
  pagePath?: string;
  fixed?: boolean;
}

export interface SeoSiteSettings {
  siteName: string;
  tagline: string;
  defaultTitleTemplate: string;
  defaultOgImage: string;
  twitterHandle: string;
  googleSiteVerification: string;
  bingSiteVerification: string;
  sitemapEnabled: boolean;
  robotsEnabled: boolean;
  autoPingSearchEngines: boolean;
}
