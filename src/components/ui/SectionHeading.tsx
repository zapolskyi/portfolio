import { TypingHeading, type TypingLine } from "@/components/typing-heading/TypingHeading";
import { cx } from "@/lib/cx";
import { SectionLabel } from "./SectionLabel";
import styles from "./SectionHeading.module.scss";

type Heading = { label: string; lines: TypingLine[]; linesMobile?: TypingLine[] };

type Props = {
  index: number;
  id: string; // секція посилається на нього через aria-labelledby
  heading: Heading;
  className?: string;
};

// Єдиний патерн заголовка секції: мітка «[ 0N ] Назва» + h2, що друкується
// при появі. Розмір і відступи однакові в усіх секціях.
export function SectionHeading({ index, id, heading, className }: Props) {
  return (
    <div className={cx(styles["section-heading"], className)}>
      <SectionLabel index={index}>{heading.label}</SectionLabel>
      <TypingHeading
        id={id}
        lines={heading.lines}
        linesMobile={heading.linesMobile}
        className={styles["section-heading__title"]}
      />
    </div>
  );
}
