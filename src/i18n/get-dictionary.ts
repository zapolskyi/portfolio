import { notFound } from "next/navigation";
import { lang } from "next/root-params";
import { hasLocale, type Locale } from "./config";
import type uk from "./dictionaries/uk.json";

export type Dictionary = typeof uk;

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  uk: () => import("./dictionaries/uk.json").then((m) => m.default),
  en: () => import("./dictionaries/en.json").then((m) => m.default),
};

export async function getLocale(): Promise<Locale> {
  const locale = await lang();
  if (!hasLocale(locale)) notFound();
  return locale;
}

export async function getDictionary(): Promise<Dictionary> {
  return dictionaries[await getLocale()]();
}
