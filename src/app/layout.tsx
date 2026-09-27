import type { Metadata } from "next";
import { plexMono } from "./fonts";
import "@/styles/globals.scss";

export const metadata: Metadata = {
  title: "Назар Заполський — швидкі сайти, що продають",
  description:
    "Front-end розробник: сайти, лендинги та інтернет-магазини для малого бізнесу. Без конструкторів, Lighthouse 95+.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="uk" className={plexMono.variable}>
      <body>{children}</body>
    </html>
  );
}
