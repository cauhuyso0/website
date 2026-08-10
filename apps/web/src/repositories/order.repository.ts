import { logger } from "@/lib/logger";
import { strapiFetch } from "@/lib/strapi/client";
import type {
  CreateContactPayload,
  CreateOrderPayload,
  CreatedOrder,
  StrapiSingleResponse,
} from "@/lib/strapi/types";

export async function createOrder(
  payload: CreateOrderPayload
): Promise<CreatedOrder> {
  try {
    const response = await strapiFetch<StrapiSingleResponse<CreatedOrder>>({
      path: "/api/orders",
      method: "POST",
      body: { data: payload },
    });

    if (!response.data) {
      throw new Error("Empty order response");
    }

    return response.data;
  } catch (error) {
    logger.error("createOrder repository failed", error);
    throw error;
  }
}

export async function createContactMessage(
  payload: CreateContactPayload
): Promise<void> {
  try {
    await strapiFetch({
      path: "/api/contact-messages",
      method: "POST",
      body: { data: { ...payload, status: "new" } },
    });
  } catch (error) {
    logger.error("createContactMessage repository failed", error);
    throw error;
  }
}
