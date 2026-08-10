import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product/ProductCard";
import { findCategoryBySlug, findProducts } from "@/repositories/product.repository";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await findCategoryBySlug(slug);
  return { title: category?.name ?? "Danh mục" };
}

export default async function CategoryPage({ params }: { params: Params }) {
  const { slug } = await params;
  const category = await findCategoryBySlug(slug);
  if (!category) {
    notFound();
  }

  const products = await findProducts({ categorySlug: slug, pageSize: 24 });

  return (
    <div className="container-page py-12">
      <h1 className="font-[family-name:var(--font-display)] text-4xl text-brand">
        {category.name}
      </h1>
      {category.description ? (
        <p className="mt-3 max-w-2xl text-muted">{category.description}</p>
      ) : null}
      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {products.data.map((product) => (
          <ProductCard key={product.documentId} product={product} />
        ))}
      </div>
    </div>
  );
}
