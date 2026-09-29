"use client";

import { useId, useState, type FormEvent } from "react";
import { Chip } from "@/components/ui/Chip";
import type { Dictionary } from "@/i18n/get-dictionary";
import { setProjectType, useProjectType } from "@/lib/contact-intent";
import { cx } from "@/lib/cx";
import styles from "./Contact.module.scss";

type Props = { t: Dictionary["contact"]["form"] };
type Field = "name" | "contact" | "message";

const CONTACT_RE = /^(@[\w]{4,}|[^\s@]+@[^\s@]+\.[^\s@]+)$/;

// Форма заявки: клієнтська валідація і стани чипів. Тип проєкту спільний
// з «Послугами» (contact-intent). Відправка на сервер — фаза 6.
export function ContactForm({ t }: Props) {
  const id = useId();
  const type = useProjectType();
  const [budget, setBudget] = useState(3);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [status, setStatus] = useState<string | null>(null);

  const validate = (data: FormData) => {
    const next: Partial<Record<Field, string>> = {};
    if (!String(data.get("name") ?? "").trim()) next.name = t.errors.name;
    if (!CONTACT_RE.test(String(data.get("contact") ?? "").trim())) next.contact = t.errors.contact;
    if (String(data.get("message") ?? "").trim().length < 10) next.message = t.errors.message;
    return next;
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const next = validate(new FormData(form));
    setErrors(next);
    const first = Object.keys(next)[0];
    if (first) {
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      setStatus(null);
      return;
    }
    // TODO(фаза 6): Server Action + Zod-схема, відправка заявки.
    setStatus(t.pending);
  };

  const field = (name: Field) => ({
    id: `${id}-${name}`,
    name,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${id}-${name}-error` : undefined,
    onInput: () => errors[name] && setErrors((e) => ({ ...e, [name]: undefined })),
  });

  const error = (name: Field) =>
    errors[name] && (
      <span id={`${id}-${name}-error`} className={styles.contact__error}>
        {errors[name]}
      </span>
    );

  return (
    <form
      className={cx(styles.contact__form, "reveal")}
      aria-label={t.label}
      noValidate
      onSubmit={onSubmit}
    >
      <div className={styles.contact__row}>
        <div className={styles.contact__field}>
          <label htmlFor={`${id}-name`}>{t.name}</label>
          <input
            {...field("name")}
            className={styles.contact__input}
            type="text"
            autoComplete="name"
            placeholder={t.namePh}
          />
          {error("name")}
        </div>
        <div className={styles.contact__field}>
          <label htmlFor={`${id}-contact`}>{t.contact}</label>
          <input
            {...field("contact")}
            className={styles.contact__input}
            type="text"
            autoComplete="email"
            placeholder={t.contactPh}
          />
          {error("contact")}
        </div>
      </div>

      <fieldset className={styles.contact__fieldset}>
        <legend>{t.type}</legend>
        <div className={styles.contact__chips}>
          {t.types.map((label, i) => (
            <Chip key={label} selected={type === i} onClick={() => setProjectType(i)}>
              {label}
            </Chip>
          ))}
        </div>
        <input type="hidden" name="type" value={type === null ? "" : t.types[type]} />
      </fieldset>

      <fieldset className={styles.contact__fieldset}>
        <legend>{t.budget}</legend>
        <div className={styles.contact__chips}>
          {t.budgets.map((label, i) => (
            <Chip key={label} selected={budget === i} onClick={() => setBudget(i)}>
              {label}
            </Chip>
          ))}
        </div>
        <input type="hidden" name="budget" value={t.budgets[budget]} />
      </fieldset>

      <div className={styles.contact__field}>
        <label htmlFor={`${id}-message`}>{t.message}</label>
        <textarea
          {...field("message")}
          className={cx(styles.contact__input, styles["contact__input--textarea"])}
          rows={4}
          placeholder={t.messagePh}
        />
        {error("message")}
      </div>

      <button type="submit" className={styles.contact__submit}>
        {t.submit}
        <span className={styles["contact__submit-arrow"]} aria-hidden="true">
          →
        </span>
      </button>
      <p className={styles.contact__status} role="status">
        {status}
      </p>
      <span className={styles.contact__note}>{t.note}</span>
    </form>
  );
}
