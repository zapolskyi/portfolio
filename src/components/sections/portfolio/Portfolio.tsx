import { SectionLabel } from "@/components/ui/SectionLabel";
import { portfolio } from "@/content/portfolio";
import type { Dictionary } from "@/i18n/get-dictionary";
import styles from "./Portfolio.module.scss";
import { PortfolioSlider } from "./PortfolioSlider";

type Props = {
  t: Dictionary["portfolio"];
  heading: Dictionary["headings"]["portfolio"];
  home: string;
};

export function Portfolio({ t, heading, home }: Props) {
  return (
    <section id="portfolio" className={styles.portfolio} aria-labelledby="portfolio-title">
      <div className={`${styles["portfolio__label-row"]} reveal`}>
        <SectionLabel index={4}>{heading.label}</SectionLabel>
        <span className={styles.portfolio__hint}>{t.hint}</span>
      </div>
      <PortfolioSlider cards={portfolio} t={t} heading={heading} home={home} />
    </section>
  );
}
