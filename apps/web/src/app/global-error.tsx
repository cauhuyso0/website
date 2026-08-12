"use client";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ reset }: GlobalErrorProps) {
  return (
    <html lang="vi">
      <body className="bg-[#f7f3ec] text-[#1f140e] antialiased">
        <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-6 text-center">
          <h1 className="text-3xl font-semibold">Đã xảy ra lỗi</h1>
          <p className="mt-3 text-sm opacity-80">
            Hệ thống gặp sự cố. Vui lòng tải lại trang.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-6 rounded-md bg-[#3b2418] px-5 py-2.5 text-sm text-white"
          >
            Thử lại
          </button>
        </div>
      </body>
    </html>
  );
}
