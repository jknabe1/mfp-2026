'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { urlFor, SanityImageSource } from '@/lib/utils';

interface ArrangemangData {
  _id: string;
  Namn: string;
  URL: { current: string };
  Bild: SanityImageSource;
  Beskrivning?: any;
}

interface ArrangemangMinimalProps {
  arrangemangItems: ArrangemangData[];
}

export default function ArrangemangMinimal({ arrangemangItems }: ArrangemangMinimalProps) {
  const [selectedArrangemang, setSelectedArrangemang] = useState<ArrangemangData | null>(
    arrangemangItems.length > 0 ? arrangemangItems[0] : null
  );

  if (!arrangemangItems || arrangemangItems.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-sans-16 text-black/40 uppercase">Inga arrangemang tillgängliga</p>
      </main>
    );
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Music For Pennies - Arrangemang',
    description: 'En lista över alla arrangemang från Music For Pennies.',
    url: 'https://musicforpennies.se/arrangemang',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: arrangemangItems.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.Namn,
        url: `https://musicforpennies.se/arrangemang/${item.URL.current}`,
      })),
    },
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="grid grid-cols-12 gap-px">
        <div className="col-span-12 relative h-full grid-col-border">
          <div className="grid grid-cols-12 gap-px items-start">
            {/* Left Column: List of Arrangemang */}
            <div className="col-span-12 lg:col-span-6 grid-col-border">
              <ul className="flex flex-col gap-px">
                {arrangemangItems.map((arrangemang) => (
                  <Link key={arrangemang._id} href={`/arrangemang/${arrangemang.URL.current}`}>
                    <li
                      className="grid-col-border px-2 py-3 lg:px-5"
                      onMouseEnter={() => setSelectedArrangemang(arrangemang)}
                    >
                      <h2 className="text-sans-35 lg:text-sans-60 font-600 hover:italic">
                        {arrangemang.Namn}
                      </h2>
                    </li>
                  </Link>
                ))}
              </ul>
            </div>

            {/* Right Column: Image Preview (Sticky on Desktop) */}
            <div className="hidden lg:block col-span-6 grid-col-border sticky top-7 min-h-[calc(100vh-2rem)] overflow-hidden">
              <div className="image overflow-hidden absolute inset-0">
                {selectedArrangemang && selectedArrangemang.Bild ? (
                  <Image
                    src={urlFor(selectedArrangemang.Bild).width(1000).quality(85).url()}
                    alt={selectedArrangemang.Namn || 'Arrangemang'}
                    className="w-full h-full object-cover noise transition-opacity duration-500"
                    width={1080}
                    height={1080}
                    loading="lazy"
                    key={selectedArrangemang._id}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <p className="text-sans-14 text-black/40 uppercase">Ingen bild tillgänglig</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
