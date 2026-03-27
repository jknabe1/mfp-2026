import { client } from '@/sanity/client';
import ArrangemangList from '@/components/Arrangemang/ArrangemangList';
import { SanityImageSource } from '@/lib/utils';
import type { Metadata } from 'next';

interface Artist {
  _id: string;
  name: string;
  slug: { current: string };
  date: string;
  image: SanityImageSource;
}

export const revalidate = 30;

async function fetchArtists(): Promise<Artist[]> {
  const query = `*[_type == "artist" && defined(slug.current) && defined(date)]{_id, name, slug, date, image} | order(date desc)`;
  return await client.fetch<Artist[]>(query);
}

export async function generateMetadata(): Promise<Metadata> {
  const artists = await fetchArtists();
  
  return {
    title: 'Artister',
    description: 'Utforska alla artister som är signade till Music For Pennies.',
    openGraph: {
      title: 'Artister - Music For Pennies',
      description: 'Se hela listan av artister som är del av Music For Pennies och upptäck nya namn.',
      url: 'https://musicforpennies.se/arrangemang',
      siteName: 'Music For Pennies',
      images: artists.length > 0 ? artists.slice(0, 1).map(artist => ({
        url: artist.image ? `https://musicforpennies.se/api` : 'https://musicforpennies.se/assets/default-artist.jpg'
      })) : [{ url: 'https://musicforpennies.se/assets/default-artist.jpg' }],
      type: 'website',
    },
  };
}

export default async function Page() {
  const artists = await fetchArtists();

  return <ArrangemangList initialArtists={artists} />;
}
