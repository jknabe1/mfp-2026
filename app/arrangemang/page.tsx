import { client } from '@/sanity/client';
import ArrangemangList from '@/components/Arrangemang/ArrangemangList';
import { SanityImageSource } from '@/lib/utils';
import type { Metadata } from 'next';

interface ArrangemangData {
  _id: string;
  Namn: string;
  URL: { current: string };
  Bild: SanityImageSource;
  Beskrivning?: any;
}

export const revalidate = 30;

async function fetchArrangemang(): Promise<ArrangemangData[]> {
  const arrangemangQuery = `*[_type == "arrangemang" && defined(URL.current)]{_id, Namn, URL, Bild, Beskrivning} | order(Namn asc)`;
  return await client.fetch<ArrangemangData[]>(arrangemangQuery);
}

export async function generateMetadata(): Promise<Metadata> {
  const arrangemangItems = await fetchArrangemang();
  
  return {
    title: 'Arrangemang - Music For Pennies',
    description: 'Utforska alla arrangemang och evenemang från Music For Pennies.',
    openGraph: {
      title: 'Arrangemang - Music For Pennies',
      description: 'Se hela listan av arrangemang och evenemang från Music For Pennies.',
      url: 'https://musicforpennies.se/arrangemang',
      siteName: 'Music For Pennies',
      images: arrangemangItems.length > 0 ? arrangemangItems.slice(0, 1).map(item => ({
        url: item.Bild ? `https://musicforpennies.se/api` : 'https://musicforpennies.se/assets/default-arrangemang.jpg'
      })) : [{ url: 'https://musicforpennies.se/assets/default-arrangemang.jpg' }],
      type: 'website',
    },
  };
}

export default async function ArrangemangPage() {
  const arrangemangItems = await fetchArrangemang();

  return <ArrangemangList initialArrangemang={arrangemangItems} />;
}
