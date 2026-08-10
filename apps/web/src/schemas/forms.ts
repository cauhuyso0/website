import { z } from "zod";

export const checkoutSchema = z.object({
  customerName: z.string().min(2, "Vui lòng nhập họ tên"),
  phone: z
    .string()
    .min(9, "Số điện thoại không hợp lệ")
    .regex(/^[0-9+\s()-]+$/, "Số điện thoại không hợp lệ"),
  email: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
  address: z.string().min(5, "Vui lòng nhập địa chỉ"),
  city: z.string().min(2, "Vui lòng nhập tỉnh/thành"),
  note: z.string().optional(),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export const contactSchema = z.object({
  name: z.string().min(2, "Vui lòng nhập họ tên"),
  email: z.string().email("Email không hợp lệ"),
  subject: z.string().min(3, "Vui lòng nhập tiêu đề"),
  message: z.string().min(10, "Vui lòng nhập nội dung"),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
