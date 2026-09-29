import { TypingHeading } from "@/components/typing-heading/TypingHeading";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { socials } from "@/config/site";
import type { Dictionary } from "@/i18n/get-dictionary";
import styles from "./About.module.scss";

type Props = { t: Dictionary["about"]; heading: Dictionary["headings"]["about"] };

const icons: Record<string, React.ReactNode> = {
  edit: (
    <>
      <path d="M4 20h4L19 9l-4-4L4 16v4z" />
      <path d="M13.5 6.5l4 4" />
    </>
  ),
  truck: (
    <>
      <path d="M3 7h11v9H3z" />
      <path d="M14 10h4l3 3v3h-7" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
};

export function About({ t, heading }: Props) {
  return (
    <section id="about" className={styles.section}>
      <div className={styles.inner}>
        <div className={`${styles.stack} reveal`}>
          <h3 className={styles.stackTitle}>{t.stackTitle}</h3>
          {t.stack.map(({ group, items }) => (
            <div key={group} className={styles.group}>
              <span className={styles.groupName}>{group}</span>
              <ul className={styles.chips}>
                {items.map((item) => (
                  <li key={item} className={styles.chip}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={`${styles.content} reveal`}>
          <SectionLabel index={6}>{heading.label}</SectionLabel>
          <TypingHeading lines={heading.lines} className={styles.title} />
          <p className={styles.text}>{t.text}</p>
          <ul className={styles.perks}>
            {t.perks.map((perk) => (
              <li key={perk.title} className={styles.perk}>
                <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
                  {icons[perk.icon]}
                </svg>
                <div>
                  <div className={styles.perkTitle}>{perk.title}</div>
                  <div className={styles.perkText}>{perk.text}</div>
                </div>
              </li>
            ))}
          </ul>
          <div className={styles.links}>
            <Button href={socials.github} variant="secondary" size="md">
              GitHub <span aria-hidden="true">↗</span>
            </Button>
            <Button href={socials.linkedin} variant="secondary" size="md">
              LinkedIn <span aria-hidden="true">↗</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
