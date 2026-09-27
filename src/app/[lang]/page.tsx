import { TypingHeading } from "@/components/typing-heading/TypingHeading";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { getDictionary } from "@/i18n/get-dictionary";
import styles from "./page.module.scss";

// Тимчасовий каркас: секції з якорями й заголовками для шапки та скролбара.
// Наповнення секцій — фази 3–4.
const placeholders = [
  { id: "work", size: "xl" },
  { id: "services", size: "md" },
  { id: "process", size: "md" },
  { id: "portfolio", size: "xl" },
  { id: "reviews", size: "md" },
  { id: "about", size: "md" },
  { id: "faq", size: "md" },
  { id: "contact", size: "xxl" },
] as const;

export default async function Home() {
  const { hero, headings } = await getDictionary();

  return (
    <main id="main">
      <section id="top" className={styles.hero}>
        <Container>
          <TypingHeading as="h1" trigger="load" lines={hero.title} className={styles.h1} />
          <p className={styles.role}>{hero.role}</p>
        </Container>
      </section>

      {placeholders.map(({ id, size }, i) => {
        const heading = headings[id];
        return (
          <section key={id} id={id} className={styles.section}>
            <Container className={styles.stack}>
              <SectionLabel index={i + 1}>{heading.label}</SectionLabel>
              <TypingHeading lines={heading.lines} className={styles[size]} />
            </Container>
          </section>
        );
      })}
    </main>
  );
}
