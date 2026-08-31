import Link from "next/link";
import { StrapiImage } from "@/components/ui/StrapiImage";
import type { CategoryHighlight } from "@/lib/strapi/types";

export function CategoryHighlights({ items }: { items: CategoryHighlight[] }) {
  if (!items.length) {
    return null;
  }

  return (
    <section className="container-page py-16">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted">Danh mục</p>
          <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-brand md:text-4xl">
            Chọn dòng yến phù hợp
          </h2>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group relative min-h-44 overflow-hidden bg-[linear-gradient(160deg,#3b2418,#8b6844)] p-6 text-surface transition hover:brightness-110"
          >
            <StrapiImage
              media={item.image}
              alt={item.title}
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,10,6,0.25)_0%,rgba(20,10,6,0.85)_100%)]" />
            <div className="relative z-10">
              <h3 className="font-[family-name:var(--font-display)] text-2xl text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]">
                {item.title}
              </h3>
              <p className="mt-3 text-sm text-white/90 drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)]">
                Xem sản phẩm →
              </p>
            </div>
            </Link>
        ))}
      </div>
    </section>
  );
}
