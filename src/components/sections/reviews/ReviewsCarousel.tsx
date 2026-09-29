"use client";

import { useEffect, useState } from "react";
import type { Dictionary } from "@/i18n/get-dictionary";
import { cx } from "@/lib/cx";
import styles from "./Reviews.module.scss";

// Карусель відгуків за патерном APG Carousel: кнопка «зупинити/увімкнути»
// першою у фокусі (WCAG 2.2.2), пауза при наведенні й фокусі, слайди з
// підписом «1 з 3»; без автопрокрутки при prefers-reduced-motion. Таймер — сама смуга прогресу:
// наступний відгук показуємо по animationend, пауза = animation-play-state.
export function ReviewsCarousel({ t }: { t: Dictionary["reviews"] }) {
  const count = t.items.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false); // наведення / фокус усередині
  const [stopped, setStopped] = useState(false); // користувач зупинив кнопкою
  const [reduced, setReduced] = useState(false);
  const [cycle, setCycle] = useState(0); // перезапуск смуги після ручного перемикання

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const autoplay = !paused && !stopped && !reduced;

  const go = (i: number) => {
    setIndex((i + count) % count);
    setCycle((c) => c + 1);
  };

  const item = t.items[index]!;
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div
      className={styles.reviews__carousel}
      role="group"
      aria-roledescription="carousel"
      aria-label={t.carousel}
    >
      <div className={styles.reviews__nav}>
        {!reduced && (
          <button
            type="button"
            className={styles.reviews__arrow}
            aria-label={stopped ? t.play : t.pause}
            onClick={() => setStopped((v) => !v)}
          >
            <span aria-hidden="true">{stopped ? "▶" : "❚❚"}</span>
          </button>
        )}
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
          <div
            key={index}
            role="group"
            aria-roledescription="slide"
            aria-label={t.slide.replace("{n}", String(index + 1)).replace("{total}", String(count))}
          >
            <figure className={styles.reviews__figure}>
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
            {!reduced && !stopped && (
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
    </div>
  );
}
