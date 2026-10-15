import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/context/StoreContext";
import { GlobalStoreDrawer } from "@/components/layout/GlobalStoreDrawer";
import { CookieConsentBanner } from "@/components/analytics/CookieConsentBanner";
import { AnalyticsScripts } from "@/components/analytics/AnalyticsScripts";

export const metadata: Metadata = {
  title: "Kusumika | Soft like Silk, Feels like a Hug",
  description:
    "Hand-loomed 400TC organic cotton and mulberry silk bedsheets, dohars, towels, and heritage home textiles. Sanganeri & Bagru botanical hand-block craftsmanship.",
  keywords: [
    "Kusumika",
    "Bedsheets",
    "Handloom Bedding",
    "400TC Cotton Bedsheets",
    "Jaipur Block Print",
    "Sanganeri Dohar",
    "Bagru Bedspreads",
    "Bulk Hospitality Linen",
    "Home Textiles India",
  ],
  authors: [{ name: "Kusumika Artisanal Textiles" }],
  openGraph: {
    title: "Kusumika | Soft like Silk, Feels like a Hug",
    description:
      "Handcrafted Indian luxury textiles rooted in Rajasthani artisanal heritage. Explore pure 400TC bedsheets, dohars, and bespoke hospitality linens.",
    url: "https://kusumika.com",
    siteName: "Kusumika",
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..700;1,400..700&family=Manrope:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body className="bg-surface font-sans text-on-surface antialiased min-h-screen flex flex-col">
        <StoreProvider>
          <AnalyticsScripts />
          {children}
          <GlobalStoreDrawer />
          <CookieConsentBanner />
        </StoreProvider>
      </body>
    </html>
  );
}
