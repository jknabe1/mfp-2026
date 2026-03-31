"use client"

import { useState, useEffect, useRef } from "react"
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
  const [currentIndex, setCurrentIndex] = useState(0)

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

  // Auto-rotate items every 5 seconds
  useEffect(() => {
    if (arrangemang.length === 0) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % arrangemang.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [arrangemang.length])

  if (loading || arrangemang.length === 0) {
    return <div className="px-2 py-3 lg:px-5"></div>
  }

  const featuredItem = arrangemang[currentIndex]

  return (
    <div className="px-2 py-3 lg:px-5">
      {/* Section title */}
      <section className="relative mb-10">
        <h2 className="text-sans-35 lg:text-sans-60 font-600 uppercase">Våra Arrangemang</h2>
      </section>

      {/* Grid layout: 3 columns where left half (1.5 cols) has image + title stacked */}
      <section className="relative mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-black">
          {/* Left half: image (col 1) + title overlay (col 1-2, rows 1-2) */}
          <div className="lg:col-span-1 lg:row-span-2 relative overflow-hidden border-4 border-black bg-gray-100">
            <Link
              href={`/arrangemang/${featuredItem.URL.current}`}
              className="group block relative w-full h-full aspect-[3/4] lg:aspect-auto"
            >
              <Image
                src={urlFor(featuredItem.Bild)}
                alt={featuredItem.Namn}
                fill
                priority
                loading="eager"
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
              {/* Semi-transparent overlay */}
              <div className="absolute inset-0 bg-black/30" />
            </Link>
          </div>

          {/* Right half: title area (cols 2-3, row 1) */}
          <div className="lg:col-span-2 lg:row-span-1 px-6 py-8 sm:px-8 lg:px-10 lg:py-12 flex flex-col justify-center bg-white border-4 border-black">
            <span className="inline-flex items-center gap-1.5 text-sans-10 font-600 uppercase tracking-widest text-black/50 mb-4 w-fit">
              <span className="text-[var(--vividGreen)]" aria-hidden="true">■</span>
              Arrangerat av Music For Pennies
            </span>
            <h3 className="text-sans-28 sm:text-sans-35 lg:text-sans-45 font-700 uppercase leading-[1.1] text-balance mb-6">
              {featuredItem.Namn}
            </h3>
            <Link
              href={`/arrangemang/${featuredItem.URL.current}`}
              className="inline-flex items-center gap-2 border-2 border-black px-6 py-3 text-sans-14 font-600 uppercase tracking-widest hover:bg-black hover:text-white transition-colors w-fit"
            >
              Läs mer
              <span className="text-[var(--vividGreen)] group-hover:text-white" aria-hidden="true">→</span>
            </Link>
          </div>

          {/* Right half bottom: CTA button area (cols 2-3, row 2) */}
          <div className="lg:col-span-2 lg:row-span-1 px-6 py-8 sm:px-8 lg:px-10 lg:py-12 flex items-center justify-center bg-white border-4 border-black">
            <Link
              href="/arrangemang"
              className="inline-flex items-center gap-2 border-2 border-black px-8 py-4 text-sans-14 font-600 uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
            >
              Se alla arrangemang
              <span className="text-[var(--vividGreen)] group-hover:text-white" aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}


