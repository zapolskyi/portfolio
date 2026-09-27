import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cx } from "@/lib/cx";
import styles from "./Container.module.scss";

type Props<T extends ElementType> = { as?: T } & ComponentPropsWithoutRef<T>;

export function Container<T extends ElementType = "div">({ as, className, ...rest }: Props<T>) {
  const Tag = as ?? "div";
  return <Tag className={cx(styles.container, className)} {...rest} />;
}
