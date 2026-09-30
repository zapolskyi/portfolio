// Правила заявки без залежностей: їх використовують і клієнт (миттєві помилки,
// без Zod у бандлі), і серверна Zod-схема — щоб перевірки не розійшлися.
export const CONTACT_RE = /^(@\w{4,}|[^\s@]+@[^\s@]+\.[^\s@]+)$/;

export const LIMITS = {
  name: { min: 1, max: 100 },
  contact: { max: 120 },
  message: { min: 10, max: 3000 },
  option: { max: 60 },
} as const;

export type ContactField = "name" | "contact" | "message";

export type ContactState =
  | { status: "idle" }
  | { status: "invalid"; fields: ContactField[] }
  | { status: "sent" }
  | { status: "unavailable" } // канал доставки не налаштований
  | { status: "error" };

const text = (data: FormData, key: string) => {
  const v = data.get(key);
  return typeof v === "string" ? v.trim() : "";
};

// Поля з помилками — у порядку появи у формі.
export function invalidFields(data: FormData): ContactField[] {
  const name = text(data, "name");
  const contact = text(data, "contact");
  const message = text(data, "message");
  const bad: ContactField[] = [];
  if (name.length < LIMITS.name.min || name.length > LIMITS.name.max) bad.push("name");
  if (contact.length > LIMITS.contact.max || !CONTACT_RE.test(contact)) bad.push("contact");
  if (message.length < LIMITS.message.min || message.length > LIMITS.message.max)
    bad.push("message");
  return bad;
}
