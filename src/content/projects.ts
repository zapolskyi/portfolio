// Проєкти для «Останніх проєктів». Тексти — у словниках (work.projects.<id>).
export type Metric = { value: string; label: "Perf" | "A11y" | "SEO" | "LCP" | "CLS" | "weight" };

export type Project = {
  id: "brix" | "torq" | "ploshchyna";
  name: string;
  short: string; // назва в мобільному перемикачі
  domain: string;
  github: string;
  caseHref?: string; // сторінка кейсу; поки немає — кнопку «Кейс» не показуємо
  metrics: [Metric, Metric, Metric];
  // Превью: намальований макет (brix) або заглушка до появи скріншота.
  preview: { kind: "brix" } | { kind: "placeholder"; title: string };
};

export const projects: Project[] = [
  {
    id: "brix",
    name: "BRIX 22°",
    short: "BRIX",
    domain: "brix.zapolskyi.com",
    github: "https://github.com/zapolskyi/brix",
    metrics: [
      { value: "98", label: "Perf" },
      { value: "100", label: "A11y" },
      { value: "1.9 s", label: "LCP" },
    ],
    preview: { kind: "brix" },
  },
  {
    id: "torq",
    name: "TORQ Service",
    short: "TORQ",
    domain: "torq.zapolskyi.com",
    github: "https://github.com/zapolskyi/torq",
    metrics: [
      { value: "99", label: "Perf" },
      { value: "100", label: "SEO" },
      { value: "2.2 s", label: "LCP" },
    ],
    // TODO(фаза 6): скріншот головної torq.zapolskyi.com
    preview: { kind: "placeholder", title: "TORQ" },
  },
  {
    id: "ploshchyna",
    name: "Ploshchyna",
    short: "Площина",
    domain: "ploshchyna.zapolskyi.com",
    github: "https://github.com/zapolskyi/ploshchyna",
    metrics: [
      { value: "0.88 s", label: "LCP" },
      { value: "0.002", label: "CLS" },
      { value: "280 KB", label: "weight" },
    ],
    // TODO(фаза 6): скріншот головної ploshchyna.zapolskyi.com
    preview: { kind: "placeholder", title: "Площина" },
  },
];
