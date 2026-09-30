import { SectionHeading } from "@/components/ui/SectionHeading";
import { projects } from "@/content/projects";
import type { Dictionary } from "@/i18n/get-dictionary";
import { ProjectShowcase } from "./ProjectShowcase";
import styles from "./Projects.module.scss";

type Props = { t: Dictionary["work"]; heading: Dictionary["headings"]["work"]; home: string };

export function Projects({ t, heading, home }: Props) {
  return (
    <section id="work" className={styles.projects} aria-labelledby="work-title">
      <div className={styles.projects__inner}>
        <header className={`${styles.projects__header} reveal`}>
          <SectionHeading index={1} id="work-title" heading={heading} />
          <p className={styles.projects__hint}>{t.hint}</p>
        </header>
        <div className="reveal">
          <ProjectShowcase projects={projects} t={t} home={home} />
        </div>
      </div>
    </section>
  );
}
