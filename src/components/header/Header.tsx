"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { Button } from "@/components/ui/Button";
import { navOrder } from "@/config/site";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { cx } from "@/lib/cx";
import { getActiveSection, usePageScroll } from "@/lib/page-scroll";
import styles from "./Header.module.scss";

type Props = {
  lang: Locale;
  nav: Dictionary["nav"];
  t: Dictionary["header"];
};

export function Header({ lang, nav, t }: Props) {
  const scroll = usePageScroll();
  const active = getActiveSection(scroll);
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const menuRef = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);

  const home = lang === "en" ? "/en" : "/";
  const href = (id: string) => `${home}#${id}`;

  // Відкрите меню: блокуємо прокрутку, Esc закриває, фокус — на перший пункт.
  useEffect(() => {
    if (!open) return;
    const burger = burgerRef.current;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.documentElement.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    menuRef.current?.querySelector("a")?.focus();
    return () => {
      document.documentElement.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      burger?.focus();
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header
      className={cx(styles.header, (scroll.y > 8 || open) && styles["header--solid"])}
      style={{ "--progress": scroll.progress } as CSSProperties}
    >
      <Link href={`${home}#top`} className={styles.header__logo} onClick={close}>
        zapolskyi<span className={styles.header__dot}>.</span>
      </Link>

      <nav aria-label={nav.label} className={styles.header__nav}>
        {navOrder.map((id) => (
          <Link
            key={id}
            href={href(id)}
            className={cx(
              styles["header__nav-link"],
              active === id && styles["header__nav-link--active"],
            )}
            aria-current={active === id ? "location" : undefined}
          >
            {nav[id]}
          </Link>
        ))}
      </nav>

      <div className={styles.header__actions}>
        <div role="group" aria-label={t.langLabel} className={styles.header__lang}>
          <Link
            href="/"
            hrefLang="uk"
            lang="uk"
            className={styles["header__lang-link"]}
            aria-current={lang === "uk" ? "page" : undefined}
          >
            UA
          </Link>
          <Link
            href="/en"
            hrefLang="en"
            lang="en"
            className={styles["header__lang-link"]}
            aria-current={lang === "en" ? "page" : undefined}
          >
            EN
          </Link>
        </div>

        <Button href={href("contact")} size="md" arrow className={styles.header__cta}>
          {t.cta}
        </Button>

        <Button
          href={href("contact")}
          size="sm"
          className={cx(
            styles["header__cta-short"],
            scroll.progress > 0.5 && !open && styles["header__cta-short--visible"],
          )}
          tabIndex={scroll.progress > 0.5 && !open ? undefined : -1}
          aria-hidden={scroll.progress > 0.5 && !open ? undefined : true}
        >
          {t.ctaShort}
        </Button>

        <button
          ref={burgerRef}
          type="button"
          className={cx(styles.header__burger, open && styles["header__burger--open"])}
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={open ? t.closeMenu : t.openMenu}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
      </div>

      <span className={styles.header__progress} aria-hidden="true" />

      <div
        id={menuId}
        ref={menuRef}
        className={cx(styles.header__menu, open && styles["header__menu--open"])}
        hidden={!open}
      >
        <nav aria-label={nav.label} className={styles["header__menu-nav"]}>
          {navOrder.map((id) => (
            <Link key={id} href={href(id)} className={styles["header__menu-link"]} onClick={close}>
              {nav[id]}
            </Link>
          ))}
        </nav>
        <Button href={href("contact")} arrow onClick={close}>
          {t.cta}
        </Button>
      </div>
    </header>
  );
}
