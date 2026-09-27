export const siteUrl = "https://zapolskyi.com";

// Секції сторінки в порядку появи. `nav` — чи є пункт у меню шапки.
export const sections = [
  { id: "top", nav: false },
  { id: "work", nav: true },
  { id: "services", nav: true },
  { id: "process", nav: false },
  { id: "portfolio", nav: true },
  { id: "reviews", nav: true },
  { id: "about", nav: true },
  { id: "faq", nav: true },
  { id: "contact", nav: false },
] as const;

export type SectionId = (typeof sections)[number]["id"];

// Порядок пунктів меню в шапці відрізняється від порядку секцій (як у макеті).
export const navOrder = [
  "work",
  "portfolio",
  "services",
  "reviews",
  "about",
  "faq",
] as const satisfies readonly SectionId[];

export const socials = {
  github: "https://github.com/zapolskyi",
  linkedin: "https://www.linkedin.com/in/nazarzapolskyi/",
  // TODO(фаза 6): замінити на https://t.me/<username>
  telegram: "#contact",
} as const;
