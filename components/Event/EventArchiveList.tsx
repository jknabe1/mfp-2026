'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import imageUrlBuilder from '@sanity/image-url';
import Image from 'next/image';
import { ArrangemangListSkeleton } from '@/components/Arrangemang/ArrangemangRowSkeleton';

interface SanityImageSource {
  asset: { _ref: string };
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

interface EventArchiveListProps {
  initialEvents: Event[];
  currentPage?: number;
  totalCount?: number;
}

const ITEMS_PER_PAGE = 12;
const builder = imageUrlBuilder({ projectId: 'j5gbmcfn', dataset: 'production' });

function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// ─── Page header with search and controls ────────────────────────────────
function PageHeader({
  count,
  filteredCount,
  searchQuery,
  onSearchChange,
  sortOrder,
  onSortChange,
}: {
  count: number;
  filteredCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortOrder: 'asc' | 'desc';
  onSortChange: (order: 'asc' | 'desc') => void;
}) {
  return (
    <header className="border-b border-black border-solid px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
        <div>
          <span className="inline-flex items-center gap-1.5 text-sans-10 font-600 uppercase tracking-widest text-black/40 mb-3">
            <span className="text-[var(--vividGreen)]" aria-hidden="true">■</span>
            Music For Pennies
          </span>
          <h1 className="text-sans-35 sm:text-sans-45 lg:text-sans-72 font-700 uppercase leading-[0.92] tracking-tight">
            Festival Archive
          </h1>
          <p className="text-sans-13 sm:text-sans-14 text-black/55 mt-3 max-w-md leading-relaxed">
            Utforska alla konserter och aktiviteter från Music For Pennies festival.
          </p>
        </div>
        {count > 0 && (
          <div className="flex flex-col items-start sm:items-end shrink-0">
            <span className="text-sans-35 lg:text-sans-48 font-700 text-[var(--vividGreen)] leading-none">
              {filteredCount > 0 ? filteredCount : count}
            </span>
            <span className="text-sans-10 font-600 uppercase tracking-widest text-black/40 mt-0.5">totalt</span>
          </div>
        )}
      </div>

      {/* Search and controls row */}
      <div className="mt-8 flex flex-col gap-4">
        {/* Search input */}
        <div>
          <input
            type="text"
            placeholder="Sök event..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-4 py-3 border border-black text-sans-14 placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-[var(--vividGreen)] focus:ring-offset-2"
            aria-label="Sök event"
          />
        </div>

        {/* Controls row */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Sort dropdown */}
          <select
            value={sortOrder}
            onChange={(e) => onSortChange(e.target.value as 'asc' | 'desc')}
            className="px-4 py-2 border border-black text-sans-12 font-600 uppercase tracking-widest bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--vividGreen)]"
            aria-label="Sortera event"
          >
            <option value="desc">Senaste först</option>
            <option value="asc">Äldsta först</option>
          </select>

          {/* Clear filters button */}
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="px-4 py-2 border border-black/40 text-sans-12 font-600 uppercase tracking-widest bg-white/50 hover:bg-white hover:border-black transition-colors"
              aria-label="Rensa sök"
            >
              Rensa sök
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

// ─── Event row — image left, title + CTA right ───────────────────────────
function EventRow({
  event,
  index,
}: {
  event: Event;
  index: number;
}) {
  const href = `/event/${event.slug.current}`;
  const eventDate = new Date(event.date).toLocaleDateString('sv-SE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="group border-b border-black border-solid flex flex-col sm:flex-row items-stretch">
      {/* Left: image fills column fully */}
      <Link
        href={href}
        className="block shrink-0 bg-gray-100 sm:w-[260px] lg:w-[360px] overflow-hidden"
        tabIndex={-1}
        aria-hidden="true"
      >
        {event.image ? (
          <Image
            src={urlFor(event.image).width(720).quality(85).url()}
            alt=""
            width={720}
            height={540}
            loading={index < 4 ? 'eager' : 'lazy'}
            className="w-full h-full object-cover noise transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 260px, 360px"
          />
        ) : (
          <div className="w-full h-full min-h-[180px] bg-gray-200" />
        )}
      </Link>

      {/* Right: index, title, read-more */}
      <div className="flex flex-col px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6 border-t border-black sm:border-t-0 sm:border-l border-solid flex-1">
        {/* Top: index badge */}
        <span className="inline-flex items-center bg-black text-white text-sans-10 font-700 uppercase tracking-widest px-2 py-0.5 w-fit">
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* Middle: title + button on same row */}
        <div className="flex items-start gap-4 mt-3">
          <div className="flex-1">
            <h2 className="text-sans-18 sm:text-sans-22 lg:text-sans-35 font-600 uppercase leading-[1.05] text-balance group-hover:italic transition-all duration-200">
              <Link href={href} className="hover:text-black">
                {event.name}
              </Link>
            </h2>
            <div className="flex flex-col gap-1 mt-2">
              <p className="text-sans-12 sm:text-sans-13 text-black/60 uppercase font-600">
                {eventDate}
              </p>
              {event.venue?.name && (
                <p className="text-sans-12 sm:text-sans-13 text-black/60 uppercase">
                  {event.venue.name}
                </p>
              )}
            </div>
          </div>
          <Link
            href={href}
            className="inline-flex items-center gap-2 border border-black px-4 py-2.5 text-sans-11 font-700 uppercase tracking-widest hover:bg-black hover:text-white transition-colors min-h-[44px] shrink-0"
          >
            Läs mer
            <span className="text-[var(--vividGreen)] group-hover:text-white transition-colors" aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Pagination controls ─────────────────────────────────────────────────────
function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-6 border-b border-black gap-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="inline-flex items-center gap-2 px-4 py-2 border border-black text-sans-12 font-600 uppercase tracking-widest disabled:opacity-40 disabled:cursor-not-allowed hover:bg-black hover:text-white transition-colors disabled:hover:bg-white disabled:hover:text-black"
      >
        ← Föregående
      </button>

      <span className="text-sans-12 font-600 uppercase tracking-widest whitespace-nowrap">
        Sida {currentPage} av {totalPages}
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="inline-flex items-center gap-2 px-4 py-2 border border-black text-sans-12 font-600 uppercase tracking-widest disabled:opacity-40 disabled:cursor-not-allowed hover:bg-black hover:text-white transition-colors disabled:hover:bg-white disabled:hover:text-black"
      >
        Nästa →
      </button>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function EventArchiveList({
  initialEvents,
  currentPage = 1,
}: EventArchiveListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isLoading, setIsLoading] = useState(true);
  const [displayPage, setDisplayPage] = useState(currentPage);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  // Filter and sort items
  const filteredItems = useMemo(() => {
    let items = initialEvents;

    // Apply search filter
    if (searchQuery) {
      items = items.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.venue?.name && item.venue.name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply sort
    items = [...items].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    return items;
  }, [initialEvents, searchQuery, sortOrder]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / ITEMS_PER_PAGE));
  const validPage = Math.min(displayPage, totalPages);
  const startIdx = (validPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = filteredItems.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  if (isLoading) {
    return (
      <main>
        <PageHeader
          count={initialEvents.length}
          filteredCount={0}
          searchQuery=""
          onSearchChange={() => {}}
          sortOrder="desc"
          onSortChange={() => {}}
        />
        <section aria-label="Festival archive">
          <ArrangemangListSkeleton count={4} />
        </section>
      </main>
    );
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Music For Pennies - Festival Archive',
    description: 'En lista över alla event från Music For Pennies festival.',
    url: 'https://musicforpennies.se/event',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: paginatedItems.map((item, index) => ({
        '@type': 'ListItem',
        position: startIdx + index + 1,
        name: item.name,
        url: `https://musicforpennies.se/event/${item.slug.current}`,
      })),
    },
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHeader
        count={initialEvents.length}
        filteredCount={filteredItems.length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
      />

      {/* Event rows */}
      <section aria-label="Festival archive">
        {paginatedItems.length === 0 ? (
          <p className="px-4 lg:px-8 py-20 text-sans-16 text-black/40 uppercase text-center">
            {filteredItems.length === 0 && searchQuery
              ? 'Inga event matchar din sökning.'
              : 'Inga event tillgängliga för tillfället.'}
          </p>
        ) : (
          paginatedItems.map((item, index) => (
            <EventRow key={item._id} event={item} index={startIdx + index} />
          ))
        )}
      </section>

      {/* Pagination */}
      {totalPages > 1 && (
        <PaginationControls
          currentPage={validPage}
          totalPages={totalPages}
          onPageChange={setDisplayPage}
        />
      )}

      {/* Bottom CTA */}
      <section className="bg-black text-white border-t border-black">
        <div className="px-4 sm:px-6 lg:px-8 py-12 lg:py-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h3 className="text-sans-22 lg:text-sans-28 font-600 uppercase">
              Vill du veta mer?
            </h3>
            <p className="text-sans-13 lg:text-sans-14 text-white/50 mt-1 max-w-sm">
              Kontakta oss för samarbeten, bokningar eller frågor.
            </p>
          </div>
          <Link
            href="/om-oss/kontakta-oss"
            className="inline-flex items-center gap-2 bg-[var(--vividGreen)] text-black px-8 py-4 text-sans-14 font-600 uppercase tracking-widest hover:bg-white transition-colors min-h-[52px] shrink-0"
          >
            <span aria-hidden="true">■</span>
            Kontakta oss
          </Link>
        </div>
      </section>
    </main>
  );
}
