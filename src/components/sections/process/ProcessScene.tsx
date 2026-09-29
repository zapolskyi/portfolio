"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { useInViewOnce } from "@/hooks/useInViewOnce";
import { cx } from "@/lib/cx";
import styles from "./Process.module.scss";
import { drawing } from "./process-drawing";

type Props = { children: ReactNode };

// Сцена й кроки запускаються разом, коли блок уперше з'являється на екрані.
// З WebGL цю SVG малює поле точок (data-point-shape), без нього — анімує CSS.
export function ProcessScene({ children }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const typed = useInViewOnce(ref, 0.3);

  return (
    <div
      ref={ref}
      className={cx(styles.process__scene, typed && styles["process__scene--typed"], "reveal")}
    >
      <svg
        className={styles.process__drawing}
        viewBox="0 0 1280 214"
        aria-hidden="true"
        data-point-shape="process"
      >
        {drawing.map((shape, i) =>
          shape.kind === "stroke" ? (
            <path
              key={i}
              d={shape.d}
              pathLength={shape.dashed ? undefined : 1}
              className={cx(
                styles.process__stroke,
                styles[`process__stroke--${shape.tone}`],
                shape.dashed && styles["process__stroke--dashed"],
              )}
              style={{ animationDelay: `${shape.delay}s` }}
            />
          ) : (
            <rect
              key={i}
              x={shape.x}
              y={shape.y}
              width={shape.w}
              height={shape.h}
              rx={shape.r}
              className={cx(
                styles.process__fill,
                styles[`process__fill--${shape.tone}`],
                shape.blink && styles["process__fill--blink"],
              )}
              style={{ "--fd": `${shape.delay}s` } as CSSProperties}
            />
          ),
        )}
      </svg>
      {children}
    </div>
  );
}
