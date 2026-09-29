"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { useInViewOnce } from "@/hooks/useInViewOnce";
import { cx } from "@/lib/cx";
import styles from "./TypingHeading.module.scss";

export type TypingLine = { text: string; accent?: boolean };

type Props = {
  as?: "h1" | "h2" | "h3" | "p" | "div";
  id?: string; // для aria-labelledby секції
  lines: TypingLine[];
  // Інше розбиття на рядки для вузьких екранів (< 768px), якщо довгі рядки не влазять.
  linesMobile?: TypingLine[];
  // load — друкується одразу (hero), view — при появі на екрані (секції).
  trigger?: "load" | "view";
  // Елементи перед першим і після останнього рядка, наприклад «>» чи «(03)».
  before?: ReactNode;
  after?: ReactNode;
  cursor?: boolean;
  // type — друк посимвольно з порожнього місця;
  // ghost — текст одразу видно блідим «силуетом» (як автодоповнення в терміналі),
  // а поверх друкується яскравий шар. Для LCP-заголовка hero: браузер рахує LCP
  // за силуетом у першому кадрі, а відвідувач бачить повноцінний друк.
  effect?: "type" | "ghost";
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
  id,
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
    const end = typedEnd;
    return timed.map((line, i) => {
      const last = i === timed.length - 1;
      return (
        <span key={i} className={styles["typing-heading__line"]}>
          {i === 0 && before}
          <span
            className={cx(
              styles["typing-heading__text"],
              line.accent && styles["typing-heading__text--accent"],
            )}
            // Для ghost яскравий шар малює ::after із цього атрибута — без дубля тексту в DOM.
            data-text={effect === "ghost" ? line.text : undefined}
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
              className={styles["typing-heading__cursor"]}
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
      id={id}
      className={cx(
        styles["typing-heading"],
        typed && styles["typing-heading--typed"],
        effect === "ghost" && styles["typing-heading--ghost"],
        trigger === "load" ? styles["typing-heading--loop"] : styles["typing-heading--finite"],
        className,
      )}
    >
      {linesMobile ? (
        <>
          <span
            className={cx(
              styles["typing-heading__group"],
              styles["typing-heading__group--desktop"],
            )}
          >
            {renderLines(lines)}
          </span>
          <span
            className={cx(styles["typing-heading__group"], styles["typing-heading__group--mobile"])}
          >
            {renderLines(linesMobile)}
          </span>
        </>
      ) : (
        renderLines(lines)
      )}
    </Tag>
  );
}
