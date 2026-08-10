"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cart";

type HeaderProps = {
  brandName: string;
  tagline?: string | null;
  hotline: string;
  businessHours?: string | null;
};

const nav = [
  { href: "/", label: "Trang chủ" },
  { href: "/gioi-thieu", label: "Giới thiệu" },
  { href: "/san-pham", label: "Sản phẩm" },
  { href: "/cam-nang", label: "Cẩm nang" },
  { href: "/bai-viet", label: "Bài viết" },
  { href: "/lien-he", label: "Liên hệ" },
];

export function Header({ brandName, tagline, hotline, businessHours }: HeaderProps) {
  const totalItems = useCartStore((state) => state.totalItems);
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(totalItems());
  }, [totalItems]);

  useEffect(() => {
    return useCartStore.subscribe(() => {
      setCount(useCartStore.getState().totalItems());
    });
  }, []);

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md">
      <div className="bg-brand text-surface">
        <div className="container-page flex flex-wrap items-center justify-between gap-2 py-2 text-xs md:text-sm">
          <div className="flex flex-wrap items-center gap-4">
            <a href={`tel:${hotline.replace(/\s/g, "")}`} className="hover:text-accent-soft">
              {hotline}
            </a>
            {businessHours ? <span className="opacity-80">{businessHours}</span> : null}
          </div>
          <div className="flex items-center gap-4">
            <Link href="/san-pham" className="hover:text-accent-soft">
              Tìm sản phẩm
            </Link>
            <Link href="/gio-hang" className="hover:text-accent-soft">
              Giỏ hàng ({count})
            </Link>
          </div>
        </div>
      </div>
      <div className="border-b border-line bg-surface/90">
        <div className="container-page flex items-center justify-between gap-6 py-4">
          <Link href="/" className="min-w-0">
            <div className="font-[family-name:var(--font-display)] text-3xl tracking-wide text-brand md:text-4xl">
              {brandName}
            </div>
            {tagline ? (
              <p className="mt-1 truncate text-xs uppercase tracking-[0.18em] text-muted">
                {tagline}
              </p>
            ) : null}
          </Link>
          <nav className="hidden items-center gap-5 text-sm uppercase tracking-[0.12em] text-brand lg:flex">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-accent">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <nav className="container-page flex gap-4 overflow-x-auto pb-3 text-xs uppercase tracking-[0.12em] text-brand lg:hidden">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="whitespace-nowrap hover:text-accent">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
