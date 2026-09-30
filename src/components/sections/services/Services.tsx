import { SectionHeading } from "@/components/ui/SectionHeading";
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
    <section id="services" className={styles.services} aria-labelledby="services-title">
      <div className={styles.services__inner}>
        <header className={cx(styles.services__header, "reveal")}>
          <SectionHeading index={2} id="services-title" heading={heading} />
          <p className={styles.services__lead}>{t.lead}</p>
        </header>

        <ul className={styles.services__grid}>
          {t.items.map((item, i) => (
            <li key={item.title} className={cx(styles.services__card, "reveal")}>
              <span className={styles.services__num}>{String(i + 1).padStart(2, "0")}</span>
              <h3 className={styles["services__card-title"]}>{item.title}</h3>
              <p className={styles.services__text}>{item.text}</p>
              <div className={styles.services__tags}>
                {item.tags.map((tag) => (
                  <Tag key={tag} variant="feature">
                    {tag}
                  </Tag>
                ))}
              </div>
              <div className={styles.services__footer}>
                <p className={styles.services__price}>
                  <span className={styles.services__from}>{t.from} </span>
                  <span className={styles.services__amount}>{item.price}</span>
                  <span className={styles.services__term}>{item.term}</span>
                </p>
                <ChooseService index={i} href={`${home}#contact`} label={t.choose} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
