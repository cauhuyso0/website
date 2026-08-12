import Image from "next/image";
import { getMediaUrl } from "@/lib/strapi/media";
import type { StrapiMedia } from "@/lib/strapi/types";

type StrapiImageProps = {
  media?: StrapiMedia | StrapiMedia[] | null;
  alt: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  fallbackClassName?: string;
};

function resolveMedia(
  media?: StrapiMedia | StrapiMedia[] | null
): StrapiMedia | null {
  if (!media) {
    return null;
  }

  return Array.isArray(media) ? (media[0] ?? null) : media;
}

export function StrapiImage({
  media,
  alt,
  className,
  fill = true,
  width,
  height,
  sizes,
  priority,
  fallbackClassName,
}: StrapiImageProps) {
  const item = resolveMedia(media);
  const imageUrl = getMediaUrl(item);

  if (!imageUrl) {
    return fallbackClassName ? (
      <div className={fallbackClassName} aria-hidden />
    ) : null;
  }

  return (
    <Image
      src={imageUrl}
      alt={item?.alternativeText || alt}
      fill={fill}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      sizes={sizes}
      priority={priority}
      className={className}
    />
  );
}
