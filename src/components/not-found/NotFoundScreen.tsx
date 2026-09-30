import Link from "next/link";
import { Button } from "@/components/ui/Button";
import styles from "./NotFoundScreen.module.scss";

export function NotFoundScreen() {
  return (
    <main className={styles["not-found"]} aria-labelledby="not-found-title">
      <Link href="/" className={styles["not-found__logo"]}>
        zapolskyi<span className={styles["not-found__dot"]}>.</span>
      </Link>

      <div className={styles["not-found__body"]}>
        <p className={styles["not-found__label"]}>[ 404 ]</p>
        <h1 id="not-found-title" className={styles["not-found__title"]}>
          Сторінку не знайдено
        </h1>

        <figure className={styles["not-found__terminal"]}>
          <figcaption className="visually-hidden">Повідомлення термінала</figcaption>
          <pre className={styles["not-found__code"]}>
            <span className={styles["not-found__prompt"]}>~/zapolskyi.com $</span> cd сторінка{"\n"}
            <span className={styles["not-found__error"]}>
              cd: сторінка: такої адреси немає (404)
            </span>
            {"\n"}
            <span className={styles["not-found__prompt"]}>~/zapolskyi.com $</span>{" "}
            <span className={styles["not-found__cursor"]} aria-hidden="true" />
          </pre>
        </figure>

        <p className={styles["not-found__text"]}>
          Можливо, посилання застаріло або в адресі помилка. Почніть із головної або напишіть мені —
          підкажу, що шукали.
        </p>
        <p className={styles["not-found__text"]} lang="en">
          Page not found — the link may be outdated or mistyped.
        </p>

        <div className={styles["not-found__actions"]}>
          <Button href="/" arrow>
            На головну
          </Button>
          <Button href="/#contact" variant="secondary">
            Написати
          </Button>
          <Button href="/en" variant="secondary" lang="en" hrefLang="en">
            English
          </Button>
        </div>
      </div>
    </main>
  );
}
