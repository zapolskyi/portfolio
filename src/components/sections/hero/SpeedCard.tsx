import type { CSSProperties } from "react";
import type { Dictionary } from "@/i18n/get-dictionary";
import styles from "./Hero.module.scss";

const CIRCUMFERENCE = 301.6; // 2π × 48
const scores = [
  { label: "Perf", value: 99 },
  { label: "A11y", value: 100 },
  { label: "Best Pr.", value: 100 },
  { label: "SEO", value: 100 },
];

type Props = { t: Dictionary["hero"]["speed"] };

export function SpeedCard({ t }: Props) {
  return (
    <>
      <div className={`${styles.speed} enter`} style={{ "--delay": "0.6s" } as CSSProperties}>
        <div className={styles.speedHead}>
          <span className={styles.speedTitle}>{t.title}</span>
          <span className={styles.speedLcp}>{t.lcp}</span>
        </div>
        <span className={styles.speedSub}>{t.sub}</span>
        <ul className={styles.rings}>
          {scores.map(({ label, value }, i) => (
            <li key={label} className={styles.ringItem}>
              <span className={styles.ring}>
                <svg width="56" height="56" viewBox="0 0 112 112" aria-hidden="true">
                  <circle cx="56" cy="56" r="48" className={styles.ringTrack} />
                  <circle
                    cx="56"
                    cy="56"
                    r="48"
                    className={styles.ringValue}
                    style={
                      {
                        "--offset": CIRCUMFERENCE * (1 - value / 100),
                        animationDelay: i < 2 ? "0.72s" : "0.84s",
                      } as CSSProperties
                    }
                  />
                </svg>
                <span className={styles.ringNum}>{value}</span>
              </span>
              <span className={styles.ringLabel}>{label}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.speedShort}>
        <span className={styles.speedShortNum}>99</span>
        <span className={styles.speedShortText}>{t.short}</span>
      </div>
    </>
  );
}
