"use client";

import { useEffect, useRef, useState } from "react";
import type { TerrainScene } from "./terrain-scene";
import styles from "./Hero.module.scss";

// WebGL-фон hero. Three.js підвантажується після першого малювання сторінки
// (requestIdleCallback), тож текст і кнопки не чекають на 3D.
// Сцену не вантажимо взагалі, якщо GPU немає (програмний рендер SwiftShader /
// llvmpipe), пристрій слабкий або ввімкнено Save-Data — там 3D гальмує сторінку.
// Тоді лишається CSS-градієнт. З reduced motion — один статичний кадр.
export function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = canvas?.closest("section");
    if (!canvas || !hero) return;

    let scene: TerrainScene | null = null;
    let cancelled = false;
    let visible = true;
    const cleanups: Array<() => void> = [];

    const canRender3D = () => {
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

    const init = async () => {
      if (cancelled || !canRender3D()) return;
      const { createTerrainScene } = await import("./terrain-scene");
      if (cancelled) return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const accent = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim();
      scene = createTerrainScene({
        canvas,
        accent: accent || "#f5b754",
        animate: !reduced,
        dense: window.innerWidth >= 1024,
      });
      await scene.compile();
      if (cancelled) return;
      scene.start();
      setReady(true);

      // Малюємо лише коли hero на екрані і вкладка активна.
      const io = new IntersectionObserver(([entry]) => {
        visible = !!entry?.isIntersecting;
        if (visible && !document.hidden) scene?.start();
        else scene?.stop();
      });
      io.observe(hero);

      const onVisibility = () => (document.hidden || !visible ? scene?.stop() : scene?.start());
      const onPointer = (e: PointerEvent) => {
        const r = canvas.getBoundingClientRect();
        scene?.setPointer(
          ((e.clientX - r.left) / r.width) * 2 - 1,
          -((e.clientY - r.top) / r.height) * 2 + 1,
        );
      };
      const ro = new ResizeObserver(() => scene?.resize());
      ro.observe(canvas);

      document.addEventListener("visibilitychange", onVisibility);
      hero.addEventListener("pointermove", onPointer);
      cleanups.push(
        () => io.disconnect(),
        () => ro.disconnect(),
        () => document.removeEventListener("visibilitychange", onVisibility),
        () => hero.removeEventListener("pointermove", onPointer),
      );
    };

    // Після першого малювання, у вільний час браузера.
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
    const cancelIdle = window.cancelIdleCallback ?? window.clearTimeout;
    const id = idle(() => void init(), { timeout: 1500 });

    return () => {
      cancelled = true;
      cancelIdle(id);
      cleanups.forEach((fn) => fn());
      scene?.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={styles.canvas}
      data-ready={ready || undefined}
      aria-hidden="true"
    />
  );
}
