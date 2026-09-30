import type { Metadata } from "next";
import { Footer } from "@/components/footer/Footer";
import { Header } from "@/components/header/Header";
import { PointField } from "@/components/point-field/PointField";
import { ScrollRail } from "@/components/scroll-rail/ScrollRail";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { siteUrl } from "@/config/site";
import { locales } from "@/i18n/config";
import { plexMono } from "../fonts";
import "@/styles/globals.scss";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = await getDictionary();
  const locale = await getLocale();
  const path = locale === "en" ? "/en" : "/";
  return {
    metadataBase: new URL(siteUrl),
    title: meta.title,
    description: meta.description,
    authors: [{ name: "Nazar Zapolskyi", url: siteUrl }],
    alternates: {
      canonical: path,
      languages: { uk: "/", en: "/en", "x-default": "/" },
    },
    // og:image додає opengraph-image.tsx поруч.
    openGraph: {
      type: "website",
      url: path,
      siteName: "zapolskyi.com",
      title: meta.title,
      description: meta.description,
      locale: locale === "en" ? "en_US" : "uk_UA",
      alternateLocale: locale === "en" ? ["uk_UA"] : ["en_US"],
    },
    twitter: { card: "summary_large_image", title: meta.title, description: meta.description },
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
        <a href="#main" className="skip-link">
          {dict.header.skip}
        </a>
        <PointField />
        <Header lang={locale} nav={dict.nav} t={dict.header} />
        {children}
        <Footer t={dict.footer} copy={dict.contact} home={locale === "en" ? "/en" : "/"} />
        <ScrollRail t={dict.rail} sectionNames={dict.sections} />
      </body>
    </html>
  );
}
