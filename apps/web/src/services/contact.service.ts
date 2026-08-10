import { logger } from "@/lib/logger";
import type { ContactFormValues } from "@/schemas/forms";
import { contactSchema } from "@/schemas/forms";
import { createContactMessage } from "@/repositories/order.repository";

export async function submitContact(form: ContactFormValues): Promise<void> {
  try {
    const parsed = contactSchema.parse(form);
    await createContactMessage(parsed);
  } catch (error) {
    logger.error("submitContact failed", error);
    throw error;
  }
}
