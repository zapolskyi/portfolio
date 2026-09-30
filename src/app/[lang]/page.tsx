import { About } from "@/components/sections/about/About";
import { Contact } from "@/components/sections/contact/Contact";
import { Faq } from "@/components/sections/faq/Faq";
import { Hero } from "@/components/sections/hero/Hero";
import { Portfolio } from "@/components/sections/portfolio/Portfolio";
import { Process } from "@/components/sections/process/Process";
import { Projects } from "@/components/sections/projects/Projects";
import { Marquee } from "@/components/sections/marquee/Marquee";
import { Reviews } from "@/components/sections/reviews/Reviews";
import { Services } from "@/components/sections/services/Services";
import { Stats } from "@/components/sections/stats/Stats";
import { siteUrl, socials } from "@/config/site";
import type { Locale } from "@/i18n/config";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";

function personJsonLd(locale: Locale, role: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: locale === "en" ? "Nazar Zapolskyi" : "Назар Заполський",
    alternateName: locale === "en" ? "Назар Заполський" : "Nazar Zapolskyi",
    url: locale === "en" ? `${siteUrl}/en` : siteUrl,
    jobTitle: role,
    sameAs: [socials.github, socials.linkedin],
    knowsAbout: ["Next.js", "React", "WordPress", "WooCommerce", "Core Web Vitals", "WCAG 2.2"],
  };
}

export default async function Home() {
  const {
    hero,
    marquee,
    stats,
    work,
    services,
    process,
    portfolio,
    reviews,
    about,
    faq,
    contact,
    headings,
  } = await getDictionary();
  const locale = await getLocale();
  const home = locale === "en" ? "/en" : "/";

  return (
    <main id="main" tabIndex={-1}>
      <script
        type="application/ld+json"
        // Структуровані дані: хто автор сайту і які в нього профілі.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd(locale, hero.role)) }}
      />
      <Hero t={hero} home={home} />
      <Marquee items={marquee} />
      <Stats t={stats} />
      <Projects t={work} heading={headings.work} home={home} />
      <Services t={services} heading={headings.services} home={home} />
      <Process t={process} heading={headings.process} />
      <Portfolio t={portfolio} heading={headings.portfolio} home={home} />
      <Reviews t={reviews} heading={headings.reviews} />
      <About t={about} heading={headings.about} />
      <Faq t={faq} heading={headings.faq} />
      <Contact t={contact} heading={headings.contact} lang={locale} />
    </main>
  );
}
