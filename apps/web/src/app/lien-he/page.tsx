import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { findSiteSetting } from "@/repositories/content.repository";

export const metadata: Metadata = {
  title: "Liên hệ",
};

export default async function ContactPage() {
  const setting = await findSiteSetting();

  return (
    <div className="container-page grid gap-10 py-12 lg:grid-cols-2">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-4xl text-brand">Liên hệ</h1>
        <p className="mt-3 text-muted">
          Để lại thông tin, Nestora sẽ phản hồi trong thời gian sớm nhất.
        </p>
        <div className="mt-8 space-y-3 text-sm">
          <p>
            Hotline:{" "}
            <a className="text-brand" href={`tel:${(setting?.hotline ?? "").replace(/\s/g, "")}`}>
              {setting?.hotline ?? "+84 900 123 456"}
            </a>
          </p>
          <p>
            Email:{" "}
            <a className="text-brand" href={`mailto:${setting?.email ?? "hello@nestora.vn"}`}>
              {setting?.email ?? "hello@nestora.vn"}
            </a>
          </p>
          <div className="space-y-3 pt-4">
            {(setting?.showrooms ?? []).map((room) => (
              <div key={`${room.city}-${room.address}`}>
                <p className="font-medium text-brand">{room.city}</p>
                <p className="text-muted">{room.address}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <ContactForm />
    </div>
  );
}
