import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, locales } from "@/i18n/config";

// UA відкривається без префікса: "/" → внутрішньо "/uk".
// "/uk/..." редиректимо на "/..." — одна адреса на сторінку.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const locale = locales.find((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));

  if (locale === defaultLocale) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(defaultLocale.length + 1) || "/";
    return NextResponse.redirect(url, 308);
  }

  if (locale) return;

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Пропускаємо службові шляхи, файли з розширенням і маршрути метаданих
  // (іконки, OG-картинки), які Next віддає напряму.
  matcher: ["/((?!api|_next|_vercel|apple-icon|icon|(?:uk|en)/opengraph-image|.*\\..*).*)"],
};
