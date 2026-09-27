import styles from "./Marquee.module.scss";

type Props = { items: string[] };

// Бігучий рядок стеку. Два однакові набори зсуваються на −50% — шов не видно.
// Декоративний: стек перелічено й в «Про мене», тож для скрінрідерів прихований.
export function Marquee({ items }: Props) {
  const set = items.flatMap((item) => [item, "/"]);
  return (
    <div className={styles.marquee} aria-hidden="true">
      <div className={styles.track}>
        {[...set, ...set].map((item, i) => (
          <span key={i} className={item === "/" ? styles.sep : undefined}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
