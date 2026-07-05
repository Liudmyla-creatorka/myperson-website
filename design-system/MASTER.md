# MY PERSON — Brand Design System (MASTER)

This file is the single source of truth for color and typography across the entire site — not just the Home Hero. Every future section, page, and component must draw from this palette and type system. Do not introduce new colors or fonts without updating this file first.

## Colors

| Token | Hex | Usage |
|---|---|---|
| Deep Graphite | `#1C1C1E` | Main background, sitewide |
| Chalk White | `#EDEAE4` | Text and headings on dark backgrounds |
| Oxblood | `#4A0E1A` | CTA buttons, accents, 3D-logo elements |
| Warm Bronze | `#8B6F47` | Secondary accents, captions, small caps, muted text |

**Avoid:** purple/magenta/violet hues, "generic Canva beige," pure black (`#000000`), pure white (`#FFFFFF`), neon colors, AI-gradient look (multi-hue diagonal gradients).

Only these four colors exist in the brand palette. Alpha/opacity variants of these four (e.g. bronze at 20% for borders) are permitted; inventing new hues is not.

### Token mapping (`src/styles/tokens.css`)

```
--color-background   → Deep Graphite
--color-surface      → Deep Graphite (cards differentiated by border, not a lighter fill)
--color-foreground   → Chalk White
--color-muted        → Warm Bronze
--color-border       → Warm Bronze at low opacity
--color-accent       → Oxblood
--color-on-accent    → Chalk White
```

This is a sitewide dark theme. It cascades to Header, Footer, and all four minimal pages (Portfolio, Services, About, Contact) — Home is not a special case for color, only for motion/3D treatment.

## Typography

- **Headings** — Sanchez (serif), bold, uppercase or title case.
  - **Known limitation:** Sanchez ships only Regular (400) on Google Fonts — there is no true bold cut. Bold headings use browser-synthesized (faux) bold. If a licensed bold cut becomes available later, swap it in without changing this document's intent.
- **Body / UI text** — Montserrat (sans-serif), regular/light weights.
  - **Naming note:** the brief specified "Montaser," which does not exist in the Google Fonts catalog (verified against the font dataset). Montserrat is used as the closest match. Flag if a different, specific font was intended.

Both fonts are loaded via `next/font/google` with `latin` + `latin-ext` subsets for full Polish diacritic support (ą ć ę ł ń ó ś ź ż).

## Applying this system

- Never hardcode these hex values in component CSS — always reference the semantic tokens (`var(--color-accent)`, etc.) so a future palette adjustment only touches `tokens.css`.
- Headings (`h1`–`h3`) get their typography treatment from a global base rule in `globals.css`, not per-component overrides, unless a component has a genuinely unique display need (e.g. the Hero headline's fluid clamp() sizing).
