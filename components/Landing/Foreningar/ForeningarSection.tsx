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

// Define the Artist data structure matching Sanity schema
interface Artist {
  _id: string
  Namn: string  // Changed from 'name' to 'Namn'
  URL: { current: string }  // Changed from 'slug' to 'URL'
  Bild: SanityImageSource  // Changed from 'image' to 'Bild'
}

export default function ForeningarSection() {
  const [artists, setArtists] = useState<Artist[]>([])
  const [randomArtists, setRandomArtists] = useState<Artist[]>([])
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
    const fetchArtists = async () => {
      try {
        setLoading(true)
        // Fetch all artists - using Swedish field names
        const allArtists = await client.fetch<Artist[]>(
          `*[_type == "artist" && defined(URL.current)]{_id, Namn, URL, Bild}|order(Namn asc)`,
        )

        setArtists(allArtists)

        // Pick two unique random artists
        if (allArtists.length > 2) {
          const firstIndex = Math.floor(Math.random() * allArtists.length)
          let secondIndex

          do {
            secondIndex = Math.floor(Math.random() * allArtists.length)
          } while (secondIndex === firstIndex) // Ensure they are different

          setRandomArtists([allArtists[firstIndex], allArtists[secondIndex]])
        }

        setLoading(false)
      } catch (error) {
        console.error("Error fetching artists:", error)
        setLoading(false)
      }
    }

    fetchArtists()
  }, [])

  // Ensure random artists do not appear in the main displayed list
  const filteredArtists = artists.filter((artist) => !randomArtists.some((random) => random._id === artist._id))

  if (loading) {
    return <div className="px-2 py-3 lg:px-5"></div>
  }

  if (artists.length === 0) {
    return <div className="px-2 py-3 lg:px-5"></div>
  }


  return (
    <div className="px-2 py-3 lg:px-5">
      <section className="relative">
        <h1 className="text-sans-35 lg:text-sans-60 font-600">VÅRA FÖRENINGAR</h1>
      </section>
      {isMobile ? (
        // Mobile: Use Keen Slider with See More slide
        <section className="relative mt-10 mb-10">
          <div ref={sliderRef} className="keen-slider">
            {/* Regular artist slides */}
            {[...randomArtists, ...filteredArtists.slice(0, 3)].map((artist, index) => (
              <div key={artist._id} className="keen-slider__slide">
                <Link
                  href={`/om-oss/vara-foreningar/${artist.URL.current}`}  // Changed from slug to URL
                  className="group block relative aspect-[4/5] overflow-hidden"
                >
                  <Image
                    src={urlFor(artist.Bild)}  // Changed from image to Bild
                    alt={artist.Namn}  // Changed from name to Namn
                    fill
                    priority={index === 0}
                    loading={index === 0 ? "eager" : "lazy"}
                    className="h-full w-full object-cover border border-solid border-black transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 z-10 flex flex-col justify-end bg-gradient-to-t from-transparent to-gray-950/50 p-5">
                    <div className="absolute bottom-4 left-4 z-10 flex flex-col items-start gap-1">
                      <div className="bg-white text-black text-sm px-2 py-1 inline-block">{artist.Namn}</div>  {/* Changed from name to Namn */}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section> 
      ) : (
        // Desktop: Show the two grid layouts
        <div className="mt-10">
          {/* First Grid: Two large images (50% each) */}
          {randomArtists.length > 0 && (
            <div className="mb-10">
              <div className="grid grid-cols-2 gap-5">
                {randomArtists.map((artist, index) => (
                  <Link
                    key={artist._id}
                    href={`/om-oss/vara-foreningar/${artist.URL.current}`}  // Changed from slug to URL
                    className="group block relative aspect-[4/5] lg:aspect-[6/5] overflow-hidden"
                  >
                    <Image
                      src={urlFor(artist.Bild)}  // Changed from image to Bild
                      alt={artist.Namn}  // Changed from name to Namn
                      fill
                      priority={index === 0}
                      loading={index === 0 ? "eager" : "lazy"}
                      className="h-full w-full object-cover border border-solid border-black transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 z-10 flex flex-col justify-end bg-gradient-to-b from-transparent to-gray-950/50 p-5">
                      <div className="absolute bottom-4 left-4 z-10 flex flex-col items-start gap-1">
                      <div className="bg-white text-black text-sm px-2 py-1 inline-block">{artist.Namn}</div>  {/* Changed from name to Namn */}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Second Grid: Three images (2 artists + 1 See More) */}
          {filteredArtists.length > 0 && (
            <div className="mt-12">
              <div className="grid grid-cols-3 gap-5">
                {/* Show only 2 artists from the filtered list */}
                {filteredArtists.slice(0, 3).map((artist, index) => (
                  <Link
                    key={artist._id}
                    href={`/om-oss/vara-foreningar/${artist.URL.current}`}  // Changed from slug to URL
                    className="group block relative aspect-[4/5] lg:aspect-[6/5] overflow-hidden"
                  >
                    <Image
                      src={urlFor(artist.Bild)}  // Changed from image to Bild
                      alt={artist.Namn}  // Changed from name to Namn
                      fill
                      priority={index === 0}
                      loading={index === 0 ? "eager" : "lazy"}
                      className="h-full w-full object-cover border border-solid border-black transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 z-10 flex flex-col justify-end bg-gradient-to-t from-transparent to-gray-950/50 p-5">
                      <div className="absolute top-4 left-4 z-10 flex flex-col items-start gap-1">  
                        <div className="bg-white text-black text-sm px-2 py-1 inline-block">{artist.Namn}</div>  {/* Changed from name to Namn */}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
