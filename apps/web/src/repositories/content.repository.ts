import { logger } from "@/lib/logger";
import { strapiFetch } from "@/lib/strapi/client";
import type {
  AboutPage,
  Article,
  GuidePage,
  HomePage,
  SiteSetting,
  StrapiListResponse,
  StrapiSingleResponse,
} from "@/lib/strapi/types";

export async function findSiteSetting(): Promise<SiteSetting | null> {
  try {
    const response = await strapiFetch<StrapiSingleResponse<SiteSetting>>({
      path: "/api/site-setting",
      query: {
        "populate[logo]": true,
        "populate[socialLinks]": true,
        "populate[showrooms]": true,
      },
      tags: ["site-setting"],
    });
    return response.data;
  } catch (error) {
    logger.error("findSiteSetting failed", error);
    return null;
  }
}

export async function findHomePage(): Promise<HomePage | null> {
  try {
    const response = await strapiFetch<StrapiSingleResponse<HomePage>>({
      path: "/api/home-page",
      query: {
        "populate[heroSlides][populate]": "image",
        "populate[commitments]": true,
        "populate[categoryHighlights][populate]": "image",
      },
      tags: ["home-page"],
    });
    return response.data;
  } catch (error) {
    logger.error("findHomePage failed", error);
    return null;
  }
}

export async function findAboutPage(): Promise<AboutPage | null> {
  try {
    const response = await strapiFetch<StrapiSingleResponse<AboutPage>>({
      path: "/api/about-page",
      query: {
        "populate[cover]": true,
      },
      tags: ["about-page"],
    });
    return response.data;
  } catch (error) {
    logger.error("findAboutPage failed", error);
    return null;
  }
}

export async function findGuidePage(): Promise<GuidePage | null> {
  try {
    const response = await strapiFetch<StrapiSingleResponse<GuidePage>>({
      path: "/api/guide-page",
      tags: ["guide-page"],
    });
    return response.data;
  } catch (error) {
    logger.error("findGuidePage failed", error);
    return null;
  }
}

export async function findArticles(page = 1, pageSize = 9): Promise<StrapiListResponse<Article>> {
  try {
    return await strapiFetch<StrapiListResponse<Article>>({
      path: "/api/articles",
      query: {
        "pagination[page]": page,
        "pagination[pageSize]": pageSize,
        "sort[0]": "publishedAt:desc",
        "populate[cover]": true,
        "populate[category]": true,
      },
      tags: ["articles"],
    });
  } catch (error) {
    logger.error("findArticles failed", error);
    return { data: [], meta: { pagination: { page: 1, pageSize, pageCount: 0, total: 0 } } };
  }
}

export async function findArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const response = await strapiFetch<StrapiListResponse<Article>>({
      path: "/api/articles",
      query: {
        "filters[slug][$eq]": slug,
        "populate[cover]": true,
        "populate[category]": true,
      },
      tags: [`article-${slug}`],
    });
    return response.data[0] ?? null;
  } catch (error) {
    logger.error("findArticleBySlug failed", { slug, error });
    return null;
  }
}
