import Image from "next/image";
import Link from "next/link";
import { getMediaUrl } from "@/lib/strapi/media";
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
        {items.map((item) => {
          const imageUrl = getMediaUrl(item.image);

          return (
            <Link
              key={item.href}
              href={item.href}
              className="group relative min-h-44 overflow-hidden bg-[linear-gradient(160deg,#3b2418,#8b6844)] p-6 text-surface transition hover:brightness-110"
            >
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={item.image?.alternativeText || item.title}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
              ) : null}
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,10,6,0.15)_0%,rgba(20,10,6,0.72)_100%)]" />
              <div className="relative z-10">
                <h3 className="font-[family-name:var(--font-display)] text-2xl">{item.title}</h3>
                <p className="mt-3 text-sm text-accent-soft">Xem sản phẩm →</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
