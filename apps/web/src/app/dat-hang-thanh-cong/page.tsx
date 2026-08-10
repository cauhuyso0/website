import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Đặt hàng thành công",
};

type SearchParams = Promise<{ code?: string }>;

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const code = params.code ?? "—";

  return (
    <div className="container-page py-20 text-center">
      <p className="text-xs uppercase tracking-[0.2em] text-muted">Nestora</p>
      <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl text-brand">
        Đặt hàng thành công
      </h1>
      <p className="mx-auto mt-4 max-w-lg text-muted">
        Cảm ơn bạn đã tin tưởng Nestora. Mã đơn hàng của bạn là{" "}
        <strong className="text-brand">{code}</strong>. Chúng tôi sẽ liên hệ xác nhận sớm.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Button href="/san-pham">Tiếp tục mua sắm</Button>
        <Button href="/" variant="secondary">
          Về trang chủ
        </Button>
      </div>
    </div>
  );
}
