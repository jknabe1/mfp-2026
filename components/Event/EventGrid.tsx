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
          .filter((event) => new Date(event.date) >= now)
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        const past = data
          .filter((event) => new Date(event.date) < now)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        setUpcomingEvents(upcoming);
        setPastEvents(past);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  // Combine all for JSON-LD
  const allEvents = [...upcomingEvents, ...pastEvents];
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EventSeries',
    'name': 'Music For Pennies Events',
    'description': 'A list of concerts and events at Music For Pennies.',
    'event': allEvents.map((event) => ({
      '@type': 'MusicEvent',
      'name': event.name,
      'startDate': event.date,
      'eventStatus': 'https://schema.org/EventScheduled',
      'image': event.image ? urlFor(event.image).url() : undefined,
      'url': `https://musicforpennies.se/event/${event.slug.current}`,
    })),
  };

  const renderEventCard = (event: Event) => (
    <Link
      key={event._id}
      href={`/event/${event.slug.current}`}
      className="relative group overflow-hidden border-b md:border-b-0 md:border-r last:border-b-0 last:md:border-r-0 border-gray-200"
    >
      <div className="absolute top-4 left-4 z-10 flex flex-col items-start gap-1">
        <div className="bg-white text-black px-2 py-1 inline-block">
          <span className="text-[--vividGreen]">■</span> {event.name}
        </div>
        <div className="bg-white text-black px-2 py-1 inline-block">
          {new Date(event.date).toLocaleDateString()}
        </div>
      </div>

      <div className="noise relative aspect-[4/5] lg:aspect-[6/5] border border-black border-solid">
        {event.image ? (
          <Image
            src={urlFor(event.image).url()}
            alt={event.name}
            loading="lazy"
            width={1536}
            height={1920}
            className="h-full w-full object-cover border-solid border-black transition-transform duration-500 group-hover:scale-105"
            sizes="50vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full w-full bg-gray-200 text-black">
            Bild saknas...
          </div>
        )}
      </div>
    </Link>
  );

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {upcomingEvents.length > 0 ? (
        <section className="px-2 py-3 lg:px-5 relative mt-10 lg:mt-16 mb-10 lg:mb-16 uppercase">
          <h2 className="text-sans-35 lg:text-sans-60 font-600 mb-10">Kommande event</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {upcomingEvents.map(renderEventCard)}
          </div>
        </section>
      ) : (
        <section className="px-2 py-3 lg:px-5 relative mt-10 lg:mt-16 mb-10 lg:mb-16 uppercase">
          <h2 className="text-sans-35 lg:text-sans-60 font-600 mb-10">Kommande event</h2>
          <p className="text-gray-500">Inga kommande event för tillfället.</p>
        </section>
      )}

      {pastEvents.length > 0 && (
        <section className="px-2 py-3 lg:px-5 relative mt-10 lg:mt-16 mb-10 lg:mb-16 uppercase">
          <h2 className="text-sans-35 lg:text-sans-60 font-600 mb-10">Tidigare event</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {pastEvents.map(renderEventCard)}
          </div>
        </section>
      )}
    </div>
  );
};

export default EventGrid;