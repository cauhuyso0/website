"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-page py-20 text-center">
      <h1 className="font-[family-name:var(--font-display)] text-4xl text-brand">
        Đã xảy ra lỗi
      </h1>
      <p className="mt-3 text-muted">Trang tạm thời không tải được. Vui lòng thử lại.</p>
      <div className="mt-6 flex justify-center gap-3">
        <Button type="button" onClick={reset}>
          Thử lại
        </Button>
        <Button href="/" variant="secondary">
          Về trang chủ
        </Button>
      </div>
    </div>
  );
}
