'use client';

import React, { useState, useEffect } from 'react';
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading || !arrangemangItems || arrangemangItems.length === 0) {
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
          Utforska vår samling av arrangemang och evenemang. Välj ett arrangemang för att lära dig mer.
        </p>
      </header>

      {/* 50/50 Split Grid */}
      <div className="divide-y divide-black border-b border-black">
        {arrangemangItems.map((item, index) => (
          <div
            key={item._id}
            className={`grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-black`}
          >
            {/* Left: Image (alternates on desktop for visual interest) */}
            <div className={`relative overflow-hidden bg-gray-100 h-64 sm:h-80 lg:h-screen flex items-center justify-center order-2 lg:order-none ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
              {item.Bild ? (
                <Image
                  src={urlFor(item.Bild).width(1200).quality(85).url()}
                  alt={item.Namn}
                  fill
                  loading={index < 3 ? 'eager' : 'lazy'}
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
              )}
              
              {/* Gradient overlay for text on mobile */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent lg:hidden" />
            </div>

            {/* Right: Content (title, description, CTA) */}
            <div className={`flex flex-col justify-center px-6 sm:px-8 lg:px-10 py-8 sm:py-12 lg:py-16 order-1 lg:order-none ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
              <div>
                {/* Badge/Index */}
                <span className="inline-flex items-center bg-black text-white text-sans-10 font-700 uppercase tracking-widest px-2.5 py-1 mb-4 w-fit">
                  {String(index + 1).padStart(2, '0')}
                </span>

                {/* Title */}
                <h2 className="text-sans-28 sm:text-sans-40 lg:text-sans-52 font-700 uppercase leading-[1.1] text-balance mb-4 lg:mb-6">
                  {item.Namn}
                </h2>

                {/* Description preview (if available) */}
                {item.Beskrivning && (
                  <p className="text-sans-14 sm:text-sans-15 text-black/60 leading-relaxed mb-6 lg:mb-8 max-w-sm line-clamp-3">
                    {typeof item.Beskrivning === 'string' 
                      ? item.Beskrivning 
                      : 'Ett arrangement från Music For Pennies.'}
                  </p>
                )}

                {/* CTA Button */}
                <Link
                  href={`/arrangemang/${item.URL.current}`}
                  className="inline-flex items-center gap-2 border-2 border-black px-6 sm:px-8 py-3 sm:py-4 text-sans-13 sm:text-sans-14 font-700 uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-200 hover:translate-x-1 w-fit"
                >
                  Läs mer
                  <span className="text-[var(--vividGreen)] group-hover:translate-x-1 transition-transform" aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA Section */}
      <section className="bg-black text-white border-t border-black">
        <div className="px-4 sm:px-6 lg:px-8 py-12 lg:py-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h3 className="text-sans-24 lg:text-sans-32 font-700 uppercase">
              Vill du veta mer?
            </h3>
            <p className="text-sans-13 lg:text-sans-14 text-white/50 mt-2 max-w-sm">
              Utforska vår festival-arkiv och alla event som har gjort Music For Pennies speciell.
            </p>
          </div>
          <Link
            href="/event"
            className="inline-flex items-center gap-2 bg-[var(--vividGreen)] text-black px-6 sm:px-8 py-3 sm:py-4 text-sans-13 sm:text-sans-14 font-700 uppercase tracking-widest hover:bg-white transition-colors min-h-[48px] sm:min-h-[52px] shrink-0"
          >
            <span aria-hidden="true">■</span>
            Se all festival-arkiv
          </Link>
        </div>
      </section>
    </main>
  );
}
