import { getStrapiBaseUrl } from "@/lib/strapi/client";
import type { StrapiMedia } from "@/lib/strapi/types";

export function getMediaUrl(media?: StrapiMedia | null): string | null {
  if (!media?.url) {
    return null;
  }

  if (media.url.startsWith("http")) {
    return media.url;
  }

  return `${getStrapiBaseUrl()}${media.url}`;
}
