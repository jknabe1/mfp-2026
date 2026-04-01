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

  return (
    <div className="px-2 py-3 lg:px-5">
      {/* Section title */}
      <section className="relative mb-10">
        <h2 className="text-sans-35 lg:text-sans-60 font-600 uppercase">Våra Arrangemang</h2>
      </section>

      {/* Static grid layout — alternating image left/right */}
      <section className="relative mb-12">
        <div className="space-y-8">
          {arrangemang.map((item, index) => {
            const isEven = index % 2 === 0
            return (
              <div
                key={item._id}
                className="flex flex-col lg:flex-row items-stretch gap-px bg-black"
              >
                {/* Image column */}
                <div className={`w-full lg:w-1/2 relative overflow-hidden border-4 border-black ${isEven ? "lg:order-1" : "lg:order-2"}`}>
                  <Link
                    href={`/arrangemang/${item.URL.current}`}
                    className="group block relative w-full h-full aspect-[4/3] lg:aspect-auto lg:min-h-[400px]"
                  >
                    <Image
                      src={urlFor(item.Bild)}
                      alt={item.Namn}
                      fill
                      priority={index < 2}
                      loading={index < 2 ? "eager" : "lazy"}
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </Link>
                </div>

                {/* Text column */}
                <div className={`w-full lg:w-1/2 px-6 py-8 sm:px-8 lg:px-10 lg:py-12 flex flex-col justify-center bg-white border-4 border-black ${isEven ? "lg:order-2" : "lg:order-1"}`}>
                  <h3 className="text-sans-28 sm:text-sans-35 lg:text-sans-45 font-700 uppercase leading-[1.1] text-balance mb-6">
                    {item.Namn}
                  </h3>
                  <Link
                    href={`/arrangemang/${item.URL.current}`}
                    className="inline-flex items-center gap-2 border-2 border-black px-6 py-3 text-sans-14 font-600 uppercase tracking-widest transition-colors w-fit"
                  >
                    Läs mer
                    <span className="text-[var(--vividGreen)]" aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}



