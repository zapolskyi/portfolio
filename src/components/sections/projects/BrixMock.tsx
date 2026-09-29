import styles from "./BrixMock.module.scss";

// Намальоване превью головної BRIX 22° (з макета). Масштабується разом із
// контейнером: розміри в em, font-size контейнера — у cqw.
export function BrixMock() {
  return (
    <div className={styles["brix-mock"]} aria-hidden="true">
      <div className={styles["brix-mock__topbar"]}>
        БЕЗКОШТОВНА ДОСТАВКА ВІД 1 200 ₴ · ОБСМАЖУЄМО ЩОПОНЕДІЛКА
      </div>
      <div className={styles["brix-mock__nav"]}>
        <span className={styles["brix-mock__logo"]}>
          BRIX<span>22°</span>
        </span>
        <span className={styles["brix-mock__menu"]}>
          <span>Магазин</span>
          <span>Підбір кави</span>
          <span>BRIX Club</span>
          <span>Виробники</span>
        </span>
        <span className={styles["brix-mock__locale"]}>UA / EN · ₴ / €</span>
      </div>
      <div className={styles["brix-mock__hero"]}>
        <div className={styles["brix-mock__copy"]}>
          <span className={styles["brix-mock__kicker"]}>ЛОТ ТИЖНЯ</span>
          <div className={styles["brix-mock__title"]}>
            Зібрано
            <br />
            при <span>22°Bx</span>
          </div>
          <p className={styles["brix-mock__text"]}>
            Мікролоти від ферм, з якими працюємо напряму. Обсмажуємо щопонеділка і кладемо в кожну
            пачку паспорт лоту.
          </p>
          <div className={styles["brix-mock__buttons"]}>
            <span className={styles["brix-mock__primary"]}>Обрати каву →</span>
            <span className={styles["brix-mock__secondary"]}>Підібрати за 1 хвилину</span>
          </div>
        </div>
        <div className={styles["brix-mock__art"]}>
          <div className={styles["brix-mock__backdrop"]} />
          <div className={styles["brix-mock__pack"]}>
            <div className={styles["brix-mock__pack-top"]}>
              <span>BRIX 22°</span>
              <span>NATURAL</span>
            </div>
            <div className={styles["brix-mock__pack-brix"]}>22.4</div>
            <div className={styles["brix-mock__pack-name"]}>Ethiopia Guji Hambela</div>
          </div>
          <div className={styles["brix-mock__meter"]}>
            <div>РЕФРАКТОМЕТР</div>
            22.4 °Bx
          </div>
        </div>
      </div>
    </div>
  );
}
