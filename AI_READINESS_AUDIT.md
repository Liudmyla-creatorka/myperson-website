# AI Readiness Audit — myperson.agency

Дата: 2026-09-28 · Гілка: `claude/cool-mccarthy-t1htwe` (від `main` @ `de76a84`) · PR #3

Мета: зробити сайт зрозумілим, індексованим, структурованим і придатним для цитування пошуковими та AI-системами (Google, AI Overviews, ChatGPT, Perplexity). Це не гарантує появи у відповідях AI. Це прибирає технічні причини, через які сайт можуть не зрозуміти або зрозуміти неправильно.

## Як проводився аудит

- Production-збірка (`next build` + `next start`), 5 маршрутів × 2 мови = 10 публічних сторінок.
- Кожну сторінку завантажено двічі в Chromium: **без JavaScript** (так її бачить більшість AI-краулерів) і з JavaScript. Зібрано: статус, `lang`, title, description, robots, canonical, hreflang, Open Graph, Twitter, H1–H4, JSON-LD, усі посилання, кнопки, зображення з `alt`, відео, canvas, форми, діалоги, обсяг тексту в `<main>`.
- Окремо перевірено `sitemap.xml`, `robots.txt`, HTTP-статуси старих `/portfolio/{slug}`, клавіатурну навігацію, фокус, модалку, мобільні вьюпорти, а також відповідність кожного прихованого тексту й кожного твердження в JSON-LD видимому змісту сторінки.

## Карта сайту (після змін)

| URL | Title | H1 | JSON-LD |
|---|---|---|---|
| `/pl` | MY PERSON — Studio Narracji Wizualnych | MY PERSON | Organization, WebSite, WebPage |
| `/en` | MY PERSON — Visual Narratives Studio | MY PERSON | Organization, WebSite, WebPage |
| `/pl/portfolio` | Portfolio — kampanie wideo i wizualizacje produktowe \| MY PERSON | Portfolio (прихований, дублює видимий H2) | + CollectionPage з `hasPart` → 3 × CreativeWork |
| `/en/portfolio` | Portfolio — Video Campaigns & Product Visuals \| MY PERSON | Portfolio (прихований, дублює видимий H2) | + CollectionPage з `hasPart` → 3 × CreativeWork |
| `/pl/services` | Usługi — brand identity, strategia wizualna i wideo \| MY PERSON | Usługi (прихований, дублює видимий H2) | + WebPage з `mainEntity` → ItemList з 4 × Service |
| `/en/services` | Services — Brand Identity, Visual Strategy & Video \| MY PERSON | Services (прихований, дублює видимий H2) | + WebPage з `mainEntity` → ItemList з 4 × Service |
| `/pl/landing-pages` | Strony internetowe i landing page'e — projektowanie \| MY PERSON | Tworzę cyfrowe doświadczenia, nie tylko strony. | + WebPage з `mainEntity` → Service |
| `/en/landing-pages` | Website & Landing Page Design \| MY PERSON | I create digital experiences, not just websites. | + WebPage з `mainEntity` → Service |
| `/pl/about` | O mnie — studio narracji wizualnych \| MY PERSON | O mnie | + AboutPage |
| `/en/about` | About — Visual Narratives Studio \| MY PERSON | About | + AboutPage |

- Усі 10 сторінок відповідають 200, мають `lang`, self-canonical, hreflang `pl` / `en` / `x-default` (→ `pl`), `og:image` і `twitter:image`.
- `sitemap.xml`: рівно ці 10 URL з hreflang-альтернативами. `robots.txt`: `Allow: /` і посилання на sitemap.
- `/pl|en/portfolio/{aurora,meridian,lumen}` віддають 404 з `noindex`. Посилань на них немає ні в HTML, ні в sitemap, ні в JSON-LD.
- Уся текстова інформація відрендерена на сервері; canvas і контенту, доступного тільки через JS, немає.
- Контакти (email, телефон, WhatsApp, Instagram, Facebook, форма Tally) є в HTML футера на кожній сторінці.

## Знахідки

Статус: ✅ виправлено в PR #3 · 📝 потрібне рішення власниці · ⏸ свідомо відкладено.

### P0 — критично для індексації або правильного розуміння сайту

| # | Знахідка | Статус |
|---|---|---|
| P0-1 | На `/landing-pages` демо вигаданого бренду AUBE (сироватка для тіла, ціна, кнопка «Dodaj do koszyka») стоїть **перед** H1 студії. AI міг вирішити, що MY PERSON продає косметику. | ✅ Секція з демо має локалізовану назву «AUBE — demonstracyjny landing page MY PERSON» і `data-nosnippet` (див. «Самоперевірка → data-nosnippet»). Користувач бачить підпис «AUBE — CONCEPT BRAND», тож позначка відповідає видимому. |
| P0-2 | Перевірка попередньої проблеми: старі `/portfolio/{slug}`. | ✅ 404 + `noindex`; у sitemap, посиланнях і JSON-LD їх немає. Видалення в Search Console — вручну. |

Блокерів індексації (noindex, заборон у robots, неправильних canonical, контенту тільки на клієнті) не знайдено.

### P1 — важливо для AI-пошуку, SEO та доступності

| # | Знахідка | Статус |
|---|---|---|
| P1-1 | JSON-LD не було на жодній сторінці. | ✅ Organization, WebSite, WebPage / CollectionPage / AboutPage, Service, CreativeWork. Тільки видимі реальні дані (див. «Самоперевірка → JSON-LD»). |
| P1-2 | `og:image` / `twitter:image` були тільки на головній. | ✅ На всіх 10 сторінках, згенерована картинка відповідною мовою. |
| P1-3 | У title головної не було бренду. | ✅ «MY PERSON — Studio Narracji Wizualnych» / «MY PERSON — Visual Narratives Studio». |
| P1-4 | Загальні title й description: «Portfolio \| MY PERSON» однаковий у PL і EN, опис послуг не називав жодної послуги. | ✅ Унікальні title й description для кожної сторінки й мови; кожне твердження є на видимій сторінці (таблиця нижче). |
| P1-5 | Описи трьох робіт на плівці були тільки в модалці після кліку. | ✅ Той самий текст доступний у DOM як опис кнопки-кадру (див. «Самоперевірка → приховані описи»). |
| P1-6 | Фото «до/після» мали `alt=""` і `aria-hidden`. | ✅ `alt="Perfume Campaign — przed/po"` тощо; картка отримала `role="group"`. |
| P1-7 | У модалці портфоліо Tab виводив фокус на сторінку за оверлеєм. | ✅ Фокус лишається в модалці; Escape повертає його на кадр. |
| P1-8 | Метадані `/landing-pages` були зашиті в код. | ✅ Перенесено в `pages.json` → `landingPages.seo`. |
| P1-9 | Сайт не відповідає на питання «хто створює»: ім'я не вказане. | 📝 **Ім'я не публікується без окремого підтвердження власниці.** Шаблон тексту — в розділі «Пропозиції текстів». |
| P1-10 | `/services` не показує послугу «Strony i landing page'e», хоча це реальна послуга (підтверджено власницею). | 📝 Точний список PL/EN — в розділі «Послуги». Візуально ще не додано: чекає погодження списку. |
| P1-11 | На головній немає короткого переліку послуг. | 📝 Пропозиція — в розділі «Пропозиції текстів». |
| P1-12 | Два різні набори послуг у репозиторії. | ✅ Невикористаний `services.json` з іншим набором видалено разом із завантажувачем (див. «Послуги»). |

### P2 — покращення, які можна зробити пізніше

| # | Знахідка | Статус |
|---|---|---|
| P2-1 | `og:locale` = `pl` / `en` замість `pl_PL` / `en_US`. | ✅ |
| P2-2 | `aria-label` навігації й перемикача мов англійською на польських сторінках. | ✅ «Menu główne» / «Wybór języka». |
| P2-3 | Назви кнопок-кадрів дублювались («Fashion Editorial — Fashion Editorial»). | ✅ |
| P2-4 | Посилання «Kontakt» на `/landing-pages` проходило через редирект 308. | ✅ `/pl#kontakt`. |
| P2-5 | `/landing-pages`: H2 демо AUBE стоять у DOM перед H1 сторінки. | ⏸ Виправлення вимагає змінити композицію. Вплив зменшено через P0-1. |
| P2-6 | `/portfolio` і `/services`: H1 візуально прихований і дублює видимий H2. | ⏸ Допустимо (текст ідентичний видимому). |
| P2-7 | Непослідовні категорії в `portfolio.json`. | ✅ Дві очевидні помилки виправлено, одну передано на рішення (див. «Портфоліо»). |
| P2-8 | Невикористаний контент: `homeLandingPages` («Flagowy produkt»), `contact` у `pages.json`; текст `/landing-pages` зашитий у `LandingPagesShowcase.tsx` і дублює `landingPages.intro`. | ⏸ Прибрати або підключити разом із P1-10. |
| P2-9 | CLAUDE.md описував case-study сторінки й окрему `/contact`. | ✅ Оновлено (див. «Зміни в CLAUDE.md»). |
| P2-10 | У sitemap немає `lastmod`. | ⏸ Надійних дат немає; вигадувати не варто. |
| P2-11 | Відео кампаній без субтитрів чи транскрипту; поруч є текстовий опис. VideoObject не додано: потрібні `uploadDate` і `thumbnailUrl`, яких у репозиторії немає. | ⏸ |
| P2-12 | Автоматичних тестів у репозиторії немає. | ⏸ Браузерні перевірки з цього аудиту можна оформити як Playwright-тести в CI. |
| P2-13 | `llms.txt` відсутній. | ⏸ Необов'язковий і нестандартизований. |

## Послуги

### Порівняння джерел

| Джерело | Що містить | Показується на сайті? | Дія |
|---|---|---|---|
| `pages.json` → `homeServices.items` | Brand Identity · Editorial Content · Strategia wizualna / Visual Strategy · Video Production | **Так**, картки на `/services` | Лишається єдиним джерелом списку послуг |
| `src/content/{pl,en}/services.json` | Film wizerunkowy / Brand Film · Identyfikacja wizualna / Visual Identity · Doświadczenia cyfrowe / Digital Experience · Kierownictwo artystyczne / Art Direction | Ні, ніде не використовувався | ✅ Видалено разом із `getServices` / `getServiceBySlug` і типом `Service` |
| `LandingPagesShowcase.tsx` + `pages.json` → `landingPages` | Strony i landing page'e / Websites & Landing Pages | Так, окрема сторінка `/landing-pages` і пункт меню | Кандидат у 5-ту послугу (нижче) |
| `pages.json` → `homeLandingPages` | «Flagowy produkt» + «Strony i Landing Page'y» | Ні | ⏸ Див. P2-8 |
| `portfolio.json` → `category` | Використовувала назви з `services.json` | Ні (поле не рендериться) | ✅ Див. «Портфоліо» |
| SEO-описи `/services` (цей PR) | Ті самі 4 послуги, що й на сторінці | — | Узгоджено |
| JSON-LD `/services` (цей PR) | Ті самі 4 послуги, що й на сторінці | — | Узгоджено |

Нових послуг не додано; розбіжність усунуто видаленням списку, який ніде не показувався.

### Пропонований актуальний список (для погодження, ще не впроваджено)

Перші чотири послуги — точно як зараз на сайті. П'ята складена з уже опублікованих текстів `/landing-pages`: назва — з меню, опис — зі вступу, теги — з видимого списку «Zakres» / «Scope».

| # | PL — назва | PL — опис | PL — теги | EN — назва | EN — опис | EN — теги |
|---|---|---|---|---|---|---|
| 1 | Brand Identity | Pełna tożsamość wizualna marki — od logotypu i palety kolorów po system komunikacji i brand guidelines. | LOGOTYP / PALETA / GUIDELINES | Brand Identity | Complete visual brand identity — from logo and color palette to communication systems and brand guidelines. | LOGO / PALETTE / GUIDELINES |
| 2 | Editorial Content | Realistyczne zdjęcia produktowe i lifestyle bez sesji, modeli i studia. Ten sam dzień — różne kierunki marketingowe. | PRODUCT SHOTS / LIFESTYLE / KAMPANIE | Editorial Content | Realistic product and lifestyle photography, no studio shoot, models, or set required. Same day — different marketing directions. | PRODUCT SHOTS / LIFESTYLE / CAMPAIGNS |
| 3 | Strategia wizualna | Strategiczny plan — jak marka ma wyglądać na każdym punkcie kontaktu z klientem. Instagram, strona, marketplace, reklama. | AUDYT / STRATEGIA / ROADMAP | Visual Strategy | *(без змін — поточний EN-текст)* | *(без змін)* |
| 4 | Video Production | Kampanie wideo dla marek premium — od koncepcji i scenariusza po produkcję i montaż. Reklamy, prezentacje, storytelling. | REKLAMY / REELS / KAMPANIE | Video Production | *(без змін — поточний EN-текст)* | *(без змін)* |
| 5 **нова** | Strony i Landing Page'y | Projektuję i realizuję strony internetowe oraz landing page’e, łącząc strategię, design, treść, interakcję i technologię w jeden spójny system. | UX/UI / DEVELOPMENT / WDROŻENIE | Websites & Landing Pages | I design and build websites and landing pages by combining strategy, design, content, interaction and technology into one coherent system. | UX/UI / DEVELOPMENT / DEPLOYMENT |

Що вирішити разом зі списком:
- **Позиція 5-ї картки.** Остання чи перша (на головній вона «Flagowy produkt»).
- **Посилання з картки на `/landing-pages`.** Зараз картки послуг не є посиланнями.
- **Макет.** Сітка на `/services` спроєктована рівно під 4 картки (`CARD_LAYOUT`), тож 5-та картка — це дизайн-рішення для композиції.

Після погодження: додати 5-й елемент у `homeServices.items` (PL/EN) і його макет. JSON-LD підхопить його автоматично.

## Портфоліо

Поля `category` і `year` у `portfolio.json` зараз **ніде не показуються** на сайті: вони залишились від видалених сторінок кейсів. На сайті видно назву, підзаголовок, теги, фото й опис (у модалці).

| Робота (slug) | Поточна назва | Поточна категорія PL / EN | Запропонована назва | Запропонована категорія PL / EN | Причина | Статус |
|---|---|---|---|---|---|---|
| `aurora` | AURA | Film wizerunkowy / Brand Film | AURA *(без змін)* | Kampania produktowa / Product Campaign | Категорія суперечить видимому підзаголовку «Product Campaign» і опису («wizualizacje kampanii produktowej»); у модалці статичне фото, не фільм. | ✅ Категорію виправлено |
| `meridian` | Fashion Editorial | Doświadczenie cyfrowe / Digital Experience | Fashion Editorial *(без змін)* | Fashion Editorial / Fashion Editorial | «Doświadczenie cyfrowe» у старому списку послуг означало «interaktywne strony i aplikacje», а це фотосесія fashion editorial (видимий підзаголовок і опис). | ✅ Категорію виправлено |
| `lumen` | Personal Brand | Identyfikacja wizualna / Visual Identity | Personal Brand *(без змін)* | — | Не очевидна помилка: портрети для марки особистої можна вважати й «Identyfikacja wizualna», і «Editorial Content». | 📝 Рішення власниці |

Назви не змінено: інших достовірних назв у репозиторії немає. Питання до власниці:
- **AURA проти AURA JEWELRY.** Робота «AURA» (крем у банці, плівка) і кампанія «AURA JEWELRY» (відео біжутерії) — це різні клієнти чи один? Якщо різні, варто розрізнити назви.
- **Однакові назва й підзаголовок.** У «Fashion Editorial» і «Personal Brand» вони збігаються, бо окремого підзаголовка немає. Якщо є справжні назви клієнтів або проєктів, їх можна вписати в `subtitle`.
- **Рік.** `year` (2025 / 2024) ніде не показується, тож у JSON-LD його прибрано. Якщо рік потрібен, його спершу треба показати на сайті.

## Самоперевірка AI-readiness

### Приховані описи — де і чому це не «SEO-текст»

Усі візуально приховані тексти на сайті (клас `visually-hidden`):

| Сторінка | Елемент | Текст | Де цей текст видно користувачу |
|---|---|---|---|
| `/portfolio` | `<h1>` (`src/app/[locale]/portfolio/page.tsx:62`) | Portfolio | Видимий заголовок H2 «Portfolio» над плівкою (існував до цього PR) |
| `/services` | `<h1>` (`src/app/[locale]/services/page.tsx:58`) | Usługi / Services | Видимий заголовок H2 «Usługi / Services» (існував до цього PR) |
| `/portfolio` | `<span id="work-{slug}-summary">` × 3 у кнопках-кадрах (`src/sections/PortfolioFilmstrip.tsx:223, 233`) — **додано в цьому PR** | Опис роботи (`summary`) | Той самий рядок `summary` показується в модалці після кліку (`PortfolioFilmstrip.tsx:290`) |

Чому ці три описи не є SEO-текстом тільки для пошуковика:
- **Той самий текст, що й у модалці.** Вони рендеряться з того самого поля `summary`, що й видимий опис у модалці. Тест порівнює їх побуквено для всіх трьох робіт обома мовами — збіг 100%.
- **Вони служать людям.** Це опис кнопки через `aria-describedby`: скрінрідер зачитує його разом із назвою кадру. Користувач із ним отримує ту саму інформацію, що й зрячий користувач після кліку.
- **Нових слів немає.** Жодних ключових слів чи тексту, якого користувач не може побачити. Google допускає такий прихований текст, якщо він служить доступності і відповідає видимому.

### JSON-LD — перевірка

Автоматичний тест для всіх 10 сторінок:
1. Один блок JSON-LD, валідний JSON.
2. Кожна властивість допустима для свого типу schema.org.
3. Усі `@id`-посилання розв'язуються всередині графа.
4. `hasPart` посилається тільки на CreativeWork.
5. Немає старих `/portfolio/{slug}` і заборонених тверджень: дат, адреси, рейтингу, відгуків, цін, нагород, `founder`, `areaServed`.

Відповідність видимому змісту:

| Твердження в JSON-LD | Де видно на сторінці |
|---|---|
| Organization: назва, логотип | Шапка (логотип + «MY PERSON») |
| Organization: `description` | Опис у футері кожної сторінки |
| Organization: `email`, `telephone`, `sameAs` | Посилання в футері (email, телефон, Instagram, Facebook) |
| Service (`/services`): назва + опис | Картки послуг, побуквено |
| Service (`/landing-pages`): назва + опис | Пункт меню «Strony i Landing Page'y» + вступ під H1, побуквено |
| CreativeWork: `name`, `alternativeHeadline`, `description`, `image` | Модалка кадру: заголовок, підзаголовок, опис, фото — побуквено |

Що виправлено під час самоперевірки (follow-up до PR #3):
- **`hasPart` з послугами.** Послуги були підключені через `hasPart`, а ця властивість приймає лише CreativeWork. Тепер на `/services` послуги — `mainEntity` у вигляді `ItemList`, а на `/landing-pages` послуга — `mainEntity`.
- **`dateCreated` (рік) у CreativeWork.** Рік ніде на сайті не показаний, тож властивість прибрано.
- **EN-опис головної** містив мій переклад польського вступу, якого на англійській сторінці немає. Замінено реченнями, які на EN-сторінці видно: вступ + опис у футері.

Для перевірки на Deploy Preview: [Rich Results Test](https://search.google.com/test/rich-results) і [Schema Markup Validator](https://validator.schema.org/). Локальна перевірка структурна: зовнішні валідатори з середовища розробки недоступні.

### Meta description → видимий зміст

| Сторінка | Твердження в description | Джерело на сторінці |
|---|---|---|
| `/pl` | увесь текст | Вступ hero, побуквено |
| `/en` | «A visual narratives studio. Cinematic stories for premium brands. A visual identity that sells.» | Вступ hero + опис у футері, побуквено |
| `/portfolio` | KAMIEN.PL, AURA JEWELRY; transformacje; 80 kart produktów, Bises | Секції «Wybrane kampanie», «Transformacje», «80 kart produktów — Bises» |
| `/services` | brand identity, zdjęcia produktowe i lifestyle, strategia wizualna, wideo; marki premium | 4 картки послуг |
| `/about` | перше речення | Вступ під H1, побуквено |
| `/about` | «Metoda: analiza, strategia, produkcja, weryfikacja» | Заголовок «Metoda» + 4 підзаголовки |
| `/landing-pages` | UX/UI, art direction, interakcje, development, integracje, wdrożenie | Видимий список «Zakres» (опис існував до цього PR; перенесено з коду в content-шар без змін) |

### data-nosnippet — що це і навіщо

- **Що це.** Атрибут Google, який можна ставити на `span`, `div` і `section`. Він забороняє Google використовувати вміст елемента в сніпетах результатів пошуку. Google документує, що AI Overviews і AI Mode підпорядковуються тим самим налаштуванням сніпетів ([AI features and your website](https://developers.google.com/search/docs/appearance/ai-features), [Robots meta tag specifications](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag)).
- **Де стоїть.** Один раз, на секції з демо AUBE (`src/sections/LandingPagesShowcase.tsx:69`). Секція охоплює видимий підпис «MY PERSON / LIVE WEB EXPERIENCE · AUBE — CONCEPT BRAND» і саме демо. Власний текст студії (H1, «Zakres», «Wycena», CTA) лежить поза нею.
- **Навіщо.** Демо — вигаданий бренд із ціною й кошиком. Без атрибута Google міг би процитувати «Lekkie serum do ciała…» як опис MY PERSON.
- **Чого він не робить:**
  - Не ховає контент від людей і не блокує індексацію сторінки.
  - Не є маскуванням (cloaking): користувач і Google бачать той самий HTML.
  - Інші AI-системи (ChatGPT, Perplexity тощо) цей атрибут не зобов'язані враховувати. Для них захистом є видимий підпис «CONCEPT BRAND» і назва секції «demonstracyjny landing page».
- **Уточнення в follow-up.** Спершу атрибут і `role="region"` стояли на внутрішньому `<div>` демо. Через це утворювались дві вкладені області з назвою, і зовнішня мала англійську назву «AUBE live demo» навіть на PL-сторінці. Тепер правку в `AubeDemo.tsx` відкочено: атрибут і локалізована назва стоять на зовнішній секції.

## Зміни в CLAUDE.md

- **Project Shape.** Реальні 5 маршрутів у двох мовах. Портфоліо — одна інтерактивна сторінка з плівкою і модалкою, без окремих сторінок робіт; старі `/portfolio/{slug}` мають віддавати 404. Окремої сторінки контактів немає: контакт — це `#kontakt` + Tally + футер.
- **Tech Stack.** Фактичний стан: CSS Modules + `@layer`, з Tailwind імпортовано тільки шар утиліт. Використовуються GSAP, Lenis, next-intl. R3F/Three встановлені, але не використовуються; Framer Motion, zod і email-провайдера немає.
- **Content layer.** Реальні функції й файли, правило «одне джерело для кожного контенту», SEO-поля в `PageCopy.seo`.
- **i18n.** next-intl, `/pl` за замовчуванням, `/en`, middleware, розташування повідомлень і контенту, canonical/hreflang/sitemap.
- **Contact form.** Позначено як ще не реалізовану; правила лишились для майбутньої форми.
- **SEO.** Метадані, sitemap/robots, правила JSON-LD (тільки видимі факти), контент поза інтерактивом, `data-nosnippet` для демо.
- **Новий розділ Testing & Deployment:**
  - Node 22 / npm 10;
  - обов'язкові команди перед PR;
  - чекліст браузерних перевірок;
  - Netlify: кожен PR отримує Deploy Preview, `main` автоматично йде в production, тож **merge = production deploy** і робиться тільки з дозволу власниці.

## Змінені файли (PR #3 разом із follow-up)

| Файл | Що змінено |
|---|---|
| `src/types/content.ts` | Тип `PageSeo`, поле `seo` у `PageCopy`, `beforeLabel`/`afterLabel`; видалено тип `Service`; прибрано застарілий коментар |
| `src/content/pl/pages.json`, `src/content/en/pages.json` | Блоки `seo` для 5 сторінок; підписи «przed/po», «before/after» |
| `src/content/pl/portfolio.json`, `src/content/en/portfolio.json` | Дві виправлені категорії |
| `src/content/{pl,en}/services.json`, `src/lib/content/services.ts` | **Видалено** (невикористаний список послуг, що суперечив сайту) |
| `src/lib/content/index.ts` | Прибрано експорт `getServices` / `getServiceBySlug` |
| `src/lib/seo.ts` | `pageSeo()`, `pageUrl()`; `og:image`, `twitter:image`, `og:locale` + alternate, `absoluteTitle` |
| `src/lib/structured-data.ts` (новий) | Граф JSON-LD: Organization, WebSite, WebPage + `mainEntity` / `hasPart` |
| `src/components/JsonLd.tsx` (новий) | Вивід `<script type="application/ld+json">` з екрануванням `<` |
| `src/app/[locale]/page.tsx`, `about/`, `services/`, `portfolio/`, `landing-pages/page.tsx` | Метадані з content-шару + JSON-LD |
| `src/sections/PortfolioFilmstrip.tsx` | Описи робіт у DOM (`aria-describedby`), без дублів у назвах, фокус утримується в модалці |
| `src/sections/BeforeAfterShowcase.tsx` | `alt` для фото «до/після», `role="group"` |
| `src/sections/LandingPagesShowcase.tsx` | Локалізована назва і `data-nosnippet` на секції демо; посилання на контакт без редиректу |
| `src/components/Header.tsx`, `src/components/LanguageSwitcher.tsx`, `src/messages/{pl,en}.json` | Локалізовані `aria-label` |
| `CLAUDE.md` | Оновлено під фактичну структуру (див. вище) |
| `AI_READINESS_AUDIT.md` (новий) | Цей звіт |

`src/sections/AubeDemo.tsx` у підсумку не змінено. Візуальний дизайн, кольори, типографіку, композицію, плівку, видимі тексти послуг, `package.json` і lockfile теж не змінено.

## Невирішене (рішення власниці)

1. **P1-9 — ім'я.** Публікується тільки після окремого підтвердження.
2. **P1-10 — 5-та послуга «Strony i Landing Page'y»:** погодити список, позицію, посилання й макет картки.
3. **P1-11 — рядок з переліком послуг на головній.**
4. **Портфоліо:** категорія `lumen`; AURA проти AURA JEWELRY; підзаголовки.
5. **P2-5 — порядок заголовків на `/landing-pages`.**
6. **P2-8 — `homeLandingPages` і `contact`:** невикористаний контент, прибрати або підключити.
7. **Search Console → Removals** для шести старих URL (вручну).

## Пропозиції текстів (не впроваджено, потрібне погодження)

**1. Хто створює (P1-9)** — тільки після підтвердження імені:

- PL: «MY PERSON prowadzi [imię i nazwisko — do potwierdzenia] — strateżka AI i dyrektorka wizualna. Tworzę premium wizualizacje AI, które zmieniają sposób, w jaki klienci postrzegają produkt.»
- EN: «MY PERSON is led by [name — to be confirmed], an AI strategist and visual director. I create premium AI visuals that change how customers perceive a product.»

**2. Послуги одним рядком на головній (P1-11)** — під hero-слоганом:

- PL: «Brand identity, zdjęcia produktowe i lifestyle, strategia wizualna, wideo oraz strony i landing page’e dla marek premium.»
- EN: «Brand identity, product and lifestyle photography, visual strategy, video, and websites & landing pages for premium brands.»

**3. Вступ на `/services`** — замість «Kompleksowe podejście do budowania premium marek.» (за бажанням):

- PL: «Pomagam markom premium wyglądać tak, jak na to zasługują: od tożsamości wizualnej i zdjęć produktowych po wideo i strony internetowe. Każdy projekt zaczyna się od strategii.»
- EN: «I help premium brands look the way they deserve: from visual identity and product imagery to video and websites. Every project starts with strategy.»

**4. Для кого і який результат** — уже сказано у блоці «Dlaczego MY PERSON». Нового тексту не потрібно.

## Результати перевірок (після follow-up)

| Перевірка | Результат |
|---|---|
| `npm ci` (Node 22 / npm 10) | ✅ |
| Typecheck `tsc --noEmit` | ✅ 0 помилок |
| Lint `eslint .` | ✅ 0 помилок (2 старі попередження про `<img>` в `AubeDemo.tsx`) |
| Build `next build` | ✅ 15/15 сторінок |
| Тести в репозиторії | немає (`test`-скрипта немає) |
| PL/EN маршрути | ✅ 10 × 200 |
| Старі `/portfolio/{slug}` | ✅ 6 × 404 + `noindex` |
| sitemap / robots | ✅ 10 URL; robots посилається на sitemap |
| Відповідність видимому змісту + JSON-LD | ✅ 80/80 |
| Доступність / agent-ready | ✅ 64/64 |
| Регресія портфоліо (плівка, пауза при наведенні, модалка, summary, мови, мобільна версія) | ✅ 98/98 |
| Модалка / cookie-банер / scroll lock | ✅ 129/129 |
| Netlify build | перевіряється Deploy Preview PR #3 |

## Рекомендації для майбутньої послуги «AI-ready сайт» для клієнтів

1. **Аудит двома проходами: без JS і з JS.** Головне питання: чи видно текст, ціни, послуги й контакти в HTML без JavaScript.
2. **Ясність сутності.** Хто, що робить, для кого, як зв'язатися — прямими реченнями на видимих сторінках.
3. **Одне джерело правди для кожного контенту.** Розбіжні копії (як старий `services.json`) рано чи пізно потрапляють у метадані чи schema.
4. **Метадані як контент.** Унікальні title й description, у CMS або content-шарі; кожне твердження має бути на сторінці.
5. **Structured data тільки з видимих фактів.** Автоматичний тест «schema ↔ видимий текст» у CI.
6. **Демо й приклади — окремо.** Видимий підпис + `data-nosnippet`, щоб AI не приписав клієнту чужі товари.
7. **Інтерактив не замінює текст.** Для всього, що відкривається по hover, кліку чи в модалці, має бути той самий текст у DOM — не інший, не розширений.
8. **Доступність = зрозумілість для агентів.** Справжні `<button>` і `<a>`, назви, `alt`, фокус, Escape, пастка фокусу.
9. **Мультимовність.** hreflang + canonical + `og:locale` + локалізовані `aria-label`.
10. **Гігієна індексу.** Sitemap тільки з живими URL; видалені сторінки віддають 404 або 410; Removals; без посилань на мертві URL.
11. **Регресійні браузерні тести** на ключові сценарії.
