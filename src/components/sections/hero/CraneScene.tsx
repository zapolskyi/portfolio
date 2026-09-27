import type { CSSProperties } from "react";
import { cx } from "@/lib/cx";
import styles from "./CraneScene.module.scss";

// Лінії крана з макета: [path, тип лінії, затримка малювання (с)].
// main — основні (36%), sub — другорядні (16%), horizon — горизонт із градієнтом.
type Line = [d: string, kind: "main" | "sub" | "horizon", delay: number];

const desktop: { lines: Line[]; slot: string; beacon: [number, number, number] } = {
  lines: [
    ["M520 660 H1440", "horizon", 0],
    ["M912 660 V112", "main", 0.2],
    ["M926 660 V112", "main", 0.2],
    [
      "M912 660 L926 646 L912 632 L926 618 L912 604 L926 590 L912 576 L926 562 L912 548 L926 534 L912 520 L926 506 L912 492 L926 478 L912 464 L926 450 L912 436 L926 422 L912 408 L926 394 L912 380 L926 366 L912 352 L926 338 L912 324 L926 310 L912 296 L926 282 L912 268 L926 254 L912 240 L926 226 L912 212 L926 198 L912 184 L926 170 L912 156 L926 142 L912 128 L926 114",
      "sub",
      0.35,
    ],
    ["M912 112 L919 70 L926 112", "main", 0.9],
    ["M919 70 L640 112", "sub", 1.1],
    ["M919 70 L1010 112", "sub", 1.1],
    ["M912 112 H640", "main", 0.9],
    ["M912 122 H640", "main", 0.9],
    [
      "M912 122 L898 112 L884 122 L870 112 L856 122 L842 112 L828 122 L814 112 L800 122 L786 112 L772 122 L758 112 L744 122 L730 112 L716 122 L702 112 L688 122 L674 112 L660 122 L646 112",
      "sub",
      1.0,
    ],
    ["M640 112 V122", "main", 1.4],
    ["M926 112 H1010", "main", 0.9],
    ["M926 122 H1010", "main", 0.9],
    ["M926 122 L940 112 L954 122 L968 112 L982 122 L996 112 L1010 122", "sub", 1.0],
    ["M982 122 H1008 V146 H982 Z", "main", 1.3],
    ["M927 124 H945 V138 H927 Z", "main", 1.2],
    ["M790 660 V540", "main", 1.2],
    ["M840 660 V540", "main", 1.2],
    ["M890 660 V540", "main", 1.2],
    ["M790 620 H890", "main", 1.5],
    ["M790 580 H890", "main", 1.5],
    ["M790 540 H890", "main", 1.5],
    [
      "M790 660 L840 620 M840 660 L790 620 M840 620 L890 580 M890 620 L840 580 M790 580 L840 540 M840 580 L790 540",
      "sub",
      1.7,
    ],
  ],
  slot: "M790.5 500.5 h99 v39 h-99 Z",
  beacon: [919, 66, 2.5],
};

const mobile: typeof desktop = {
  lines: [
    ["M226 104 H390", "horizon", 0],
    ["M344 104 V26", "main", 0.2],
    ["M350 104 V26", "main", 0.2],
    [
      "M344 104 L350 98 L344 92 L350 86 L344 80 L350 74 L344 68 L350 62 L344 56 L350 50 L344 44 L350 38 L344 32 L350 26",
      "sub",
      0.35,
    ],
    ["M344 26 L347 12 L350 26", "main", 0.8],
    ["M347 12 L250 26", "sub", 0.9],
    ["M347 12 L384 26", "sub", 0.9],
    ["M344 26 H250", "main", 0.8],
    ["M344 30 H250", "main", 0.8],
    ["M350 26 H384", "main", 0.8],
    ["M350 30 H384", "main", 0.8],
    ["M372 30 H383 V40 H372 Z", "main", 1.1],
    ["M268 104 V88", "main", 1.0],
    ["M288 104 V88", "main", 1.0],
    ["M308 104 V88", "main", 1.0],
    ["M268 88 H308", "main", 1.2],
    ["M268 104 L288 88 M288 104 L308 88", "sub", 1.3],
  ],
  slot: "M268.5 72.5 h39 v15 h-39 Z",
  beacon: [347, 9, 2],
};

function Drawing({
  scene,
  id,
  size,
}: {
  scene: typeof desktop;
  id: string;
  size: [number, number];
}) {
  const [w, h] = size;
  return (
    <svg className={styles.svg} width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <defs>
        <linearGradient id={id} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#E8E6E3" stopOpacity="0" />
          <stop offset="0.35" stopColor="#E8E6E3" stopOpacity="0.26" />
          <stop offset="1" stopColor="#E8E6E3" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      {scene.lines.map(([d, kind, delay], i) => (
        <path
          key={i}
          d={d}
          pathLength={1}
          className={cx(styles.draw, styles[kind])}
          stroke={kind === "horizon" ? `url(#${id})` : undefined}
          style={{ animationDelay: `${delay}s` }}
        />
      ))}
      <path d={scene.slot} className={styles.slot} />
      <circle
        cx={scene.beacon[0]}
        cy={scene.beacon[1]}
        r={scene.beacon[2]}
        className={styles.beacon}
      />
    </svg>
  );
}

// Кран, що опускає бурштиновий блок на пунктирне місце. Лише CSS: малювання
// ліній (stroke-dashoffset) і цикл 12 с для візка, троса, блока та спалаху.
export function CraneScene() {
  return (
    <div className={styles.root} aria-hidden="true">
      <div className={cx(styles.scene, styles.desktop)}>
        <svg className={styles.perspective} width="1440" height="900" viewBox="0 0 1440 900">
          <path d="M840 660 L180 900 M840 660 L400 900 M840 660 L620 900 M840 660 L840 900 M840 660 L1060 900 M840 660 L1280 900 M840 660 L1500 900 M560 690 H1440 M480 740 H1440 M380 815 H1440" />
        </svg>
        <Drawing scene={desktop} id="crane-horizon" size={[1440, 900]} />
        <span className={styles.glow} />
        <div
          className={styles.trolley}
          style={
            { "--tx": "-110px", "--ls": 0.144, "--hy": "58px", "--ly": "378px" } as CSSProperties
          }
        >
          <span className={styles.hook} />
          <span className={styles.cable} />
          <span className={styles.block} />
        </div>
      </div>

      <div className={cx(styles.scene, styles.mobile)}>
        <Drawing scene={mobile} id="crane-horizon-m" size={[390, 140]} />
        <span className={styles.glow} />
        <div
          className={styles.trolley}
          style={{ "--tx": "-16px", "--ls": 0.2, "--hy": "10px", "--ly": "42px" } as CSSProperties}
        >
          <span className={styles.hook} />
          <span className={styles.cable} />
          <span className={styles.block} />
        </div>
      </div>

      <svg className={styles.grain}>
        <filter id="hero-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="3"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#hero-grain)" />
      </svg>
    </div>
  );
}
