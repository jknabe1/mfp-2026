import Image from 'next/image'
import Link from 'next/link'
import { client } from '@/sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import { PortableText, PortableTextBlock } from 'next-sanity'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import ShareButtons from '@/components/Share/ShareButtons'

export const revalidate = 30

interface SanityImageSource {
  asset: {
    _ref: string
  }
}

interface GalleryImage {
  asset: SanityImageSource
  alt?: string
  caption?: string
}

interface NewsArticle {
  currentSlug: string
  name: string
  details: PortableTextBlock[]
  image: SanityImageSource
  gallery?: GalleryImage[]
  excerpt: string
  publishedAt: string
  category?: string
  tags?: string[]
}

const builder = imageUrlBuilder(client)

function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

async function getData(slug: string): Promise<NewsArticle | null> {
  const query = `
    *[_type == "news" && slug.current == '${slug}'] {
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
        category,
        tags
    }[0]`
  const news = await client.fetch<NewsArticle>(query)
  return news
}

function portableTextToPlainText(blocks: PortableTextBlock[] = []): string {
  return blocks
    .map((block) => {
      if (block._type !== 'block' || !block.children) {
        return ''
      }
      return (block.children as unknown as Array<{ text?: string }>).map((child) => child.text || '').join('')
    })
    .join(' ')
    .trim()
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params
  const news = await getData(resolvedParams.slug)

  if (!news) {
    return {
      title: 'Artikel hittades inte | K&K Records',
      description: 'Den sökta artikeln kunde inte hittas.',
    }
  }

  const plainTextDescription = news.excerpt || portableTextToPlainText(news.details)

  return {
    title: `${news.name} | K&K Records`,
    description: plainTextDescription.slice(0, 160),
    keywords: news.tags?.join(', '),
    openGraph: {
      title: news.name,
      description: plainTextDescription.slice(0, 160),
      type: 'article',
      url: `https://kkrecords.se/edits/${news.currentSlug}`,
      images: news.image ? [{ url: urlFor(news.image).width(1200).height(630).url() }] : [],
      publishedTime: news.publishedAt,
    },
    twitter: {
      card: 'summary_large_image',
      title: news.name,
      description: plainTextDescription.slice(0, 160),
      images: news.image ? [urlFor(news.image).width(1200).height(630).url()] : [],
    },
  }
}

export default async function NewsArticle({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const news = await getData(resolvedParams.slug)

  if (!news) {
    notFound()
  }

  const plainTextContent = portableTextToPlainText(news.details)
  const publishedDate = new Date(news.publishedAt)
  const formattedDate = publishedDate.toLocaleDateString('sv-SE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    '@id': `https://kkrecords.se/edits/${news.currentSlug}`,
    headline: news.name,
    description: news.excerpt || plainTextContent.slice(0, 160),
    image: news.image ? urlFor(news.image).url() : undefined,
    datePublished: news.publishedAt,
    dateModified: news.publishedAt,
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
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://kkrecords.se/edits/${news.currentSlug}`,
    },
  }

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
        name: 'Edits',
        item: 'https://kkrecords.se/edits',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: news.name,
        item: `https://kkrecords.se/edits/${news.currentSlug}`,
      },
    ],
  }

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
                alt={news.name}
                src={urlFor(news.image).width(1920).height(960).url()}
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
                    <Link href="/edits" className="hover:italic transition-colors">Edits</Link>
                  </li>
                  <li aria-hidden="true">/</li>
                  <li aria-current="page" className="text-black">{news.name}</li>
                  </ol>
                </nav>
              </div>

              {/* Overlay content */}
              <div className="absolute inset-0 flex flex-col justify-end px-2 lg:px-5">
                <div className="max-w-4xl">
                  {/* Category badge */}
                  {news.category && (
                    <div className="mb-4">
                      <span className="inline-block bg-black text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5">
                        {news.category === 'news' && 'Nyheter'}
                        {news.category === 'release' && 'Utgåva'}
                        {news.category === 'event' && 'Evenemang'}
                        {news.category === 'announcement' && 'Tillkännagivande'}
                      </span>
                    </div>
                  )}

                  {/* Headline */}
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 text-balance">
                    {news.name}
                  </h1>
                </div>
              </div>
            </div>
          </header>
          {/* Article Content */}
          <section className="px-2 lg:px-5 py-8 md:py-12 lg:py-16">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              
              {/* Left column - Main content */}
              <div className="lg:col-span-7 xl:col-span-8">
                {/* Main content */}
                <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-neutral-900 prose-p:text-neutral-700 prose-p:leading-relaxed prose-a:text-[--vividGreen] hover:prose-a:underline prose-strong:font-bold prose-strong:text-neutral-900 prose-em:text-neutral-600 border-black border border-solid p-6 md:p-8">
                  <div className="mb-8">
                  <div className="inline-block border border-black border-solid text-black px-4 py-2 font-medium text-sm md:text-base">
                    <time dateTime={news.publishedAt}>
                      {formattedDate}
                    </time>
                  </div>
                </div>
                  <PortableText value={news.details} />
                </div>

                {/* Image Gallery */}
                {news.gallery && news.gallery.length > 0 && (
                  <div className="mt-16 pt-12 border-t border-neutral-200">
                    <h2 className="text-2xl md:text-3xl font-bold mb-8 text-neutral-900">Galleri</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {news.gallery.map((img, index) => (
                        <figure key={index} className="group overflow-hidden bg-neutral-100 aspect-video">
                          <div className="relative w-full h-full">
                            <Image
                              src={urlFor(img.asset).width(800).height(450).url()}
                              alt={img.alt || `Bild ${index + 1} från ${news.name}`}
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
                      title={news.name}
                      url={`https://kkrecords.se/edits/${news.currentSlug}`}
                      variant="dark"
                    />
                  </div>
                  {news.tags && news.tags.length > 0 && (
                  <div className="mt-6 pt-6 border border-solid p-6 md:p-8">
                    <p className="text-sm text-neutral-500 font-semibold uppercase tracking-wider mb-4">Etiketter</p>
                    <div className="flex flex-wrap gap-2">
                      {news.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-block bg-neutral-100 text-neutral-700 px-4 py-2 text-sm font-medium hover:bg-neutral-200 transition-colors duration-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                </div>
                <div>
                </div>
              </aside>
            </div>
          </section>          
        </article>
      </main>
    </div>
  )
}