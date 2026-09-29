import type { CSSProperties } from "react";
import { Scene } from "@/components/scene/Scene";
import s from "@/components/scene/Scene.module.scss";
import { cx } from "@/lib/cx";

// «Вільна ділянка»: кран над пунктирною ділянкою під ваш сайт, гак погойдується.
type Line = [d: string, kind: "main" | "sub" | "accent", delay: number];

const lines: Line[] = [
  ["M130 262 V280 M320 262 V280", "accent", 0.4],
  ["M392 270 V44", "main", 0.2],
  ["M404 270 V44", "main", 0.2],
  [
    "M392 270 L404 258 L392 246 L404 234 L392 222 L404 210 L392 198 L404 186 L392 174 L404 162 L392 150 L404 138 L392 126 L404 114 L392 102 L404 90 L392 78 L404 66 L392 54",
    "sub",
    0.35,
  ],
  ["M392 44 L398 14 L404 44", "main", 0.8],
  ["M398 14 L110 44 M398 14 L452 44", "sub", 0.9],
  ["M392 44 H110 M392 52 H110", "main", 0.8],
  [
    "M392 52 L380 44 L368 52 L356 44 L344 52 L332 44 L320 52 L308 44 L296 52 L284 44 L272 52 L260 44 L248 52 L236 44 L224 52 L212 44 L200 52 L188 44 L176 52 L164 44 L152 52 L140 44 L128 52 L116 44",
    "sub",
    0.9,
  ],
  ["M110 44 V52", "main", 1.2],
  ["M404 44 H452 M404 52 H452", "main", 0.8],
  ["M434 52 H450 V68 H434 Z", "main", 1.1],
];

export function PlotScene({ className }: { className?: string }) {
  return (
    <Scene className={className}>
      <svg viewBox="0 0 460 300" width="460" height="300">
        <defs>
          <linearGradient id="plot-horizon" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#E8E6E3" stopOpacity="0" />
            <stop offset="0.3" stopColor="#E8E6E3" stopOpacity="0.3" />
            <stop offset="1" stopColor="#E8E6E3" stopOpacity="0.15" />
          </linearGradient>
        </defs>
        <path d="M0 270 H460" pathLength={1} className={s.draw} stroke="url(#plot-horizon)" />
        <rect
          x="130.5"
          y="120.5"
          width="190"
          height="149"
          className={cx(s.plot, s.fade)}
          style={{ "--fd": "0.5s" } as CSSProperties}
        />
        {lines.map(([d, kind, delay], i) => (
          <path
            key={i}
            d={d}
            pathLength={1}
            className={cx(s.draw, s[kind])}
            style={{ animationDelay: `${delay}s` }}
          />
        ))}
        <g className={s.sway} style={{ transformBox: "view-box", transformOrigin: "225px 52px" }}>
          <rect x="215" y="49" width="20" height="6" rx="1" fill="rgb(232 230 227 / 50%)" />
          <path
            d="M225 55 V100"
            pathLength={1}
            className={cx(s.draw, s.cable)}
            style={{ animationDelay: "1.3s" }}
          />
          <path
            d="M225 100 V110 A6 6 0 1 1 213 110"
            pathLength={1}
            className={cx(s.draw, s.accent)}
            style={{ animationDelay: "1.5s" }}
          />
        </g>
        <circle cx="398" cy="10" r="2.5" className={s.beacon} />
      </svg>
    </Scene>
  );
}
