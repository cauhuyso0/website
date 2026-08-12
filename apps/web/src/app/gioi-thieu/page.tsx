import type { Metadata } from "next";
import { findAboutPage } from "@/repositories/content.repository";
import { StrapiImage } from "@/components/ui/StrapiImage";

export const metadata: Metadata = {
  title: "Giới thiệu",
};

export default async function AboutPage() {
  const about = await findAboutPage();

  return (
    <div className="container-page py-12">
      <p className="text-xs uppercase tracking-[0.2em] text-muted">Về chúng tôi</p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl text-brand">
        {about?.title ?? "Giới thiệu Yến Sào Hiếu Hiền"}
      </h1>
      {about?.subtitle ? <p className="mt-3 text-lg text-muted">{about.subtitle}</p> : null}
      {about?.cover ? (
        <div className="relative mt-8 aspect-[21/9] max-w-4xl overflow-hidden bg-[linear-gradient(135deg,#d9c3a1,#5a3a28)]">
          <StrapiImage
            media={about.cover}
            alt={about.title}
            sizes="(max-width: 768px) 100vw, 896px"
            className="object-cover"
            fallbackClassName="absolute inset-0 bg-[linear-gradient(135deg,#d9c3a1,#5a3a28)]"
          />
        </div>
      ) : null}
      <div
        className="prose-nestora mt-8 max-w-3xl"
        dangerouslySetInnerHTML={{
          __html:
            about?.content ??
            "<p>Yến Sào Hiếu Hiền chuyên cung cấp tổ yến, yến chưng và set quà sức khỏe.</p>",
        }}
      />
    </div>
  );
}
