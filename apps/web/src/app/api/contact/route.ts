import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { contactSchema } from "@/schemas/forms";
import { submitContact } from "@/services/contact.service";
import { z } from "zod";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = contactSchema.parse(json);
    await submitContact(parsed);
    return NextResponse.json({ ok: true });
  } catch (error) {
    logger.error("POST /api/contact failed", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid payload", details: error.flatten() },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Unable to send message" }, { status: 500 });
  }
}
