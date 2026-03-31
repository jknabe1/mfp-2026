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

// ─── Hero Section ───────────────────────────────────────────────────────────
function HeroSection({ featuredItem }: { featuredItem: ArrangemangData | null }) {
  return (
    <div className="relative w-full overflow-hidden border-b border-black border-solid">
      {/* Hero background */}
      <div className="relative w-full h-[50vw] min-h-[280px] max-h-[70vh] bg-black">
        {featuredItem?.Bild ? (
          <Image
            src={urlFor(featuredItem.Bild).width(2400).quality(90).url()}
            alt={featuredItem.Namn}
            fill
            priority
            className="object-cover noise opacity-60"
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Hero content */}
        <div className="absolute inset-0 flex flex-col justify-end px-4 pb-8 sm:px-6 sm:pb-12 lg:px-8 lg:pb-16">
          <span className="inline-flex items-center gap-1.5 bg-[var(--vividGreen)] text-black text-sans-10 sm:text-sans-12 font-600 px-2 py-1 uppercase tracking-widest w-fit mb-4">
            <span aria-hidden="true">■</span> Arrangemang
          </span>
          <h1 className="text-white uppercase font-600 text-sans-35 sm:text-sans-45 lg:text-sans-60 xl:text-sans-120 leading-[0.95] text-balance max-w-[90%]">
            Våra Arrangemang
          </h1>
          <p className="text-white/70 text-sans-14 sm:text-sans-16 lg:text-sans-18 mt-4 max-w-2xl leading-relaxed">
            Upptäck alla evenemang och arrangemang som Music For Pennies har skapat och varit en del av.
          </p>
        </div>
      </div>

      {/* Info bar */}
      <div className="flex items-center justify-between px-4 py-3 lg:px-8 lg:py-4 bg-black text-white uppercase">
        <span className="text-sans-12 lg:text-sans-14 font-600 tracking-wide">
          Music For Pennies
        </span>
        <span className="text-sans-12 font-600 tracking-widest text-[var(--vividGreen)]">
          {featuredItem ? `${1} arrangemang` : 'Arrangemang'}
        </span>
      </div>
    </div>
  );
}

// ─── Arrangemang Card Component ─────────────────────────────────────────────
function ArrangemangCard({ arrangemang, index }: { arrangemang: ArrangemangData; index: number }) {
  return (
    <Link
      href={`/arrangemang/${arrangemang.URL.current}`}
      className="group relative flex flex-col overflow-hidden border border-black border-solid bg-white hover:bg-black transition-colors duration-300"
      aria-label={arrangemang.Namn}
    >
      {/* Image container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
        {arrangemang.Bild ? (
          <Image
            src={urlFor(arrangemang.Bild).width(800).quality(80).url()}
            alt={arrangemang.Namn}
            fill
            loading={index < 6 ? 'eager' : 'lazy'}
            className="object-cover noise transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-black text-sans-12 uppercase font-600">
            Bild saknas
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />
        
        {/* Index badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center justify-center w-8 h-8 bg-black text-white text-sans-12 font-600 group-hover:bg-[var(--vividGreen)] group-hover:text-black transition-colors duration-300">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Card footer */}
      <div className="flex flex-col px-4 py-4 border-t border-black border-solid group-hover:bg-black transition-colors duration-300">
        <h2 className="text-sans-14 lg:text-sans-16 font-600 uppercase leading-tight line-clamp-2 group-hover:text-white group-hover:italic transition-all duration-300">
          {arrangemang.Namn}
        </h2>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-black/10 group-hover:border-white/20 transition-colors duration-300">
          <span className="text-sans-10 font-600 tracking-wider uppercase opacity-50 group-hover:text-white/60 transition-colors duration-300">
            Läs mer
          </span>
          <span className="text-[var(--vividGreen)] text-sans-14 font-700 group-hover:translate-x-1 transition-transform duration-300" aria-hidden="true">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}

// ─── Stats Section ──────────────────────────────────────────────────────────
function StatsSection({ count }: { count: number }) {
  return (
    <div className="border-b border-black border-solid">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px">
        <div className="flex flex-col items-center justify-center py-8 lg:py-12 bg-[var(--vividGreen)] text-black">
          <span className="text-sans-35 lg:text-sans-60 font-700">{count}</span>
          <span className="text-sans-10 lg:text-sans-12 font-600 uppercase tracking-widest mt-1">Arrangemang</span>
        </div>
        <div className="flex flex-col items-center justify-center py-8 lg:py-12 bg-black text-white">
          <span className="text-sans-35 lg:text-sans-60 font-700">MFP</span>
          <span className="text-sans-10 lg:text-sans-12 font-600 uppercase tracking-widest mt-1 opacity-60">Producent</span>
        </div>
        <div className="flex flex-col items-center justify-center py-8 lg:py-12 bg-white text-black border-l border-black">
          <span className="text-sans-35 lg:text-sans-60 font-700">★</span>
          <span className="text-sans-10 lg:text-sans-12 font-600 uppercase tracking-widest mt-1 opacity-60">Kvalitet</span>
        </div>
        <div className="flex flex-col items-center justify-center py-8 lg:py-12 bg-black text-[var(--vividGreen)]">
          <span className="text-sans-35 lg:text-sans-60 font-700">♫</span>
          <span className="text-sans-10 lg:text-sans-12 font-600 uppercase tracking-widest mt-1 text-white/60">Musik</span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Arrangemang List Component ────────────────────────────────────────
export default function ArrangemangList({ initialArrangemang }: ArrangemangListProps) {
  if (!initialArrangemang || initialArrangemang.length === 0) {
    return (
      <main>
        <HeroSection featuredItem={null} />
        <div className="px-4 lg:px-8 py-16 text-center">
          <p className="text-sans-18 text-gray-500 uppercase">
            Inga arrangemang tillgängliga för tillfället.
          </p>
        </div>
      </main>
    );
  }

  const featuredItem = initialArrangemang[0];

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

      {/* Hero section with featured image */}
      <HeroSection featuredItem={featuredItem} />

      {/* Stats section */}
      <StatsSection count={initialArrangemang.length} />

      {/* Section header */}
      <section aria-label="Alla arrangemang">
        <div className="flex items-baseline justify-between px-4 lg:px-8 py-10 lg:py-14 border-b border-black border-solid">
          <h2 className="text-sans-35 lg:text-sans-60 font-700 uppercase tracking-tight">
            Alla Arrangemang
          </h2>
          <span className="text-sans-12 font-600 uppercase tracking-widest opacity-50">
            {initialArrangemang.length} totalt
          </span>
        </div>

        {/* Arrangemang grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px border-b border-black border-solid">
          {initialArrangemang.map((item, index) => (
            <ArrangemangCard key={item._id} arrangemang={item} index={index} />
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
            className="inline-flex items-center gap-2 bg-[var(--vividGreen)] text-black px-8 py-4 text-sans-14 font-600 uppercase tracking-widest hover:bg-white transition-colors"
          >
            <span aria-hidden="true">■</span>
            Kontakta oss
          </Link>
        </div>
      </section>
    </main>
  );
}

