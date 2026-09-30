import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Відкритий код — source maps у продакшені не шкодять і допомагають налагодженню.
  productionBrowserSourceMaps: true,
  experimental: {
    // Один лендинг, більшість відвідувачів — нові: CSS у <head> прибирає
    // блокувальні запити й прискорює перше малювання.
    inlineCss: true,
    // Корневий layout — у app/[lang], тож єдина 404 для неіснуючих адрес —
    // app/global-not-found.tsx (рендериться в обхід layout).
    globalNotFound: true,
  },
};

export default nextConfig;
