import React from "react";
import { Product } from "@/types";

export const OrganizationJsonLd: React.FC = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Kusumika Luxury Home Textiles",
    legalName: "Kusumika Artisanal Textiles Private Limited",
    url: "https://kusumika.com",
    logo: "https://kusumika.com/logo.png",
    slogan: "Soft like Silk, Feels like a Hug",
    description:
      "Hand-loomed 400TC organic cotton and mulberry silk bedsheets, dohars, towels, and heritage home textiles rooted in Rajasthani artisanal hand-block craftsmanship.",
    foundingLocation: {
      "@type": "Place",
      name: "Jaipur, Rajasthan, India",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Atelier Block, Weavers Colony, Bagru & Sanganer Artisanal Road",
      addressLocality: "Jaipur",
      addressRegion: "Rajasthan",
      postalCode: "302029",
      addressCountry: "IN",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+91-141-2894-920",
        contactType: "customer service",
        areaServed: "IN",
        availableLanguage: ["English", "Hindi"],
      },
    ],
    sameAs: [
      "https://instagram.com/kusumikahome",
      "https://facebook.com/kusumikahome",
      "https://pinterest.com/kusumikahome",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export const WebSiteJsonLd: React.FC = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Kusumika",
    url: "https://kusumika.com",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://kusumika.com/collections?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export const ProductJsonLd: React.FC<{ product: Product }> = ({ product }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.subtitle || product.title,
    image: product.images,
    sku: product.slug,
    brand: {
      "@type": "Brand",
      name: "Kusumika",
    },
    material: product.material,
    countryOfOrigin: {
      "@type": "Country",
      name: "India",
    },
    offers: {
      "@type": "Offer",
      url: `https://kusumika.com/products/${product.slug}`,
      priceCurrency: "INR",
      price: product.price,
      priceValidUntil: "2027-12-31",
      itemCondition: "https://schema.org/NewCondition",
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "Kusumika Luxury Home Textiles",
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: 0,
          currency: "INR",
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "IN",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 1,
            maxValue: 2,
            unitCode: "d",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 2,
            maxValue: 4,
            unitCode: "d",
          },
        },
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "IN",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 7,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/FreeReturn",
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating || 4.9,
      reviewCount: product.reviewCount || 42,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export const BreadcrumbJsonLd: React.FC<{
  items: Array<{ name: string; url: string }>;
}> = ({ items }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export const FaqJsonLd: React.FC<{
  questions: Array<{ question: string; answer: string }>;
}> = ({ questions }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};
