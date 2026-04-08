import { client } from "@/sanity/client"
import imageUrlBuilder from "@sanity/image-url"
import Image from "next/image"
import { PortableText, PortableTextBlock } from 'next-sanity'
import Link from "next/link"
import { notFound } from "next/navigation"
import type { SanityImageSource } from "@sanity/image-url/lib/types/types"
import type { Metadata } from 'next'
import ShareButtons from "@/components/Share/ShareButtons"

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
      canonical: `https://musicforpennies.se/om-oss/vara-foreningar/${forening.URL.current}`,
    },
    openGraph: {
      title: `${forening.Namn} - Music For Pennies`,
      description,
      url: `https://musicforpennies.se/om-oss/vara-foreningar/${forening.URL.current}`,
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

  const formattedDate = new Date().toLocaleDateString('sv-SE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <main className="relative">
      <article className="relative">
        {/* Hero Section with Featured Image */}
        <header className="relative overflow-hidden bg-neutral-900">
          <div className="relative w-full aspect-video lg:aspect-[2/1]">
            {forening.Bild ? (
              <>
                <Image
                  alt={forening.Namn}
                  src={urlFor(forening.Bild).width(1920).height(960).url()}
                  fill
                  className="object-cover w-full h-full"
                  priority
                  quality={85}
                />
                {/* Gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent" />
              </>
            ) : (
              <div className="absolute inset-0 bg-neutral-800" />
            )}
            
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
                  <li aria-current="page" className="text-black">{forening.Namn}</li>
                </ol>
              </nav>
            </div>

            {/* Overlay content */}
            <div className="absolute inset-0 flex flex-col justify-end px-2 py-3 lg:px-5">
              <div className="max-w-4xl">
                {/* Headline */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 text-balance">
                  {forening.Namn}
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
              {forening.Beskrivning && (
                <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-neutral-900 prose-p:text-neutral-700 prose-p:leading-relaxed hover:prose-a:italic hover:prose-a:underline prose-strong:font-bold prose-strong:text-neutral-900 prose-em:text-neutral-600 border-black border border-solid p-6 md:p-8">
                  <PortableText value={forening.Beskrivning} />
                </div>
              )}
            </div>

            {/* Right column - Share sidebar */}
            <aside className="lg:col-span-5 xl:col-span-4">
              <div className="sticky top-24">
                {/* Share Section */}
                <div>
                  <ShareButtons 
                    title={forening.Namn}
                    url={`https://musicforpennies.se/om-oss/vara-foreningar/${forening.URL.current}`}
                    variant="dark"
                  />
                </div>
              </div>
            </aside>
          </div>
        </section>          
      </article>
    </main>
  )
}
