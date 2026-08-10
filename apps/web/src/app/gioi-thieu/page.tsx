import type { Metadata } from "next";
import { findAboutPage } from "@/repositories/content.repository";

export const metadata: Metadata = {
  title: "Giới thiệu",
};

export default async function AboutPage() {
  const about = await findAboutPage();

  return (
    <div className="container-page py-12">
      <p className="text-xs uppercase tracking-[0.2em] text-muted">Về chúng tôi</p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl text-brand">
        {about?.title ?? "Giới thiệu Nestora"}
      </h1>
      {about?.subtitle ? <p className="mt-3 text-lg text-muted">{about.subtitle}</p> : null}
      <div
        className="prose-nestora mt-8 max-w-3xl"
        dangerouslySetInnerHTML={{
          __html:
            about?.content ??
            "<p>Nestora chuyên cung cấp tổ yến, yến chưng và set quà sức khỏe.</p>",
        }}
      />
    </div>
  );
}
