export const metadata = {
    title: "Artister",
    description:
      "Utforska alla artister som är signade till Music For Pennies. Se bilder, namn och datum för varje artist.",
    openGraph: {
      title: "Artister | Music For Pennies",
      description: "Se hela listan av artister som är del av Music For Pennies och upptäck nya namn.",
      url: "https://musicforpennies.se/artists",
      siteName: "Music For Pennies",
      images: [
        {
          url: "https://musicforpennies.se/api",
          width: 1200,
          height: 630,
          alt: "Artister | Music For Pennies",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Artister | Music For Pennies",
      description: "Upptäck artister som tillhör Music For Pennies – allt från nya stjärnskott till etablerade namn.",
      images: ["https://musicforpennies.se/api"],
    },
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Artister | Music For Pennies",
    "description":
      "Music For Pennies representerar ett brett spektrum av artister och musiker i Sverige.",
    "url": "https://musicforpennies.se/artists",
    "publisher": {
      "@type": "Organization",
      "name": "Music For Pennies",
      "url": "https://musicforpennies.se",
    },
  };
  
  
  export default function ArtistsLayout({ children }: { children: React.ReactNode }) {
    return <>
     <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    {children}
    </>;
  }
  