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

// ─── Page header — standalone, no hero image ────────────────────────────────
function PageHeader({ count }: { count: number }) {
  return (
    <header className="border-b border-black border-solid px-4 sm:px-6 lg:px-8 py-10 lg:py-14 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
      <div>
        <span className="inline-flex items-center gap-1.5 text-sans-10 font-600 uppercase tracking-widest text-black/40 mb-3">
          <span className="text-[var(--vividGreen)]" aria-hidden="true">■</span>
          Music For Pennies
        </span>
        <h1 className="text-sans-35 sm:text-sans-45 lg:text-sans-72 font-700 uppercase leading-[0.92] tracking-tight">
          Arrangemang
        </h1>
        <p className="text-sans-13 sm:text-sans-14 text-black/55 mt-3 max-w-md leading-relaxed">
          Evenemang och arrangemang som Music For Pennies har skapat och varit en del av.
        </p>
      </div>
      {count > 0 && (
        <div className="flex flex-col items-start sm:items-end shrink-0">
          <span className="text-sans-35 lg:text-sans-48 font-700 text-[var(--vividGreen)] leading-none">{count}</span>
          <span className="text-sans-10 font-600 uppercase tracking-widest text-black/40 mt-0.5">totalt</span>
        </div>
      )}
    </header>
  );
}

// ─── Arrangemang row — image left, title + CTA right ────────────────────────
function ArrangemangRow({ arrangemang, index }: {
  arrangemang: ArrangemangData;
  index: number;
}) {
  const href = `/arrangemang/${arrangemang.URL.current}`;

  return (
    <div className="group border-b border-black border-solid grid grid-cols-[auto_1fr] sm:grid-cols-[260px_1fr] lg:grid-cols-[360px_1fr] items-stretch">

      {/* Left: full-width image within its column */}
      <Link
        href={href}
        className="relative block overflow-hidden bg-gray-100 w-[120px] sm:w-auto self-stretch"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="relative h-full min-h-[120px] sm:min-h-[180px] lg:min-h-[220px]">
          {arrangemang.Bild ? (
            <Image
              src={urlFor(arrangemang.Bild).width(720).quality(85).url()}
              alt=""
              fill
              loading={index < 4 ? 'eager' : 'lazy'}
              className="object-cover noise transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 120px, (max-width: 1024px) 260px, 360px"
            />
          ) : (
            <div className="absolute inset-0 bg-gray-200" />
          )}
        </div>
      </Link>

      {/* Right: index, title, read-more */}
      <div className="flex flex-col justify-between px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6 border-l border-black border-solid">
        {/* Top: index badge */}
        <span className="inline-flex items-center bg-black text-white text-sans-10 font-700 uppercase tracking-widest px-2 py-0.5 w-fit">
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* Middle: title */}
        <h2 className="text-sans-18 sm:text-sans-22 lg:text-sans-35 font-600 uppercase leading-[1.05] text-balance mt-3 group-hover:italic transition-all duration-200">
          <Link href={href} className="hover:text-black">
            {arrangemang.Namn}
          </Link>
        </h2>

        {/* Bottom: read-more link */}
        <div className="mt-4 sm:mt-6">
          <Link
            href={href}
            className="inline-flex items-center gap-2 border border-black px-4 py-2.5 text-sans-11 font-700 uppercase tracking-widest hover:bg-black hover:text-white transition-colors min-h-[44px]"
          >
            Läs mer
            <span className="text-[var(--vividGreen)] group-hover:text-white transition-colors" aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function ArrangemangList({ initialArrangemang }: ArrangemangListProps) {
  const items = initialArrangemang ?? [];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Music For Pennies - Arrangemang',
    description: 'En lista över alla arrangemang från Music For Pennies.',
    url: 'https://musicforpennies.se/arrangemang',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: items.map((item, index) => ({
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

      {/* Clean standalone header — no hero image */}
      <PageHeader count={items.length} />

      {/* Arrangemang rows */}
      <section aria-label="Alla arrangemang">
        {items.length === 0 ? (
          <p className="px-4 lg:px-8 py-20 text-sans-16 text-black/40 uppercase text-center">
            Inga arrangemang tillgängliga för tillfället.
          </p>
        ) : (
          items.map((item, index) => (
            <ArrangemangRow key={item._id} arrangemang={item} index={index} />
          ))
        )}
      </section>

      {/* Bottom CTA */}
      <section className="bg-black text-white border-t border-black">
        <div className="px-4 sm:px-6 lg:px-8 py-12 lg:py-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
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


