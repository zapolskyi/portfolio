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
    <section id="contact" className={styles.section}>
      <div className={styles.inner}>
        <PlotScene className={styles.scene} />
        <header className={styles.header}>
          <SectionLabel index={8}>{heading.label}</SectionLabel>
          <TypingHeading lines={heading.lines} className={styles.title} />
        </header>

        <div className={styles.grid}>
          <div className={`${styles.aside} reveal`}>
            <p className={styles.lead}>{t.lead}</p>
            <ul className={styles.channels} aria-label={t.channelsLabel}>
              <li>
                <a className={styles.channel} href={socials.telegram}>
                  <span className={styles.channelBody}>
                    <span className={styles.channelName}>Telegram</span>
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
                  className={styles.channel}
                  labelClassName={styles.copy}
                >
                  <span className={styles.channelBody}>
                    <span className={styles.channelName}>Email</span>
                    <span>{contacts.email}</span>
                  </span>
                </CopyButton>
              </li>
              <li>
                <a className={styles.channel} href={socials.linkedin}>
                  <span className={styles.channelBody}>
                    <span className={styles.channelName}>LinkedIn</span>
                    <span>nazarzapolskyi</span>
                  </span>
                  <span aria-hidden="true">↗</span>
                </a>
              </li>
            </ul>
            <figure className={styles.quote}>
              <span className={styles.quoteMark} aria-hidden="true">
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
