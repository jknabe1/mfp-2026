'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { urlFor, SanityImageSource } from '@/lib/utils';

interface ArrangemangData {
  _id: string;
  Namn: string;
  URL: { current: string };
  Bild: SanityImageSource;
  Beskrivning?: any;
}

interface FestivalLandingPageProps {
  arrangemangItems: ArrangemangData[];
}

export default function FestivalLandingPage({ arrangemangItems }: FestivalLandingPageProps) {
  // Get featured arrangemang (first few items)
  const featuredItems = arrangemangItems.slice(0, 3);
  const galleryItems = arrangemangItems.slice(0, 6);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: 'Music For Pennies Festival',
    description: 'A vibrant celebration of music, culture, and community.',
    url: 'https://musicforpennies.se/arrangemang',
    organizer: {
      '@type': 'Organization',
      name: 'Music For Pennies',
      url: 'https://musicforpennies.se',
    },
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ──────────────────────────────────────────────────────────────────────
          HERO SECTION — Full-width banner with festival branding
          ────────────────────────────────────────────────────────────────────── */}
      <section className="relative w-full overflow-hidden border-b border-black border-solid">
        {/* Hero Background with gradient overlay */}
        <div className="relative w-full h-screen min-h-[600px] max-h-[100vh]">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-black via-black/80 to-[var(--vividGreen)]/20" />

          {/* Featured image (first arrangemang) */}
          {arrangemangItems.length > 0 && arrangemangItems[0].Bild && (
            <Image
              src={urlFor(arrangemangItems[0].Bild).width(2400).quality(90).url()}
              alt="Festival"
              fill
              priority
              className="object-cover noise opacity-40"
              sizes="100vw"
            />
          )}

          {/* Content overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center z-10">
            {/* Festival branding */}
            <div className="mb-6 sm:mb-8">
              <span className="inline-flex items-center gap-2 text-sans-11 sm:text-sans-12 font-600 uppercase tracking-widest text-[var(--vividGreen)] px-4 py-2 border border-[var(--vividGreen)]">
                <span aria-hidden="true">■</span>
                Festival 2024-2026
              </span>
            </div>

            {/* Main heading */}
            <h1 className="text-white font-700 uppercase leading-[0.9] text-balance mb-4 sm:mb-6">
              <span className="block text-sans-35 sm:text-sans-60 lg:text-sans-90 xl:text-sans-120">
                Music For
              </span>
              <span className="block text-[var(--vividGreen)] text-sans-40 sm:text-sans-70 lg:text-sans-100 xl:text-sans-140">
                Pennies
              </span>
            </h1>

            {/* Tagline */}
            <p className="text-white/70 text-sans-14 sm:text-sans-18 lg:text-sans-22 font-400 max-w-2xl mb-8 sm:mb-10 leading-relaxed">
              A vibrant celebration of music, culture, and community where artists and audiences come together
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
              <Link
                href="/event"
                className="inline-flex items-center gap-2 bg-[var(--vividGreen)] text-black px-6 sm:px-8 py-4 text-sans-14 sm:text-sans-16 font-600 uppercase tracking-widest hover:bg-white transition-colors min-h-[52px] sm:min-h-[56px] w-full sm:w-auto justify-center"
              >
                <span aria-hidden="true">■</span>
                Explore Festival Archive
              </Link>
              <Link
                href="#about"
                className="inline-flex items-center gap-2 border-2 border-white text-white px-6 sm:px-8 py-4 text-sans-14 sm:text-sans-16 font-600 uppercase tracking-widest hover:bg-white hover:text-black transition-colors min-h-[52px] sm:min-h-[56px] w-full sm:w-auto justify-center"
              >
                Learn More
                <span aria-hidden="true">↓</span>
              </Link>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
            <div className="animate-bounce text-white text-sans-12 font-600 uppercase tracking-widest">
              Scroll to explore
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────────
          ABOUT SECTION — Festival mission and vision
          ────────────────────────────────────────────────────────────────────── */}
      <section id="about" className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24 border-b border-black border-solid">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left: Mission statement */}
            <div className="flex flex-col justify-center">
              <span className="inline-flex items-center gap-1.5 text-sans-11 sm:text-sans-12 font-600 uppercase tracking-widest text-black/40 mb-3 sm:mb-4 w-fit">
                <span className="text-[var(--vividGreen)]" aria-hidden="true">■</span>
                Our Mission
              </span>
              <h2 className="text-sans-35 sm:text-sans-45 lg:text-sans-60 font-700 uppercase leading-[1.05] text-balance mb-4 sm:mb-6">
                Celebrating Music & Community
              </h2>
              <p className="text-sans-14 sm:text-sans-16 leading-relaxed text-black/70 mb-4">
                Music For Pennies is more than a festival—it&apos;s a movement. We bring together artists, performers, and music enthusiasts to celebrate creativity, foster community connections, and make live music accessible to everyone.
              </p>
              <p className="text-sans-14 sm:text-sans-16 leading-relaxed text-black/70">
                From intimate performances to grand celebrations, each event is carefully curated to create unforgettable experiences that resonate long after the music stops.
              </p>
            </div>

            {/* Right: Key statistics */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-black text-white p-6 sm:p-8 lg:p-10 text-center">
                <div className="text-sans-45 sm:text-sans-60 lg:text-sans-80 font-700 text-[var(--vividGreen)] leading-none mb-2">
                  {arrangemangItems.length}+
                </div>
                <div className="text-sans-12 sm:text-sans-14 font-600 uppercase tracking-widest text-white/60">
                  Events & Performances
                </div>
              </div>
              <div className="bg-[var(--vividGreen)] text-black p-6 sm:p-8 lg:p-10 text-center">
                <div className="text-sans-45 sm:text-sans-60 lg:text-sans-80 font-700 leading-none mb-2">
                  3K+
                </div>
                <div className="text-sans-12 sm:text-sans-14 font-600 uppercase tracking-widest">
                  Community Members
                </div>
              </div>
              <div className="bg-gray-900 text-white p-6 sm:p-8 lg:p-10 text-center">
                <div className="text-sans-45 sm:text-sans-60 lg:text-sans-80 font-700 text-[var(--vividGreen)] leading-none mb-2">
                  15+
                </div>
                <div className="text-sans-12 sm:text-sans-14 font-600 uppercase tracking-widest text-white/60">
                  Venues & Locations
                </div>
              </div>
              <div className="bg-white border-2 border-black p-6 sm:p-8 lg:p-10 text-center">
                <div className="text-sans-45 sm:text-sans-60 lg:text-sans-80 font-700 leading-none mb-2">
                  100%
                </div>
                <div className="text-sans-12 sm:text-sans-14 font-600 uppercase tracking-widest">
                  Community-Driven
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────────
          HIGHLIGHTS SECTION — Featured arrangemang carousel
          ────────────────────────────────────────────────────────────────────── */}
      {featuredItems.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24 border-b border-black border-solid bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8 sm:mb-12">
              <span className="inline-flex items-center gap-1.5 text-sans-11 sm:text-sans-12 font-600 uppercase tracking-widest text-black/40 mb-3 w-fit">
                <span className="text-[var(--vividGreen)]" aria-hidden="true">■</span>
                Highlights
              </span>
              <h2 className="text-sans-35 sm:text-sans-45 lg:text-sans-60 font-700 uppercase leading-[1.05]">
                Featured Events
              </h2>
            </div>

            {/* Featured cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px border border-black">
              {featuredItems.map((item, index) => (
                <Link
                  key={item._id}
                  href={`/arrangemang/${item.URL.current}`}
                  className="group bg-white hover:bg-gray-100 transition-colors border-r border-b border-black last:border-r-0"
                >
                  {/* Image */}
                  <div className="relative w-full h-56 sm:h-64 overflow-hidden bg-gray-200">
                    {item.Bild && (
                      <Image
                        src={urlFor(item.Bild).width(500).quality(75).url()}
                        alt={item.Namn}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    )}
                  </div>
                  {/* Content */}
                  <div className="p-5 sm:p-6 lg:p-8 flex flex-col h-full">
                    <span className="inline-flex items-center bg-black text-white text-sans-10 font-700 uppercase tracking-widest px-2 py-0.5 w-fit mb-3">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="text-sans-16 sm:text-sans-20 font-600 uppercase leading-[1.1] text-balance group-hover:italic transition-all flex-grow">
                      {item.Namn}
                    </h3>
                    <div className="inline-flex items-center gap-2 text-[var(--vividGreen)] text-sans-12 font-600 uppercase tracking-widest mt-4 group-hover:translate-x-1 transition-transform">
                      Explore
                      <span aria-hidden="true">→</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ──────────────────────────────────────────────────────────────────────
          GALLERY SECTION — Image showcase
          ────────────────────────────────────────────────────────────────────── */}
      {galleryItems.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24 border-b border-black border-solid">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8 sm:mb-12">
              <span className="inline-flex items-center gap-1.5 text-sans-11 sm:text-sans-12 font-600 uppercase tracking-widest text-black/40 mb-3 w-fit">
                <span className="text-[var(--vividGreen)]" aria-hidden="true">■</span>
                Gallery
              </span>
              <h2 className="text-sans-35 sm:text-sans-45 lg:text-sans-60 font-700 uppercase leading-[1.05]">
                Festival Moments
              </h2>
            </div>

            {/* Masonry gallery */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px border border-black">
              {galleryItems.map((item, index) => (
                <Link
                  key={item._id}
                  href={`/arrangemang/${item.URL.current}`}
                  className={`group relative overflow-hidden bg-gray-200 border-r border-b border-black hover:opacity-75 transition-opacity ${
                    index === 0 ? 'col-span-2 row-span-2' : ''
                  }`}
                >
                  <div className={`relative ${index === 0 ? 'h-96' : 'h-48'}`}>
                    {item.Bild && (
                      <Image
                        src={urlFor(item.Bild).width(index === 0 ? 600 : 300).quality(75).url()}
                        alt={item.Namn}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <span className="text-white text-sans-12 font-600 uppercase tracking-widest">
                        {item.Namn}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ──────────────────────────────────────────────────────────────────────
          CTA SECTION — Large call-to-action to explore archive
          ────────────────────────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28 bg-black text-white border-b border-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-sans-35 sm:text-sans-50 lg:text-sans-72 font-700 uppercase leading-[1.05] text-balance mb-6 sm:mb-8">
            Explore the Full Festival Archive
          </h2>
          <p className="text-sans-14 sm:text-sans-16 lg:text-sans-18 text-white/70 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed">
            Discover all {arrangemangItems.length}+ events, performances, and activities that make Music For Pennies special. Browse, search, and find your next unforgettable experience.
          </p>
          <Link
            href="/event"
            className="inline-flex items-center gap-3 bg-[var(--vividGreen)] text-black px-8 sm:px-10 py-5 sm:py-6 text-sans-14 sm:text-sans-16 lg:text-sans-18 font-600 uppercase tracking-widest hover:bg-white transition-colors min-h-[56px] sm:min-h-[60px]"
          >
            <span aria-hidden="true">■</span>
            Browse All Events
          </Link>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────────
          FOOTER SECTION — Contact and additional info
          ────────────────────────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 border-b border-black border-solid bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
            {/* Column 1: About */}
            <div>
              <h3 className="text-sans-18 sm:text-sans-22 font-600 uppercase mb-4">
                About MFP
              </h3>
              <p className="text-sans-13 sm:text-sans-14 text-black/60 leading-relaxed">
                Music For Pennies is a community-driven festival celebrating music, culture, and connection through carefully curated events and performances.
              </p>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h3 className="text-sans-18 sm:text-sans-22 font-600 uppercase mb-4">
                Quick Links
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/event"
                    className="text-sans-13 sm:text-sans-14 text-[var(--vividGreen)] hover:italic transition-all"
                  >
                    Festival Archive
                  </Link>
                </li>
                <li>
                  <Link
                    href="/om-oss"
                    className="text-sans-13 sm:text-sans-14 text-black/60 hover:text-black transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/om-oss/kontakta-oss"
                    className="text-sans-13 sm:text-sans-14 text-black/60 hover:text-black transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Newsletter */}
            <div>
              <h3 className="text-sans-18 sm:text-sans-22 font-600 uppercase mb-4">
                Stay Updated
              </h3>
              <p className="text-sans-13 sm:text-sans-14 text-black/60 mb-4">
                Subscribe for festival updates and exclusive announcements.
              </p>
              <Link
                href="/om-oss/kontakta-oss"
                className="inline-flex items-center gap-2 border border-black px-4 py-2.5 text-sans-11 sm:text-sans-12 font-600 uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
              >
                Subscribe
              </Link>
            </div>
          </div>

          {/* Divider */}
          <div className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-black/20">
            <p className="text-sans-11 sm:text-sans-12 text-black/40 uppercase tracking-widest text-center">
              © 2024-2026 Music For Pennies. All rights reserved.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
