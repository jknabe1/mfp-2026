'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { urlFor } from '@/lib/utils';
import { SanityDocument } from "next-sanity";
import Image from 'next/image';

// Define the Artist interface based on your Sanity schema
interface Artist extends SanityDocument {
  _id: string;
  name: string;
  slug: { current: string };
  date: string;
  image?: {
    asset: {
      _ref: string;
    };
  };
  publishedAt: string;
}

interface ArtistsListProps {
  initialArtists: Artist[];
}

export default function ArticleList({ initialArtists }: ArtistsListProps) {
  const [artists] = useState<Artist[]>(initialArtists);
  const [displayedArtists, setDisplayedArtists] = useState<Artist[]>([]);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(initialArtists[0] || null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  // Initialize displayed artists
  useEffect(() => {
    setDisplayedArtists(initialArtists.slice(0, itemsPerPage));
  }, [initialArtists]);

  // Handle filter changes

  const loadMore = () => {
    const nextPage = page + 1;
    const newItems = artists.slice(0, nextPage * itemsPerPage);
    setDisplayedArtists(newItems);
    setPage(nextPage);
  };

  const hasMoreItems = displayedArtists.length < artists.length;

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
                {displayedArtists.map((artist) => (
                  <Link key={artist._id} href={`/edits/${artist.slug.current}`}>
                    <li 
                      className="grid-col-border px-2 py-3 lg:px-5"
                      onMouseEnter={() => setSelectedArtist(artist)}
                    >
                      <h2 className="text-sans-35 lg:text-sans-60 font-600 mb-1 lg:mb-3 uppercase">
                        {artist.name}
                      </h2>
                      <div className="rich-text text-sans-22 lg:text-sans-30 rich-text-light line-break">
                        <p>
                          {new Date(artist.publishedAt).toLocaleDateString('sv-SE')}
                        </p>
                      </div>
                    </li>
                  </Link>
                ))}
              </ul>
              {/* Load More Button */}
              {hasMoreItems && (
                <div className='px-2 py-3 lg:px-5'>
                  <button className='flex gap-4 mt-2 hover:italic' onClick={loadMore}>Ladda fler</button>
                </div>
              )}
            </div>
            <div className="hidden lg:block col-span-6 grid-col-border sticky top-7 min-h-hero-minus-header overflow-hidden">
              <div className="image overflow-hidden absolute inset-0">
                {selectedArtist && selectedArtist.image ? (
                  <Image
                    src={urlFor(selectedArtist.image).url()}
                    alt={selectedArtist.name}
                    className="w-full h-full object-cover noise"
                    width={1000}
                    height={1000}
                    loading='lazy'
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
