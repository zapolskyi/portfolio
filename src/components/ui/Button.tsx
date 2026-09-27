import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cx } from "@/lib/cx";
import styles from "./Button.module.scss";

type Variant = "primary" | "secondary";
type Size = "lg" | "md" | "sm";

type Props = Omit<ComponentProps<typeof Link>, "className"> & {
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
  className?: string;
  children: ReactNode;
};

export function Button({
  variant = "primary",
  size = "lg",
  arrow = false,
  className,
  children,
  ...rest
}: Props) {
  return (
    <Link className={cx(styles.button, styles[variant], styles[size], className)} {...rest}>
      {children}
      {arrow && (
        <span className={styles.arrow} aria-hidden="true">
          →
        </span>
      )}
    </Link>
  );
}
