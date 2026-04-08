import { client } from "@/sanity/client"
import imageUrlBuilder from "@sanity/image-url"
import Image from "next/image"
import { PortableText, PortableTextBlock } from 'next-sanity'
import Link from "next/link"
import { notFound } from "next/navigation"
import type { SanityImageSource } from "@sanity/image-url/lib/types/types"
import type { Metadata } from 'next'

const builder = imageUrlBuilder(client)

export const revalidate = 60

function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

function portableTextToPlainText(blocks: PortableTextBlock[] = []): string {
  return blocks
    .map((block) => {
      if (block._type !== "block" || !block.children) return ""
      return block.children.map((child: any) => child.text).join("")
    })
    .join("\n\n")
}

interface Forening {
  _id: string
  Namn: string
  URL: { current: string }
  Bild?: SanityImageSource
  Beskrivning?: PortableTextBlock[]
}

async function getForening(slug: string): Promise<Forening | null> {
  const QUERY = `*[_type == "forening" && URL.current == $slug][0]{
    ...,
  }`
  return await client.fetch(QUERY, { slug })
}

async function getAllForeningaSlugs(): Promise<string[]> {
  const QUERY = `*[_type == "forening"] { "slug": URL.current }`
  const results = await client.fetch(QUERY)
  return results.map((item: { slug: string }) => item.slug)
}

async function getRelatedForeningar(currentSlug: string): Promise<Forening[]> {
  const QUERY = `*[_type == "forening" && URL.current != $slug] | order(Namn asc)[0..3]`
  return await client.fetch(QUERY, { slug: currentSlug })
}

export async function generateStaticParams() {
  const slugs = await getAllForeningaSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const resolvedParams = await params
  const forening = await getForening(resolvedParams.slug)

  if (!forening) {
    return {
      title: 'Förening Not Found | Music For Pennies',
      description: 'The requested förening could not be found.',
    }
  }

  const description = forening.Beskrivning 
    ? portableTextToPlainText(forening.Beskrivning).slice(0, 160)
    : `Lär dig mer om ${forening.Namn}`

  return {
    title: `${forening.Namn} | Music For Pennies`,
    description,
    keywords: ['förening', forening.Namn, 'Music For Pennies'],
    alternates: {
      canonical: `https://musicforpennies.se/om-oss/våra-foreningar/${forening.URL.current}`,
    },
    openGraph: {
      title: `${forening.Namn} - Music For Pennies`,
      description,
      url: `https://musicforpennies.se/om-oss/våra-foreningar/${forening.URL.current}`,
      siteName: 'Music For Pennies',
      locale: 'sv_SE',
      type: 'website',
      images: forening.Bild ? [{ 
        url: urlFor(forening.Bild).width(1200).height(630).url(),
        width: 1200,
        height: 630,
        alt: forening.Namn,
      }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${forening.Namn} - Music For Pennies`,
      description,
      images: forening.Bild ? [urlFor(forening.Bild).width(1200).height(630).url()] : [],
    },
  }
}

export default async function ForeningPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const resolvedParams = await params
  const forening = await getForening(resolvedParams.slug)
  const relatedForeningar = await getRelatedForeningar(resolvedParams.slug)

  if (!forening) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section with Image */}
      {forening.Bild && (
        <div className="relative w-full h-[40vh] md:h-[50vh] overflow-hidden">
          <Image
            src={urlFor(forening.Bild).width(1920).height(1080).auto('format').quality(85).url()}
            alt={forening.Namn}
            fill
            priority
            className="object-cover"
            sizes="100vw"
            quality={85}
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
      )}

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20 max-w-4xl">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-muted-foreground" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="hover:text-foreground transition-colors">
                Hem
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/om-oss" className="hover:text-foreground transition-colors">
                Om oss
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/om-oss/våra-foreningar" className="hover:text-foreground transition-colors">
                Våra föreningar
              </Link>
            </li>
            <li>/</li>
            <li className="text-foreground">{forening.Namn}</li>
          </ol>
        </nav>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
          {forening.Namn}
        </h1>

        {/* Description */}
        {forening.Beskrivning && (
          <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
            <PortableText value={forening.Beskrivning} />
          </div>
        )}

        {/* Related Foreningar */}
        {relatedForeningar.length > 0 && (
          <section className="mt-16 pt-16 border-t">
            <h2 className="text-2xl md:text-3xl font-bold mb-8">Andra föreningar</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedForeningar.map((related) => (
                <Link
                  key={related._id}
                  href={`/om-oss/våra-foreningar/${related.URL.current}`}
                  className="group overflow-hidden rounded-lg border bg-card hover:bg-accent transition-colors"
                >
                  {related.Bild && (
                    <div className="relative aspect-square overflow-hidden">
                      <Image
                        src={urlFor(related.Bild).width(400).height(400).auto('format').quality(80).url()}
                        alt={related.Namn}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        quality={80}
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold group-hover:text-accent-foreground transition-colors">
                      {related.Namn}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
