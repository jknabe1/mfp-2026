import { client } from "@/sanity/client"
import imageUrlBuilder from "@sanity/image-url"
import Image from "next/image"
import { PortableText, PortableTextBlock } from 'next-sanity'
import Link from "next/link"
import type { SanityImageSource } from "@sanity/image-url/lib/types/types"
import type { Metadata } from 'next'

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
  gallery?: SanityImageSource[]
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

async function getArrangemang(slug: string) {
  const QUERY = `*[_type == "arrangemang" && URL.current == $slug][0]{
    _id,
    Namn,
    Bild,
    gallery,
    Beskrivning,
    URL,
    events[] -> {
      _id,
      name,
      slug,
      date,
      image,
      shortDescription,
      venue -> {
        name,
        City
      }
    }
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
      <div className="relative w-full overflow-hidden border-b border-black border-solid">
        {/* Banner image */}
        <div className="relative w-full h-[56vw] min-h-[220px] max-h-[90vh]">
          {arrangemang.Bild ? (
            <Image
              src={urlFor(arrangemang.Bild).width(2400).quality(90).url()}
              alt={arrangemang.Namn}
              fill
              priority
              className="object-cover noise"
              sizes="100vw"
            />
          ) : (
            <div className="absolute inset-0 bg-black" />
          )}

          {/* Gradient scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent hidden md:block" />

          {/* Title overlay — desktop */}
          <div className="absolute bottom-0 left-0 right-0 z-10 px-2 lg:px-5 lg:pb-10 hidden md:block">
            <h1 className="text-white uppercase font-600 text-sans-35 lg:text-sans-60 xl:text-sans-120 leading-[1.05] text-balance">
              {arrangemang.Namn}
            </h1>
          </div>
        </div>

        {/* ── Mobile header ───────────────────────────────────────���────────── */}
        <div className="md:hidden bg-white text-black border-b border-black">
          <div className="px-4 py-5">
            <h1 className="text-sans-28 font-700 uppercase leading-[1.05] text-balance">
              {arrangemang.Namn}
            </h1>
            {arrangemang.Plats && (
              <p className="text-sans-12 opacity-60 uppercase mt-3">
                {arrangemang.Plats}
              </p>
            )}
          </div>
        </div>

        {/* ── Desktop info bar ─────────────────────────────────────────────── */}
        <div className="hidden md:flex flex-wrap items-center justify-between gap-3 px-6 py-3 lg:px-8 lg:py-4 bg-black text-white uppercase border-t border-black">
          <div className="flex flex-wrap items-center gap-4 lg:gap-8">
            {arrangemang.Plats && (
              <span className="text-sans-12 lg:text-sans-14 font-600 tracking-wide">
                {arrangemang.Plats}
              </span>
            )}
            {arrangemang.Datum && (
              <span className="text-sans-12 lg:text-sans-14 font-600 tracking-wide opacity-60">
                {arrangemang.Datum}
              </span>
            )}
          </div>
          <Link
            href="/arrangemang"
            className="text-sans-12 font-600 tracking-widest text-white hover:italic transition-all min-h-[44px] flex items-center"
          >
            ← Alla arrangemang
          </Link>
        </div>
      </div>

      {/* ── Editorial Content Layout ──────────────────────────────────────── */}
      <div className="w-full bg-white">
        <div className="max-w-4xl mx-auto">
          {/* Opening text section */}
          {arrangemang.Beskrivning && (
            <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
              <div className="prose prose-lg max-w-none">
                <PortableText value={arrangemang.Beskrivning} />
              </div>
            </section>
          )}

          {/* Full-width hero image */}
          {arrangemang.gallery && arrangemang.gallery.length > 0 && (
            <section className="w-screen -ml-[50vw] left-1/2 relative">
              <div className="relative w-full aspect-[3/2] sm:aspect-[16/9]">
                <Image
                  src={urlFor(arrangemang.gallery[0]).width(1920).height(1080).auto('format').quality(85).url()}
                  alt="Featured editorial image"
                  fill
                  priority
                  className="object-cover"
                  quality={85}
                />
              </div>
            </section>
          )}

          {/* Text + Image Layout (Image on right) */}
          {arrangemang.gallery && arrangemang.gallery.length > 1 && (
            <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-12 items-start">
                <div className="prose prose-lg max-w-none order-2 md:order-1">
                  <p className="text-sans-14 sm:text-sans-16 leading-relaxed">
                    {arrangemang.gallery.length > 2 
                      ? "Utforska detta arrangemang genom bilder, events och framträdanden som skapar en unik upplevelse."
                      : "Se highlights från arrangemanget och upptäck de moments som gjorde det speciellt."}
                  </p>
                </div>
                <div className="relative w-full aspect-square overflow-hidden order-1 md:order-2">
                  <Image
                    src={urlFor(arrangemang.gallery[1]).width(600).height(600).auto('format').quality(85).url()}
                    alt="Editorial image"
                    fill
                    className="object-cover"
                    quality={85}
                    loading="lazy"
                  />
                </div>
              </div>
            </section>
          )}

          {/* Image pair grid */}
          {arrangemang.gallery && arrangemang.gallery.length > 2 && (
            <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                {arrangemang.gallery.slice(2, 4).map((image, idx) => (
                  <div key={idx} className="relative w-full aspect-[4/5] overflow-hidden">
                    <Image
                      src={urlFor(image).width(600).height(750).auto('format').quality(85).url()}
                      alt={`Gallery image ${idx + 2}`}
                      fill
                      className="object-cover"
                      quality={85}
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Additional gallery grid (3 columns) */}
          {arrangemang.gallery && arrangemang.gallery.length > 4 && (
            <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {arrangemang.gallery.slice(4).map((image, idx) => (
                  <div key={idx} className="relative w-full aspect-square overflow-hidden">
                    <Image
                      src={urlFor(image).width(500).height(500).auto('format').quality(80).url()}
                      alt={`Gallery image ${idx + 4}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                      quality={80}
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Event Slideshow - moved below images */}
          {arrangemang.events && arrangemang.events.length > 0 && (
            <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 border-t border-black border-solid">
              <EventSlideshow 
                events={arrangemang.events} 
                title="Evenemang i denna samling"
              />
            </section>
          )}
        </div>
      </div>

      {/* ── Related Arrangemang Section ────────────────────────────────────── */}
      {relatedArrangemang && relatedArrangemang.length > 0 && (
        <section className="px-3 sm:px-4 lg:px-8 py-8 sm:py-12 lg:py-16 border-t border-black border-solid bg-gray-50">
          <h2 className="text-sans-22 sm:text-sans-35 lg:text-sans-60 font-600 uppercase mb-5 sm:mb-8 pb-3 sm:pb-4 border-b border-black">
            Liknande arrangemang
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px border border-black border-solid">
            {relatedArrangemang.slice(0, 3).map((related) => (
              <RelatedArrangemangCard
                key={related._id}
                arrangemang={related}
              />
            ))}
          </div>
          <div className="mt-6 sm:mt-8 flex justify-center">
            <Link
              href="/arrangemang"
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-4 border border-black font-600 uppercase tracking-widest text-sans-12 sm:text-sans-14 hover:bg-black hover:text-white transition-colors w-full sm:w-auto min-h-[52px]"
            >
              Se alla arrangemang
            </Link>
          </div>
        </section>
      )}

      {/* ── Back link (mobile) ────────────────────────────────────────────── */}
      <div className="md:hidden px-4 py-4 border-t border-black bg-white">
        <Link
          href="/arrangemang"
          className="inline-flex items-center gap-2 text-sans-14 font-600 uppercase tracking-widest hover:italic transition-all"
        >
          ← Tillbaka till arrangemang
        </Link>
      </div>
    </main>
  )
}
