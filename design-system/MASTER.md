# MY PERSON — Brand Design System (MASTER)

This file is the single source of truth for color and typography across the entire site — not just the Home Hero. Every future section, page, and component must draw from this palette and type system. Do not introduce new colors or fonts without updating this file first.

## Colors

| Token | Hex | Usage |
|---|---|---|
| Deep Graphite | `#1C1C1E` | Main background, sitewide |
| Graphite Light | `#2A2A2C` | Cards/frames sitting on the base background |
| Graphite Lighter | `#3A3A3C` | Third elevation tier (hover/active surfaces) |
| Chalk White | `#EDEAE4` | Text and headings on dark backgrounds |
| Oxblood | `#4A0E1A` | CTA buttons, accents, 3D-logo elements |
| Oxblood Hover | `#5C1222` | Hover/active state of Oxblood elements |
| Warm Bronze | `#8B6F47` | Secondary accents, captions, small caps, muted text, borders |

**Avoid:** purple/magenta/violet hues, "generic Canva beige," pure black (`#000000`), pure white (`#FFFFFF`), neon colors, AI-gradient look (multi-hue diagonal gradients).

Only these colors exist in the brand palette. Alpha/opacity variants (e.g. bronze at 20% for borders, the named `--color-chalk-muted`/`--color-chalk-subtle` tokens) are permitted; inventing new hues, or picking an unverified one-off hex "close enough" to Graphite, is not — that drift is exactly what produced a stray purple-gray card background in an earlier pass. Always reference the named token, never a hand-typed hex.

### Token mapping (`src/styles/tokens.css`)

```
--color-background   → Deep Graphite
--color-surface      → Deep Graphite (page-level; cards/frames use Graphite Light instead)
--color-foreground   → Chalk White
--color-muted        → Warm Bronze
--color-border       → Warm Bronze at low opacity
--color-accent       → Oxblood
--color-on-accent    → Chalk White
```

This is a sitewide dark theme. It cascades to Header, Footer, and all four minimal pages (Portfolio, Services, About, Contact) — Home is not a special case for color, only for motion/3D treatment.

## Typography

- **Headings** — Playfair Display (serif), bold, uppercase or title case. Ships a true 700 weight on Google Fonts, so headings use real bold, not synthesized.
- **Body / UI text** — Montserrat (sans-serif), regular/light weights.

Both fonts are loaded via `next/font/google` with `latin` + `latin-ext` subsets for full Polish diacritic support (ą ć ę ł ń ó ś ź ż).

## Applying this system

- Never hardcode these hex values in component CSS — always reference the semantic tokens (`var(--color-accent)`, etc.) so a future palette adjustment only touches `tokens.css`.
- Headings (`h1`–`h3`) get their typography treatment from a global base rule in `globals.css`, not per-component overrides, unless a component has a genuinely unique display need (e.g. the Hero headline's fluid clamp() sizing).
