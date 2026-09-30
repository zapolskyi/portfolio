import type { Metadata } from "next";
import { NotFoundScreen } from "@/components/not-found/NotFoundScreen";
import { plexMono } from "./fonts";
import "@/styles/globals.scss";

export const metadata: Metadata = {
  title: "404 — сторінку не знайдено · zapolskyi.",
  robots: { index: false },
};

// Для неіснуючих адрес. Рендериться в обхід layout, тож мова невідома —
// сторінка двомовна (основна українська + рядок англійською).
export default function GlobalNotFound() {
  return (
    <html lang="uk" className={plexMono.variable}>
      <body>
        <NotFoundScreen />
      </body>
    </html>
  );
}
