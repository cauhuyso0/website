import type { Core } from "@strapi/strapi";

type PublicAction =
  | "find"
  | "findOne"
  | "create";

const PUBLIC_PERMISSIONS: Array<{ uid: string; actions: PublicAction[] }> = [
  { uid: "api::category.category", actions: ["find", "findOne"] },
  { uid: "api::product.product", actions: ["find", "findOne"] },
  { uid: "api::product-variant.product-variant", actions: ["find", "findOne"] },
  { uid: "api::article-category.article-category", actions: ["find", "findOne"] },
  { uid: "api::article.article", actions: ["find", "findOne"] },
  { uid: "api::site-setting.site-setting", actions: ["find"] },
  { uid: "api::home-page.home-page", actions: ["find"] },
  { uid: "api::about-page.about-page", actions: ["find"] },
  { uid: "api::guide-page.guide-page", actions: ["find"] },
  { uid: "api::order.order", actions: ["create"] },
  { uid: "api::contact-message.contact-message", actions: ["create"] },
];

async function setPublicPermissions(strapi: Core.Strapi): Promise<void> {
  const roleService = strapi.plugin("users-permissions").service("role");
  const roles = await roleService.find();
  const publicRole = roles.find((role: { type: string }) => role.type === "public");

  if (!publicRole) {
    strapi.log.warn("Public role not found; skip permission bootstrap");
    return;
  }

  const existing = await strapi.db.query("plugin::users-permissions.permission").findMany({
    where: { role: publicRole.id },
  });

  const existingKeys = new Set(
    existing.map((permission: { action: string }) => permission.action)
  );

  for (const entry of PUBLIC_PERMISSIONS) {
    for (const action of entry.actions) {
      const actionKey = `${entry.uid}.${action}`;
      if (existingKeys.has(actionKey)) {
        continue;
      }

      await strapi.db.query("plugin::users-permissions.permission").create({
        data: {
          action: actionKey,
          role: publicRole.id,
        },
      });
    }
  }
}

async function seedIfEmpty(strapi: Core.Strapi): Promise<void> {
  const productCount = await strapi.db.query("api::product.product").count();
  if (productCount > 0) {
    return;
  }

  strapi.log.info("Seeding Nestora demo content...");

  const categoryDefs = [
    {
      name: "Tổ yến",
      slug: "to-yen",
      description: "Tổ yến tinh chế và sơ chế sạch lông.",
    },
    {
      name: "Yến chưng",
      slug: "yen-chung",
      description: "Yến chưng tươi và yến chưng sẵn tiện lợi.",
    },
    {
      name: "Set quà",
      slug: "set-qua",
      description: "Set quà biếu tặng sang trọng.",
    },
    {
      name: "Đông trùng hạ thảo",
      slug: "dong-trung-ha-thao",
      description: "Đông trùng hạ thảo tự nhiên.",
    },
  ];

  const categories: Record<string, string> = {};
  for (const item of categoryDefs) {
    const created = await strapi.documents("api::category.category").create({
      data: { ...item },
      status: "published",
    });
    categories[item.slug] = created.documentId;
  }

  const products = [
    {
      name: "Yến chưng sẵn hạt sen",
      slug: "yen-chung-san-hat-sen",
      shortDescription: "Hũ yến chưng sẵn vị hạt sen thanh mát.",
      description:
        "<p>Yến chưng sẵn hạt sen Nestora được chế biến từ tổ yến tinh khiết, không chất bảo quản.</p>",
      price: 105000,
      isFeatured: true,
      category: categories["yen-chung"],
      variants: [{ name: "Hũ 70ml", sku: "YCS-HS-70", price: 105000, stock: 120 }],
    },
    {
      name: "Yến chưng sẵn saffron",
      slug: "yen-chung-san-saffron",
      shortDescription: "Kết hợp yến và saffron hỗ trợ giấc ngủ sâu.",
      description:
        "<p>Công thức saffron Nestora giúp thư giãn và bồi bổ từ bên trong.</p>",
      price: 95000,
      compareAtPrice: 104500,
      isFeatured: true,
      category: categories["yen-chung"],
      variants: [{ name: "Hũ 70ml", sku: "YCS-SF-70", price: 95000, stock: 100 }],
    },
    {
      name: "Yến chưng tươi 120ml",
      slug: "yen-chung-tuoi-120ml",
      shortDescription: "Chưng nóng theo đơn, giao nhanh nội thành.",
      description:
        "<p>Yến chưng tươi 120ml Nestora giữ trọn vị ngọt tự nhiên của tổ yến.</p>",
      price: 215000,
      isFeatured: true,
      category: categories["yen-chung"],
      variants: [
        { name: "Ít đường", sku: "YCT-120-ID", price: 215000, stock: 50 },
        { name: "Không đường", sku: "YCT-120-KD", price: 215000, stock: 50 },
        { name: "Thêm đông trùng", sku: "YCT-120-DT", price: 485000, stock: 20 },
      ],
    },
    {
      name: "Yến chưng tươi 200ml",
      slug: "yen-chung-tuoi-200ml",
      shortDescription: "Dung tích lớn, phù hợp người cần bồi bổ.",
      description: "<p>Hũ 200ml tiện dùng cho người bệnh và người lớn tuổi.</p>",
      price: 285000,
      isFeatured: true,
      category: categories["yen-chung"],
      variants: [
        { name: "Ít đường", sku: "YCT-200-ID", price: 285000, stock: 40 },
        { name: "Không đường", sku: "YCT-200-KD", price: 285000, stock: 40 },
      ],
    },
    {
      name: "Tổ yến tinh chế 50g",
      slug: "to-yen-tinh-che-50g",
      shortDescription: "Tổ yến sạch lông, sợi dài, dùng chưng tại nhà.",
      description: "<p>Được tuyển chọn và sơ chế thủ công tại Nestora.</p>",
      price: 1450000,
      isFeatured: true,
      category: categories["to-yen"],
      variants: [{ name: "Hộp 50g", sku: "TY-TC-50", price: 1450000, stock: 30 }],
    },
    {
      name: "Yến tươi sơ chế sạch lông",
      slug: "yen-tuoi-so-che-sach-long",
      shortDescription: "Cấp đông chia túi zip tiện bảo quản.",
      description: "<p>Yến tươi Nestora giữ độ dai và hương vị tự nhiên.</p>",
      price: 2940000,
      isFeatured: false,
      category: categories["to-yen"],
      variants: [{ name: "Hộp 100g", sku: "YT-SC-100", price: 2940000, stock: 15 }],
    },
    {
      name: "Set túi xách 4 hũ yến chưng sẵn",
      slug: "set-tui-xach-4-hu",
      shortDescription: "Set quà kinh tế, dễ mang theo.",
      description: "<p>Set 4 hũ yến chưng sẵn Nestora trong túi xách tinh tế.</p>",
      price: 390000,
      compareAtPrice: 400000,
      isFeatured: true,
      category: categories["set-qua"],
      variants: [{ name: "Set 4 hũ", sku: "SQ-TX-4", price: 390000, stock: 60 }],
    },
    {
      name: "Set quà hộp vali yến chưng tươi",
      slug: "set-qua-hop-vali",
      shortDescription: "Hộp vali sang trọng cho dịp biếu tặng.",
      description: "<p>Set quà Nestora kết hợp yến chưng tươi và hộp vali cao cấp.</p>",
      price: 1300000,
      isFeatured: true,
      category: categories["set-qua"],
      variants: [
        { name: "6 hũ", sku: "SQ-VL-6", price: 1300000, stock: 25 },
        { name: "10 hũ", sku: "SQ-VL-10", price: 2250000, stock: 15 },
      ],
    },
    {
      name: "Set hộp đứng 18 hũ yến chưng sẵn",
      slug: "set-hop-dung-18-hu",
      shortDescription: "Hộp đứng 18 hũ dùng biếu đối tác.",
      description: "<p>Thiết kế đứng sang trọng, phù hợp quà doanh nghiệp.</p>",
      price: 2250000,
      compareAtPrice: 2280000,
      isFeatured: false,
      category: categories["set-qua"],
      variants: [{ name: "18 hũ", sku: "SQ-HD-18", price: 2250000, stock: 20 }],
    },
    {
      name: "Đông trùng hạ thảo Bhutan 10g",
      slug: "dong-trung-bhutan-10g",
      shortDescription: "Đông trùng tự nhiên chọn lọc.",
      description: "<p>Nguyên liệu quý dùng kèm yến hoặc sắc uống.</p>",
      price: 3200000,
      isFeatured: true,
      category: categories["dong-trung-ha-thao"],
      variants: [{ name: "Hộp 10g", sku: "DT-BT-10", price: 3200000, stock: 12 }],
    },
  ];

  for (const product of products) {
    const { variants, category, ...productData } = product;
    const createdProduct = await strapi.documents("api::product.product").create({
      data: {
        ...productData,
        category,
        stockStatus: "in_stock",
      } as never,
      status: "published",
    });

    for (const variant of variants) {
      await strapi.documents("api::product-variant.product-variant").create({
        data: {
          ...variant,
          product: createdProduct.documentId,
        } as never,
      });
    }
  }

  const articleCategory = await strapi
    .documents("api::article-category.article-category")
    .create({
      data: {
        name: "Cẩm nang về yến",
        slug: "cam-nang-ve-yen",
      },
      status: "published",
    });

  const articles = [
    {
      title: "Cách chưng yến giữ trọn dưỡng chất",
      slug: "cach-chung-yen-giu-tron-duong-chat",
      excerpt: "Hướng dẫn nhiệt độ và thời gian chưng yến đúng cách tại nhà.",
      content:
        "<p>Nên chưng yến ở nhiệt độ vừa phải, tránh đun sôi mạnh để giữ protein.</p><p>Ngâm yến trước khi chưng khoảng 30–60 phút tùy loại.</p>",
    },
    {
      title: "Ai nên dùng yến sào đều đặn?",
      slug: "ai-nen-dung-yen-sao-deu-dan",
      excerpt: "Gợi ý nhóm đối tượng phù hợp và liều dùng tham khảo.",
      content:
        "<p>Yến phù hợp người cần bồi bổ, người lớn tuổi, người mới ốm dậy.</p><p>Nên dùng đều đặn theo tư vấn dinh dưỡng.</p>",
    },
    {
      title: "Phân biệt yến tinh chế và yến thô",
      slug: "phan-biet-yen-tinh-che-va-yen-tho",
      excerpt: "Hiểu rõ từng loại để chọn sản phẩm phù hợp nhu cầu.",
      content:
        "<p>Yến thô giữ hình tổ, cần sơ chế. Yến tinh chế đã làm sạch, tiện dùng hơn.</p>",
    },
  ];

  for (const article of articles) {
    await strapi.documents("api::article.article").create({
      data: {
        ...article,
        category: articleCategory.documentId,
      },
      status: "published",
    });
  }

  await strapi.documents("api::site-setting.site-setting").create({
    data: {
      brandName: "Nestora",
      tagline: "Yến sạch – vị thật – gửi trao sức khỏe",
      hotline: "+84 900 123 456",
      email: "hello@nestora.vn",
      businessHours: "08h30 - 20h30 T2-T7, CN: 08h30 - 17h30",
      socialLinks: [
        { platform: "facebook", url: "https://facebook.com" },
        { platform: "zalo", url: "https://zalo.me" },
      ],
      showrooms: [
        {
          city: "Hà Nội",
          address: "12 Nguyễn Du, Hai Bà Trưng, Hà Nội",
          hotline: "0900 123 456",
        },
        {
          city: "TP. Hồ Chí Minh",
          address: "88 Nguyễn Thị Minh Khai, Quận 3, TP.HCM",
          hotline: "0900 654 321",
        },
      ],
    },
  });

  await strapi.documents("api::home-page.home-page").create({
    data: {
      heroSlides: [
        {
          title: "Nestora",
          subtitle: "Yến sào tuyển chọn – bồi bổ tinh tế mỗi ngày.",
          ctaLabel: "Khám phá sản phẩm",
          ctaHref: "/san-pham",
        },
      ],
      commitments: [
        {
          title: "Cam kết chất lượng",
          description: "Hoàn tiền nếu phát hiện hàng không đúng cam kết.",
        },
        {
          title: "Vệ sinh ATTP",
          description: "Quy trình sản xuất khép kín theo tiêu chuẩn an toàn.",
        },
        {
          title: "Đổi trả linh hoạt",
          description: "Đổi trả trong 24 giờ kể từ khi nhận hàng.",
        },
        {
          title: "Giao hàng toàn quốc",
          description: "Ship nhanh, thanh toán COD tiện lợi.",
        },
      ],
      categoryHighlights: [
        { title: "Tổ yến", href: "/danh-muc/to-yen" },
        { title: "Yến chưng", href: "/danh-muc/yen-chung" },
        { title: "Set quà biếu tặng", href: "/danh-muc/set-qua" },
        { title: "Đông trùng hạ thảo", href: "/danh-muc/dong-trung-ha-thao" },
      ],
      whyChooseTitle: "Vì sao chọn Nestora?",
      whyChooseBody:
        "<ul><li>Giá trị dinh dưỡng cao với mức giá hợp lý cho gia đình Việt.</li><li>Không phụ gia, quy trình thủ công tuyển chọn khắt khe.</li><li>Đóng gói tinh tế, phù hợp dùng hàng ngày và làm quà.</li></ul>",
      ctaTitle: "Tư vấn chọn yến phù hợp",
      ctaBody: "Đội ngũ Nestora sẵn sàng hỗ trợ bạn chọn sản phẩm đúng nhu cầu.",
      ctaLabel: "Liên hệ ngay",
      ctaHref: "/lien-he",
    },
    status: "published",
  });

  await strapi.documents("api::about-page.about-page").create({
    data: {
      title: "Giới thiệu Nestora",
      subtitle: "Thương hiệu yến sào Việt với tiêu chuẩn minh bạch.",
      content:
        "<p>Nestora chuyên cung cấp tổ yến, yến chưng và set quà sức khỏe.</p><p>Chúng tôi theo đuổi quy trình tuyển chọn thủ công và truy xuất nguồn gốc rõ ràng.</p>",
    },
    status: "published",
  });

  await strapi.documents("api::guide-page.guide-page").create({
    data: {
      title: "Cẩm nang hướng dẫn sử dụng",
      content:
        "<h2>Bảo quản</h2><p>Yến khô để nơi khô ráo. Yến chưng sẵn bảo quản ngăn mát và dùng trong hạn ghi trên nhãn.</p><h2>Cách dùng</h2><p>Dùng ấm hoặc để nhiệt độ phòng. Không đun sôi lại nhiều lần.</p>",
    },
    status: "published",
  });

  strapi.log.info("Nestora demo content seeded.");
}

export default {
  register() {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    try {
      await setPublicPermissions(strapi);
      await seedIfEmpty(strapi);
    } catch (error) {
      strapi.log.error("Bootstrap failed", error);
    }
  },
};
