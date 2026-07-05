---
name: Ocean
description: A calm, editorial productivity workspace — warm light, true-black dark.
colors:
  background-light: "#faf9f4"
  foreground-light: "#29241f"
  card-light: "#fcfbf8"
  muted-light: "#f0ece5"
  muted-foreground-light: "#766c60"
  accent-light: "#efe9e1"
  border-light: "#e4dfd7"
  destructive-light: "#c63e2f"
  background-dark: "#000000"
  foreground-dark: "#f0ede6"
  card-dark: "#0f0f0f"
  muted-foreground-dark: "#aba69c"
  border-dark: "#292929"
  destructive-dark: "#d9614f"
  sage-deep-light: "#3b5447"
  sage-deep-dark: "#6fae8f"
  clay-light: "#bd6742"
  clay-dark: "#d68b66"
  sky-light: "#5196b8"
  sky-dark: "#7bb7d5"
typography:
  display:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "clamp(2.25rem, 5vw, 3.75rem)"
    fontWeight: 500
    lineHeight: 1.08
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Libre Baskerville, Georgia, serif"
    fontSize: "clamp(1.5rem, 3vw, 2.25rem)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Instrument Sans, ui-sans-serif, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "Instrument Sans, ui-sans-serif, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.16em"
rounded:
  sm: "8px"
  md: "12px"
  lg: "14px"
  xl: "20px"
  2xl: "28px"
  full: "9999px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "40px"
  xl: "64px"
  2xl: "96px"
components:
  button-primary:
    backgroundColor: "{colors.foreground-light}"
    textColor: "{colors.background-light}"
    rounded: "{rounded.md}"
    padding: "10px 16px"
  button-primary-hover:
    backgroundColor: "{colors.foreground-light}"
  button-pill:
    backgroundColor: "{colors.card-light}"
    textColor: "{colors.foreground-light}"
    rounded: "{rounded.full}"
    padding: "10px 20px"
  card-default:
    backgroundColor: "{colors.card-light}"
    textColor: "{colors.foreground-light}"
    rounded: "{rounded.lg}"
---

# Design System: Ocean

## 1. Overview

**Creative North Star: "The Editorial Shoreline"**

Ocean reads like a well-edited page, not a dashboard app — generous margins, unhurried pacing, and a restrained accent trio (sage, clay, sky) that surfaces only where it earns its place. The system borrows its calm from print editorial design and its warmth from an actual shoreline: a wander-the-shore hero, soft tidal gradients behind the fold, serif display type set against a warm off-white ground. In dark mode the shoreline recedes to true black — no charcoal softening, no navy, no glowing blue — because Ocean's night mode is meant to feel like a quiet room, not a control panel.

This system explicitly rejects corporate polish, flashy AI-tool aesthetics, cyberpunk gradients, glassmorphism-as-decoration, and playfulness for its own sake (per product.md's Brand Personality). It also rejects the SaaS hero-metric template and generic dopamine-driven UI — every surface should feel like it's inviting focus, not competing for attention.

**Key Characteristics:**
- Warm off-white in light mode, true black in dark mode — never a charcoal or navy middle ground.
- One serif display voice (Newsreader italic) reserved for a single accent word per headline, never whole sentences.
- A three-color accent trio (sage-deep, clay, sky) used sparingly and always with semantic weight, not decoration.
- Flat surfaces by default; depth comes from border + tint shifts, not drop shadows.
- Motion is soft, blurred-rise entrances — never bouncy, never mechanical.

## 2. Colors

The palette is a warm editorial neutral ramp (paper, ink, borders) plus a three-color accent trio that reads as coastal without being literal — sage for trust/calm, clay for warmth/action, sky for clarity/info.

### Primary
- **Ink** (`#29241f` light / `#f0ede6` dark): the foreground/primary color — body text, primary buttons, headline type. Never pure black or pure white; always warmed or cooled a few degrees so it sits inside the editorial palette.

### Secondary
- **Sage Deep** (`#3b5447` light / `#6fae8f` dark): the trust accent. Used for the hero eyebrow pill, italic accent words in headlines, and any "calm confirmation" state (e.g. completed habit streaks).
- **Clay** (`#bd6742` light / `#d68b66` dark): the warmth accent. Reserved for primary calls-to-action that need to stand out from ink-on-paper — the one place Ocean allows a saturated, non-neutral color to dominate a small surface.
- **Sky** (`#5196b8` light / `#7bb7d5` dark): the clarity accent. Used for informational states, links inside dense content, and calendar/schedule-related UI where a cooler note reads as "structured."

### Neutral
- **Paper** (`#faf9f4` light / `#000000` dark): page background. Warm butter-white in light mode; true black in dark mode.
- **Card** (`#fcfbf8` light / `#0f0f0f` dark): elevated surface background — barely distinguishable from paper in light mode, a hair above true black in dark mode.
- **Mist** (`#f0ece5` light): muted surface fill for secondary buttons, subtle section backgrounds.
- **Ash** (`#766c60` light / `#aba69c` dark): muted foreground — secondary text, captions, timestamps.
- **Hairline** (`#e4dfd7` light / `#292929` dark): border color. Always thin (1px), never used as a decorative stripe.

### Named Rules
**The One Accent Rule.** Sage, clay, and sky each carry one job (trust, action, clarity) and never substitute for each other. No screen should use all three as decoration; each appears because its specific meaning applies.

**The No-Navy Rule.** Dark mode is true black with warm-neutral text, never navy, indigo, or a glowing blue overlay — a direct carry-through of product.md's anti-reference.

## 3. Typography

**Display Font:** Newsreader (with Georgia, serif fallback)
**Body Font:** Instrument Sans (with ui-sans-serif fallback)
**Label/Mono Font:** Libre Baskerville for bold editorial headlines (with Georgia, serif fallback)

**Character:** A humanist serif/sans pairing — Newsreader's italic carries the single warm, wandering accent word inside a headline; Instrument Sans keeps body copy and UI text crisp and quiet so the serif moment stands out rather than competing.

### Hierarchy
- **Display** (500, `clamp(2.25rem, 5vw, 3.75rem)`, 1.08 line-height): hero and section headlines. Reserve the italic serif treatment (`.accent-italic`) for one accent word per heading, never the full line.
- **Headline** (700, `clamp(1.5rem, 3vw, 2.25rem)`, 1.15 line-height): section titles below the hero.
- **Title** (600, 1.25rem, 1.3 line-height): card titles, dashboard widget headers.
- **Body** (400, 1rem, 1.6 line-height, max 65–75ch): paragraph copy, descriptions.
- **Label** (600, 0.75rem, 1.2 line-height, 0.16em tracking, uppercase): eyebrow pills, form field labels, badges.

### Named Rules
**The One Italic Rule.** Serif italic accents a single word per headline (see Hero.tsx's "wander"). Applying it to a full sentence turns an editorial flourish into a novelty font.

## 4. Elevation

Ocean is flat by design. Depth is conveyed through border weight and background tint, never `box-shadow`. The `.shadow-soft` and `.shadow-lift` utilities are literal misnomers kept for naming continuity with shadcn conventions — both resolve to a firmer border plus a warm background shift, not a drop shadow.

### Shadow Vocabulary
- **Soft** (`border-color: hsl(var(--foreground) / 0.12); background: card`): resting elevated state — cards, pills, panels at rest.
- **Lift** (`border-color: hsl(var(--foreground) / 0.22); background: muted / 0.5`): hover/active elevated state — the border firms up and the tint deepens instead of a shadow appearing.

### Named Rules
**The Flat-By-Default Rule.** No `box-shadow` anywhere in the system. If a surface needs to read as "above" another, firm its border and shift its background tint instead.

## 5. Components

Buttons, cards, and inputs are soft and tactile: generous radius, backdrop-blurred pill shapes on floating CTAs, and a lift-on-hover treatment (border + tint, per Section 4) rather than a shadow pop.

### Buttons
- **Shape:** rounded-md (12px) for standard buttons; full pill (`rounded-full`) for hero/nav CTAs and the eyebrow badge.
- **Primary:** ink background, paper text, 10px/16px padding — the highest-contrast surface in the system, used once per view.
- **Secondary / Pill:** card background at 70% opacity with `backdrop-blur-sm`, hairline border, ink text — used for secondary CTAs like "See it in action."
- **Hover / Focus:** `-translate-y-px` plus the Lift border/tint shift (Section 4); focus rings use `ring-2` in the ring token, never an outline-only default.

### Cards / Containers
- **Corner Style:** rounded-lg (14px) as the default shadcn card radius; hero/feature surfaces may go up to rounded-2xl (28px) for a softer, more editorial frame.
- **Background:** card color at full opacity for dashboard widgets; card at 70% opacity + backdrop-blur for anything floating over the hero imagery.
- **Shadow Strategy:** Soft at rest, Lift on hover (Section 4) — never a drop shadow.
- **Border:** always a single 1px hairline border; never a colored side-stripe.
- **Internal Padding:** 24px (`p-6`) standard, 16px for compact dashboard widgets.

### Inputs / Fields
- **Style:** hairline border, card background, rounded-md corners.
- **Focus:** ring token at 2px offset — no glow, no color shift beyond the ring.
- **Error / Disabled:** destructive color (`#c63e2f` light / `#d9614f` dark) for error text and border; 50% opacity for disabled.

### Navigation
- Pill-shaped, backdrop-blurred chrome that floats over the hero image rather than a solid bar; hairline border at 60% opacity. Active/hover states use the Lift tint, not a background color swap.

### Hero Eyebrow (signature component)
A small uppercase pill (`rounded-full`, hairline border, card background at 70% opacity, `backdrop-blur-sm`) in sage-deep text — the system's signature "calm announcement" pattern, reused anywhere a short contextual label needs to sit above a headline.

## 6. Do's and Don'ts

### Do:
- **Do** keep dark mode true black (`#000000`) with warm-neutral text — no charcoal, no navy.
- **Do** reserve the serif italic accent for exactly one word per headline.
- **Do** use border + tint shifts (Soft / Lift) for all elevation; treat `box-shadow` as unavailable.
- **Do** cap body copy at 65–75ch and use `text-wrap: balance` on headings.
- **Do** let sage, clay, and sky each carry one distinct meaning; never mix them decoratively on the same surface.

### Don't:
- **Don't** use navy, indigo, or glowing blue anywhere in dark mode — a direct product.md anti-reference.
- **Don't** ship corporate, flashy, cyberpunk, "overly futuristic," or gratuitously playful surfaces — product.md's Brand Personality explicitly excludes these.
- **Don't** use `border-left`/`border-right` as a colored accent stripe on cards or list items.
- **Don't** use gradient text (`background-clip: text` with a gradient) for emphasis — weight or size only.
- **Don't** reach for the SaaS hero-metric template (big number + label + gradient accent) or generic dopamine-driven UI patterns — product.md calls these out directly as things Ocean avoids.
- **Don't** add a drop shadow anywhere; the system is flat by design (Section 4).
