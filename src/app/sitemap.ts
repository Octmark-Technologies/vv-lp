import type { MetadataRoute } from "next";

// Only LP1 is indexable; LP2–LP4 are noindex test variants.
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: "https://skyvue.vaishnoventures.com/570-homes/", changeFrequency: "weekly", priority: 1 }];
}
