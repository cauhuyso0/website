import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export const metadata: Metadata = {
  title: "Thanh toán COD",
};

export default function CheckoutPage() {
  return (
    <div className="container-page py-12">
      <h1 className="mb-3 font-[family-name:var(--font-display)] text-4xl text-brand">
        Thanh toán COD
      </h1>
      <p className="mb-8 text-muted">
        Điền thông tin nhận hàng. Nestora sẽ liên hệ xác nhận và giao COD.
      </p>
      <CheckoutForm />
    </div>
  );
}
