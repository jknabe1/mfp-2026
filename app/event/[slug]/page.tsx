import { client } from "@/sanity/client"
import imageUrlBuilder from "@sanity/image-url"
import Image from "next/image"
import { PortableText, PortableTextBlock } from 'next-sanity'
import Link from "next/link"
import type { SanityImageSource } from "@sanity/image-url/lib/types/types"

const builder = imageUrlBuilder(client)

export const revalidate = 60

function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

interface Venue {
  name?: string
  City?: string
  Country?: string
}

interface Headline {
  name?: string
}

interface Event {
  name: string
  slug: { current: string }
  date?: string
  image?: SanityImageSource
  details?: PortableTextBlock[]
  headline?: Headline
  venue?: Venue
  tickets?: string
  eventType?: string
  doorsOpen?: number
}

function portableTextToPlainText(blocks: PortableTextBlock[] = []): string {
  return blocks
    .map((block) => {
      if (block._type !== "block" || !block.children) return ""
      return block.children.map((child: any) => child.text).join("")
    })
    .join("\n\n")
}

async function getEvent(slug: string): Promise<Event | null> {
  const EVENT_QUERY = `*[_type == "event" && slug.current == $slug][0]{
    ...,
    headline->,
    venue->,
    tickets,
  }`
  return await client.fetch(EVENT_QUERY, { slug })
}

async function getRelatedEvents(currentSlug: string): Promise<Event[]> {
  const EVENTS_QUERY = `*[_type == "event" && slug.current != $slug && date < now()] | order(date desc)[0..6]`
  return await client.fetch(EVENTS_QUERY, { slug: currentSlug })
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const event = await getEvent(slug)

  if (!event) {
    return {
      title: "Event hittades inte - Music For Pennies",
      description: "Det begärda eventet finns inte.",
    }
  }

  const plainTextDescription = event.details ? portableTextToPlainText(event.details) : ""

  return {
    title: `${event.name}`,
    description: plainTextDescription || `Event av Music For Pennies: ${event.name}`,
    openGraph: {
      title: `${event.name} - Music For Pennies`,
      description: plainTextDescription || `Event av Music For Pennies: ${event.name}`,
      url: `https://musicforpennies.se/event/${event.slug.current}`,
      siteName: "Music For Pennies",
      images: event.image ? [{ url: urlFor(event.image).url() }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${event.name} - Music For Pennies`,
      description: plainTextDescription || `Event av Music For Pennies: ${event.name}`,
      images: event.image ? [{ url: urlFor(event.image).url() }] : [],
    },
  }
}

// ─── Date helpers ────────────────────────────────────────────────────────────
function formatLongDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('sv-SE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString('sv-SE', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatDateBlock(dateStr: string) {
  const d = new Date(dateStr)
  return {
    day: d.toLocaleDateString('sv-SE', { day: '2-digit' }),
    month: d.toLocaleDateString('sv-SE', { month: 'short' }).toUpperCase(),
    year: d.getFullYear().toString(),
    time: d.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' }),
  }
}

// ─── Metadata row ────────────────────────────────────────────────────────────
function MetaRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start border-b border-black/20 sm:border-black border-solid py-3 sm:py-3 lg:py-4 gap-0.5 sm:gap-0">
      <span className="text-sans-10 sm:text-sans-12 font-600 uppercase tracking-widest shrink-0 sm:w-36 lg:w-44 opacity-50">
        {label}
      </span>
      <span className="text-sans-13 sm:text-sans-14 lg:text-sans-16 font-600 uppercase">
        {value}
      </span>
    </div>
  )
}

// ─── Previous Event Card ────────────────────────────────────────────────────
function PreviousEventCard({ event }: { event: Event }) {
  return (
    <Link
      href={`/event/${event.slug.current}`}
      className="group block p-3 sm:p-4 lg:p-5 border border-black border-solid hover:bg-gray-50 transition-colors min-h-[72px]"
    >
      <div className="flex items-center justify-between gap-3 sm:gap-4">
        {event.image && (
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 flex-shrink-0 overflow-hidden border border-black">
            <Image
              src={urlFor(event.image).width(200).quality(75).url()}
              alt={event.name}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="flex-grow min-w-0">
          <h3 className="text-sans-12 sm:text-sans-14 lg:text-sans-16 font-600 uppercase group-hover:italic transition-all line-clamp-2">
            {event.name}
          </h3>
          {event.date && (
            <p className="text-sans-10 sm:text-sans-12 opacity-60 uppercase mt-0.5 sm:mt-1">
              {new Date(event.date).toLocaleDateString('sv-SE', {
                day: 'numeric',
                month: 'short',
                year: '2-digit',
              })}
            </p>
          )}
          {event.venue?.name && (
            <p className="text-sans-10 sm:text-sans-12 opacity-50 uppercase mt-0.5 hidden sm:block">
              {event.venue.name}
            </p>
          )}
        </div>
        <span className="text-white text-sans-14 sm:text-sans-16 font-600 shrink-0">→</span>
      </div>
    </Link>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const event = await getEvent(slug)
  const previousEvents = await getRelatedEvents(slug)

  if (!event) {
    return (
      <main className="flex items-center justify-center min-h-[60vh] px-4">
        <p className="text-sans-35 font-600 uppercase">Event hittades inte</p>
      </main>
    )
  }

  const { venue, tickets } = event
  const plainTextDescription = event.details ? portableTextToPlainText(event.details) : ""
  const dateBlock = event.date ? formatDateBlock(event.date) : null

  const venueObject = venue
    ? { "@type": "Place" as const, name: venue.name || "Music For Pennies", address: [venue.City, venue.Country].filter(Boolean).join(", ") || "Sweden" }
    : { "@type": "Place" as const, name: "Music For Pennies", address: "Sweden" }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    name: event.name,
    startDate: event.date,
    eventStatus: "https://schema.org/EventScheduled",
    location: venueObject,
    image: event.image ? urlFor(event.image).url() : "https://musicforpennies.se/default-event-image.jpg",
    url: `https://musicforpennies.se/event/${event.slug.current}`,
    description: plainTextDescription || `Music event: ${event.name} at Music For Pennies`,
    performer: { "@type": "MusicGroup" as const, name: event.headline?.name || event.name },
    organizer: { "@type": "Organization", name: "Music For Pennies", url: "https://musicforpennies.se" },
    offers: tickets
      ? { "@type": "Offer", url: tickets, availability: "https://schema.org/InStock" }
      : undefined,
  }

  const isPast = event.date ? new Date(event.date) < new Date() : false

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ── Full-width banner ──────────────────────────────────────────────── */}
      <div className="relative w-full overflow-hidden border-b border-black border-solid">

        {/* Banner image */}
        <div className="relative w-full h-[56vw] min-h-[220px] max-h-[90vh]">
          {event.image ? (
            <Image
              src={urlFor(event.image).width(2400).quality(90).url()}
              alt={event.name}
              fill
              priority
              className="object-cover noise"
              sizes="100vw"
            />
          ) : (
            <div className="absolute inset-0 bg-black" />
          )}

          {/* Gradient scrim — only on md+ where overlay text sits on image */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent hidden md:block" />

          {/* Past event badge */}
          {isPast && (
            <div className="absolute top-3 left-3 lg:top-6 lg:left-6 z-10">
              <span className="inline-flex items-center gap-1.5 bg-white text-black text-sans-11 font-600 px-2.5 py-1.5 uppercase tracking-widest">
                {event.name}
              </span>
            </div>
          )}

          {/* Ticket CTA — top right on desktop */}
          {tickets && !isPast && (
            <div className="absolute top-4 right-4 lg:top-6 lg:right-6 z-10 hidden md:block">
              <Link
                href={tickets}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-black text-white text-sans-12 font-600 px-4 py-2.5 uppercase tracking-widest hover:bg-white hover:text-black transition-colors border border-white/50 min-h-[44px]"
              >
                Köp biljetter
              </Link>
            </div>
          )}

          {/* md+ overlay: event name + date block over image */}
          <div className="absolute bottom-0 left-0 right-0 z-10 px-2 lg:px-5 lg:pb-10 hidden md:flex md:flex-row md:items-end md:justify-between gap-4">
            <h1 className="text-white uppercase font-600 text-sans-35 lg:text-sans-60 xl:text-sans-120 leading-[1.05] text-balance max-w-[75%]">
              {event.name}
            </h1>
            {dateBlock && (
              <div className="flex items-stretch shrink-0 border border-white/50">
                <div className="flex flex-col items-center justify-center mx-2 px-4 py-3 bg-white/10 backdrop-blur-sm min-w-[64px]">
                  <span className="text-white text-sans-35 lg:text-sans-60 font-600 leading-none">{dateBlock.day}</span>
                  <span className="text-white text-sans-10 font-600 tracking-widest mt-1">{dateBlock.month}</span>
                </div>
                <div className="flex flex-col items-center justify-center px-4 py-3 bg-white/10 backdrop-blur-sm border-l border-white/50">
                  <span className="text-white text-sans-16 font-600 tracking-widest">{dateBlock.year}</span>
                  <span className="text-white text-sans-10 font-600 tracking-widest mt-1">{dateBlock.time}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Mobile banner bar — event name + date prominently displayed ── */}
        <div className="md:hidden bg-white text-black">
          {/* Event name */}
          <div className="px-4 pt-5 pb-4 border- border-solid border-black">
            <h1 className="text-sans-28 font-700 uppercase leading-[1.05] text-balance">
              {event.name}
            </h1>
          </div>

          {/* Date + venue row */}
          {dateBlock && (
            <div className="flex items-stretch">
              {/* Day block */}
              <div className="flex flex-col items-center justify-center bg-white text-black px-5 py-4 shrink-0 min-w-[72px] border-r border-solid border-black">
                <span className="text-sans-35 font-700 leading-none">{dateBlock.day}</span>
                <span className="text-sans-10 font-700 tracking-widest mt-0.5 uppercase">{dateBlock.month}</span>
                <span className="text-sans-10 font-600 tracking-widest opacity-70">{dateBlock.year}</span>
              </div>

              {/* Time + venue */}
              <div className="flex flex-col justify-center px-4 py-4 gap-1.5 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sans-10 font-600 uppercase tracking-widest opacity-50 shrink-0">Tid</span>
                  <span className="text-sans-14 font-700 uppercase">{dateBlock.time}</span>
                </div>
                {venue?.name && (
                  <div className="flex items-center gap-2">
                    <span className="text-sans-10 font-600 uppercase tracking-widest opacity-50 shrink-0">Plats</span>
                    <span className="text-sans-14 font-700 uppercase truncate">{[venue.name, venue.City].filter(Boolean).join(', ')}</span>
                  </div>
                )}
              </div>

              {/* Back link */}
              <Link
                href="/event"
                className="hidden xs:flex flex-col items-center justify-center px-4 border-l border-white/10 text-white text-sans-18 font-700 shrink-0 min-w-[52px] min-h-[44px]"
                aria-label="Alla event"
              >
                ←
              </Link>
            </div>
          )}

          {/* Mobile ticket CTA */}
          {tickets && !isPast && (
            <div className="px-4 py-4 border-t border-white/10">
              <Link
                href={tickets}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full bg-white text-black text-sans-14 font-700 uppercase tracking-widest px-6 py-4 min-h-[52px] hover:opacity-90 transition-opacity"
              >
                <span aria-hidden="true">■</span>
                Köp biljetter
              </Link>
            </div>
          )}
        </div>

        {/* ── Desktop info bar ─────────────────────────────────────────────── */}
        <div className="hidden md:flex flex-wrap items-center justify-between gap-3 px-6 py-3 lg:px-8 lg:py-4 bg-black text-white uppercase">
          <div className="flex flex-wrap items-center gap-4 lg:gap-8">
            {event.date && (
              <span className="text-sans-12 lg:text-sans-14 font-600 tracking-wide capitalize">
                {formatLongDate(event.date)} — {formatTime(event.date)}
              </span>
            )}
            {venue?.name && (
              <span className="text-sans-12 lg:text-sans-14 font-600 tracking-wide opacity-60">
                {[venue.name, venue.City].filter(Boolean).join(', ')}
              </span>
            )}
          </div>
          <Link
            href="/event"
            className="text-sans-12 font-600 tracking-widest text-white hover:italic transition-all min-h-[44px] flex items-center"
          >
            ← Alla event
          </Link>
        </div>
      </div>

      {/* ── Content below banner ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-px">

        {/* Left column: description */}
        <div className="lg:col-span-7 grid-col-border">

          {/* Description */}
          {event.details && (
            <div className="px-3 py-5 sm:px-4 sm:py-6 lg:px-8 lg:py-10 border-b border-black border-solid">
              <p className="text-sans-11 sm:text-sans-12 font-600 uppercase tracking-widest opacity-50 mb-3 sm:mb-4">Om eventet</p>
              <div className="prose prose-sm lg:prose-base max-w-none text-sans-14 sm:text-sans-16 leading-relaxed rich-text">
                <PortableText value={event.details} />
              </div>
            </div>
          )}

          {/* Tickets CTA block (tablet/desktop only) */}
          {tickets && !isPast && (
            <div className="hidden sm:block px-4 py-6 lg:px-8 lg:py-8 border-b border-black border-solid">
              <Link
                href={tickets}
                target="_blank"
                rel="noopener noreferrer"
                className="button button-secondary-vividGreen inline-flex items-center gap-3 px-6 py-4 text-sans-14 font-600 uppercase tracking-widest min-h-[52px]"
              >
                <span aria-hidden="true">■</span>
                Köp biljetter
              </Link>
            </div>
          )}
        </div>

        {/* Right column: event metadata */}
        <div className="lg:col-span-5 grid-col-border">
          <div className="px-3 py-5 sm:px-4 sm:py-6 lg:px-8 lg:py-10">
            <p className="text-sans-11 sm:text-sans-12 font-600 uppercase tracking-widest opacity-50 mb-4 sm:mb-6">Eventinformation</p>

            <div className="flex flex-col">
              {event.date && (
                <MetaRow
                  label="Datum"
                  value={
                    <span className="capitalize">{formatLongDate(event.date)}</span>
                  }
                />
              )}
              {event.date && (
                <MetaRow label="Tid" value={formatTime(event.date)} />
              )}
              {event.doorsOpen !== undefined && event.doorsOpen !== null && event.date && (
                <MetaRow
                  label="Dörrar öppnar"
                  value={(() => {
                    const d = new Date(event.date)
                    d.setMinutes(d.getMinutes() - event.doorsOpen!)
                    return d.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })
                  })()}
                />
              )}
              {venue?.name && (
                <MetaRow label="Plats" value={venue.name} />
              )}
              {(venue?.City || venue?.Country) && (
                <MetaRow
                  label="Stad"
                  value={[venue.City, venue.Country].filter(Boolean).join(', ')}
                />
              )}
              {event.headline?.name && (
                <MetaRow label="Headliner" value={event.headline.name} />
              )}
              {event.eventType && (
                <MetaRow
                  label="Typ"
                  value={event.eventType === 'virtual' ? 'Online' : 'Live'}
                />
              )}
              {tickets && (
                <MetaRow
                  label="Biljetter"
                  value={
                    <Link
                      href={tickets}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:italic transition-all underline underline-offset-2"
                    >
                      {isPast ? 'Arkivlänk' : 'Köp här →'}
                    </Link>
                  }
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Previous Events Section ────────────────────────────────────────── */}
      {previousEvents && previousEvents.length > 0 && (
        <section className="px-3 sm:px-4 lg:px-8 py-8 sm:py-12 lg:py-16 border-t border-black border-solid bg-gray-50">
          <h2 className="text-sans-22 sm:text-sans-35 lg:text-sans-60 font-600 uppercase mb-5 sm:mb-8 pb-3 sm:pb-4 border-b border-black">
            Tidigare event
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px border border-black border-solid">
            {previousEvents.map((prevEvent) => (
              <PreviousEventCard key={prevEvent._id} event={prevEvent} />
            ))}
          </div>
          <div className="mt-6 sm:mt-8 flex justify-center">
            <Link
              href="/event"
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-4 border border-black font-600 uppercase tracking-widest text-sans-12 sm:text-sans-14 hover:bg-black hover:text-white transition-colors w-full sm:w-auto min-h-[52px]"
            >
              Se alla event
            </Link>
          </div>
        </section>
      )}
    </main>
  )
}
