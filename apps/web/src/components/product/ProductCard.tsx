import Link from "next/link";
import { StrapiImage } from "@/components/ui/StrapiImage";
import { formatPriceRange, formatVnd } from "@/lib/format";
import { getFirstMediaUrl } from "@/lib/strapi/media";
import type { Product } from "@/lib/strapi/types";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const prices = (product.variants ?? []).map((variant) => Number(variant.price));
  const min = prices.length ? Math.min(...prices, Number(product.price)) : Number(product.price);
  const max = prices.length ? Math.max(...prices, Number(product.price)) : Number(product.price);
  const hasSale =
    product.compareAtPrice != null && Number(product.compareAtPrice) > Number(product.price);
  const hasImage = Boolean(getFirstMediaUrl(product.images));

  return (
    <Link
      href={`/san-pham/${product.slug}`}
      className="group block border-b border-line pb-6 transition hover:-translate-y-1"
    >
      <div className="relative mb-4 aspect-[4/5] overflow-hidden bg-[linear-gradient(145deg,#efe2cf,#d7c0a0_45%,#8d6b45)]">
        <StrapiImage
          media={product.images}
          alt={product.name}
          sizes="(max-width: 768px) 50vw, 25vw"
          className="relative z-0 object-cover transition duration-700 group-hover:scale-105"
          fallbackClassName="absolute inset-0 z-0 bg-[linear-gradient(145deg,#efe2cf,#d7c0a0_45%,#8d6b45)]"
        />
        {!hasImage ? (
          <div className="absolute inset-0 z-10 opacity-40 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_45%)]" />
        ) : null}
        {hasSale ? (
          <span className="absolute left-3 top-3 z-20 rounded-sm bg-brand px-2 py-1 text-xs text-surface">
            Giảm giá
          </span>
        ) : null}
      </div>
      <h3 className="font-[family-name:var(--font-display)] text-xl text-brand">{product.name}</h3>
      <p className="mt-2 line-clamp-2 text-sm text-muted">{product.shortDescription}</p>
      <p className="mt-3 text-sm font-medium text-brand">
        {prices.length > 1 ? formatPriceRange(min, max) : formatVnd(min)}
      </p>
    </Link>
  );
}
