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

      {/* Featured hero section — full-width image with centered overlay text */}
      <section className="relative mb-12">
        <Link
          href={`/arrangemang/${featuredItem.URL.current}`}
          className="group block relative overflow-hidden border-4 border-black"
        >
          {/* Full-width image */}
          <div className="relative w-full aspect-[3/4] sm:aspect-[4/3] lg:aspect-video">
            <Image
              src={urlFor(featuredItem.Bild)}
              alt={featuredItem.Namn}
              fill
              priority
              loading="eager"
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw"
            />
          </div>

          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60" />

          {/* Centered text overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 py-12 text-center">
            <span className="inline-flex items-center gap-1.5 text-sans-10 font-600 uppercase tracking-widest text-white/80 mb-4">
              <span className="text-[var(--vividGreen)]" aria-hidden="true">■</span>
              Arrangerat av Music For Pennies
            </span>
            <h3 className="text-sans-28 sm:text-sans-35 lg:text-sans-60 font-700 uppercase leading-[1.1] text-white text-balance mb-6 max-w-3xl">
              {featuredItem.Namn}
            </h3>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button className="inline-flex items-center gap-2 border-2 border-white px-6 py-3 text-sans-14 font-600 uppercase tracking-widest text-white hover:bg-white hover:text-black transition-colors">
                Läs mer
                <span className="text-[var(--vividGreen)]" aria-hidden="true">→</span>
              </button>
              <span className="hidden sm:inline-block text-white/60 px-2">eller</span>
              <button className="inline-flex items-center gap-2 border-2 border-white px-6 py-3 text-sans-14 font-600 uppercase tracking-widest text-white hover:bg-white hover:text-black transition-colors">
                Se alla
                <span className="text-[var(--vividGreen)]" aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </Link>
      </section>
    </div>
  )
}

