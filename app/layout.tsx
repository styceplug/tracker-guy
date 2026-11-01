import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "./globals.css";
import { loadContent } from "@/lib/loadContent";

export const viewport: Viewport = { themeColor: "#e6f6f0" };

export async function generateMetadata(): Promise<Metadata> {
  const { seo, business: site } = await loadContent();
  const { title, description } = seo;
  return {
    metadataBase: new URL(site.url),
    title,
    description,
    keywords: [
      "vehicle tracker installation Lagos",
      "car tracker Nigeria",
      "GPS tracker installation",
      "bike tracker",
      "fleet tracking Nigeria",
      "truck tracker",
      "The Tracker Guy",
    ],
    alternates: { canonical: "/" },
    applicationName: site.name,
    openGraph: {
      type: "website",
      url: site.url,
      siteName: site.name,
      title,
      description,
      locale: "en_NG",
      images: [{ url: "/logo.png", alt: `${site.name} logo` }],
    },
    twitter: { card: "summary", title, description, images: ["/logo.png"] },
    robots: { index: true, follow: true },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const c = await loadContent();
  const site = c.business;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": `${site.url}/#business`,
        name: site.name,
        description: c.seo.description,
        url: site.url,
        image: `${site.url}/logo.png`,
        logo: `${site.url}/logo.png`,
        sameAs: c.socials.map((s) => s.href),
        telephone: site.phone,
        email: site.email,
        address: { "@type": "PostalAddress", addressLocality: "Lagos", addressCountry: "NG" },
        areaServed: ["Lagos", "Abuja", "Port Harcourt", "Ogun State", "Ibadan", "Kaduna", "Nasarawa"],
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          opens: "07:00",
          closes: "22:00",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: c.faq.items.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
