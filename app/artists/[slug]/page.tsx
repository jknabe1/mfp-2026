/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import Image from 'next/image';
import Link from 'next/link';
import { client } from '@/sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { generateMetadata } from './metadata';
import { PortableText, PortableTextBlock } from 'next-sanity'; // Updated import


export const revalidate = 30;

// Define the type for Sanity image source
interface SanityImageSource {
  asset: {
    _ref: string;
  };
}

// Define the artist data structure
interface Artist {
  currentSlug: string;
  name: string;
  Biography: PortableTextBlock[];
  image: SanityImageSource;
  Instagram?: string;
  Facebook?: string;
  spotify?: string;
  excerpt?: string;
  date?: string;
}

const builder = imageUrlBuilder(client);

function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

async function getData(slug: string): Promise<Artist | null> {
  const query = `
    *[_type == "artist" && slug.current == '${slug}'] {
        "currentSlug": slug.current,
          name,
          Biography,
          image,
          Instagram,
          Facebook,
          spotify,
          excerpt,
          date,
      }[0]`;

  const artist = await client.fetch<Artist>(query);
  return artist;
}

// Export metadata from the separate file
export { generateMetadata };

// Type params as a Promise and await it
export default async function BlogArticle({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const artist = await getData(resolvedParams.slug);

  if (!artist) {
    return <div>Artist not found</div>;
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MusicGroup',
    name: artist.name,
    description: artist.Biography,
    image: artist.image ? urlFor(artist.image).url() : undefined,
    url: `https://musicforpennies.se/artists/${artist.currentSlug}`,
    sameAs: [artist.Instagram || '', artist.Facebook || '', artist.spotify || ''].filter(Boolean),
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
                  <h1 className="text-sans-35 lg:text-sans-60 font-600">{artist.name}</h1>
                  <div className="mt-4 text-lg leading-relaxed prose">
                    <PortableText value={artist.Biography} />
                  </div>
                </li>
                <div className="text-lg leading-relaxed border-t border-solid border-black px-2 py-3 lg:px-5">
                  <h1>Följ {artist.name} på sociala medier:</h1>
                  <div className="flex gap-4 mt-2">
                    {artist.Instagram && (
                      <Link
                        href={artist.Instagram}
                        target="_blank"
                        className="hover:italic"
                        rel="noopener noreferrer"
                      >
                        Instagram
                      </Link>
                    )}
                    {artist.Facebook && (
                      <Link
                        href={artist.Facebook}
                        target="_blank"
                        className="hover:italic"
                        rel="noopener noreferrer"
                      >
                        Facebook
                      </Link>
                    )}
                    {artist.spotify && (
                      <Link
                        href={artist.spotify}
                        className="hover:italic"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Spotify
                      </Link>
                    )}
                  </div>
                </div>
              </ul>
            </div>
            <div className="hidden lg:block col-span-6 grid-col-border sticky top-7 min-h-hero-minus-header overflow-hidden">
              <div className="image overflow-hidden absolute inset-0">
                <Image
                  src={urlFor(artist.image).url()}
                  alt={artist.name}
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
