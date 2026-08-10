import Link from "next/link";
import type { Showroom, SocialLink } from "@/lib/strapi/types";

type FooterProps = {
  brandName: string;
  tagline?: string | null;
  email: string;
  hotline: string;
  showrooms?: Showroom[] | null;
  socialLinks?: SocialLink[] | null;
};

export function Footer({
  brandName,
  tagline,
  email,
  hotline,
  showrooms,
  socialLinks,
}: FooterProps) {
  return (
    <footer className="mt-20 border-t border-line bg-brand text-surface">
      <div className="container-page grid gap-10 py-14 md:grid-cols-3">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-3xl">{brandName}</h2>
          {tagline ? <p className="mt-3 max-w-sm text-sm text-accent-soft">{tagline}</p> : null}
          <div className="mt-5 space-y-2 text-sm">
            <a href={`tel:${hotline.replace(/\s/g, "")}`} className="block hover:text-accent-soft">
              {hotline}
            </a>
            <a href={`mailto:${email}`} className="block hover:text-accent-soft">
              {email}
            </a>
          </div>
        </div>
        <div>
          <h3 className="text-sm uppercase tracking-[0.16em] text-accent-soft">Hệ thống cửa hàng</h3>
          <div className="mt-4 space-y-4">
            {(showrooms ?? []).map((room) => (
              <div key={`${room.city}-${room.address}`} className="text-sm">
                <p className="font-medium">{room.city}</p>
                <p className="text-accent-soft">{room.address}</p>
                {room.hotline ? <p className="mt-1">{room.hotline}</p> : null}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm uppercase tracking-[0.16em] text-accent-soft">Liên kết</h3>
          <div className="mt-4 flex flex-col gap-2 text-sm">
            <Link href="/san-pham" className="hover:text-accent-soft">
              Sản phẩm
            </Link>
            <Link href="/bai-viet" className="hover:text-accent-soft">
              Bài viết
            </Link>
            <Link href="/lien-he" className="hover:text-accent-soft">
              Liên hệ
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            {(socialLinks ?? []).map((link) => (
              <a
                key={`${link.platform}-${link.url}`}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-md border border-white/20 px-3 py-1.5 capitalize hover:border-accent-soft"
              >
                {link.platform}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-accent-soft">
        © {new Date().getFullYear()} {brandName}. All rights reserved.
      </div>
    </footer>
  );
}
