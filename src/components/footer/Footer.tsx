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
      <div className={styles.footer__inner}>
        <div className={styles.footer__top}>
          <div className={styles.footer__cta}>
            <TypingHeading as="h2" lines={t.title} className={styles.footer__title} />
            <Button href={`${home}#contact`} arrow>
              {t.cta}
            </Button>
            <span className={styles.footer__status}>
              <span className={styles.footer__pulse} aria-hidden="true" />
              {t.status}
            </span>
          </div>

          <nav aria-label={t.navLabel} className={styles.footer__col}>
            <span className={styles["footer__col-title"]}>{t.navTitle}</span>
            {navIds.map((id) => (
              <a key={id} href={`${home}#${id}`} className={styles.footer__link}>
                {t.nav[id]}
              </a>
            ))}
          </nav>

          <div className={styles.footer__col}>
            <span className={styles["footer__col-title"]}>{t.socialTitle}</span>
            <a className={styles.footer__social} href={socials.github}>
              <GitHubIcon /> GitHub
            </a>
            <a className={styles.footer__social} href={socials.linkedin}>
              <LinkedInIcon size={18} /> LinkedIn
            </a>
            <a className={styles.footer__social} href={socials.telegram}>
              <TelegramIcon size={18} /> Telegram
            </a>
          </div>

          <div className={styles.footer__col}>
            <span className={styles["footer__col-title"]}>{t.contactsTitle}</span>
            <CopyButton
              text={contacts.email}
              label={` · ${copy.copy}`}
              copiedLabel={` · ${copy.copied}`}
              className={styles.footer__link}
              labelClassName={styles.footer__copy}
            >
              {contacts.email}
            </CopyButton>
            <span className={styles.footer__text}>{contacts.telegram}</span>
            <span className={styles.footer__muted}>{t.location}</span>
          </div>
        </div>

        <div className={styles.footer__city}>
          <CityScene />
          <div className={styles.footer__wordmark} aria-hidden="true">
            Zapolskyi
          </div>
        </div>

        <div className={styles.footer__bottom}>
          <span>{t.copyright}</span>
          <span className={styles.footer__made}>{t.madeWith}</span>
          <a href={`${home}#top`} className={styles.footer__link}>
            {t.toTop}
          </a>
        </div>
      </div>
    </footer>
  );
}
