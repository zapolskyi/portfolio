import { readFile } from "node:fs/promises";
import { join } from "node:path";

// IBM Plex Mono для next/og: повні TTF, урізані до латиниці й кирилиці
// (satori не читає woff2, а підмножини fontsource для кирилиці ігнорує).
export async function plexMonoFonts() {
  const file = (name: string) => readFile(join(process.cwd(), "assets/fonts", name));
  const [regular, bold] = await Promise.all([
    file("IBMPlexMono-Regular.ttf"),
    file("IBMPlexMono-Bold.ttf"),
  ]);
  return [
    { name: "Plex", data: regular, weight: 400 as const, style: "normal" as const },
    { name: "Plex", data: bold, weight: 700 as const, style: "normal" as const },
  ];
}
