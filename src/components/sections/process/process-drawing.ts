// Сцена «Процес»: чотири вікна браузера — сторінка еволюціонує від брифу до запуску.
// Координати у viewBox 1280×214; кожне вікно стоїть над своєю колонкою кроків
// (4 колонки по 296px з проміжком 32px). Затримки збігаються з кроками (0.9 с).

export type Stroke = {
  kind: "stroke";
  d: string;
  tone: "main" | "sub" | "accent";
  delay: number;
  dashed?: boolean;
};
export type Fill = {
  kind: "fill";
  x: number;
  y: number;
  w: number;
  h: number;
  r?: number;
  tone: "block" | "accent" | "ok";
  delay: number;
  blink?: boolean; // курсор коду
};
export type Shape = Stroke | Fill;

const W = 260;
const H = 176;
const TOP = 20;
const COLS = [18, 346, 674, 1002];

const rr = (x: number, y: number, w: number, h: number, r = 0) =>
  r
    ? `M${x + r} ${y} H${x + w - r} A${r} ${r} 0 0 1 ${x + w} ${y + r} V${y + h - r} A${r} ${r} 0 0 1 ${x + w - r} ${y + h} H${x + r} A${r} ${r} 0 0 1 ${x} ${y + h - r} V${y + r} A${r} ${r} 0 0 1 ${x + r} ${y} Z`
    : `M${x} ${y} h${w} v${h} h${-w} Z`;
const line = (x1: number, y: number, x2: number) => `M${x1} ${y} H${x2}`;
const circle = (cx: number, cy: number, r: number) =>
  `M${cx - r} ${cy} a${r} ${r} 0 1 0 ${r * 2} 0 a${r} ${r} 0 1 0 ${-r * 2} 0`;

// Спільна «хромка» вікна: рамка, смуга заголовка, три точки, адресний рядок.
function chrome(x: number, b: number): Shape[] {
  return [
    { kind: "stroke", d: rr(x, TOP, W, H, 6), tone: "main", delay: b },
    { kind: "stroke", d: line(x, TOP + 22, x + W), tone: "main", delay: b + 0.15 },
    {
      kind: "stroke",
      d: [0, 9, 18].map((dx) => circle(x + 12 + dx, TOP + 11, 2.5)).join(" "),
      tone: "sub",
      delay: b + 0.2,
    },
    { kind: "stroke", d: rr(x + 48, TOP + 6, 150, 10, 5), tone: "sub", delay: b + 0.25 },
  ];
}

// Макет сторінки всередині вікна: шапка, заголовок, кнопка, зображення, 3 картки.
const layout = (x: number) => {
  const cx = x + 14;
  const y = TOP + 32;
  return {
    header: { x: cx, y, w: W - 28, h: 12 },
    title: [line(cx, y + 26, cx + 110), line(cx, y + 36, cx + 86)],
    button: { x: cx, y: y + 48, w: 50, h: 14 },
    image: { x: x + 140, y: y + 20, w: 106, h: 46 },
    cards: [0, 1, 2].map((k) => ({ x: cx + k * 80, y: y + 80, w: 72, h: 50 })),
  };
};

// 1. Бриф: порожнє вікно з пунктирною сіткою і текстом задачі.
function brief(x: number, b: number): Shape[] {
  const left = x + 14;
  const right = x + W - 14;
  const grid: string[] = [];
  for (let gx = left; gx <= right; gx += 29) grid.push(`M${gx} ${TOP + 30} V${TOP + H - 8}`);
  for (let gy = TOP + 30; gy <= TOP + H - 8; gy += 29) grid.push(line(left, gy, right));
  return [
    ...chrome(x, b),
    { kind: "stroke", d: grid.join(" "), tone: "sub", delay: b + 0.35, dashed: true },
    { kind: "stroke", d: line(left, TOP + 44, left + 52), tone: "accent", delay: b + 0.5 },
    {
      kind: "stroke",
      d: [
        line(left, TOP + 56, left + 160),
        line(left, TOP + 66, left + 132),
        line(left, TOP + 76, left + 104),
      ].join(" "),
      tone: "main",
      delay: b + 0.55,
    },
  ];
}

// 2. Прототип: сірі блоки wireframe, зображення перекреслене.
function prototype(x: number, b: number): Shape[] {
  const l = layout(x);
  const box = (r: { x: number; y: number; w: number; h: number }) => rr(r.x, r.y, r.w, r.h, 2);
  const { image: im } = l;
  return [
    ...chrome(x, b),
    { kind: "stroke", d: box(l.header), tone: "sub", delay: b + 0.35 },
    { kind: "stroke", d: l.title.join(" "), tone: "sub", delay: b + 0.45 },
    { kind: "stroke", d: box(l.button), tone: "sub", delay: b + 0.5 },
    {
      kind: "stroke",
      d: `${box(im)} M${im.x} ${im.y} L${im.x + im.w} ${im.y + im.h} M${im.x + im.w} ${im.y} L${im.x} ${im.y + im.h}`,
      tone: "sub",
      delay: b + 0.5,
    },
    { kind: "stroke", d: l.cards.map(box).join(" "), tone: "sub", delay: b + 0.6 },
  ];
}

// 3. Розробка: блоки заповнились, у заголовку блимає курсор коду.
function development(x: number, b: number): Shape[] {
  const l = layout(x);
  const fill = (r: { x: number; y: number; w: number; h: number }, delay: number): Fill => ({
    kind: "fill",
    ...r,
    r: 2,
    tone: "block",
    delay,
  });
  return [
    ...chrome(x, b),
    fill(l.header, b + 0.4),
    { kind: "stroke", d: l.title.join(" "), tone: "main", delay: b + 0.45 },
    {
      kind: "fill",
      x: x + 14 + 90,
      y: TOP + 32 + 31,
      w: 3,
      h: 10,
      tone: "accent",
      delay: b + 0.6,
      blink: true,
    },
    fill(l.button, b + 0.5),
    fill(l.image, b + 0.55),
    ...l.cards.map((c, k) => fill(c, b + 0.6 + k * 0.05)),
  ];
}

// 4. Запуск: готова сторінка, бурштинова кнопка і зелена точка «онлайн».
function launch(x: number, b: number): Shape[] {
  const l = layout(x);
  return [
    ...chrome(x, b),
    {
      kind: "stroke",
      d: rr(l.header.x, l.header.y, l.header.w, l.header.h, 2),
      tone: "main",
      delay: b + 0.35,
    },
    {
      kind: "fill",
      x: l.header.x + 6,
      y: l.header.y + 4,
      w: 20,
      h: 4,
      tone: "accent",
      delay: b + 0.5,
    },
    { kind: "stroke", d: l.title.join(" "), tone: "main", delay: b + 0.45 },
    { kind: "fill", ...l.button, r: 3, tone: "accent", delay: b + 0.6 },
    { kind: "fill", ...l.image, r: 2, tone: "block", delay: b + 0.55 },
    {
      kind: "stroke",
      d: l.cards
        .map((c) => rr(c.x, c.y, c.w, c.h, 2) + " " + line(c.x + 8, c.y + 36, c.x + 52))
        .join(" "),
      tone: "main",
      delay: b + 0.6,
    },
    { kind: "fill", x: x + W - 22, y: TOP + 7, w: 8, h: 8, r: 4, tone: "ok", delay: b + 0.8 },
  ];
}

export const drawing: Shape[] = [
  ...brief(COLS[0]!, 0),
  ...prototype(COLS[1]!, 0.9),
  ...development(COLS[2]!, 1.8),
  ...launch(COLS[3]!, 2.7),
];
