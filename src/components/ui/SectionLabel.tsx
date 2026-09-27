import styles from "./SectionLabel.module.scss";

type Props = { index: number; children: string };

export function SectionLabel({ index, children }: Props) {
  return (
    <span className={styles.label}>
      [ {String(index).padStart(2, "0")} ] {children}
    </span>
  );
}
