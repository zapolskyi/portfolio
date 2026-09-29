"use client";

import { useEffect, useRef, useState } from "react";
import type { PointField as Field } from "./point-field-scene";
import styles from "./PointField.module.scss";

// Фонове поле точок на всю сторінку (одне WebGL-полотно). Вантажиться після
// першого малювання й лише за наявності реального GPU; інакше, а також із
// reduced motion, лишаються лінійні SVG-сцени секцій. Коли поле готове,
// <html> отримує клас gl-points і SVG-сцени ховаються — їх малюють точки.
export function PointField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let field: Field | null = null;
    let cancelled = false;
    const cleanups: Array<() => void> = [];

    const canRender3D = () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
      const nav = navigator as Navigator & {
        deviceMemory?: number;
        connection?: { saveData?: boolean };
      };
      if (nav.connection?.saveData) return false;
      if ((nav.deviceMemory ?? 8) < 4 || (nav.hardwareConcurrency ?? 8) < 4) return false;
      try {
        const gl = document.createElement("canvas").getContext("webgl2");
        if (!gl) return false;
        const info = gl.getExtension("WEBGL_debug_renderer_info");
        const gpu = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : "";
        gl.getExtension("WEBGL_lose_context")?.loseContext();
        return !/swiftshader|llvmpipe|software|basic render/i.test(gpu);
      } catch {
        return false;
      }
    };

    // Кольори токенів у rgb() — щоб розпізнати акцентні й «онлайн»-лінії у SVG.
    const tokenColor = (token: string) => {
      const probe = document.createElement("span");
      probe.style.color = `var(${token})`;
      document.body.append(probe);
      const rgb = getComputedStyle(probe).color;
      probe.remove();
      return rgb;
    };

    const init = async () => {
      if (cancelled || !canRender3D()) return;
      const [{ createPointField }, { sampleShapes }] = await Promise.all([
        import("./point-field-scene"),
        import("./sample-shapes"),
      ]);
      if (cancelled) return;

      const palette = {
        accent: tokenColor("--accent"),
        ok: tokenColor("--ok"),
        sub: tokenColor("--scene-line-2"),
      };
      field = createPointField({ canvas, ...palette, dense: window.innerWidth >= 1024 });
      const loadShapes = () => field?.setShapes(sampleShapes(palette));
      await document.fonts.ready; // розміри SVG залежать від верстки зі шрифтом
      loadShapes();
      await field.compile();
      if (cancelled) return;
      field.start();
      document.documentElement.classList.add("gl-points");
      setReady(true);

      const onVisibility = () => (document.hidden ? field?.stop() : field?.start());
      const onPointer = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        field?.setPointer(
          (e.clientX / window.innerWidth) * 2 - 1,
          -(e.clientY / window.innerHeight) * 2 + 1,
        );
      };
      let resizeTimer = 0;
      const onResize = () => {
        field?.resize();
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(loadShapes, 200); // густина форм залежить від ширини
      };

      document.addEventListener("visibilitychange", onVisibility);
      window.addEventListener("pointermove", onPointer, { passive: true });
      window.addEventListener("resize", onResize);
      cleanups.push(
        () => document.removeEventListener("visibilitychange", onVisibility),
        () => window.removeEventListener("pointermove", onPointer),
        () => window.removeEventListener("resize", onResize),
        () => window.clearTimeout(resizeTimer),
        () => document.documentElement.classList.remove("gl-points"),
      );
    };

    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
    const cancelIdle = window.cancelIdleCallback ?? window.clearTimeout;
    const id = idle(() => void init(), { timeout: 1500 });

    return () => {
      cancelled = true;
      cancelIdle(id);
      cleanups.forEach((fn) => fn());
      field?.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={styles["point-field"]}
      data-ready={ready || undefined}
      aria-hidden="true"
    />
  );
}
