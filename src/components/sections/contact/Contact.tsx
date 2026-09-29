import { TypingHeading } from "@/components/typing-heading/TypingHeading";
import { CopyButton } from "@/components/ui/CopyButton";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { contacts, socials } from "@/config/site";
import type { Dictionary } from "@/i18n/get-dictionary";
import styles from "./Contact.module.scss";
import { ContactForm } from "./ContactForm";
import { PlotScene } from "./PlotScene";

type Props = { t: Dictionary["contact"]; heading: Dictionary["headings"]["contact"] };

export function Contact({ t, heading }: Props) {
  return (
    <section id="contact" className={styles.contact}>
      <div className={styles.contact__inner}>
        <PlotScene className={styles.contact__scene} />
        <header className={styles.contact__header}>
          <SectionLabel index={8}>{heading.label}</SectionLabel>
          <TypingHeading lines={heading.lines} className={styles.contact__title} />
        </header>

        <div className={styles.contact__grid}>
          <div className={`${styles.contact__aside} reveal`}>
            <p className={styles.contact__lead}>{t.lead}</p>
            <ul className={styles.contact__channels} aria-label={t.channelsLabel}>
              <li>
                <a className={styles.contact__channel} href={socials.telegram}>
                  <span className={styles["contact__channel-body"]}>
                    <span className={styles["contact__channel-name"]}>Telegram</span>
                    <span>{contacts.telegram}</span>
                  </span>
                  <span aria-hidden="true">↗</span>
                </a>
              </li>
              <li>
                <CopyButton
                  text={contacts.email}
                  label={t.copy}
                  copiedLabel={t.copied}
                  className={styles.contact__channel}
                  labelClassName={styles.contact__copy}
                >
                  <span className={styles["contact__channel-body"]}>
                    <span className={styles["contact__channel-name"]}>Email</span>
                    <span>{contacts.email}</span>
                  </span>
                </CopyButton>
              </li>
              <li>
                <a className={styles.contact__channel} href={socials.linkedin}>
                  <span className={styles["contact__channel-body"]}>
                    <span className={styles["contact__channel-name"]}>LinkedIn</span>
                    <span>nazarzapolskyi</span>
                  </span>
                  <span aria-hidden="true">↗</span>
                </a>
              </li>
            </ul>
            <figure className={styles.contact__quote}>
              <span className={styles["contact__quote-mark"]} aria-hidden="true">
                “
              </span>
              <blockquote>{t.quote.text}</blockquote>
              <figcaption>{t.quote.author}</figcaption>
            </figure>
          </div>

          <ContactForm t={t.form} />
        </div>
      </div>
    </section>
  );
}
