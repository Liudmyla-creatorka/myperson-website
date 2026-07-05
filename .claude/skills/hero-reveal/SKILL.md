---
name: hero-reveal
description: Add cursor-reveal sketch-to-realistic hover effect and button hover animations to the hero section
disable-model-invocation: true
---

Add a cursor-reveal "sketch to realistic photo" hover effect to the hero image section, plus reactive button hover animations. Do NOT touch, rewrite, restyle, or change the font of any existing text content on the page — only add the new visual/interaction layer.

1. Sketch-to-realistic cursor reveal: stack the sketch image on top of the realistic image (same size, same container). On mousemove, reveal the realistic layer through a soft circular blob mask (radial-gradient mask-image, feathered edge) that follows the cursor with GSAP quickTo easing (same pattern as CursorLight). Fade back to full sketch on mouse leave. Respect prefers-reduced-motion and existing touch/mobile handling.
2. Button hover: subtle magnetic pull + scale on hover using GSAP, matching existing animation timing. Don't change button text/fonts.
3. Constraints: don't touch existing text, headings, copy, fonts, or unrelated sections. Reuse existing tokens/patterns. Run lint/type-check and start dev server to verify after implementing.
