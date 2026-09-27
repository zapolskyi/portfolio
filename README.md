# zapolskyi.com

Портфоліо front-end розробника Назара Заполського: швидкі сайти й інтернет-магазини для малого бізнесу. Стиль — **Amber Terminal**: темний фон, моноширинний шрифт IBM Plex Mono, бурштиновий акцент.

## Стек

Next.js 16 (App Router) · React 19 · TypeScript · SCSS Modules · Motion · Lucide · Vercel

## Цілі якості

- Lighthouse mobile ≥ 95 за всіма категоріями
- LCP < 1.5 s, CLS < 0.05
- WCAG 2.2 AA

## Розробка

Потрібен Node.js 22 (`.nvmrc`).

```bash
npm ci            # встановити залежності
npm run dev       # http://localhost:3000 (UA), /en (EN)
npm run check     # ESLint + TypeScript + Prettier
npm run build     # продакшен-збірка
npm run format    # відформатувати код
```

## Структура

```
src/
  app/[lang]/     сторінки й кореневий layout (uk, en)
  i18n/           мови, словники, getDictionary()
  styles/         токени, міксини, глобальні стилі
  proxy.ts        UA без префікса, EN — /en
```
