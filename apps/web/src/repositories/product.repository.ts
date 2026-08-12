import { logger } from "@/lib/logger";
import { strapiFetch } from "@/lib/strapi/client";
import type {
  Category,
  Product,
  StrapiListResponse,
} from "@/lib/strapi/types";

export async function findProducts(params?: {
  page?: number;
  pageSize?: number;
  categorySlug?: string;
  featured?: boolean;
}): Promise<StrapiListResponse<Product>> {
  try {
    const query: Record<string, string | number | boolean | undefined> = {
      "pagination[page]": params?.page ?? 1,
      "pagination[pageSize]": params?.pageSize ?? 12,
      "sort[0]": "createdAt:desc",
      "populate[images]": true,
      "populate[category]": true,
      "populate[variants]": true,
      "populate[flavorOptions]": true,
      "populate[toppingOptions]": true,
      "populate[sweetnessOptions]": true,
    };

    if (params?.categorySlug) {
      query["filters[category][slug][$eq]"] = params.categorySlug;
    }

    if (params?.featured) {
      query["filters[isFeatured][$eq]"] = true;
    }

    return await strapiFetch<StrapiListResponse<Product>>({
      path: "/api/products",
      query,
      tags: ["products"],
      revalidate: 30,
    });
  } catch (error) {
    logger.error("findProducts failed", error);
    return { data: [], meta: { pagination: { page: 1, pageSize: 12, pageCount: 0, total: 0 } } };
  }
}

export async function findProductBySlug(slug: string): Promise<Product | null> {
  try {
    const response = await strapiFetch<StrapiListResponse<Product>>({
      path: "/api/products",
      query: {
        "filters[slug][$eq]": slug,
        "populate[images]": true,
        "populate[category]": true,
        "populate[variants]": true,
        "populate[flavorOptions]": true,
        "populate[toppingOptions]": true,
        "populate[sweetnessOptions]": true,
      },
      tags: [`product-${slug}`],
    });
    return response.data[0] ?? null;
  } catch (error) {
    logger.error("findProductBySlug failed", { slug, error });
    return null;
  }
}

export async function findCategories(): Promise<Category[]> {
  try {
    const response = await strapiFetch<StrapiListResponse<Category>>({
      path: "/api/categories",
      query: {
        "pagination[pageSize]": 50,
        "sort[0]": "name:asc",
        "populate[image]": true,
      },
      tags: ["categories"],
    });
    return response.data;
  } catch (error) {
    logger.error("findCategories failed", error);
    return [];
  }
}

export async function findCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const response = await strapiFetch<StrapiListResponse<Category>>({
      path: "/api/categories",
      query: {
        "filters[slug][$eq]": slug,
        "populate[image]": true,
      },
      tags: [`category-${slug}`],
    });
    return response.data[0] ?? null;
  } catch (error) {
    logger.error("findCategoryBySlug failed", { slug, error });
    return null;
  }
}
