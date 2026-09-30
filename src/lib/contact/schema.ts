import "server-only";
import { z } from "zod";
import { CONTACT_RE, LIMITS } from "./rules";

// Серверна схема (Zod лише на сервері — у клієнтський бандл не потрапляє).
export const contactSchema = z.object({
  name: z.string().trim().min(LIMITS.name.min).max(LIMITS.name.max),
  contact: z.string().trim().max(LIMITS.contact.max).regex(CONTACT_RE),
  type: z.string().trim().max(LIMITS.option.max).default(""),
  budget: z.string().trim().max(LIMITS.option.max).default(""),
  message: z.string().trim().min(LIMITS.message.min).max(LIMITS.message.max),
  lang: z.enum(["uk", "en"]).default("uk"),
});

export function formToObject(data: FormData) {
  const get = (k: string) => {
    const v = data.get(k);
    return typeof v === "string" ? v : undefined;
  };
  return {
    name: get("name") ?? "",
    contact: get("contact") ?? "",
    type: get("type"),
    budget: get("budget"),
    message: get("message") ?? "",
    lang: get("lang"),
  };
}
