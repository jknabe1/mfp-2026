/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { client } from '@/sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { PortableText, PortableTextBlock } from 'next-sanity';
import ArrangemangClient from './ArrangemangClient';

export const revalidate = 30; // ✅ This works in server component

// Define the type for Sanity image source
interface SanityImageSource {
  asset: {
    _ref: string;
  };
  caption?: string;
}

// Define the arrangemang data structure
interface Arrangemang {
  currentSlug: string;
  Namn: string;
  Beskrivning: PortableTextBlock[];
  additionalInfo?: PortableTextBlock[];
  Bild: SanityImageSource;
  gallery?: SanityImageSource[];
  date?: string;
  location?: string;
  price?: string;
  ticketLink?: string;
  Instagram?: string;
  Facebook?: string;
  spotify?: string;
  excerpt?: string;
}

const builder = imageUrlBuilder(client);

function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

async function getData(slug: string): Promise<Arrangemang | null> {
  const query = `
    *[_type == "arrangemang" && URL.current == '${slug}'] {
        "currentSlug": URL.current,
        Namn,
        Beskrivning,
        additionalInfo,
        Bild,
        gallery[]{
          asset->,
          caption
        },
        date,
        location,
        price,
        ticketLink,
        Instagram,
        Facebook,
        spotify,
        excerpt,
      }[0]`;

  const arrangemang = await client.fetch<Arrangemang>(query);
  return arrangemang;
}

export default async function ArrangemangPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;  // ✅ Await the params Promise
  const arrangemang = await getData(resolvedParams.slug);

  if (!arrangemang) {
    return <div className="px-2 py-3 lg:px-5">Arrangemang not found</div>;
  }

  return <ArrangemangClient arrangemang={arrangemang} />;
}