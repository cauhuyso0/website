"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { formatVnd } from "@/lib/format";
import { useCartStore } from "@/store/cart";

export function CartView() {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const subtotal = useCartStore((state) => state.subtotal);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <p className="text-muted">Đang tải giỏ hàng...</p>;
  }

  if (items.length === 0) {
    return (
      <div className="space-y-4">
        <p className="text-muted">Giỏ hàng đang trống.</p>
        <Button href="/san-pham">Tiếp tục mua sắm</Button>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1.4fr_0.8fr]">
      <div className="space-y-6">
        {items.map((item) => (
          <div key={item.key} className="flex flex-col gap-3 border-b border-line pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-[linear-gradient(145deg,#efe2cf,#8d6b45)]">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.productName}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                ) : null}
              </div>
              <div>
              <Link href={`/san-pham/${item.productSlug}`} className="font-[family-name:var(--font-display)] text-xl text-brand">
                {item.productName}
              </Link>
              {item.variantName ? (
                <p className="mt-1 text-sm text-muted">{item.variantName}</p>
              ) : null}
              {item.customizationNote ? (
                <p className="mt-1 text-sm text-muted">{item.customizationNote}</p>
              ) : null}
              <p className="mt-2 text-sm">{formatVnd(item.unitPrice)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={1}
                value={item.quantity}
                onChange={(event) =>
                  updateQuantity(item.key, Math.max(1, Number(event.target.value) || 1))
                }
                className="w-20 rounded-md border border-line bg-surface px-3 py-2"
              />
              <button
                type="button"
                onClick={() => removeItem(item.key)}
                className="text-sm text-muted hover:text-brand"
              >
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>
      <aside className="h-fit border border-line bg-surface/80 p-6">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-brand">Tóm tắt</h2>
        <p className="mt-4 flex justify-between text-sm">
          <span>Tạm tính</span>
          <span>{formatVnd(subtotal())}</span>
        </p>
        <p className="mt-2 flex justify-between text-sm text-muted">
          <span>Thanh toán</span>
          <span>COD</span>
        </p>
        <div className="mt-6">
          <Button href="/thanh-toan" className="w-full">
            Tiến hành đặt hàng
          </Button>
        </div>
      </aside>
    </div>
  );
}
