import type { Metadata } from "next";
import { findGuidePage } from "@/repositories/content.repository";

export const metadata: Metadata = {
  title: "Cẩm nang hướng dẫn sử dụng",
};

export default async function GuidePage() {
  const guide = await findGuidePage();

  return (
    <div className="container-page py-12">
      <h1 className="font-[family-name:var(--font-display)] text-4xl text-brand">
        {guide?.title ?? "Cẩm nang hướng dẫn sử dụng"}
      </h1>
      <div
        className="prose-nestora mt-8 max-w-3xl"
        dangerouslySetInnerHTML={{
          __html:
            guide?.content ??
            "<p>Hướng dẫn bảo quản và sử dụng yến Nestora.</p>",
        }}
      />
    </div>
  );
}
