"use client";

import React, { useEffect, useState } from 'react';
import imageUrlBuilder from '@sanity/image-url';
import { client } from '@/sanity/client';
import Link from 'next/link';
import Image from 'next/image';
import CursorGradientHero from './CursorGradientHero';
import CursorFollowImage from './CursorFollowImage';

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

// ─── Date helpers ─────────────────────────────────────────────────────────────
function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('sv-SE', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

function getDateParts(dateStr: string) {
  const d = new Date(dateStr);
  return {
    day:     d.toLocaleDateString('sv-SE', { day: '2-digit' }),
    weekday: d.toLocaleDateString('en-SE', { weekday: 'short' }).toUpperCase(),
    month:   d.toLocaleDateString('sv-SE', { month: 'short' }).toUpperCase(),
    year:    d.getFullYear().toString(),
    monthLong: d.toLocaleDateString('sv-SE', { month: 'long' }),
    monthNum: d.getMonth(),
    yearNum:  d.getFullYear(),
  };
}

function groupByMonth(events: Event[]) {
  const groups: { label: string; monthNum: number; yearNum: number; events: Event[] }[] = [];
  for (const event of events) {
    const { monthLong, monthNum, yearNum } = getDateParts(event.date);
    const label = `${monthLong.charAt(0).toUpperCase() + monthLong.slice(1)} ${yearNum}`;
    let group = groups.find(g => g.monthNum === monthNum && g.yearNum === yearNum);
    if (!group) {
      group = { label, monthNum, yearNum, events: [] };
      groups.push(group);
    }
    group.events.push(event);
  }
  return groups;
}

// ─── Hero Banner ──────────────────────────────────────────────────────────────
function EventHeroBanner({ event }: { event: Event }) {
  const { day, month, year } = getDateParts(event.date);
  return (
    <Link
      href={`/event/${event.slug.current}`}
      className="group block relative w-full overflow-hidden border-b border-black border-solid"
      aria-label={`Gå till event: ${event.name}`}
    >
      <CursorGradientHero className="h-[56vw] min-h-[300px] max-h-[90vh]">
        <div className="relative w-full h-full">
          {event.image ? (
            <Image
              src={urlFor(event.image).width(2400).quality(90).url()}
              alt={event.name}
              fill priority
              className="object-cover noise transition-transform duration-700 group-hover:scale-[1.02]"
              sizes="100vw"
            />
          ) : (
            <div className="absolute inset-0 bg-black" />
          )}
          {/* Label */}
          <div className="absolute top-4 left-4 lg:top-6 lg:left-6 z-10">
            <span className="inline-flex items-center gap-1.5 bg-[var(--vividGreen)] text-black text-sans-12 font-600 px-2 py-1 uppercase tracking-widest">
              <span aria-hidden="true">■</span> Nästa event
            </span>
          </div>
          {/* Bottom overlay */}
          <div className="absolute bottom-0 left-0 right-0 z-10 px-4 pb-6 lg:px-8 lg:pb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h1 className="text-white uppercase font-600 text-sans-35 lg:text-sans-60 xl:text-sans-120 leading-none text-balance max-w-[80%]">
              {event.name}
            </h1>
            <div className="flex items-stretch shrink-0 border border-white/60">
              <div className="flex flex-col items-center justify-center px-4 py-3 min-w-[64px]">
                <span className="text-white text-sans-35 lg:text-sans-60 font-600 leading-none">{day}</span>
                <span className="text-white text-sans-10 font-600 tracking-widest mt-1">{month}</span>
              </div>
              <div className="flex flex-col items-center justify-center px-4 py-3 border-l border-white/60">
                <span className="text-white text-sans-16 font-600 tracking-widest">{year}</span>
              </div>
            </div>
          </div>
        </div>
      </CursorGradientHero>

      {/* Info bar */}
      <div className="flex items-center justify-between px-4 py-3 lg:px-8 lg:py-4 bg-black text-white uppercase">
        <span className="text-sans-14 lg:text-sans-16 font-600 tracking-wide">{formatDate(event.date)}</span>
        <span className="text-sans-12 lg:text-sans-14 font-600 tracking-widest text-[var(--vividGreen)] group-hover:italic transition-all">
          Se event →
        </span>
      </div>
    </Link>
  );
}

// ─── Event Row (Debaser-style list row with cursor-following image) ───────────
function EventRow({ event, isPast }: { event: Event; isPast: boolean }) {
  const { day, weekday, month, year } = getDateParts(event.date);
  const type = (event.eventType === 'virtual' ? 'ONLINE' : 'KONSERT').toUpperCase();
  const imageUrl = event.image ? urlFor(event.image).width(480).quality(80).url() : '';

  return (
    <CursorFollowImage imageUrl={imageUrl} alt={event.name}>
      <Link
        href={`/event/${event.slug.current}`}
        className="group grid grid-cols-[auto_1fr] md:grid-cols-[120px_auto_1fr_auto] items-center gap-px border-b border-black border-solid hover:bg-black hover:text-white transition-colors duration-150"
        aria-label={event.name}
      >
        {/* Date block */}
        <div className="flex flex-col items-center justify-center bg-black text-white px-4 py-5 md:px-6 md:py-6 min-w-[80px] md:min-w-[120px] self-stretch">
          <span className="text-sans-10 font-600 tracking-widest opacity-70 uppercase">{weekday}</span>
          <span className="text-sans-48 font-700 leading-none mt-0.5">{day}</span>
          <span className="text-sans-10 font-600 tracking-widest mt-0.5 uppercase">{month}</span>
          <span className="text-sans-10 font-600 tracking-widest opacity-50 mt-0.5">{year}</span>
        </div>

        {/* Type badge — hidden on mobile, shown as pill on md+ */}
        <div className="hidden md:flex items-center justify-center self-stretch px-3 border-r border-l border-black bg-[var(--background)] group-hover:bg-black">
          <span className="text-sans-10 font-700 tracking-widest uppercase rotate-[-90deg] whitespace-nowrap opacity-60">
            {type}
          </span>
        </div>

        {/* Main content */}
        <div className="flex flex-col justify-center px-4 py-5 md:px-6 md:py-6 min-w-0">
          {/* Mobile: show type inline */}
          <span className="md:hidden text-sans-9 font-700 tracking-widest uppercase opacity-50 mb-1">{type}</span>

          <h3 className="text-sans-16 md:text-sans-22 font-700 uppercase leading-tight line-clamp-2 group-hover:italic transition-all">
            {event.name}
          </h3>

          {event.venue?.name && (
            <p className="text-sans-12 font-600 tracking-wide uppercase opacity-60 mt-1.5">
              {[event.venue.name, event.venue.City].filter(Boolean).join(' — ')}
            </p>
          )}
        </div>

        {/* Right: status / CTA */}
        <div className="hidden md:flex flex-col items-center justify-center self-stretch px-6 border-l border-black gap-2 min-w-[120px]">
          {isPast ? (
            <span className="text-sans-10 font-700 tracking-widest uppercase opacity-40 text-center">Avslutat</span>
          ) : event.tickets ? (
            <span className="inline-block bg-[var(--vividGreen)] text-black text-sans-10 font-700 tracking-widest uppercase px-3 py-1.5 text-center group-hover:bg-white transition-colors">
              Biljetter
            </span>
          ) : (
            <span className="text-sans-10 font-700 tracking-widest uppercase opacity-40 text-center">Info</span>
          )}
          <span className="text-sans-18 font-700 group-hover:translate-x-1 transition-transform" aria-hidden="true">→</span>
        </div>
      </Link>
    </CursorFollowImage>
  );
}

// ─── Month Group ───────────────────────────────────────────────────────────────
function MonthGroup({ label, events, isPast }: { label: string; events: Event[]; isPast: boolean }) {
  return (
    <div>
      {/* Month header */}
      <div className="flex items-baseline gap-4 px-4 lg:px-8 py-4 border-b border-black border-solid bg-[var(--background)] sticky top-0 z-20">
        <span className="text-sans-22 lg:text-sans-35 font-700 uppercase tracking-tight">{label}</span>
        <span className="text-sans-12 font-600 uppercase tracking-widest opacity-50">{events.length} event</span>
      </div>
      {/* Rows */}
      <div>
        {events.map((event) => (
          <EventRow key={event._id} event={event} isPast={isPast} />
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
const EventGrid = () => {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents]         = useState<Event[]>([]);

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
        setUpcomingEvents(
          data.filter(e => new Date(e.date) >= now)
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        );
        setPastEvents(
          data.filter(e => new Date(e.date) < now)
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        );
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
    fetchEvents();
  }, []);

  const featuredEvent     = upcomingEvents[0] ?? pastEvents[0] ?? null;
  const remainingUpcoming = upcomingEvents.slice(1);
  const upcomingGroups    = groupByMonth(remainingUpcoming);
  const pastGroups        = groupByMonth(pastEvents);

  const allEvents = [...upcomingEvents, ...pastEvents];
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EventSeries',
    name: 'Music For Pennies Events',
    description: 'A list of concerts and events at Music For Pennies.',
    event: allEvents.map((e) => ({
      '@type': 'MusicEvent',
      name: e.name,
      startDate: e.date,
      eventStatus: 'https://schema.org/EventScheduled',
      image: e.image ? urlFor(e.image).url() : undefined,
      url: `https://musicforpennies.se/event/${e.slug.current}`,
    })),
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Hero banner ──────────────────────────────────────────── */}
      {featuredEvent && <EventHeroBanner event={featuredEvent} />}

      {/* ── Upcoming events ──────────────────────────────────────── */}
      <section aria-label="Kommande event">
        {/* Section label */}
        <div className="flex items-baseline justify-between px-4 lg:px-8 py-10 lg:py-14 border-t border-black border-solid">
          <h2 className="text-sans-35 lg:text-sans-60 font-700 uppercase tracking-tight">
            Kommande
          </h2>
          <span className="text-sans-12 font-600 uppercase tracking-widest opacity-50">
            {remainingUpcoming.length} event
          </span>
        </div>

        {upcomingGroups.length > 0 ? (
          <div className="border-t border-black border-solid">
            {upcomingGroups.map((group) => (
              <MonthGroup
                key={`${group.monthNum}-${group.yearNum}`}
                label={group.label}
                events={group.events}
                isPast={false}
              />
            ))}
          </div>
        ) : (
          <div className="px-4 lg:px-8 py-12 border-t border-black border-solid bg-gray-50">
            <p className="text-sans-16 font-600 uppercase opacity-50">
              {upcomingEvents.length === 0
                ? 'Inga kommande event för tillfället.'
                : 'Inga fler kommande event.'}
            </p>
          </div>
        )}
      </section>

      {/* ── Past events ──────────────────────────────────────────── */}
      {pastGroups.length > 0 && (
        <section aria-label="Tidigare event">
          <div className="flex items-baseline justify-between px-4 lg:px-8 py-10 lg:py-14 border-t border-black border-solid">
            <h2 className="text-sans-35 lg:text-sans-60 font-700 uppercase tracking-tight">
              Tidigare
            </h2>
            <span className="text-sans-12 font-600 uppercase tracking-widest opacity-50">
              {pastEvents.length} event
            </span>
          </div>
          <div className="border-t border-black border-solid">
            {pastGroups.map((group) => (
              <MonthGroup
                key={`${group.monthNum}-${group.yearNum}`}
                label={group.label}
                events={group.events}
                isPast={true}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
};

export default EventGrid;

