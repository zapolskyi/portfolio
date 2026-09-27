"use client";

import { useEffect, useState, type RefObject } from "react";

// true, щойно елемент уперше з'явився в полі зору; далі не відстежує.
export function useInViewOnce(ref: RefObject<Element | null>, threshold = 0.5, enabled = true) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el || inView) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold, enabled, inView]);

  return inView;
}
