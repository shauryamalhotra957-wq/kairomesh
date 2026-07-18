import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return ["", "/console", "/architecture", "/providers", "/blueprint"].map((path, index) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date("2026-07-17T00:00:00.000Z"),
    changeFrequency: index === 0 ? "weekly" : "monthly",
    priority: index === 0 ? 1 : index === 1 ? 0.9 : 0.7,
  }));
}
