import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { checkoutSchema } from "@/schemas/forms";
import { placeCodOrder } from "@/services/order.service";
import { z } from "zod";

const orderRequestSchema = checkoutSchema.extend({
  items: z
    .array(
      z.object({
        productName: z.string().min(1),
        variantName: z.string().optional(),
        sku: z.string().optional(),
        unitPrice: z.number().nonnegative(),
        quantity: z.number().int().positive(),
      })
    )
    .min(1),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = orderRequestSchema.parse(json);
    const { items, ...form } = parsed;
    const order = await placeCodOrder(form, items);
    return NextResponse.json({ data: order });
  } catch (error) {
    logger.error("POST /api/orders failed", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid payload", details: error.flatten() },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Unable to create order" }, { status: 500 });
  }
}
