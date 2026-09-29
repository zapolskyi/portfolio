import { TypingHeading } from "@/components/typing-heading/TypingHeading";
import { SectionLabel } from "@/components/ui/SectionLabel";
import type { Dictionary } from "@/i18n/get-dictionary";
import styles from "./Faq.module.scss";

type Props = { t: Dictionary["faq"]; heading: Dictionary["headings"]["faq"] };

// Акордеон на нативних <details name>: відкрите одне питання, без JS,
// клавіатура й скрінрідери підтримуються браузером.
export function Faq({ t, heading }: Props) {
  return (
    <section id="faq" className={styles.section}>
      <div className={styles.inner}>
        <div className={`${styles.intro} reveal`}>
          <SectionLabel index={7}>{heading.label}</SectionLabel>
          <TypingHeading lines={heading.lines} className={styles.title} />
          <p className={styles.lead}>{t.lead}</p>
        </div>

        <div className={`${styles.list} reveal`}>
          {t.items.map((item, i) => (
            <details key={item.q} name="faq" open={i === 0} className={styles.item}>
              <summary className={styles.question}>
                <span className={styles.q}>{item.q}</span>
                <span className={styles.icon} aria-hidden="true">
                  +
                </span>
              </summary>
              <p className={styles.answer}>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
