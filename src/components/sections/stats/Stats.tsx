import type { Dictionary } from "@/i18n/get-dictionary";
import { cx } from "@/lib/cx";
import styles from "./Stats.module.scss";

type Props = { t: Dictionary["stats"] };

export function Stats({ t }: Props) {
  return (
    <section aria-label={t.label} className={styles.stats}>
      <ul className={styles.stats__grid}>
        {t.items.map((item) => (
          <li key={item.text} className={cx(styles.stats__item, "reveal")}>
            <span
              className={cx(
                styles.stats__value,
                "accent" in item && item.accent && styles["stats__value--accent"],
              )}
            >
              {item.value}
              {item.unit && <span className={styles.stats__unit}>{item.unit}</span>}
            </span>
            <span className={styles.stats__text}>{item.text}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
