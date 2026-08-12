import Link from "next/link";
import { CategoryHighlights } from "@/components/home/CategoryHighlights";
import { Commitments } from "@/components/home/Commitments";
import { Hero } from "@/components/home/Hero";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/Button";
import { StrapiImage } from "@/components/ui/StrapiImage";
import { findArticles, findHomePage, findSiteSetting } from "@/repositories/content.repository";
import { findProducts } from "@/repositories/product.repository";

export default async function HomePage() {
  const [home, setting, featured, articles] = await Promise.all([
    findHomePage(),
    findSiteSetting(),
    findProducts({ featured: true, pageSize: 8 }),
    findArticles(1, 3),
  ]);

  const brandName = setting?.brandName ?? "Yến Sào Hiếu Hiền";

  const featuredProducts = [...featured.data].sort((left, right) => {
    const leftHasImage = (left.images?.length ?? 0) > 0 ? 1 : 0;
    const rightHasImage = (right.images?.length ?? 0) > 0 ? 1 : 0;
    return rightHasImage - leftHasImage;
  });

  return (
    <>
      <Hero slide={home?.heroSlides?.[0]} brandName={brandName} />
      <Commitments items={home?.commitments ?? []} />
      <CategoryHighlights items={home?.categoryHighlights ?? []} />

      <section className="container-page py-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted">Nổi bật</p>
            <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-brand md:text-4xl">
              Sản phẩm được yêu thích
            </h2>
          </div>
          <Button href="/san-pham" variant="secondary">
            Xem tất cả
          </Button>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.documentId} product={product} />
          ))}
        </div>
        {featuredProducts.length === 0 ? (
          <p className="text-muted">
            Chưa có dữ liệu sản phẩm. Hãy chạy Strapi (`npm run dev:cms`) để seed nội dung demo.
          </p>
        ) : null}
      </section>

      <section className="container-page grid gap-8 py-16 lg:grid-cols-2">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-brand md:text-4xl">
            {home?.whyChooseTitle ?? "Vì sao chọn Yến Sào Hiếu Hiền?"}
          </h2>
        </div>
        <div
          className="prose-nestora"
          dangerouslySetInnerHTML={{
            __html:
              home?.whyChooseBody ??
              "<p>Yến Sào Hiếu Hiền mang đến yến sào minh bạch nguồn gốc, phù hợp dùng hàng ngày và làm quà.</p>",
          }}
        />
      </section>

      <section className="border-y border-line bg-surface/70">
        <div className="container-page flex flex-col items-start justify-between gap-6 py-14 md:flex-row md:items-center">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-3xl text-brand">
              {home?.ctaTitle ?? "Tư vấn chọn yến phù hợp"}
            </h2>
            <p className="mt-3 max-w-xl text-muted">
              {home?.ctaBody ?? "Đội ngũ Yến Sào Hiếu Hiền sẵn sàng hỗ trợ bạn."}
            </p>
          </div>
          <Button href={home?.ctaHref ?? "/lien-he"}>{home?.ctaLabel ?? "Liên hệ ngay"}</Button>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-brand">Bài viết mới</h2>
          <Link href="/bai-viet" className="text-sm text-muted hover:text-brand">
            Xem thêm
          </Link>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {articles.data.map((article) => (
            <Link key={article.documentId} href={`/bai-viet/${article.slug}`} className="group">
              <div className="relative mb-4 aspect-[16/10] overflow-hidden bg-[linear-gradient(135deg,#d9c3a1,#5a3a28)] transition group-hover:brightness-110">
                <StrapiImage
                  media={article.cover}
                  alt={article.title}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                  fallbackClassName="absolute inset-0 bg-[linear-gradient(135deg,#d9c3a1,#5a3a28)]"
                />
              </div>
              <h3 className="font-[family-name:var(--font-display)] text-xl text-brand">
                {article.title}
              </h3>
              <p className="mt-2 line-clamp-2 text-sm text-muted">{article.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
