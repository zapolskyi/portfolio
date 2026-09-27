import type { CSSProperties } from "react";
import { TypingHeading } from "@/components/typing-heading/TypingHeading";
import { Button } from "@/components/ui/Button";
import type { Dictionary } from "@/i18n/get-dictionary";
import { CraneScene } from "./CraneScene";
import styles from "./Hero.module.scss";
import { PhotoTilt } from "./PhotoTilt";
import { SpeedCard } from "./SpeedCard";

type Props = { t: Dictionary["hero"]; home: string };

const delay = (s: number) => ({ "--delay": `${s}s` }) as CSSProperties;

export function Hero({ t, home }: Props) {
  return (
    <section id="top" className={styles.hero}>
      <CraneScene />

      <div className={styles.inner}>
        <div className={styles.intro}>
          <TypingHeading
            as="p"
            trigger="load"
            cursor={false}
            className={styles.greeting}
            before={
              <span className={styles.prompt} aria-hidden="true">
                &gt;
              </span>
            }
            lines={[{ text: t.greeting }]}
            charTime={0.05}
            delay={0.3}
          />
          <TypingHeading
            as="h1"
            trigger="load"
            className={styles.title}
            lines={t.title}
            linesMobile={t.titleMobile}
            charTime={0.085}
            delay={1.25}
            lineGap={0.1}
          />
          <p className={`${styles.role} enter`} style={delay(3.44)}>
            {t.role}
          </p>
        </div>

        <PhotoTilt
          className={`${styles.visual} enter`}
          photo={
            <>
              <div className={`${styles.placeholder} hatch`}>
                <svg width="56" height="56" viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
                </svg>
                <span>{t.photo}</span>
                <span className={styles.placeholderHint}>{t.photoHint}</span>
              </div>
              <span className={styles.glare} aria-hidden="true" />
              <span className={styles.status}>
                <span className={styles.pulse} aria-hidden="true" />
                {t.status}
              </span>
            </>
          }
        >
          <a href={`${home}#contact`} className={styles.badge} aria-label={t.ctaPrimary}>
            <svg className={styles.badgeText} viewBox="0 0 132 132" aria-hidden="true">
              <defs>
                <path id="badge-circle" d="M66,66 m-50,0 a50,50 0 1,1 100,0 a50,50 0 1,1 -100,0" />
              </defs>
              <circle cx="66" cy="66" r="65" />
              <text>
                <textPath href="#badge-circle">{t.badge}</textPath>
              </text>
            </svg>
            <span className={styles.badgeCore} aria-hidden="true">
              ↗
            </span>
          </a>
          <SpeedCard t={t.speed} />
        </PhotoTilt>

        <div className={styles.body}>
          <p className={`${styles.lead} enter`} style={delay(3.64)}>
            {t.lead}
          </p>
          <div className={`${styles.actions} enter`} style={delay(3.84)}>
            <Button href={`${home}#contact`} size="xl" arrow>
              {t.ctaPrimary}
            </Button>
            <Button
              href={`${home}#work`}
              size="xl"
              variant="secondary"
              className={styles.secondary}
            >
              {t.ctaSecondary}
            </Button>
          </div>
          <ul className={`${styles.trust} enter`} style={delay(4.04)}>
            {t.trust.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
