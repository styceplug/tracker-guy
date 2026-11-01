import type { MetadataRoute } from "next";
import { defaultContent } from "@/lib/content";

const site = defaultContent.business;

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: site.url, changeFrequency: "monthly", priority: 1 }];
}
