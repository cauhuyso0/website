import type { Commitment } from "@/lib/strapi/types";

export function Commitments({ items }: { items: Commitment[] }) {
  if (!items.length) {
    return null;
  }

  return (
    <section className="border-b border-line bg-surface/70">
      <div className="container-page grid gap-8 py-10 md:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item.title} className="animate-rise">
            <h3 className="text-sm uppercase tracking-[0.16em] text-brand">{item.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
