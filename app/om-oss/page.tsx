
import InfoGrid from "@/components/About/InfoGrid/InfoGrid";
import type { Metadata } from "next";
import Image from "next/image";

// ✅ **Static Metadata for SEO**
export const metadata: Metadata = {
  title: "Om Oss",
  description:
    "Music For Pennies är en ledande aktör inom live- och underhållningsindustrin i Sverige och Europa. Vi representerar artister, producerar konserter, festivaler och musikaler.",
  openGraph: {
    title: "Om Music For Pennies - Mer än ett skivbolag",
    description:
      "Music For Pennies är en ledande aktör inom live- och underhållningsindustrin i Sverige och Europa. Vi representerar artister, producerar konserter, festivaler och musikaler.",
    url: "https://musicforpennies.se/om-oss",
    siteName: "Music For Pennies",
    images: [
      {
        url: "https://musicforpennies.se/api",
        width: 1200,
        height: 800,
        alt: "Music For Pennies - Om oss",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Om Music For Pennies",
    description:
      "Music For Pennies är en ledande aktör inom live- och underhållningsindustrin i Sverige och Europa. Vi representerar artister, producerar konserter, festivaler och musikaler.",
    images: [
      "https://musicforpennies.se/api",
    ],
  },
};

export default function Page() {
  // ✅ **Static JSON-LD for Schema.org**
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Music For Pennies",
    "description":
      "Music For Pennies är en ledande aktör inom live- och underhållningsindustrin i Sverige och Europa. Vi representerar artister, producerar konserter, festivaler och musikaler.",
    "image": "https://cdn.sanity.io/images/1k2t1bm0/production/b34d044f641e16d3f97b0237d7fbda9b0a22b306-1439x1913.jpg",
    "url": "https://musicforpennies.se/om-oss",
    "sameAs": [
      "https://www.facebook.com/musicforpennies",
      "https://www.instagram.com/music_for_pennies",
    ],
    "foundingDate": "2022",
    "founder": [
      {
        "@type": "Person",
        "name": "Jens Knabe",
      },
      {
        "@type": "Person",
        "name": "Mikael Lehikoinen",
      },
    ],
    "memberOf": {
      "@type": "Organization",
      "name": "Music For Pennies",
    },
  };


  return (
  <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="grid grid-cols-12 gap-px">
            <div className="col-span-12 relative h-full grid-col-border">
                <div className="grid grid-cols-12 gap-px items-start">
                    <div className="col-span-12 lg:col-span-6 grid-col-border">
                        <ul className="flex flex-col gap-px">
                            <li className="grid-col-border px-2 py-3 lg:px-5">
                              {/* Heading */}
                              <h1 className="text-sans-35 lg:text-sans-60 font-600">
                                Om Music For Pennies
                              </h1>

                              {/* Introduction */}
                              <p className="mt-4 text-lg leading-relaxed">
                              På Music For Pennies har vi sedan starten 2019 haft en tydlig ambition: att skapa bättre förutsättningar för unga kulturutövare i Örebro län. Vi tror på kraften i kreativitet och vill ge unga artister och kreatörer det stöd de behöver för att kunna växa – både konstnärligt och professionellt.
                              Vi erbjuder finansiering till kulturella produktioner såsom studioinspelningar, musikvideos och turnéer. Utöver det fungerar vi som ett bollplank i frågor som rör utveckling, strategiskt tänkande och långsiktigt skapande. Målet är att varje person vi samarbetar med ska känna sig sedd, stärkt och fri att uttrycka sin vision.
                              Vi vill vara en del av ett kulturliv som är levande, inkluderande och framåtblickande. Genom våra initiativ vill vi inte bara stödja individer, utan också bidra till en starkare musikexport från regionen.
                              </p>
                              </li>
                        </ul>
                      </div>
                      <div className="hidden lg:block col-span-6 grid-col-border sticky h-full overflow-hidden">
                        <div className="image overflow-hidden absolute inset-0">
                                <Image
                                width={1080}
                                height={1080}
                                loading="lazy" 
                                className="noise object-cover object-center w-full h-full" 
                                src="https://images.unsplash.com/photo-1675099349521-58098de867d3?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                                alt="A coiled black power cord with a two-prong plug against a light background."/>
                        </div>
                    </div>
                    <div className="col-span-12 bg-pink-100 py-8 border-black border-solid border-b">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <h2 className="text-sans-35 lg:text-sans-60 font-600 text-black text-center">
                                Mer än ett skivbolag
                            </h2>
                            <p className="mt-4 text-lg text-gray-700 text-center leading-relaxed">
                            Vi vill ge ungdomar en meningsfull fritid där musik, skapande och gemenskap står i centrum. Hos oss får du stöd att utvecklas, testa idéer och göra din grej på riktigt.                            </p>
                        </div>
                    </div>
                  </div>
                  <InfoGrid/>
            </div> 
      </div>
    </div>

  );
}
