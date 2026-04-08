import { client } from "@/sanity/client";
import { MetadataRoute } from "next";

// ✅ Define static pages manually
const staticPages = [
  { path: "", priority: 1, changefreq: 'daily' as const },
  { path: "om-oss", priority: 0.9, changefreq: 'weekly' as const },
  { path: "om-oss/kontakta-oss", priority: 0.8, changefreq: 'monthly' as const },
  { path: "arrangemang", priority: 0.9, changefreq: 'daily' as const },
  { path: "event", priority: 0.9, changefreq: 'daily' as const },
  { path: "edits", priority: 0.8, changefreq: 'weekly' as const },
  { path: "repan", priority: 0.7, changefreq: 'monthly' as const },
].map((page) => ({
  url: `https://musicforpennies.se/${page.path}`,
  lastModified: new Date(),
  changeFrequency: page.changefreq,
  priority: page.priority,
}));

// ✅ Fetch dynamic pages from Sanity
async function fetchDynamicRoutes() {
  const ARTISTS_QUERY = `*[_type == "artist" && defined(slug.current)]{slug}`;
  const NEWS_QUERY = `*[_type == "news" && defined(slug.current)]{slug}`;
  const EVENTS_QUERY = `*[_type == "event" && defined(slug.current)]{slug}`;

  const [artists, news, events] = await Promise.all([
    client.fetch<{ slug: { current: string } }[]>(ARTISTS_QUERY),
    client.fetch<{ slug: { current: string } }[]>(NEWS_QUERY),
    client.fetch<{ slug: { current: string } }[]>(EVENTS_QUERY),
  ]);

  // Convert Sanity data to sitemap format
  const artistRoutes = artists.map(({ slug }) => ({
    url: `https://musicforpennies.se/forening/${slug.current}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const newsRoutes = news.map(({ slug }) => ({
    url: `https://musicforpennies.se/edits/${slug.current}`,
    lastModified: new Date(),
    changeFrequency: 'never' as const,
    priority: 0.6,
  }));

  const eventRoutes = events.map(({ slug }) => ({
    url: `https://musicforpennies.se/event/${slug.current}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...artistRoutes, ...newsRoutes, ...eventRoutes];
}

// ✅ Generate sitemap dynamically
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const dynamicRoutes = await fetchDynamicRoutes();
  return [...staticPages, ...dynamicRoutes];
}
