import { getStrapiBaseUrl } from "@/lib/strapi/client";
import type { StrapiMedia } from "@/lib/strapi/types";

export function getFirstMediaUrl(
  media?: StrapiMedia[] | null
): string | null {
  return getMediaUrl(media?.[0]);
}

export function getMediaUrl(media?: StrapiMedia | null): string | null {
  if (!media?.url) {
    return null;
  }

  const baseUrl = getStrapiBaseUrl();

  if (media.url.startsWith("http")) {
    try {
      const parsed = new URL(media.url);
      if (parsed.pathname.startsWith("/uploads")) {
        return `${baseUrl}${parsed.pathname}`;
      }
      return media.url;
    } catch {
      return media.url;
    }
  }

  return `${baseUrl}${media.url}`;
}
