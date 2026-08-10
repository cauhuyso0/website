import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { findArticleBySlug } from "@/repositories/content.repository";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await findArticleBySlug(slug);
  return {
    title: article?.title ?? "Bài viết",
    description: article?.excerpt ?? undefined,
  };
}

export default async function ArticleDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const article = await findArticleBySlug(slug);
  if (!article) {
    notFound();
  }

  return (
    <article className="container-page py-12">
      <p className="text-xs uppercase tracking-[0.18em] text-muted">
        {article.category?.name ?? "Bài viết"}
      </p>
      <h1 className="mt-3 max-w-3xl font-[family-name:var(--font-display)] text-4xl text-brand">
        {article.title}
      </h1>
      {article.excerpt ? <p className="mt-4 max-w-3xl text-lg text-muted">{article.excerpt}</p> : null}
      <div className="my-8 aspect-[21/9] max-w-4xl bg-[linear-gradient(135deg,#d9c3a1,#5a3a28)]" />
      <div
        className="prose-nestora max-w-3xl"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
    </article>
  );
}
