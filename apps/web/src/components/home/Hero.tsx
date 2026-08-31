"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { StrapiImage } from "@/components/ui/StrapiImage";
import type { HeroSlide } from "@/lib/strapi/types";

type HeroProps = {
  slides?: HeroSlide[] | null;
  brandName: string;
};

const AUTOPLAY_MS = 5000;

export function Hero({ slides, brandName }: HeroProps) {
  const items = slides?.length ? slides : [null];
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (items.length <= 1) return;
    timerRef.current = setTimeout(() => {
      setActive((prev) => (prev + 1) % items.length);
    }, AUTOPLAY_MS);
  }, [items.length]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [active, resetTimer]);

  const goTo = (index: number) => {
    setActive(index);
  };

  const slide = items[active];
  const title = slide?.title || brandName;
  const subtitle =
    slide?.subtitle || "Yến sào tuyển chọn – bồi bổ tinh tế mỗi ngày.";
  const ctaLabel = slide?.ctaLabel || "Khám phá sản phẩm";
  const ctaHref = slide?.ctaHref || "/san-pham";

  return (
    <section className="relative min-h-[58vh] overflow-hidden bg-brand text-surface sm:min-h-[68vh] lg:min-h-[78vh]">
      {items.map((item, index) => (
        <div
          key={item?.title ?? index}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === active ? "opacity-100" : "opacity-0"
          }`}
        >
          {item?.image ? (
            <StrapiImage
              media={item.image}
              alt={item.title}
              priority={index === 0}
              sizes="100vw"
              className="object-cover object-center sm:object-[center_35%]"
              fallbackClassName="absolute inset-0 bg-[linear-gradient(120deg,#2a170f_0%,#5a3a28_42%,#b08a4f_100%)]"
            />
          ) : (
            <div className="absolute inset-0 bg-[linear-gradient(120deg,#2a170f_0%,#5a3a28_42%,#b08a4f_100%)]" />
          )}
        </div>
      ))}

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,10,6,0.15)_0%,rgba(20,10,6,0.55)_55%,rgba(20,10,6,0.82)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.12),transparent_35%)]" />

      <div className="container-page relative flex min-h-[58vh] flex-col justify-end pb-10 pt-24 sm:min-h-[68vh] sm:pb-14 sm:pt-28 lg:min-h-[78vh] lg:pb-16">
        <p className="animate-rise text-[0.6rem] uppercase tracking-[0.2em] text-accent-soft sm:text-[0.65rem] sm:tracking-[0.24em]">
          Thương hiệu yến sào
        </p>
        <h1 className="animate-rise-delay mt-3 max-w-3xl text-balance font-[family-name:var(--font-display)] text-[3rem] leading-[1.1] sm:mt-4">
          {title}
        </h1>
        <p className="animate-rise-delay mt-4 max-w-xl text-pretty text-xs leading-relaxed text-accent-soft sm:mt-5 sm:text-sm md:text-base">
          {subtitle}
        </p>
        <div className="animate-rise-delay mt-6 flex items-center gap-4 sm:mt-8">
          <Button
            href={ctaHref}
            variant="primary"
            className="w-full sm:w-auto"
          >
            {ctaLabel}
          </Button>
        </div>

        {items.length > 1 ? (
          <div className="mt-6 flex gap-2">
            {items.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => goTo(index)}
                aria-label={`Slide ${index + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === active
                    ? "w-8 bg-surface"
                    : "w-4 bg-surface/40 hover:bg-surface/60"
                }`}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
