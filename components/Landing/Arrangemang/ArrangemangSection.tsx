"use client"

import { useState, useEffect, useRef } from "react"
import { client } from "@/sanity/client"
import imageUrlBuilder from "@sanity/image-url"
import Link from "next/link"
import Image from "next/image"
import { useKeenSlider } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"

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
  const sliderRef = useRef<any>(null)

  const [sliderInstRef] = useKeenSlider(
    {
      initial: 0,
      slideChanged(slider) {
        setCurrentIndex(slider.track.details.rel)
      },
      slides: {
        perView: 1,
        spacing: 0,
      },
      loop: true,
      created(slider) {
        // Enable autoplay
        slider.moveToIdx(Math.ceil(slider.track.details.slides.length / 2), true)
        const autoplayInterval = setInterval(() => {
          slider.next()
        }, 5000)
        return () => clearInterval(autoplayInterval)
      },
    },
    [(slider) => {
      sliderRef.current = slider
    }],
  )

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

  const featuredItem = arrangemang[currentIndex]

  return (
    <div className="px-2 py-3 lg:px-5">
      {/* Section title */}
      <section className="relative mb-10">
        <h2 className="text-sans-35 lg:text-sans-60 font-600 uppercase">Våra Arrangemang</h2>
      </section>

      {/* Carousel section — 50% image left, 50% text right */}
      <section className="relative mb-12">
        <div
          ref={sliderInstRef}
          className="keen-slider"
        >
          {arrangemang.map((item) => (
            <div key={item._id} className="keen-slider__slide">
              {/* Full-width image with centered text overlay */}
              <Link
                href={`/arrangemang/${item.URL.current}`}
                className="group block relative w-full overflow-hidden border-4 border-black"
              >
                {/* Image fills entire container */}
                <div className="relative w-full aspect-[3/4] sm:aspect-[4/3] lg:aspect-[16/9]">
                  <Image
                    src={urlFor(item.Bild)}
                    alt={item.Namn}
                    fill
                    priority={arrangemang[0]._id === item._id}
                    loading={arrangemang[0]._id === item._id ? "eager" : "lazy"}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                    sizes="100vw"
                  />
                </div>

                {/* Semi-transparent overlay for text readability */}
                <div className="absolute inset-0 bg-black/40" />

                {/* Centered text overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center px-6 py-8 text-center">
                  <span className="inline-flex items-center gap-1.5 text-sans-10 font-600 uppercase tracking-widest text-white/90 mb-6">
                    <span className="text-[var(--vividGreen)]" aria-hidden="true">■</span>
                    Arrangerat av Music For Pennies
                  </span>
                  <h3 className="text-sans-28 sm:text-sans-35 lg:text-sans-60 font-700 uppercase leading-[1.1] text-white text-balance">
                    {item.Namn}
                  </h3>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* See all arrangemang button at bottom */}
        <div className="mt-10 flex justify-center lg:justify-start">
          <Link
            href="/arrangemang"
            className="inline-flex items-center gap-2 border-2 border-black px-8 py-4 text-sans-14 font-600 uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
          >
            Se alla arrangemang
            <span className="text-[var(--vividGreen)] group-hover:text-white" aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </div>
  )
}


