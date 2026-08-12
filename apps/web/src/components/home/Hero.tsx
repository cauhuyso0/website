import { Button } from "@/components/ui/Button";
import { StrapiImage } from "@/components/ui/StrapiImage";
import type { HeroSlide } from "@/lib/strapi/types";

type HeroProps = {
  slide?: HeroSlide | null;
  brandName: string;
};

export function Hero({ slide, brandName }: HeroProps) {
  const title = slide?.title || brandName;
  const subtitle =
    slide?.subtitle || "Yến sào tuyển chọn – bồi bổ tinh tế mỗi ngày.";
  const ctaLabel = slide?.ctaLabel || "Khám phá sản phẩm";
  const ctaHref = slide?.ctaHref || "/san-pham";

  return (
    <section className="relative min-h-[78vh] overflow-hidden bg-brand text-surface">
      {slide?.image ? (
        <div className="animate-hero-media absolute inset-0">
          <StrapiImage
            media={slide.image}
            alt={title}
            priority
            sizes="100vw"
            className="object-cover"
            fallbackClassName="absolute inset-0 bg-[linear-gradient(120deg,#2a170f_0%,#5a3a28_42%,#b08a4f_100%)]"
          />
        </div>
      ) : (
        <div className="animate-hero-media absolute inset-0 bg-[linear-gradient(120deg,#2a170f_0%,#5a3a28_42%,#b08a4f_100%)]" />
      )}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.18),transparent_35%)]" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'none\\' fill-rule=\\'evenodd\\'%3E%3Cg fill=\\'%23ffffff\\' fill-opacity=\\'0.05\\'%3E%3Cpath d=\\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40" />
      <div className="container-page relative flex min-h-[78vh] flex-col justify-end pb-16 pt-28">
        <p className="animate-rise text-xs uppercase tracking-[0.28em] text-accent-soft">
          Thương hiệu yến sào
        </p>
        <h1 className="animate-rise-delay mt-4 max-w-3xl font-[family-name:var(--font-display)] text-5xl leading-tight md:text-7xl">
          {title}
        </h1>
        <p className="animate-rise-delay mt-5 max-w-xl text-base text-accent-soft md:text-lg">
          {subtitle}
        </p>
        <div className="animate-rise-delay mt-8">
          <Button href={ctaHref} className="bg-surface text-brand hover:bg-accent-soft">
            {ctaLabel}
          </Button>
        </div>
      </div>
    </section>
  );
}
