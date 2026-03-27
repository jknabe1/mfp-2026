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
    <div className="flex flex-col sm:flex-row sm:items-start border-b border-black border-solid py-3 lg:py-4 gap-1 sm:gap-0">
      <span className="text-sans-12 font-600 uppercase tracking-widest shrink-0 sm:w-36 lg:w-44 opacity-50">
        {label}
      </span>
      <span className="text-sans-14 lg:text-sans-16 font-600 uppercase">
        {value}
      </span>
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const event = await getEvent(slug)

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
        <div className="relative w-full h-[56vw] min-h-[300px] max-h-[90vh]">
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

          {/* Gradient scrim — stronger at bottom for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Past event badge */}
          {isPast && (
            <div className="absolute top-4 left-4 lg:top-6 lg:left-6 z-10">
              <span className="inline-flex items-center gap-1.5 bg-black text-[var(--vividGreen)] text-sans-12 font-600 px-3 py-1.5 uppercase tracking-widest border border-[var(--vividGreen)]">
                Tidigare event
              </span>
            </div>
          )}

          {/* Ticket CTA — top right */}
          {tickets && !isPast && (
            <div className="absolute top-4 right-4 lg:top-6 lg:right-6 z-10">
              <Link
                href={tickets}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-black text-white text-sans-12 font-600 px-4 py-2 uppercase tracking-widest hover:bg-white hover:text-black transition-colors border border-[var(--vividGreen)]"
              >
                Köp biljetter
              </Link>
            </div>
          )}

          {/* Bottom overlay: event name + date block */}
          <div className="absolute bottom-0 left-0 right-0 z-10 px-4 pb-5 lg:px-8 lg:pb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h1 className="text-white uppercase font-600 text-sans-35 lg:text-sans-60 xl:text-sans-120 leading-none text-balance max-w-[75%]">
              {event.name}
            </h1>

            {dateBlock && (
              <div className="flex items-stretch shrink-0 border border-white/50">
                <div className="flex flex-col items-center justify-center px-4 py-3 bg-white/10 backdrop-blur-sm min-w-[64px]">
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

        {/* Banner info bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 lg:px-8 lg:py-4 bg-black text-white uppercase">
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
            className="text-sans-12 font-600 tracking-widest text-[var(--vividGreen)] hover:italic transition-all"
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
            <div className="px-4 py-6 lg:px-8 lg:py-10 border-b border-black border-solid">
              <p className="text-sans-12 font-600 uppercase tracking-widest opacity-50 mb-4">Om eventet</p>
              <div className="prose prose-sm lg:prose-base max-w-none text-sans-16 leading-relaxed rich-text">
                <PortableText value={event.details} />
              </div>
            </div>
          )}

          {/* Tickets CTA block (mobile: visible; desktop: supplementary) */}
          {tickets && !isPast && (
            <div className="px-4 py-6 lg:px-8 lg:py-8 border-b border-black border-solid">
              <Link
                href={tickets}
                target="_blank"
                rel="noopener noreferrer"
                className="button button-secondary-vividGreen inline-flex items-center gap-3 px-6 py-4 text-sans-14 font-600 uppercase tracking-widest w-full sm:w-auto justify-center"
              >
                <span aria-hidden="true">■</span>
                Köp biljetter
              </Link>
            </div>
          )}
        </div>

        {/* Right column: event metadata */}
        <div className="lg:col-span-5 grid-col-border">
          <div className="px-4 py-6 lg:px-8 lg:py-10">
            <p className="text-sans-12 font-600 uppercase tracking-widest opacity-50 mb-6">Eventinformation</p>

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
    </main>
  )
}
