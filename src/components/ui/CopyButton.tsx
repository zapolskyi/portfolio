"use client";

import { useEffect, useState, type ReactNode } from "react";

type Props = {
  text: string;
  label: string;
  copiedLabel: string;
  className?: string;
  labelClassName?: string;
  children: ReactNode;
};

// Копіює текст (email) у буфер; на 2 с показує «Скопійовано».
export function CopyButton({
  text,
  label,
  copiedLabel,
  className,
  labelClassName,
  children,
}: Props) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(id);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      // Буфер недоступний (http, заборона) — лишаємо текст видимим для ручного копіювання.
    }
  };

  return (
    <button type="button" className={className} onClick={copy}>
      {children}
      <span className={labelClassName} aria-live="polite">
        {copied ? copiedLabel : label}
      </span>
    </button>
  );
}
