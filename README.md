# Rakhi Das — Portfolio

A three-page static portfolio. **No framework, no build step, no dependencies.**
Open `index.html` in a browser and it runs.

```
index.html    Home. Structure only — all copy comes from js/data.js.

case-studies/
  suraksha_case_study.html   Suraksha case study. Self-contained content.
  yoga_case_study.html       Yoga case study. Self-contained content.
  (both reach css/, js/ and public/ with ../ — old root URLs redirect
   to these, see vercel.json)

js/
  motion.js     Motion tokens + the one shared scroll/resize frame. Every page.
  data.js       Single source of truth for every string, link and asset path.
  script.js     Renders index.html from data.js. Home page only.
  reveal.js     Scroll-reveal. Shared by every page.
  to-top.js     Back-to-top button. Shared by every page.
  hero.js       Layered product hero: parallax, tilt, entrance.
  cs-nav.js     Suraksha scrollspy, progress bar, drawer.
  yoga-nav.js   The same, for the yoga case study.

css/
  styles.css      Design tokens + every shared component. Loaded by every page.
  hero.css        The layered product hero.
  case-study.css  Only what the Suraksha case study adds on top.
  yoga-case.css   Only what the yoga case study adds on top.

public/       Images, video, resume PDF.
vercel.json   Deploy config (see Deployment).
```

## Architecture

**`data.js` is the content layer.** Editing it re-skins the home page for a
different person or project without touching markup, styles or logic.
`index.html` carries empty elements with ids; `script.js` fills them.

**Load order in `index.html` matters:**

```html
<script src="js/motion.js"></script>  <!-- defines SiteMotion; all three below use it -->
<script src="js/data.js"></script>    <!-- defines PORTFOLIO_DATA -->
<script src="js/script.js"></script>  <!-- builds the DOM from it -->
<script src="js/reveal.js"></script>  <!-- must run last: most reveal targets -->
<script src="js/to-top.js"></script>  <!-- don't exist until script.js runs -->
```

The case study loads `motion.js`, `reveal.js`, `to-top.js`, `cs-nav.js` and
`hero.js`. It cannot load `script.js`, which is a single pass expecting the
full home-page DOM and would throw on this page's missing elements — which is
why its hero is written out in the markup rather than built from `data.js`.

### The layered product hero

`hero.css` + `hero.js` + `buildHeroStage` in `script.js`. One component, used by
the home page works tile (built from `data.js`) and the case study banner
(written out inline, because `script.js` cannot run there). It replaces the
flattened `Frame21.png` export with the five product surfaces as separate
elements.

**Two compositions, not one scaled.** A container query on the stage — not a
viewport media query, because the component is used at two different widths on
the same site — switches at a 560px stage:

| | desktop | small screen |
|---|---|---|
| plate | 1314 / 580 | 1 / 1.32 |
| layers | dash, table, card, phones | table, card, **app** |
| leads with | the admin dashboard | the patient app screen |

`app` is the middle device cut out of the three-up strip — the only one of the
three with an unoccluded silhouette. The dashboard and the strip are *dropped*
on small screens rather than shrunk: at a 335px stage the dashboard renders at
0.18x and its table rows stop being rows.

The 560px threshold is set by where the mobile composition stops being honest
(a 319px asset at 0.61 of the stage upscales past 523px), not by where the
dashboard stops being readable. Between 560 and 720 the desktop arrangement
still reads as a product shot; an upscaled phone reads as a mistake.

**Desktop geometry is measured, not eyeballed** — each layer was template
matched against the original flattened export (77–91% pixel agreement) and the
winning scale and offset written as percentages of the artboard. The rebuild
diffs against that export at a mean 4.67/255 per pixel, the residue being text
anti-aliasing from the 0.4275x downscale.

**Two asset defects surfaced doing this** (full note in `hero.css`): the
phones' app header is the same blue as the background they were cut from, so
the chroma key had removed it — invisible on a blue plate, but the hole showed
whatever sat behind it; and `table.png` was an incomplete crop covering 188 of
the 291px the bookings panel occupies.

**Shadows are CSS, not baked.** The key stripped them (a soft shadow on a flat
field keeps that field's hue), so they are restored as `drop-shadow` in `cqw`,
tuned against the grey falloff sampled from the original. They sit on
`.hero-art`, inside the box that animates, so the drift composites a rasterised
result instead of re-blurring every frame.

**WebP only where it wins.** Three of five layers; the dashboard and card are
flat-fill UI with sharp text and got 24–29% *bigger* as WebP.

**Every layer is `loading="lazy"`.** A `display: none` image with that attribute
is never fetched, which is what keeps the unused composition off the wire —
70KB on a phone against 190KB on a desktop. In-viewport lazy images still load
immediately, so the visible layers pay nothing.

### The case study

`suraksha_case_study.html` + `case-study.css` + `cs-nav.js` are a self-contained
editorial layout that borrows only the font, ink tokens, `.btn` and the footer
from `styles.css`.

**One 12-column grid at a 1280px measure.** `.cs-shell` centres it, `.cs-grid`
declares it, `.sp-4` … `.sp-12` choose a span, and everything collapses to one
column at 900px. The point is that a heading, a paragraph and a screenshot all
start on the same vertical line down the whole page.

**Nine sections**, each an anchor target with `scroll-margin-top` reserving the
sticky bar: hero → overview → challenge → research → strategy → design →
solution → responsive → outcome.

**Type is a fixed six-step scale**, and the steps are anchored in **px, not
rem**. `styles.css` scales the root itself (`clamp(15px, 14.1px + 0.28vw,
17px)`), so a rem floor is not a floor — `0.75rem` lands at 11.4px on a 375px
phone. The `vw` term still supplies the desktop growth.

`cs-nav.js` runs the scrollspy, the reading-progress bar and the mobile drawer
off `SiteMotion`'s single ticker, and manages `tabindex` on the pannable image
boxes (see Conventions).

Content images are `<picture>` with a WebP source and the original PNG as the
fallback: 1288KB → 241KB across the eight of them. Regenerate with
`sharp(src).webp({ quality: 82, effort: 6 })`.

## Motion

`motion.js` owns two things:

- **Timing tokens** (`SiteMotion.DUR`, `SiteMotion.EASE`). Durations are tiered
  by interaction weight — `micro` 150ms for hover feedback up to `hero` 900ms
  for the intro flight — and there are exactly two easing curves. New motion
  should pick an existing tier rather than invent a duration.
- **One shared frame.** `SiteMotion.onFrame(fn)` subscribes to a single
  `scroll`/`resize`/`load` listener and a single `requestAnimationFrame`. It
  hands the callback `(scrollY, viewportHeight)` already read.

Everything scroll-driven goes through it: the about-word fade and the header
tuck in `script.js`, and the back-to-top button in `to-top.js`. Do not add a
`scroll` listener — subscribe instead. Callbacks must read layout before
writing, since they share a frame with each other.

Scroll *reveals* are separate and use `IntersectionObserver` (`reveal.js`),
which is the right tool for one-shot enter detection and costs nothing per
frame. Only genuinely scroll-*linked* motion belongs on the ticker.

`SiteMotion.reduced` and `SiteMotion.touch` are live getters, not snapshots —
re-read them at use rather than caching.

### The case study banner

The Suraksha banner is **four separate layers**, not one image, so each part
can carry its own entrance and parallax rate:

| `public/Surksha/banner/` | part | depth |
|---|---|---|
| `dash.png` | admin dashboard | 0.35 |
| `table.png` | right-hand table | 0.55 |
| `card.png` | patient card | 0.70 |
| `phone.png` | three phones | 1.00 |

`depth` is the multiplier on pointer travel, set via `data-depth` in the
markup — so the phones move ~3x as far as the dashboard while the navy plate
behind them only tilts. Layer positions are percentages of the 1540x603
artboard, taken from the Figma node coordinates; entrance and drift distances
use `cqw` so they scale with the plate instead of being fixed pixel nudges.

The layers were exported from the Figma source (file `V7feJrAACXgVDCnTonWlQf`,
node `2189:1444`), keyed off that file's flat background, and cropped to their
artwork. `table.png` was cut from the original flat banner instead — the Figma
plan's tool-call limit was reached before it could be exported, and nothing
overlaps it there, so the cut is lossless.

`public/works/Frame 21.png` is the original flat banner. **Nothing references
it any more.** It is kept as the provenance of `table.png` and as a fallback;
delete it if you don't want the 251KB.

**CSS is token-driven.** Everything in `styles.css` rides on the custom
properties in `:root`. Change a token, change every component that uses it. The
reset deliberately strips `margin`/`font-size`/`font-weight` from `h1`–`h6` so
heading levels can be chosen for document outline without affecting appearance.

## Conventions

- **ES5, no modules.** Plain `<script>` tags, each file an IIFE with `'use strict'`.
  Keep it that way unless the whole site moves to modules at once.
- **Asset paths are written as `public/...`** — the real on-disk path. This works
  because the site is served flat (see Deployment). Do not add a leading slash.
- **Comments explain *why*, not *what*.** Several non-obvious mechanisms depend on
  it: the double `requestAnimationFrame` in the intro morph, the negative
  `animation-delay` that keeps the marquee from jumping when reversed, and the
  `transition-delay` cleanup in `reveal.js` that stops stagger delays leaking
  into hover transitions. Preserve these when editing.
- **`prefers-reduced-motion` is honoured throughout.** Any new motion must
  handle it too.
- **Reveals on the case study are opt-in via `.cs-reveal`.** `reveal.js` matches
  that one class plus `.cs-figure`, so a new section animates without editing
  `reveal.js` — and because same-parent targets stagger in document order, the
  cards in a grid sequence themselves.
- **`.cs-pan` is a contained horizontal scroller**, used below 720px so a
  1016px dashboard screenshot can be read at a usable size instead of being
  scaled to a third of it. `cs-nav.js` adds `tabindex="0"` and an `aria-label`
  **only while the box actually overflows** — a scroll region that answers only
  to touch and the wheel is unreachable by keyboard, but hard-coding the
  attribute would leave six dead tab stops on every desktop viewport.
- **`.cs-page` re-zeroes `dd` margin and `ol` padding.** `styles.css` strips
  `ul` markers and `h1`–`h6` margins, but the home page uses neither
  description lists nor ordered lists, so those UA defaults were never dealt
  with. The case study uses both heavily.

## Deployment

Deployed on Vercel as a **flat static site** — no build.

`vercel.json` sets `framework: null` and `outputDirectory: "."`. Both matter:

- Without `framework: null`, Vercel would auto-detect a framework from any
  `package.json` and serve a build output instead of these files.
- Without `outputDirectory: "."`, Vercel's zero-config static behaviour uses a
  `public/` directory as the site root if one exists — which would serve the
  images *as* the whole site and 404 every page.

This matches how GitHub Pages and a local `file://` open already behave, so all
three environments are identical.

> Vercel builds on Linux, which is **case-sensitive**. Windows and macOS are not.
> A path that works locally can still 404 in production — check casing exactly.

### Local preview

Any flat static server works, e.g.:

```sh
npx serve .
```

## Parked, not dead

Two features are intentionally kept but currently unreachable. Both are
documented at their definitions:

- **Testimonials** — section commented out in `index.html`, `renderTestimonials()`
  commented out in `script.js`. CSS and `data.js` entries remain. To restore,
  uncomment both together.
- **Dark theme** — a complete token palette under `[data-theme='dark']` in both
  CSS files. Nothing sets the attribute since the theme toggle was removed.
  Restoring the control brings the theme back; no component rules need changing.

## Known gaps

- `og:url` and `og:image` are absent from both pages. They need an absolute URL,
  so they can only be filled in once the production domain is fixed. Until then
  social shares render without a preview image.
- The case study's footer is hardcoded and has drifted from the data-driven one
  on the home page: its copyright year is a literal, and it has no social links.
  Unifying it requires `script.js` to be splittable per page.
- Images are PNG/JPEG with no `srcset` and no WebP/AVIF.
