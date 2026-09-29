import { TypingHeading } from "@/components/typing-heading/TypingHeading";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { projects } from "@/content/projects";
import type { Dictionary } from "@/i18n/get-dictionary";
import { ProjectShowcase } from "./ProjectShowcase";
import styles from "./Projects.module.scss";

type Props = { t: Dictionary["work"]; heading: Dictionary["headings"]["work"]; home: string };

export function Projects({ t, heading, home }: Props) {
  return (
    <section id="work" className={styles.projects}>
      <div className={styles.projects__inner}>
        <header className={`${styles.projects__header} reveal`}>
          <div className={styles["projects__label-row"]}>
            <SectionLabel index={1}>{heading.label}</SectionLabel>
            <span className={styles.projects__hint}>{t.hint}</span>
          </div>
          <TypingHeading
            lines={heading.lines}
            className={styles.projects__title}
            after={
              <span className={styles.projects__count}>
                ({String(projects.length).padStart(2, "0")})
              </span>
            }
          />
        </header>
        <div className="reveal">
          <ProjectShowcase projects={projects} t={t} home={home} />
        </div>
      </div>
    </section>
  );
}
