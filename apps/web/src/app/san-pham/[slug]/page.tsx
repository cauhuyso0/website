import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AddToCartPanel } from "@/components/product/AddToCartPanel";
import { StrapiImage } from "@/components/ui/StrapiImage";
import { findProductBySlug } from "@/repositories/product.repository";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await findProductBySlug(slug);
  if (!product) {
    return { title: "Không tìm thấy sản phẩm" };
  }
  return {
    title: product.seoTitle || product.name,
    description: product.seoDescription || product.shortDescription || undefined,
  };
}

export default async function ProductDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await findProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="container-page grid gap-10 py-12 lg:grid-cols-2">
      <div className="relative aspect-[4/5] overflow-hidden bg-[linear-gradient(145deg,#efe2cf,#8d6b45)]">
        <StrapiImage
          media={product.images}
          alt={product.name}
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
          fallbackClassName="absolute inset-0 bg-[linear-gradient(145deg,#efe2cf,#8d6b45)]"
        />
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-muted">
          {product.category?.name ?? "Sản phẩm"}
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl text-brand">
          {product.name}
        </h1>
        <p className="mt-4 text-muted">{product.shortDescription}</p>
        <div className="mt-8">
          <AddToCartPanel product={product} />
        </div>
        {product.description ? (
          <div
            className="prose-nestora mt-10 border-t border-line pt-8"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        ) : null}
      </div>
    </div>
  );
}
