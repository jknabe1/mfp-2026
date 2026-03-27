'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { urlFor, SanityImageSource } from '@/lib/utils';
import Image from 'next/image';

interface Artist {
  _id: string;
  name: string;
  slug: { current: string };
  date: string;
  image: SanityImageSource;
}

interface ArrangemangListProps {
  initialArtists: Artist[];
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('sv-SE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatDateShort(dateStr: string) {
  const d = new Date(dateStr);
  return {
    day: d.toLocaleDateString('sv-SE', { day: '2-digit' }),
    month: d.toLocaleDateString('sv-SE', { month: 'short' }).toUpperCase(),
    year: d.getFullYear().toString(),
  };
}

// ─── Hero Banner ────────────────────────────────────────────────────────────
function ArtistHeroBanner({ artist }: { artist: Artist }) {
  const { day, month, year } = formatDateShort(artist.date);

  return (
    <Link
      href={`/arrangemang/${artist.slug.current}`}
      className="group block relative w-full overflow-hidden border-b border-black border-solid"
      aria-label={`Gå till artist: ${artist.name}`}
    >
      {/* Full-width image */}
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
        {/* Dark scrim for legibility */}
        <div className="absolute inset-0 bg-black/40" />

        {/* "FEATURED" label top-left */}
        <div className="absolute top-4 left-4 lg:top-6 lg:left-6 z-10">
          <span className="inline-flex items-center gap-1.5 bg-[var(--vividGreen)] text-black text-sans-12 font-600 px-2 py-1 uppercase tracking-widest">
            <span aria-hidden="true">■</span> Aktuell artist
          </span>
        </div>

        {/* Bottom overlay: artist info */}
        <div className="absolute bottom-0 left-0 right-0 z-10 px-4 pb-6 lg:px-8 lg:pb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          {/* Artist name */}
          <h1 className="text-white uppercase font-600 text-sans-35 lg:text-sans-60 xl:text-sans-120 leading-none text-balance max-w-[80%]">
            {artist.name}
          </h1>

          {/* Date block */}
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
      <div className="flex items-center justify-between px-4 py-3 lg:px-8 lg:py-4 bg-black text-white uppercase">
        <span className="text-sans-14 lg:text-sans-16 font-600 tracking-wide">{formatDate(artist.date)}</span>
        <span className="text-sans-12 lg:text-sans-14 font-600 tracking-widest text-[var(--vividGreen)] group-hover:italic transition-all">
          Se artist →
        </span>
      </div>
    </Link>
  );
}

// ─── Artist Card ────────────────────────────────────────────────────────────
function ArtistCard({ artist }: { artist: Artist }) {
  const { day, month } = formatDateShort(artist.date);

  return (
    <Link
      href={`/arrangemang/${artist.slug.current}`}
      className="relative group flex flex-col overflow-hidden border border-black border-solid"
      aria-label={artist.name}
    >
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden">
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
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-black text-sans-12 uppercase">
            Bild saknas
          </div>
        )}
        {/* Date chip */}
        <div className="absolute top-3 left-3 z-10 flex items-stretch border border-black/80">
          <div className="flex flex-col items-center justify-center bg-white text-black px-2 py-1 min-w-[36px]">
            <span className="text-sans-22 font-600 leading-none">{day}</span>
            <span className="text-sans-10 font-600 tracking-widest">{month}</span>
          </div>
        </div>
      </div>

      {/* Card footer */}
      <div className="flex items-center justify-between px-3 py-3 border-t border-black border-solid bg-[var(--background)]">
        <h2 className="text-sans-14 lg:text-sans-16 font-600 uppercase truncate mr-2 group-hover:italic transition-all">
          {artist.name}
        </h2>
        <span className="text-[var(--vividGreen)] shrink-0 text-sans-12 font-600" aria-hidden="true">■</span>
      </div>
    </Link>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ArrangemangList({ initialArtists }: ArrangemangListProps) {
  const [upcomingArtists, setUpcomingArtists] = useState<Artist[]>([]);
  const [pastArtists, setPastArtists] = useState<Artist[]>([]);

  useEffect(() => {
    if (!initialArtists || initialArtists.length === 0) {
      return;
    }

    const now = new Date();
    const upcoming = initialArtists
      .filter((a) => new Date(a.date) >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const past = initialArtists
      .filter((a) => new Date(a.date) < now)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setUpcomingArtists(upcoming);
    setPastArtists(past);
  }, [initialArtists]);

  if (!initialArtists || initialArtists.length === 0) {
    return (
      <main className="px-2 py-3 lg:px-5">
        <p className="text-sans-16 text-gray-500">Inga artister tillgängliga för tillfället.</p>
      </main>
    );
  }

  const allArtists = [...upcomingArtists, ...pastArtists];
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Music For Pennies - Artister',
    description: 'En lista över alla artister och musiker representerade av Music For Pennies.',
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

  // The feature banner uses the soonest upcoming artist; if none, the most recent past artist
  const featuredArtist = upcomingArtists[0] ?? pastArtists[0] ?? null;
  // Remaining upcoming artists (skip the featured one)
  const remainingUpcoming = upcomingArtists.slice(1);

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Hero banner ─────────────────────────────────────────── */}
      {featuredArtist && <ArtistHeroBanner artist={featuredArtist} />}

      {/* ── Upcoming artists (minus featured) ───────────────────── */}
      <section
        aria-label="Kommande artister"
        className="px-2 py-3 lg:px-5 mt-10 lg:mt-16 mb-10 lg:mb-16 uppercase"
      >
        <h2 className="text-sans-35 lg:text-sans-60 font-600 mb-8 border-b border-black border-solid pb-4">
          Kommande artister
        </h2>
        {remainingUpcoming.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px border border-black border-solid">
            {remainingUpcoming.map((artist) => (
              <ArtistCard key={artist._id} artist={artist} />
            ))}
          </div>
        ) : (
          <p className="text-sans-16 text-gray-500">
            {upcomingArtists.length === 0
              ? 'Inga kommande artister för tillfället.'
              : 'Inga fler kommande artister.'}
          </p>
        )}
      </section>

      {/* ── Past artists ────────────────────────────────────────── */}
      {pastArtists.length > 0 && (
        <section
          aria-label="Tidigare artister"
          className="px-2 py-3 lg:px-5 mt-0 mb-10 lg:mb-16 uppercase"
        >
          <h2 className="text-sans-35 lg:text-sans-60 font-600 mb-8 border-b border-black border-solid pb-4">
            Tidigare artister
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px border border-black border-solid">
            {pastArtists.map((artist) => (
              <ArtistCard key={artist._id} artist={artist} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
