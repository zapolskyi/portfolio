// Картки слайдера «Усі роботи». Тексти — у словниках (portfolio.cards.<id>).
// category: 1 — магазини, 2 — сайти, 3 — лендинги, 4 — React (індекс фільтра).
export type PortfolioCard = {
  id: "brix" | "torq" | "ploshchyna" | "react";
  name?: string; // для react — зі словника, поки проєкт не додано
  stack: string;
  category: 1 | 2 | 3 | 4;
  href: string;
  link: "demo" | "github";
  media: "brix" | "placeholder" | "react";
  placeholderTitle?: string;
  domain?: string;
};

export const portfolio: PortfolioCard[] = [
  {
    id: "brix",
    name: "BRIX 22°",
    stack: "WooCommerce",
    category: 1,
    href: "https://brix.zapolskyi.com",
    link: "demo",
    media: "brix",
  },
  {
    id: "torq",
    name: "TORQ Service",
    stack: "WordPress",
    category: 2,
    href: "https://torq.zapolskyi.com",
    link: "demo",
    media: "placeholder",
    placeholderTitle: "TORQ",
    domain: "torq.zapolskyi.com",
  },
  {
    id: "ploshchyna",
    name: "Ploshchyna",
    stack: "WordPress",
    category: 3,
    href: "https://ploshchyna.zapolskyi.com",
    link: "demo",
    media: "placeholder",
    placeholderTitle: "Площина",
    domain: "ploshchyna.zapolskyi.com",
  },
  {
    // TODO(фаза 6): реальний React-проєкт — назва, посилання, скріншот
    id: "react",
    stack: "React · Vite",
    category: 4,
    href: "https://github.com/zapolskyi",
    link: "github",
    media: "react",
  },
];
