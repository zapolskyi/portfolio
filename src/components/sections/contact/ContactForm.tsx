"use client";

import { useActionState, useEffect, useId, useRef, useState, type FormEvent } from "react";
import { sendContactRequest } from "@/app/actions/contact";
import { ChoiceChip } from "@/components/ui/ChoiceChip";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { invalidFields, type ContactField, type ContactState } from "@/lib/contact/rules";
import { setProjectType, useProjectType } from "@/lib/contact-intent";
import { cx } from "@/lib/cx";
import styles from "./Contact.module.scss";

type Props = { t: Dictionary["contact"]["form"]; lang: Locale };

const initial: ContactState = { status: "idle" };

// Форма заявки → Server Action → Telegram. Спершу миттєва перевірка на клієнті
// (та сама Zod-схема, що й на сервері), тип проєкту спільний із «Послугами».
export function ContactForm({ t, lang }: Props) {
  const id = useId();
  const type = useProjectType();
  const [budget, setBudget] = useState(3);
  const [clientErrors, setErrors] = useState<ContactField[]>([]);
  const [state, formAction, pending] = useActionState(sendContactRequest, initial);
  const successRef = useRef<HTMLDivElement>(null);
  const startedAt = useRef(0);
  const startedInput = useRef<HTMLInputElement>(null);

  // Час показу форми — для антиспаму (заповнення швидше 3 с = бот).
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  // Після успіху фокус — на підтвердження, щоб його почули скрінрідери.
  useEffect(() => {
    if (state.status === "sent") successRef.current?.focus();
  }, [state]);

  // Помилки з сервера показуємо, лише якщо клієнтську перевірку обійшли.
  const errors =
    clientErrors.length === 0 && state.status === "invalid" ? state.fields : clientErrors;

  const messages: Record<ContactField, string> = t.errors;

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget;
    if (startedInput.current) startedInput.current.value = String(startedAt.current);
    const bad = invalidFields(new FormData(form));
    setErrors(bad);
    if (bad.length) {
      e.preventDefault();
      form.querySelector<HTMLElement>(`[name="${bad[0]}"]`)?.focus();
    }
  };

  if (state.status === "sent") {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className={cx(styles.contact__form, styles.contact__success)}
      >
        <p className={styles["contact__success-title"]}>{t.successTitle}</p>
        <p className={styles["contact__success-text"]}>{t.successText}</p>
      </div>
    );
  }

  const field = (name: ContactField) => {
    const invalid = errors.includes(name);
    return {
      id: `${id}-${name}`,
      name,
      required: true, // aria-required; перевіряємо самі (noValidate) з людськими текстами
      "aria-invalid": invalid || undefined,
      "aria-describedby": invalid ? `${id}-${name}-error` : undefined,
      onInput: () => invalid && setErrors((list) => list.filter((f) => f !== name)),
    };
  };

  const error = (name: ContactField) =>
    errors.includes(name) && (
      <span id={`${id}-${name}-error`} className={styles.contact__error}>
        {messages[name]}
      </span>
    );

  const statusText =
    state.status === "error" ? t.errorSend : state.status === "unavailable" ? t.unavailable : "";

  return (
    <form
      className={cx(styles.contact__form, "reveal")}
      aria-label={t.label}
      noValidate
      action={formAction}
      onSubmit={onSubmit}
      aria-busy={pending || undefined}
    >
      <input type="hidden" name="lang" value={lang} />
      <input ref={startedInput} type="hidden" name="startedAt" defaultValue="" />
      {/* Пастка для ботів: людина цього поля не бачить і не заповнює. */}
      <div className={styles.contact__trap} aria-hidden="true">
        <label>
          {t.honeypot}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

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
            <ChoiceChip
              key={label}
              name="type"
              value={label}
              checked={type === i}
              onChange={() => setProjectType(i)}
            >
              {label}
            </ChoiceChip>
          ))}
        </div>
      </fieldset>

      <fieldset className={styles.contact__fieldset}>
        <legend>{t.budget}</legend>
        <div className={styles.contact__chips}>
          {t.budgets.map((label, i) => (
            <ChoiceChip
              key={label}
              name="budget"
              value={label}
              checked={budget === i}
              onChange={() => setBudget(i)}
            >
              {label}
            </ChoiceChip>
          ))}
        </div>
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

      <button type="submit" className={styles.contact__submit} disabled={pending}>
        {pending ? t.sending : t.submit}
        {!pending && (
          <span className={styles["contact__submit-arrow"]} aria-hidden="true">
            →
          </span>
        )}
      </button>
      <p className={styles.contact__status} role="status">
        {statusText}
      </p>
      <span className={styles.contact__note}>{t.note}</span>
    </form>
  );
}
