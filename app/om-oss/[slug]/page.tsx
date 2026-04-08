import imageUrlBuilder from '@sanity/image-url';
import { client } from '@/sanity/client';
import Image from 'next/image';
import { PortableText, PortableTextBlock } from 'next-sanity';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
import ShareButtons from '@/components/Share/ShareButtons';

export const revalidate = 30;

const builder = imageUrlBuilder(client);

function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

interface GalleryImage {
  asset: SanityImageSource;
  alt?: string;
  caption?: string;
}

interface ContentSection {
  sectionTitle?: string;
  sectionContent?: PortableTextBlock[];
}

interface AboutPage {
  currentSlug: string;
  name: string;
  details: PortableTextBlock[];
  image: SanityImageSource;
  gallery?: GalleryImage[];
  excerpt: string;
  publishedAt: string;
  additionalContent?: ContentSection[];
}

async function getData(slug: string): Promise<AboutPage | null> {
  const query = `
    *[_type == "about" && slug.current == '${slug}'] {
        "currentSlug": slug.current,
        name,
        details,
        image,
        "gallery": gallery[]{
          asset,
          alt,
          caption
        },
        excerpt,
        publishedAt,
        "additionalContent": additionalContent[]{
          sectionTitle,
          sectionContent
        }
    }[0]`;
  const about = await client.fetch<AboutPage>(query);
  return about;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const about = await getData(resolvedParams.slug);

  if (!about) {
    return {
      title: 'Page Not Found - K&K Records',
      description: 'The requested page could not be found.',
    };
  }

  return {
    title: `${about.name}`,
    description: about.excerpt || 'Learn more about K&K Records.',
    alternates: {
      canonical: `https://kkrecords.se/om-oss/${about.currentSlug}`,
    },
    openGraph: {
      title: `${about.name} - K&K Records`,
      description: about.excerpt || 'Learn more about K&K Records.',
      url: `https://kkrecords.se/om-oss/${about.currentSlug}`,
      siteName: 'K&K Records',
      locale: 'sv_SE',
      type: 'article',
      images: about.image ? [{ url: urlFor(about.image).url(), width: 1200, height: 630, alt: about.name }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${about.name} - K&K Records`,
      description: about.excerpt || 'Learn more about K&K Records.',
      images: about.image ? [{ url: urlFor(about.image).url() }] : [],
    },
  };
}

export default async function AboutArticle({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const about = await getData(resolvedParams.slug);

  if (!about) {
    notFound();
  }

  const publishedDate = new Date(about.publishedAt);
  const formattedDate = publishedDate.toLocaleDateString('sv-SE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    '@id': `https://kkrecords.se/om-oss/${about.currentSlug}`,
    name: about.name,
    description: about.excerpt || '',
    datePublished: about.publishedAt,
    dateModified: about.publishedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://kkrecords.se/om-oss/${about.currentSlug}`,
    },
    image: about.image ? urlFor(about.image).url() : undefined,
    author: {
      '@type': 'Organization',
      name: 'K&K Records',
      url: 'https://kkrecords.se',
    },
    publisher: {
      '@type': 'Organization',
      name: 'K&K Records',
      logo: {
        '@type': 'ImageObject',
        url: 'https://kkrecords.se/logo.svg',
        width: 250,
        height: 60,
      },
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Hem',
        item: 'https://kkrecords.se',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Om oss',
        item: 'https://kkrecords.se/om-oss',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: about.name,
        item: `https://kkrecords.se/om-oss/${about.currentSlug}`,
      },
    ],
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <main>
        <article className="relative">
          {/* Hero Section with Featured Image */}
          <header className="relative overflow-hidden bg-neutral-900">
            <div className="relative w-full aspect-video lg:aspect-[2/1]">
              <Image
                alt={about.name}
                src={urlFor(about.image).width(1920).height(960).url()}
                fill
                className="object-cover w-full h-full"
                priority
                quality={85}
              />
              {/* Gradient overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent" />
              
              {/* Breadcrumb */}
              <div className="absolute top-4 left-4 z-10 flex flex-col items-start gap-1">
                <nav aria-label="Breadcrumb" className="mb-4 bg-white px-2 py-1">
                  <ol className="flex items-center gap-2 text-black text-sm">
                  <li>
                    <Link href="/" className="hover:italic transition-colors">Hem</Link>
                  </li>
                  <li aria-hidden="true">/</li>
                  <li>
                    <Link href="/om-oss" className="hover:italic transition-colors">Om oss</Link>
                  </li>
                  <li aria-hidden="true">/</li>
                  <li aria-current="page" className="text-black">{about.name}</li>
                  </ol>
                </nav>
              </div>

              {/* Overlay content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 lg:p-12">
                <div className="max-w-4xl">
                  {/* Headline */}
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 text-balance">
                    {about.name}
                  </h1>
                </div>
              </div>
            </div>
          </header>

          {/* Excerpt Banner - Centered, constrained black banner */}
          {about.excerpt && (
            <div className="bg-black py-6 md:py-8 px-4">
              <div className="max-w-2xl mx-auto">
                <p className="text-white text-lg md:text-xl font-medium leading-relaxed text-center">
                  {about.excerpt}
                </p>
              </div>
            </div>
          )}

          {/* Article Content */}
          <section className="px-2 lg:px-5 py-8 md:py-12 lg:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              
              {/* Left column - Main content */}
              <div className="lg:col-span-7 xl:col-span-8">
                {/* Main content */}
                <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-neutral-900 prose-p:text-neutral-700 prose-p:leading-relaxed hover:prose-a:italic hover:prose-a:underline prose-strong:font-bold prose-strong:text-neutral-900 prose-em:text-neutral-600 border-black border border-solid p-6 md:p-8">
                  <div className="mb-8">
                  <div className="inline-block border border-black border-solid text-black px-4 py-2 font-medium text-sm md:text-base">
                    <time dateTime={about.publishedAt}>
                      {formattedDate}
                    </time>
                  </div>
                </div>
                  <PortableText value={about.details} />
                </div>

                {/* Image Gallery */}
                {about.gallery && about.gallery.length > 0 && (
                  <div className="mt-16 pt-12 border-t border-neutral-200">
                    <h2 className="text-2xl md:text-3xl font-bold mb-8 text-neutral-900">Galleri</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {about.gallery.map((img, index) => (
                        <figure key={index} className="group overflow-hidden bg-neutral-100 aspect-video">
                          <div className="relative w-full h-full">
                            <Image
                              src={urlFor(img.asset).width(800).height(450).url()}
                              alt={img.alt || `Bild ${index + 1} från ${about.name}`}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              sizes="(max-width: 768px) 100vw, 50vw"
                            />
                          </div>
                          {img.caption && (
                            <figcaption className="mt-3 text-sm text-neutral-600">
                              {img.caption}
                            </figcaption>
                          )}
                        </figure>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right column - Share sidebar */}
              <aside className="lg:col-span-5 xl:col-span-4">
                <div className="sticky top-24">
                  {/* Share Section */}
                  <div>
                    <ShareButtons 
                      title={about.name}
                      url={`https://kkrecords.se/edits/${about.currentSlug}`}
                      variant="dark"
                    />
                  </div>
                </div>
              </aside>
            </div>
          </section>          
        </article>
      </main>
    </div>
  );
}