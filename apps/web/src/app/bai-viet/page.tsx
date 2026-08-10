import type { Metadata } from "next";
import Link from "next/link";
import { findArticles } from "@/repositories/content.repository";

export const metadata: Metadata = {
  title: "Bài viết",
};

type SearchParams = Promise<{ page?: string }>;

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const articles = await findArticles(page, 9);
  const pagination = articles.meta?.pagination;

  return (
    <div className="container-page py-12">
      <h1 className="font-[family-name:var(--font-display)] text-4xl text-brand">Bài viết</h1>
      <p className="mt-3 text-muted">Cẩm nang dinh dưỡng và kiến thức về yến sào.</p>
      <div className="mt-10 grid gap-8 md:grid-cols-3">
        {articles.data.map((article) => (
          <Link key={article.documentId} href={`/bai-viet/${article.slug}`} className="group">
            <div className="mb-4 aspect-[16/10] bg-[linear-gradient(135deg,#d9c3a1,#5a3a28)] transition group-hover:brightness-110" />
            <p className="text-xs uppercase tracking-[0.14em] text-muted">
              {article.category?.name ?? "Yến Sào Hiếu Hiền"}
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl text-brand">
              {article.title}
            </h2>
            <p className="mt-2 line-clamp-3 text-sm text-muted">{article.excerpt}</p>
          </Link>
        ))}
      </div>
      {articles.data.length === 0 ? (
        <p className="mt-8 text-muted">Chưa có bài viết.</p>
      ) : null}
      {pagination && pagination.pageCount > 1 ? (
        <div className="mt-10 flex gap-3">
          {Array.from({ length: pagination.pageCount }).map((_, index) => {
            const pageNumber = index + 1;
            return (
              <Link
                key={pageNumber}
                href={`/bai-viet?page=${pageNumber}`}
                className={`rounded-md border px-3 py-1.5 text-sm ${
                  pageNumber === pagination.page
                    ? "border-brand bg-brand text-surface"
                    : "border-line"
                }`}
              >
                {pageNumber}
              </Link>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
