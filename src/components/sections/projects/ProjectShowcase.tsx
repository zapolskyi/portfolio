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
    <div className={styles.showcase}>
      {/* Десктоп: список, вибір наведенням, фокусом або кліком */}
      <div className={styles.list}>
        <div className={styles.rows}>
          {projects.map((p, i) => (
            <button
              key={p.id}
              type="button"
              className={cx(styles.row, i === active && styles.rowOn)}
              aria-pressed={i === active}
              aria-controls={previewId}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
            >
              <span className={styles.rowIdx}>{pad(i + 1)}</span>
              <span className={styles.rowBody}>
                <span className={styles.rowName}>{p.name}</span>
                <span className={styles.rowType}>{t.projects[p.id].type}</span>
              </span>
              <span className={styles.rowArrow} aria-hidden="true">
                →
              </span>
            </button>
          ))}
        </div>
        <div className={styles.progress} aria-hidden="true">
          <span className={styles.bars}>
            {projects.map((p, i) => (
              <span key={p.id} className={cx(styles.bar, i === active && styles.barOn)} />
            ))}
          </span>
          <span>
            {pad(active + 1)} / {pad(projects.length)}
          </span>
        </div>
        <a className={styles.allCode} href="https://github.com/zapolskyi">
          {t.allCode} <span aria-hidden="true">↗</span>
        </a>
      </div>

      {/* До 1280px: перемикач */}
      <div role="group" aria-label={t.pick} className={styles.segmented}>
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

      <article id={previewId} className={styles.card} aria-label={project.name}>
        <div key={project.id} className={styles.swap}>
          <div className={styles.browser}>
            <div className={styles.browserBar}>
              <span className={styles.dots} aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <span className={styles.domain}>{project.domain}</span>
            </div>
            <div className={styles.screen}>
              {project.preview.kind === "brix" ? (
                <BrixMock />
              ) : (
                <div className={`${styles.placeholder} hatch`}>
                  <span className={styles.placeholderTitle}>{project.preview.title}</span>
                  <span className={styles.placeholderHint}>
                    [{t.screenshot} {project.domain}]
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className={styles.details}>
            <div className={styles.cardHead}>
              <h3 className={styles.cardName}>{project.name}</h3>
              <span className={styles.cardType}>{copy.short}</span>
            </div>
            <p className={styles.cardText}>{copy.text}</p>
            <div className={styles.meta}>
              <dl className={styles.metrics}>
                {project.metrics.map((m) => (
                  <div key={m.label}>
                    <dt>{m.label === "weight" ? t.weight : m.label}</dt>
                    <dd>{m.value}</dd>
                  </div>
                ))}
              </dl>
              <div className={styles.links}>
                {/* TODO(фаза 9): сторінки кейсів */}
                <Button href={`${home}#work`} size="md" arrow className={styles.caseLink}>
                  <span className={styles.caseShort}>{t.case}</span>
                  <span className={styles.caseLong}>{t.caseLong}</span>
                </Button>
                <Button href={`https://${project.domain}`} size="md" variant="secondary">
                  {t.demo} <span aria-hidden="true">↗</span>
                </Button>
                <Button
                  href={project.github}
                  size="md"
                  variant="secondary"
                  className={styles.githubLink}
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
