import type { CSSProperties } from "react";
import { Scene } from "@/components/scene/Scene";
import s from "@/components/scene/Scene.module.scss";
import { cx } from "@/lib/cx";

// Силует міста над словом ZAPOLSKYI: контури будівель малюються по черзі,
// потім вікна загоряються по одному. Координати — з макета (1280×170).
type Building = {
  x: number;
  top: number;
  width: number;
  cols: number[]; // x вікон
  rows: number[]; // y вікон
  delay: number; // старт малювання корпусу
  lit: Array<[col: number, row: number, delay: number]>;
};

const buildings: Building[] = [
  {
    x: 40,
    top: 78,
    width: 120,
    cols: [52, 74, 96, 118],
    rows: [94, 118],
    delay: 0.15,
    lit: [
      [1, 0, 1.65],
      [2, 0, 2.2],
      [1, 1, 2.86],
      [2, 1, 3.41],
    ],
  },
  {
    x: 210,
    top: 28,
    width: 90,
    cols: [222, 244, 266],
    rows: [44, 68, 92, 116],
    delay: 0.27,
    lit: [
      [0, 0, 1.87],
      [1, 0, 2.42],
      [0, 1, 3.08],
      [1, 1, 1.1],
      [0, 2, 1.76],
      [1, 2, 2.31],
      [0, 3, 2.97],
      [1, 3, 3.52],
    ],
  },
  {
    x: 520,
    top: 58,
    width: 150,
    cols: [532, 554, 576, 598, 620],
    rows: [74, 98, 122],
    delay: 0.39,
    lit: [
      [0, 0, 2.64],
      [2, 0, 1.21],
      [3, 0, 1.76],
      [0, 1, 1.32],
      [2, 1, 2.42],
      [3, 1, 2.97],
      [0, 2, 2.53],
      [2, 2, 1.1],
      [3, 2, 1.65],
    ],
  },
  {
    x: 860,
    top: 8,
    width: 110,
    cols: [872, 894, 916],
    rows: [24, 48, 72, 96, 120],
    delay: 0.51,
    lit: [
      [1, 0, 1.43],
      [2, 0, 1.98],
      [1, 1, 2.64],
      [2, 1, 3.19],
      [1, 2, 1.32],
      [2, 2, 1.87],
      [1, 3, 2.53],
      [2, 3, 3.08],
      [1, 4, 1.21],
      [2, 4, 1.76],
    ],
  },
  {
    x: 1040,
    top: 48,
    width: 170,
    cols: [1052, 1074, 1096, 1118, 1140, 1162],
    rows: [64, 88, 112],
    delay: 0.63,
    lit: [
      [0, 0, 1.65],
      [1, 0, 2.2],
      [3, 0, 3.3],
      [4, 0, 1.32],
      [0, 1, 2.86],
      [1, 1, 3.41],
      [3, 1, 1.98],
      [4, 1, 2.53],
      [0, 2, 1.54],
      [1, 2, 2.09],
      [3, 2, 3.19],
      [4, 2, 1.21],
    ],
  },
];

const draw = (delay: number) => ({ animationDelay: `${delay}s` });

export function CityScene({ className }: { className?: string }) {
  return (
    <Scene className={className} threshold={0.3}>
      <svg viewBox="0 -30 1280 200" width="1280" height="200" data-point-shape="city">
        <path d="M0 168 H1280" pathLength={1} className={cx(s.draw, s.main)} style={draw(0)} />
        {buildings.map((b) => (
          <g key={b.x}>
            <path
              d={`M${b.x} 168 V${b.top} H${b.x + b.width} V168`}
              pathLength={1}
              className={cx(s.draw, s.main)}
              style={draw(b.delay)}
            />
            <path
              d={`M${b.x - 4} ${b.top} H${b.x + b.width + 4}`}
              pathLength={1}
              className={cx(s.draw, s.main)}
              style={draw(b.delay + 0.3)}
            />
            {b.rows.flatMap((y) =>
              b.cols.map((x) => (
                <path
                  key={`${x}-${y}`}
                  d={`M${x} ${y} h10 v12 h-10 Z`}
                  pathLength={1}
                  className={cx(s.draw, s.sub)}
                  style={draw(b.delay + 0.5)}
                />
              )),
            )}
            {b.lit.map(([c, r, d]) => (
              <rect
                key={`${c}-${r}`}
                x={b.cols[c]! + 1}
                y={b.rows[r]! + 1}
                width="8"
                height="10"
                className={s.light}
                style={{ "--wd": `${d}s` } as CSSProperties}
              />
            ))}
          </g>
        ))}
        <path d="M915 8 V-20" pathLength={1} className={cx(s.draw, s.main)} style={draw(0.9)} />
        <circle cx="915" cy="-24" r="2.5" className={s.beacon} />
      </svg>
    </Scene>
  );
}
