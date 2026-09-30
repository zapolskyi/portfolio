import { ImageResponse } from "next/og";
import en from "@/i18n/dictionaries/en.json";
import uk from "@/i18n/dictionaries/uk.json";
import { locales } from "@/i18n/config";
import { plexMonoFonts } from "@/lib/og-fonts";

// Превʼю посилання (Telegram, LinkedIn, Viber…) у стилі hero для кожної мови.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "zapolskyi. — fast websites that sell";

// Генеруємо обидві картинки під час збірки, а не на кожен запит.
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

const BG = "#0b0b0c";
const TEXT = "#e8e6e3";
const MUTED = "#86868b";
const ACCENT = "#f5b754";

export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const t = lang === "en" ? en : uk;
  const [first, second] = t.hero.title;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px 72px",
        background: `radial-gradient(ellipse 70% 60% at 80% 10%, #1c1810 0%, ${BG} 70%)`,
        color: TEXT,
        fontFamily: "Plex",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28 }}>
        <span style={{ fontWeight: 700 }}>
          zapolskyi<span style={{ color: ACCENT }}>.</span>
        </span>
        <span style={{ color: MUTED }}>zapolskyi.com</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <span style={{ fontSize: 30, color: MUTED }}>
          <span style={{ color: ACCENT }}>&gt;</span>&nbsp;{t.hero.greeting}
        </span>
        <span style={{ fontSize: 96, fontWeight: 700, lineHeight: 1.05 }}>{first?.text}</span>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 96,
            fontWeight: 700,
          }}
        >
          <span style={{ color: ACCENT, lineHeight: 1.05 }}>{second?.text}</span>
          <span style={{ width: 52, height: 82, marginLeft: 12, background: ACCENT }} />
        </span>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: MUTED }}>
        <span>{t.hero.role}</span>
        <span style={{ color: ACCENT }}>Lighthouse 99</span>
      </div>
    </div>,
    { ...size, fonts: await plexMonoFonts() },
  );
}
