'use client';

/**
 * HeroMorph — two distinct layouts joined by one shared-layout transition.
 *
 * Sequence: the intro poster assembles once, then HOLDS. It does not advance
 * on a timer. The visitor's first mouse move is what fires the morph into the
 * portfolio hero — brand to the navbar, portrait to the right.
 *
 * The core idea, and the reason this isn't built as a single hero with fades:
 * the brand and the portrait are declared in BOTH layouts under the same
 * `layoutId`. When `phase` flips, React unmounts the intro subtree and mounts
 * the hero subtree in the same commit, so Framer Motion sees each layoutId
 * disappear in one place and reappear in another. It measures both boxes and
 * drives the element from the old rect to the new one with a single spring —
 * a genuine morph. Nothing remounts visually, nothing crossfades, and the
 * pixel deltas (roughly -340px for the brand, +420/+60 for the portrait) fall
 * out of the two layouts rather than being hardcoded.
 *
 * Two rules keep the projection clean and are easy to break by accident:
 *
 *   1. No transform utilities (`-translate-x-1/2`, `scale-*`) on a layoutId
 *      element. Framer Motion owns `transform` on those nodes; a Tailwind
 *      transform silently fights it. Centring is done with flex on a wrapper.
 *   2. Both states of a layoutId element share an aspect ratio, so the morph
 *      is a uniform scale with no stretch mid-flight.
 */

import { useEffect, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'framer-motion';
import type { Transition, Variants } from 'framer-motion';

/* ------------------------------------------------------------------ *
 * Motion constants
 * ------------------------------------------------------------------ */

/** Drives every shared-layout morph. */
const MORPH: Transition = {
  type: 'spring',
  stiffness: 70,
  damping: 18,
  mass: 1
};

/** Opacity/offset easing for everything that isn't a morph. */
const EASE = [0.22, 1, 0.36, 1] as const;

/* Intro beats, in seconds — see the timeline in the README block above. */
const BRAND_IN = { delay: 0.3, duration: 0.9 };
const PORTRAIT_IN = { delay: 0.7, duration: 1.4 };

/**
 * When the intro has finished assembling and the poster is simply held.
 * Nothing advances on its own after this — the morph waits for the visitor.
 * The only reason this matters is arming: a mouse move at t=200ms must not
 * cut the entrance off half-drawn.
 */
const ENTRANCE_DONE = (PORTRAIT_IN.delay + PORTRAIT_IN.duration) * 1000;

/* ------------------------------------------------------------------ *
 * Content
 * ------------------------------------------------------------------ */

const BRAND = 'Rakhi.UX';

const NAV_LEFT = [
  { label: 'About', href: '#about' },
  { label: 'Case Studies', href: '#case-studies' }
];

const NAV_RIGHT = [
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' }
];

/* Two lines by design — the `\n` is honoured via whitespace-pre-line, and the
   column is wide enough that neither line wraps on its own. */
const HEADLINE = { accent: 'Designing', rest: 'Your\nDaily Journey.' };

const BIO =
  'UI/UX Designer with 4+ years of experience creating intuitive mobile apps, ' +
  'SaaS platforms, and product interfaces. Skilled at turning complex problems ' +
  'into simple, user-friendly solutions.';

const SOCIALS = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/',
    path: 'M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.76V21h-4v-5.6c0-1.34-.02-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.96V21h-4V9Z'
  },
  {
    label: 'X',
    href: 'https://x.com/',
    path: 'M18.9 3H21l-6.53 7.46L22.5 21h-6.9l-4.8-6.27L4.6 21H2.5l7-8L2 3h7.06l4.34 5.73L18.9 3Zm-1.2 16h1.15L7.36 4.9H6.1L17.7 19Z'
  },
  {
    label: 'Dribbble',
    href: 'https://dribbble.com/',
    path: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm6.6 4.7a8.2 8.2 0 0 1 1.8 5c-.26-.05-2.86-.58-5.48-.25-.06-.14-.11-.29-.17-.43a20 20 0 0 0-.5-1.16c2.9-1.18 4.2-2.86 4.35-3.16ZM12 3.8c1.83 0 3.5.66 4.8 1.75-.13.27-1.3 1.8-4.1 2.86A44.6 44.6 0 0 0 9.6 4.2c.77-.26 1.57-.4 2.4-.4Zm-4.05 1.1a45 45 0 0 1 3.1 4.4c-3.9 1.04-7.34 1-7.7 1a8.24 8.24 0 0 1 4.6-5.4Zm-4.75 7.13v-.2c.35.01 4.4.06 8.56-1.18.24.46.46.93.67 1.4l-.4.12c-4.32 1.4-6.62 5.22-6.81 5.54a8.16 8.16 0 0 1-2.02-5.68Zm7.5 8.16A8.2 8.2 0 0 1 5.9 17.7c.15-.26 1.85-3.15 6.6-4.75.02-.01.03 0 .05-.01a37 37 0 0 1 1.87 6.99 8.2 8.2 0 0 1-3.72.16Zm5-.72a38.8 38.8 0 0 0-1.72-6.5c2.42-.38 4.54.24 4.8.32a8.25 8.25 0 0 1-3.08 6.18Z'
  },
  {
    label: 'GitHub',
    href: 'https://github.com/',
    path: 'M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.15-1.11-1.46-1.11-1.46-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.56-1.11-4.56-4.93 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.83-2.34 4.68-4.57 4.92.36.31.68.92.68 1.85v2.75c0 .26.18.58.69.48A10 10 0 0 0 12 2Z'
  }
];

type Phase = 'intro' | 'hero';

/* ------------------------------------------------------------------ *
 * Shared pieces — identical markup in both layouts, so the only thing
 * that changes across the morph is the box each one lands in.
 * ------------------------------------------------------------------ */

/**
 * The cutout plus its bottom fade. The mask lives on the same node that
 * morphs, so it survives the whole flight instead of being re-applied at
 * either end.
 */
function PortraitArt() {
  const fade = 'linear-gradient(to bottom, #000 68%, rgba(0,0,0,0.55) 88%, transparent 100%)';

  return (
    <div
      className="h-full w-full"
      style={{ maskImage: fade, WebkitMaskImage: fade }}
    >
      {/* Plain <img>: next/image would swap in a new <img> element on resize
          and interrupt the morph. */}
      <img
        src="/rakhi-portrait-cutout.png"
        alt="Rakhi Das, UI/UX Designer"
        draggable={false}
        className="h-full w-full object-contain object-bottom grayscale select-none"
      />
    </div>
  );
}

function NavLink({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      className="text-[15px] text-muted transition-colors duration-200 hover:text-ink"
    >
      {label}
    </a>
  );
}

/* ------------------------------------------------------------------ *
 * Left column
 * ------------------------------------------------------------------ */

const LEFT_COLUMN: Variants = {
  hidden: { opacity: 0, x: -60 },
  shown: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, delay: 0.2, ease: EASE }
  }
};

function HeroCopy() {
  return (
    <motion.div
      variants={LEFT_COLUMN}
      initial="hidden"
      animate="shown"
      className="gpu max-w-[36rem]"
      style={{ willChange: 'transform, opacity' }}
    >
      <h1 className="text-[clamp(2.5rem,1.4rem+3.6vw,4.25rem)] font-light leading-[1.08] tracking-[-0.03em] whitespace-pre-line">
        <span className="bg-gradient-to-r from-accent-a via-accent-b to-accent-c bg-clip-text text-transparent">
          {HEADLINE.accent}
        </span>{' '}
        {HEADLINE.rest}
      </h1>

      <p className="mt-6 text-[15px] leading-[1.7] text-muted">{BIO}</p>

      <div className="mt-9 flex flex-wrap items-center gap-6">
        <a
          href="#case-studies"
          className="group inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-[15px] font-medium text-white transition-transform duration-200 hover:-translate-y-0.5"
        >
          View Work
          <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
        </a>

        <a
          href="#contact"
          className="group inline-flex items-center gap-2 text-[15px] font-medium text-ink"
        >
          Get Started
          <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
        </a>
      </div>

      <div className="mt-12">
        <p className="text-[15px] text-ink">Follow me on:</p>
        <ul className="mt-4 flex items-center gap-3">
          {SOCIALS.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                aria-label={s.label}
                target="_blank"
                rel="noreferrer"
                /* Opaque, not a tint: on phones the cutout passes behind this
                   row, and a translucent chip would disappear into her hair. */
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f1f1f3] text-ink ring-1 ring-black/[0.06] transition-colors duration-200 hover:bg-[#e4e4e8]"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-[15px] w-[15px]">
                  <path d={s.path} />
                </svg>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ *
 * HeroMorph
 * ------------------------------------------------------------------ */

export default function HeroMorph() {
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>('intro');

  /**
   * The intro assembles itself and then *holds indefinitely*. There is no
   * timer that advances it — the morph is the visitor's move to make, and
   * the poster stays exactly as it is until they make it.
   *
   * `armed` only gates the very start: until the entrance has finished
   * drawing, an input is remembered rather than acted on, so an early mouse
   * move never chops the sequence off mid-fade.
   *
   * mousemove is the headline trigger; the rest are the same gesture on
   * input devices that don't have one, so nobody can get stranded on the
   * poster with no way forward.
   */
  useEffect(() => {
    if (reduceMotion) {
      setPhase('hero');
      return;
    }

    let armed = false;
    let requested = false;

    const advance = () => {
      if (!armed) {
        requested = true;
        return;
      }
      setPhase('hero');
    };

    const armId = window.setTimeout(() => {
      armed = true;
      if (requested) setPhase('hero');
    }, ENTRANCE_DONE);

    const events = ['mousemove', 'pointerdown', 'touchstart', 'wheel', 'keydown'] as const;
    events.forEach((e) => window.addEventListener(e, advance, { passive: true }));

    return () => {
      window.clearTimeout(armId);
      events.forEach((e) => window.removeEventListener(e, advance));
    };
  }, [reduceMotion]);

  const isIntro = phase === 'intro';

  return (
    <LayoutGroup>
      <section className="relative h-dvh w-full overflow-hidden bg-white">
        {/* ---------------------------------------------------------- *
         * NAVBAR — links only. The brand is a sibling rather than a
         * child: the bar is animating its own y at the same moment the
         * brand is morphing into it, and nesting the two would make the
         * brand's target rect a moving one.
         * ---------------------------------------------------------- */}
        <AnimatePresence>
          {!isIntro && (
            <motion.nav
              key="nav"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: EASE }}
              aria-label="Primary"
              className="gpu absolute inset-x-0 top-0 z-40 flex h-24 items-center"
              style={{ willChange: 'transform, opacity' }}
            >
              {/* Links are hidden below md — four of them plus the brand can't
                  share a phone-width bar, and the brand is the piece that has
                  to land in the centre regardless. */}
              <div className="mx-auto hidden w-full max-w-[1280px] items-center justify-center gap-10 px-8 md:flex">
                {NAV_LEFT.map((l) => (
                  <NavLink key={l.label} {...l} />
                ))}

                {/* Reserves the brand's slot without rendering it — the
                    morphing element is positioned over this gap. */}
                <span aria-hidden className="w-[190px] shrink-0" />

                {NAV_RIGHT.map((l) => (
                  <NavLink key={l.label} {...l} />
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>

        {/* ---------------------------------------------------------- *
         * PORTRAIT — layoutId="portrait"
         * Centred in the intro, bottom-right in the hero. Same aspect
         * ratio in both, so the morph is a uniform scale.
         * ---------------------------------------------------------- */}
        {isIntro ? (
          <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
            <motion.div
              layoutId="portrait"
              initial={{ opacity: 0, y: 80, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                opacity: { ...PORTRAIT_IN, ease: EASE },
                y: { ...PORTRAIT_IN, ease: EASE },
                scale: { ...PORTRAIT_IN, ease: EASE },
                layout: MORPH
              }}
              className="gpu relative aspect-[533/740] h-[62vh]"
              style={{ willChange: 'transform, opacity' }}
            >
              <PortraitArt />
            </motion.div>
          </div>
        ) : (
          /* Hard right on phones so the cutout clears the left column; only
             once there are two real columns does it centre in its half. */
          <div className="pointer-events-none absolute inset-y-0 right-0 z-20 flex w-[78%] items-end justify-end sm:w-[62%] lg:w-[42%] lg:justify-center">
            <motion.div
              layoutId="portrait"
              transition={{ layout: MORPH }}
              className="gpu relative aspect-[533/740] h-[44vh] sm:h-[62vh] lg:h-[88vh]"
              style={{ willChange: 'transform' }}
            >
              <PortraitArt />
            </motion.div>
          </div>
        )}

        {/* ---------------------------------------------------------- *
         * BRAND — layoutId="brand"
         * z-30 in the intro so it sits behind the portrait exactly as in
         * the reference; z-50 once it's the navbar logo.
         * ---------------------------------------------------------- */}
        {isIntro ? (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
            <motion.span
              layoutId="brand"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                opacity: { ...BRAND_IN, ease: EASE },
                y: { ...BRAND_IN, ease: EASE },
                layout: MORPH
              }}
              className="gpu block whitespace-nowrap text-[clamp(64px,16.5vw,250px)] font-extrabold leading-[0.82] tracking-[-0.045em] text-ink"
              style={{ willChange: 'transform, opacity' }}
            >
              {BRAND}
            </motion.span>
          </div>
        ) : (
          <div className="pointer-events-none absolute inset-x-0 top-0 z-50 flex h-24 items-center justify-center">
            <motion.span
              layoutId="brand"
              transition={{ layout: MORPH }}
              className="gpu block whitespace-nowrap text-[42px] font-extrabold leading-[0.82] tracking-[-0.03em] text-ink"
              style={{ willChange: 'transform' }}
            >
              {BRAND}
            </motion.span>
          </div>
        )}

        {/* ---------------------------------------------------------- *
         * LEFT COLUMN — mounts with the hero layout, i.e. once the
         * morph has already started.
         * ---------------------------------------------------------- */}
        <AnimatePresence>
          {!isIntro && (
            <div
              key="copy"
              /* Top-aligned under the bar on phones (the portrait owns the
                 lower half); centred once there's room for two columns. */
              className="absolute inset-0 z-30 flex items-start pt-28 lg:items-center lg:pt-0"
            >
              <div className="mx-auto w-full max-w-[1280px] px-6 lg:px-8">
                <HeroCopy />
              </div>
            </div>
          )}
        </AnimatePresence>
      </section>
    </LayoutGroup>
  );
}
