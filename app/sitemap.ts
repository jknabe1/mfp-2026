import { client } from "@/sanity/client";
import { MetadataRoute } from "next";

// ✅ Define static pages manually
const staticPages = [
  "",
  "om-oss",
  "kontakta-oss",
  "backstage",
  "artists",
  "events",
  "edits",
].map((path) => ({
  url: `https://musicforpennies.se/${path}`,
  lastModified: new Date().toISOString(),
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
    url: `https://musicforpennies.se/artists/${slug.current}`,
    lastModified: new Date().toISOString(),
  }));

  const newsRoutes = news.map(({ slug }) => ({
    url: `https://musicforpennies.se/edits/${slug.current}`,
    lastModified: new Date().toISOString(),
  }));

  const eventRoutes = events.map(({ slug }) => ({
    url: `https://musicforpennies.se/event/${slug.current}`,
    lastModified: new Date().toISOString(),
  }));

  return [...artistRoutes, ...newsRoutes, ...eventRoutes];
}

// ✅ Generate sitemap dynamically
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const dynamicRoutes = await fetchDynamicRoutes();
  return [...staticPages, ...dynamicRoutes];
}
