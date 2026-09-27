"use client";

import { Button } from "@/components/ui/Button";
import { setProjectType } from "@/lib/contact-intent";

type Props = { index: number; href: string; label: string; className?: string };

// «Обрати»: переходимо до форми й передаємо тип проєкту.
export function ChooseService({ index, href, label, className }: Props) {
  return (
    <Button
      href={href}
      size="md"
      variant="secondary"
      arrow
      className={className}
      onClick={() => setProjectType(index)}
    >
      {label}
    </Button>
  );
}
