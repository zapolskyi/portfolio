"use client";

import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { GitHubIcon, LinkedInIcon, TelegramIcon } from "@/components/icons/SocialIcons";
import { socials } from "@/config/site";
import type { Dictionary } from "@/i18n/get-dictionary";
import { cx } from "@/lib/cx";
import { getActiveSection, usePageScroll } from "@/lib/page-scroll";
import styles from "./ScrollRail.module.scss";

type Props = {
  t: Dictionary["rail"];
  sectionNames: Dictionary["sections"];
};

const RAIL_OFFSET = 132; // відступ рейки: 104 зверху + 28 знизу
const PILL_H = 180;
const KEY_STEPS: Record<string, number> = { ArrowDown: 120, ArrowUp: -120 };

export function ScrollRail({ t, sectionNames }: Props) {
  const scroll = usePageScroll();
  const { progress, max, offsets, vh } = scroll;
  const active = getActiveSection(scroll);
  const activeIdx = offsets.findIndex((o) => o.id === active);
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{ startY: number; startScroll: number } | null>(null);

  const range = Math.max(1, vh - RAIL_OFFSET - PILL_H);
  const pillTop = Math.round(progress * range);
  const pct = Math.round(progress * 100);

  const onPointerDown = (e: PointerEvent<HTMLElement>) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { startY: e.clientY, startScroll: window.scrollY };
    setDragging(true);
  };

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    if (!drag.current) return;
    const top = drag.current.startScroll + ((e.clientY - drag.current.startY) / range) * max;
    window.scrollTo({ top, behavior: "instant" });
  };

  const onPointerUp = () => {
    drag.current = null;
    setDragging(false);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    const page = window.innerHeight * 0.85;
    const steps: Record<string, number> = { ...KEY_STEPS, PageDown: page, PageUp: -page };
    if (e.key in steps) window.scrollBy({ top: steps[e.key] });
    else if (e.key === "Home") window.scrollTo({ top: 0 });
    else if (e.key === "End") window.scrollTo({ top: max });
    else return;
    e.preventDefault();
  };

  const gripHandlers = {
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel: onPointerUp,
  };

  return (
    <aside className={styles.root} aria-label={t.label}>
      <div className={styles.rail}>
        <span className={styles.track} aria-hidden="true" />
        <span className={styles.fill} style={{ height: pillTop + PILL_H / 2 }} aria-hidden="true" />

        {offsets.map((o, i) => (
          <button
            key={o.id}
            type="button"
            className={cx(
              styles.marker,
              i === activeIdx && styles.markerOn,
              i < activeIdx && styles.markerPast,
            )}
            style={{ top: Math.round((o.top / max) * range + PILL_H / 2) }}
            aria-label={t.goTo.replace("{name}", sectionNames[o.id])}
            aria-current={i === activeIdx ? "location" : undefined}
            onClick={() => document.getElementById(o.id)?.scrollIntoView()}
          >
            <span className={styles.markerDot} />
            <span className={styles.markerLabel} aria-hidden="true">
              {sectionNames[o.id]}
            </span>
          </button>
        ))}

        <div
          className={cx(styles.pill, dragging && styles.dragging)}
          style={{ transform: `translateY(${pillTop}px)` }}
        >
          <div
            role="scrollbar"
            tabIndex={0}
            aria-controls="main"
            aria-orientation="vertical"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={pct}
            aria-label={t.grip.replace("{pct}", `${pct}%`)}
            className={styles.grip}
            onKeyDown={onKeyDown}
            {...gripHandlers}
          >
            <i />
            <i />
          </div>
          <a className={styles.icon} href={socials.github} aria-label="GitHub">
            <GitHubIcon />
          </a>
          <a className={styles.icon} href={socials.linkedin} aria-label="LinkedIn">
            <LinkedInIcon />
          </a>
          <a className={styles.icon} href={socials.telegram} aria-label="Telegram">
            <TelegramIcon />
          </a>
          <div className={styles.grip} aria-hidden="true" {...gripHandlers}>
            {String(pct).padStart(2, "0")}
          </div>
        </div>
      </div>

      {progress > 0.12 && (
        <button
          type="button"
          className={styles.toTop}
          aria-label={t.toTop}
          onClick={() => window.scrollTo({ top: 0 })}
        >
          ↑
        </button>
      )}
    </aside>
  );
}
