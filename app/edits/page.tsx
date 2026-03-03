import '@/app/globals.css';
import { client } from '@/sanity/client';
import NewsList from '@/components/News/NewsSection';
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
  title: 'Edits',
  description: 'Senaste nyheterna från Music For Pennies. Håll dig uppdaterad med pressmeddelanden, evenemang och nyheter.',
  openGraph: {
    title: 'Edits - Music For Pennies',
    description: 'Senaste nyheterna från Music For Pennies.',
    url: 'https://musicforpennies.se/edits',
    siteName: 'Music For Pennies',
    images: [
      {
        url: 'https://musicforpennies.se/api', // Replace with a valid image
        width: 1200,
        height: 630,
        alt: 'Nyheter - Music For Pennies',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Edits - Music For Pennies',
    description: 'Håll dig uppdaterad med de senaste nyheterna från Music For Pennies.',
    images: ['https://musicforpennies.se/api'],
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

  return <NewsList initialArtists={newsItems} />;
}