/**
 * order controller
 */
import { factories } from "@strapi/strapi";

type OrderItemInput = {
  productName?: string;
  variantName?: string;
  sku?: string;
  unitPrice?: number;
  quantity?: number;
  lineTotal?: number;
};

type OrderCreateBody = {
  customerName?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  note?: string;
  items?: OrderItemInput[];
  shippingFee?: number;
};

function createOrderCode(): string {
  const stamp = Date.now().toString(36).toUpperCase();
  const random = Math.floor(Math.random() * 900 + 100).toString();
  return `NS-${stamp}-${random}`;
}

export default factories.createCoreController("api::order.order", ({ strapi }) => ({
  async create(ctx) {
    try {
      const body = (ctx.request.body?.data ?? ctx.request.body ?? {}) as OrderCreateBody;

      if (!body.customerName || !body.phone || !body.address || !body.city) {
        return ctx.badRequest("Missing required customer fields");
      }

      if (!Array.isArray(body.items) || body.items.length === 0) {
        return ctx.badRequest("Order items are required");
      }

      const items = body.items.map((item) => {
        const quantity = Number(item.quantity ?? 0);
        const unitPrice = Number(item.unitPrice ?? 0);
        if (!item.productName || quantity < 1 || unitPrice < 0) {
          throw new Error("Invalid order item");
        }
        return {
          productName: item.productName,
          variantName: item.variantName ?? "",
          sku: item.sku ?? "",
          unitPrice,
          quantity,
          lineTotal: unitPrice * quantity,
        };
      });

      const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
      const shippingFee = Number(body.shippingFee ?? 0);
      const total = subtotal + shippingFee;

      const created = await strapi.documents("api::order.order").create({
        data: {
          orderCode: createOrderCode(),
          customerName: body.customerName,
          phone: body.phone,
          email: body.email ?? "",
          address: body.address,
          city: body.city,
          note: body.note ?? "",
          status: "pending",
          paymentMethod: "cod",
          items,
          subtotal,
          shippingFee,
          total,
        },
      });

      ctx.body = { data: created };
    } catch (error) {
      strapi.log.error("Order create failed", error);
      return ctx.badRequest("Unable to create order");
    }
  },
}));
