import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Dictionary } from "@/i18n/get-dictionary";
import styles from "./Reviews.module.scss";
import { ReviewsCarousel } from "./ReviewsCarousel";

type Props = { t: Dictionary["reviews"]; heading: Dictionary["headings"]["reviews"] };

export function Reviews({ t, heading }: Props) {
  return (
    <section id="reviews" className={styles.reviews} aria-labelledby="reviews-title">
      <div className={`${styles.reviews__inner} reveal`}>
        <div className={styles.reviews__intro}>
          <SectionHeading index={5} id="reviews-title" heading={heading} />
          <p className={styles.reviews__lead}>{t.lead}</p>
        </div>
        <ReviewsCarousel t={t} />
      </div>
    </section>
  );
}
