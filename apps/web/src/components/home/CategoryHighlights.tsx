import Link from "next/link";
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
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.2),transparent_40%)] transition duration-700 group-hover:scale-110" />
            <h3 className="relative font-[family-name:var(--font-display)] text-2xl">{item.title}</h3>
            <p className="relative mt-3 text-sm text-accent-soft">Xem sản phẩm →</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
