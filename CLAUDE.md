@AGENTS.md

# Інструкції для Claude Code

- `docs/` — лише локально, у git не комітимо (є в `.gitignore`). Там план, дизайн, стек і правила git.
- Git ведемо за `docs/GIT.md`: гілки `<тип>/<назва>` від `main`, Conventional Commits англійською зі scope за секцією сайту, один коміт = одна логічна зміна, у `main` — через PR.
- Після кожної завершеної задачі оновлюй `docs/PLAN.md`: галочки і рядок у «Журнал прогресу».
- Верстка — за `docs/DESIGN.md` і `docs/design/`; стек — за `docs/STACK.md`.
- Документація й тексти — українською.

## Верстка: БЕМ і семантика

- **БЕМ у CSS Modules.** Один модуль = один блок: `.hero`, `.hero__title`, `.hero--wide`, `.hero__title--accent`. Елементи й модифікатори — kebab-case (`projects__row--active`), стани — лише модифікатори (без `.active`, `.open`, `.isOn`). У TSX: `styles.hero__title` або `styles["hero__step-title"]`, динамічні — шаблоном ``styles[`button--${variant}`]``.
- **Семантика перш за все.** Кожна секція — `<section aria-labelledby>` на свій заголовок; ієрархія h1 → h2 → h3 без пропусків і в порядку DOM; списки — `ul/ol`, пари «назва — значення» — `dl`, текст — `p`, а не голі `span`.
- **Нативні елементи замість ARIA.** Вибір одного з кількох — radio (`ChoiceChip`), акордеон — `<details>`, дія — `<button>`, перехід — `<a href>` на існуючу адресу (жодних посилань «в нікуди»).
- **UX-патерни WAI-ARIA APG:** каруселі з кнопкою паузи й ролями slide, модальні шари роблять решту сторінки `inert` і повертають фокус, перемикачі — `aria-pressed`, поточне — `aria-current`.
- **Доступне ім'я містить видимий текст** (label-in-name); декоративне — `aria-hidden`; дубль тексту для анімацій — через `::before/::after` з `data-text`, не в DOM.
- Перевірка після змін: `npm run check`, `npm run build`, axe-core (WCAG 2.2 AA) — 0 порушень.
