export type StrapiMedia = {
  id: number;
  documentId?: string;
  url: string;
  alternativeText?: string | null;
  width?: number;
  height?: number;
};

export type Category = {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: StrapiMedia | null;
};

export type ProductVariant = {
  id: number;
  documentId: string;
  name: string;
  sku?: string | null;
  price: number;
  compareAtPrice?: number | null;
  stock?: number | null;
};

export type Product = {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  shortDescription?: string | null;
  description?: string | null;
  images?: StrapiMedia[] | null;
  price: number;
  compareAtPrice?: number | null;
  isFeatured?: boolean;
  stockStatus?: "in_stock" | "out_of_stock" | "preorder";
  seoTitle?: string | null;
  seoDescription?: string | null;
  category?: Category | null;
  variants?: ProductVariant[] | null;
};

export type ArticleCategory = {
  id: number;
  documentId: string;
  name: string;
  slug: string;
};

export type Article = {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  cover?: StrapiMedia | null;
  content: string;
  category?: ArticleCategory | null;
  publishedAt?: string | null;
};

export type Showroom = {
  id?: number;
  city: string;
  address: string;
  hotline?: string | null;
};

export type SocialLink = {
  id?: number;
  platform: "facebook" | "instagram" | "youtube" | "zalo" | "tiktok";
  url: string;
};

export type SiteSetting = {
  id: number;
  documentId: string;
  brandName: string;
  tagline?: string | null;
  logo?: StrapiMedia | null;
  hotline: string;
  email: string;
  businessHours?: string | null;
  socialLinks?: SocialLink[] | null;
  showrooms?: Showroom[] | null;
};

export type HeroSlide = {
  id?: number;
  title: string;
  subtitle?: string | null;
  ctaLabel?: string | null;
  ctaHref?: string | null;
  image?: StrapiMedia | null;
};

export type Commitment = {
  id?: number;
  title: string;
  description: string;
};

export type CategoryHighlight = {
  id?: number;
  title: string;
  href: string;
  image?: StrapiMedia | null;
};

export type HomePage = {
  id: number;
  documentId: string;
  heroSlides?: HeroSlide[] | null;
  commitments?: Commitment[] | null;
  categoryHighlights?: CategoryHighlight[] | null;
  whyChooseTitle?: string | null;
  whyChooseBody?: string | null;
  ctaTitle?: string | null;
  ctaBody?: string | null;
  ctaLabel?: string | null;
  ctaHref?: string | null;
};

export type AboutPage = {
  id: number;
  documentId: string;
  title: string;
  subtitle?: string | null;
  content: string;
  cover?: StrapiMedia | null;
};

export type GuidePage = {
  id: number;
  documentId: string;
  title: string;
  content: string;
};

export type OrderItemPayload = {
  productName: string;
  variantName?: string;
  sku?: string;
  unitPrice: number;
  quantity: number;
};

export type CreateOrderPayload = {
  customerName: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  note?: string;
  items: OrderItemPayload[];
  shippingFee?: number;
};

export type CreatedOrder = {
  id: number;
  documentId: string;
  orderCode: string;
  total: number;
};

export type CreateContactPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type StrapiListResponse<T> = {
  data: T[];
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};

export type StrapiSingleResponse<T> = {
  data: T | null;
};
