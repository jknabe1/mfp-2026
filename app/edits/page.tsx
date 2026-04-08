import '@/app/globals.css';
import { client } from '@/sanity/client';
import ArticleList from '@/components/News/ArticleList';
import { Metadata } from 'next';
interface SanityImageSource {
  asset: { _ref: string };
}

// Define the News interface with proper image typing
interface News {
  _id: string;
  _rev: string;
  _type: string;
  _createdAt: string;
  _updatedAt: string;
  name: string;
  slug: { current: string };
  date: string;
  image: SanityImageSource;
  publishedAt: string;
}

export const revalidate = 30;

export const metadata: Metadata = {
  title: 'Edits - Nyheter och Press från Music For Pennies',
  description: 'Senaste nyheterna från Music For Pennies. Håll dig uppdaterad med pressmeddelanden, evenemang och nyheter om musikproduktion och artistsamarbeten.',
  keywords: ['nyheter', 'press', 'edits', 'musiknyheter', 'Music For Pennies'],
  alternates: {
    canonical: 'https://musicforpennies.se/edits',
  },
  openGraph: {
    title: 'Edits - Nyheter från Music For Pennies',
    description: 'Senaste nyheterna från Music For Pennies. Pressmeddelanden och uppdateringar.',
    url: 'https://musicforpennies.se/edits',
    siteName: 'Music For Pennies',
    locale: 'sv_SE',
    type: 'website',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Nyheter - Music For Pennies',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Edits - Music For Pennies',
    description: 'Senaste nyheterna och pressmeddelanden från Music For Pennies.',
    images: ['https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop'],
  },
};

const NEWS_QUERY = `*[_type == "news" && defined(slug.current)]{_id, name, slug, date, image, publishedAt} | order(publishedAt desc)`;

export default async function Page() {
  const sanityNews = await client.fetch<News[]>(NEWS_QUERY); // Type directly as News[]
  const newsItems: News[] = sanityNews.map((news) => ({
    _id: news._id,
    _rev: news._rev,
    _type: news._type,
    _createdAt: news._createdAt,
    _updatedAt: news._updatedAt,
    name: news.name,
    slug: news.slug,
    date: news.date,
    image: news.image,
    publishedAt: news.publishedAt,
  }));

  return <ArticleList initialArtists={newsItems} />;
}
