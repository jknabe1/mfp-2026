'use client';

import React, { useEffect, useState } from 'react';
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

// ─── Arrangemang Card Component ─────────────────────────────────────────────
function ArrangemangCard({ arrangemang }: { arrangemang: ArrangemangData }) {
  return (
    <Link
      href={`/arrangemang/${arrangemang.URL.current}`}
      className="relative group flex flex-col overflow-hidden border border-black border-solid transition-colors hover:bg-gray-50"
      aria-label={arrangemang.Namn}
    >
      {/* Image container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
        {arrangemang.Bild ? (
          <Image
            src={urlFor(arrangemang.Bild).width(800).quality(80).url()}
            alt={arrangemang.Namn}
            fill
            loading="lazy"
            className="object-cover noise transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-black text-sans-12 uppercase font-600">
            Bild saknas
          </div>
        )}
      </div>

      {/* Card footer with arrangemang info */}
      <div className="flex items-center justify-between px-3 py-3 border-t border-black border-solid bg-[var(--background)]">
        <h2 className="text-sans-14 lg:text-sans-16 font-600 uppercase truncate mr-2 group-hover:italic transition-all flex-1">
          {arrangemang.Namn}
        </h2>
        <span className="text-[var(--vividGreen)] shrink-0 text-sans-12 font-600" aria-hidden="true">■</span>
      </div>
    </Link>
  );
}

// ─── Section Header Component ──────────────────────────────────────────────
function SectionHeader({ title }: { title: string }) {
  return (
    <div className="mb-8 border-b border-black border-solid pb-4">
      <h2 className="text-sans-35 lg:text-sans-60 font-600 uppercase tracking-tight">
        {title}
      </h2>
    </div>
  );
}

// ─── Arrangemang Grid Component ────────────────────────────────────────────
function ArrangemangGrid({ arrangemang }: { arrangemang: ArrangemangData[] }) {
  if (arrangemang.length === 0) {
    return (
      <p className="text-sans-16 text-gray-600 font-500">
        Inga arrangemang tillgängliga för tillfället.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px border border-black border-solid">
      {arrangemang.map((item) => (
        <ArrangemangCard key={item._id} arrangemang={item} />
      ))}
    </div>
  );
}

// ─── Main Arrangemang List Component ────────────────────────────────────────
export default function ArrangemangList({ initialArrangemang }: ArrangemangListProps) {
  const [arrangemang, setArrangemang] = useState<ArrangemangData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!initialArrangemang || initialArrangemang.length === 0) {
      setIsLoading(false);
      return;
    }

    setArrangemang(initialArrangemang);
    setIsLoading(false);
  }, [initialArrangemang]);

  if (isLoading) {
    return (
      <main className="px-2 py-3 lg:px-5">
        <p className="text-sans-16 text-gray-500">Laddar arrangemang...</p>
      </main>
    );
  }

  if (!initialArrangemang || initialArrangemang.length === 0) {
    return (
      <main className="px-2 py-3 lg:px-5">
        <p className="text-sans-16 text-gray-500">Inga arrangemang tillgängliga för tillfället.</p>
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
      itemListElement: arrangemang.map((item, index) => ({
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

      {/* Arrangemang header section */}
      <section
        aria-label="Alla arrangemang"
        className="px-2 py-3 lg:px-5 mt-12 lg:mt-20 mb-16 lg:mb-20 uppercase"
      >
        <SectionHeader title="Alla arrangemang" />
        <ArrangemangGrid arrangemang={arrangemang} />
      </section>
    </main>
  );
}

