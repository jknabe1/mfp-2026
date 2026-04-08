'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { urlFor, SanityImageSource } from '@/lib/utils';
import Image from 'next/image';
import { ArrangemangListSkeleton } from './ArrangemangRowSkeleton';

interface ArrangemangData {
  _id: string;
  Namn: string;
  URL: { current: string };
  Bild: SanityImageSource;
  Beskrivning?: any;
}

interface ArrangemangListProps {
  initialArrangemang: ArrangemangData[];
  currentPage?: number;
  totalCount?: number;
}

const ITEMS_PER_PAGE = 12;

// ─── Page header with search and controls ────────────────────────────────
function PageHeader({
  count,
  filteredCount,
  searchQuery,
  onSearchChange,
  sortOrder,
  onSortChange,
  favorites,
  showingFavorites,
  onToggleFavorites,
}: {
  count: number;
  filteredCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortOrder: 'asc' | 'desc';
  onSortChange: (order: 'asc' | 'desc') => void;
  favorites: Set<string>;
  showingFavorites: boolean;
  onToggleFavorites: () => void;
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
            Arrangemang
          </h1>
          <p className="text-sans-13 sm:text-sans-14 text-black/55 mt-3 max-w-md leading-relaxed">
            Evenemang och arrangemang som Music For Pennies har skapat och varit en del av.
          </p>
        </div>
        {count > 0 && (
          <div className="flex flex-col items-start sm:items-end shrink-0">
            <span className="text-sans-35 lg:text-sans-48 font-700 text-[var(--vividGreen)] leading-none">
              {filteredCount > 0 ? filteredCount : count}
            </span>
            <span className="text-sans-10 font-600 uppercase tracking-widest text-black/40 mt-0.5">
              {showingFavorites ? 'favoriter' : 'totalt'}
            </span>
          </div>
        )}
      </div>

      {/* Search and controls row */}
      <div className="mt-8 flex flex-col gap-4">
        {/* Search input */}
        <div>
          <input
            type="text"
            placeholder="Sök arrangemang..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-4 py-3 border border-black text-sans-14 placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-[var(--vividGreen)] focus:ring-offset-2"
            aria-label="Sök arrangemang"
          />
        </div>

        {/* Controls row */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Sort dropdown */}
          <select
            value={sortOrder}
            onChange={(e) => onSortChange(e.target.value as 'asc' | 'desc')}
            className="px-4 py-2 border border-black text-sans-12 font-600 uppercase tracking-widest bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--vividGreen)]"
            aria-label="Sortera arrangemang"
          >
            <option value="asc">A–Z</option>
            <option value="desc">Z–A</option>
          </select>

          {/* Favorites toggle */}
          <button
            onClick={onToggleFavorites}
            className={`px-4 py-2 border font-600 uppercase tracking-widest text-sans-12 transition-colors ${
              showingFavorites
                ? 'border-[var(--vividGreen)] bg-[var(--vividGreen)] text-black hover:bg-white hover:text-black'
                : 'border-black bg-white text-black hover:bg-gray-50'
            }`}
            aria-label={showingFavorites ? 'Visa alla arrangemang' : 'Visa endast favoriter'}
          >
            ♥ {favorites.size > 0 ? favorites.size : '0'}
          </button>

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

// ─── Arrangemang row — image left, title + CTA right with favorite button ──
function ArrangemangRow({
  arrangemang,
  index,
  isFavorite,
  onToggleFavorite,
}: {
  arrangemang: ArrangemangData;
  index: number;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}) {
  const href = `/arrangemang/${arrangemang.URL.current}`;

  return (
    <div className="group border-b border-black border-solid flex flex-col sm:flex-row items-stretch">
      {/* Left: image fills column fully */}
      <Link
        href={href}
        className="block shrink-0 bg-gray-100 sm:w-[260px] lg:w-[360px] overflow-hidden"
        tabIndex={-1}
        aria-hidden="true"
      >
        {arrangemang.Bild ? (
          <Image
            src={urlFor(arrangemang.Bild).width(720).quality(85).url()}
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

      {/* Right: index, title, read-more, favorite */}
      <div className="flex flex-col px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6 border-t border-black sm:border-t-0 sm:border-l border-solid flex-1">
        {/* Top: index badge */}
        <span className="inline-flex items-center bg-black text-white text-sans-10 font-700 uppercase tracking-widest px-2 py-0.5 w-fit">
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* Middle: title + button + favorite on same row */}
        <div className="flex items-start gap-4 mt-3">
          <h2 className="text-sans-18 sm:text-sans-22 lg:text-sans-35 font-600 uppercase leading-[1.05] text-balance flex-1 group-hover:italic transition-all duration-200">
            <Link href={href} className="hover:text-black">
              {arrangemang.Namn}
            </Link>
          </h2>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onToggleFavorite}
              className={`inline-flex items-center justify-center w-10 h-10 transition-all ${
                isFavorite ? 'text-[var(--vividGreen)]' : 'text-black/30 hover:text-black'
              }`}
              aria-label={isFavorite ? 'Ta bort från favoriter' : 'Lägg till i favoriter'}
              title={isFavorite ? 'Ta bort från favoriter' : 'Lägg till i favoriter'}
            >
              <span className="text-2xl">♥</span>
            </button>
            <Link
              href={href}
              className="inline-flex items-center gap-2 border border-black px-4 py-2.5 text-sans-11 font-700 uppercase tracking-widest hover:bg-black hover:text-white transition-colors min-h-[44px]"
            >
              Läs mer
              <span className="text-[var(--vividGreen)] group-hover:text-white transition-colors" aria-hidden="true">→</span>
            </Link>
          </div>
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
export default function ArrangemangList({
  initialArrangemang,
  currentPage = 1,
}: ArrangemangListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showingFavorites, setShowingFavorites] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [displayPage, setDisplayPage] = useState(currentPage);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('arrangemang-favorites');
    if (saved) {
      try {
        setFavorites(new Set(JSON.parse(saved)));
      } catch (e) {
        console.error('Failed to load favorites:', e);
      }
    }
    setIsLoading(false);
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('arrangemang-favorites', JSON.stringify(Array.from(favorites)));
  }, [favorites]);

  const toggleFavorite = (id: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
  };

  // Filter and sort items
  const filteredItems = useMemo(() => {
    let items = initialArrangemang;

    // Apply search filter
    if (searchQuery) {
      items = items.filter((item) =>
        item.Namn.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply favorites filter
    if (showingFavorites) {
      items = items.filter((item) => favorites.has(item._id));
    }

    // Apply sort
    items = [...items].sort((a, b) => {
      const comparison = a.Namn.localeCompare(b.Namn, 'sv');
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return items;
  }, [initialArrangemang, searchQuery, sortOrder, favorites, showingFavorites]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / ITEMS_PER_PAGE));
  const validPage = Math.min(displayPage, totalPages);
  const startIdx = (validPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = filteredItems.slice(
    startIdx,
    startIdx + ITEMS_PER_PAGE
  );

  if (isLoading) {
    return (
      <main>
        <PageHeader
          count={initialArrangemang.length}
          filteredCount={0}
          searchQuery=""
          onSearchChange={() => {}}
          sortOrder="asc"
          onSortChange={() => {}}
          favorites={new Set()}
          showingFavorites={false}
          onToggleFavorites={() => {}}
        />
        <section aria-label="Alla arrangemang">
          <ArrangemangListSkeleton count={4} />
        </section>
      </main>
    );
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Music For Pennies - Arrangemang',
    description: 'En lista över alla arrangemang från Music For Pennies.',
    url: 'https://musicforpennies.se/arrangemang',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: paginatedItems.map((item, index) => ({
        '@type': 'ListItem',
        position: startIdx + index + 1,
        name: item.Namn,
        url: `https://musicforpennies.se/arrangemang/${item.URL.current}`,
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
        count={initialArrangemang.length}
        filteredCount={filteredItems.length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
        favorites={favorites}
        showingFavorites={showingFavorites}
        onToggleFavorites={() => setShowingFavorites(!showingFavorites)}
      />

      {/* Arrangemang rows */}
      <section aria-label="Alla arrangemang">
        {paginatedItems.length === 0 ? (
          <p className="px-4 lg:px-8 py-20 text-sans-16 text-black/40 uppercase text-center">
            {filteredItems.length === 0 && searchQuery
              ? 'Inga arrangemang matchar din sökning.'
              : showingFavorites && favorites.size === 0
              ? 'Du har inga favoriter ännu.'
              : 'Inga arrangemang tillgängliga för tillfället.'}
          </p>
        ) : (
          paginatedItems.map((item, index) => (
            <ArrangemangRow
              key={item._id}
              arrangemang={item}
              index={startIdx + index}
              isFavorite={favorites.has(item._id)}
              onToggleFavorite={() => toggleFavorite(item._id)}
            />
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


