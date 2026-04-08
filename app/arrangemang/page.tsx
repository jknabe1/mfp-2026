import { client } from '@/sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import ArrangemangMinimal from '@/components/Arrangemang/ArrangemangMinimal';
import { SanityImageSource } from '@/lib/utils';
import type { Metadata } from 'next';

const builder = imageUrlBuilder(client);

function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

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
    description: 'Utforska alla arrangemang och evenemang från Music For Pennies. Se vår kompletta lista över musikproduktioner, konserter och festivaler.',
    keywords: ['arrangemang', 'evenemang', 'konserter', 'festivaler', 'Music For Pennies'],
    alternates: {
      canonical: 'https://musicforpennies.se/arrangemang',
    },
    openGraph: {
      title: 'Arrangemang - Music For Pennies',
      description: 'Se hela listan av arrangemang och evenemang från Music For Pennies.',
      url: 'https://musicforpennies.se/arrangemang',
      siteName: 'Music For Pennies',
      locale: 'sv_SE',
      type: 'website',
      images: arrangemangItems.length > 0 ? arrangemangItems.slice(0, 1).map(item => ({
        url: item.Bild ? urlFor(item.Bild).width(1200).height(630).url() : 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Arrangemang från Music For Pennies',
      })) : [{ 
        url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Music For Pennies arrangemang',
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Arrangemang - Music For Pennies',
      description: 'Se hele listan av arrangemang och evenemang från Music For Pennies.',
      images: arrangemangItems.length > 0 ? [arrangemangItems[0].Bild ? urlFor(arrangemangItems[0].Bild).width(1200).height(630).url() : 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop'] : ['https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop'],
    },
  };
}

export default async function ArrangemangPage() {
  const arrangemangItems = await fetchArrangemang();

  return <ArrangemangMinimal arrangemangItems={arrangemangItems} />;
}
