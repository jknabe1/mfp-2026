import type { Metadata } from 'next';
import AboutSection from "@/components/Landing/About/AboutSection";
import ConcertSection from "@/components/Landing/ConcertSection";
import NewsSection from "@/components/Landing/NewsSection";
import VaraArrangemang from "@/components/Landing/Arrangemang/VaraArrangemang";
import ForeningarSection from '@/components/Landing/Foreningar/ForeningarSection';

export const metadata: Metadata = {
  title: "Music For Pennies",
  description: "Bästa gänget, svänget & hänget.",
  openGraph: {
    title: "",
    description: "Explore top artists, upcoming concerts, and new releases from K&K Records.",
    url: "https://kkrecords.se/",
    siteName: "K&K RECORDS",
    images: [
      {
        url: "https://kkrecords.se/api",
        width: 1200,
        height: 630,
        alt: "K&K RECORDS",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "K&K RECORDS",
    description: "Stay updated with the latest music, concerts, and artists at K&K Records.",
    images: ["https://kkrecords.se/api"],
  },
};

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "K&K Records",
    "url": "https://kkrecords.se",
    "description": "Discover top artists, upcoming concerts, and new releases from K&K Records.",
    "publisher": {
      "@type": "Organization",
      "name": "K&K Records",
      "logo": {
        "@type": "ImageObject",
        "url": "https://kkrecords.se/api"
      }
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://kkrecords.se/search?q={search_term_string}",
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
      <VaraArrangemang />
      <ForeningarSection />
    </main>
  );
}
