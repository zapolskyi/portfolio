import { Hero } from "@/components/sections/hero/Hero";
import { Portfolio } from "@/components/sections/portfolio/Portfolio";
import { Process } from "@/components/sections/process/Process";
import { Projects } from "@/components/sections/projects/Projects";
import { Marquee } from "@/components/sections/marquee/Marquee";
import { Services } from "@/components/sections/services/Services";
import { Stats } from "@/components/sections/stats/Stats";
import { TypingHeading } from "@/components/typing-heading/TypingHeading";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import styles from "./page.module.scss";

// Тимчасовий каркас: секції з якорями й заголовками для шапки та скролбара.
// Наповнення секцій — фаза 4.
const placeholders = [
  { id: "reviews", size: "md" },
  { id: "about", size: "md" },
  { id: "faq", size: "md" },
  { id: "contact", size: "xxl" },
] as const;

export default async function Home() {
  const { hero, marquee, stats, work, services, process, portfolio, headings } =
    await getDictionary();
  const home = (await getLocale()) === "en" ? "/en" : "/";

  return (
    <main id="main">
      <Hero t={hero} home={home} />
      <Marquee items={marquee} />
      <Stats t={stats} />
      <Projects t={work} heading={headings.work} home={home} />
      <Services t={services} heading={headings.services} home={home} />
      <Process t={process} heading={headings.process} />
      <Portfolio t={portfolio} heading={headings.portfolio} home={home} />

      {placeholders.map(({ id, size }, i) => {
        const heading = headings[id];
        return (
          <section key={id} id={id} className={styles.section}>
            <Container className={styles.stack}>
              <SectionLabel index={i + 5}>{heading.label}</SectionLabel>
              <TypingHeading lines={heading.lines} className={styles[size]} />
            </Container>
          </section>
        );
      })}
    </main>
  );
}
