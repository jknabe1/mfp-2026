"use client"

import Image from "next/image"
import Link from "next/link"
import { useKeenSlider } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"
import { useEffect, useState } from "react"

// Updated interface to include artist type
interface SliderProps {
  items: {
    _id: string
    slug: { current: string }
    name: string
    creator?: string // Only for playlists
    imageUrl: string
    date?: string // Only for events
    // For artists, we'll use the existing fields
  }[]
  itemType: "playlist" | "event" | "artist"
}

export const revalidate = 30

export default function ContentSlider({ items, itemType }: SliderProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640)
    }

    // Initial check
    handleResize()

    // Add event listener
    window.addEventListener("resize", handleResize)

    // Cleanup event listener
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const [sliderRef] = useKeenSlider({
    slides: {
      perView: 1.2,
      spacing: 10,
    },
    breakpoints: {
      "(min-width: 641px)": {
        slides: { perView: 2.2, spacing: 10 },
      },
      "(min-width: 1025px)": {
        slides: { perView: 3, spacing: 20 },
      },
    },
  })

  const renderItems = () => {
    const renderedItems = items.map((item, index) => (
      <div key={item._id} className={isMobile ? "keen-slider__slide" : ""}>
        <Link href={`/${itemType}/${item.slug.current}`} className="group block h-full" rel="noopener">
          <div className="noise relative aspect-[4/5] lg:aspect-[6/5]">
            <Image
              alt={item.name}
              loading={index === 0 ? "eager" : "lazy"}
              priority={index === 0}
              width="1536"
              height="1920"
              className="h-full w-full object-cover border border-solid border-black transition-transform duration-500 group-hover:scale-105"
              sizes="50vw"
              src={item.imageUrl || "/placeholder.svg"}
            />
            <div className="absolute inset-0 z-10 flex flex-col justify-end bg-gradient-to-t from-transparent to-gray-950/50 p-5">
              <div className="absolute top-4 left-4 z-10 flex flex-col items-start gap-1">
                {itemType === "playlist" && (
                  <>
                    <div className="bg-white text-black text-xs px-2 py-1 inline-block">
                      <span className="text-[--vividGreen]">■</span> TUNE-IN
                    </div>
                    <div className="bg-white text-black text-sm px-2 py-1 inline-block">Skapad av: {item.creator}</div>
                    <div className="bg-white text-black text-xs px-2 py-1 inline-block">Namn: {item.name}</div>
                  </>
                )}

                {itemType === "event" && (
                  <>
                    <div className="bg-white text-black text-xs px-2 py-1 inline-block">
                      <span className="text-[--vividGreen] mr-2">■</span>
                      {new Date(item.date || "").toLocaleDateString("sv-SE", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}
                    </div>
                    <div className="bg-white text-black text-sm px-2 py-1 inline-block">{item.name}</div>
                  </>
                )}

                {itemType === "artist" && (
                  <>
                    <div className="bg-white text-black text-xs px-2 py-1 inline-block">
                      <span className="text-[--vividGreen] mr-2">■</span> ARTIST
                    </div>
                    <div className="bg-white text-black text-sm px-2 py-1 inline-block">{item.name}</div>
                  </>
                )}
              </div>
            </div>
          </div>
        </Link>
      </div>
    ))

    // Add the static "Discover More" slide
    renderedItems.push(
      <div key="discover-more" className={isMobile ? "keen-slider__slide" : ""}>
        <Link
          href={itemType === "playlist" ? "" : itemType === "event" ? "/event" : "/artists"}
          className="relative group overflow-hidden h-full bg-black flex items-center justify-center"
        >
          <div className="text-white text-center p-5">
            <h2 className="text-3xl font-bold mb-4">
              Se fler {itemType === "playlist" ? "mixtapes" : itemType === "event" ? "events" : "artister"}
            </h2>
            <p className="text-xl">
              {itemType === "playlist"
                ? "Detta var bara ett smakprov... det finns mer."
                : itemType === "event"
                  ? "Se fler kommande och tidigare events."
                  : "Utforska fler artister i vår samling."}
            </p>
            <div className="mt-6 inline-block border border-white px-6 py-3 hover:bg-white hover:text-black transition-colors">
              Utforska →
            </div>
          </div>
        </Link>
      </div>,
    )

    return renderedItems
  }

  return (
    <div className="px-2 py-3 lg:px-5">
      <section className="relative">
        <h1 className="text-sans-35 lg:text-sans-60 font-600">
          {itemType === "playlist" ? "TUNE IN - VÅRA MIXTAPES" : itemType === "event" ? "EVENTS" : "ARTISTER"}
        </h1>
      </section>

      <section className="relative mt-10 first-of-type:mt-[calc(theme(spacing.10)_+_theme(spacing.16))] lg:mt-16 mb-10 lg:mb-16">
        <div className="relative">
          {isMobile ? (
            <div ref={sliderRef} className="keen-slider">
              {renderItems()}
            </div>
          ) : (
            <div className="grid gap-5 lg:grid-cols-3">{renderItems()}</div>
          )}
        </div>
      </section>
    </div>
  )
}
