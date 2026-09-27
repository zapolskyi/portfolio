"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { useInViewOnce } from "@/hooks/useInViewOnce";
import { cx } from "@/lib/cx";
import styles from "./Process.module.scss";

// Лінії 4 етапів будівництва з макета: [path, тип, затримка (с)].
type Line = [d: string, kind: "main" | "sub" | "accent", delay: number];

const win = (x: number, y: number) => `M${x} ${y} h24 v18 h-24 Z`;

const lines: Line[] = [
  ["M0 200 H1280", "sub", 0],
  // 1. Фундамент і розмітка
  ["M62 200 V192 H234 V200", "main", 0.1],
  ["M68 64 H228 M68 58 V70 M228 58 V70", "accent", 0.5],
  ["M68 200 V210 M228 200 V210", "sub", 0.3],
  // 2. Каркас
  ["M390 200 V192 H562 V200", "main", 0.9],
  ["M396 192 V80", "main", 1.05],
  ["M476 192 V80", "main", 1.05],
  ["M556 192 V80", "main", 1.05],
  ["M396 156 H556", "main", 1.3],
  ["M396 118 H556", "main", 1.3],
  ["M396 80 H556", "main", 1.3],
  ["M396 192 L476 156 M476 192 L396 156 M476 118 L556 80 M556 118 L476 80", "sub", 1.5],
  // 3. Стіни й риштування
  ["M718 200 V192 H890 V200", "main", 1.8],
  ["M724 192 V80 H884 V192", "main", 1.95],
  ...[746, 792, 838].flatMap((x, col) =>
    [94, 126, 158].map((y, row): Line => [win(x, y), "sub", 2.2 + (row * 3 + col) * 0.04]),
  ),
  ["M900 200 V64 M916 200 V64 M896 150 H920 M896 110 H920 M896 70 H920", "sub", 2.1],
  // 4. Готова будівля
  ["M1046 200 V192 H1218 V200", "main", 2.7],
  ["M1052 192 V80 H1212 V192", "main", 2.85],
  ...[1074, 1120, 1166].flatMap((x, col) =>
    [94, 126, 158].map((y, row): Line => [win(x, y), "main", 3.1 + (row * 3 + col) * 0.04]),
  ),
  ["M1048 80 V74 H1216 V80", "main", 3.0],
  ["M1120 192 V168 H1144 V192", "main", 3.15],
  ["M1192 74 V42", "main", 3.2],
];

// Вікна, що загоряються в готовій будівлі: [x, y, затримка].
const lights: Array<[number, number, number]> = [
  [1075, 95, 3.5],
  [1121, 95, 3.64],
  [1167, 95, 3.78],
  [1121, 127, 3.92],
  [1167, 127, 4.06],
  [1075, 159, 4.2],
  [1167, 159, 4.34],
];

type Props = { children: ReactNode };

export function ProcessScene({ children }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const typed = useInViewOnce(ref, 0.3);

  return (
    <div ref={ref} className={cx(styles.scene, typed && styles.typed, "reveal")}>
      <svg className={styles.drawing} viewBox="0 0 1280 214" aria-hidden="true">
        {lines.map(([d, kind, delay], i) => (
          <path
            key={i}
            d={d}
            pathLength={1}
            className={cx(styles.draw, styles[kind])}
            style={{ animationDelay: `${delay}s` }}
          />
        ))}
        <rect
          x="68"
          y="80"
          width="160"
          height="112"
          className={cx(styles.fade, styles.plot)}
          style={{ "--fd": "0.4s" } as CSSProperties}
        />
        <rect
          x="764"
          y="62"
          width="80"
          height="16"
          rx="2"
          className={cx(styles.fade, styles.fill)}
          style={{ "--fd": "2.6s" } as CSSProperties}
        />
        <path
          d="M1192 42 L1216 49 L1192 56 Z"
          className={cx(styles.fade, styles.fill)}
          style={{ "--fd": "3.6s" } as CSSProperties}
        />
        {lights.map(([x, y, d]) => (
          <rect
            key={`${x}-${y}`}
            x={x}
            y={y}
            width="22"
            height="16"
            className={styles.light}
            style={{ "--wd": `${d}s` } as CSSProperties}
          />
        ))}
      </svg>
      {children}
    </div>
  );
}
