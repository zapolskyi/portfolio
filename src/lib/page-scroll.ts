"use client";

import { useSyncExternalStore } from "react";
import { sections, type SectionId } from "@/config/site";

// Один слухач scroll/resize на всю сторінку; шапка й скролбар читають
// спільний знімок через useSyncExternalStore. Оновлення — не частіше за кадр.

export type PageScroll = {
  y: number;
  max: number; // scrollHeight − innerHeight
  progress: number; // 0…1
  vh: number; // висота вікна
  offsets: Array<{ id: SectionId; top: number }>;
};

const initial: PageScroll = { y: 0, max: 1, progress: 0, vh: 900, offsets: [] };
let snapshot = initial;
const listeners = new Set<() => void>();
let frame = 0;
let resizeObserver: ResizeObserver | null = null;

function measureOffsets() {
  return sections.flatMap(({ id }) => {
    const el = document.getElementById(id);
    return el ? [{ id, top: Math.round(el.getBoundingClientRect().top + window.scrollY) }] : [];
  });
}

function update(remeasure: boolean) {
  const y = window.scrollY;
  const vh = window.innerHeight;
  const max = Math.max(1, document.documentElement.scrollHeight - vh);
  const offsets = remeasure ? measureOffsets() : snapshot.offsets;
  if (!remeasure && y === snapshot.y && max === snapshot.max) return;
  snapshot = { y, max, vh, progress: Math.min(1, Math.max(0, y / max)), offsets };
  listeners.forEach((l) => l());
}

function schedule(remeasure: boolean) {
  if (remeasure) {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      frame = 0;
      update(true);
    });
    return;
  }
  if (frame) return;
  frame = requestAnimationFrame(() => {
    frame = 0;
    update(false);
  });
}

const onScroll = () => schedule(false);
const onResize = () => schedule(true);

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) {
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(document.body);
    update(true);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      resizeObserver?.disconnect();
      cancelAnimationFrame(frame);
      frame = 0;
    }
  };
}

export function usePageScroll() {
  return useSyncExternalStore(
    subscribe,
    () => snapshot,
    () => initial,
  );
}

// Поточна секція: остання, чий верх піднявся вище ~третини екрана; внизу — остання.
export function getActiveSection({ y, max, offsets }: PageScroll): SectionId {
  if (offsets.length && y >= max - 4) return offsets[offsets.length - 1]!.id;
  let active: SectionId = "top";
  for (const o of offsets) if (o.top - 320 <= y) active = o.id;
  return active;
}
