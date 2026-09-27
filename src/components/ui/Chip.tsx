import type { ComponentProps } from "react";
import { cx } from "@/lib/cx";
import styles from "./Chip.module.scss";

type Props = ComponentProps<"button"> & { selected?: boolean };

export function Chip({ selected = false, className, type = "button", ...rest }: Props) {
  return (
    <button type={type} aria-pressed={selected} className={cx(styles.chip, className)} {...rest} />
  );
}
