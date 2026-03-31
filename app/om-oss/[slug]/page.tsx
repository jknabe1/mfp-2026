import imageUrlBuilder from '@sanity/image-url';
import { client } from '@/sanity/client';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { PortableText } from 'next-sanity';
import type { Metadata } from 'next';

export const revalidate = 60;

// ─── Types ────────────────────────────────────────────────────────────────────
interface SanityImageSource {
  asset: { _ref: string };
}

interface AboutPage {
  currentSlug: string;
  name: string;
  details: unknown[];
  image?: SanityImageSource;
  excerpt?: string;
  publishedAt?: string;
  date?: string;
}

// ─── Sanity helpers ───────────────────────────────────────────────────────────
const builder = imageUrlBuilder(client);
function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

const ABOUT_QUERY = `
  *[_type == "about" && slug.current == $slug]{
    "currentSlug": slug.current,
    name,
    details,
    image,
    excerpt,
    publishedAt,
    date,
  }[0]
`;

const ALL_SLUGS_QUERY = `*[_type == "about" && defined(slug.current)]{ "slug": slug.current }`;

async function getData(slug: string): Promise<AboutPage | null> {
  return client.fetch<AboutPage | null>(ABOUT_QUERY, { slug });
}

// ─── Static params (SSG) ──────────────────────────────────────────────────────
export async function generateStaticParams() {
  const slugs = await client.fetch<{ slug: string }[]>(ALL_SLUGS_QUERY);
  return slugs.map(({ slug }) => ({ slug }));
}

// ─── Metadata ─────────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const about = await getData(slug);

  if (!about) {
    return {
      title: 'Sida hittades inte - Music For Pennies',
      description: 'Den begärda sidan kunde inte hittas.',
    };
  }

  const imageUrl = about.image ? urlFor(about.image).width(1200).height(630).url() : undefined;

  return {
    title: `${about.name} - Music For Pennies`,
    description: about.excerpt || 'Läs mer om Music For Pennies.',
    openGraph: {
      title: `${about.name} - Music For Pennies`,
      description: about.excerpt || 'Läs mer om Music For Pennies.',
      url: `https://musicforpennies.se/om-oss/${about.currentSlug}`,
      siteName: 'Music For Pennies',
      images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630 }] : [],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${about.name} - Music For Pennies`,
      description: about.excerpt || 'Läs mer om Music For Pennies.',
      images: imageUrl ? [imageUrl] : [],
    },
    alternates: {
      canonical: `https://musicforpennies.se/om-oss/${about.currentSlug}`,
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function AboutArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const about = await getData(slug);

  if (!about) notFound();

  const imageUrl = about.image ? urlFor(about.image).width(1920).height(700).url() : null;

  const formattedDate = about.publishedAt
    ? new Date(about.publishedAt).toLocaleDateString('sv-SE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: about.name,
    description: about.excerpt ?? '',
    datePublished: about.publishedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://musicforpennies.se/om-oss/${about.currentSlug}`,
    },
    image: imageUrl ?? undefined,
    author: {
      '@type': 'Organization',
      name: 'Music For Pennies',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Music For Pennies',
      logo: {
        '@type': 'ImageObject',
        url: 'https://musicforpennies.se/logo.png',
      },
    },
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Hero image ───────────────────────────────────────────────────── */}
      <section className="relative">
        {imageUrl && (
          <div className="noise relative aspect-[4/5] lg:aspect-[12/5] overflow-hidden">
            <Image
              alt={about.name}
              src={imageUrl}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            {/* Overlay labels */}
            <div className="absolute top-4 z-10 flex flex-col items-start gap-1 px-2 py-3 lg:px-5">
              <div className="bg-white text-black px-2 py-1 inline-block">
                <span className="text-[var(--vividGreen)]">■</span> {about.name}
              </div>
              {formattedDate && (
                <div className="bg-white text-black text-sm px-2 py-1 inline-block">
                  <p>{formattedDate}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-4 py-8 lg:px-6 lg:py-12 text-black">
        <h1 className="text-sans-35 lg:text-sans-60 font-600">{about.name}</h1>

        {about.details && (
          <div className="mt-6 prose prose-lg max-w-none rich-text">
            <PortableText value={about.details} />
          </div>
        )}

        {formattedDate && (
          <p className="mt-6 text-sm text-gray-500 uppercase tracking-wide">
            Senast uppdaterad: {formattedDate}
          </p>
        )}

        <div className="mt-8 pt-6 border-t border-black">
          <Link
            href="/om-oss"
            className="inline-flex items-center gap-2 text-sans-14 font-600 uppercase tracking-widest hover:italic transition-all"
          >
            ← Tillbaka till Om oss
          </Link>
        </div>
      </section>
    </main>
  );
}
