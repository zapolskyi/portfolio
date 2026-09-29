"use client";

import { useEffect, useState } from "react";
import type { Dictionary } from "@/i18n/get-dictionary";
import { cx } from "@/lib/cx";
import styles from "./Reviews.module.scss";

// Карусель відгуків: автопрокрутка 6.5 с, пауза при наведенні й фокусі,
// без автопрокрутки при prefers-reduced-motion. Таймер — сама смуга прогресу:
// наступний відгук показуємо по animationend, пауза = animation-play-state.
export function ReviewsCarousel({ t }: { t: Dictionary["reviews"] }) {
  const count = t.items.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [cycle, setCycle] = useState(0); // перезапуск смуги після ручного перемикання

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const autoplay = !paused && !reduced;

  const go = (i: number) => {
    setIndex((i + count) % count);
    setCycle((c) => c + 1);
  };

  const item = t.items[index]!;
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <>
      <div className={styles.reviews__nav}>
        <button
          type="button"
          className={styles.reviews__arrow}
          aria-label={t.prev}
          onClick={() => go(index - 1)}
        >
          ←
        </button>
        <button
          type="button"
          className={styles.reviews__arrow}
          aria-label={t.next}
          onClick={() => go(index + 1)}
        >
          →
        </button>
        <span className={styles.reviews__counter} aria-hidden="true">
          {pad(index + 1)} / {pad(count)}
        </span>
      </div>

      <div
        className={styles.reviews__card}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        <span className={styles.reviews__mark} aria-hidden="true">
          ”
        </span>
        <div aria-live={autoplay ? "off" : "polite"}>
          <figure key={index} className={styles.reviews__figure}>
            <blockquote className={styles.reviews__quote}>{item.quote}</blockquote>
            <figcaption className={styles.reviews__caption}>
              <span className={styles.reviews__person}>
                <span className={`${styles.reviews__avatar} hatch`} aria-hidden="true">
                  {item.initials}
                </span>
                <span className={styles.reviews__who}>
                  <span className={styles.reviews__name}>{item.name}</span>
                  <span className={styles.reviews__role}>{item.role}</span>
                </span>
              </span>
              <span className={styles.reviews__project}>
                {t.project}: {item.project}
              </span>
            </figcaption>
          </figure>
        </div>

        <div className={styles.reviews__footer}>
          <div className={styles.reviews__dots}>
            {t.items.map((_, i) => (
              <button
                key={i}
                type="button"
                className={cx(styles.reviews__dot, i === index && styles["reviews__dot--active"])}
                aria-label={t.goTo.replace("{n}", String(i + 1))}
                aria-current={i === index ? "true" : undefined}
                onClick={() => go(i)}
              />
            ))}
          </div>
          <div className={styles.reviews__progress} aria-hidden="true">
            {!reduced && (
              <span
                key={`${index}-${cycle}`}
                className={cx(
                  styles["reviews__progress-fill"],
                  paused && styles["reviews__progress-fill--paused"],
                )}
                onAnimationEnd={() => setIndex((i) => (i + 1) % count)}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
