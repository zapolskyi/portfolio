"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { useInViewOnce } from "@/hooks/useInViewOnce";
import { cx } from "@/lib/cx";
import styles from "./TypingHeading.module.scss";

export type TypingLine = { text: string; accent?: boolean };

type Props = {
  as?: "h1" | "h2" | "h3";
  lines: TypingLine[];
  // load — друкується одразу (hero), view — при появі на екрані (секції).
  trigger?: "load" | "view";
  // Елемент після останнього рядка, наприклад лічильник «(03)».
  after?: ReactNode;
  className?: string;
};

const CHAR_TIME = 0.045; // с на символ, як у макеті
const LINE_GAP = 0.08; // пауза між рядками

// Для кожного рядка: кількість символів, тривалість друку й затримка старту.
function timeLines(lines: TypingLine[]) {
  const timed: Array<TypingLine & { n: number; t: number; dl: number }> = [];
  let delay = 0;
  for (const line of lines) {
    const n = [...line.text].length;
    const t = n * CHAR_TIME;
    timed.push({ ...line, n, t, dl: delay });
    delay += t + LINE_GAP;
  }
  return { timed, delay };
}

export function TypingHeading({
  as: Tag = "h2",
  lines,
  trigger = "view",
  after,
  className,
}: Props) {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInViewOnce(ref, 0.5, trigger === "view");
  const typed = trigger === "load" || inView;

  const { timed, delay } = timeLines(lines);

  return (
    <Tag
      ref={ref}
      className={cx(
        styles.heading,
        typed && styles.typed,
        trigger === "load" ? styles.loop : styles.finite,
        className,
      )}
    >
      {timed.map((line, i) => {
        const last = i === timed.length - 1;
        return (
          <span key={i} className={styles.line}>
            <span
              className={cx(styles.text, line.accent && styles.accent)}
              style={{ "--n": line.n, "--t": `${line.t}s`, "--dl": `${line.dl}s` } as CSSProperties}
            >
              {line.text}
            </span>
            {last && (
              <span
                className={styles.cursor}
                style={{ "--dl": `${delay}s` } as CSSProperties}
                aria-hidden="true"
              />
            )}
            {last && after}
          </span>
        );
      })}
    </Tag>
  );
}
