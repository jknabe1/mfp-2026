"use client"

import Image from "next/image"
import Link from "next/link"
import { useKeenSlider } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"

interface SliderProps {
  items: {
    _id: string
    slug: { current: string }
    name: string
    creator?: string
    imageUrl: string
    date?: string
  }[]
  itemType: "playlist" | "event" | "artist"
}

export const revalidate = 30

export default function ContentSlider({ items, itemType }: SliderProps) {
  const [sliderRef] = useKeenSlider({
    slides: {
      perView: 1.15,
      spacing: 8,
    },
    breakpoints: {
      "(min-width: 641px)": {
        slides: { perView: 2.2, spacing: 12 },
      },
      "(min-width: 1025px)": {
        slides: { perView: 3, spacing: 20 },
      },
    },
  })

  const sectionLabel =
    itemType === "playlist" ? "TUNE IN - VÅRA MIXTAPES" :
    itemType === "event" ? "EVENTS" : "ARTISTER"

  const discoverHref =
    itemType === "playlist" ? "" :
    itemType === "event" ? "/event" : "/forening"

  const discoverLabel =
    itemType === "playlist" ? "mixtapes" :
    itemType === "event" ? "events" : "artister"

  return (
    <div className="px-2 py-3 lg:px-5">
      {/* Section heading */}
      <section className="relative">
        <h2 className="text-sans-35 lg:text-sans-60 font-600 uppercase">{sectionLabel}</h2>
      </section>

      {/* Slider — always keen-slider, no JS-gated mobile/desktop switch */}
      <section className="relative mt-10 lg:mt-16 mb-10 lg:mb-16">
        <div ref={sliderRef} className="keen-slider">
          {items.map((item, index) => (
            <div key={item._id} className="keen-slider__slide">
              <Link
                href={`/${itemType}/${item.slug.current}`}
                className="group block"
                rel="noopener"
              >
                {/* Aspect-ratio wrapper — image never crops */}
                <div className="noise relative w-full aspect-[4/5] overflow-hidden bg-gray-100">
                  <Image
                    alt={item.name}
                    loading={index === 0 ? "eager" : "lazy"}
                    priority={index === 0}
                    fill
                    className="object-cover border border-solid border-black transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 33vw"
                    src={item.imageUrl || "/placeholder.svg"}
                  />

                  {/* Overlay labels */}
                  <div className="absolute top-4 left-4 z-10 flex flex-col items-start gap-1">
                    {itemType === "playlist" && (
                      <>
                        <div className="bg-white text-black text-xs px-2 py-1 inline-block">
                          <span className="text-[--vividGreen]">■</span> TUNE-IN
                        </div>
                        <div className="bg-white text-black text-sm px-2 py-1 inline-block">
                          Skapad av: {item.creator}
                        </div>
                        <div className="bg-white text-black text-xs px-2 py-1 inline-block">
                          Namn: {item.name}
                        </div>
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
                        <div className="bg-white text-black text-sm px-2 py-1 inline-block">
                          {item.name}
                        </div>
                      </>
                    )}
                    {itemType === "artist" && (
                      <>
                        <div className="bg-white text-black text-xs px-2 py-1 inline-block">
                          <span className="text-[--vividGreen] mr-2">■</span> ARTIST
                        </div>
                        <div className="bg-white text-black text-sm px-2 py-1 inline-block">
                          {item.name}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          ))}

          {/* "Discover more" slide — same aspect ratio as image slides */}
          <div key="discover-more" className="keen-slider__slide">
            <Link
              href={discoverHref}
              className="group block"
            >
              <div className="relative w-full aspect-[4/5] bg-black flex flex-col items-center justify-center border border-solid border-black p-6 text-center">
                <h3 className="text-white text-sans-22 lg:text-sans-28 font-600 uppercase mb-4">
                  Se fler {discoverLabel}
                </h3>
                <p className="text-white/60 text-sans-13 mb-6">
                  {itemType === "playlist"
                    ? "Detta var bara ett smakprov... det finns mer."
                    : itemType === "event"
                      ? "Se fler kommande och tidigare events."
                      : "Utforska fler artister i vår samling."}
                </p>
                <div className="inline-flex items-center gap-2 border border-white px-5 py-2.5 text-white text-sans-12 font-600 uppercase tracking-widest hover:bg-white hover:text-black transition-colors">
                  Utforska →
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

