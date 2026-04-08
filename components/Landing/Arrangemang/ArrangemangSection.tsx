"use client"

import { useState, useEffect } from "react"
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
  Namn: string  // Changed from 'name' to 'Namn'
  URL: { current: string }  // Changed from 'slug' to 'URL'
  Bild: SanityImageSource  // Changed from 'image' to 'Bild'
}

export default function ArrangemangSection() {
  const [arrangemang, setArrangemang] = useState<Arrangemang[]>([])
  const [randomArrangemang, setRandomArrangemang] = useState<Arrangemang[]>([])
  const [isMobile, setIsMobile] = useState(false)
  const [loading, setLoading] = useState(true)

  // Use the useKeenSlider hook for mobile slider
  const [sliderRef] = useKeenSlider({
    slides: {
      perView: 1.2,
      spacing: 10,
    },
    breakpoints: {
      "(min-width: 768px)": {
        slides: { perView: 2.2, spacing: 10 },
      },
    },
  })

  // Detect mobile screen
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 640)
    }
    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  useEffect(() => {
    const fetchArrangemang = async () => {
      try {
        setLoading(true)
        // Fetch all arrangemang - using Swedish field names
        const allArrangemang = await client.fetch<Arrangemang[]>(
          `*[_type == "arrangemang" && defined(URL.current)]{_id, Namn, URL, Bild}|order(Namn asc)`,
        )

        setArrangemang(allArrangemang)

        // Pick two unique random arrangemang
        if (allArrangemang.length > 2) {
          const firstIndex = Math.floor(Math.random() * allArrangemang.length)
          let secondIndex

          do {
            secondIndex = Math.floor(Math.random() * allArrangemang.length)
          } while (secondIndex === firstIndex) // Ensure they are different

          setRandomArrangemang([allArrangemang[firstIndex], allArrangemang[secondIndex]])
        }

        setLoading(false)
      } catch (error) {
        console.error("Error fetching arrangemang:", error)
        setLoading(false)
      }
    }

    fetchArrangemang()
  }, [])

  // Ensure random arrangemang do not appear in the main displayed list
  const filteredArrangemang = arrangemang.filter(
    (item) => !randomArrangemang.some((random) => random._id === item._id)
  )

  if (loading) {
    return <div className="px-2 py-3 lg:px-5"></div>
  }

  if (arrangemang.length === 0) {
    return <div className="px-2 py-3 lg:px-5"></div>
  }

  // Custom See More component for the slider
  const SeeMoreSlide = () => (
    <div className="keen-slider__slide">
      <Link
        href="/arrangemang"
        className="group block relative aspect-[4/5] lg:aspect-[6/5] overflow-hidden bg-black flex items-center justify-center"
      >
        <div className="text-white text-center p-5">
          <h2 className="text-3xl font-bold mb-4">Se fler arrangemang</h2>
          <p className="text-xl">Utforska fler arrangemang i vår samling.</p>
          <div className="mt-6 inline-block border border-white px-6 py-3 hover:bg-white hover:text-black transition-colors">
            Utforska →
          </div>
        </div>
      </Link>
    </div>
  )

  return (
    <div className="px-2 py-3 lg:px-5">
      <section className="relative">
        <h1 className="text-sans-35 lg:text-sans-60 font-600">VÅRA ARRANGEMANG</h1>
      </section>
      {isMobile ? (
        // Mobile: Use Keen Slider with See More slide
        <section className="relative mt-10 mb-10">
          <div ref={sliderRef} className="keen-slider">
            {/* Regular arrangemang slides */}
            {[...randomArrangemang, ...filteredArrangemang.slice(0, 3)].map((item, index) => (
              <div key={item._id} className="keen-slider__slide">
                <Link
                  href={`/arrangemang/${item.URL.current}`}  // Changed from slug to URL
                  className="group block relative aspect-[4/5] overflow-hidden"
                >
                  <Image
                    src={urlFor(item.Bild)}  // Changed from image to Bild
                    alt={item.Namn}  // Changed from name to Namn
                    fill
                    priority={index === 0}
                    loading={index === 0 ? "eager" : "lazy"}
                    className="h-full w-full object-cover border border-solid border-black transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 z-10 flex flex-col justify-end bg-gradient-to-t from-transparent to-gray-950/50 p-5">
                    <div className="absolute bottom-4 left-4 z-10 flex flex-col items-start gap-1">
                      <div className="bg-white text-black text-sm px-2 py-1 inline-block">{item.Namn}</div>  {/* Changed from name to Namn */}
                    </div>
                  </div>
                </Link>
              </div>
            ))}

            {/* See More slide */}
            <SeeMoreSlide />
          </div>
        </section> 
      ) : (
        // Desktop: Show the two grid layouts
        <div className="mt-10">
          {/* First Grid: Two large images (50% each) */}
          {randomArrangemang.length > 0 && (
            <div className="mb-10">
              <div className="grid grid-cols-2 gap-5">
                {randomArrangemang.map((item, index) => (
                  <Link
                    key={item._id}
                    href={`/arrangemang/${item.URL.current}`}  // Changed from slug to URL
                    className="group block relative aspect-[4/5] lg:aspect-[6/5] overflow-hidden"
                  >
                    <Image
                      src={urlFor(item.Bild)}  // Changed from image to Bild
                      alt={item.Namn}  // Changed from name to Namn
                      fill
                      priority={index === 0}
                      loading={index === 0 ? "eager" : "lazy"}
                      className="h-full w-full object-cover border border-solid border-black transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 z-10 flex flex-col justify-end bg-gradient-to-b from-transparent to-gray-950/50 p-5">
                      <div className="absolute bottom-4 left-4 z-10 flex flex-col items-start gap-1">
                      <div className="bg-white text-black text-sm px-2 py-1 inline-block">{item.Namn}</div>  {/* Changed from name to Namn */}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Second Grid: Three images (2 arrangemang + 1 See More) */}
          {filteredArrangemang.length > 0 && (
            <div className="mt-12">
              <div className="grid grid-cols-3 gap-5">
                {/* Show only 2 arrangemang from the filtered list */}
                {filteredArrangemang.slice(0, 2).map((item, index) => (
                  <Link
                    key={item._id}
                    href={`/arrangemang/${item.URL.current}`}  // Changed from slug to URL
                    className="group block relative aspect-[4/5] lg:aspect-[6/5] overflow-hidden"
                  >
                    <Image
                      src={urlFor(item.Bild)}  // Changed from image to Bild
                      alt={item.Namn}  // Changed from name to Namn
                      fill
                      priority={index === 0}
                      loading={index === 0 ? "eager" : "lazy"}
                      className="h-full w-full object-cover border border-solid border-black transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 z-10 flex flex-col justify-end bg-gradient-to-t from-transparent to-gray-950/50 p-5">
                      <div className="absolute top-4 left-4 z-10 flex flex-col items-start gap-1">
                        <div className="bg-white text-black text-xs px-2 py-1 inline-block">
                          <span className="text-[--vividGreen] mr-2">■</span> ARRANGEMANG
                        </div>
                        <div className="bg-white text-black text-sm px-2 py-1 inline-block">{item.Namn}</div>  {/* Changed from name to Namn */}
                      </div>
                    </div>
                  </Link>
                ))}

                {/* Static "See More" panel */}
                <Link
                  href="/arrangemang"
                  className="group block relative aspect-[4/5] lg:aspect-[6/5] overflow-hidden bg-black flex items-center justify-center"
                >
                  <div className="text-white text-center p-5">
                    <h2 className="text-2xl font-bold mb-4">Se fler arrangemang</h2>
                    <div className="mt-6 inline-block border border-white px-6 py-3 hover:bg-white hover:text-black transition-colors">
                      Utforska arkivet →
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}