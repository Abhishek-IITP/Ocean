# The Living Workday — Frozen Creative Direction

> **Status: FROZEN.** This is the source of truth for the Ocean landing page hero. Do not redesign the concept — only implement it — unless explicitly told to revisit it. Supersedes the "Hero" section in `docs/DESIGN_SPEC.md`.

## 1. Concept

One continuous, looping (~15–20s) view of Ocean's real workspace canvas playing out a single causal chain across every module — calendar, tasks, focus, habits, AI, analytics — narrated by a persistent editorial text feed. A product reveal, not a landing page banner. No laptop mockup, no illustration, no cards, no physical objects.

## 2. Visual composition

One unbroken frame, ~60/40 split, no card border — a hairline rule (`--border`) as the only seam:

- **~65%: Workspace canvas.** A horizontal "today" timeline with task chips, a focus ring, and a thinner greyed "tomorrow" preview lane beneath it. Every element sits directly on the canvas — no card wrappers.
- **~35%: Command Feed.** A narrow narrating column (or a strip beneath, on mobile): short declarative sentences entering from the bottom, aging upward, fading at the top.
- **Static anchor:** wordmark + one headline + one subline, present from frame one, untouched by the loop.

No background imagery. Canvas sits directly on `--background`.

## 3. Camera framing

One fixed orthographic "shot," no cuts, no pans. The only camera-like move: an almost imperceptible scale drift 1.000 → 1.015 across the loop, easing back at reset. Depth comes only from real focus-mode dimming (non-active timeline regions recede to ~70% opacity — raised from an initial ~55% during Phase 7's accessibility pass to keep dimmed chip text at WCAG AA contrast), never from blur or vignette effects.

## 4. Choreography & timing (single causal chain, ~19s + 0.6s reset)

| Time | Beat | Motion |
|---|---|---|
| 0:00–0:02 | Cold open | Calm baseline; soft breathing glow on "now" marker only. |
| 0:02–0:04 | Meeting moves | Calendar block detaches, arcs to new slot, settles. |
| 0:04–0:06 | Reorganization | Adjacent blocks slide to close the gap (staggered 80ms); freed slot flashes sky at low opacity. |
| 0:06–0:08 | Task slides in | Task chip glides from backlog edge into the freed slot; a line draws from task list to timeline, then dissolves. |
| 0:08–0:10 | Focus begins | Non-active region recedes to ~70% opacity; a ring fills in sky around the active chip. |
| 0:10–0:13 | Focus completes | Ring completes in sage, one settle-pulse (scale 1→1.02→1); a nearby habit ring ticks one segment full in the same beat. |
| 0:13–0:15 | AI notices | A small clay dot + underline appears beside tomorrow's lane; a faint line traces from today's pattern to it. |
| 0:15–0:17 | Tomorrow optimizes | The greyed preview lane quietly reorders its blocks. |
| 0:17–0:19 | Analytics update | A small inline sparkline ticks upward; one number counts up (never a jump-cut). |
| 0:19–0:19.6 | Reset | Crossfade to the 0:00 state; scenario content rotates from a short pool so consecutive loops vary. |

## 5. Motion language

- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` everywhere (matches `.animate-rise` already in `globals.css`). No bounce, no elastic.
- Vocabulary: position, opacity, and SVG stroke-dasharray line-draws. Focus-mode opacity dimming is the one representational (non-decorative) opacity use.
- No blur, no glow, no drop-shadow — elevation stays inside the existing `.shadow-soft` / `.shadow-lift` border+tint language.
- Staggers only where the underlying event is actually staggered.

## 6. Typography

- Static headline: Display role (Newsreader italic accent word + Instrument Sans), per `design.md` §3.
- In-canvas labels: Label role, no uppercase tracking (this must read as real product UI, not a badge).
- Feed lines: Body role, ~0.9rem, 1.6 line-height, left-aligned, full sentences.

## 7. Copywriting

Static headline: **"A workday that reorganizes *itself*."**
Subline: "Watch a real day move through Ocean — nothing here is staged."

Feed narration (one line per beat, present tense, plain sentences):
1. "2:15 meeting moved to 3:00."
2. "Schedule reorganized to close the gap."
3. "Deep work block filled the open hour."
4. "Focus session started — 50 minutes."
5. "Focus session complete. Streak: day 12."
6. "A pattern noticed: mornings are your best focus hours."
7. "Tomorrow's schedule adjusted around it."
8. "This week's focus time: up 18%."

## 8. Interaction philosophy

- Autoplays on load; understandable with zero interaction.
- Pauses on hover/focus over the canvas, holding the current frame.
- **A visible, keyboard-reachable pause/play control is required** (WCAG 2.2.2 — auto-updating content over 5s must be pausable by something other than hover alone).
- CTA appears only after the first full loop completes — never on first paint.
- No sound, ever.
- A thin scrub/progress line under the canvas shows loop position; not a video-player control cluster.

## 9. First 30 seconds

Instant resolve to calm baseline (no skeleton loaders) → stillness registers the shape of the thing (0–2s) → first autonomous move locks attention (0:02) → causal chain plays beat by beat, feed trailing a beat behind visuals → focus-complete + habit-tick landing in the same frame is the moment the "one system" realization lands (~0:10) → AI suggestion + tomorrow reorg read as confirmation, not surprise (0:13–0:17) → soft crossfade reset, second pass proves it's continuous, not a one-off demo (0:19) → CTA fades in quietly beside the untouched headline (~0:20–0:25).

---

# Production Implementation Plan

## Component breakdown

```
components/landing/hero/
  HeroLivingWorkday.tsx        — orchestrator: layout shell, mounts controller + children
  HeroStaticCopy.tsx           — wordmark/headline/subline + CTA (extends existing HeroCopy.tsx pattern)
  HeroCTA.tsx                  — gated reveal, mounts only after loopCount >= 1
  workspace/
    WorkspaceCanvas.tsx        — canvas frame, composes the pieces below
    TimelineTrack.tsx          — today's axis + renders CalendarBlock/TaskChip list from scenario data
    TomorrowLane.tsx           — smaller greyed preview lane
    CalendarBlock.tsx          — single event chip, animatable x/width
    TaskChip.tsx               — task chip, animatable position + focus-active state
    FocusRingOverlay.tsx       — wraps existing ui/progress-ring.tsx, sky→sage fill
    HabitTick.tsx              — small segment/ring reusing progress-ring.tsx primitives
    AISuggestionMark.tsx       — clay dot + underline + connecting line
    AnalyticsSparkline.tsx     — small inline SVG sparkline + count-up number
    ConnectingLine.tsx         — shared stroke-dasharray draw-on primitive (SVG path)
  feed/
    CommandFeed.tsx            — narration column, subscribes to loop progress
    FeedLine.tsx               — single line, enter-from-bottom / age-up / fade-out
  controls/
    LoopScrubBar.tsx           — thin progress indicator
    LoopPauseButton.tsx        — visible, keyboard-reachable pause/play (WCAG 2.2.2)
```

Every file stays under CLAUDE.md's ~250-line guidance by keeping each visual element (block, chip, tick, mark) as its own file — the canvas is an assembly, not a monolith.

## Shared motion primitives

- **`useHeroLoopController()`** (`components/landing/hero/useHeroLoopController.ts`): the single source of truth. Owns one Framer Motion value, `progress` (0→1 over ~19.6s, `repeat: Infinity`, `ease: "linear"`), plus `isPaused`, `pause()`, `resume()`, `loopCount`, and `scenario` (rotates through a small content pool on each loop boundary). All child components derive their local animation state via `useTransform(progress, [beatStart, beatEnd], [...])` off this one value — this is what guarantees the causal chain stays in sync and makes pause/scrub trivial (pausing the one motion value pauses everything downstream).
- **`ConnectingLine`**: shared stroke-dasharray reveal, driven by a local 0–1 progress prop, reused by the task-slide line and the AI-suggestion trace line.
- **`easeOutQuint`** constant (`cubic-bezier(0.16, 1, 0.3, 1)`) exported once from `lib/motion.ts`, imported everywhere instead of re-declared.
- **`useReducedMotion` fork**: a `HeroReducedMotion.tsx` sibling that renders four static keyframes (baseline / mid-reorganization / focus-complete / AI-suggested) on a slow fixed-interval crossfade, sharing the same scenario data and copy as the full version — never a separate content source.
- **Scenario data model** (`lib/hero-scenarios.ts`): a typed list of `WorkdayScenario` objects (meeting time/title, task name, focus duration, habit name/streak, AI insight text, analytics delta) so the feed copy and visual labels are driven from one data source per loop pass, not hardcoded twice.

## Interaction architecture

- `HeroLivingWorkday` mounts `useHeroLoopController` once and passes `progress` down via context (`HeroLoopContext`) rather than prop-drilling through every leaf — keeps `WorkspaceCanvas` and `CommandFeed` siblings in perfect sync without lifting state awkwardly.
- Pause triggers: pointer hover over the canvas, keyboard focus within it, **and** the explicit `LoopPauseButton` — all three call the same `pause()`/`resume()`.
- `LoopPauseButton` is always visible (not hover-revealed), small, positioned near the scrub bar — this is the accessibility-required control, not a decorative extra.
- Screen readers get a single visually-hidden `<p aria-live="off">` static summary of what the loop demonstrates, updated only at loop boundaries — not a live region firing on every 2-second beat (that would be announcement spam, the accessibility equivalent of the notification clutter product.md explicitly rejects).
- CTA visibility is derived state (`loopCount >= 1`), not a separate timer — ties it to the actual story completing, matching the frozen spec's "CTA appears only after the first full loop."

## Responsive strategy

- **Desktop (≥1024px):** full 65/35 canvas/feed split as specified.
- **Tablet (768–1023px):** Feed moves beneath the canvas at full width; canvas height reduces; same choreography and timing, just re-flowed layout (`flex-col` vs `flex-row` at the breakpoint, per CLAUDE.md's flex-for-1D guidance).
- **Mobile (<768px):** canvas simplifies to a shorter timeline segment (fewer simultaneous chips visible at once) with the Feed given more visual weight, since sentence-by-sentence narration reads better on small screens than a dense timeline. Same 9-beat story, same copy — only the visual density scales down. `ConnectingLine` traces are omitted below a size threshold where they'd be illegible.
- **Performance guardrail:** transform + opacity + stroke-dashoffset only, no backdrop-filter or blur inside the loop (those stay reserved for nav/pill chrome elsewhere per design.md) — protects frame rate on the continuously-running animation.

## Implementation phases

1. **Foundations** — `useHeroLoopController`, `lib/motion.ts` easing constant, `lib/hero-scenarios.ts` data model, `ConnectingLine` primitive. No visuals; verify the timeline engine in isolation (e.g. log `progress` values at expected beat boundaries).
2. **Static composition** — layout shell (canvas + feed side by side, hairline divider, static headline/subline) with every element frozen at its t=0 baseline state. Validates spacing, contrast, and the three breakpoints before any motion is wired in.
3. **Core choreography (beats 1–4)** — meeting move → reorganization → task slide → focus begins, wired to real `progress` transforms. Confirms the timing and easing feel before adding the rest.
4. **Remaining beats (5–8) + Command Feed sync** — focus-complete/habit-tick, AI suggestion, tomorrow optimization, analytics update; `CommandFeed` lines wired to the same `progress` value, each trailing its visual beat as specified.
5. **Loop mechanics** — seamless crossfade reset, scenario rotation across loop boundaries, `LoopScrubBar`, hover/focus pause.
6. **Reduced motion + responsive** — `HeroReducedMotion` four-keyframe fallback, tablet/mobile layouts, verified against `prefers-reduced-motion` emulation and real viewport widths.
7. **CTA + accessibility pass** — `LoopPauseButton`, visually-hidden static summary, CTA gated on `loopCount`, full contrast check on every text layer against the moving background.
8. **QA** — cross-browser SVG dasharray check (Safari), 60fps profiling during the continuous loop, absolute-bans checklist re-verification (no box-shadow, no gradient text, no card grid crept in anywhere).

Each phase should ship reviewable on its own before moving to the next — this is what "implement it section by section" means in practice here.
