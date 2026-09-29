import type { CSSProperties } from "react";
import { TypingHeading } from "@/components/typing-heading/TypingHeading";
import { Button } from "@/components/ui/Button";
import type { Dictionary } from "@/i18n/get-dictionary";
import styles from "./Hero.module.scss";
import { PhotoTilt } from "./PhotoTilt";
import { SpeedCard } from "./SpeedCard";

type Props = { t: Dictionary["hero"]; home: string };

const delay = (s: number) => ({ "--delay": `${s}s` }) as CSSProperties;

export function Hero({ t, home }: Props) {
  return (
    <section id="top" className={styles.hero}>
      <svg className={styles.hero__grain} aria-hidden="true">
        <filter id="hero-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="3"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#hero-grain)" />
      </svg>

      <div className={styles.hero__inner}>
        <div className={styles.hero__intro}>
          <TypingHeading
            as="p"
            trigger="load"
            cursor={false}
            className={styles.hero__greeting}
            before={
              <span className={styles.hero__prompt} aria-hidden="true">
                &gt;
              </span>
            }
            lines={[{ text: t.greeting }]}
            charTime={0.03}
          />
          <TypingHeading
            as="h1"
            trigger="load"
            className={styles.hero__title}
            lines={t.title}
            linesMobile={t.titleMobile}
            effect="ghost"
            charTime={0.045}
            delay={0.35}
            lineGap={0.06}
          />
          <p className={`${styles.hero__role} enter`} style={delay(0.35)}>
            {t.role}
          </p>
        </div>

        <PhotoTilt
          className={`${styles.hero__visual} enter`}
          photo={
            <>
              <div className={`${styles.hero__placeholder} hatch`}>
                <svg width="56" height="56" viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
                </svg>
                <span>{t.photo}</span>
                <span className={styles["hero__placeholder-hint"]}>{t.photoHint}</span>
              </div>
              <span className={styles.hero__glare} aria-hidden="true" />
              <span className={styles.hero__status}>
                <span className={styles.hero__pulse} aria-hidden="true" />
                {t.status}
              </span>
            </>
          }
        >
          {/* Дублює головну кнопку hero — для клавіатури й скрінрідерів прихований. */}
          <a
            href={`${home}#contact`}
            className={styles.hero__badge}
            aria-hidden="true"
            tabIndex={-1}
          >
            <svg className={styles["hero__badge-text"]} viewBox="0 0 132 132" aria-hidden="true">
              <defs>
                <path id="badge-circle" d="M66,66 m-50,0 a50,50 0 1,1 100,0 a50,50 0 1,1 -100,0" />
              </defs>
              <circle cx="66" cy="66" r="65" />
              <text>
                <textPath href="#badge-circle">{t.badge}</textPath>
              </text>
            </svg>
            <span className={styles["hero__badge-core"]} aria-hidden="true">
              ↗
            </span>
          </a>
          <SpeedCard t={t.speed} />
        </PhotoTilt>

        <div className={styles.hero__body}>
          <p className={styles.hero__lead}>{t.lead}</p>
          <div className={`${styles.hero__actions} enter`} style={delay(0.55)}>
            <Button href={`${home}#contact`} size="xl" arrow>
              {t.ctaPrimary}
            </Button>
            <Button
              href={`${home}#work`}
              size="xl"
              variant="secondary"
              className={styles["hero__cta-secondary"]}
            >
              {t.ctaSecondary}
            </Button>
          </div>
          <ul className={`${styles.hero__trust} enter`} style={delay(0.65)}>
            {t.trust.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
