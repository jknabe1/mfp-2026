'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { urlFor, SanityImageSource } from '@/lib/utils'; // Updated import
import Image from 'next/image';

// Define the Artist interface to match app/artists/page.tsx
interface Artist {
  _id: string;
  name: string;
  slug: { current: string };
  date: string;
  image: SanityImageSource; // Use imported type
}

interface ArtistsListProps {
  initialArtists: Artist[];
}

export default function ArrangemangList({ initialArtists }: ArtistsListProps) {
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(
    initialArtists[0] || null
  );

  if (!initialArtists || initialArtists.length === 0) {
    return <div>No artists found</div>;
  }

  return (
    <div>
      <div className="grid grid-cols-12 gap-px">
        <div className="col-span-12 relative h-full grid-col-border">
          <div className="grid grid-cols-12 gap-px items-start">
            <div className="col-span-12 lg:col-span-6 grid-col-border">
              <ul className="flex flex-col gap-px">
                {initialArtists.map((artist) => (
                  <Link key={artist._id} href={`/artists/${artist.slug.current}`}>
                    <li
                      className="grid-col-border px-2 py-3 lg:px-5"
                      onMouseEnter={() => setSelectedArtist(artist)}
                    >
                      <h2 className="text-sans-35 lg:text-sans-60 font-600 hover:italic">
                        {artist.name}
                      </h2>
                    </li>
                  </Link>
                ))}
                <Link href="/om-oss/kontakta-oss">
                  <li className="grid-col-border px-2 py-3 lg:px-5 bg-black text-white">
                    <h2 className="italic text-sans-35 font-600">
                      Du eller ditt band?
                    </h2>
                  </li>
                </Link>
              </ul>
            </div>
            <div className="hidden lg:block col-span-6 grid-col-border sticky top-7 min-h-hero-minus-header overflow-hidden">
              <div className="image overflow-hidden absolute inset-0">
                {selectedArtist && selectedArtist.image ? (
                  <Image
                    src={urlFor(selectedArtist.image).url()}
                    alt={selectedArtist.name || ''} // Added fallback alt text
                    className="w-full h-full object-cover noise"
                    width={1000}
                    height={1000}
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    No image available
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
