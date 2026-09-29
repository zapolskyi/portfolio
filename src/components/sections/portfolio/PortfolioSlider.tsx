"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
} from "react";
import { TypingHeading } from "@/components/typing-heading/TypingHeading";
import { Chip } from "@/components/ui/Chip";
import type { PortfolioCard } from "@/content/portfolio";
import type { Dictionary } from "@/i18n/get-dictionary";
import { cx } from "@/lib/cx";
import styles from "./Portfolio.module.scss";

type Props = {
  cards: PortfolioCard[];
  t: Dictionary["portfolio"];
  heading: Dictionary["headings"]["portfolio"];
  home: string;
};

const pad = (n: number) => String(n).padStart(2, "0");

export function PortfolioSlider({ cards, t, heading, home }: Props) {
  const [filter, setFilter] = useState(0);
  const [track, setTrack] = useState({ progress: 0, visible: 0.6, index: 0 });
  const [dragging, setDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);

  const shown = cards.filter((c) => filter === 0 || c.category === filter);
  const total = shown.length + 1; // + картка «Тут може бути ваш сайт»

  // Крок прокрутки = ширина картки + проміжок.
  const step = () => {
    const el = trackRef.current;
    const card = el?.firstElementChild as HTMLElement | null;
    if (!el || !card) return 444;
    return card.offsetWidth + parseFloat(getComputedStyle(el).columnGap || "24");
  };

  const measure = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = Math.max(0, el.scrollWidth - el.clientWidth);
    setTrack({
      progress: max ? el.scrollLeft / max : 0,
      visible: el.scrollWidth ? Math.min(1, el.clientWidth / el.scrollWidth) : 1,
      index: Math.round(el.scrollLeft / step()),
    });
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure, filter]);

  const pickFilter = (i: number) => {
    setFilter(i);
    trackRef.current?.scrollTo({ left: 0, behavior: "instant" });
  };

  // Перетягування мишею; на тачі — нативна прокрутка.
  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || e.button !== 0 || !trackRef.current) return;
    drag.current = { x: e.clientX, left: trackRef.current.scrollLeft, moved: false };
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    const el = trackRef.current;
    if (!d || !el) return;
    const dx = e.clientX - d.x;
    if (!d.moved && Math.abs(dx) > 4) {
      d.moved = true;
      // Прилипання вимикаємо одразу, не чекаючи ререндеру, інакше браузер
      // повертає доріжку до картки на кожному кроці.
      el.style.scrollSnapType = "none";
      el.setPointerCapture(e.pointerId);
      setDragging(true);
    }
    if (d.moved) el.scrollLeft = d.left - dx;
  };

  const endDrag = () => {
    const moved = drag.current?.moved;
    drag.current = null;
    if (!moved) return;
    setDragging(false);
    // Після перетягування — прилипання до найближчої картки.
    const el = trackRef.current;
    if (!el) return;
    const left = Math.round(el.scrollLeft / step()) * step();
    el.style.scrollSnapType = "";
    el.scrollTo({ left });
  };

  // Клік після перетягування не повинен відкривати посилання.
  const onClickCapture = (e: MouseEvent) => {
    if (dragging) e.preventDefault();
  };

  const width = Math.max(8, track.visible * 100);

  return (
    <>
      <div className={cx(styles.titleRow, "reveal")}>
        <TypingHeading
          lines={heading.lines}
          className={styles.title}
          after={<span className={styles.count}>({pad(shown.length)})</span>}
        />
        <div role="group" aria-label={t.filterLabel} className={styles.filters}>
          {t.filters.map((label, i) => (
            <Chip key={label} selected={filter === i} onClick={() => pickFilter(i)}>
              {label}
            </Chip>
          ))}
        </div>
      </div>

      <div
        ref={trackRef}
        role="region"
        aria-label={t.trackLabel}
        tabIndex={0}
        className={cx(styles.track, dragging && styles.dragging)}
        onScroll={measure}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
      >
        {shown.map((card) => {
          const copy = t.cards[card.id];
          const name = card.name ?? t.cards.react.name;
          const index = cards.indexOf(card) + 1;
          return (
            <article key={card.id} className={cx(styles.card, styles.swap)}>
              <a
                href={card.href}
                draggable={false}
                className={cx(styles.media, card.media === "react" && styles.mediaDashed)}
                aria-label={(card.link === "demo" ? t.openDemo : t.openGithub).replace(
                  "{name}",
                  name,
                )}
              >
                <span className={styles.zoom}>
                  <CardMedia card={card} t={t} />
                </span>
                <span className={styles.badge}>
                  {pad(index)} · {copy.tag}
                </span>
                <span className={styles.cta} aria-hidden="true">
                  {card.link === "demo" ? t.demo : "GitHub"} ↗
                </span>
              </a>
              <div className={styles.cardHead}>
                <h3 className={styles.cardName}>{name}</h3>
                <span className={styles.cardStack}>{card.stack}</span>
              </div>
              <p className={styles.cardText}>{copy.text}</p>
            </article>
          );
        })}

        <article className={styles.card}>
          <a href={`${home}#contact`} draggable={false} className={cx(styles.media, styles.next)}>
            <span className={styles.nextKicker}>{t.next.kicker}</span>
            <span className={cx(styles.nextTitle, styles.zoom)}>
              {t.next.title.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </span>
            <span className={styles.nextCta}>
              {t.next.cta}
              <span className={styles.nextArrow} aria-hidden="true">
                ↗
              </span>
            </span>
          </a>
          <div className={styles.cardHead}>
            <h3 className={styles.cardName}>{t.next.name}</h3>
            <span className={styles.cardStack}>{t.next.year}</span>
          </div>
          <p className={styles.cardText}>{t.next.text}</p>
        </article>
      </div>

      <div className={cx(styles.controls, "reveal")}>
        <div className={styles.bar} aria-hidden="true">
          <span
            className={styles.barFill}
            style={{ left: `${track.progress * (100 - width)}%`, width: `${width}%` }}
          />
        </div>
        <span className={styles.counter} aria-hidden="true">
          {pad(Math.min(total, track.index + 1))} / {pad(total)}
        </span>
        <div className={styles.arrows}>
          <button
            type="button"
            className={styles.arrow}
            aria-label={t.arrowPrev}
            onClick={() => trackRef.current?.scrollBy({ left: -step() })}
          >
            ←
          </button>
          <button
            type="button"
            className={styles.arrow}
            aria-label={t.arrowNext}
            onClick={() => trackRef.current?.scrollBy({ left: step() })}
          >
            →
          </button>
        </div>
      </div>
    </>
  );
}

function CardMedia({ card, t }: { card: PortfolioCard; t: Dictionary["portfolio"] }) {
  if (card.media === "brix") {
    return (
      <span className={styles.brix} aria-hidden="true">
        <span className={styles.brixCopy}>
          <span className={styles.brixKicker}>ЛОТ ТИЖНЯ</span>
          <span className={styles.brixTitle}>
            Зібрано
            <br />
            при <span>22°Bx</span>
          </span>
        </span>
        <span className={styles.brixBackdrop} />
        <span className={styles.brixPack}>
          <span className={styles.brixPackTop}>
            <span>BRIX 22°</span>
            <span>NATURAL</span>
          </span>
          <span className={styles.brixPackName}>Ethiopia Guji Hambela</span>
        </span>
      </span>
    );
  }
  if (card.media === "react") {
    return (
      <span className={`${styles.placeholder} hatch`}>
        <svg width="64" height="64" viewBox="0 0 24 24" aria-hidden="true" className={styles.atom}>
          <ellipse cx="12" cy="12" rx="10" ry="4" />
          <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
          <circle cx="12" cy="12" r="1.5" />
        </svg>
        <span className={styles.placeholderHint}>{t.cards.react.shot}</span>
      </span>
    );
  }
  return (
    <span className={`${styles.placeholder} hatch`}>
      <span className={styles.placeholderTitle}>{card.placeholderTitle}</span>
      <span className={styles.placeholderHint}>
        [{t.screenshot} {card.domain}]
      </span>
    </span>
  );
}
