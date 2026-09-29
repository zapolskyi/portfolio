"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { useInViewOnce } from "@/hooks/useInViewOnce";
import { cx } from "@/lib/cx";
import styles from "./TypingHeading.module.scss";

export type TypingLine = { text: string; accent?: boolean };

type Props = {
  as?: "h1" | "h2" | "h3" | "p" | "div";
  lines: TypingLine[];
  // Інше розбиття на рядки для вузьких екранів (< 768px), якщо довгі рядки не влазять.
  linesMobile?: TypingLine[];
  // load — друкується одразу (hero), view — при появі на екрані (секції).
  trigger?: "load" | "view";
  // Елементи перед першим і після останнього рядка, наприклад «>» чи «(03)».
  before?: ReactNode;
  after?: ReactNode;
  cursor?: boolean;
  // type — друк посимвольно; none — текст видно з першого кадру, блимає лише
  // курсор (для LCP-заголовка hero: будь-яка поява з маски відкладає LCP).
  effect?: "type" | "none";
  charTime?: number; // с на символ
  delay?: number; // с до старту
  lineGap?: number; // пауза між рядками, с
  className?: string;
};

type Timing = { charTime: number; delay: number; lineGap: number };

// Для кожного рядка: кількість символів, тривалість друку й затримка старту.
function timeLines(lines: TypingLine[], { charTime, delay, lineGap }: Timing) {
  const timed: Array<TypingLine & { n: number; t: number; dl: number }> = [];
  let at = delay;
  for (const line of lines) {
    const n = [...line.text].length;
    const t = n * charTime;
    timed.push({ ...line, n, t, dl: at });
    at += t + lineGap;
  }
  return { timed, end: at - lineGap };
}

export function TypingHeading({
  as: Tag = "h2",
  lines,
  linesMobile,
  trigger = "view",
  before,
  after,
  cursor = true,
  effect = "type",
  charTime = 0.045,
  delay = 0,
  lineGap = 0.08,
  className,
}: Props) {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInViewOnce(ref, 0.5, trigger === "view");
  const typed = trigger === "load" || inView;
  const timing = { charTime, delay, lineGap };

  const renderLines = (set: TypingLine[]) => {
    const { timed, end: typedEnd } = timeLines(set, timing);
    const end = effect === "none" ? delay : typedEnd;
    return timed.map((line, i) => {
      const last = i === timed.length - 1;
      return (
        <span key={i} className={styles.line}>
          {i === 0 && before}
          <span
            className={cx(styles.text, line.accent && styles.accent)}
            style={
              {
                "--n": line.n,
                "--t": `${line.t}s`,
                "--dl": `${line.dl}s`,
              } as CSSProperties
            }
          >
            {line.text}
          </span>
          {last && cursor && (
            <span
              className={styles.cursor}
              style={{ "--dl": `${end + 0.08}s` } as CSSProperties}
              aria-hidden="true"
            />
          )}
          {last && after}
        </span>
      );
    });
  };

  return (
    <Tag
      ref={ref}
      className={cx(
        styles.heading,
        typed && styles.typed,
        effect === "none" && styles.static,
        trigger === "load" ? styles.loop : styles.finite,
        className,
      )}
    >
      {linesMobile ? (
        <>
          <span className={cx(styles.group, styles.desktop)}>{renderLines(lines)}</span>
          <span className={cx(styles.group, styles.mobile)}>{renderLines(linesMobile)}</span>
        </>
      ) : (
        renderLines(lines)
      )}
    </Tag>
  );
}
