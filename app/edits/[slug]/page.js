import imageUrlBuilder from '@sanity/image-url';
import { client } from '@/sanity/client';
import Image from 'next/image';
import { PortableText } from 'next-sanity';

export const revalidate = 30;

const builder = imageUrlBuilder(client);

function urlFor(source) {
  return builder.image(source);
}

async function getData(slug) {
  const query = `
    *[_type == "news" && slug.current == '${slug}'] {
        "currentSlug": slug.current,
          name,
          details,
          image,
          excerpt,
          publishedAt,
          date,
      }[0]`;
  const news = await client.fetch(query);
  return news;
}

export async function generateMetadata({ params }) {
  const news = await getData(params.slug);

  if (!news) {
    return {
      title: 'news Not Found - Music For Pennies',
      description: 'The requested news page could not be found.',
    };
  }

  return {
    title: `${news.name}`,
    description: news.excerpt || 'Read the latest news and updates.',
    openGraph: {
      title: `${news.name} - Music For Pennies`,
      description: news.excerpt || 'Read the latest news and updates.',
      images: news.image ? [{ url: urlFor(news.image).url() }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${news.name} - Music For Pennies`,
      description: news.excerpt || 'Read the latest news and updates.',
      images: news.image ? [{ url: urlFor(news.image).url() }] : [],
    },
  };
}

export default async function BlogArticle({ params }) {
  const news = await getData(params.slug);

  if (!news) {
    return <div>news page not found</div>;
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    headline: news.name,
    description: news.excerpt || '',
    datePublished: news.publishedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://musicforpennies.se/om-oss/${news.currentSlug}`,
    },
    image: news.image ? urlFor(news.image).url() : undefined,
    author: {
      '@type': 'Organization',
      name: 'Music For Pennies',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Music For Pennies',
      logo: {
        '@type': 'ImageObject',
        url: 'https://musicforpennies.se/api',
      },
    },
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="relative">
        <section className="noise relative aspect-[4/5] lg:aspect-[12/5]">
          <Image
            alt={news.name}
            src={urlFor(news.image).width(1920).height(700).url()}
            width={1920}
            height={700}
            className="absolute inset-0 object-cover w-full h-full"
            priority
          />
          <div className="absolute top-4 z-5 flex flex-col items-start gap-1 px-2 py-3 lg:px-5">
            <div className="bg-white text-black px-2 py-1 inline-block z-10">
              <span className="text-[--vividGreen]">■</span> {news.name}
            </div>
            <div className="bg-white text-black text-sm px-2 py-1 inline-block z-10">
              <p>
                {new Date(news.publishedAt).toLocaleDateString('sv-SE', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}
              </p>            
            </div>
          </div>
        </section>
        <section className="max-w-3xl mx-auto p-6 text-black">
          <h1 className="text-sans-35 lg:text-sans-60 font-600">{news.name}</h1>
          <div className="mt-6 prose overflow-hidden text-wrap">
            <PortableText value={news.details} />
          </div>
          <p className="mt-4 text-sm text-gray-500">
            Senast uppdaterad: {new Date(news.publishedAt).toLocaleDateString()}
          </p>
        </section>
      </section>
    </div>
  );
}
