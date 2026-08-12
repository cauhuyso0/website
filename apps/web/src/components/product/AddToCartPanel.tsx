"use client";

import { useMemo, useState } from "react";
import { ProductCustomization } from "@/components/product/ProductCustomization";
import { Button } from "@/components/ui/Button";
import { formatVnd } from "@/lib/format";
import {
  buildCustomizationKey,
  formatCustomizationLabel,
  getDefaultCustomizationValue,
  getFlavorPriceAddon,
  resolveFlavorOptions,
  resolveSweetnessOptions,
  type ProductCustomizationValue,
} from "@/lib/product-customization";
import { getFirstMediaUrl } from "@/lib/strapi/media";
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

  const flavorOptions = useMemo(() => resolveFlavorOptions(product), [product]);
  const sweetnessOptions = useMemo(
    () => resolveSweetnessOptions(product),
    [product]
  );
  const showCustomization = flavorOptions.length > 0 || sweetnessOptions.length > 0;

  const [customization, setCustomization] = useState<ProductCustomizationValue>(() =>
    getDefaultCustomizationValue(product)
  );

  const selected = useMemo(
    () => variants.find((variant) => variant.documentId === variantId) ?? null,
    [variantId, variants]
  );

  const flavorAddon = showCustomization
    ? getFlavorPriceAddon(product, customization.flavor)
    : 0;
  const unitPrice = Number(selected?.price ?? product.price) + flavorAddon;

  const handleAdd = () => {
    if (showCustomization && !customization.flavor) {
      setMessage("Vui lòng chọn vị");
      window.setTimeout(() => setMessage(""), 2000);
      return;
    }

    if (showCustomization && sweetnessOptions.length > 0 && !customization.sweetness) {
      setMessage("Vui lòng chọn độ ngọt");
      window.setTimeout(() => setMessage(""), 2000);
      return;
    }

    const customizationNote = showCustomization
      ? formatCustomizationLabel(customization)
      : undefined;

    addItem({
      productDocumentId: product.documentId,
      productSlug: product.slug,
      productName: product.name,
      variantDocumentId: selected?.documentId,
      variantName: selected?.name,
      sku: selected?.sku ?? undefined,
      unitPrice,
      quantity,
      imageUrl: getFirstMediaUrl(product.images),
      customizationKey: showCustomization
        ? buildCustomizationKey(customization)
        : undefined,
      customizationNote,
    });
    setMessage("Đã thêm vào giỏ hàng");
    window.setTimeout(() => setMessage(""), 2000);
  };

  return (
    <div className="space-y-5">
      {variants.length > 0 ? (
        <div>
          <p className="mb-2 text-sm uppercase tracking-[0.14em] text-muted">Dung tích</p>
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

      {showCustomization ? (
        <ProductCustomization
          flavorOptions={flavorOptions}
          sweetnessOptions={sweetnessOptions}
          value={customization}
          onChange={setCustomization}
        />
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
