import { localeMeta, type Locale } from "./i18n";
import { absoluteUrl, hours, site } from "./site";
import { hoods } from "@/content/neighbourhoods";
import { reviews, ratingSummary } from "@/content/reviews";
import type { Listing } from "@/content/listings";
import { coverSrc, photoSrc } from "@/content/listings";
import { hoodById } from "@/content/neighbourhoods";
import { toLatLng } from "./geo";

/** schema.org builders. Everything links back to one RealEstateAgent node via @id. */
type Json = Record<string, unknown>;

export const orgId = `${site.url}/#agency`;
export const websiteId = `${site.url}/#website`;

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function agencySchema(locale: Locale, description: string): Json {
  return {
    "@type": "RealEstateAgent",
    "@id": orgId,
    name: site.nameLocalized[locale],
    legalName: site.legalName,
    url: site.url,
    logo: absoluteUrl("/icon.svg"),
    image: absoluteUrl("/images/city/hero-stari-grad-sunset.jpg"),
    description,
    telephone: site.phone,
    email: site.email,
    foundingDate: String(site.founded),
    priceRange: "€€€",
    address: {
      "@type": "PostalAddress",
      streetAddress: site.street,
      postalCode: site.postalCode,
      addressLocality: site.city,
      addressCountry: site.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
    areaServed: hoods.map((h) => ({ "@type": "Place", name: `${h.name[locale]}, Novi Sad` })),
    knowsLanguage: ["sr", "en", "de"],
    openingHoursSpecification: hours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: dayNames[h.day],
      opens: h.open,
      closes: h.close,
    })),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: ratingSummary.value,
      reviewCount: ratingSummary.count,
      bestRating: 5,
    },
    review: reviews.slice(0, 5).map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.name },
      datePublished: r.date,
      reviewBody: r.text[locale],
      reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5 },
    })),
  };
}

export function websiteSchema(locale: Locale, description: string): Json {
  return {
    "@type": "WebSite",
    "@id": websiteId,
    url: site.url,
    name: site.nameLocalized[locale],
    description,
    publisher: { "@id": orgId },
    inLanguage: localeMeta[locale].hreflang,
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]): Json {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.url),
    })),
  };
}

export function faqSchema(items: { q: string; a: string }[]): Json {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

export function serviceSchema(locale: Locale, name: string, description: string, url: string): Json {
  return {
    "@type": "Service",
    name,
    description,
    url: absoluteUrl(url),
    provider: { "@id": orgId },
    areaServed: { "@type": "City", name: "Novi Sad" },
    inLanguage: localeMeta[locale].hreflang,
  };
}

/** A listing as Offer + Apartment/House/Residence with geo. */
export function listingSchema(l: Listing, locale: Locale, url: string): Json {
  const geo = toLatLng(l.at);
  const hood = hoodById(l.hood);
  const placeType = l.type === "house" ? "SingleFamilyResidence" : l.type === "studio" || l.type === "apartment" ? "Apartment" : "Residence";
  return {
    "@type": "Offer",
    "@id": `${absoluteUrl(url)}#offer`,
    url: absoluteUrl(url),
    name: l.title[locale],
    description: l.summary[locale],
    price: l.price,
    priceCurrency: "EUR",
    ...(l.deal === "rent"
      ? { priceSpecification: { "@type": "UnitPriceSpecification", price: l.price, priceCurrency: "EUR", unitCode: "MON" } }
      : {}),
    availability: l.badge === "reserved" ? "https://schema.org/LimitedAvailability" : "https://schema.org/InStock",
    businessFunction: l.deal === "rent" ? "http://purl.org/goodrelations/v1#LeaseOut" : "http://purl.org/goodrelations/v1#Sell",
    validFrom: l.listed,
    seller: { "@id": orgId },
    image: [absoluteUrl(coverSrc(l)), absoluteUrl(photoSrc(l, 1))],
    itemOffered: {
      "@type": placeType,
      name: l.title[locale],
      floorSize: { "@type": "QuantitativeValue", value: l.area, unitCode: "MTK" },
      numberOfRooms: l.rooms,
      ...(l.type !== "house" ? { floorLevel: String(l.floor) } : {}),
      yearBuilt: l.year,
      address: {
        "@type": "PostalAddress",
        streetAddress: l.street,
        addressLocality: "Novi Sad",
        addressRegion: hood.name[locale],
        addressCountry: "RS",
      },
      geo: { "@type": "GeoCoordinates", latitude: geo.lat, longitude: geo.lng },
      amenityFeature: l.features.map((f) => ({ "@type": "LocationFeatureSpecification", name: f, value: true })),
    },
  };
}

export const graph = (...nodes: Json[]) => ({ "@context": "https://schema.org", "@graph": nodes });
