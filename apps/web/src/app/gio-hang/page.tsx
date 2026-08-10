import type { Metadata } from "next";
import { CartView } from "@/components/cart/CartView";

export const metadata: Metadata = {
  title: "Giỏ hàng",
};

export default function CartPage() {
  return (
    <div className="container-page py-12">
      <h1 className="mb-8 font-[family-name:var(--font-display)] text-4xl text-brand">
        Giỏ hàng
      </h1>
      <CartView />
    </div>
  );
}
