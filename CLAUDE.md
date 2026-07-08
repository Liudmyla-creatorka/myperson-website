# CLAUDE.md — MY PERSON: Visual Narratives Studio

This file is the permanent project constitution. It governs every future implementation decision. If any instruction elsewhere conflicts with this file, this file wins unless the user explicitly overrides it in the moment.

## Mission

Build a world-class premium interactive website that combines cinematic storytelling, advanced web animation, and exceptional performance.

This is not a typical agency website. Every interaction must feel intentional, elegant, and premium. When in doubt, choose the more restrained, more deliberate option over the more impressive-looking one.

## Project Shape

Multi-page site, five routes:

- **Home** — the main cinematic experience: immersive scroll storytelling driven by GSAP/ScrollTrigger, with React Three Fiber / Three.js scenes where 3D genuinely serves the story.
- **Portfolio** — case study grid + individual project pages. Minimal, supportive.
- **Services** — offering list. Minimal, supportive.
- **About** — agency story. Minimal, supportive.
- **Contact** — fully functional contact form. Minimal, supportive.

Only Home carries the heavy cinematic/3D treatment. The other four pages exist to support that experience with restraint, not to compete with it.

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

Note: this project currently uses hand-written CSS with `@layer` cascade + custom properties (`src/styles/tokens.css`, etc.). Introducing Tailwind means deciding how it coexists with or replaces that system — this must be explained and approved as its own architectural decision before it happens, not assumed.

## Architecture Principles

### Content layer (CMS-ready by design)

Content is stored locally now (structured JSON/TypeScript files), but the frontend must never know that.

- `src/types` defines the stable content contracts (e.g. `PortfolioItem`, `Service`, `PageCopy`).
- A content-access layer (e.g. `src/lib/content/`) exposes functions like `getPortfolioItems(locale)`, `getServiceBySlug(slug, locale)`, `getPageContent(page, locale)`.
- Pages and components call only these functions — **never** import JSON/data files directly.
- Migrating to a CMS later means rewriting the inside of these functions only. Signatures and return types stay identical. Zero frontend changes.

### Internationalization (PL default, EN secondary, expandable)

- Polish is the primary language and the default at launch.
- English is the secondary language.
- Routing must be structured so adding a third language later is a configuration change, not a rewrite (locale-segment routing, not ad hoc conditionals).
- A language switcher (PL/EN) lives in the shared header and must preserve the current page/context when switching locale.
- All content-access functions are locale-aware from the start (see above) — never bolt locale on after the fact.

### Contact form architecture

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
