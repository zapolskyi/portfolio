// Вибірка точок із лінійних SVG-сцен (Процес, Вільна ділянка, Місто).
// Кожна фігура в SVG з атрибутом data-point-shape перетворюється на набір точок
// у нормалізованих координатах viewBox (0…1) + ознака акцентного кольору.
// Лінії — точки вздовж контуру, заливки (вікна, прапорець) — сітка всередині.

export type ShapeName = "process" | "plot" | "city";
export type ShapePoints = { name: ShapeName; points: Float32Array; count: number }; // u, v, accent

const SPACING = 3.2; // крок між точками в пікселях на екрані

function isAccent(color: string, accent: string) {
  return color.replace(/\s/g, "") === accent.replace(/\s/g, "");
}

export function sampleShapes(accentRgb: string): ShapePoints[] {
  const result: ShapePoints[] = [];
  const svgs = document.querySelectorAll<SVGSVGElement>("svg[data-point-shape]");

  svgs.forEach((svg) => {
    const name = svg.dataset.pointShape as ShapeName;
    const vb = svg.viewBox.baseVal;
    const box = svg.getBoundingClientRect();
    if (!vb.width || !box.width) return;
    const scale = box.width / vb.width; // пікселів на одиницю viewBox
    const step = SPACING / scale;
    const out: number[] = [];
    const push = (x: number, y: number, accent: boolean) =>
      out.push((x - vb.x) / vb.width, (y - vb.y) / vb.height, accent ? 1 : 0);

    svg.querySelectorAll<SVGGeometryElement>("path, rect, circle").forEach((el) => {
      if (el.closest("defs")) return;
      const cs = getComputedStyle(el);
      const filled = cs.fill !== "none" && !cs.fill.startsWith("url");
      const accent = isAccent(filled ? cs.fill : cs.stroke, accentRgb);
      const ctm = el.getCTM();
      const svgCtm = svg.getCTM();
      // Перетворення з локальних координат елемента (з урахуванням transform групи) у viewBox.
      const toView = ctm && svgCtm ? svgCtm.inverse().multiply(ctm) : null;
      const map = (x: number, y: number) => {
        if (!toView) return { x, y };
        return {
          x: toView.a * x + toView.c * y + toView.e,
          y: toView.b * x + toView.d * y + toView.f,
        };
      };

      if (filled) {
        const b = el.getBBox();
        for (let y = b.y + step / 2; y < b.y + b.height; y += step) {
          for (let x = b.x + step / 2; x < b.x + b.width; x += step) {
            const p = map(x, y);
            push(p.x, p.y, accent);
          }
        }
        return;
      }

      // pathLength="1" ламає getTotalLength — прибираємо на час вибірки.
      const declared = el.getAttribute("pathLength");
      if (declared) el.removeAttribute("pathLength");
      const length = el.getTotalLength();
      for (let l = 0; l <= length; l += step) {
        const pt = el.getPointAtLength(l);
        const p = map(pt.x, pt.y);
        push(p.x, p.y, accent);
      }
      if (declared) el.setAttribute("pathLength", declared);
    });

    result.push({ name, points: new Float32Array(out), count: out.length / 3 });
  });

  return result;
}
