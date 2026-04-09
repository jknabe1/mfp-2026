import { client } from "@/sanity/client"
import imageUrlBuilder from "@sanity/image-url"
import Image from "next/image"
import { PortableText } from 'next-sanity'
import Link from "next/link"
import type { Metadata } from 'next'
import ShareButtons from "@/components/Share/ShareButtons"

const builder = imageUrlBuilder(client)

export const revalidate = 30

function urlFor(source: any) {
  return builder.image(source)
}

async function getArrangemang(slug: string) {
  const QUERY = `*[_type == "arrangemang" && (slug.current == $slug || URL.current == $slug)][0]{
    _id,
    name,
    Namn,
    image,
    Bild,
    excerpt,
    details,
    Beskrivning,
    gallery[] {
      asset,
      alt,
      caption
    },
    slug,
    URL,
    events[] -> {
      _id,
      name,
      slug,
      date,
      image
    }
  }`
  const result = await client.fetch(QUERY, { slug })
  
  // Map old field names to new ones for compatibility
  if (result) {
    return {
      ...result,
      name: result.name || result.Namn,
      image: result.image || result.Bild,
      slug: result.slug || result.URL,
      details: result.details || result.Beskrivning,
    }
  }
  
  return result
}

async function getAllSlugs() {
  const QUERY = `*[_type == "arrangemang" && defined(slug.current)].slug.current | *[_type == "arrangemang" && defined(URL.current)].URL.current`
  return await client.fetch(QUERY)
}

export async function generateStaticParams() {
  const slugs = await getAllSlugs()
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
    return { title: "Not Found" }
  }

  return {
    title: `${arrangemang.name} | Music For Pennies`,
    description: arrangemang.excerpt || `Arrangemang: ${arrangemang.name}`,
    openGraph: {
      title: arrangemang.name,
      description: arrangemang.excerpt || `Arrangemang: ${arrangemang.name}`,
      images: arrangemang.image ? [{ url: urlFor(arrangemang.image).width(1200).height(630).url() }] : [],
    },
  }
}

export default async function ArrangemangPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const arrangemang = await getArrangemang(slug)

  if (!arrangemang) {
    return <div className="min-h-screen flex items-center justify-center">Arrangemang not found</div>
  }

  return (
    <main>
      <article className="relative">
        {/* Hero Section with Featured Image */}
        <header className="relative overflow-hidden bg-neutral-900">
          <div className="relative w-full aspect-video lg:aspect-[2/1]">
            <Image
              alt={arrangemang.name}
              src={urlFor(arrangemang.image).width(1920).height(960).url()}
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
                  <li aria-current="page" className="text-black">{arrangemang.name}</li>
                </ol>
              </nav>
            </div>

            {/* Overlay content */}
            <div className="absolute inset-0 flex flex-col justify-end px-2 py-3 lg:px-5">
              <div className="max-w-4xl">
                {/* Headline */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 text-balance">
                  {arrangemang.name}
                </h1>
              </div>
            </div>
          </div>
        </header>

        {/* Excerpt Banner - Centered, constrained black banner */}
        {arrangemang.excerpt && (
          <div className="bg-black py-6 md:py-8 px-4">
            <div className="max-w-2xl mx-auto">
              <p className="text-white text-lg md:text-xl font-medium leading-relaxed text-center">
                {arrangemang.excerpt}
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
              {arrangemang.details && (
                <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-neutral-900 prose-p:text-neutral-700 prose-p:leading-relaxed hover:prose-a:italic hover:prose-a:underline prose-strong:font-bold prose-strong:text-neutral-900 prose-em:text-neutral-600 border-black border border-solid p-6 md:p-8">
                  <PortableText value={arrangemang.details} />
                </div>
              )}

              {/* Image Gallery */}
              {arrangemang.gallery && arrangemang.gallery.length > 0 && (
                <div className="mt-16 pt-12 border-t border-neutral-200">
                  <h2 className="text-2xl md:text-3xl font-bold mb-8 text-neutral-900">Galleri</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {arrangemang.gallery.map((img: any, index: number) => (
                      <figure key={index} className="group overflow-hidden bg-neutral-100 aspect-video">
                        <div className="relative w-full h-full">
                          <Image
                            src={urlFor(img.asset).width(800).height(450).url()}
                            alt={img.alt || `Bild ${index + 1} från ${arrangemang.name}`}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            quality={80}
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
                    title={arrangemang.name}
                    url={`https://musicforpennies.se/arrangemang/${arrangemang.slug?.current || arrangemang.slug}`}
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
