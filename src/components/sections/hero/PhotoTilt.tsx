"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";
import styles from "./Hero.module.scss";

type Props = { photo: ReactNode; children: ReactNode; className?: string };

// Фото нахиляється за курсором (±10°) з відблиском. Стан — у CSS-змінних,
// без перерендерів; на тач-пристроях і з reduced motion не діє (див. стилі).
export function PhotoTilt({ photo, children, className }: Props) {
  const card = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const el = card.current;
      if (!el) return;
      el.style.setProperty("--ry", `${(x * 10).toFixed(2)}deg`);
      el.style.setProperty("--rx", `${(-y * 10).toFixed(2)}deg`);
      el.style.setProperty("--gx", `${Math.round((x + 0.5) * 100)}%`);
      el.style.setProperty("--gy", `${Math.round((y + 0.5) * 100)}%`);
    });
  };

  const onPointerLeave = () => {
    cancelAnimationFrame(frame.current);
    const el = card.current;
    if (!el) return;
    for (const v of ["--rx", "--ry", "--gx", "--gy"]) el.style.removeProperty(v);
  };

  return (
    <div className={className} onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>
      <div ref={card} className={styles.hero__photo}>
        {photo}
      </div>
      {children}
    </div>
  );
}
