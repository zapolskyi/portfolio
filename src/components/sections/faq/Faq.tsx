import { TypingHeading } from "@/components/typing-heading/TypingHeading";
import { SectionLabel } from "@/components/ui/SectionLabel";
import type { Dictionary } from "@/i18n/get-dictionary";
import styles from "./Faq.module.scss";

type Props = { t: Dictionary["faq"]; heading: Dictionary["headings"]["faq"] };

// Акордеон на нативних <details name>: відкрите одне питання, без JS,
// клавіатура й скрінрідери підтримуються браузером.
export function Faq({ t, heading }: Props) {
  return (
    <section id="faq" className={styles.faq}>
      <div className={styles.faq__inner}>
        <div className={`${styles.faq__intro} reveal`}>
          <SectionLabel index={7}>{heading.label}</SectionLabel>
          <TypingHeading lines={heading.lines} className={styles.faq__title} />
          <p className={styles.faq__lead}>{t.lead}</p>
        </div>

        <div className={`${styles.faq__list} reveal`}>
          {t.items.map((item, i) => (
            <details key={item.q} name="faq" open={i === 0} className={styles.faq__item}>
              <summary className={styles.faq__question}>
                <span className={styles["faq__question-text"]}>{item.q}</span>
                <span className={styles.faq__icon} aria-hidden="true">
                  +
                </span>
              </summary>
              <p className={styles.faq__answer}>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
