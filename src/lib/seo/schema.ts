import { absoluteUrl, activeSocialLinks, site, SITE_URL } from "@/lib/site";

/**
 * schema.org builders for the site's JSON-LD.
 *
 * The homepage carries the Organization + LocalBusiness + WebSite graph (where
 * Google reads the site name and business details); inner pages add a
 * BreadcrumbList plus whatever describes them (Service, FAQPage, BlogPosting).
 * Every value comes from src/lib/site.ts so the details match the page text.
 */

type Thing = Record<string, unknown>;

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const LOCAL_BUSINESS_ID = `${SITE_URL}/#localbusiness`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/** Wraps one or more schema nodes into a single JSON-LD document. */
export function jsonLdGraph(...nodes: Thing[]): Thing {
  return { "@context": "https://schema.org", "@graph": nodes };
}

function postalAddress(): Thing {
  return {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    addressLocality: site.address.locality,
    addressRegion: site.address.region,
    postalCode: site.address.postalCode,
    addressCountry: site.address.country,
  };
}

function logo(): Thing {
  return {
    "@type": "ImageObject",
    "@id": `${SITE_URL}/#logo`,
    url: absoluteUrl(site.logo),
    contentUrl: absoluteUrl(site.logo),
    width: 1200,
    height: 397,
    caption: site.legalName,
  };
}

function sameAs(): string[] | undefined {
  const urls = activeSocialLinks().map((s) => s.url);
  return urls.length ? urls : undefined;
}

export function organizationSchema(): Thing {
  return {
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: site.brandName,
    legalName: site.legalName,
    alternateName: ["GES", "GES Sri Lanka", "GES.lk"],
    url: SITE_URL,
    logo: logo(),
    image: { "@id": `${SITE_URL}/#logo` },
    description: site.description,
    email: site.email,
    telephone: site.phone.international,
    address: postalAddress(),
    areaServed: { "@type": "Country", name: site.areaServed },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        telephone: site.phone.international,
        email: site.email,
        areaServed: "LK",
        availableLanguage: ["English", "Sinhala", "Tamil"],
      },
    ],
    award: [...site.awards],
    knowsAbout: [
      "Solar PV system design and installation",
      "On-grid solar power systems",
      "Hybrid solar systems with battery backup",
      "Off-grid solar power systems",
      "Battery energy storage systems (BESS)",
      "CEB and LECO net metering, net accounting and net plus",
      "EV charging stations",
      "Solar system maintenance and repair",
    ],
    ...(sameAs() ? { sameAs: sameAs() } : {}),
  };
}

export function localBusinessSchema(): Thing {
  return {
    "@type": "HomeAndConstructionBusiness",
    "@id": LOCAL_BUSINESS_ID,
    name: `${site.name} — ${site.brandName}`,
    url: SITE_URL,
    image: [absoluteUrl(site.logo), absoluteUrl("/about_building_2026.webp")],
    logo: { "@id": `${SITE_URL}/#logo` },
    description: site.description,
    telephone: site.phone.international,
    email: site.email,
    address: postalAddress(),
    hasMap: site.mapUrl,
    areaServed: { "@type": "Country", name: site.areaServed },
    openingHoursSpecification: site.hours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [...h.days],
      opens: h.opens,
      closes: h.closes,
    })),
    parentOrganization: { "@id": ORGANIZATION_ID },
    ...(sameAs() ? { sameAs: sameAs() } : {}),
  };
}

export function websiteSchema(): Thing {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: `${site.name} — ${site.brandName}`,
    alternateName: ["GES", "GES Sri Lanka", "GES.lk"],
    inLanguage: "en-LK",
    publisher: { "@id": ORGANIZATION_ID },
    creator: { "@type": "Organization", name: site.creator.name, url: site.creator.url },
  };
}

/** The homepage graph: who GES is, where it is, and the site itself. */
export function homepageSchema(): Thing {
  return jsonLdGraph(organizationSchema(), localBusinessSchema(), websiteSchema());
}

export type Crumb = { name: string; path: string };

/** Home → … → current page. `items` excludes Home, which is always first. */
export function breadcrumbSchema(items: Crumb[]): Thing {
  const all = [{ name: "Home", path: "/" }, ...items];
  return {
    "@type": "BreadcrumbList",
    itemListElement: all.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** A short publisher block for articles (Google wants it inline on the page). */
function publisher(): Thing {
  return {
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: site.legalName,
    url: SITE_URL,
    logo: { "@type": "ImageObject", url: absoluteUrl(site.logo), width: 1200, height: 397 },
  };
}

export function serviceSchema({
  name,
  description,
  path,
  image,
  category,
}: {
  name: string;
  description: string;
  path: string;
  image?: string | null;
  category?: string;
}): Thing {
  return {
    "@type": "Service",
    "@id": `${absoluteUrl(path)}#service`,
    name,
    serviceType: name,
    ...(category ? { category } : {}),
    description,
    url: absoluteUrl(path),
    ...(image ? { image: absoluteUrl(image) } : {}),
    areaServed: { "@type": "Country", name: site.areaServed },
    provider: {
      "@type": "HomeAndConstructionBusiness",
      "@id": LOCAL_BUSINESS_ID,
      name: `${site.name} — ${site.brandName}`,
      url: SITE_URL,
      telephone: site.phone.international,
      address: postalAddress(),
    },
  };
}

export function faqPageSchema(faqs: { question: string; answer: string }[], path = "/faq"): Thing {
  return {
    "@type": "FAQPage",
    "@id": `${absoluteUrl(path)}#faq`,
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function blogPostingSchema(post: {
  slug: string;
  title: string;
  description: string;
  image?: string | null;
  publishedAt: string | null;
  updatedAt: string;
  authorName: string;
  category?: string | null;
  wordCount?: number;
}): Thing {
  const url = absoluteUrl(`/blog/${post.slug}`);
  return {
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: post.title.slice(0, 110),
    description: post.description,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    ...(post.image ? { image: [post.image.startsWith("http") ? post.image : absoluteUrl(post.image)] } : {}),
    ...(post.publishedAt ? { datePublished: post.publishedAt } : {}),
    dateModified: post.updatedAt,
    author: { "@type": "Organization", name: post.authorName, url: SITE_URL },
    publisher: publisher(),
    ...(post.category ? { articleSection: post.category } : {}),
    ...(post.wordCount ? { wordCount: post.wordCount } : {}),
    inLanguage: "en-LK",
  };
}
