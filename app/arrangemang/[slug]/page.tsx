/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import Image from 'next/image';
import Link from 'next/link';
import { client } from '@/sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { generateMetadata } from './metadata';
import { PortableText, PortableTextBlock } from 'next-sanity';

export const revalidate = 30;

// Define the type for Sanity image source
interface SanityImageSource {
  asset: {
    _ref: string;
  };
}

// Define the arrangemang data structure matching arrangemangType
interface Arrangemang {
  currentURL: string;
  Namn: string;
  Beskrivning: PortableTextBlock[];
  Bild: SanityImageSource;
}

const builder = imageUrlBuilder(client);

function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

async function getData(slug: string): Promise<Arrangemang | null> {
  const query = `
    *[_type == "arrangemang" && URL.current == '${slug}'] {
        "currentURL": URL.current,
        Namn,
        Beskrivning,
        Bild,
      }[0]`;

  const arrangemang = await client.fetch<Arrangemang>(query);
  return arrangemang;
}

// Export metadata from the separate file
export { generateMetadata };

// Type params as a Promise and await it
export default async function ArrangemangDetail({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const arrangemang = await getData(resolvedParams.slug);

  if (!arrangemang) {
    return <div>Arrangemang not found</div>;
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: arrangemang.Namn,
    description: arrangemang.Beskrivning,
    image: arrangemang.Bild ? urlFor(arrangemang.Bild).url() : undefined,
    url: `https://musicforpennies.se/arrangemang/${arrangemang.currentURL}`,
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="grid grid-cols-12 gap-px">
        <div className="col-span-12 relative h-full grid-col-border">
          <div className="grid grid-cols-12 gap-px items-start">
            <div className="col-span-12 lg:col-span-6 grid-col-border">
              <ul className="flex flex-col gap-px">
                <li className="px-2 py-3 lg:px-5">
                  <h1 className="text-sans-35 lg:text-sans-60 font-600">{arrangemang.Namn}</h1>
                  <div className="mt-4 text-lg leading-relaxed prose">
                    <PortableText value={arrangemang.Beskrivning} />
                  </div>
                </li>
              </ul>
            </div>
            <div className="hidden lg:block col-span-6 grid-col-border sticky top-7 min-h-hero-minus-header overflow-hidden">
              <div className="image overflow-hidden absolute inset-0">
                <Image
                  src={urlFor(arrangemang.Bild).url()}
                  alt={arrangemang.Namn}
                  className="w-full h-full object-cover noise"
                  width={1000}
                  height={1000}
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
