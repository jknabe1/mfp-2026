import { client } from '@/sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { Metadata } from 'next';
import { PortableTextBlock } from '@portabletext/react';

// Define the type for Sanity image source
interface SanityImageSource {
  asset: {
    _ref: string;
  };
}

// Define the arrangemang data structure
interface Arrangemang {
  currentURL: string;
  Namn: string;
  Beskrivning: PortableTextBlock[];
  Bild: SanityImageSource;
}

const builder = imageUrlBuilder(client);

function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

async function getData(slug: string): Promise<Arrangemang | null> {
  const query = `
    *[_type == "arrangemang" && URL.current == '${slug}'] {
        "currentURL": URL.current,
        Namn,
        Beskrivning,
        Bild,
      }[0]`;

  const arrangemang = await client.fetch<Arrangemang>(query);
  return arrangemang;
}

// Generate metadata for arrangemang pages
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const arrangemang = await getData(resolvedParams.slug);

  if (!arrangemang) {
    return {
      title: 'Arrangemang Not Found | Music For Pennies',
      description: 'Det efterfrågade arrangemanget kunde inte hittas.',
    };
  }

  const description = arrangemang.Beskrivning?.map(block => block.children?.map((child: any) => child.text).join(' ')).join(' ') || 'Se detta arrangemang från Music For Pennies.';

  return {
    title: `${arrangemang.Namn} | Music For Pennies`,
    description: description.slice(0, 160),
    keywords: ['arrangemang', arrangemang.Namn, 'Music For Pennies', 'konserter'],
    alternates: {
      canonical: `https://musicforpennies.se/arrangemang/${arrangemang.currentURL}`,
    },
    openGraph: {
      title: arrangemang.Namn,
      description: description.slice(0, 160),
      url: `https://musicforpennies.se/arrangemang/${arrangemang.currentURL}`,
      siteName: 'Music For Pennies',
      locale: 'sv_SE',
      type: 'website',
      images: arrangemang.Bild ? [{ 
        url: urlFor(arrangemang.Bild).width(1200).height(630).url(),
        width: 1200,
        height: 630,
        alt: arrangemang.Namn,
      }] : [{
        url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Music For Pennies arrangemang',
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: arrangemang.Namn,
      description: description.slice(0, 160),
      images: arrangemang.Bild ? [urlFor(arrangemang.Bild).width(1200).height(630).url()] : ['https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop'],
    },
  };
}
