import type { CSSProperties } from "react";
import { TypingHeading } from "@/components/typing-heading/TypingHeading";
import { SectionLabel } from "@/components/ui/SectionLabel";
import type { Dictionary } from "@/i18n/get-dictionary";
import styles from "./Process.module.scss";
import { ProcessScene } from "./ProcessScene";

type Props = { t: Dictionary["process"]; heading: Dictionary["headings"]["process"] };

export function Process({ t, heading }: Props) {
  return (
    <section id="process" className={styles.section}>
      <div className={styles.inner}>
        <header className={`${styles.header} reveal`}>
          <SectionLabel index={3}>{heading.label}</SectionLabel>
          <TypingHeading
            lines={heading.lines}
            linesMobile={heading.linesMobile}
            className={styles.title}
          />
        </header>

        <ProcessScene>
          <ol className={styles.steps}>
            {t.steps.map((step, i) => (
              <li
                key={step.title}
                className={styles.step}
                style={{ "--sd": `${i * 0.9}s` } as CSSProperties}
              >
                <span className={styles.dot} aria-hidden="true" />
                <span className={styles.kicker}>{step.kicker}</span>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.text}>{step.text}</p>
              </li>
            ))}
          </ol>
        </ProcessScene>
      </div>
    </section>
  );
}
