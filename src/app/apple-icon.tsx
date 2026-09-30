import { ImageResponse } from "next/og";

// Іконка для «На початковий екран» (iOS): та сама «z.» на темному тлі.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0b0b0c",
      }}
    >
      <svg width="120" height="120" viewBox="0 0 32 32">
        <path d="M8 10h11L8 22h11" fill="none" stroke="#e8e6e3" strokeWidth="3" />
        <rect x="22" y="19" width="3.5" height="3.5" fill="#f5b754" />
      </svg>
    </div>,
    size,
  );
}
