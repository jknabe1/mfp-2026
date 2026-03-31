'use client';

import React from 'react';
import Link from 'next/link';
import { urlFor, SanityImageSource } from '@/lib/utils';
import Image from 'next/image';

interface ArrangemangData {
  _id: string;
  Namn: string;
  URL: { current: string };
  Bild: SanityImageSource;
  Beskrivning?: any;
}

interface ArrangemangListProps {
  initialArrangemang: ArrangemangData[];
}

// ─── Full-Width Image Card ──────────────────────────────────────────────────
function FullWidthCard({ arrangemang, index, isLarge = false }: { 
  arrangemang: ArrangemangData; 
  index: number;
  isLarge?: boolean;
}) {
  return (
    <Link
      href={`/arrangemang/${arrangemang.URL.current}`}
      className={`group relative block overflow-hidden bg-black ${isLarge ? 'col-span-full lg:col-span-2 row-span-2' : ''}`}
      aria-label={arrangemang.Namn}
    >
      {/* Image container with dynamic aspect ratio */}
      <div className={`relative w-full overflow-hidden ${isLarge ? 'aspect-[16/10] lg:aspect-[16/9]' : 'aspect-[4/3]'}`}>
        {arrangemang.Bild ? (
          <Image
            src={urlFor(arrangemang.Bild).width(isLarge ? 1600 : 800).quality(85).url()}
            alt={arrangemang.Namn}
            fill
            loading={index < 4 ? 'eager' : 'lazy'}
            className="object-cover noise transition-all duration-700 group-hover:scale-105"
            sizes={isLarge ? '(max-width: 1024px) 100vw, 66vw' : '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white/50 text-sans-14 uppercase font-600">
            Bild saknas
          </div>
        )}

        {/* Gradient overlay — stronger on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300" />

        {/* Content overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 lg:p-8">
          {/* Index badge */}
          <span className={`inline-flex items-center justify-center bg-[var(--vividGreen)] text-black font-700 uppercase tracking-widest mb-3 w-fit ${isLarge ? 'text-sans-12 px-3 py-1.5' : 'text-sans-10 px-2 py-1'}`}>
            {String(index + 1).padStart(2, '0')}
          </span>

          {/* Title */}
          <h2 className={`text-white uppercase font-600 leading-[1.05] text-balance group-hover:italic transition-all duration-300 ${isLarge ? 'text-sans-28 sm:text-sans-35 lg:text-sans-60' : 'text-sans-18 sm:text-sans-22 lg:text-sans-28'}`}>
            {arrangemang.Namn}
          </h2>

          {/* CTA row */}
          <div className="flex items-center gap-3 mt-3 lg:mt-4">
            <span className={`text-white/60 font-600 uppercase tracking-widest group-hover:text-white transition-colors duration-300 ${isLarge ? 'text-sans-12' : 'text-sans-10'}`}>
              Utforska
            </span>
            <span className="text-[var(--vividGreen)] text-sans-16 font-700 group-hover:translate-x-2 transition-transform duration-300" aria-hidden="true">
              →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Page Header ────────────────────────────────────────────────────────────
function PageHeader({ count }: { count: number }) {
  return (
    <header className="border-b border-black border-solid">
      {/* Title row */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 px-4 py-8 sm:py-10 lg:px-8 lg:py-14">
        <div>
          <span className="inline-flex items-center gap-1.5 text-sans-10 sm:text-sans-12 font-600 uppercase tracking-widest text-black/50 mb-2">
            <span className="text-[var(--vividGreen)]" aria-hidden="true">■</span> Music For Pennies
          </span>
          <h1 className="text-sans-35 sm:text-sans-45 lg:text-sans-72 font-700 uppercase tracking-tight leading-[0.95]">
            Arrangemang
          </h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-sans-35 lg:text-sans-48 font-700 text-[var(--vividGreen)] leading-none">{count}</span>
            <span className="text-sans-10 lg:text-sans-12 font-600 uppercase tracking-widest text-black/50">Totalt</span>
          </div>
        </div>
      </div>

      {/* Description row */}
      <div className="px-4 pb-8 lg:px-8 lg:pb-10">
        <p className="text-sans-14 sm:text-sans-16 lg:text-sans-18 text-black/70 max-w-3xl leading-relaxed">
          Upptäck alla evenemang och arrangemang som Music For Pennies har skapat och varit en del av. Klicka på varje arrangemang för att läsa mer.
        </p>
      </div>
    </header>
  );
}

// ─── Main Arrangemang List Component ────────────────────────────────────────
export default function ArrangemangList({ initialArrangemang }: ArrangemangListProps) {
  if (!initialArrangemang || initialArrangemang.length === 0) {
    return (
      <main>
        <PageHeader count={0} />
        <div className="px-4 lg:px-8 py-20 text-center border-b border-black">
          <p className="text-sans-18 text-black/50 uppercase">
            Inga arrangemang tillgängliga för tillfället.
          </p>
        </div>
      </main>
    );
  }

  // Structured data for search engines
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Music For Pennies - Arrangemang',
    description: 'En lista över alla arrangemang från Music For Pennies.',
    url: 'https://musicforpennies.se/arrangemang',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: initialArrangemang.map((item, index) => ({
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

      {/* Clean page header */}
      <PageHeader count={initialArrangemang.length} />

      {/* Full-width image grid */}
      <section aria-label="Alla arrangemang" className="border-b border-black border-solid">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-black">
          {initialArrangemang.map((item, index) => (
            <FullWidthCard 
              key={item._id} 
              arrangemang={item} 
              index={index}
              isLarge={index === 0}
            />
          ))}
        </div>
      </section>

      {/* Bottom CTA section */}
      <section className="bg-black text-white">
        <div className="px-4 lg:px-8 py-12 lg:py-20 text-center">
          <h3 className="text-sans-22 lg:text-sans-35 font-600 uppercase mb-4">
            Vill du veta mer?
          </h3>
          <p className="text-sans-14 lg:text-sans-16 text-white/60 mb-8 max-w-xl mx-auto">
            Kontakta oss för samarbeten, bokningar eller frågor om våra arrangemang.
          </p>
          <Link
            href="/om-oss/kontakta-oss"
            className="inline-flex items-center gap-2 bg-[var(--vividGreen)] text-black px-8 py-4 text-sans-14 font-600 uppercase tracking-widest hover:bg-white transition-colors min-h-[52px]"
          >
            <span aria-hidden="true">■</span>
            Kontakta oss
          </Link>
        </div>
      </section>
    </main>
  );
}

