'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import imageUrlBuilder from '@sanity/image-url'
import { client } from '@/sanity/client'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

const builder = imageUrlBuilder(client)

function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

interface Event {
  _id: string
  name: string
  slug: { current: string }
  date: string
  image?: SanityImageSource
  shortDescription?: string
  venue?: {
    name: string
    City?: string
  }
}

interface EventSlideshowProps {
  events: Event[]
  title: string
}

export default function EventSlideshow({ events, title }: EventSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!events || events.length === 0) {
    return null
  }

  const currentEvent = events[currentIndex]
  const nextIndex = (currentIndex + 1) % events.length
  const prevIndex = (currentIndex - 1 + events.length) % events.length

  const handleNext = () => setCurrentIndex(nextIndex)
  const handlePrev = () => setCurrentIndex(prevIndex)

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('sv-SE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    } catch {
      return dateString
    }
  }

  return (
    <section className="px-3 sm:px-4 lg:px-8 py-8 sm:py-12 lg:py-16 border-b border-black border-solid">
      <div className="mb-6">
        <p className="text-sans-11 sm:text-sans-12 font-600 uppercase tracking-widest opacity-50 mb-3">
          {title}
        </p>
        <h2 className="text-sans-22 sm:text-sans-35 lg:text-sans-60 font-600 uppercase">
          Konserter & Evenemang
        </h2>
      </div>

      <div className="relative">
        {/* Main event display */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 mb-6">
          {/* Image */}
          <div className="relative w-full aspect-video overflow-hidden bg-gray-100 border border-black border-solid">
            {currentEvent.image ? (
              <Image
                src={urlFor(currentEvent.image).width(800).height(450).url()}
                alt={currentEvent.name}
                fill
                className="object-cover"
                quality={85}
              />
            ) : (
              <div className="absolute inset-0 bg-gray-300 flex items-center justify-center">
                <span className="text-gray-600 text-sans-14">Ingen bild tillgänglig</span>
              </div>
            )}
          </div>

          {/* Event info */}
          <div className="flex flex-col justify-between">
            <div>
              <h3 className="text-sans-22 sm:text-sans-28 lg:text-sans-35 font-700 uppercase leading-tight mb-4 text-balance">
                {currentEvent.name}
              </h3>

              {currentEvent.shortDescription && (
                <p className="text-sans-14 sm:text-sans-16 leading-relaxed mb-4 text-gray-700">
                  {currentEvent.shortDescription}
                </p>
              )}

              <div className="space-y-3 text-sans-12 sm:text-sans-14 uppercase tracking-widest font-600 opacity-70">
                <div>
                  <span className="opacity-50">Datum: </span>
                  {formatDate(currentEvent.date)}
                </div>
                {currentEvent.venue && (
                  <div>
                    <span className="opacity-50">Plats: </span>
                    {currentEvent.venue.name}
                    {currentEvent.venue.City && `, ${currentEvent.venue.City}`}
                  </div>
                )}
              </div>
            </div>

            <Link
              href={`/event/${currentEvent.slug.current}`}
              className="mt-6 inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--vividGreen)] text-black text-sans-12 sm:text-sans-14 font-600 uppercase tracking-widest hover:bg-black hover:text-white transition-colors min-h-[48px] w-full sm:w-auto"
            >
              Se evenemang
            </Link>
          </div>
        </div>

        {/* Navigation and counter */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-black">
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrev}
              aria-label="Föregående event"
              className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center border border-black hover:bg-black hover:text-white transition-colors font-bold text-sans-16"
            >
              ←
            </button>
            <span className="text-sans-12 sm:text-sans-14 font-600 uppercase opacity-70">
              {currentIndex + 1} av {events.length}
            </span>
            <button
              onClick={handleNext}
              aria-label="Nästa event"
              className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center border border-black hover:bg-black hover:text-white transition-colors font-bold text-sans-16"
            >
              →
            </button>
          </div>

          {/* Thumbnail strips for quick navigation */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {events.map((event, index) => (
              <button
                key={event._id}
                onClick={() => setCurrentIndex(index)}
                className={`flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 border-2 transition-all ${
                  index === currentIndex
                    ? 'border-black'
                    : 'border-gray-300 opacity-60 hover:opacity-100'
                }`}
                aria-label={`Gå till event ${index + 1}: ${event.name}`}
              >
                {event.image && (
                  <div className="relative w-full h-full overflow-hidden">
                    <Image
                      src={urlFor(event.image).width(64).height(64).url()}
                      alt={event.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
