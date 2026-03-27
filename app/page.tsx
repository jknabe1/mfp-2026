import type { Metadata } from 'next';
import AboutSection from "@/components/Landing/About/AboutSection";
import ConcertSection from "@/components/Landing/ConcertSection";
import NewsSection from "@/components/Landing/NewsSection";
import ArrangemangSection from "@/components/Landing/Arrangemang/ArrangemangSection";
import ForeningarSection from '@/components/Landing/Foreningar/ForeningarSection';

export const metadata: Metadata = {
  title: "Music For Pennies",
  description: "Bästa gänget, svänget & hänget.",
  openGraph: {
    title: "",
    description: "Explore top artists, upcoming concerts, and new releases from Music For Pennies.",
    url: "https://musicforpennies.se/",
    siteName: "Music For Pennies",
    images: [
      {
        url: "https://musicforpennies.se/api",
        width: 1200,
        height: 630,
        alt: "ç",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Music For Pennies",
    description: "Stay updated with the latest music, concerts, and artists at Music For Pennies.",
    images: ["https://musicforpennies.se/api"],
  },
};

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Music For Pennies",
    "url": "https://musicforpennies.se",
    "description": "Discover top artists, upcoming concerts, and new releases from Music For Pennies.",
    "publisher": {
      "@type": "Organization",
      "name": "Music For Pennies",
      "logo": {
        "@type": "ImageObject",
        "url": "https://musicforpennies.se/api"
      }
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://musicforpennies.se/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AboutSection />
      <ConcertSection />
      <NewsSection />
      <ArrangemangSection />
      <ForeningarSection />
    </main>
  );
}
