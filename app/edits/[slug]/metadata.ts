import { client } from '@/sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { Metadata } from 'next';
import { PortableTextBlock } from '@portabletext/react';

interface SanityImageSource {
  asset: {
    _ref: string;
  };
}

interface NewsArticle {
  currentSlug: string;
  name: string;
  details: PortableTextBlock[];
  image: SanityImageSource;
  excerpt: string;
  publishedAt: string;
}

const builder = imageUrlBuilder(client);

function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

async function getData(slug: string): Promise<NewsArticle | null> {
  const query = `
    *[_type == "news" && slug.current == '${slug}'] {
        "currentSlug": slug.current,
        name,
        details,
        image,
        excerpt,
        publishedAt,
    }[0]`;

  const news = await client.fetch<NewsArticle>(query);
  return news;
}

// Helper to extract plain text from PortableText for meta descriptions
function portableTextToPlainText(blocks: PortableTextBlock[] = []): string {
  return blocks
    .map((block) => {
      if (block._type !== 'block' || !block.children) {
        return '';
      }
      return (block.children as unknown as Array<{ text?: string }>)
        .map((child) => child.text || '')
        .join('');
    })
    .join(' ')
    .trim();
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const news = await getData(resolvedParams.slug);

  if (!news) {
    return {
      title: 'News Not Found | K&K Records',
      description: 'The requested news article could not be found.',
    };
  }

  const plainTextContent = portableTextToPlainText(news.details);
  const description = news.excerpt || plainTextContent.slice(0, 160);

  return {
    title: `${news.name} | Music For Pennies`,
    description,
    alternates: {
      canonical: `https://musicforpennies.se/edits/${news.currentSlug}`,
    },
    openGraph: {
      title: `${news.name}`,
      description,
      url: `https://musicforpennies.se/edits/${news.currentSlug}`,
      siteName: 'Music For Pennies',
      locale: 'sv_SE',
      type: 'article',
      publishedTime: news.publishedAt,
      authors: ['Music For Pennies'],
      images: news.image ? [{ url: urlFor(news.image).url(), width: 1200, height: 630, alt: news.name }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${news.name}`,
      description,
      images: news.image ? [{ url: urlFor(news.image).url() }] : [],
    },
    keywords: [news.name, 'Music For Pennies', 'news', 'edits', 'music'],
  };
}