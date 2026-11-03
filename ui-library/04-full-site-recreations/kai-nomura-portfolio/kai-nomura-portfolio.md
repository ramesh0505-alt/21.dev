# Recreate this site as a single HTML file: Kai Nomura

You are an expert creative front-end developer. Produce a **single self-contained `index.html`**
that reproduces the project below **exactly** — same layout, sections, copy, palette, type, and
motion. Pure HTML/CSS/JS in one file: **no build step, no framework, no bundler.** Use ES modules
with CDN imports for the two libraries used (Lenis for smooth scroll; optionally GSAP for the
scroll-scrub parallax). Load fonts from CDN. Hardcode every value given here as a fixed constant —
all copy is verbatim, all colors are exact hex, all sizes are the literal rem/px below. Rebuild each
section described below as a labeled block of the one file.

## What it is

A hushed, monochrome **editorial portfolio one-pager** for an invented digital & generative artist
persona, **Kai Nomura** (Kyoto · Berlin). Large serif (Playfair Display) display headings against a
clean Satoshi sans body; a fine dashed-hairline grid; lots of negative space; black-and-white
photography. The whole page is long-scroll with **spring-based reveals** — headings reveal
line-by-line (clipped slide-up), body copy fades in word-by-word, image plates rise with a faint
scale-settle and drift with parallax. **Lenis smooth scroll** glides the whole page. Two
full-viewport dark "pinned" CTA blocks punctuate the flow, and a full-screen modal menu grows down
from the top edge. Strictly black/white/grey — no color accent anywhere.

## Page shell & libraries

- **Fonts (CDN):**
  - Body / UI sans — **Satoshi** via Fontshare:
    `https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap`
    (weights used: 400 regular, 500 medium, 700 bold, 900 black).
  - Display serif — **Playfair Display** via Google Fonts, normal + italic, weight 400:
    `https://fonts.googleapis.com/css2?family=Playfair+Display:ital@0;1&display=swap`
    (This is the real serif the project uses — exact match, no substitution.)
- **Smooth scroll — Lenis** via CDN ESM, e.g.
  `import Lenis from "https://cdn.jsdelivr.net/npm/lenis@1.3.19/+esm"`. Init with
  `{ smoothWheel: true }`, drive it from a `requestAnimationFrame` loop (`lenis.raf(time)`). When the
  modal menu is open, call `lenis.stop()` and lock native scroll (`html { overflow:hidden; height:100%; position:relative }`); on close call `lenis.start()` and remove those styles.
- **(Optional) GSAP + ScrollTrigger** via CDN only for the featured-works scroll-scrub parallax. If
  you prefer no extra lib, drive parallax from the Lenis scroll callback by mapping each plate's
  viewport progress to a `translateY` (math below). Either is acceptable; match the feel.
- **CSS reset:** box-sizing border-box; remove default margins; `img { display:block; max-width:100% }`;
  `body { -webkit-font-smoothing:antialiased; text-rendering:optimizeLegibility; overflow-x:hidden }`.
- **Background / base:** `body { background:#ffffff; color:#191917; font-family:"Satoshi",sans-serif; }`.
- **Headings:** `h1,h2,h3 { font-family:"Playfair Display",serif; font-weight:400; text-transform:none;
  letter-spacing:-0.01em; line-height:1.12; }`.
- **Selection:** `::selection { background:#191917; color:#ffffff; }`.
- **Rem-based adaptive grid (IMPORTANT — this is how the whole layout scales).** The layout is
  authored in `rem`, and the root font-size is scaled with the viewport so proportions hold. Replicate
  these exact media queries:
  ```css
  html { font-size: 16px; }
  @media (max-width: 1920px) { html { font-size: 0.833333vw; } } /* 16*100/1920 */
  @media (max-width: 1440px) { html { font-size: 1.111111vw; } } /* 16*100/1440 */
  @media (max-width: 1024px) { html { font-size: 1.5625vw;  } } /* 16*100/1024 */
  @media (max-width: 640px)  { html { font-size: 4.444444vw; } } /* 16*100/360  */
  ```
  Above 1920px font-size stays 16px (effectively scales up only marginally; do not over-engineer this).
  Use Tailwind-style rem sizing in your own CSS — i.e. `text-sm` = 0.875rem, `text-xs` = 0.75rem,
  `text-base` = 1rem, `text-lg` = 1.125rem, `text-xl` = 1.25rem, `text-2xl` = 1.5rem,
  `text-3xl` = 1.875rem, `text-4xl` = 2.25rem, `text-5xl` = 3rem, `text-6xl` = 3.75rem,
  `text-7xl` = 4.5rem, `text-8xl` = 6rem. Spacing scale: `gap-2`=0.5rem, `gap-3`=0.75rem, `gap-4`=1rem,
  `gap-5`=1.25rem, `gap-6`=1.5rem, `gap-8`=2rem, `gap-10`=2.5rem, `gap-12`=3rem, `gap-16`=4rem,
  `py-24`=6rem, `py-28`=7rem, `py-32`=8rem, `py-40`=10rem, `px-6`=1.5rem, `px-12`=3rem.
- **Color tokens (define as CSS variables, use everywhere):**
  ```css
  :root{
    --canvas:#ffffff;          /* page base (light) */
    --surface-grey:#f3f3f3;    /* grey sections */
    --surface-dark:#191917;    /* dark sections */
    --ink:#191917;             /* primary text on light */
    --ink-muted:rgba(25,25,23,0.6);
    --ink-faint:rgba(25,25,23,0.3);
    --on-dark:#ffffff;
    --on-dark-muted:rgba(255,255,255,0.6);
    --on-dark-faint:rgba(255,255,255,0.3);
    --line:rgba(25,25,23,0.2);        /* dashed hairline on light */
    --line-strong:rgba(25,25,23,0.4);
    --line-on-dark:rgba(255,255,255,0.2);
  }
  ```
- **Dashed hairlines:** most sections begin with a 1px **dashed** top border in `--line`
  (`.rule-dashed { border-top:1px dashed var(--line); }`). On dark sections use
  `--line-on-dark` (`.rule-dashed-dark`). These thin dashed rules are a signature of the look — use
  them on section tops, figcaption tops, fact ledgers, and accordion rows as specified.
- **Container:** centered, `max-width:120rem`, `margin-inline:auto`. Section horizontal padding is
  `1.5rem` mobile / `3rem` (lg ≥1024px). Section vertical padding is `6rem` mobile / `8rem` lg
  (the statement uses `7rem`/`10rem`).
- **Breakpoints** (match Tailwind): `sm`=640px, `md`=768px, `lg`=1024px. Single column below `lg`,
  the 12-column grids engage at `lg`.
- **Images:** every image is ratio-locked — a `position:relative; overflow:hidden` box with the given
  `aspect-ratio` containing an absolutely-filled `object-fit:cover` `<img>`. Photography is B&W; keep
  it as-is (the source files are already monochrome).

## Layout & sections (in order)

The page is: **Header (fixed)** · main = **Hero → Statement → Featured Works → Pinned CTA #1 →
Principles → About → Process → Acquire → Pinned CTA #2 (centered) → Testimonials → Exhibitions →
FAQ** · **Footer**. Plus the **Modal Menu** overlay. Build them in this exact order.

---

### Header (fixed, mix-blend-difference)

Fixed bar, `position:fixed; inset-inline:0; top:0; z-index:50; color:#fff; mix-blend-mode:difference`
(so it auto-inverts: black on light, white on dark). Inner grid: `padding:1.25rem 1.5rem`
(lg: `1.25rem 3rem`), `grid-template-columns: 1fr 1fr` on mobile, **3 columns** at lg,
`align-items:center`.

- **Left column** (hidden below lg): two stacked lines —
  `<p>` "Digital & Generative Artist" (text 0.875rem, letter-spacing -0.02em) and
  `<p>` "Light · Code · Memory" (text 0.75rem, **uppercase**, letter-spacing 0.16em, color rgba(255,255,255,0.7)).
- **Center — Logo** (`justify-self:start` mobile / `center` lg): a small **diamond mark** —
  a 0.625rem square with `border:1px solid currentColor; transform:rotate(45deg)` — then the wordmark
  text "kai nomura" in **Playfair Display, italic, lowercase**, 1.125rem, letter-spacing 0.04em.
  Gap 0.75rem. Links to `#top`.
- **Right column** (`justify-self:end`, flex, gap 2rem): a `<nav aria-label="Primary">` (hidden below
  lg) with the **first three** nav links — "Works" (`#works`), "About" (`#about`), "Process"
  (`#process`) — each text 0.875rem, **uppercase**, letter-spacing 0.14em, with a tiny
  `1px×1px` rounded white dot before the label that is `opacity:0` and fades to `1` on hover
  (gap 0.5rem). Then a **Menu button**: word "Menu" (hidden below sm) at 0.875rem uppercase
  letter-spacing 0.16em, plus a two-line hamburger icon (two `height:1px; width:1.5rem; background:#fff`
  bars stacked, gap 0.375rem). Clicking opens the Modal Menu.

Full nav list (used by Menu overlay + footer): **Works** `#works`, **About** `#about`,
**Process** `#process`, **Acquire** `#acquire`, **Contact** `#contact`.

---

### Hero  (`<section>`, full viewport)

`position:relative; min-height:100svh; padding:8rem 1.5rem 4rem` (lg: `padding:10rem 3rem 4rem`).
Inner: centered `max-width:120rem`, grid 1-col → **12-col at lg**, `align-items:center`, gap 3rem
(lg gap 2rem).

- **Left (lg col-span 6):**
  - **Eyebrow** "Digital & generative artist" — see Eyebrow spec. (fades in)
  - **`<h1>`**, max-width 14ch, **line-revealed**, sizes: 3.75rem → sm 4.5rem → lg 6rem,
    line-height 1.04. Text: **`Light, written in code.`** where the word **"written"** is an
    `<Accent>` — Playfair italic, normal-case (it already is). The whole heading is Playfair.
  - **Lead `<p>`** (word-by-word reveal, starts ~500ms after heading): max-width 46ch,
    text 1.125rem, line-height relaxed (~1.625), color `--ink-muted`, margin-top 2.5rem. Verbatim:
    "Kai Nomura builds immersive works where light, memory, and machine become one material —
    generative installations and editioned prints, exhibited worldwide and held in private collections."
  - **CTA row** (fade-up, delay ~800ms), margin-top 2.5rem, flex wrap gap 1rem: a **solid** CtaButton
    "View the work" → `#works`, and a **ghost** CtaButton "Acquire a piece" → `#acquire`.
  - **Facts row** (fade, delay ~1000ms, hidden below lg), margin-top 3rem, `border-top:1px solid
    var(--line)`, padding-top 2rem. A `<dl>` grid of 3 columns gap 1.5rem, showing the first 3 facts:
    **Based** / "Kyoto · Berlin", **Working since** / "2004", **Mediums** / "Code, light, print".
    `<dt>`: 0.75rem uppercase letter-spacing 0.18em color `--ink-faint`; `<dd>`: 0.875rem `--ink`, margin-top 0.25rem.
- **Right (lg col-span 6, col-start 7):** the **hero portrait** plate, ratio **3 / 4**, full width,
  image `art-p1.webp`, alt "Kai Nomura — portrait". (plate reveal, delay ~200ms)
- **Mobile scroll cue** (hidden at lg, fades in delay ~1400ms): margin-top 3rem, flex gap 0.75rem —
  text "Scroll to enter" (0.6rem, uppercase, letter-spacing 0.3em, color `--ink-faint`) and a
  `1px × 2.5rem` line in `--line-strong`.

---

### Statement  (light)

`border-top:1px dashed var(--line); background:#fff; padding:7rem 1.5rem` (lg `10rem 3rem`).
Inner `max-width:80rem`, centered.

- **Eyebrow** "The practice" (fade), margin-bottom 3rem.
- **Large editorial passage** (`<p>`, **Playfair**, word-by-word reveal, stagger ~30ms): sizes
  1.875rem → sm 2.25rem → lg 3rem, line-height ~1.3 (lg 1.25), color `--ink`. Verbatim:
  "For two decades I have treated code as a material — as physical as clay, as fleeting as light.
  My work is not made by the machine; it is made with it. Each system is tuned until it breathes,
  then released to find its own form."
- **Signature** (fade-up, delay ~400ms), margin-top 3rem: a Playfair **italic** span, 1.25rem,
  color `--ink-muted`, text **"— K.N."**

---

### Featured Works  (`id="works"`, light)

`border-top:1px dashed var(--line); background:#fff; padding:6rem 1.5rem` (lg `8rem 3rem`);
`scroll-margin-top:6rem`. Inner `max-width:120rem`.

- **SectionHeading**: eyebrow "Selected works"; title (line-reveal, Playfair) =
  `A field of light, never the same twice.` with **"light,"** as an `<Accent>` (Playfair italic).
- **Gallery grid**, margin-top 4rem (lg 6rem): 1-col → **12-col at lg**, `gap-x:2rem`, `gap-y:0` at
  lg (gap 4rem mobile). It's an **asymmetric / staggered** layout: each `<article>` spans **7 of 12**
  columns; **odd-index** items (2nd, 4th, 6th) are `col-start:6` and pushed down `margin-top:6rem`;
  **even-index** items (1st, 3rd, 5th) are `col-start:1`. This produces the editorial zig-zag.
- Each work item: a `<figure>` (plate reveal on enter) whose image plate also **scroll-scrubs**
  parallax — translateY from `+2.5rem` (when entering bottom) to `-2.5rem` (when leaving top),
  linearly mapped to the element's progress across the viewport. Image is `object-cover`, full width,
  at the item's ratio. Below it a `<figcaption>`: `border-top:1px dashed var(--line)`, margin-top
  1.5rem, padding-top 1.25rem, flex `justify-between` baseline gap 1.5rem — left side `<h3>` title
  (1.25rem, font-weight 500, `--ink`) + medium `<p>` (0.875rem, `--ink-muted`, margin-top 0.25rem);
  right side the **year** in Playfair (1rem, `--ink`).

The six works (index · title · year · medium · image · ratio), in order:
1. **01 · Ma (間) · 2024 · Generative light installation · `art-l1.webp` · 3 / 2**
2. **02 · Tidal Memory · 2023 · Real-time projection, sound · `art-l2.webp` · 3 / 2**
3. **03 · Hanabi Engine · 2024 · Generative print series · `art-p3.webp` · 3 / 4**
4. **04 · Silent Architecture · 2022 · LED matrix, custom code · `art-l4.webp` · 3 / 2**
5. **05 · After Image · 2025 · Archival pigment print · `art-l3.webp` · 3 / 2**
6. **06 · Static Garden · 2023 · Interactive installation · `art-l5.webp` · 3 / 2**

(Image alt = "{title} — {medium}". Note the index numbers aren't shown in this layout's caption — only
title/medium/year — but keep them in the data ordering.)

---

### Pinned CTA #1  (dark, with portrait)

A full-viewport dark block. `border-top:1px dashed var(--line); background:#191917; min-height:100svh;
display:flex; align-items:center; padding:6rem 1.5rem` (lg px 3rem). Inner `max-width:120rem`, width 100%.
Grid 1-col → 12-col at lg, `align-items:center`, gap 3rem (lg 2rem):

- **Copy (lg col-span 6)**, `max-width:34rem`:
  - **Eyebrow tone=dark** "Acquire", margin-bottom 1.5rem.
  - **`<h2>`** (line-reveal, Playfair): 2.25rem → sm 3rem → lg 3.75rem, color `--on-dark`.
    Verbatim: "Some works only exist once."
  - **Body `<p>`** (word reveal): margin-top 2rem, 1.125rem, line-height relaxed, color
    `--on-dark-muted`. Verbatim: "Each edition is signed, certified, and released in a strictly
    limited run. When it is gone, it is gone."
  - **CtaButton tone=dark** (fade-up, delay ~300ms), margin-top 2.5rem: "See what's available" → `#acquire`.
- **Image (lg col-span 5, col-start 8):** plate ratio **3 / 4**, image `art-p2.webp`, empty alt.

---

### Principles  (grey)

`border-top:1px dashed var(--line); background:#f3f3f3; padding:6rem 1.5rem` (lg `8rem 3rem`).
Inner `max-width:120rem`.

- **SectionHeading**: eyebrow "Studio principles"; title "Four rules the studio runs on." (no accent).
- **3-column card grid** (1-col → 3-col at sm), margin-top 4rem, gap-x 3rem gap-y 2.5rem. Each card
  (`<article>`, fade-up, **stagger delay = index × 90ms**): `border-top:1px dashed var(--line)`,
  padding-top 2rem, flex column —
  - big **index** in Playfair, 1.5rem, `--ink`;
  - **`<h3>`** margin-top 1.5rem, 1.25rem, font-weight 500, line-height tight, `--ink`;
  - **`<p>`** margin-top 0.75rem, 1rem, line-height relaxed, `--ink-muted`.

The three (note the title even says "Four" but there are 3 items — keep it as-is):
1. **01 — The code is the brush.** — "Tools should vanish. What remains on the wall is feeling, not technique."
2. **02 — Impermanence is the medium.** — "A work that can change is more alive than one fixed forever in glass."
3. **03 — Light belongs to no one.** — "I borrow it, shape it, and give it back. The viewer completes the piece."

---

### About  (`id="about"`, light)

`border-top:1px dashed var(--line); background:#fff; padding:6rem 1.5rem` (lg `8rem 3rem`);
`scroll-margin-top:6rem`. Inner `max-width:120rem`.

- **Top grid** (1-col → 12-col at lg, gap 3rem / lg 2rem):
  - **Left (lg col-span 7):** Eyebrow "About" (fade, margin-bottom 2rem); then **`<h2>`**
    (line-reveal, Playfair), max-width 20ch, 2.25rem → sm 3rem → lg 3.75rem, line-height 1.1, `--ink`.
    Verbatim: "I make work that disappears the moment you understand it."
  - **Right (lg col-span 5):** three paragraphs, each its own word-by-word reveal (`<p>`, max-width
    52ch, 1rem, line-height relaxed, `--ink-muted`), vertical space 1.5rem:
    1. "I grew up between two cities and two alphabets, and I think that is why impermanence never frightened me. My earliest pieces were small programs that drew with light and then forgot what they had drawn."
    2. "Today my studio sits somewhere between an observatory and a workshop. I write the systems, tune them by hand, and let them run until something honest appears. Then I step back."
    3. "When a work leaves the studio, it keeps changing. That is the point. I am not selling an object so much as a way of paying attention."
- **Photo grid**, margin-top 4rem (lg 5rem): 1-col → 3-col at sm, gap 1.5rem. Each cell is an
  `overflow:hidden` box (plate reveal on enter, **stagger = index × 100ms**) with a **hover-scale**:
  on pointer-enter the image springs from `scale(1)` to `scale(1.06)` (tension 180, friction 24 →
  ~700ms ease-out), back on leave. Three landscape plates, ratio **3 / 2**:
  - `art-l1.webp` alt "Studio light study"
  - `art-l2.webp` alt "Installation detail"
  - `art-l3.webp` alt "Work in progress"
- **Facts ledger** (fade-up), margin-top 4rem, `border-top:1px dashed var(--line)`, padding-top 2.5rem,
  grid 2-col → 4-col at sm, gap-x 2rem gap-y 1.5rem. Each: `<dt>` 0.75rem uppercase letter-spacing
  0.18em `--ink-faint`, `<dd>` margin-top 0.5rem 1rem `--ink`:
  **Based** / "Kyoto · Berlin" · **Working since** / "2004" · **Mediums** / "Code, light, print" ·
  **Represented by** / "Meridian Gallery".

---

### Process  (`id="process"`, light, sticky heading)

`border-top:1px dashed var(--line); background:#fff; padding:6rem 1.5rem` (lg `8rem 3rem`);
`scroll-margin-top:6rem`. Inner grid `max-width:120rem`, 1-col → 12-col at lg, gap 3rem / lg 2rem.

- **Left (lg col-span 5):** a wrapper that is `position:sticky; top:8rem` at lg, containing a
  **SectionHeading**: eyebrow "The studio process"; title "From observation to exhibition."
- **Right (lg col-span 7):** an `<ol>` of 4 steps. Each `<li>` (fade-up on enter):
  `border-top:1px dashed var(--line)`, padding-block 2.5rem (sm 3rem), flex column → row at sm,
  gap 1rem (sm 3rem). Left: oversized **index** in Playfair, 4.5rem → sm 6rem, line-height 1,
  color `--ink-faint`. Right (sm padding-top 0.75rem): **`<h3>`** 1.5rem (lg 1.875rem) font-weight 500
  `--ink`, then **`<p>`** margin-top 1rem, max-width 48ch, 1.125rem line-height relaxed `--ink-muted`.

The four steps:
1. **01 Observe** — "Months of looking — at tides, crowds, signal noise, the way a room holds dusk. Nothing is sketched yet."
2. **02 Compose** — "I write the rules of the system: how light is born, how it decays, what it remembers. The score before the symphony."
3. **03 Generate** — "The system runs for days. I sit with it, tune it by hand, and wait for the moment it stops being mine."
4. **04 Exhibit** — "Each work is editioned, certified, and installed — in a gallery, a private collection, or a screen in your home."

---

### Acquire  (`id="acquire"`, light)

`border-top:1px dashed var(--line); background:#fff; padding:6rem 1.5rem` (lg `8rem 3rem`);
`scroll-margin-top:6rem`. Inner `max-width:120rem`.

- **Header row** (flex column → row at lg, items-end, justify-between, gap 2.5rem):
  - **SectionHeading**: eyebrow "Acquire"; title "Own a piece of the field."
  - **Lead `<p>`** (fade), max-width 42ch, 1rem line-height relaxed `--ink-muted`: "Limited editions,
    each signed and accompanied by a certificate of authenticity and a lifetime conservation guarantee.
    Worldwide shipping, fully insured."
- **For-sale grid**, margin-top 4rem: 1-col → **2-col at sm**, gap-x 2.5rem, gap-y 3.5rem. Each card
  (`<article>`, fade-up; **stagger: items in the right column delayed ~90ms**, i.e. delay = (index % 2)×90ms):
  it's an `<a href="#contact">` (aria-label "Enquire about {title}") wrapping a **hover-lift** image
  (springs from `translateY(0)` to `translateY(-0.75rem)` on hover — tension 220, friction 22 →
  ~600ms ease-out) at the card's ratio, plus an info row: `border-top:1px dashed var(--line)`,
  margin-top 1.5rem, padding-top 1.25rem, flex justify-between items-start gap 1.5rem. Left: **`<h3>`**
  title (1.25rem font-weight 500 `--ink`), **medium `<p>`** (0.875rem `--ink-muted`, margin-top 0.5rem),
  **edition `<p>`** (0.75rem uppercase letter-spacing 0.16em `--ink-faint`, margin-top 0.25rem).
  Right: **price** in Playfair (1.25rem `--ink`).
- **Bottom CTA** (fade-up), margin-top 4rem, centered: solid CtaButton "Enquire about a work" → `#contact`.

The four for-sale works (title · edition · medium · price · image · ratio):
1. **After Image — Plate I · Edition of 12 · Archival pigment print, 90 × 112 cm · €4,800 · `art-l4.webp` · 3 / 2**
2. **Hanabi Engine — 03 · Edition of 25 · Generative print, 70 × 93 cm · €2,400 · `art-p2.webp` · 3 / 4**
3. **Ma (間) — Still · Edition of 8 · Editioned digital work, 4K, with display · €6,200 · `art-l5.webp` · 3 / 2**
4. **Tidal Memory — Frame 41 · Edition of 30 · Archival pigment print, 100 × 69 cm · €1,950 · `art-p3.webp` · 3 / 4**

---

### Pinned CTA #2  (`id="contact"`, dark, centered, no image)

Same dark full-viewport shell as Pinned CTA #1 but **centered**: copy block is `max-width:40rem;
margin-inline:auto; text-align:center`; the eyebrow row is centered; heading and body centered; the
CtaButton row is centered. `scroll-margin-top:6rem` (it has an id).

- **Eyebrow tone=dark** "Begin".
- **`<h2>`** (line-reveal): 2.25rem → sm 3rem → lg 3.75rem, `--on-dark`. Verbatim:
  "Start with a single conversation."
- **Body `<p>`** (word reveal): margin-top 2rem, 1.125rem `--on-dark-muted`. Verbatim:
  "Acquiring an edition, planning a commission, or simply curious — write to the studio. No pressure,
  just a real reply."
- **CtaButton tone=dark**: "Write to the studio" → `#contact`.

---

### Testimonials  (light)

`border-top:1px dashed var(--line); background:#fff; padding:6rem 1.5rem` (lg `8rem 3rem`).
Inner `max-width:120rem`.

- **SectionHeading**: eyebrow "In their words"; title "What collectors and curators say."
- **3-column grid** (1-col → 3-col at md), margin-top 4rem, gap 2.5rem. Each `<figure>` (fade-up,
  **stagger = index × 110ms**): `border-top:1px dashed var(--line)`, padding-top 2rem, full height,
  flex column justify-between —
  - **`<blockquote>`** in Playfair, 1.25rem (lg 1.5rem), line-height relaxed, `--ink`, wrapped in
    curly quotes “ ”.
  - **`<figcaption>`** margin-top 2.5rem: author `<p>` (1rem `--ink`) + role `<p>` (0.875rem
    `--ink-muted`, margin-top 0.25rem).

The three:
1. "Standing inside one of Nomura's installations, you stop checking your phone. Time slows down. That is the rarest thing an artwork can do now." — **Elena Vossberg**, *Curator, Kunsthalle Nord*
2. "We bought a print and ended up rearranging the whole room around it. It changes with the daylight — it is never the same painting twice." — **Marcus & Lia Hartmann**, *Private collectors, Zürich*
3. "Kai is one of the few artists working with code who never lets the technology become the subject. The work is always, quietly, about us." — **Daniel Asante**, *Director, Lumen Festival*

---

### Exhibitions  (grey)

`border-top:1px dashed var(--line); background:#f3f3f3; padding:6rem 1.5rem` (lg `8rem 3rem`).
Inner `max-width:120rem`.

- **SectionHeading** (margin-bottom 4rem): eyebrow "Exhibited & collected"; title "Shown in good company."
- **`<ul>`** grid 1-col → 2-col at sm → **3-col at lg**. Each `<li>` (fade-up, **stagger = (index % 3) × 80ms**):
  `border-top:1px dashed var(--line)`, padding-block 1.5rem, flex baseline gap 1.25rem — a 2-digit
  index in Playfair (0.875rem `--ink-muted`, zero-padded "01"…"10") + the venue name in Playfair
  (1.25rem, lg 1.5rem, `--ink`).

Venues, in order: **Meridian Gallery · Aurora Biennale · Lumen Festival · Kunsthalle Nord · Pavilion 9 ·
Nocturne Foundation · Verso Institute · Halcyon Trust · Field Museum of Light · Serra Collection.**

---

### FAQ  (light, accordion)

`border-top:1px dashed var(--line); background:#fff; padding:6rem 1.5rem` (lg `8rem 3rem`).
Inner grid `max-width:120rem`, 1-col → 12-col at lg, gap 3rem / lg 2rem.

- **Left (lg col-span 4):** SectionHeading — eyebrow "Questions"; title "Before you acquire."
- **Right (lg col-span 8):** the accordion rows (each row fades in, **stagger = index × 80ms**). Each
  row: `border-top:1px dashed var(--line)`; a header `<h3>` containing a full-width `<button>`
  (flex justify-between items-center gap 2rem, padding-block 2rem, text-align left). Left span: the
  question (1.25rem, lg 1.5rem, font-weight 500, normal-case, `--ink`). Right: a **"+"** glyph
  (1.5rem, `--ink`) that **rotates to 45°** (becoming an ×) when open, via spring (tension 300,
  friction 22 → ~450ms). Below: a panel (`role="region"`) that animates **measured height 0 → content
  height** and opacity 0 → 1 (spring tension 240, friction 32 → ~550ms; `overflow:hidden`). Panel
  content: padding-bottom 2.5rem, `<p>` max-width 60ch, 1.125rem line-height relaxed `--ink-muted`.
  Wire `aria-expanded`, `aria-controls`, `aria-labelledby` correctly. Only the clicked row toggles
  (independent; multiple may be open).

The four Q/A:
1. **How are the editions authenticated?** — "Every work ships with a signed certificate of authenticity, an embedded edition number, and a registry entry held by the studio. Digital works include a verifiable provenance record."
2. **Do you ship worldwide?** — "Yes. All works are shipped fully insured, in archival packaging, by specialist art couriers. Lead time is typically two to four weeks depending on framing and destination."
3. **Can I commission an original work?** — "Selectively. The studio takes on a small number of commissions each year — site-specific installations and bespoke generative works for collectors and institutions."
4. **How do I care for a generative or screen-based piece?** — "Editioned digital works arrive with a calibrated display and a lifetime conservation guarantee. The studio handles updates, replacements, and migration so the work outlives the hardware."

---

### Footer  (dark)

`background:#191917; color:#fff; padding:6rem 1.5rem 3rem` (lg px 3rem; note top padding 6rem,
bottom 3rem). Inner `max-width:120rem`.

- **Top grid** (1-col → 12-col at lg, gap 4rem / lg 3rem):
  - **Brand (lg col-span 5)** (fade-up on enter): the **Logo** (diamond + "kai nomura" Playfair italic
    lowercase); then a Playfair **italic** tagline `<p>` (margin-top 1.5rem, max-width 28ch, 1.5rem,
    `--on-dark-muted`): "Light, written in code."; then a mailto link (margin-top 2rem, 0.875rem
    uppercase letter-spacing 0.16em, `--on-dark`, hover `--on-dark-muted`): **studio@kainomura.art**.
  - **Column "Explore" (lg col-span 2):** title `<p>` (0.75rem uppercase letter-spacing 0.18em
    `--on-dark-faint`), then list (margin-top 1.5rem, space-y 0.75rem, links 1rem `--on-dark-muted`
    hover `--on-dark`): Works `#works`, About `#about`, Process `#process`, Acquire `#acquire`.
  - **Column "Studio" (lg col-span 2):** Contact `#contact`, Commissions `#contact`, Press kit
    `#contact`, Newsletter `#contact`.
  - **Column "Follow" (lg col-span 3):** Instagram `https://instagram.com`, Behance `https://behance.net`,
    Vimeo `https://vimeo.com` (open in new tab, rel="noreferrer noopener").
- **Giant wordmark** (fade-up, `overflow:hidden`, aria-hidden), margin-top 6rem: a centered block
  word **"Nomura"** at `font-size:18vw`, `font-weight:900` (Satoshi Black), uppercase, line-height 0.8,
  letter-spacing -0.04em, color `rgba(255,255,255,0.1)`.
- **Legal bar:** margin-top 3rem, `border-top:1px dashed var(--line-on-dark)`, padding-top 2rem,
  flex column → row at sm, justify-between. Left: copyright `<p>` (0.875rem `--on-dark-faint`):
  "© 2026 Kai Nomura Studio. All rights reserved." Right: a flex list gap 1.5rem of legal links
  (0.875rem `--on-dark-faint` hover `--on-dark-muted`): **Privacy** `#`, **Terms** `#`.

---

### Modal Menu  (full-screen overlay)

Hidden until the header Menu button is clicked. `position:fixed; inset:0; z-index:60; color:#fff`.
On open, lock scroll (Lenis stop + native lock). On close, unlock.

- **Black panel** that **grows down from the top edge**: `position:absolute; inset:0; background:#191917;
  transform-origin:top; transform:scaleY(0) → scaleY(1)` via spring (tension 200, friction 28 → ~600ms).
- **Content** (`position:relative; height:100%; display:flex; flex-direction:column; padding:1.5rem 1.5rem
  2.5rem` (lg px 3rem)):
  - **Top bar** (flex justify-between items-center): left label "Menu" (0.75rem uppercase
    letter-spacing 0.28em `--on-dark-faint`); right a **Close ✕** button (0.75rem uppercase
    letter-spacing 0.18em, hover `--on-dark-muted`), text "Close ✕".
  - **Nav** (`flex:1`, flex column, center justify, gap 0.5rem): the 5 nav links, each
    **staggering in** from `opacity:0 / translateY(1.5rem)` to visible (spring tension 180, friction
    26; **delay = 180 + index×70 ms**). Each link is a flex baseline row gap 1.25rem: a 2-digit index
    (width 2rem, 0.875rem `--on-dark-muted`, "01".."05") + the **huge label** (3rem → sm 3.75rem →
    lg 4.5rem, Playfair via the h-tag styling — actually rendered in default heading face; the label
    goes **italic on hover**). Clicking a link closes the menu and scrolls to its target.
    Links: 01 Works `#works` · 02 About `#about` · 03 Process `#process` · 04 Acquire `#acquire` ·
    05 Contact `#contact`.
  - **Bottom block** (fade in, delay ~600ms): `border-top:1px dashed var(--line-on-dark)`, padding-top
    2rem, flex column → row at sm, items-end, justify-between. Left: mailto **studio@kainomura.art**
    (1.125rem) + "Kyoto · Berlin" (0.875rem `--on-dark-muted`). Right: social list (Instagram /
    Behance / Vimeo, 0.875rem uppercase letter-spacing 0.16em `--on-dark-muted` hover `--on-dark`).

---

## Shared UI primitives

- **Eyebrow:** an inline-flex row, gap 0.75rem, items-center — a `1px × 2rem` horizontal line
  (background = `--ink-muted` light / `--on-dark-muted` dark) followed by the label text at 0.75rem,
  **uppercase**, letter-spacing 0.2em, color `--ink-muted` (or `--on-dark-muted` on dark).
- **Accent:** a Playfair Display, **italic**, normal-weight, normal-case `<span>` used for the one
  emphasized word inside a heading.
- **CtaButton:** inline-flex items-center gap 0.75rem, padding `1rem 2rem`, text 0.875rem **uppercase**
  letter-spacing 0.14em. Skins:
  - light solid: `background:#191917; color:#fff` (hover slightly lighter, ~90% opacity ink).
  - light ghost: `border:1px dashed var(--line); color:#191917` (hover fills `#191917` / text `#fff`).
  - dark solid: `background:#fff; color:#191917` (hover ~90%).
  - dark ghost: `border:1px dashed var(--line-on-dark); color:#fff` (hover fills `#fff` / text `#191917`).
  After the label, an **arrow "→"** that **slides right on hover** from `translateX(0)` to
  `translateX(0.4rem)` via spring (tension 320, friction 22 → ~400ms).
- **SectionHeading:** optional Eyebrow (fade, margin-bottom 1.5rem) + a line-revealed `<h2>` (Playfair),
  max-width 18ch, 2.25rem → sm 3rem → lg 4.5rem, color `--ink` (or `--on-dark`). May contain an `<Accent>`.

## Motion system

Reproduce the spring feel from `@react-spring/web` + a line/word text engine using vanilla JS +
CSS, gated by an **IntersectionObserver** so each block plays **once** when it scrolls into view
(react-spring `useInView` default: fires when the element first intersects the viewport; use
`threshold` ~0 with a small negative bottom rootMargin like `0px 0px -10% 0px` so it triggers a touch
before fully on-screen). Respect `prefers-reduced-motion`: skip transforms, show everything.

Convert these spring configs (tension `t`, friction `f`, mass defaults to 1) to durations/easings.
A rough mapping: `duration ≈ 1000 × (f / sqrt(t)) × 0.9`, ease-out. Concrete targets to use:

- **fadeUp** (default section entrance) — from `{opacity:0, translateY:2.5rem}` to
  `{opacity:1, translateY:0}`; config tension 110 / friction 26 → **~720ms, ease-out**
  (`cubic-bezier(0.16,1,0.3,1)`).
- **fade** (eyebrows, meta) — opacity 0→1; tension 90 / friction 24 → **~640ms, ease-out**.
- **plate** (images) — from `{opacity:0, translateY:3.5rem, scale:1.04}` to
  `{opacity:1, translateY:0, scale:1}`; tension 90 / friction 24 → **~700ms, ease-out**.
- **Line reveal** (headings, the "TextEngine overflow" effect): wrap the heading text in lines; each
  line sits in an `overflow:hidden` clip; lines animate from `translateY(110%); opacity:0` to
  `translateY(0); opacity:1`. **Per-line duration 1000ms**, easing **easeOutExpo**
  (`cubic-bezier(0.16,1,0.3,1)` is a good approximation), **line stagger 90ms** (the **hero `<h1>`
  uses 140ms** stagger). Split the heading into visual lines; the easiest faithful approach is to wrap
  each whitespace-delimited word in a span and clip per line, or split on the natural line breaks.
  The `<Accent>` italic word animates inline within its line.
- **Word reveal** (leads, statement, about paragraphs, CTA bodies): split text into word `<span>`s,
  each animating from `translateY(0.8rem); opacity:0` to `translateY(0); opacity:1`. **Per-word
  duration 720ms**, easing **easeOutQuart** (`cubic-bezier(0.165,0.84,0.44,1)`), **word stagger**
  per section: hero lead 18ms, statement 30ms, about paragraphs 10ms, pinned-CTA bodies 16ms. The
  hero lead also has a **500ms start delay** after the heading.
- **Section entrance delays / staggers** (apply as the listed extra delay before the spring starts):
  hero — eyebrow 0, heading 0, lead +500, CTA +800, facts +1000, portrait +200, mobile cue +1400;
  principles cards index×90; about photos index×100; testimonials index×110; exhibitions (index%3)×80;
  acquire cards (index%2)×90; faq rows index×80.
- **Hover springs (pointer devices only):** disable on touch / ≤768px. CtaButton arrow slide
  (t320/f22, ~400ms); about photo scale 1→1.06 (t180/f24, ~700ms); acquire card lift 0→−0.75rem
  (t220/f22, ~600ms). Header nav dot fades 0→1 on hover; menu link goes italic on hover.
- **Featured-works parallax (scroll-scrub):** as each plate travels through the viewport, map its
  progress (0 when its top hits the viewport bottom → 1 when its bottom hits the viewport top) to a
  `translateY` from **+2.5rem to −2.5rem**, linearly. Update on the Lenis scroll callback (or GSAP
  ScrollTrigger `scrub:true`). Disable on mobile.
- **Modal menu:** black panel `scaleY(0)→1` from top (t200/f28, ~600ms); nav links stagger in
  `opacity/translateY` (t180/f26, delay 180+index×70ms); bottom block fade (t120/f24, delay 600ms).
  Closing can simply reverse / fade out quickly.
- **FAQ:** "+" rotates 0→45° (t300/f22, ~450ms); panel height 0→measured + opacity 0→1 (t240/f32,
  ~550ms). Measure content height with `scrollHeight` (re-measure on resize via ResizeObserver).

## Fixed parameters (bake these in)

- **Palette (hex / rgba):** canvas `#ffffff`; surface-grey `#f3f3f3`; surface-dark / ink `#191917`;
  ink-muted `rgba(25,25,23,0.6)`; ink-faint `rgba(25,25,23,0.3)`; on-dark `#ffffff`;
  on-dark-muted `rgba(255,255,255,0.6)`; on-dark-faint `rgba(255,255,255,0.3)`;
  line `rgba(25,25,23,0.2)`; line-strong `rgba(25,25,23,0.4)`; line-on-dark `rgba(255,255,255,0.2)`.
  **No color accent — strictly monochrome.**
- **Fonts:** headings/display & accents/quotes/prices/wordmark/numerals = **Playfair Display**
  (serif, 400, italic for accents/wordmark/signature). Body/UI/labels = **Satoshi** (400/500/700/900).
- **Type scale (rem):** xs .75, sm .875, base 1, lg 1.125, xl 1.25, 2xl 1.5, 3xl 1.875, 4xl 2.25,
  5xl 3, 6xl 3.75, 7xl 4.5, 8xl 6; giant footer wordmark 18vw.
- **Heading base:** Playfair 400, letter-spacing -0.01em, line-height 1.12 (hero h1 line-height 1.04).
- **Breakpoints:** sm 640 / md 768 / lg 1024; adaptive root font-size queries at 1920 / 1440 / 1024 /
  640 (values above). Single-column below lg; 12-col grids at lg.
- **Section rhythm:** vertical padding 6rem mobile / 8rem lg (statement 7rem/10rem); horizontal
  1.5rem / 3rem; container max-width 120rem; dashed top hairlines; scroll-margin-top 6rem on anchored
  sections (`#works #about #process #acquire #contact`).
- **Spring → timing:** fadeUp 720ms / fade 640ms / plate 700ms (all ease-out, `cubic-bezier(0.16,1,0.3,1)`);
  line reveal 1000ms easeOutExpo, stagger 90ms (hero 140ms), from translateY 110%; word reveal 720ms
  easeOutQuart, stagger 10–30ms, from translateY 0.8rem; arrow hover 400ms (t320/f22); photo hover
  700ms scale 1.06; acquire lift 600ms −0.75rem; modal panel 600ms scaleY; faq panel 550ms / "+"
  450ms.
- **Image aspect ratios:** hero portrait 3/4; featured works — Ma 3/2, Tidal 3/2, Hanabi 3/4,
  Silent 3/2, After Image 3/2, Static 3/2; pinned #1 portrait 3/4; about photos 3×(3/2); acquire —
  After Image 3/2, Hanabi 3/4, Ma 3/2, Tidal 3/4. Default `<Media>` fallback ratio 810/975.
- **Featured-works zig-zag:** each item spans 7/12 cols; odd items col-start 6 + margin-top 6rem,
  even items col-start 1; gap-x 2rem, gap-y 0 at lg.

## Assets

All artwork is B&W. Load each from its full bucket URL (preserve the aspect ratios above).
Base: `https://api.getlayers.ai/storage/v1/object/public/public/assets/artist-32290926f6/site`

- Hero portrait → `https://api.getlayers.ai/storage/v1/object/public/public/assets/artist-32290926f6/site/art-p1.webp` (ratio 3/4)
- Pinned CTA #1 portrait, Hanabi for-sale → `https://api.getlayers.ai/storage/v1/object/public/public/assets/artist-32290926f6/site/art-p2.webp` (3/4)
- Hanabi Engine work, Tidal for-sale → `https://api.getlayers.ai/storage/v1/object/public/public/assets/artist-32290926f6/site/art-p3.webp` (3/4)
- Ma work, About photo 1 → `https://api.getlayers.ai/storage/v1/object/public/public/assets/artist-32290926f6/site/art-l1.webp` (3/2)
- Tidal Memory work, About photo 2 → `https://api.getlayers.ai/storage/v1/object/public/public/assets/artist-32290926f6/site/art-l2.webp` (3/2)
- After Image work, About photo 3 → `https://api.getlayers.ai/storage/v1/object/public/public/assets/artist-32290926f6/site/art-l3.webp` (3/2)
- Silent Architecture work, After Image for-sale → `https://api.getlayers.ai/storage/v1/object/public/public/assets/artist-32290926f6/site/art-l4.webp` (3/2)
- Static Garden work, Ma for-sale → `https://api.getlayers.ai/storage/v1/object/public/public/assets/artist-32290926f6/site/art-l5.webp` (3/2)