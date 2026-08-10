import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Không tìm thấy",
};

export default function NotFound() {
  return (
    <div className="container-page py-20 text-center">
      <h1 className="font-[family-name:var(--font-display)] text-4xl text-brand">404</h1>
      <p className="mt-3 text-muted">Trang bạn tìm không tồn tại.</p>
      <Link href="/" className="mt-6 inline-block text-brand underline">
        Về trang chủ
      </Link>
    </div>
  );
}
