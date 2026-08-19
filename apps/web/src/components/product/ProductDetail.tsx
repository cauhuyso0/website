"use client";

import { useState } from "react";
import { AddToCartPanel } from "@/components/product/AddToCartPanel";
import { ProductGallery } from "@/components/product/ProductGallery";
import type { Product } from "@/lib/strapi/types";

type ProductDetailProps = {
  product: Product;
};

export function ProductDetail({ product }: ProductDetailProps) {
  const images = product.images ?? [];
  const [galleryIndex, setGalleryIndex] = useState(0);

  return (
    <div className="container-page grid gap-10 py-12 lg:grid-cols-2">
      <ProductGallery
        images={images}
        alt={product.name}
        activeIndex={galleryIndex}
      />
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-muted">
          {product.category?.name ?? "Sản phẩm"}
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl text-brand">
          {product.name}
        </h1>
        <p className="mt-4 text-muted">{product.shortDescription}</p>
        <div className="mt-8">
          <AddToCartPanel
            product={product}
            onFlavorChange={(flavorLabel, flavorIndex) => {
              const normalizedFlavor = flavorLabel.trim().toLowerCase();
              const byAltIndex = images.findIndex((img) => {
                const alt = (img.alternativeText ?? "").trim().toLowerCase();
                if (!alt) return false;
                return alt === normalizedFlavor || alt.includes(normalizedFlavor) || normalizedFlavor.includes(alt);
              });

              if (byAltIndex >= 0) {
                setGalleryIndex(byAltIndex);
                return;
              }

              if (images.length > 0) {
                const clamped = Math.max(0, Math.min(flavorIndex, images.length - 1));
                setGalleryIndex(clamped);
              }
            }}
          />
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
