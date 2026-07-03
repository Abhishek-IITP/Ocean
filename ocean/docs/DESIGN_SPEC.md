# Ocean Redesign Specification

> **Purpose**
>
> This document is the single source of truth for redesigning the Ocean platform. Every design and implementation decision should follow this specification unless explicitly overridden.

---

# Vision

Ocean is **not** an AI product.

Ocean is a calm productivity and scheduling platform that helps people organize their day without overwhelming them.

The experience should feel timeless, warm, peaceful and crafted.

Users should feel like:

- opening a beautiful notebook
- sitting near the ocean on a quiet morning
- planning their day without distractions

Not:

- opening another flashy SaaS dashboard
- using an AI agent
- looking at neon gradients and glowing cards

---

# Core Design Philosophy

The redesign must prioritize:

- Calm over flashy
- Whitespace over decoration
- Typography over effects
- Natural colors over gradients
- Soft motion over dramatic animation
- Editorial layouts over startup templates

The UI should feel handcrafted.

---

# STRICT DESIGN RULES

## Never use

- Glassmorphism
- Neon colors
- Purple AI gradients
- Mesh gradients
- Huge glowing shadows
- Futuristic AI illustrations
- Floating holographic cards
- Animated background particles
- Emoji-heavy interface
- AI-generated hero layouts
- Generic SaaS landing pages

## Avoid fonts commonly overused by AI builders

Avoid making the entire website use:

- Poppins
- Space Grotesk
- Outfit
- Sora

Prefer classic, readable combinations such as:

Headings
- Libre Baskerville
- Cormorant Garamond
- Newsreader

Body
- Source Sans 3
- Instrument Sans
- IBM Plex Sans
- Geist
- Inter (body only if necessary)

---

# Landing Page

The landing page should feel like a Studio Ghibli environment without copying Studio Ghibli artwork.

The mood should be:

- blue sky
- fluffy clouds
- warm sunlight
- watercolor textures
- greenery
- ocean
- peaceful villages
- soft breeze

If suitable artwork is unavailable, use any placeholder background and replace it later.

Do NOT waste development time trying to generate the perfect artwork.

---

# Landing Structure

1. Navigation
2. Hero
3. Trust section
4. Features
5. Productivity workflow
6. Calendar integrations
7. Dashboard showcase
8. Testimonials
9. FAQ
10. CTA
11. Footer

---

# Hero

Large illustration.

Minimal text.

One primary CTA.

One secondary CTA.

No rotating words.

No typing animation.

No AI buzzwords.

---

# Colors

Background

- Warm White
- Sky Blue
- Ocean Blue
- Sage Green

Accent

- Deep Navy

Keep saturation low.

---

# Components

Cards

- rounded 24px
- subtle border
- soft shadow
- lots of spacing

Buttons

Primary

Filled navy.

Secondary

White with border.

Hover

Only subtle elevation.

---

# Motion

Animations should be slow.

Use

- fade
- slide
- scale 1.02

Avoid

- bouncing
- spinning
- exaggerated motion

---

# Dashboard Redesign

The dashboard should never feel empty.

Every area should communicate useful information.

## Home widgets

Greeting

Good Morning Abhishek

Current time

Current location

Current weather

Temperature

Humidity

Wind

Sunrise

Sunset

Today's schedule

Next meeting countdown

Upcoming events

Weekly calendar

Monthly calendar

Productivity score

Daily focus score

Pomodoro timer

Focus session

Task completion %

Habits

Mood tracker

Water tracker

Sleep reminder

Weekly goals

Monthly goals

Recent notes

Quick capture

Bookmarks

Pinned projects

Upcoming deadlines

Time spent working

Screen time

Deep work hours

Distraction tracker

Most productive hours

Achievement streak

Activity timeline

Keyboard shortcuts

Notifications

Calendar heatmap

Timezone clocks

Battery (desktop)

Spotify widget (optional)

Quote of the day

---

# Productivity Features

- Smart day planner
- Daily review
- Weekly review
- Monthly review
- Eisenhower Matrix
- Time blocking
- Focus sessions
- Habit tracker
- Goal tracker
- Deadline planner
- Meeting planner
- Availability planner
- Calendar sync
- Multi timezone support
- Event templates
- Recurring events
- Notes linked to meetings
- Meeting attachments
- Meeting recordings link
- Reminder presets
- Travel time estimation
- Buffer time between meetings
- Daily journal
- Reflection page

---

# Dashboard Layout

Left

Navigation

Center

Main productivity workspace

Right

Context widgets

- weather
- time
- reminders
- focus
- calendar

---

# Empty States

Every empty state should include

- meaningful illustration
- short explanation
- CTA

Never leave blank white space.

---

# Accessibility

- keyboard friendly
- screen reader support
- AA contrast
- visible focus rings

---

# Performance

- lazy load images
- optimize fonts
- responsive layouts
- avoid unnecessary animations

---

# Tech Notes

Use existing stack.

Maintain reusable components.

Prefer composition over duplication.

---

# Claude Code Instructions

Follow this specification exactly.

When uncertain:

Choose the calmer option.

Choose whitespace over decoration.

Choose typography over effects.

Choose usability over visual tricks.

Do not redesign based on current AI design trends.

Create a timeless product that could still look beautiful five years from now.
