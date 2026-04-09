import { client } from "@/sanity/client"
import imageUrlBuilder from "@sanity/image-url"
import Image from "next/image"
import { PortableText, PortableTextBlock } from 'next-sanity'
import Link from "next/link"
import type { SanityImageSource } from "@sanity/image-url/lib/types/types"
import type { Metadata } from 'next'
import ShareButtons from "@/components/Share/ShareButtons"


const builder = imageUrlBuilder(client)

export const revalidate = 30

function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

interface Arrangemang {
  _id: string
  Namn: string
  URL: { current: string }
  Bild?: SanityImageSource
  Bilder?: SanityImageSource[]
  Beskrivning?: PortableTextBlock[]
  Plats?: string
  Datum?: string
  Hemsida?: string
}

function portableTextToPlainText(blocks: PortableTextBlock[] = []): string {
  return blocks
    .map((block) => {
      if (block._type !== "block" || !block.children) return ""
      return block.children.map((child: any) => child.text).join("")
    })
    .join("\n\n")
}

async function getArrangemang(slug: string): Promise<Arrangemang | null> {
  const QUERY = `*[_type == "arrangemang" && URL.current == $slug][0]{
    ...,
  }`
  return await client.fetch(QUERY, { slug })
}

async function getRelatedArrangemang(currentSlug: string): Promise<Arrangemang[]> {
  const QUERY = `*[_type == "arrangemang" && URL.current != $slug] | order(Namn asc)[0..5]`
  return await client.fetch(QUERY, { slug: currentSlug })
}

async function getAllArrangmanSlugs(): Promise<string[]> {
  const QUERY = `*[_type == "arrangemang" && defined(URL.current)].URL.current`
  return await client.fetch(QUERY)
}

export async function generateStaticParams() {
  const slugs = await getAllArrangmanSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const arrangemang = await getArrangemang(slug)

  if (!arrangemang) {
    return {
      title: "Arrangemang hittades inte - Music For Pennies",
      description: "Det begärda arrangemanget finns inte.",
    }
  }

  const plainTextDescription = arrangemang.Beskrivning
    ? portableTextToPlainText(arrangemang.Beskrivning)
    : ""

  return {
    title: `${arrangemang.Namn} - Music For Pennies`,
    description:
      plainTextDescription ||
      `Arrangemang av Music For Pennies: ${arrangemang.Namn}`,
    openGraph: {
      title: `${arrangemang.Namn} - Music For Pennies`,
      description:
        plainTextDescription ||
        `Arrangemang av Music For Pennies: ${arrangemang.Namn}`,
      url: `https://musicforpennies.se/arrangemang/${arrangemang.URL.current}`,
      siteName: "Music For Pennies",
      images: arrangemang.Bild
        ? [{ url: urlFor(arrangemang.Bild).url() }]
        : [],
      type: "website",
    },
  }
}

// ─── Related Arrangemang Card ────────────────────────────────────────────
function RelatedArrangemangCard({ arrangemang }: { arrangemang: Arrangemang }) {
  return (
    <Link
      href={`/arrangemang/${arrangemang.URL.current}`}
      className="group block border border-black border-solid overflow-hidden hover:shadow-lg transition-all"
    >
      {arrangemang.Bild && (
        <div className="relative w-full h-48 overflow-hidden bg-gray-100">
          <Image
            src={urlFor(arrangemang.Bild).width(400).quality(75).url()}
            alt={arrangemang.Namn}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
      )}
      <div className="p-4 lg:p-5">
        <h3 className="text-sans-14 sm:text-sans-16 font-600 uppercase group-hover:italic transition-all line-clamp-2">
          {arrangemang.Namn}
        </h3>
        {arrangemang.Plats && (
          <p className="text-sans-12 opacity-60 uppercase mt-2">{arrangemang.Plats}</p>
        )}
      </div>
    </Link>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default async function ArrangemangPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const arrangemang = await getArrangemang(slug)
  const relatedArrangemang = await getRelatedArrangemang(slug)

  if (!arrangemang) {
    return (
      <main className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="text-center">
          <h1 className="text-sans-35 font-600 uppercase mb-4">
            Arrangemang hittades inte
          </h1>
          <Link
            href="/arrangemang"
            className="inline-flex items-center gap-2 border border-black px-6 py-3 text-sans-14 font-600 uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
          >
            ← Tillbaka till arrangemang
          </Link>
        </div>
      </main>
    )
  }

  const plainTextDescription = arrangemang.Beskrivning
    ? portableTextToPlainText(arrangemang.Beskrivning)
    : ""

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: arrangemang.Namn,
    description: plainTextDescription || `Arrangemang: ${arrangemang.Namn}`,
    image: arrangemang.Bild ? urlFor(arrangemang.Bild).url() : undefined,
    url: `https://musicforpennies.se/arrangemang/${arrangemang.URL.current}`,
    organizer: {
      "@type": "Organization",
      name: "Music For Pennies",
      url: "https://musicforpennies.se",
    },
  }

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Full-width banner ──────────────────────────────────────────────── */}
      <main>
        <article className="relative">
          {/* Hero Section with Featured Image */}
          <header className="relative overflow-hidden bg-neutral-900">
            <div className="relative w-full aspect-video lg:aspect-[2/1]">
              <Image
                alt={arrangemang.Namn}
                src={urlFor(arrangemang.Bild).width(1920).height(960).url()}
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
                    <Link href="/arrangemang" className="hover:italic transition-colors">Arrangemang</Link>
                  </li>
                  <li aria-hidden="true">/</li>
                  <li aria-current="page" className="text-black">{arrangemang.Namn}</li>
                  </ol>
                </nav>
              </div>

              {/* Overlay content */}
              <div className="absolute inset-0 flex flex-col justify-end px-2 py-3 lg:px-5">
                <div className="max-w-4xl">
                  {/* Headline */}
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 text-balance">
                    {arrangemang.Namn}
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
                <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-neutral-900 prose-p:text-neutral-700 prose-p:leading-relaxed hover:prose-a:italic hover:prose-a:underline prose-strong:font-bold prose-strong:text-neutral-900 prose-em:text-neutral-600 border-black border border-solid">
                  <PortableText value={arrangemang.Beskrivning} />
                </div>
              </div>

              {/* Right column - Share sidebar */}
              <aside className="lg:col-span-5 xl:col-span-4">
                <div className="sticky top-24">
                  {/* Share Section */}
                  <div>
                    <ShareButtons 
                      title={arrangemang.Namn}
                      url={`https://kkrecords.se/edits/${arrangemang.currentSlug}`}
                      variant="dark"
                    />
                  </div>
                </div>
              </aside>
            </div>
          </section>          
        </article>
      </main>
    </main>
  )
}