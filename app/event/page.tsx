import React from 'react';
import EventArchiveList from '@/components/Event/EventArchiveList';
import { client } from '@/sanity/client';
import type { Metadata } from 'next';
import imageUrlBuilder from '@sanity/image-url';

export const revalidate = 30;

const builder = imageUrlBuilder(client);

interface SanityImageSource {
  asset: {
    _ref: string;
  };
}

function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

interface Event {
  _id: string;
  name: string;
  date: string;
  image?: SanityImageSource;
  slug: { current: string };
  eventType?: string;
  venue?: { name?: string; City?: string };
  description?: string;
}

async function fetchEvents(): Promise<Event[]> {
  const query = '*[_type == "event"] | order(date desc)';
  return await client.fetch<Event[]>(query);
}

export async function generateMetadata(): Promise<Metadata> {
  const events = await fetchEvents();

  return {
    title: 'Festival Archive - Music For Pennies',
    description: 'Utforska alla event och festival-aktiviteter från Music For Pennies.',
    openGraph: {
      title: 'Festival Archive - Music For Pennies',
      description: 'Se alla event från Music For Pennies festival.',
      url: 'https://musicforpennies.se/event',
      siteName: 'Music For Pennies',
      images: events.length > 0
        ? events.slice(0, 1).map((event) => ({
            url: event.image ? urlFor(event.image).width(1200).height(630).url() : 'https://musicforpennies.se/assets/default-event.jpg'
          }))
        : [{ url: 'https://musicforpennies.se/assets/default-event.jpg' }],
      type: 'website',
    },
  };
}

export default async function EventPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || '1', 10);
  const events = await fetchEvents();
  const totalCount = events.length;

  return <EventArchiveList initialEvents={events} currentPage={currentPage} totalCount={totalCount} />;
}
