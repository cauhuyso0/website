import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import { findCategories, findProducts } from "@/repositories/product.repository";

export const metadata: Metadata = {
  title: "Sản phẩm",
};

type SearchParams = Promise<{ page?: string; category?: string }>;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const categorySlug = params.category;
  const [products, categories] = await Promise.all([
    findProducts({ page, pageSize: 12, categorySlug }),
    findCategories(),
  ]);

  const pagination = products.meta?.pagination;

  return (
    <div className="container-page py-12">
      <h1 className="font-[family-name:var(--font-display)] text-4xl text-brand">Sản phẩm</h1>
      <p className="mt-3 max-w-2xl text-muted">
        Khám phá tổ yến, yến chưng và set quà Yến Sào Hiếu Hiền.
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        <Link
          href="/san-pham"
          className={`rounded-md border px-3 py-1.5 text-sm ${
            !categorySlug ? "border-brand bg-brand text-surface" : "border-line"
          }`}
        >
          Tất cả
        </Link>
        {categories.map((category) => (
          <Link
            key={category.documentId}
            href={`/san-pham?category=${category.slug}`}
            className={`rounded-md border px-3 py-1.5 text-sm ${
              categorySlug === category.slug
                ? "border-brand bg-brand text-surface"
                : "border-line"
            }`}
          >
            {category.name}
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {products.data.map((product) => (
          <ProductCard key={product.documentId} product={product} />
        ))}
      </div>

      {products.data.length === 0 ? (
        <p className="mt-8 text-muted">Chưa có sản phẩm phù hợp.</p>
      ) : null}

      {pagination && pagination.pageCount > 1 ? (
        <div className="mt-10 flex gap-3">
          {Array.from({ length: pagination.pageCount }).map((_, index) => {
            const pageNumber = index + 1;
            const query = new URLSearchParams();
            query.set("page", String(pageNumber));
            if (categorySlug) {
              query.set("category", categorySlug);
            }
            return (
              <Link
                key={pageNumber}
                href={`/san-pham?${query.toString()}`}
                className={`rounded-md border px-3 py-1.5 text-sm ${
                  pageNumber === pagination.page
                    ? "border-brand bg-brand text-surface"
                    : "border-line"
                }`}
              >
                {pageNumber}
              </Link>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
