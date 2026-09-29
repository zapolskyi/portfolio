import { TypingHeading } from "@/components/typing-heading/TypingHeading";
import { SectionLabel } from "@/components/ui/SectionLabel";
import type { Dictionary } from "@/i18n/get-dictionary";
import styles from "./Reviews.module.scss";
import { ReviewsCarousel } from "./ReviewsCarousel";

type Props = { t: Dictionary["reviews"]; heading: Dictionary["headings"]["reviews"] };

export function Reviews({ t, heading }: Props) {
  return (
    <section id="reviews" className={styles.section}>
      <div className={`${styles.inner} reveal`}>
        <div className={styles.intro}>
          <SectionLabel index={5}>{heading.label}</SectionLabel>
          <TypingHeading lines={heading.lines} className={styles.title} />
          <p className={styles.lead}>{t.lead}</p>
        </div>
        <ReviewsCarousel t={t} />
      </div>
    </section>
  );
}
