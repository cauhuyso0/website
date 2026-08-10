"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { formatVnd } from "@/lib/format";
import { checkoutSchema } from "@/schemas/forms";
import { useCartStore } from "@/store/cart";

export function CheckoutForm() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.subtotal);
  const clear = useCartStore((state) => state.clear);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <p className="text-muted">Đang tải...</p>;
  }

  if (items.length === 0) {
    return (
      <div className="space-y-4">
        <p className="text-muted">Giỏ hàng trống, chưa thể thanh toán.</p>
        <Button href="/san-pham">Chọn sản phẩm</Button>
      </div>
    );
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      const values = {
        customerName: String(formData.get("customerName") ?? ""),
        phone: String(formData.get("phone") ?? ""),
        email: String(formData.get("email") ?? ""),
        address: String(formData.get("address") ?? ""),
        city: String(formData.get("city") ?? ""),
        note: String(formData.get("note") ?? ""),
      };

      const parsed = checkoutSchema.parse(values);
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...parsed,
          items: items.map((item) => ({
            productName: item.productName,
            variantName: item.variantName,
            sku: item.sku,
            unitPrice: item.unitPrice,
            quantity: item.quantity,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Order failed");
      }

      const json = (await response.json()) as { data: { orderCode: string } };
      clear();
      router.push(`/dat-hang-thanh-cong?code=${encodeURIComponent(json.data.orderCode)}`);
    } catch {
      setError("Không thể tạo đơn hàng. Vui lòng kiểm tra thông tin và thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Họ tên" name="customerName" required />
          <Field label="Số điện thoại" name="phone" required />
        </div>
        <Field label="Email" name="email" type="email" />
        <Field label="Địa chỉ" name="address" required />
        <Field label="Tỉnh / Thành phố" name="city" required />
        <label className="block text-sm">
          <span className="mb-1.5 block text-muted">Ghi chú</span>
          <textarea
            name="note"
            rows={4}
            className="w-full rounded-md border border-line bg-surface px-3 py-2"
          />
        </label>
        <p className="text-sm text-muted">Phương thức thanh toán: COD (nhận hàng trả tiền)</p>
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        <Button type="submit" disabled={loading}>
          {loading ? "Đang đặt hàng..." : "Đặt hàng COD"}
        </Button>
      </form>
      <aside className="h-fit border border-line bg-surface/80 p-6">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-brand">Đơn hàng</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {items.map((item) => (
            <li key={item.key} className="flex justify-between gap-3">
              <span>
                {item.productName}
                {item.variantName ? ` (${item.variantName})` : ""} × {item.quantity}
              </span>
              <span>{formatVnd(item.unitPrice * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-5 flex justify-between border-t border-line pt-4 font-medium">
          <span>Tổng</span>
          <span>{formatVnd(subtotal())}</span>
        </p>
      </aside>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block text-muted">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full rounded-md border border-line bg-surface px-3 py-2"
      />
    </label>
  );
}
