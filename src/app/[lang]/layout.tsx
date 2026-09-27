import type { Metadata } from "next";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { locales } from "@/i18n/config";
import { plexMono } from "../fonts";
import "@/styles/globals.scss";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = await getDictionary();
  return {
    metadataBase: new URL("https://zapolskyi.com"),
    title: meta.title,
    description: meta.description,
    alternates: { languages: { uk: "/", en: "/en", "x-default": "/" } },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  return (
    <html lang={await getLocale()} className={plexMono.variable}>
      <body>{children}</body>
    </html>
  );
}
