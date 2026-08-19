"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { getMediaUrl } from "@/lib/strapi/media";
import type { StrapiMedia } from "@/lib/strapi/types";

type ProductGalleryProps = {
  images: StrapiMedia[];
  alt: string;
  activeIndex?: number;
};

export function ProductGallery({ images, alt, activeIndex }: ProductGalleryProps) {
  const [current, setCurrent] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const safeIndex = useCallback(
    (i: number) => Math.max(0, Math.min(i, images.length - 1)),
    [images.length]
  );

  useEffect(() => {
    if (activeIndex !== undefined && activeIndex >= 0 && activeIndex < images.length) {
      setCurrent(activeIndex);
    }
  }, [activeIndex, images.length]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const firstChild = track.children[0] as HTMLElement | undefined;
    const slideWidth = (firstChild?.offsetWidth ?? 0) || track.clientWidth;
    track.scrollTo({ left: slideWidth * current, behavior: "smooth" });
  }, [current]);

  const goTo = (index: number) => setCurrent(safeIndex(index));
  const prev = () => goTo(current - 1);
  const next = () => goTo(current + 1);

  if (images.length === 0) {
    return (
      <div className="aspect-[4/5] bg-[linear-gradient(145deg,#efe2cf,#8d6b45)]" />
    );
  }

  if (images.length === 1) {
    const url = getMediaUrl(images[0]);
    if (!url) return <div className="aspect-[4/5] bg-[linear-gradient(145deg,#efe2cf,#8d6b45)]" />;
    return (
      <div className="relative aspect-[4/5] overflow-hidden bg-[linear-gradient(145deg,#efe2cf,#8d6b45)]">
        <Image src={url} alt={images[0].alternativeText || alt} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-[4/5] overflow-hidden bg-[linear-gradient(145deg,#efe2cf,#8d6b45)]">
        <div
          ref={trackRef}
          className="flex h-full snap-x snap-mandatory overflow-x-auto hide-scrollbar"
        >
          {images.map((img, index) => {
            const url = getMediaUrl(img);
            if (!url) return null;
            return (
              <div key={img.id ?? index} className="relative h-full w-full flex-shrink-0 snap-center">
                <Image
                  src={url}
                  alt={img.alternativeText || `${alt} ${index + 1}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority={index === 0}
                />
              </div>
            );
          })}
        </div>

        {current > 0 ? (
          <button
            type="button"
            onClick={prev}
            aria-label="Ảnh trước"
            className="absolute left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-brand shadow backdrop-blur transition hover:bg-white"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        ) : null}

        {current < images.length - 1 ? (
          <button
            type="button"
            onClick={next}
            aria-label="Ảnh sau"
            className="absolute right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-brand shadow backdrop-blur transition hover:bg-white"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        ) : null}

        <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
          {images.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => goTo(index)}
              aria-label={`Ảnh ${index + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === current
                  ? "w-6 bg-white"
                  : "w-3 bg-white/50 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="hide-scrollbar flex w-full max-w-full gap-2 overflow-x-hidden pb-1">
        {images.map((img, index) => {
          const url = getMediaUrl(img);
          if (!url) return null;
          return (
            <button
              key={img.id ?? index}
              type="button"
              onClick={() => goTo(index)}
              className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border-2 transition ${
                index === current
                  ? "border-brand"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={url}
                alt={img.alternativeText || `${alt} thumb ${index + 1}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
