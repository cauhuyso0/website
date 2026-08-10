import { logger } from "@/lib/logger";
import type { CheckoutFormValues } from "@/schemas/forms";
import { checkoutSchema } from "@/schemas/forms";
import { createOrder } from "@/repositories/order.repository";
import type { CreateOrderPayload, CreatedOrder, OrderItemPayload } from "@/lib/strapi/types";

const DEFAULT_SHIPPING_FEE = 0;

export async function placeCodOrder(
  form: CheckoutFormValues,
  items: OrderItemPayload[]
): Promise<CreatedOrder> {
  try {
    const parsed = checkoutSchema.parse(form);

    if (items.length === 0) {
      throw new Error("Giỏ hàng trống");
    }

    const payload: CreateOrderPayload = {
      customerName: parsed.customerName,
      phone: parsed.phone,
      email: parsed.email || undefined,
      address: parsed.address,
      city: parsed.city,
      note: parsed.note,
      items,
      shippingFee: DEFAULT_SHIPPING_FEE,
    };

    return await createOrder(payload);
  } catch (error) {
    logger.error("placeCodOrder failed", error);
    throw error;
  }
}
