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

// ─── Text intro cell — sits in the grid alongside images ────────────────────
function IntroCell({ count }: { count: number }) {
  return (
    <div className="relative flex flex-col justify-between bg-[var(--background)] border-b border-black border-solid p-6 sm:p-8 lg:p-10 aspect-square md:aspect-auto min-h-[260px]">
      {/* Top: label */}
      <span className="inline-flex items-center gap-1.5 text-sans-10 font-600 uppercase tracking-widest text-black/50">
        <span className="text-[var(--vividGreen)]" aria-hidden="true">■</span>
        Music For Pennies
      </span>

      {/* Middle: title */}
      <h1 className="text-sans-35 sm:text-sans-45 lg:text-sans-60 font-700 uppercase leading-[0.95] tracking-tight my-4">
        Arrangemang
      </h1>

      {/* Bottom: description + count */}
      <div className="flex flex-col gap-3">
        <p className="text-sans-13 sm:text-sans-14 text-black/60 leading-relaxed max-w-xs">
          Evenemang och arrangemang som Music For Pennies har skapat och varit en del av.
        </p>
        <div className="flex items-baseline gap-2 border-t border-black/10 pt-3">
          <span className="text-sans-28 font-700 text-[var(--vividGreen)] leading-none">{count}</span>
          <span className="text-sans-10 font-600 uppercase tracking-widest text-black/50">arrangemang</span>
        </div>
      </div>
    </div>
  );
}

// ─── Image Card ──────────────────────────────────────────────────────────────
function ImageCard({ arrangemang, index }: {
  arrangemang: ArrangemangData;
  index: number;
}) {
  return (
    <Link
      href={`/arrangemang/${arrangemang.URL.current}`}
      className="group relative block overflow-hidden bg-black"
      aria-label={arrangemang.Namn}
    >
      <div className="relative w-full aspect-square overflow-hidden">
        {arrangemang.Bild ? (
          <Image
            src={urlFor(arrangemang.Bild).width(900).quality(85).url()}
            alt={arrangemang.Namn}
            fill
            loading={index < 5 ? 'eager' : 'lazy'}
            className="object-cover noise transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white/30 text-sans-12 uppercase font-600">
            Bild saknas
          </div>
        )}

        {/* Persistent bottom gradient for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

        {/* Hover: darken slightly */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300" />

        {/* Content pinned to bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 lg:p-6">
          {/* Index */}
          <span className="inline-flex items-center bg-[var(--vividGreen)] text-black text-sans-10 font-700 uppercase tracking-widest px-2 py-0.5 mb-2">
            {String(index + 1).padStart(2, '0')}
          </span>

          {/* Name */}
          <h2 className="text-white text-sans-16 sm:text-sans-18 lg:text-sans-22 font-600 uppercase leading-[1.05] text-balance group-hover:italic transition-all duration-300">
            {arrangemang.Namn}
          </h2>

          {/* Arrow */}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-white/50 text-sans-10 font-600 uppercase tracking-widest group-hover:text-white transition-colors duration-300">
              Utforska
            </span>
            <span
              className="text-[var(--vividGreen)] text-sans-14 font-700 group-hover:translate-x-1.5 transition-transform duration-300"
              aria-hidden="true"
            >
              →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function ArrangemangList({ initialArrangemang }: ArrangemangListProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Music For Pennies - Arrangemang',
    description: 'En lista över alla arrangemang från Music For Pennies.',
    url: 'https://musicforpennies.se/arrangemang',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: (initialArrangemang ?? []).map((item, index) => ({
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

      {/* Full-width image grid — text intro is the first cell */}
      <section aria-label="Arrangemang" className="border-b border-black border-solid">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-black">

          {/* Intro text cell — occupies first grid slot */}
          <IntroCell count={initialArrangemang?.length ?? 0} />

          {/* Image cards — one per arrangemang */}
          {(initialArrangemang ?? []).map((item, index) => (
            <ImageCard key={item._id} arrangemang={item} index={index} />
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-black text-white">
        <div className="px-4 lg:px-8 py-12 lg:py-20 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-sans-22 lg:text-sans-28 font-600 uppercase">
              Vill du veta mer?
            </h3>
            <p className="text-sans-13 lg:text-sans-14 text-white/50 mt-1 max-w-sm">
              Kontakta oss för samarbeten, bokningar eller frågor.
            </p>
          </div>
          <Link
            href="/om-oss/kontakta-oss"
            className="inline-flex items-center gap-2 bg-[var(--vividGreen)] text-black px-8 py-4 text-sans-14 font-600 uppercase tracking-widest hover:bg-white transition-colors min-h-[52px] shrink-0"
          >
            <span aria-hidden="true">■</span>
            Kontakta oss
          </Link>
        </div>
      </section>
    </main>
  );
}


