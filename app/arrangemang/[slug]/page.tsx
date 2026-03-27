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
    return (
      <main className="flex items-center justify-center min-h-[60vh] px-4">
        <p className="text-sans-35 font-600 uppercase">Arrangemang hittades inte</p>
      </main>
    );
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
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Full-width banner ──────────────────────────────────────────────── */}
      <div className="relative w-full overflow-hidden border-b border-black border-solid">
        {/* Banner image */}
        <div className="relative w-full h-[56vw] min-h-[300px] max-h-[90vh]">
          {arrangemang.Bild ? (
            <Image
              src={urlFor(arrangemang.Bild).width(2400).quality(90).url()}
              alt={arrangemang.Namn}
              fill
              priority
              className="object-cover noise"
              sizes="100vw"
            />
          ) : (
            <div className="absolute inset-0 bg-black" />
          )}

          {/* Gradient scrim — stronger at bottom for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Bottom overlay: arrangemang name */}
          <div className="absolute bottom-0 left-0 right-0 z-10 px-4 pb-5 lg:px-8 lg:pb-8 flex flex-col items-start">
            <h1 className="text-white uppercase font-600 text-sans-35 lg:text-sans-60 xl:text-sans-120 leading-none text-balance max-w-[85%]">
              {arrangemang.Namn}
            </h1>
          </div>
        </div>

        {/* Banner info bar */}
        <div className="flex items-center justify-between px-4 py-3 lg:px-8 lg:py-4 bg-black text-white uppercase">
          <span className="text-sans-12 lg:text-sans-14 font-600 tracking-wide">
            Arrangemang
          </span>
          <Link
            href="/arrangemang"
            className="text-sans-12 font-600 tracking-widest text-[var(--vividGreen)] hover:italic transition-all"
          >
            ← Alla arrangemang
          </Link>
        </div>
      </div>

      {/* ── Content below banner ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-px">

        {/* Left column: description */}
        <div className="lg:col-span-8 grid-col-border">

          {/* Description */}
          {arrangemang.Beskrivning && (
            <div className="px-4 py-6 lg:px-8 lg:py-10 border-b border-black border-solid">
              <p className="text-sans-12 font-600 uppercase tracking-widest opacity-50 mb-4">
                Om arrangemanget
              </p>
              <div className="prose prose-sm lg:prose-base max-w-none text-sans-16 leading-relaxed rich-text">
                <PortableText value={arrangemang.Beskrivning} />
              </div>
            </div>
          )}
        </div>

        {/* Right column: supplementary info (optional for future use) */}
        <div className="lg:col-span-4 grid-col-border">
          <div className="px-4 py-6 lg:px-8 lg:py-10 border-b border-black border-solid lg:border-b-0">
            <p className="text-sans-12 font-600 uppercase tracking-widest opacity-50 mb-4">
              Information
            </p>
            <div className="flex flex-col gap-3">
              <p className="text-sans-14 leading-relaxed">
                Utforska detta arrangemang från Music For Pennies.
              </p>
              <Link
                href="/arrangemang"
                className="text-sans-12 font-600 tracking-widest text-[var(--vividGreen)] hover:italic transition-all inline-block mt-2"
              >
                Se fler arrangemang →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
