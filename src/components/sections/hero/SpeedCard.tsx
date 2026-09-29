import type { CSSProperties } from "react";
import type { Dictionary } from "@/i18n/get-dictionary";
import styles from "./Hero.module.scss";

const CIRCUMFERENCE = 301.6; // 2π × 48
// Lighthouse TORQ (мобільна): Performance, Accessibility, Best Practices, SEO.
// Підписи — зрозумілою клієнту мовою (зі словника).
const scores = [99, 100, 100, 100];

type Props = { t: Dictionary["hero"]["speed"] };

export function SpeedCard({ t }: Props) {
  return (
    <>
      <div className={`${styles.hero__speed} enter`} style={{ "--delay": "0.4s" } as CSSProperties}>
        <div className={styles["hero__speed-head"]}>
          <span className={styles["hero__speed-title"]}>{t.title}</span>
          <span className={styles["hero__speed-lcp"]}>{t.lcp}</span>
        </div>
        <span className={styles["hero__speed-sub"]}>{t.sub}</span>
        <ul className={styles.hero__rings}>
          {scores.map((value, i) => (
            <li key={t.labels[i]} className={styles["hero__ring-item"]}>
              <span className={styles.hero__ring}>
                <svg width="56" height="56" viewBox="0 0 112 112" aria-hidden="true">
                  <circle cx="56" cy="56" r="48" className={styles["hero__ring-track"]} />
                  <circle
                    cx="56"
                    cy="56"
                    r="48"
                    className={styles["hero__ring-value"]}
                    style={
                      {
                        "--offset": CIRCUMFERENCE * (1 - value / 100),
                        animationDelay: i < 2 ? "0.5s" : "0.6s",
                      } as CSSProperties
                    }
                  />
                </svg>
                <span className={styles["hero__ring-num"]}>{value}</span>
              </span>
              <span className={styles["hero__ring-label"]}>{t.labels[i]}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles["hero__speed-short"]}>
        <span className={styles["hero__speed-short-num"]}>99</span>
        <span className={styles["hero__speed-short-text"]}>{t.short}</span>
      </div>
    </>
  );
}
