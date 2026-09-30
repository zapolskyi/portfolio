"use server";

import { invalidFields, type ContactState } from "@/lib/contact/rules";
import { contactSchema, formToObject } from "@/lib/contact/schema";

const MIN_FILL_MS = 3000; // людина не заповнить форму швидше

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Заявка з форми контакту → повідомлення в Telegram (Bot API).
// Потрібні TELEGRAM_BOT_TOKEN і TELEGRAM_CHAT_ID (див. .env.example).
export async function sendContactRequest(
  _prev: ContactState,
  data: FormData,
): Promise<ContactState> {
  // Антиспам: заповнене поле-пастка або надто швидке відправлення.
  // Ботам відповідаємо «успіх», щоб не підказувати, що їх розпізнали.
  const honeypot = data.get("website");
  const startedAt = Number(data.get("startedAt"));
  if ((typeof honeypot === "string" && honeypot !== "") || !startedAt) return { status: "sent" };
  if (Date.now() - startedAt < MIN_FILL_MS) return { status: "sent" };

  const parsed = contactSchema.safeParse(formToObject(data));
  if (!parsed.success) return { status: "invalid", fields: invalidFields(data) };

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.warn("[contact] TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID не задані — заявку не надіслано");
    return { status: "unavailable" };
  }

  const r = parsed.data;
  const text = [
    "<b>Нова заявка з zapolskyi.com</b>",
    "",
    `<b>Ім'я:</b> ${escapeHtml(r.name)}`,
    `<b>Контакт:</b> ${escapeHtml(r.contact)}`,
    r.type && `<b>Що потрібно:</b> ${escapeHtml(r.type)}`,
    r.budget && `<b>Бюджет:</b> ${escapeHtml(r.budget)}`,
    `<b>Мова сайту:</b> ${r.lang.toUpperCase()}`,
    "",
    escapeHtml(r.message),
  ]
    .filter((line): line is string => typeof line === "string")
    .join("\n");

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.error("[contact] Telegram відповів", res.status, await res.text());
      return { status: "error" };
    }
    return { status: "sent" };
  } catch (err) {
    console.error("[contact] не вдалося надіслати заявку", err);
    return { status: "error" };
  }
}
