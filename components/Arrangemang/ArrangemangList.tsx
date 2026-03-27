'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { urlFor, SanityImageSource } from '@/lib/utils';
import Image from 'next/image';

interface ArtistData {
  _id: string;
  name: string;
  slug: { current: string };
  date: string;
  image: SanityImageSource;
}

interface ArrangemangListProps {
  initialArtists: ArtistData[];
}

function formatFullDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('sv-SE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatDateComponents(dateStr: string) {
  const d = new Date(dateStr);
  return {
    day: d.toLocaleDateString('sv-SE', { day: '2-digit' }),
    month: d.toLocaleDateString('sv-SE', { month: 'short' }).toUpperCase(),
    year: d.getFullYear().toString(),
  };
}

// ─── Hero Banner Section ───────────────────────────────────────────────────
function ArtistHeroBanner({ artist }: { artist: ArtistData }) {
  const { day, month, year } = formatDateComponents(artist.date);

  return (
    <Link
      href={`/arrangemang/${artist.slug.current}`}
      className="group block relative w-full overflow-hidden border-b border-black border-solid"
      aria-label={`Gå till artist: ${artist.name}`}
    >
      <div className="relative w-full h-[60vw] min-h-[320px] max-h-[85vh]">
        {artist.image ? (
          <Image
            src={urlFor(artist.image).width(2400).quality(85).url()}
            alt={artist.name}
            fill
            priority
            className="object-cover noise transition-transform duration-700 ease-in-out group-hover:scale-[1.02]"
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-black" />
        )}
        {/* Dark overlay for text legibility */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Featured label */}
        <div className="absolute top-4 left-4 lg:top-6 lg:left-6 z-10">
          <span className="inline-flex items-center gap-1.5 bg-[var(--vividGreen)] text-black text-sans-12 font-600 px-2 py-1 uppercase tracking-widest">
            <span aria-hidden="true">■</span> Aktuell artist
          </span>
        </div>

        {/* Bottom content overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-10 px-4 pb-6 lg:px-8 lg:pb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <h1 className="text-white uppercase font-600 text-sans-35 lg:text-sans-60 xl:text-sans-120 leading-none text-balance max-w-[80%]">
            {artist.name}
          </h1>

          {/* Date display boxes */}
          <div className="flex items-end gap-0 shrink-0">
            <div className="flex flex-col items-center justify-center border border-white/60 px-4 py-3 min-w-[72px]">
              <span className="text-white text-sans-35 lg:text-sans-60 font-600 leading-none">{day}</span>
              <span className="text-white text-sans-12 font-600 tracking-widest mt-1">{month}</span>
            </div>
            <div className="flex flex-col items-center justify-center border border-white/60 border-l-0 px-4 py-3">
              <span className="text-white text-sans-18 font-600 tracking-widest">{year}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Info bar below image */}
      <div className="flex items-center justify-between px-4 py-3 lg:px-8 lg:py-4 bg-black text-white uppercase border-b border-black border-solid">
        <span className="text-sans-14 lg:text-sans-16 font-600 tracking-wide">{formatFullDate(artist.date)}</span>
        <span className="text-sans-12 lg:text-sans-14 font-600 tracking-widest text-[var(--vividGreen)] group-hover:italic transition-all">
          Se artist →
        </span>
      </div>
    </Link>
  );
}

// ─── Artist Card Component ─────────────────────────────────────────────────
function ArtistCard({ artist }: { artist: ArtistData }) {
  const { day, month } = formatDateComponents(artist.date);

  return (
    <Link
      href={`/arrangemang/${artist.slug.current}`}
      className="relative group flex flex-col overflow-hidden border border-black border-solid transition-colors hover:bg-gray-50"
      aria-label={artist.name}
    >
      {/* Image container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
        {artist.image ? (
          <Image
            src={urlFor(artist.image).width(800).quality(80).url()}
            alt={artist.name}
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
        {/* Date chip overlay */}
        <div className="absolute top-3 left-3 z-10 flex items-stretch border border-black/80 shadow-sm">
          <div className="flex flex-col items-center justify-center bg-white text-black px-2 py-1 min-w-[36px]">
            <span className="text-sans-22 font-600 leading-none">{day}</span>
            <span className="text-sans-10 font-600 tracking-widest">{month}</span>
          </div>
        </div>
      </div>

      {/* Card footer with artist info */}
      <div className="flex items-center justify-between px-3 py-3 border-t border-black border-solid bg-[var(--background)]">
        <h2 className="text-sans-14 lg:text-sans-16 font-600 uppercase truncate mr-2 group-hover:italic transition-all flex-1">
          {artist.name}
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

// ─── Artists Grid Component ────────────────────────────────────────────────
function ArtistsGrid({ artists }: { artists: ArtistData[] }) {
  if (artists.length === 0) {
    return (
      <p className="text-sans-16 text-gray-600 font-500">
        Inga artister tillgängliga för tillfället.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px border border-black border-solid">
      {artists.map((artist) => (
        <ArtistCard key={artist._id} artist={artist} />
      ))}
    </div>
  );
}

// ─── Main Arrangemang List Component ────────────────────────────────────────
export default function ArrangemangList({ initialArtists }: ArrangemangListProps) {
  const [upcomingArtists, setUpcomingArtists] = useState<ArtistData[]>([]);
  const [pastArtists, setPastArtists] = useState<ArtistData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!initialArtists || initialArtists.length === 0) {
      setIsLoading(false);
      return;
    }

    const now = new Date();
    
    const upcomingFiltered = initialArtists
      .filter((artist) => new Date(artist.date) >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    const pastFiltered = initialArtists
      .filter((artist) => new Date(artist.date) < now)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setUpcomingArtists(upcomingFiltered);
    setPastArtists(pastFiltered);
    setIsLoading(false);
  }, [initialArtists]);

  if (isLoading) {
    return (
      <main className="px-2 py-3 lg:px-5">
        <p className="text-sans-16 text-gray-500">Laddar artister...</p>
      </main>
    );
  }

  if (!initialArtists || initialArtists.length === 0) {
    return (
      <main className="px-2 py-3 lg:px-5">
        <p className="text-sans-16 text-gray-500">Inga artister tillgängliga för tillfället.</p>
      </main>
    );
  }

  const allArtists = [...upcomingArtists, ...pastArtists];
  const featuredArtist = upcomingArtists[0] ?? pastArtists[0] ?? null;
  const remainingUpcomingArtists = upcomingArtists.slice(1);

  // Structured data for search engines
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Music For Pennies - Artister',
    description: 'En lista över alla artister och musiker representerade av Music For Pennies.',
    url: 'https://musicforpennies.se/arrangemang',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: allArtists.map((artist, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: artist.name,
        url: `https://musicforpennies.se/arrangemang/${artist.slug.current}`,
      })),
    },
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Featured artist hero banner */}
      {featuredArtist && <ArtistHeroBanner artist={featuredArtist} />}

      {/* Upcoming artists section */}
      <section
        aria-label="Kommande artister"
        className="px-2 py-3 lg:px-5 mt-12 lg:mt-20 mb-16 lg:mb-20 uppercase"
      >
        <SectionHeader title="Kommande artister" />
        {remainingUpcomingArtists.length > 0 ? (
          <ArtistsGrid artists={remainingUpcomingArtists} />
        ) : (
          <p className="text-sans-16 text-gray-600">
            {upcomingArtists.length === 0
              ? 'Inga kommande artister för tillfället.'
              : 'Inga fler kommande artister.'}
          </p>
        )}
      </section>

      {/* Past artists section */}
      {pastArtists.length > 0 && (
        <section
          aria-label="Tidigare artister"
          className="px-2 py-3 lg:px-5 mb-16 lg:mb-20 uppercase"
        >
          <SectionHeader title="Tidigare artister" />
          <ArtistsGrid artists={pastArtists} />
        </section>
      )}
    </main>
  );
}
