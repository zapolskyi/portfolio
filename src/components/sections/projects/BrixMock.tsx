import styles from "./BrixMock.module.scss";

// Намальоване превью головної BRIX 22° (з макета). Масштабується разом із
// контейнером: розміри в em, font-size контейнера — у cqw.
export function BrixMock() {
  return (
    <div className={styles.mock} aria-hidden="true">
      <div className={styles.topbar}>БЕЗКОШТОВНА ДОСТАВКА ВІД 1 200 ₴ · ОБСМАЖУЄМО ЩОПОНЕДІЛКА</div>
      <div className={styles.nav}>
        <span className={styles.logo}>
          BRIX<span>22°</span>
        </span>
        <span className={styles.menu}>
          <span>Магазин</span>
          <span>Підбір кави</span>
          <span>BRIX Club</span>
          <span>Виробники</span>
        </span>
        <span className={styles.locale}>UA / EN · ₴ / €</span>
      </div>
      <div className={styles.hero}>
        <div className={styles.copy}>
          <span className={styles.kicker}>ЛОТ ТИЖНЯ</span>
          <div className={styles.title}>
            Зібрано
            <br />
            при <span>22°Bx</span>
          </div>
          <p className={styles.text}>
            Мікролоти від ферм, з якими працюємо напряму. Обсмажуємо щопонеділка і кладемо в кожну
            пачку паспорт лоту.
          </p>
          <div className={styles.buttons}>
            <span className={styles.primary}>Обрати каву →</span>
            <span className={styles.secondary}>Підібрати за 1 хвилину</span>
          </div>
        </div>
        <div className={styles.art}>
          <div className={styles.backdrop} />
          <div className={styles.pack}>
            <div className={styles.packTop}>
              <span>BRIX 22°</span>
              <span>NATURAL</span>
            </div>
            <div className={styles.packBrix}>22.4</div>
            <div className={styles.packName}>Ethiopia Guji Hambela</div>
          </div>
          <div className={styles.meter}>
            <div>РЕФРАКТОМЕТР</div>
            22.4 °Bx
          </div>
        </div>
      </div>
    </div>
  );
}
