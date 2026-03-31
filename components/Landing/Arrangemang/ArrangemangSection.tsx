"use client"

import { useState, useEffect } from "react"
import { client } from "@/sanity/client"
import imageUrlBuilder from "@sanity/image-url"
import Link from "next/link"
import Image from "next/image"

// Define the Sanity image source type
interface SanityImageSource {
  asset: {
    _ref: string
  }
}

const builder = imageUrlBuilder(client)
function urlFor(source: SanityImageSource) {
  return builder.image(source).url()
}

// Define the Arrangemang data structure matching Sanity schema
interface Arrangemang {
  _id: string
  Namn: string
  URL: { current: string }
  Bild: SanityImageSource
}

export default function ArrangemangSection() {
  const [arrangemang, setArrangemang] = useState<Arrangemang[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchArrangemang = async () => {
      try {
        setLoading(true)
        const allArrangemang = await client.fetch<Arrangemang[]>(
          `*[_type == "arrangemang" && defined(URL.current)]{_id, Namn, URL, Bild}|order(Namn asc)`,
        )
        setArrangemang(allArrangemang)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching arrangemang:", error)
        setLoading(false)
      }
    }

    fetchArrangemang()
  }, [])

  if (loading || arrangemang.length === 0) {
    return <div className="px-2 py-3 lg:px-5"></div>
  }

  // Pick a random arrangemang
  const randomIndex = Math.floor(Math.random() * arrangemang.length)
  const featuredItem = arrangemang[randomIndex]

  return (
    <div className="px-2 py-3 lg:px-5">
      {/* Section title */}
      <section className="relative mb-10">
        <h2 className="text-sans-35 lg:text-sans-60 font-600 uppercase">Våra Arrangemang</h2>
      </section>

      {/* Featured hero section — 50% image left, 50% text right */}
      <section className="relative mb-12">
        <div className="flex flex-col lg:flex-row items-stretch">
          {/* Left: 50% image with border */}
          <Link
            href={`/arrangemang/${featuredItem.URL.current}`}
            className="group w-full lg:w-1/2 block relative overflow-hidden border-4 border-black"
          >
            <div className="relative w-full aspect-[3/4] lg:aspect-auto lg:h-full">
              <Image
                src={urlFor(featuredItem.Bild)}
                alt={featuredItem.Namn}
                fill
                priority
                loading="eager"
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </Link>

          {/* Right: 50% text content */}
          <div className="w-full lg:w-1/2 px-6 sm:px-8 lg:px-10 py-8 lg:py-12 flex flex-col justify-center">
            <span className="inline-flex items-center gap-1.5 text-sans-10 font-600 uppercase tracking-widest text-black/50 mb-4 w-fit">
              <span className="text-[var(--vividGreen)]" aria-hidden="true">■</span>
              Arrangerat av Music For Pennies
            </span>
            <h3 className="text-sans-28 sm:text-sans-35 lg:text-sans-45 font-700 uppercase leading-[1.1] text-balance mb-6">
              {featuredItem.Namn}
            </h3>
            <p className="text-sans-14 sm:text-sans-16 text-black/60 leading-relaxed mb-8">
              Utforska alla arrangemang som Music For Pennies har skapat och varit en del av. Klicka för att läsa mer om detta event.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={`/arrangemang/${featuredItem.URL.current}`}
                className="inline-flex items-center gap-2 border-2 border-black px-6 py-3 text-sans-14 font-600 uppercase tracking-widest hover:bg-black hover:text-white transition-colors w-fit"
              >
                Läs mer
                <span className="text-[var(--vividGreen)] group-hover:text-white" aria-hidden="true">→</span>
              </Link>
              <Link
                href="/arrangemang"
                className="inline-flex items-center gap-2 border-2 border-black px-6 py-3 text-sans-14 font-600 uppercase tracking-widest hover:bg-black hover:text-white transition-colors w-fit"
              >
                Se alla
                <span className="text-[var(--vividGreen)] group-hover:text-white" aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

