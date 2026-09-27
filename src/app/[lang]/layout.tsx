import type { Metadata } from "next";
import { Header } from "@/components/header/Header";
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
  const locale = await getLocale();
  const dict = await getDictionary();

  return (
    <html lang={locale} className={plexMono.variable} suppressHydrationWarning>
      <head>
        {/* Позначка «JS працює»: без неї анімований текст не ховається. */}
        <script
          dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }}
        />
      </head>
      <body>
        <Header lang={locale} nav={dict.nav} t={dict.header} />
        {children}
      </body>
    </html>
  );
}
