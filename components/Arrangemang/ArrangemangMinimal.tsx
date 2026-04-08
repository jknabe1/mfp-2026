'use client';

import React, { useState } from 'react';
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

      {/* Header Section */}
      <header className="border-b border-black border-solid px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <span className="inline-flex items-center gap-1.5 text-sans-10 font-600 uppercase tracking-widest text-black/40 mb-3">
          <span className="text-[var(--vividGreen)]" aria-hidden="true">■</span>
          Music For Pennies
        </span>
        <h1 className="text-sans-45 sm:text-sans-60 lg:text-sans-72 font-700 uppercase leading-[0.92] tracking-tight">
          Arrangemang
        </h1>
        <p className="text-sans-13 sm:text-sans-14 text-black/55 mt-4 max-w-2xl leading-relaxed">
          Utforska vår samling av arrangemang och evenemang. Hovra eller klicka för att se detaljer.
        </p>
      </header>

      {/* Main 50/50 Grid Layout */}
      <div className="grid grid-cols-12 gap-px">
        <div className="col-span-12 relative h-full grid-col-border">
          <div className="grid grid-cols-12 gap-px items-start">
            {/* Left Column: List of Arrangemang */}
            <div className="col-span-12 lg:col-span-6 grid-col-border">
              <ul className="flex flex-col gap-px">
                {arrangemangItems.map((arrangemang) => (
                  <Link key={arrangemang._id} href={`/arrangemang/${arrangemang.URL.current}`}>
                    <li
                      className="grid-col-border px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 cursor-pointer transition-all hover:bg-black/5"
                      onMouseEnter={() => setSelectedArrangemang(arrangemang)}
                    >
                      <h2 className="text-sans-24 sm:text-sans-35 lg:text-sans-60 font-600 uppercase leading-tight hover:italic transition-all">
                        {arrangemang.Namn}
                      </h2>
                    </li>
                  </Link>
                ))}
                <Link href="/om-oss/kontakta-oss">
                  <li className="grid-col-border px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 bg-black text-white cursor-pointer transition-all hover:bg-black/90">
                    <h2 className="italic text-sans-24 sm:text-sans-35 lg:text-sans-60 font-600 uppercase">
                      Du eller ditt arrangemang?
                    </h2>
                  </li>
                </Link>
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
                    width={1000}
                    height={1000}
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

      {/* Bottom CTA Section */}
      <section className="bg-black text-white border-t border-black">
        <div className="px-4 sm:px-6 lg:px-8 py-12 lg:py-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h3 className="text-sans-24 lg:text-sans-32 font-700 uppercase">
              Vill du utforska mer?
            </h3>
            <p className="text-sans-13 lg:text-sans-14 text-white/50 mt-2 max-w-sm">
              Kolla in vår fullständiga festival-arkiv med alla event och aktiviteter.
            </p>
          </div>
          <Link
            href="/event"
            className="inline-flex items-center gap-2 bg-[var(--vividGreen)] text-black px-6 sm:px-8 py-3 sm:py-4 text-sans-13 sm:text-sans-14 font-700 uppercase tracking-widest hover:bg-white transition-colors min-h-[48px] sm:min-h-[52px] shrink-0"
          >
            <span aria-hidden="true">■</span>
            Festival-arkiv
          </Link>
        </div>
      </section>
    </main>
  );
}
