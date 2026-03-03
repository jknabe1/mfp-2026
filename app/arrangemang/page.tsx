import '@/app/globals.css';
import { client } from '@/sanity/client';
import ArtistsList from '@/components/Artists/ArtistsSection';
import { SanityImageSource } from '@/lib/utils'; // Import type from utils

// Define the Artist interface with proper image typing
interface Artist {
  _id: string;
  _rev: string;
  _type: string;
  _createdAt: string;
  _updatedAt: string;
  name: string;
  slug: { current: string };
  date: string;
  image: SanityImageSource;
}

export const revalidate = 30;

const ARTISTS_QUERY = `*[_type == "artist" && defined(slug.current)]{_id, name, slug, date, image}|order(name asc)`;

export default async function Page() {
  const sanityArtists = await client.fetch<Artist[]>(ARTISTS_QUERY); // Type directly as Artist[]
  const artists: Artist[] = sanityArtists.map((artist) => ({
    _id: artist._id,
    _rev: artist._rev,
    _type: artist._type,
    _createdAt: artist._createdAt,
    _updatedAt: artist._updatedAt,
    name: artist.name,
    slug: artist.slug,
    date: artist.date,
    image: artist.image,
  }));

  return <ArtistsList initialArtists={artists} />;
}