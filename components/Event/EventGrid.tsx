"use client";

import React, { useEffect, useState } from 'react';
import imageUrlBuilder from '@sanity/image-url';
import { client } from '@/sanity/client';
import Link from 'next/link';
import Image from 'next/image';

// Define the Sanity image source type
interface SanityImageSource {
  asset: {
    _ref: string;
  };
}

const builder = imageUrlBuilder(client);
function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// Define the Event data structure
interface Event {
  _id: string;
  name: string;
  slug: { current: string };
  date: string;
  image?: SanityImageSource;
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
function EventHeroBanner({ event }: { event: Event }) {
  const { day, month, year } = formatDateShort(event.date);

  return (
    <Link
      href={`/event/${event.slug.current}`}
      className="group block relative w-full overflow-hidden border-b border-black border-solid"
      aria-label={`Gå till event: ${event.name}`}
    >
      {/* Full-width image */}
      <div className="relative w-full h-[60vw] min-h-[320px] max-h-[85vh]">
        {event.image ? (
          <Image
            src={urlFor(event.image).width(2400).quality(85).url()}
            alt={event.name}
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
            <span aria-hidden="true">■</span> Nästa event
          </span>
        </div>

        {/* Bottom overlay: event info */}
        <div className="absolute bottom-0 left-0 right-0 z-10 px-4 pb-6 lg:px-8 lg:pb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          {/* Event name */}
          <h1 className="text-white uppercase font-600 text-sans-35 lg:text-sans-60 xl:text-sans-120 leading-none text-balance max-w-[80%]">
            {event.name}
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
        <span className="text-sans-14 lg:text-sans-16 font-600 tracking-wide">{formatDate(event.date)}</span>
        <span className="text-sans-12 lg:text-sans-14 font-600 tracking-widest text-[var(--vividGreen)] group-hover:italic transition-all">
          Se event →
        </span>
      </div>
    </Link>
  );
}

// ─── Event Card ──────────────────────────────────────────────────────────────
function EventCard({ event }: { event: Event }) {
  const { day, month } = formatDateShort(event.date);

  return (
    <Link
      href={`/event/${event.slug.current}`}
      className="relative group flex flex-col overflow-hidden border border-black border-solid"
      aria-label={event.name}
    >
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden">
        {event.image ? (
          <Image
            src={urlFor(event.image).width(800).quality(80).url()}
            alt={event.name}
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
          {event.name}
        </h2>
        <span className="text-[var(--vividGreen)] shrink-0 text-sans-12 font-600" aria-hidden="true">■</span>
      </div>
    </Link>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
const EventGrid = () => {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await client.fetch<Event[]>(
          '*[_type == "event" && defined(slug.current) && defined(date)]'
        );
        const now = new Date();
        const upcoming = data
          .filter((e) => new Date(e.date) >= now)
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        const past = data
          .filter((e) => new Date(e.date) < now)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setUpcomingEvents(upcoming);
        setPastEvents(past);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
    fetchEvents();
  }, []);

  const allEvents = [...upcomingEvents, ...pastEvents];
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EventSeries',
    name: 'Music For Pennies Events',
    description: 'A list of concerts and events at Music For Pennies.',
    event: allEvents.map((event) => ({
      '@type': 'MusicEvent',
      name: event.name,
      startDate: event.date,
      eventStatus: 'https://schema.org/EventScheduled',
      image: event.image ? urlFor(event.image).url() : undefined,
      url: `https://musicforpennies.se/event/${event.slug.current}`,
    })),
  };

  // The feature banner uses the soonest upcoming event; if none, the most recent past event
  const featuredEvent = upcomingEvents[0] ?? pastEvents[0] ?? null;
  // Remaining upcoming events (skip the featured one)
  const remainingUpcoming = upcomingEvents.slice(1);

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Hero banner ─────────────────────────────────────────── */}
      {featuredEvent && <EventHeroBanner event={featuredEvent} />}

      {/* ── Upcoming events (minus featured) ────────────────────── */}
      <section
        aria-label="Kommande event"
        className="px-2 py-3 lg:px-5 mt-10 lg:mt-16 mb-10 lg:mb-16 uppercase"
      >
        <h2 className="text-sans-35 lg:text-sans-60 font-600 mb-8 border-b border-black border-solid pb-4">
          Kommande event
        </h2>
        {remainingUpcoming.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px border border-black border-solid">
            {remainingUpcoming.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        ) : (
          <p className="text-sans-16 text-gray-500">
            {upcomingEvents.length === 0
              ? 'Inga kommande event för tillfället.'
              : 'Inga fler kommande event.'}
          </p>
        )}
      </section>

      {/* ── Past events ─────────────────────────────────────────── */}
      {pastEvents.length > 0 && (
        <section
          aria-label="Tidigare event"
          className="px-2 py-3 lg:px-5 mt-0 mb-10 lg:mb-16 uppercase"
        >
          <h2 className="text-sans-35 lg:text-sans-60 font-600 mb-8 border-b border-black border-solid pb-4">
            Tidigare event
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px border border-black border-solid">
            {pastEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
};

export default EventGrid;
