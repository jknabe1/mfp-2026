/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import Image from 'next/image';
import Link from 'next/link';
import { client } from '@/sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { PortableText, PortableTextBlock } from 'next-sanity';

export const revalidate = 30;

interface SanityImageSource {
  asset: {
    _ref: string;
  };
}

interface Arrangemang {
  _id: string;
  currentSlug: string;
  Namn: string;
  Beskrivning?: PortableTextBlock[];
  Bild: SanityImageSource;
}

const builder = imageUrlBuilder(client);

function urlFor(source: SanityImageSource) {
  return builder.image(source).url();
}

async function getAllArrangemang(): Promise<Arrangemang[]> {
  const query = `
    *[_type == "arrangemang" && defined(URL.current)] | order(Namn asc) {
      _id,
      "currentSlug": URL.current,
      Namn,
      Beskrivning,
      Bild,
    }`;

  return await client.fetch<Arrangemang[]>(query);
}

export default async function ArrangemangLanding() {
  const arrangemang = await getAllArrangemang();

  return (
    <div className="px-2 py-3 lg:px-5">
      {/* Header with border */}
      <section className="relative border-b border-black pb-5 mb-10">
        <h1 className="text-sans-35 lg:text-sans-60 font-600">ARRANGEMANG</h1>
        <p className="text-lg mt-2">
          Läs mer om våra arrangemang och mer i vårt arkiv.
        </p>
      </section>

      {/* 2-column grid */}
      <div className="grid grid-cols-2 gap-5">
        {arrangemang.map((item, index) => (
          <Link
            key={item._id}
            href={`/arrangemang/${item.currentSlug}`}
            className="group block relative aspect-[4/5]  bg-white overflow-hidden"
          >
            {item.Bild && (
              <Image
                src={urlFor(item.Bild)}
                alt={item.Namn}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="50vw"
              />
            )}
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors">
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h2 className="text-2xl font-bold mb-2">{item.Namn}</h2>
                <div className="text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  Visa arrangemang →
                </div>
              </div>
            </div>

            {/* Index number */}
            <div className="absolute top-4 left-4 text-white text-sm font-mono">
              {(index + 1).toString().padStart(2, '0')}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}