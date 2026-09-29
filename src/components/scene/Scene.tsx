"use client";

import { useRef, type ReactNode } from "react";
import { useInViewOnce } from "@/hooks/useInViewOnce";
import { cx } from "@/lib/cx";
import styles from "./Scene.module.scss";

type Props = { children: ReactNode; className?: string; threshold?: number };

// Обгортка лінійних сцен: додає .typed, коли сцена вперше з'являється на екрані.
// Класи для ліній, заливок і вікон імпортуйте напряму з Scene.module.scss
// (реекспорт із "use client"-файлу в серверний компонент не працює).
export function Scene({ children, className, threshold = 0.4 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const typed = useInViewOnce(ref, threshold);
  return (
    <div
      ref={ref}
      className={cx(styles.scene, typed && styles["scene--typed"], className)}
      aria-hidden="true"
    >
      {children}
    </div>
  );
}
