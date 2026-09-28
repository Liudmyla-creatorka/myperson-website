# AI Readiness Audit — myperson.agency

Дата: 2026-09-28 · Гілка: `claude/cool-mccarthy-t1htwe` (від `main` @ `de76a84`)

Мета: зробити сайт зрозумілим, індексованим, структурованим і придатним для цитування пошуковими та AI-системами (Google, AI Overviews, ChatGPT, Perplexity). Це не гарантує появи у відповідях AI. Це прибирає технічні причини, через які сайт можуть не зрозуміти або зрозуміти неправильно.

## Як проводився аудит

- Production-збірка (`next build` + `next start`), 5 маршрутів × 2 мови = 10 публічних сторінок.
- Кожну сторінку завантажено двічі в Chromium: **без JavaScript** (так її бачить більшість AI-краулерів) і з JavaScript. Зібрано: статус, `lang`, title, description, robots, canonical, hreflang, Open Graph, Twitter, H1–H4, JSON-LD, усі посилання, кнопки, зображення з `alt`, відео, canvas, форми, діалоги, обсяг тексту в `<main>`.
- Окремо перевірено `sitemap.xml`, `robots.txt`, HTTP-статуси старих `/portfolio/{slug}`, клавіатурну навігацію, фокус, модалку, мобільні вьюпорти.

## Карта сайту (після змін)

| URL | Title | H1 | JSON-LD |
|---|---|---|---|
| `/pl` | MY PERSON — Studio Narracji Wizualnych | MY PERSON | Organization, WebSite, WebPage |
| `/en` | MY PERSON — Visual Narratives Studio | MY PERSON | Organization, WebSite, WebPage |
| `/pl/portfolio` | Portfolio — kampanie wideo i wizualizacje produktowe \| MY PERSON | Portfolio (прихований) | + CollectionPage, 3 × CreativeWork |
| `/en/portfolio` | Portfolio — Video Campaigns & Product Visuals \| MY PERSON | Portfolio (прихований) | + CollectionPage, 3 × CreativeWork |
| `/pl/services` | Usługi — brand identity, strategia wizualna i wideo \| MY PERSON | Usługi (прихований) | + WebPage, 4 × Service |
| `/en/services` | Services — Brand Identity, Visual Strategy & Video \| MY PERSON | Services (прихований) | + WebPage, 4 × Service |
| `/pl/landing-pages` | Strony internetowe i landing page'e — projektowanie \| MY PERSON | Tworzę cyfrowe doświadczenia, nie tylko strony. | + WebPage, Service |
| `/en/landing-pages` | Website & Landing Page Design \| MY PERSON | I create digital experiences, not just websites. | + WebPage, Service |
| `/pl/about` | O mnie — studio narracji wizualnych \| MY PERSON | O mnie | + AboutPage |
| `/en/about` | About — Visual Narratives Studio \| MY PERSON | About | + AboutPage |

- Усі 10 сторінок відповідають 200, мають `lang`, self-canonical, hreflang `pl` / `en` / `x-default` (→ `pl`), `og:image` і `twitter:image`.
- `sitemap.xml`: рівно ці 10 URL з hreflang-альтернативами. `robots.txt`: `Allow: /` і посилання на sitemap.
- `/pl|en/portfolio/{aurora,meridian,lumen}` віддають 404 з `noindex`. Посилань на них немає ні в HTML, ні в sitemap, ні в JSON-LD.
- Уся текстова інформація відрендерена на сервері: без JS в `<main>` від 94 до 330 слів на сторінку. Canvas і контенту, доступного тільки через JS, немає.
- Контакти (email, телефон, WhatsApp, Instagram, Facebook, форма Tally) є в HTML футера на кожній сторінці.

## Знахідки

Статус: ✅ виправлено в цьому PR · 📝 потрібне рішення власниці (пропозиція нижче) · ⏸ свідомо відкладено.

### P0 — критично для індексації або правильного розуміння сайту

| # | Знахідка | Статус |
|---|---|---|
| P0-1 | На `/landing-pages` демо вигаданого бренду AUBE (сироватка для тіла, ціна, кнопка «Dodaj do koszyka») йде **перед** H1 студії. AI міг зробити висновок, що MY PERSON продає косметику. `aria-label` стояв на `<div>` без ролі, тож ігнорувався. | ✅ Демо тепер `role="region"` з назвою «AUBE — demonstracyjny landing page MY PERSON» і має `data-nosnippet`: Google не бере цей текст у сніпети та AI-відповіді. Порядок заголовків лишився (див. P2-5). |
| P0-2 | Перевірка попередньої проблеми: старі `/portfolio/{slug}`. | ✅ 404 + `noindex`, у sitemap і посиланнях їх немає. Видалення в Search Console — вручну. |

Блокерів індексації (noindex, заборон у robots, неправильних canonical, контенту тільки на клієнті) не знайдено.

### P1 — важливо для AI-пошуку, SEO та доступності

| # | Знахідка | Статус |
|---|---|---|
| P1-1 | JSON-LD не було на жодній сторінці. | ✅ Organization, WebSite, WebPage / CollectionPage / AboutPage, Service (послуги, які видно на сторінках), CreativeWork (3 роботи з плівки). Тільки реальні дані. |
| P1-2 | `og:image` / `twitter:image` були тільки на головній. На 8 з 10 сторінок прев'ю при поширенні не мало картинки. | ✅ На всіх сторінках, згенерована картинка відповідною мовою. |
| P1-3 | У title головної не було бренду («Studio Narracji Wizualnych»): шаблон `%s \| MY PERSON` не діє на корінь сегмента. | ✅ «MY PERSON — Studio Narracji Wizualnych» / «MY PERSON — Visual Narratives Studio». |
| P1-4 | Загальні title й description: «Portfolio \| MY PERSON» однаковий у PL і EN, опис послуг «Kompleksowe podejście do budowania premium marek.» не називає жодної послуги. | ✅ Унікальні title й description для кожної сторінки й мови, складені з наявного контенту (назви послуг, клієнтів, робіт, кроків методу). |
| P1-5 | Описи трьох робіт на плівці були тільки в модалці після кліку, у HTML їх не було. | ✅ Опис кожної роботи є в DOM як візуально прихований текст, пов'язаний з кнопкою через `aria-describedby`. Дизайн не змінено. |
| P1-6 | Фото «до/після» (Perfume, Food, Eyewear) мали `alt=""` і `aria-hidden`: це реальні роботи, але для пошуку й скрінрідерів вони були порожніми. | ✅ `alt="Perfume Campaign — przed/po"` тощо, картка отримала `role="group"`. |
| P1-7 | У модалці портфоліо Tab виводив фокус на сторінку за оверлеєм. | ✅ Фокус лишається в модалці (Tab і Shift+Tab), Escape повертає його на кадр. |
| P1-8 | Метадані `/landing-pages` були зашиті в код через `isPolish ? … : …`, повз content-шар (порушення CLAUDE.md). | ✅ Перенесено в `pages.json` → `landingPages.seo`. |
| P1-9 | Сайт не відповідає на питання **«хто створює»**: ім'я авторки ніде не вказане, хоча весь текст написано від першої особи. | 📝 Текст — у розділі «Пропозиції текстів». |
| P1-10 | `/services` не згадує флагманську послугу «Strony i landing page'e» (на головній вона «Flagowy produkt»). AI, що читає сторінку послуг, її не побачить. | 📝 Пропозиція: картка або посилання на `/landing-pages`. |
| P1-11 | На головній немає короткого переліку послуг, тільки слоган і філософія. | 📝 Пропозиція: один рядок під hero. |
| P1-12 | Два різні набори послуг: сторінка показує `homeServices` (Brand Identity, Editorial Content, Strategia wizualna, Video Production), а невикористаний `services.json` містить інші (Film wizerunkowy, Identyfikacja wizualna, Doświadczenia cyfrowe, Kierownictwo artystyczne). | 📝 Вирішити, який набір правильний; зайвий видалити. |

### P2 — покращення, які можна зробити пізніше

| # | Знахідка | Статус |
|---|---|---|
| P2-1 | `og:locale` = `pl` / `en` замість `pl_PL` / `en_US`, без `og:locale:alternate`. | ✅ |
| P2-2 | `aria-label` навігації («Primary») і перемикача мов («Language») англійською на польських сторінках. | ✅ «Menu główne» / «Wybór języka». |
| P2-3 | Назви кнопок-кадрів дублювались: «Fashion Editorial — Fashion Editorial». | ✅ |
| P2-4 | Посилання «Kontakt» на `/landing-pages` вело на `/pl/#kontakt` і проходило через редирект 308. | ✅ `/pl#kontakt`. |
| P2-5 | `/landing-pages`: H2 демо AUBE стоять у DOM перед H1 сторінки. | ⏸ Щоб виправити, треба переставити секції або змінити розмітку демо, а це вже зміна композиції. Вплив зменшено через P0-1. |
| P2-6 | `/portfolio` і `/services`: H1 візуально прихований і дублює видимий H2. | ⏸ Допустимо: H1 є в HTML. Можна зробити видимий заголовок H1 окремою правкою. |
| P2-7 | Непослідовні дані в `portfolio.json`: «Fashion Editorial» має категорію «Doświadczenie cyfrowe», «AURA» — «Film wizerunkowy» при підзаголовку «Product Campaign». Назви AURA (плівка) і AURA JEWELRY (кампанія) можна сплутати. | 📝 Уточнити, потім поле `category` можна додати в CreativeWork як `genre`. |
| P2-8 | Невикористаний контент і код: `services.json`, `getServices`, `getServiceBySlug`, `homeLandingPages`, `contact` у `pages.json`. | ⏸ Прибрати разом з P1-12. |
| P2-9 | CLAUDE.md («Project Shape») досі описує case-study сторінки портфоліо й окрему `/contact`. | 📝 Оновити документ під фактичну структуру. |
| P2-10 | У sitemap немає `lastmod`. | ⏸ Надійних дат зміни немає; вигадувати їх не варто. |
| P2-11 | Відео кампаній (KAMIEN.PL, AURA JEWELRY) без субтитрів чи транскрипту; поруч є текстовий опис. VideoObject не додано: потрібні `uploadDate` і `thumbnailUrl`, яких у репозиторії немає. | ⏸ |
| P2-12 | Тестів у репозиторії немає (`package.json` не має `test`). | ⏸ Браузерні перевірки з цього аудиту можна оформити як Playwright-тести в CI. |
| P2-13 | `llms.txt` відсутній. | ⏸ Необов'язковий і нестандартизований; при чистому HTML і JSON-LD користь мінімальна. |

## Рішення щодо structured data

- **Organization, а не ProfessionalService.** ProfessionalService — підтип LocalBusiness, який передбачає фізичну адресу, а її в репозиторії немає. Вигадувати адресу не можна.
- **Person не додано**, бо ім'я власниці на сайті не вказане. Після погодження P1-9 варто додати `Person` як `founder` в Organization.
- **ImageObject** використано тільки для логотипа. Роботи портфоліо описані як CreativeWork з `image`: окремі ImageObject «для кількості» не додають користі.
- **Не додано**: адресу, години роботи, відгуки, рейтинги, ціни, `areaServed`, мови обслуговування, список клієнтів. Даних для них немає.
- `@id` робіт — якорі на тій самій сторінці (`/pl/portfolio#work-aurora`), не окремі URL.

## Змінені файли

| Файл | Що змінено |
|---|---|
| `src/types/content.ts` | Тип `PageSeo`, поле `seo` у `PageCopy`, `beforeLabel`/`afterLabel` у `BeforeAfterContent`; прибрано застарілий коментар про detail-сторінки |
| `src/content/pl/pages.json`, `src/content/en/pages.json` | Блоки `seo` для 5 сторінок; підписи «przed/po», «before/after» |
| `src/lib/seo.ts` | `pageSeo()`, `pageUrl()`; `og:image`, `twitter:image`, `og:locale` + alternate, `absoluteTitle` |
| `src/lib/structured-data.ts` (новий) | Побудова графа JSON-LD з реальних даних |
| `src/components/JsonLd.tsx` (новий) | Вивід `<script type="application/ld+json">` з екрануванням `<` |
| `src/app/[locale]/page.tsx`, `about/`, `services/`, `portfolio/`, `landing-pages/page.tsx` | Метадані з content-шару + JSON-LD |
| `src/sections/PortfolioFilmstrip.tsx` | Описи робіт у DOM (`aria-describedby`), без дублів у назвах, фокус утримується в модалці |
| `src/sections/BeforeAfterShowcase.tsx` | `alt` для фото «до/після», `role="group"` |
| `src/sections/AubeDemo.tsx` | `role="region"` + `data-nosnippet` для демо |
| `src/sections/LandingPagesShowcase.tsx` | Посилання на контакт без редиректу |
| `src/components/Header.tsx`, `src/components/LanguageSwitcher.tsx`, `src/messages/{pl,en}.json` | Локалізовані `aria-label` |
| `AI_READINESS_AUDIT.md` (новий) | Цей звіт |

Візуальний дизайн, кольори, типографіку, композицію, плівку, тексти послуг, `package.json` і lockfile не змінено.

## Невирішене

1. P1-9 — ім'я авторки / «хто створює» (потрібне рішення власниці).
2. P1-10 — флагманська послуга на `/services`.
3. P1-11 — короткий перелік послуг на головній.
4. P1-12 / P2-8 — який набір послуг правильний; прибрати зайвий.
5. P2-5 — порядок заголовків на `/landing-pages`.
6. P2-7 — дані робіт у `portfolio.json`.
7. P2-9 — оновити CLAUDE.md.
8. Search Console → Removals для шести старих URL (вручну).

## Пропозиції текстів (не впроваджено, потрібне погодження)

Нижче тільки факти, які вже є на сайті або які власниця повідомила сама. Ім'я взято з автора комітів у репозиторії; публікувати його — рішення власниці.

**1. Хто створює (P1-9)** — друге речення в `about.intro` або підпис під H1 «O mnie»:

- PL: «MY PERSON prowadzi Liudmyla Mykhailova — strateżka AI i dyrektorka wizualna. Tworzę premium wizualizacje AI, które zmieniają sposób, w jaki klienci postrzegają produkt.»
- EN: «MY PERSON is led by Liudmyla Mykhailova, an AI strategist and visual director. I create premium AI visuals that change how customers perceive a product.»

**2. Послуги одним рядком на головній (P1-11)** — під hero-слоганом:

- PL: «Tożsamość wizualna, zdjęcia produktowe i lifestyle bez sesji, strategia wizualna, wideo oraz strony i landing page’e dla marek premium.»
- EN: «Visual identity, product and lifestyle imagery without a photo shoot, visual strategy, video, and websites and landing pages for premium brands.»

**3. Вступ на `/services` (P1-4, P1-10)** — замість «Kompleksowe podejście do budowania premium marek.»:

- PL: «Pomagam markom premium wyglądać tak, jak na to zasługują: od tożsamości wizualnej i zdjęć produktowych po wideo i strony internetowe. Każdy projekt zaczyna się od strategii.»
- EN: «I help premium brands look the way they deserve: from visual identity and product imagery to video and websites. Every project starts with strategy.»

І п'ята картка або посилання:
- PL: «Strony i landing page’e — projekt, treść, interakcja i wdrożenie w jednym systemie. → Zobacz»
- EN: «Websites & landing pages — design, content, interaction and launch as one system. → View»

**4. Для кого і який результат** — уже сказано у блоці «Dlaczego MY PERSON» («Pracuję z markami, które wiedzą, że dobry produkt nie wystarczy…», «Klient płaci za rezultat, który zmienia percepcję jego marki»). Нового тексту не потрібно; достатньо, щоб цей блок лишався в HTML (він там є).

## Результати перевірок

| Перевірка | Результат |
|---|---|
| `npm ci` (Node 22 / npm 10) | ✅ 380 пакетів |
| Typecheck `tsc --noEmit` | ✅ 0 помилок |
| Lint `eslint .` | ✅ 0 помилок (2 старі попередження про `<img>` в `AubeDemo.tsx`) |
| Build `next build` | ✅ 15/15 сторінок |
| Тести в репозиторії | немає (`test`-скрипта немає) |
| PL/EN маршрути | ✅ 10 × 200 |
| Старі `/portfolio/{slug}` | ✅ 6 × 404 + `noindex` |
| sitemap / robots | ✅ 10 URL; robots посилається на sitemap |
| Title/description | ✅ 10 унікальних title, description 99–158 символів |
| canonical / hreflang / OG / Twitter | ✅ на всіх 10 сторінках, `og:image` → 200 image/png |
| JSON-LD | ✅ валідний JSON на всіх 10 сторінках |
| Заголовки й посилання до/після змін | ✅ без змін, крім виправленого посилання на контакт |
| Браузерні тести: доступність / agent-ready | ✅ 64/64 (клавіатура, focus ring, пастка фокусу, Escape, описи в DOM, `alt`, демо-регіон, перемикач мов, мобільна версія) |
| Регресія портфоліо | ✅ 98/98 (плівка, пауза при наведенні, модалка, summary, Escape, мобільна версія, перемикач мов) |
| Модалка / cookie-банер / scroll lock | ✅ 129/129 |
| Netlify build | перевіряється Deploy Preview цього PR |

## Рекомендації для майбутньої послуги «AI-ready сайт» для клієнтів

1. **Аудит двома проходами: без JS і з JS.** Головне питання: чи видно текст, ціни, послуги й контакти в HTML без JavaScript. Саме так сайт бачить більшість AI-краулерів.
2. **Ясність сутності.** Хто (людина чи компанія), що робить, для кого, де, як зв'язатися — прямими реченнями на головній і в «Про нас», а не тільки в слоганах.
3. **Метадані як контент.** Унікальні title й description для кожної сторінки й мови, в content-шарі або CMS, а не в коді.
4. **Structured data тільки з фактів.** Organization / Person / Service / Product / CreativeWork. Жодних вигаданих відгуків, рейтингів чи адрес: це ризик ручних санкцій і втрати довіри.
5. **Демо й приклади — окремо.** Макети, демо-магазини й концепти треба позначати (region + `data-nosnippet`), щоб AI не приписав клієнту чужі товари чи заяви.
6. **Інтерактив не замінює текст.** Усе, що відкривається по hover, кліку чи в модалці, має мати текстовий еквівалент у DOM.
7. **Доступність = зрозумілість для агентів.** Справжні `<button>` і `<a>`, назви кнопок, `alt`, фокус, Escape, пастка фокусу в модалках. AI-агенти, що діють від імені користувача, покладаються на ту саму розмітку, що й скрінрідери.
8. **Мультимовність.** hreflang + canonical + `og:locale` + локалізовані `aria-label`.
9. **Гігієна індексу.** Sitemap тільки з живими URL; видалені сторінки віддають 404 або 410; Removals у Search Console; жодних внутрішніх посилань на мертві URL.
10. **Регресійні браузерні тести** на ключові сценарії, щоб наступна правка дизайну не зламала те, що вже налаштовано.
