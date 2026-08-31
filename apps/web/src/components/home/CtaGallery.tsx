"use client";

import { useCallback, useState } from "react";
import { StrapiImage } from "@/components/ui/StrapiImage";
import type { GallerySlide } from "@/lib/strapi/types";

type CtaGalleryProps = {
  slides?: GallerySlide[] | null;
};

const FALLBACK_GRADIENTS = [
  "linear-gradient(135deg, #efe2cf 0%, #8d6b45 100%)",
  "linear-gradient(135deg, #d9c3a1 0%, #5a3a28 100%)",
  "linear-gradient(135deg, #f5ebe0 0%, #a67c52 100%)",
  "linear-gradient(135deg, #c4a574 0%, #3d2518 100%)",
] as const;

const VISIBLE_COUNT = 4;

function buildSlides(slides?: GallerySlide[] | null): GallerySlide[] {
  const fromCms = slides ?? [];

  if (fromCms.length >= VISIBLE_COUNT) {
    return fromCms;
  }

  const result: GallerySlide[] = [...fromCms];

  for (let index = fromCms.length; index < VISIBLE_COUNT; index += 1) {
    result.push({
      alt: `Tư vấn chọn yến ${index + 1}`,
    });
  }

  return result;
}

function NavButton({
  direction,
  onClick,
}: {
  direction: "prev" | "next";
  onClick: () => void;
}) {
  const label = direction === "prev" ? "Ảnh trước" : "Ảnh sau";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/85 text-brand shadow backdrop-blur transition hover:bg-white"
    >
      <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden>
        {direction === "prev" ? (
          <path
            d="M10 3L5 8l5 5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <path
            d="M6 3l5 5-5 5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
    </button>
  );
}

export function CtaGallery({ slides }: CtaGalleryProps) {
  const items = buildSlides(slides);
  const maxOffset = Math.max(0, items.length - VISIBLE_COUNT);
  const [offset, setOffset] = useState(0);

  const visibleItems = items.slice(offset, offset + VISIBLE_COUNT);
  const canNavigate = items.length > VISIBLE_COUNT;

  const goTo = useCallback(
    (nextOffset: number) => {
      setOffset(Math.max(0, Math.min(nextOffset, maxOffset)));
    },
    [maxOffset]
  );

  const prev = () => goTo(offset - 1);
  const next = () => goTo(offset + 1);

  return (
    <div className="container-page pb-14 pt-2">
      <div className="flex items-center gap-3 sm:gap-4">
        {canNavigate ? <NavButton direction="prev" onClick={prev} /> : null}

        <div className="grid min-w-0 flex-1 grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {visibleItems.map((slide, index) => {
            const slideIndex = offset + index;

            return (
              <div
                key={slide.id ?? slideIndex}
                className="relative aspect-[3/4] min-h-[200px] overflow-hidden rounded-lg bg-[linear-gradient(135deg,#efe2cf,#8d6b45)] sm:min-h-[240px] lg:min-h-[280px]"
              >
                {slide.image ? (
                  <StrapiImage
                    media={slide.image}
                    alt={slide.alt ?? `Tư vấn chọn yến ${slideIndex + 1}`}
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-contain object-center"
                    fallbackClassName="absolute inset-0"
                  />
                ) : (
                  <div
                    className="absolute inset-0"
                    style={{
                      background: FALLBACK_GRADIENTS[slideIndex % FALLBACK_GRADIENTS.length],
                    }}
                    aria-hidden
                  />
                )}
              </div>
            );
          })}
        </div>

        {canNavigate ? <NavButton direction="next" onClick={next} /> : null}
      </div>

      {canNavigate ? (
        <div className="mt-4 flex justify-center gap-1.5">
          {Array.from({ length: maxOffset + 1 }, (_, pageIndex) => (
            <button
              key={pageIndex}
              type="button"
              onClick={() => goTo(pageIndex)}
              aria-label={`Nhóm ảnh ${pageIndex + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                pageIndex === offset ? "w-7 bg-brand" : "w-3 bg-brand/30 hover:bg-brand/50"
              }`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
