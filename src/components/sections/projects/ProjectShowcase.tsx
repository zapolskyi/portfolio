"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/Button";
import type { Project } from "@/content/projects";
import type { Dictionary } from "@/i18n/get-dictionary";
import { cx } from "@/lib/cx";
import { BrixMock } from "./BrixMock";
import styles from "./Projects.module.scss";

type Props = { projects: Project[]; t: Dictionary["work"]; home: string };

const pad = (n: number) => String(n).padStart(2, "0");

export function ProjectShowcase({ projects, t, home }: Props) {
  const [active, setActive] = useState(0);
  const previewId = useId();
  const project = projects[active]!;
  const copy = t.projects[project.id];

  return (
    <div className={styles.projects__showcase}>
      {/* Десктоп: список, вибір наведенням, фокусом або кліком */}
      <div className={styles.projects__list}>
        <div className={styles.projects__rows}>
          {projects.map((p, i) => (
            <button
              key={p.id}
              type="button"
              className={cx(styles.projects__row, i === active && styles["projects__row--active"])}
              aria-pressed={i === active}
              aria-controls={previewId}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
            >
              <span className={styles["projects__row-idx"]}>{pad(i + 1)}</span>
              <span className={styles["projects__row-body"]}>
                <span className={styles["projects__row-name"]}>{p.name}</span>
                <span className={styles["projects__row-type"]}>{t.projects[p.id].type}</span>
              </span>
              <span className={styles["projects__row-arrow"]} aria-hidden="true">
                →
              </span>
            </button>
          ))}
        </div>
        <div className={styles.projects__progress} aria-hidden="true">
          <span className={styles.projects__bars}>
            {projects.map((p, i) => (
              <span
                key={p.id}
                className={cx(
                  styles.projects__bar,
                  i === active && styles["projects__bar--active"],
                )}
              />
            ))}
          </span>
          <span>
            {pad(active + 1)} / {pad(projects.length)}
          </span>
        </div>
        <a className={styles["projects__all-code"]} href="https://github.com/zapolskyi">
          {t.allCode} <span aria-hidden="true">↗</span>
        </a>
      </div>

      {/* До 1280px: перемикач */}
      <div role="group" aria-label={t.pick} className={styles.projects__segmented}>
        {projects.map((p, i) => (
          <button
            key={p.id}
            type="button"
            aria-pressed={i === active}
            aria-controls={previewId}
            onClick={() => setActive(i)}
          >
            {p.short}
          </button>
        ))}
      </div>

      <article id={previewId} className={styles.projects__card} aria-label={project.name}>
        <div key={project.id} className={styles.projects__swap}>
          <div className={styles.projects__browser}>
            <div className={styles["projects__browser-bar"]}>
              <span className={styles.projects__dots} aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <span className={styles.projects__domain}>{project.domain}</span>
            </div>
            <div className={styles.projects__screen}>
              {project.preview.kind === "brix" ? (
                <BrixMock />
              ) : (
                <div className={`${styles.projects__placeholder} hatch`}>
                  <span className={styles["projects__placeholder-title"]}>
                    {project.preview.title}
                  </span>
                  <span className={styles["projects__placeholder-hint"]}>
                    [{t.screenshot} {project.domain}]
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className={styles.projects__details}>
            <div className={styles["projects__card-head"]}>
              <h3 className={styles["projects__card-name"]}>{project.name}</h3>
              <span className={styles["projects__card-type"]}>{copy.short}</span>
            </div>
            <p className={styles["projects__card-text"]}>{copy.text}</p>
            <div className={styles.projects__meta}>
              <dl className={styles.projects__metrics}>
                {project.metrics.map((m) => (
                  <div key={m.label}>
                    <dt>{m.label === "weight" ? t.weight : m.label}</dt>
                    <dd>{m.value}</dd>
                  </div>
                ))}
              </dl>
              <div className={styles.projects__links}>
                {/* TODO(фаза 9): сторінки кейсів */}
                <Button
                  href={`${home}#work`}
                  size="md"
                  arrow
                  className={styles["projects__case-link"]}
                >
                  <span className={styles["projects__case-short"]}>{t.case}</span>
                  <span className={styles["projects__case-long"]}>{t.caseLong}</span>
                </Button>
                <Button href={`https://${project.domain}`} size="md" variant="secondary">
                  {t.demo} <span aria-hidden="true">↗</span>
                </Button>
                <Button
                  href={project.github}
                  size="md"
                  variant="secondary"
                  className={styles["projects__github-link"]}
                >
                  GitHub <span aria-hidden="true">↗</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
