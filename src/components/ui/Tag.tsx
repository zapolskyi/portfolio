import type { ComponentProps } from "react";
import { cx } from "@/lib/cx";
import styles from "./Tag.module.scss";

type Props = ComponentProps<"span"> & { variant?: "default" | "concept" | "feature" };

export function Tag({ variant = "default", className, ...rest }: Props) {
  return <span className={cx(styles.tag, styles[variant], className)} {...rest} />;
}
