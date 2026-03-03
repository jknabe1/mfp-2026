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
    *[_type == "about" && slug.current == '${slug}'] {
        "currentSlug": slug.current,
          name,
          details,
          image,
          excerpt,
          publishedAt,
          date,
      }[0]`;
  const about = await client.fetch(query);
  return about;
}

export async function generateMetadata({ params }) {
  const about = await getData(params.slug);

  if (!about) {
    return {
      title: 'About Not Found - Music For Pennies',
      description: 'The requested about page could not be found.',
    };
  }

  return {
    title: `${about.name}`,
    description: about.excerpt || 'Read the latest about and updates.',
    openGraph: {
      title: `${about.name} - Music For Pennies`,
      description: about.excerpt || 'Read the latest about and updates.',
      images: about.image ? [{ url: urlFor(about.image).url() }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${about.name} - Music For Pennies`,
      description: about.excerpt || 'Read the latest about and updates.',
      images: about.image ? [{ url: urlFor(about.image).url() }] : [],
    },
  };
}

export default async function BlogArticle({ params }) {
  const about = await getData(params.slug);

  if (!about) {
    return <div>About page not found</div>;
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    headline: about.name,
    description: about.excerpt || '',
    datePublished: about.publishedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://musicforpennies.se/om-oss/${about.currentSlug}`,
    },
    image: about.image ? urlFor(about.image).url() : undefined,
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
            alt={about.name}
            src={urlFor(about.image).width(1920).height(700).url()}
            width={1920}
            height={700}
            className="absolute inset-0 object-cover w-full h-full"
            priority
          />
          <div className="absolute top-4 z-5 flex flex-col items-start gap-1 px-2 py-3 lg:px-5">
            <div className="bg-white text-black px-2 py-1 inline-block z-10">
              <span className="text-[--vividGreen]">■</span> {about.name}
            </div>
            <div className="bg-white text-black text-sm px-2 py-1 inline-block z-10">
              <p>
                {new Date(about.publishedAt).toLocaleDateString('sv-SE', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}
              </p>                 
            </div>
          </div>
        </section>
        <section className="max-w-3xl mx-auto p-6 text-black">
          <h1 className="text-sans-35 lg:text-sans-60 font-600">{about.name}</h1>
          <div className="mt-6 prose">
            <PortableText value={about.details} />
          </div>
          <p className="mt-4 text-sm text-gray-500">
            Senast uppdaterad: {new Date(about.publishedAt).toLocaleDateString('sv-SE', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}
          </p>
        </section>
      </section>
    </div>
  );
}