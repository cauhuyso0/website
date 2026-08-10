"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { contactSchema } from "@/schemas/forms";

export function ContactForm() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      const values = {
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
        subject: String(formData.get("subject") ?? ""),
        message: String(formData.get("message") ?? ""),
      };
      const parsed = contactSchema.parse(values);
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      });
      if (!response.ok) {
        throw new Error("Contact failed");
      }
      setSuccess("Đã gửi liên hệ. Yến Sào Hiếu Hiền sẽ phản hồi sớm nhất.");
      event.currentTarget.reset();
    } catch {
      setError("Không gửi được liên hệ. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block text-sm">
        <span className="mb-1.5 block text-muted">Họ tên</span>
        <input name="name" required className="w-full rounded-md border border-line bg-surface px-3 py-2" />
      </label>
      <label className="block text-sm">
        <span className="mb-1.5 block text-muted">Email</span>
        <input
          name="email"
          type="email"
          required
          className="w-full rounded-md border border-line bg-surface px-3 py-2"
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1.5 block text-muted">Tiêu đề</span>
        <input name="subject" required className="w-full rounded-md border border-line bg-surface px-3 py-2" />
      </label>
      <label className="block text-sm">
        <span className="mb-1.5 block text-muted">Nội dung</span>
        <textarea
          name="message"
          required
          rows={5}
          className="w-full rounded-md border border-line bg-surface px-3 py-2"
        />
      </label>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      {success ? <p className="text-sm text-accent">{success}</p> : null}
      <Button type="submit" disabled={loading}>
        {loading ? "Đang gửi..." : "Gửi liên hệ"}
      </Button>
    </form>
  );
}
