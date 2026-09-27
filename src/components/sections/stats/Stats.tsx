import type { Dictionary } from "@/i18n/get-dictionary";
import { cx } from "@/lib/cx";
import styles from "./Stats.module.scss";

type Props = { t: Dictionary["stats"] };

export function Stats({ t }: Props) {
  return (
    <section aria-label={t.label} className={styles.stats}>
      <ul className={styles.grid}>
        {t.items.map((item) => (
          <li key={item.text} className={cx(styles.item, "reveal")}>
            <span className={cx(styles.value, "accent" in item && item.accent && styles.accent)}>
              {item.value}
              {item.unit && <span className={styles.unit}>{item.unit}</span>}
            </span>
            <span className={styles.text}>{item.text}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
