# CLAUDE.md — MY PERSON: Visual Narratives Studio

This file is the permanent project constitution. It governs every future implementation decision. If any instruction elsewhere conflicts with this file, this file wins unless the user explicitly overrides it in the moment.

## Mission

Build a world-class premium interactive website that combines cinematic storytelling, advanced web animation, and exceptional performance.

This is not a typical agency website. Every interaction must feel intentional, elegant, and premium. When in doubt, choose the more restrained, more deliberate option over the more impressive-looking one.

## Project Shape

Multi-page site. Every route exists in both locales (`/pl/…`, `/en/…`); these are the only public pages:

| Route | What it is |
|---|---|
| `/` (Home) | The main cinematic experience: hero, philosophy ("Dlaczego MY PERSON" / "Why MY PERSON"), contact section `#kontakt`. |
| `/portfolio` | **One interactive page, not a case-study catalogue.** A looping filmstrip video with invisible hotspot buttons over its frames: hovering a frame pauses the reel, clicking/tapping opens a film-frame modal (photo, tags, title, subtitle, summary). Below it: video campaigns, before/after transformations, the Bises e-commerce case. |
| `/services` | The service list (currently four services, from `homeServices` in `pages.json`). |
| `/landing-pages` | Websites & landing pages service, with the interactive AUBE demo (a fictional concept brand) above it. |
| `/about` | About + method (Analiza / Strategia / Produkcja / Weryfikacja). |

- There are **no per-project portfolio pages**. `/[locale]/portfolio/[slug]` was removed on purpose; old URLs such as `/pl/portfolio/lumen` must keep returning 404 and must never reappear in links, the sitemap or structured data.
- There is **no separate contact page**. Contact = the Home `#kontakt` section (links to the external Tally form) plus email, phone, WhatsApp and social links in the footer of every page.

Only Home carries the heavy cinematic treatment. The other pages exist to support that experience with restraint, not to compete with it.

## Workflow (never skip)

Always follow this order, every milestone, no exceptions:

1. **Analyze** the milestone's requirements against the current codebase.
2. **Explain** the approach and any architectural decisions *before* writing code.
3. **Wait for approval.**
4. **Implement** — one milestone at a time, nothing beyond its scope.
5. **Test** the result (build, lint, manual verification in the browser for anything visual).
6. **Wait for approval.**
7. **Continue** to the next milestone only once approved.

Rules that enforce this:

- Never make architectural decisions without explaining them first.
- Never implement multiple milestones at once.
- Always stop after completing one milestone.
- Ask for approval before moving to the next milestone.
- Never install a package without explaining why it's needed and getting approval first.
- Never generate large amounts of code without approval.

## Tech Stack

Core:
- Next.js (App Router)
- React
- TypeScript (strict)
- TailwindCSS

Animation / 3D:
- GSAP + ScrollTrigger — primary animation engine, drives the scroll-story
- React Three Fiber + Three.js — for the Home page 3D scenes
- Framer Motion — **only** where it is genuinely a better fit than GSAP (e.g. simple React-state-driven UI transitions on the minimal pages). Do not use it to duplicate what GSAP already does on Home.

Supporting (introduce only when the relevant milestone needs them, with explanation first):
- A smooth-scroll library (e.g. Lenis) to pair with ScrollTrigger
- An App Router–compatible i18n library (e.g. `next-intl`) for multilingual routing
- `zod` for shared client/server form validation
- A transactional email provider (e.g. Resend) for contact form delivery, called server-side only

Current state (keep this accurate):
- Styling is hand-written CSS (CSS Modules + `@layer` cascade + custom properties in `src/styles/tokens.css`). Tailwind v4 is installed and only its utilities layer is imported in `src/styles/globals.css`; any wider use of Tailwind is its own architectural decision that needs approval.
- In use: GSAP + ScrollTrigger, Lenis (`src/components/SmoothScroll.tsx`), `next-intl`.
- Installed but not used in `src/`: React Three Fiber / Three.js. Not installed: Framer Motion, `zod`, an email provider.

## Architecture Principles

### Content layer (CMS-ready by design)

Content is stored locally now (structured JSON/TypeScript files), but the frontend must never know that.

- `src/types/content.ts` defines the stable content contracts (e.g. `PortfolioItem`, `PageCopy`, `HomeServicesContent`).
- The content-access layer `src/lib/content/` exposes locale-aware functions like `getPortfolioItems(locale)`, `getPageCopy(page, locale)`, `getHomeServices(locale)`. Data lives in `src/content/{pl,en}/` (`pages.json`, `portfolio.json`).
- One source of truth per piece of content: e.g. the service list shown on `/services` is `homeServices` in `pages.json`; do not keep a second, diverging copy elsewhere.
- Per-page SEO title/description live in the content layer (`PageCopy.seo`), not in page code.
- Pages and components call only these functions — **never** import JSON/data files directly.
- Migrating to a CMS later means rewriting the inside of these functions only. Signatures and return types stay identical. Zero frontend changes.

### Internationalization (PL default, EN secondary, expandable)

- Polish is the primary language and the default; English is the secondary language.
- Implemented with `next-intl` locale-segment routing: `src/i18n/routing.ts` (`locales: ["pl", "en"]`, `defaultLocale: "pl"`), `src/middleware.ts` redirects unprefixed paths (e.g. `/` → `/pl`), pages live under `src/app/[locale]/`. UI strings: `src/messages/{pl,en}.json`; content: `src/content/{pl,en}/`.
- Every page sets a self-canonical plus `hreflang` `pl` / `en` / `x-default` (→ `pl`) via `buildPageMetadata` in `src/lib/seo.ts`; the sitemap lists both locales with the same alternates.
- Routing must be structured so adding a third language later is a configuration change, not a rewrite (locale-segment routing, not ad hoc conditionals).
- A language switcher (PL/EN) lives in the shared header and must preserve the current page/context when switching locale.
- All content-access functions are locale-aware from the start (see above) — never bolt locale on after the fact.

### Contact form architecture

Not implemented yet: contact currently goes through the external Tally form linked from `#kontakt`, plus direct email/phone/WhatsApp. When an on-site form is built, these rules apply:

- A single server-side entry point (Next.js API route) mediates all email delivery. The frontend never talks to the email provider directly.
- Spam protection: honeypot field + server-side rate limiting as the baseline; a challenge-based option (e.g. Turnstile) held in reserve if needed post-launch.
- Validation logic (Zod schema or equivalent) is shared between client and server — never duplicated by hand in two places.
- API keys and provider config live server-side only, never exposed to the client.

### General code architecture rules

- Never duplicate logic — extract and share instead.
- Keep components small and reusable.
- Prefer clean architecture over quick solutions; prefer maintainable and scalable code over the fastest path to something working.
- Never create unnecessary files. Don't scaffold structure that isn't needed yet.
- Always explain important trade-offs when more than one reasonable approach exists.

## Design System

All spacing, typography, colors, animations and reusable UI components must belong to one consistent design system.

Reuse existing design tokens.

Avoid one-off UI solutions.

## Design Principles

Premium. Minimal. Editorial. Luxury. Cinematic. High-end. Elegant.

Avoid generic SaaS design — no generic gradient hero sections, no stock-feeling card grids, no default component-library aesthetics. Every visual decision should read as deliberate art direction, not a template.

## Animation Principles

- Animation must support storytelling. Never animate just because animation is possible.
- Motion must feel natural, smooth, and premium.
- Prefer subtle motion over excessive effects.
- Always optimize animation performance — no janky scroll-jacking, no dropped frames on mid-tier hardware.
- Respect `prefers-reduced-motion` everywhere motion is used.

## Hero Experience

The Home Hero is the signature experience of the website.

It must immediately communicate premium positioning.

Every animation must support storytelling.

Never sacrifice performance for visual complexity.

## Three.js Principles

- Only use Three.js/React Three Fiber where it genuinely improves storytelling on the Home page.
- Do not use 3D for decoration.
- Every 3D scene must justify its performance cost against the narrative value it adds.

## Performance

Performance is mandatory, not a later optimization pass. Every milestone must account for:

- Bundle size (code-split heavy libraries; lazy-load the Three.js canvas below the fold)
- Rendering cost (draw calls, re-renders, layout thrashing)
- Image optimization (proper formats, sizing, `next/image` where applicable)
- Animation performance (GPU-friendly properties, avoid layout-triggering animations)
- Loading strategy (what's critical-path vs. deferred)

## Assets

Never rename, move or optimize assets without approval.

Maintain a clean and predictable asset structure.

## SEO

Every page must be built with semantic HTML and a proper heading structure. Metadata (title, description, Open Graph, `hreflang` for PL/EN) must be correct per page and per locale — not an afterthought bolted on at the end.

- Metadata: `buildPageMetadata` (`src/lib/seo.ts`) with title/description from `PageCopy.seo`; every page also gets the locale's generated share image (`/[locale]/opengraph-image`).
- `src/app/sitemap.ts` lists only real public pages; `src/app/robots.ts` allows all and points to the sitemap. A removed page must return 404 and disappear from links, sitemap and JSON-LD.
- Structured data: `buildPageJsonLd` (`src/lib/structured-data.ts`) + `<JsonLd>`. Only facts that already exist in `site-config` / the content layer **and are visible on the page**. Never add invented addresses, reviews, ratings, prices, clients, dates or awards, and never add schema just to add more of it.
- Anything important must be in the server-rendered HTML, not only in video, canvas, hover or a modal. If content is only revealed by interaction (e.g. portfolio summaries), keep an equivalent, identical text in the DOM for assistive technology (`aria-describedby` + `visually-hidden`) — never extra text that users cannot reach.
- Demo or concept content for fictional brands (e.g. the AUBE demo) must be visibly labelled as such and wrapped in `data-nosnippet`, so it is not quoted as MY PERSON's own claims.

## Accessibility

Accessibility is required, not optional, even on the cinematic Home page:

- Semantic HTML throughout
- Full keyboard navigation, including through scroll-driven sections
- Sufficient color contrast
- Reduced-motion fallback that still delivers a coherent experience, not a broken one

## Implementation Style

- Never create unnecessary files.
- Never install packages without approval — explain why a dependency is needed before installing it.
- Always prefer reusable architecture over one-off solutions.
- Always explain important trade-offs before choosing one.

## Git Workflow

- Never commit without approval.
- Never push without approval.
- Keep commits atomic.
- Explain what changed before every commit.
- Never rewrite Git history unless explicitly requested.

## Testing & Deployment

Toolchain is pinned: Node 22 / npm 10 (`.nvmrc`, `engines` in `package.json`, `engine-strict=true` in `.npmrc`). The lockfile must stay npm 10–compatible; run `nvm use` before installing. npm 11 refuses to install by design.

Before every PR, run and report:

1. `npm ci`
2. `npx tsc --noEmit`
3. `npm run lint`
4. `npm run build`

There is no automated test suite yet (`package.json` has no `test` script). Verify in a browser against a production build (`npm run build && npm run start`), in PL and EN, desktop and mobile:

- all public routes return 200; removed routes (e.g. `/pl/portfolio/lumen`) return 404; `sitemap.xml` and `robots.txt` are correct;
- portfolio filmstrip plays; hover pauses it; click/tap/Enter opens the modal with the summary; Escape, ×, and overlay click close it; focus stays in the modal and returns to the frame;
- the modal sits above the cookie banner and the page behind it does not scroll;
- the language switcher keeps the current page;
- no horizontal scroll and no layout shift.

Deployment: Netlify (project `regal-bublanina-46ca63`, domain `myperson.agency`) builds every PR as a Deploy Preview and deploys `main` to production automatically. Merging to `main` therefore **is** a production deploy — never merge or deploy without the owner's explicit approval. Work on a branch, open a PR, let the owner check the Deploy Preview.

## Coding Standards

Prefer composition over inheritance.

Keep components small and reusable.

Avoid deeply nested logic.

Keep files readable.

Remove dead code immediately.

## Debugging

Always identify the root cause before fixing an issue.

Never patch blindly.

Prefer architectural fixes over temporary workarounds.

## Communication

Explain decisions briefly.

Explain important trade-offs.

If information is missing, ask.

Never guess.

User approval always overrides assumptions.

## Output Style

- Be concise.
- Explain decisions, don't just state conclusions.
- Never generate large amounts of code without approval.
- Always stop after finishing the requested milestone and wait for the next go-ahead.

## Folder Structure

Extend the project structure only when a milestone genuinely requires it.

Do not scaffold future folders.

Every new directory must have a clear purpose.

## Roadmap

The roadmap is maintained separately from this document.

Always follow the currently approved roadmap.

Never skip milestones.

Never combine milestones.

Complete one milestone, stop, explain the result and wait for approval before continuing.

## Working Style

Don't ask clarifying questions or propose options before acting — do the concrete work directly. If something is genuinely ambiguous and it must be asked, ask it in the same message as doing everything else that can be done without the answer; don't stall the whole task on one open question.

Minimize prose in responses. Lead with what changed, skip restating the request back to the user.

## Compact Instructions

When you are using compact, please focus on test output and code changes.
