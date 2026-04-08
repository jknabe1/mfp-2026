import { client } from "@/sanity/client"
import imageUrlBuilder from "@sanity/image-url"
import Image from "next/image"
import { PortableText, PortableTextBlock } from 'next-sanity'
import Link from "next/link"
import { notFound } from "next/navigation"
import type { SanityImageSource } from "@sanity/image-url/lib/types/types"

const builder = imageUrlBuilder(client)

export const revalidate = 60

function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

interface Venue {
  name?: string
  address?: string
}

interface Headline {
  name?: string
  slug?: {
    current: string
  }
}

interface GalleryImage {
  asset: SanityImageSource
  alt?: string
  caption?: string
}

interface Event {
  name: string
  slug: {
    current: string
  }
  date?: string
  endDate?: string
  image?: SanityImageSource
  gallery?: GalleryImage[]
  shortDescription?: string
  details?: PortableTextBlock[]
  headline?: Headline
  venue?: Venue
  tickets?: string
  ticketPrice?: string
  eventType?: 'in-person' | 'virtual' | 'hybrid'
  eventCategory?: string
  ageRestriction?: string
  lineup?: Headline[]
  specialGuests?: string
  doorsOpen?: number
  artist?: string
  headliner?: Headline
}

// Helper function to convert Portable Text to plain text for meta descriptions
function portableTextToPlainText(blocks: PortableTextBlock[] = []): string {
  return blocks
    .map((block) => {
      if (block._type !== "block" || !block.children) {
        return ""
      }
      return block.children.map((child: any) => child.text).join("")
    })
    .join("\n\n")
}

async function getEvent(slug: string): Promise<Event | null> {
  // Validate slug format - should only contain alphanumeric, hyphens, underscores
  if (!slug || !/^[a-z0-9-_]+$/i.test(slug)) {
    return null
  }

  const EVENT_QUERY = `*[
    _type == "event" &&
    slug.current == $slug
  ][0]{
    ...,
    headline->{name, slug},
    venue->,
    tickets,
    ticketPrice,
    eventType,
    eventCategory,
    ageRestriction,
    endDate,
    doorsOpen,
    shortDescription,
    specialGuests,
    artist,
    "headliner": headliner->{name, slug},
    "lineup": lineup[]->{name, slug},
    "gallery": gallery[]{
      asset,
      alt,
      caption
    }
  }`
  
  try {
    return await client.fetch(EVENT_QUERY, { slug })
  } catch (error) {
    console.error(`[v0] Error fetching event with slug "${slug}":`, error)
    return null
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const event = await getEvent(slug)

    if (!event) {
      return {
        title: "Event Not Found - Music For Pennies",
        description: "The requested event does not exist.",
      }
    }

    const plainTextDescription = event.shortDescription || (event.details ? portableTextToPlainText(event.details) : "")

    return {
      title: `${event.name} | Music For Pennies`,
      description: plainTextDescription.slice(0, 160) || `Event från Music For Pennies: ${event.name}`,
      alternates: {
        canonical: `https://musicforpennies.se/event/${event.slug.current}`,
      },
      openGraph: {
        title: `${event.name} - Music For Pennies`,
        description: plainTextDescription.slice(0, 160) || `Event från Music For Pennies: ${event.name}`,
        url: `https://musicforpennies.se/event/${event.slug.current}`,
        siteName: "Music For Pennies",
        locale: "sv_SE",
        type: "website",
        images: event.image ? [{ url: urlFor(event.image).url(), width: 1200, height: 630, alt: event.name }] : [],
      },
      twitter: {
        card: "summary_large_image",
        title: `${event.name} - Music For Pennies`,
        description: plainTextDescription.slice(0, 160) || `Event från Music For Pennies: ${event.name}`,
        images: event.image ? [{ url: urlFor(event.image).url() }] : [],
      },
    }
  } catch (error) {
    console.error('[v0] Error generating metadata:', error)
    return {
      title: "Event - K&K Records",
      description: "Browse upcoming events.",
    }
  }
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const event = await getEvent(slug)

    if (!event) {
      notFound()
    }

  const { venue, tickets, ticketPrice, eventCategory, ageRestriction, lineup, specialGuests, gallery, shortDescription, doorsOpen, artist, headliner } = event

  const plainTextDescription = shortDescription || (event.details ? portableTextToPlainText(event.details) : "")

  const venueObject = venue
    ? {
        "@type": "Place" as const,
        name: venue.name || "Music For Pennies Venue",
        address: venue.address || "Örebro, Sweden",
      }
    : {
        "@type": "Place" as const,
        name: "Music For Pennies Venue",
        address: "Örebro, Sweden",
      }

  const performerObject = {
    "@type": "MusicGroup" as const,
    name: event.headline?.name || event.name || "Music For Pennies Artist",
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Hem",
        item: "https://musicforpennies.se"
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Event",
        item: "https://musicforpennies.se/event"
      },
      {
        "@type": "ListItem",
        position: 3,
        name: event.name,
        item: `https://musicforpennies.se/event/${event.slug.current}`
      }
    ]
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    "@id": `https://musicforpennies.se/event/${event.slug.current}`,
    name: event.name,
    startDate: event.date,
    eventStatus: "https://schema.org/EventScheduled",
    location: venueObject,
    image: event.image ? urlFor(event.image).width(1200).height(630).url() : "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop",
    url: `https://musicforpennies.se/event/${event.slug.current}`,
    description: plainTextDescription || `Music event: ${event.name} at Music For Pennies`,
    performer: performerObject,
    organizer: {
      "@type": "Organization",
      name: "Music For Pennies",
      url: "https://musicforpennies.se",
      logo: "https://musicforpennies.se/media/mfp.svg",
    },
    offers: tickets
      ? {
          "@type": "Offer",
          url: tickets,
          availability: "https://schema.org/InStock",
          price: ticketPrice || "0",
          priceCurrency: "SEK",
        }
      : undefined,
  }

  // Format date for display
  const formattedDate = event.date 
    ? new Date(event.date).toLocaleDateString('sv-SE', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null

  const formattedTime = event.date
    ? new Date(event.date).toLocaleTimeString('sv-SE', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : null

  // Create a date block object for hero overlay
  const dateBlock = event.date
    ? {
        day: new Date(event.date).getDate().toString().padStart(2, '0'),
        month: new Date(event.date).toLocaleString('sv-SE', { month: 'short' }).toUpperCase(),
        time: new Date(event.date).toLocaleTimeString('sv-SE', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      }
    : null

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      
      {/* Full-width Hero Image */}
      <header className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh] overflow-hidden">
        {event.image ? (
          <Image
            src={urlFor(event.image).width(1920).height(1080).auto('format').quality(85).url()}
            alt={event.name}
            fill
            priority
            loading="eager"
            className="object-cover"
            sizes="100vw"
            quality={85}
          />
        ) : (
          <div className="absolute inset-0 bg-neutral-200 flex items-center justify-center">
            <span className="text-neutral-500 text-lg">No Image Available</span>
          </div>
        )}
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        
        {/* Hero content overlay */}
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
                  <span className="text-white text-sans-35 font-600 tracking-widest mt-1">{dateBlock.time}</span>
                </div>
              </div>
            )}
          </div>
          {/* ── Mobile banner bar — event name + date prominently displayed ── */}
        <div className="md:hidden bg-white text-black">
          <div className="max-w-4xl mx-auto">
            {/* Event name */}
            <div className="px-6 py-5 border-b border-solid border-black">
              <h1 className="text-sans-28 font-700 uppercase leading-[1.05] text-balance">
                {event.name}
              </h1>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 z-10 flex flex-col justify-end bg-gradient-to-t from-transparent to-gray-950/50 p-5">
              <div className="absolute top-4 left-4 z-10 flex flex-col items-start gap-1">
                <nav aria-label="Breadcrumb" className="mb-4 bg-white px-2 py-1">
                  <ol className="flex items-center gap-2 text-black text-sm">
                  <li>
                    <Link href="/" className="hover:text-white transition-colors">Hem</Link>
                  </li>
                  <li aria-hidden="true">/</li>
                  <li>
                    <Link href="/event" className="hover:text-white transition-colors">Event</Link>
                  </li>
                  <li aria-hidden="true">/</li>
                  <li aria-current="page" className="text-black">{event.name}</li>
                  </ol>
                </nav>
              </div>
            </div>
      </header>

      {/* Two-column content area */}
      <div className="px-2 lg:px-5 py-8 md:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left column - Main content */}
          <section className="lg:col-span-7 xl:col-span-8 border border-black border-solid p-6 md:p-8">
            <h2 className="sr-only">Om eventet</h2>
            <p className="text-sans-11 sm:text-sans-12 font-600 uppercase tracking-widest opacity-50 mb-3 sm:mb-4">Om eventet</p>
            
            {/* Short description highlight */}
            {shortDescription && (
              <p className="text-xl md:text-2xl text-neutral-700 font-500 leading-relaxed mb-8 text-balance">
                {shortDescription}
              </p>
            )}
            
            {event.details && (
              <div className="prose prose-lg max-w-none leading-relaxed">
                <PortableText value={event.details} />
              </div>
            )}
            
            {!event.details && !shortDescription && (
              <p className="text-neutral-600 text-lg">
                Mer information kommer snart.
              </p>
            )}

            {/* Image Gallery */}
            {gallery && gallery.length > 0 && (
              <div className="mt-12">
                <h3 className="text-sans-22 font-600 mb-6 uppercase tracking-wide">Galleri</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {gallery.map((img, index) => (
                    <figure key={index} className="relative aspect-video overflow-hidden bg-neutral-100">
                      <Image
                        src={urlFor(img.asset).width(800).height(450).auto('format').quality(80).url()}
                        alt={img.alt || `Bild ${index + 1} från ${event.name}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 50vw"
                        quality={80}
                        loading={index < 2 ? "eager" : "lazy"}
                      />
                      {img.caption && (
                        <figcaption className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-sm p-2">
                          {img.caption}
                        </figcaption>
                      )}
                    </figure>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Right column - Event details sidebar */}
          <aside className="lg:col-span-5 xl:col-span-4">
            <div className="sticky top-24 space-y-6">
              {/* Event info card */}
              <div className="border border-black border-solid p-6 md:p-8">
                <h2 className="text-sans-22 font-600 mb-6 uppercase tracking-wide">Eventinfo</h2>
                
                <dl className="space-y-4">
                  {/* Date */}
                  {formattedDate && (
                    <div className="flex flex-col">
                      <dt className="text-sm text-neutral-500 uppercase tracking-wide mb-1">Datum</dt>
                      <dd className="text-lg font-600 capitalize">
                        <time dateTime={event.date}>{formattedDate}</time>
                      </dd>
                    </div>
                  )}

                  {/* Time */}
                  {formattedTime && (
                    <div className="flex flex-col">
                      <dt className="text-sm text-neutral-500 uppercase tracking-wide mb-1">Tid</dt>
                      <dd className="text-lg font-600">{formattedTime}</dd>
                      {doorsOpen && (
                        <dd className="text-sm text-neutral-600 mt-1">Dörrar öppnar {doorsOpen} min innan</dd>
                      )}
                    </div>
                  )}

                  {/* Venue */}
                  {venue?.name && (
                    <div className="flex flex-col">
                      <dt className="text-sm text-neutral-500 uppercase tracking-wide mb-1">Plats</dt>
                      <dd className="text-lg font-600">{venue.name}</dd>
                      {venue.address && (
                        <dd className="text-sm text-neutral-600 mt-1">{venue.address}</dd>
                      )}
                    </div>
                  )}

                  {/* Event Category */}
                  {eventCategory && (
                    <div className="flex flex-col">
                      <dt className="text-sm text-neutral-500 uppercase tracking-wide mb-1">Typ</dt>
                      <dd className="text-lg font-600 capitalize">{eventCategory.replace('-', ' ')}</dd>
                    </div>
                  )}

                  {/* Artist */}
                  {artist && (
                    <div className="flex flex-col border-t border-neutral-200">
                      <dt className="text-sm text-neutral-500 uppercase tracking-wide mb-1">Artist</dt>
                      <dd className="text-lg font-600">{artist}</dd>
                    </div>
                  )}

                  {/* Headliner */}
                  {headliner?.name && (
                    <div className="flex flex-col">
                      <dt className="text-sm text-neutral-500 uppercase tracking-wide mb-1">Huvudartist</dt>
                      <dd className="text-lg font-600">
                        {headliner.slug?.current ? (
                          <Link href={`/om-oss/vara-foreningar/${headliner.slug.current}`} className="hover:underline">
                            {headliner.name}
                          </Link>
                        ) : (
                          headliner.name
                        )}
                      </dd>
                    </div>
                  )}

                  {/* Age Restriction */}
                  {ageRestriction && (
                    <div className="flex flex-col">
                      <dt className="text-sm text-neutral-500 uppercase tracking-wide mb-1">Åldersgräns</dt>
                      <dd className="text-lg font-600">{ageRestriction === 'all-ages' ? 'Alla åldrar' : ageRestriction === 'family' ? 'Familjevänligt' : ageRestriction}</dd>
                    </div>
                  )}

                  {/* Headline artist */}
                  {event.headline?.name && (
                    <div className="flex flex-col">
                      <dt className="text-sm text-neutral-500 uppercase tracking-wide mb-1">Huvudartist</dt>
                      <dd className="text-lg font-600">
                        {event.headline.slug?.current ? (
                          <Link href={`/artists/${event.headline.slug.current}`} className="hover:underline">
                            {event.headline.name}
                          </Link>
                        ) : (
                          event.headline.name
                        )}
                      </dd>
                    </div>
                  )}

                  {/* Additional lineup */}
                  {lineup && lineup.length > 0 && (
                    <div className="flex flex-col">
                      <dt className="text-sm text-neutral-500 uppercase tracking-wide mb-1">Lineup</dt>
                      <dd className="text-lg font-600">
                        {lineup.map((artist, index) => (
                          <span key={artist.slug?.current || index}>
                            {artist.slug?.current ? (
                              <Link href={`/artists/${artist.slug.current}`} className="hover:underline">
                                {artist.name}
                              </Link>
                            ) : (
                              artist.name
                            )}
                            {index < lineup.length - 1 && ', '}
                          </span>
                        ))}
                      </dd>
                    </div>
                  )}

                  {/* Special guests */}
                  {specialGuests && (
                    <div className="flex flex-col">
                      <dt className="text-sm text-neutral-500 uppercase tracking-wide mb-1">Special guests</dt>
                      <dd className="text-lg font-600">{specialGuests}</dd>
                    </div>
                  )}

                  {/* Ticket Price */}
                  {ticketPrice && (
                    <div className="flex flex-col">
                      <dt className="text-sm text-neutral-500 uppercase tracking-wide mb-1">Pris</dt>
                      <dd className="text-lg font-600">{ticketPrice}</dd>
                    </div>
                  )}
                  {tickets && (
                 <div className="flex flex-col">
                      <dt className="text-sm text-neutral-500 uppercase tracking-wide mb-1">Biljetter</dt>
                      <dd className="text-lg font-600">
                        <Link 
                          href={tickets} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:italic"
                        >
                          Tickster
                        </Link>
                    </dd>
                    </div>
                    )}

                </dl>
              </div>

              {/* Share section */}
              <div className="border border-black border-solid p-6 md:p-8">
                <h2 className="text-sans-18 font-600 mb-4 uppercase tracking-wide">Dela event</h2>
                <div className="flex gap-3">
                  <Link
                    href={`https://www.facebook.com/sharer/sharer.php?u=https://kkrecords.se/event/${event.slug.current}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 bg-black text-white hover:bg-neutral-800 transition-colors"
                    aria-label="Dela på Facebook"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </Link>
                  <Link
                    href={`https://twitter.com/intent/tweet?url=https://kkrecords.se/event/${event.slug.current}&text=${encodeURIComponent(event.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 bg-black text-white hover:bg-neutral-800 transition-colors"
                    aria-label="Dela på X (Twitter)"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </Link>
                  <Link
                    href={`mailto:?subject=${encodeURIComponent(event.name)}&body=${encodeURIComponent(`Kolla in detta event: https://kkrecords.se/event/${event.slug.current}`)}`}
                    className="flex items-center justify-center w-10 h-10 bg-black text-white hover:bg-neutral-800 transition-colors"
                    aria-label="Dela via e-post"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect width="20" height="16" x="2" y="4" rx="2"/>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                    </svg>
                  </Link>
                </div>
              </div>

              {/* Back to events link */}
              <Link 
                href="/event" 
                className="inline-flex items-center gap-2 text-sm uppercase tracking-wide hover:underline"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m15 18-6-6 6-6"/>
                </svg>
                <span>Tillbaka till alla event</span>
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </article>
  ) 
  } catch (error) {
    console.error('[v0] Error rendering event page:', error)
    notFound()
  }
}
