import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { findSiteSetting } from "@/repositories/content.repository";
import type { NavLink, SiteSetting } from "@/lib/strapi/types";
import "./globals.css";

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
});

const body = Manrope({
  variable: "--font-body",
  subsets: ["latin", "vietnamese"],
});

const fallbackSetting: SiteSetting = {
  id: 0,
  documentId: "fallback",
  brandName: "Yến Sào Hiếu Hiền",
  tagline: "Yến sạch – vị thật – gửi trao sức khỏe",
  hotline: "+84 900 123 456",
  email: "lienhe@yensaohieuhien.vn",
  businessHours: "08h30 - 20h30 T2-T7, CN: 08h30 - 17h30",
  showrooms: [
    {
      city: "Hà Nội",
      address: "12 Nguyễn Du, Hai Bà Trưng, Hà Nội",
      hotline: "0900 123 456",
    },
  ],
  socialLinks: [],
  footerTitle: "Yến Sào Hiếu Hiền",
  footerTagline: "Yến sạch – vị thật – gửi trao sức khỏe",
  footerCopyright: `© ${new Date().getFullYear()} Yến Sào Hiếu Hiền. All rights reserved.`,
  footerShowroomsTitle: "Hệ thống cửa hàng",
  footerLinksTitle: "Liên kết",
  footerLinks: [
    { label: "Sản phẩm", href: "/san-pham" },
    { label: "Liên hệ", href: "/lien-he" },
  ],
};

function resolveFooter(setting: SiteSetting) {
  const title = setting.footerTitle ?? setting.brandName;
  const tagline = setting.footerTagline ?? setting.tagline;
  const copyrightText =
    setting.footerCopyright ??
    `© ${new Date().getFullYear()} ${title}. All rights reserved.`;

  return {
    title,
    tagline,
    copyrightText,
    showroomsTitle: setting.footerShowroomsTitle ?? "Hệ thống cửa hàng",
    linksTitle: setting.footerLinksTitle ?? "Liên kết",
    quickLinks:
      setting.footerLinks && setting.footerLinks.length > 0
        ? setting.footerLinks
        : ([
            { label: "Sản phẩm", href: "/san-pham" },
            { label: "Liên hệ", href: "/lien-he" },
          ] satisfies NavLink[]),
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const setting = (await findSiteSetting()) ?? fallbackSetting;
  return {
    title: {
      default: `${setting.brandName} | Yến sào cao cấp`,
      template: `%s | ${setting.brandName}`,
    },
    description: setting.tagline ?? "Website bán Yến Sào Hiếu Hiền",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const setting = (await findSiteSetting()) ?? fallbackSetting;
  const footer = resolveFooter(setting);

  return (
    <html lang="vi">
      <body className={`${display.variable} ${body.variable} antialiased`}>
        <Header
          brandName={setting.brandName}
          tagline={setting.tagline}
          hotline={setting.hotline}
          businessHours={setting.businessHours}
        />
        <main>{children}</main>
        <Footer
          title={footer.title}
          tagline={footer.tagline}
          copyrightText={footer.copyrightText}
          email={setting.email}
          hotline={setting.hotline}
          showroomsTitle={footer.showroomsTitle}
          linksTitle={footer.linksTitle}
          quickLinks={footer.quickLinks}
          showrooms={setting.showrooms}
          socialLinks={setting.socialLinks}
        />
      </body>
    </html>
  );
}
