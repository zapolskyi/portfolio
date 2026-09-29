import { GitHubIcon, LinkedInIcon, TelegramIcon } from "@/components/icons/SocialIcons";
import { TypingHeading } from "@/components/typing-heading/TypingHeading";
import { Button } from "@/components/ui/Button";
import { CopyButton } from "@/components/ui/CopyButton";
import { contacts, socials } from "@/config/site";
import type { Dictionary } from "@/i18n/get-dictionary";
import { CityScene } from "./CityScene";
import styles from "./Footer.module.scss";

type Props = { t: Dictionary["footer"]; copy: Dictionary["contact"]; home: string };

const navIds = ["work", "portfolio", "services", "reviews", "faq"] as const;

export function Footer({ t, copy, home }: Props) {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.cta}>
            <TypingHeading as="h2" lines={t.title} className={styles.title} />
            <Button href={`${home}#contact`} arrow>
              {t.cta}
            </Button>
            <span className={styles.status}>
              <span className={styles.pulse} aria-hidden="true" />
              {t.status}
            </span>
          </div>

          <nav aria-label={t.navLabel} className={styles.col}>
            <span className={styles.colTitle}>{t.navTitle}</span>
            {navIds.map((id) => (
              <a key={id} href={`${home}#${id}`} className={styles.link}>
                {t.nav[id]}
              </a>
            ))}
          </nav>

          <div className={styles.col}>
            <span className={styles.colTitle}>{t.socialTitle}</span>
            <a className={styles.social} href={socials.github}>
              <GitHubIcon /> GitHub
            </a>
            <a className={styles.social} href={socials.linkedin}>
              <LinkedInIcon size={18} /> LinkedIn
            </a>
            <a className={styles.social} href={socials.telegram}>
              <TelegramIcon size={18} /> Telegram
            </a>
          </div>

          <div className={styles.col}>
            <span className={styles.colTitle}>{t.contactsTitle}</span>
            <CopyButton
              text={contacts.email}
              label={` · ${copy.copy}`}
              copiedLabel={` · ${copy.copied}`}
              className={styles.link}
              labelClassName={styles.copy}
            >
              {contacts.email}
            </CopyButton>
            <span className={styles.text}>{contacts.telegram}</span>
            <span className={styles.muted}>{t.location}</span>
          </div>
        </div>

        <div className={styles.city}>
          <CityScene />
          <div className={styles.wordmark} aria-hidden="true">
            Zapolskyi
          </div>
        </div>

        <div className={styles.bottom}>
          <span>{t.copyright}</span>
          <span className={styles.made}>{t.madeWith}</span>
          <a href={`${home}#top`} className={styles.link}>
            {t.toTop}
          </a>
        </div>
      </div>
    </footer>
  );
}
