import { TypingHeading } from "@/components/typing-heading/TypingHeading";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Tag } from "@/components/ui/Tag";
import type { Dictionary } from "@/i18n/get-dictionary";
import { cx } from "@/lib/cx";
import { ChooseService } from "./ChooseService";
import styles from "./Services.module.scss";

type Props = {
  t: Dictionary["services"];
  heading: Dictionary["headings"]["services"];
  home: string;
};

export function Services({ t, heading, home }: Props) {
  return (
    <section id="services" className={styles.section}>
      <div className={styles.inner}>
        <header className={cx(styles.header, "reveal")}>
          <div className={styles.titles}>
            <SectionLabel index={2}>{heading.label}</SectionLabel>
            <TypingHeading lines={heading.lines} className={styles.title} />
          </div>
          <p className={styles.lead}>{t.lead}</p>
        </header>

        <ul className={styles.grid}>
          {t.items.map((item, i) => (
            <li key={item.title} className={cx(styles.card, "reveal")}>
              <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.text}>{item.text}</p>
              <div className={styles.tags}>
                {item.tags.map((tag) => (
                  <Tag key={tag} variant="feature">
                    {tag}
                  </Tag>
                ))}
              </div>
              <div className={styles.footer}>
                <span className={styles.price}>
                  <span className={styles.from}>{t.from} </span>
                  <span className={styles.amount}>{item.price}</span>
                  <span className={styles.term}>{item.term}</span>
                </span>
                <ChooseService index={i} href={`${home}#contact`} label={t.choose} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
