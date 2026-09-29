import type { CSSProperties } from "react";
import { TypingHeading } from "@/components/typing-heading/TypingHeading";
import { SectionLabel } from "@/components/ui/SectionLabel";
import type { Dictionary } from "@/i18n/get-dictionary";
import { cx } from "@/lib/cx";
import styles from "./Process.module.scss";
import { ProcessScene } from "./ProcessScene";

type Props = { t: Dictionary["process"]; heading: Dictionary["headings"]["process"] };

export function Process({ t, heading }: Props) {
  return (
    <section id="process" className={styles.process} aria-labelledby="process-title">
      <div className={styles.process__inner}>
        <header className={cx(styles.process__header, "reveal")}>
          <SectionLabel index={3}>{heading.label}</SectionLabel>
          <TypingHeading
            id="process-title"
            lines={heading.lines}
            linesMobile={heading.linesMobile}
            className={styles.process__title}
          />
        </header>

        <ProcessScene>
          <ol className={styles.process__steps}>
            {t.steps.map((step, i) => (
              <li
                key={step.title}
                className={styles.process__step}
                style={{ "--sd": `${i * 0.9}s` } as CSSProperties}
              >
                <span className={styles.process__dot} aria-hidden="true" />
                <p className={styles.process__kicker}>{step.kicker}</p>
                <h3 className={styles["process__step-title"]}>{step.title}</h3>
                <p className={styles.process__text}>{step.text}</p>
              </li>
            ))}
          </ol>
        </ProcessScene>
      </div>
    </section>
  );
}
