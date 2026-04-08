import { client } from '@/sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
import type { Metadata } from 'next';
import { PortableText, PortableTextBlock } from 'next-sanity';

const builder = imageUrlBuilder(client);

export const revalidate = 60;

function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

interface NewsArticle {
  _id: string;
  name: string;
  slug: {
    current: string;
  };
  date?: string;
  publishedAt?: string;
  image?: SanityImageSource;
  content?: PortableTextBlock[];
  description?: string;
}

async function getNews(slug: string): Promise<NewsArticle | null> {
  if (!slug || !/^[a-z0-9-_]+$/i.test(slug)) {
    return null;
  }

  const NEWS_QUERY = `*[_type == "news" && slug.current == $slug][0]{
    _id,
    name,
    slug,
    date,
    publishedAt,
    image,
    content,
    description
  }`;

  return await client.fetch<NewsArticle | null>(NEWS_QUERY, { slug });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const news = await getNews(slug);

  if (!news) {
    return {
      title: 'Article Not Found',
      description: 'The requested article could not be found.',
    };
  }

  return {
    title: `${news.name} - Music For Pennies`,
    description: news.description || news.name,
    openGraph: {
      title: news.name,
      description: news.description || news.name,
      url: `https://musicforpennies.se/edits/${news.slug.current}`,
      images: news.image ? [{ url: urlFor(news.image).url() }] : [],
      type: 'article',
      publishedTime: news.publishedAt,
    },
  };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const news = await getNews(slug);

  if (!news) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <article>
        {news.image && (
          <div className="relative w-full h-96 lg:h-[500px] overflow-hidden">
            <Image
              src={urlFor(news.image).width(1200).quality(85).url()}
              alt={news.name}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          </div>
        )}

        {/* Content */}
        <div className="border-b border-black">
          <header className="px-4 sm:px-6 lg:px-8 py-10 lg:py-14 border-b border-black">
            <span className="inline-flex items-center gap-1.5 text-sans-10 font-600 uppercase tracking-widest text-black/40 mb-3">
              <span className="text-[var(--vividGreen)]" aria-hidden="true">
                ■
              </span>
              Edit
            </span>
            <h1 className="text-sans-45 sm:text-sans-60 lg:text-sans-72 font-700 uppercase leading-[0.92] tracking-tight">
              {news.name}
            </h1>
            {news.publishedAt && (
              <p className="text-sans-12 text-black/40 uppercase tracking-widest mt-4">
                {new Date(news.publishedAt).toLocaleDateString('sv-SE', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            )}
          </header>

          {/* Article Body */}
          <div className="px-4 sm:px-6 lg:px-8 py-10 lg:py-14 max-w-4xl">
            {news.description && (
              <p className="text-sans-16 lg:text-sans-18 leading-relaxed text-black/70 mb-8 italic">
                {news.description}
              </p>
            )}

            {news.content && (
              <div className="prose prose-sm lg:prose-base max-w-none">
                <PortableText value={news.content} />
              </div>
            )}
          </div>
        </div>
      </article>

      {/* Back Link */}
      <section className="px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/edits"
          className="inline-flex items-center gap-2 text-sans-14 font-600 uppercase tracking-widest hover:italic transition-all"
        >
          ← Tillbaka till edits
        </Link>
      </section>
    </main>
  );
}
