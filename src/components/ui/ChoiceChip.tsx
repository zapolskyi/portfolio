import type { ComponentProps, ReactNode } from "react";
import { cx } from "@/lib/cx";
import styles from "./ChoiceChip.module.scss";

type Props = Omit<ComponentProps<"input">, "type" | "className"> & {
  children: ReactNode;
  className?: string;
};

// Вибір одного варіанта з кількох (radio), що виглядає як чип. Групуйте у
// <fieldset> з <legend>: стрілки, озвучення «обрано, 2 з 4» і відправка форми —
// нативні.
export function ChoiceChip({ children, className, ...input }: Props) {
  return (
    <label className={cx(styles["choice-chip"], className)}>
      <input type="radio" className={styles["choice-chip__input"]} {...input} />
      <span className={styles["choice-chip__label"]}>{children}</span>
    </label>
  );
}
