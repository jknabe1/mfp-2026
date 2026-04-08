import type { Metadata } from 'next';
import AboutSection from "@/components/Landing/About/AboutSection";
import UpcomingEventsList from "@/components/Landing/UpcomingEventsList";
import NewsSection from "@/components/Landing/NewsSection";
import ArrangemangSection from "@/components/Landing/Arrangemang/ArrangemangSection";
import ForeningarSection from '@/components/Landing/Foreningar/ForeningarSection';

export const metadata: Metadata = {
  title: "Music For Pennies - Musikproduktion och Evenemang",
  description: "Bästa gänget, svänget & hänget. Music For Pennies är en musikproducent och arrangör av konserter och evenemang i Sverige.",
  keywords: ['musik', 'skivbolag', 'konserter', 'evenemang', 'musikproduktion', 'artiststöd'],
  alternates: {
    canonical: "https://musicforpennies.se/",
  },
  openGraph: {
    title: "Music For Pennies - Musikproduktion och Evenemang",
    description: "Bästa gänget, svänget & hänget. Musikproduktion, konserter och artiststöd.",
    url: "https://musicforpennies.se/",
    siteName: "Music For Pennies",
    images: [
      {
        url: "https://musicforpennies.se/api/",
        width: 1200,
        height: 630,
        alt: "Music For Pennies - Musikproduktion och evenemang",
        type: 'image/jpeg',
      },
    ],
    locale: 'sv_SE',
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Music For Pennies",
    description: "Bästa gänget, svänget & hänget. Musikproduktion och konserter.",
    images: ["https://musicforpennies.se/api/"],
  },
};

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Music For Pennies",
    "url": "https://musicforpennies.se",
    "description": "Musikproduktion, evenemang och artiststöd från Music For Pennies.",
    "image": "https://musicforpennies.se/api/",
    "sameAs": [
      "https://www.instagram.com/music_for_pennies",
      "https://www.facebook.com/musicforpennies",
      "https://www.tiktok.com/@musicforpennies",
      "https://open.spotify.com/user/rp0di7du2vijxmhev2mp6vugo"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "tjooo@musicforpennies.se",
      "contactType": "Customer Service",
      "email": "tjooo@musicforpennies.se"
    },
    "founder": [
      {
        "@type": "Person",
        "name": "Jens Knabe"
      },
      {
        "@type": "Person",
        "name": "Mikael Lehikoinen"
      }
    ],
    "foundingDate": "2019",
    "foundingLocation": {
      "@type": "Place",
      "name": "Örebro, Sweden"
    }
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AboutSection />
      <UpcomingEventsList />
      <NewsSection />
      <ArrangemangSection />
      <ForeningarSection />
    </main>
  );
}
