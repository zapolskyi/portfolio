export const locales = ["uk", "en"] as const;
export type Locale = (typeof locales)[number];

// UA — основна мова, живе в корені сайту без префікса: / (uk) і /en (en).
export const defaultLocale: Locale = "uk";

export const hasLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);
