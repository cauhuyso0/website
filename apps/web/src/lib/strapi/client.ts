import { logger } from "@/lib/logger";

const PUBLIC_STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";

const STRAPI_URL =
  process.env.STRAPI_INTERNAL_URL ?? PUBLIC_STRAPI_URL;

type StrapiFetchOptions = {
  path: string;
  query?: Record<string, string | number | boolean | undefined>;
  method?: "GET" | "POST";
  body?: unknown;
  token?: string;
  revalidate?: number;
  tags?: string[];
};

function buildUrl(path: string, query?: StrapiFetchOptions["query"]): string {
  const url = new URL(path.startsWith("http") ? path : `${STRAPI_URL}${path}`);
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined) {
        return;
      }
      url.searchParams.set(key, String(value));
    });
  }
  return url.toString();
}

export async function strapiFetch<T>(options: StrapiFetchOptions): Promise<T> {
  const { path, query, method = "GET", body, token, revalidate = 60, tags } = options;

  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    const apiToken = token ?? process.env.STRAPI_API_TOKEN;
    if (apiToken) {
      headers.Authorization = `Bearer ${apiToken}`;
    }

    const response = await fetch(buildUrl(path, query), {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      next: method === "GET" ? { revalidate, tags } : undefined,
      cache: method === "GET" ? undefined : "no-store",
    });

    if (!response.ok) {
      const text = await response.text();
      logger.error("Strapi request failed", {
        path,
        status: response.status,
        text,
      });
      throw new Error(`Strapi error ${response.status}`);
    }

    return (await response.json()) as T;
  } catch (error) {
    logger.error("Strapi fetch exception", { path, error });
    throw error;
  }
}

export function getStrapiBaseUrl(): string {
  return PUBLIC_STRAPI_URL;
}
