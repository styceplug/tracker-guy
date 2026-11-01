import type { MetadataRoute } from "next";
import { defaultContent } from "@/lib/content";

const site = defaultContent.business;

export const dynamic = "force-static";

const aiBots = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "PerplexityBot", "Google-Extended", "Applebot-Extended"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin", "/form"] },
      ...aiBots.map((userAgent) => ({ userAgent, allow: "/", disallow: ["/admin", "/form"] })),
    ],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
