"use client";

import { useSyncExternalStore } from "react";

// Тип проєкту, обраний у «Послугах» (індекс картки). Форма контакту
// підхоплює його й відмічає відповідний чип. null — нічого не обрано.
let projectType: number | null = null;
const listeners = new Set<() => void>();

export function setProjectType(index: number | null) {
  projectType = index;
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useProjectType() {
  return useSyncExternalStore(
    subscribe,
    () => projectType,
    () => null,
  );
}
