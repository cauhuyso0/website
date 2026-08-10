"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { formatVnd } from "@/lib/format";
import type { Product } from "@/lib/strapi/types";
import { useCartStore } from "@/store/cart";

type AddToCartPanelProps = {
  product: Product;
};

export function AddToCartPanel({ product }: AddToCartPanelProps) {
  const variants = useMemo(() => product.variants ?? [], [product.variants]);
  const [variantId, setVariantId] = useState(variants[0]?.documentId);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const addItem = useCartStore((state) => state.addItem);

  const selected = useMemo(
    () => variants.find((variant) => variant.documentId === variantId) ?? null,
    [variantId, variants]
  );

  const unitPrice = Number(selected?.price ?? product.price);

  const handleAdd = () => {
    addItem({
      productDocumentId: product.documentId,
      productSlug: product.slug,
      productName: product.name,
      variantDocumentId: selected?.documentId,
      variantName: selected?.name,
      sku: selected?.sku ?? undefined,
      unitPrice,
      quantity,
    });
    setMessage("Đã thêm vào giỏ hàng");
    window.setTimeout(() => setMessage(""), 2000);
  };

  return (
    <div className="space-y-5">
      {variants.length > 0 ? (
        <div>
          <p className="mb-2 text-sm uppercase tracking-[0.14em] text-muted">Tùy chọn</p>
          <div className="flex flex-wrap gap-2">
            {variants.map((variant) => (
              <button
                key={variant.documentId}
                type="button"
                onClick={() => setVariantId(variant.documentId)}
                className={`rounded-md border px-3 py-2 text-sm transition ${
                  variant.documentId === selected?.documentId
                    ? "border-brand bg-brand text-surface"
                    : "border-line bg-surface text-brand hover:border-accent"
                }`}
              >
                {variant.name}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <p className="font-[family-name:var(--font-display)] text-3xl text-brand">
        {formatVnd(unitPrice)}
      </p>

      <div className="flex items-center gap-3">
        <label className="text-sm text-muted" htmlFor="qty">
          Số lượng
        </label>
        <input
          id="qty"
          type="number"
          min={1}
          value={quantity}
          onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))}
          className="w-20 rounded-md border border-line bg-surface px-3 py-2"
        />
      </div>

      <Button type="button" onClick={handleAdd}>
        Thêm vào giỏ
      </Button>
      {message ? <p className="text-sm text-accent">{message}</p> : null}
    </div>
  );
}
