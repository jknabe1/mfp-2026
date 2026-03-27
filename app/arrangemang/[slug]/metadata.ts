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

// Explicitly use Metadata as the return type
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const arrangemang = await getData(resolvedParams.slug);

  if (!arrangemang) {
    return {
      title: 'Arrangemang Not Found | Music For Pennies',
      description: 'The requested arrangemang could not be found.',
    };
  }

  return {
    title: `${arrangemang.Namn} | Music For Pennies`,
    description: arrangemang.Beskrivning?.map(block => block.children?.map(child => child.text).join(' ')).join(' ') || 'Explore this arrangemang.',
    openGraph: {
      title: arrangemang.Namn,
      description: arrangemang.Beskrivning?.map(block => block.children?.map(child => child.text).join(' ')).join(' ') || 'Explore this arrangemang.',
      images: arrangemang.Bild ? [{ url: urlFor(arrangemang.Bild).url() }] : [],
    },
  };
}



// Explicitly use Metadata as the return type
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const artist = await getData(resolvedParams.slug);

  if (!artist) {
    return {
      title: 'Artist Not Found | Music For Pennies',
      description: 'The requested artist could not be found.',
    };
  }

  return {
    title: `${artist.name} | Music For Pennies`,
    description: artist.Biography?.map(block => block.children?.map(child => child.text).join(' ')).join(' ') || 'Explore the artist’s biography and works.',
    openGraph: {
      title: artist.name,
      description: artist.Biography?.map(block => block.children?.map(child => child.text).join(' ')).join(' ') || 'Explore the artist’s biography and works.',
      images: artist.image ? [{ url: urlFor(artist.image).url() }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: artist.name,
      description: artist.Biography?.map(block => block.children?.map(child => child.text).join(' ')).join(' ') || 'Explore the artist’s biography and works.',
      images: artist.image ? [{ url: urlFor(artist.image).url() }] : [],
    },
  };
}
