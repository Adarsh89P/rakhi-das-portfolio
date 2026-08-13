# Rakhi Das — Portfolio

A two-page static portfolio. **No framework, no build step, no dependencies.**
Open `index.html` in a browser and it runs.

```
index.html                 Home. Structure only — all copy comes from data.js.
suraksha_case_study.html   Case study. Self-contained content.

motion.js     Motion tokens + the one shared scroll/resize frame. Both pages.
data.js       Single source of truth for every string, link and asset path.
script.js     Renders index.html from data.js. Home page only.
reveal.js     Scroll-reveal. Shared by both pages.
to-top.js     Back-to-top button. Shared by both pages.
banner.js     Layered parallax for the case study banner. Case study only.

styles.css      Design tokens + every shared component. Loaded by both pages.
case-study.css  Only what the case study adds on top.

public/       Images, video, resume PDF.
vercel.json   Deploy config (see Deployment).
```

## Architecture

**`data.js` is the content layer.** Editing it re-skins the home page for a
different person or project without touching markup, styles or logic.
`index.html` carries empty elements with ids; `script.js` fills them.

**Load order in `index.html` matters:**

```html
<script src="motion.js"></script>  <!-- defines SiteMotion; all three below use it -->
<script src="data.js"></script>    <!-- defines PORTFOLIO_DATA -->
<script src="script.js"></script>  <!-- builds the DOM from it -->
<script src="reveal.js"></script>  <!-- must run last: most reveal targets -->
<script src="to-top.js"></script>  <!-- don't exist until script.js runs -->
```

The case study loads `motion.js`, `reveal.js` and `to-top.js`. It cannot load
`script.js`, which is a single pass expecting the full home-page DOM and would
throw on this page's missing elements.

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
- **`prefers-reduced-motion` is honoured in five places.** Any new motion must
  handle it too.

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
