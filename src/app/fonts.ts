import { IBM_Plex_Mono } from "next/font/google";

export const plexMono = IBM_Plex_Mono({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-plex-mono",
});
