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
  const FORENINGER_QUERY = `*[_type == "forening" && defined(URL.current)]{URL}`;
  const EDITS_QUERY = `*[_type == "edits" && defined(slug.current)]{slug}`;
  const EVENTS_QUERY = `*[_type == "event" && defined(slug.current)]{slug}`;

  const [foreninger, edits, events] = await Promise.all([
    client.fetch<{ URL: { current: string } }[]>(FORENINGER_QUERY),
    client.fetch<{ slug: { current: string } }[]>(EDITS_QUERY),
    client.fetch<{ slug: { current: string } }[]>(EVENTS_QUERY),
  ]);

  // Convert Sanity data to sitemap format
  const foreningarRoutes = foreninger.map(({ URL }) => ({
    url: `https://musicforpennies.se/om-oss/vara-foreningar/${URL.current}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const editsRoutes = edits.map(({ slug }) => ({
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

  return [...foreningarRoutes, ...editsRoutes, ...eventRoutes];
}

// ✅ Generate sitemap dynamically
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const dynamicRoutes = await fetchDynamicRoutes();
  return [...staticPages, ...dynamicRoutes];
}
