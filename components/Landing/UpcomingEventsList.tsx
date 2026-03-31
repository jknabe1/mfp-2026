'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import imageUrlBuilder from '@sanity/image-url';
import { client } from '@/sanity/client';

interface SanityImageSource {
  asset: { _ref: string };
}

interface Event {
  _id: string;
  name: string;
  slug: { current: string };
  date: string;
  image?: SanityImageSource;
  eventType?: string;
  venue?: { name?: string; City?: string };
  tickets?: string;
}

const builder = imageUrlBuilder(client);
function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('sv-SE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// ─── Section header ─────────────────────────────────────────────────────────
function SectionHeader({ count }: { count: number }) {
  return (
    <header className="border-b border-black border-solid px-4 sm:px-6 lg:px-8 py-10 lg:py-14 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
      <div>
        <span className="inline-flex items-center gap-1.5 text-sans-10 font-600 uppercase tracking-widest text-black/40 mb-3">
          <span className="text-[var(--vividGreen)]" aria-hidden="true">■</span>
          Music For Pennies
        </span>
        <h2 className="text-sans-35 sm:text-sans-45 lg:text-sans-72 font-700 uppercase leading-[0.92] tracking-tight">
          Kommande Events
        </h2>
        <p className="text-sans-13 sm:text-sans-14 text-black/55 mt-3 max-w-md leading-relaxed">
          Missa inte våra kommande konserter och evenemang.
        </p>
      </div>
      {count > 0 && (
        <div className="flex flex-col items-start sm:items-end shrink-0">
          <span className="text-sans-35 lg:text-sans-48 font-700 text-[var(--vividGreen)] leading-none">{count}</span>
          <span className="text-sans-10 font-600 uppercase tracking-widest text-black/40 mt-0.5">kommande</span>
        </div>
      )}
    </header>
  );
}

// ─── Event row — image left, title + date + CTA right ───────────────────────
function EventRow({ event, index }: { event: Event; index: number }) {
  const href = `/event/${event.slug.current}`;

  return (
    <div className="group border-b border-black border-solid flex flex-col sm:flex-row items-stretch">
      {/* Left: image at natural aspect ratio */}
      <Link
        href={href}
        className="block shrink-0 bg-gray-100 sm:w-[260px] lg:w-[360px] overflow-hidden"
        tabIndex={-1}
        aria-hidden="true"
      >
        {event.image ? (
          <Image
            src={urlFor(event.image).width(720).quality(85).url()}
            alt=""
            width={720}
            height={540}
            loading={index < 4 ? 'eager' : 'lazy'}
            className="w-full h-auto object-cover noise transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 260px, 360px"
          />
        ) : (
          <div className="w-full aspect-[4/3] bg-gray-200" />
        )}
      </Link>

      {/* Right: index, title, date, CTA */}
      <div className="flex flex-col justify-between px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6 border-t border-black sm:border-t-0 sm:border-l border-solid flex-1">
        {/* Top: date badge */}
        <span className="inline-flex items-center bg-black text-white text-sans-10 font-700 uppercase tracking-widest px-2 py-0.5 w-fit">
          {formatDate(event.date)}
        </span>

        {/* Middle: title */}
        <h3 className="text-sans-18 sm:text-sans-22 lg:text-sans-35 font-600 uppercase leading-[1.05] text-balance mt-3 group-hover:italic transition-all duration-200">
          <Link href={href} className="hover:text-black">
            {event.name}
          </Link>
        </h3>

        {/* Venue */}
        {event.venue?.name && (
          <p className="text-sans-12 font-600 uppercase tracking-wide text-black/50 mt-2">
            {[event.venue.name, event.venue.City].filter(Boolean).join(' — ')}
          </p>
        )}

        {/* Bottom: CTA link */}
        <div className="mt-4 sm:mt-6">
          <Link
            href={href}
            className="inline-flex items-center gap-2 border border-black px-4 py-2.5 text-sans-11 font-700 uppercase tracking-widest hover:bg-black hover:text-white transition-colors min-h-[44px]"
          >
            {event.tickets ? 'Biljetter' : 'Läs mer'}
            <span className="text-[var(--vividGreen)] group-hover:text-white transition-colors" aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function UpcomingEventsList() {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await client.fetch<Event[]>(
          `*[_type == "event" && defined(slug.current) && defined(date)]{
            _id, name, slug, date, image, eventType, tickets,
            venue->{ name, City }
          }`
        );
        const now = new Date();
        const upcoming = data
          .filter(e => new Date(e.date) >= now)
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setUpcomingEvents(upcoming);
      } catch (error) {
        console.error('Error fetching upcoming events:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (isLoading) {
    return (
      <section className="px-4 lg:px-8 py-20 border-b border-black">
        <p className="text-sans-16 text-black/40 uppercase text-center">Laddar event...</p>
      </section>
    );
  }

  return (
    <section>
      {/* Section header */}
      <SectionHeader count={upcomingEvents.length} />

      {/* Event rows */}
      <div aria-label="Kommande events">
        {upcomingEvents.length === 0 ? (
          <p className="px-4 lg:px-8 py-20 text-sans-16 text-black/40 uppercase text-center border-b border-black">
            Inga kommande events för tillfället.
          </p>
        ) : (
          upcomingEvents.map((event, index) => (
            <EventRow key={event._id} event={event} index={index} />
          ))
        )}
      </div>

      {/* Bottom CTA */}
      <div className="bg-black text-white border-t border-black">
        <div className="px-4 sm:px-6 lg:px-8 py-12 lg:py-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h3 className="text-sans-22 lg:text-sans-28 font-600 uppercase">
              Se alla events
            </h3>
            <p className="text-sans-13 lg:text-sans-14 text-white/50 mt-1 max-w-sm">
              Utforska alla kommande och tidigare konserter.
            </p>
          </div>
          <Link
            href="/event"
            className="inline-flex items-center gap-2 bg-[var(--vividGreen)] text-black px-8 py-4 text-sans-14 font-600 uppercase tracking-widest hover:bg-white transition-colors min-h-[52px] shrink-0"
          >
            <span aria-hidden="true">■</span>
            Alla events
          </Link>
        </div>
      </div>
    </section>
  );
}
