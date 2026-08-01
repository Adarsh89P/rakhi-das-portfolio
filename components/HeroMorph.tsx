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
  { label: 'Meet kai', href: '#about' },
  { label: 'Book online', href: '#case-studies' }
];

const NAV_RIGHT = [
  { label: 'Photo Gallery', href: '#experience' },
  { label: 'Contact', href: '#contact' }
];

/* Wraps naturally at the column width, exactly as in the reference:
   "Revitalize Your" / "Daily Journey." */
const HEADLINE = { accent: 'Revitalize', rest: 'Your Daily Journey.' };

const BIO =
  'UI/UX Designer with 4+ years of experience creating intuitive mobile apps, ' +
  'SaaS platforms, and product interfaces. Skilled at turning complex problems ' +
  'into simple, user-friendly solutions.';

/* Order matches the reference exactly: X, Facebook, Instagram, LinkedIn. */
const SOCIALS = [
  {
    label: 'X',
    href: 'https://x.com/',
    path: 'M18.9 3H21l-6.53 7.46L22.5 21h-6.9l-4.8-6.27L4.6 21H2.5l7-8L2 3h7.06l4.34 5.73L18.9 3Zm-1.2 16h1.15L7.36 4.9H6.1L17.7 19Z'
  },
  {
    label: 'Facebook',
    href: 'https://facebook.com/',
    path: 'M13.5 21v-7.5H16l.4-3H13.5V8.4c0-.87.24-1.46 1.5-1.46H16.5V4.35c-.26-.03-1.15-.11-2.19-.11-2.17 0-3.66 1.32-3.66 3.75V10.5H8.2v3h2.45V21h2.85Z'
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com/',
    path: 'M12 2c2.72 0 3.06.01 4.12.06 1.06.05 1.79.22 2.43.47.66.26 1.22.6 1.77 1.15.55.55.89 1.11 1.15 1.77.25.64.42 1.37.47 2.43C21.99 8.94 22 9.28 22 12s-.01 3.06-.06 4.12c-.05 1.06-.22 1.79-.47 2.43a4.9 4.9 0 0 1-1.15 1.77 4.9 4.9 0 0 1-1.77 1.15c-.64.25-1.37.42-2.43.47-1.06.05-1.4.06-4.12.06s-3.06-.01-4.12-.06c-1.06-.05-1.79-.22-2.43-.47a4.9 4.9 0 0 1-1.77-1.15 4.9 4.9 0 0 1-1.15-1.77c-.25-.64-.42-1.37-.47-2.43C2.01 15.06 2 14.72 2 12s.01-3.06.06-4.12c.05-1.06.22-1.79.47-2.43.26-.66.6-1.22 1.15-1.77A4.9 4.9 0 0 1 5.45 2.53c.64-.25 1.37-.42 2.43-.47C8.94 2.01 9.28 2 12 2Zm0 2.16c-2.67 0-2.99.01-4.04.06-.87.04-1.34.18-1.65.3-.42.16-.71.35-1.02.66-.31.31-.5.6-.66 1.02-.12.31-.26.78-.3 1.65-.05 1.05-.06 1.37-.06 4.04s.01 2.99.06 4.04c.04.87.18 1.34.3 1.65.16.42.35.71.66 1.02.31.31.6.5 1.02.66.31.12.78.26 1.65.3 1.05.05 1.37.06 4.04.06s2.99-.01 4.04-.06c.87-.04 1.34-.18 1.65-.3.42-.16.71-.35 1.02-.66.31-.31.5-.6.66-1.02.12-.31.26-.78.3-1.65.05-1.05.06-1.37.06-4.04s-.01-2.99-.06-4.04c-.04-.87-.18-1.34-.3-1.65a2.7 2.7 0 0 0-.66-1.02 2.7 2.7 0 0 0-1.02-.66c-.31-.12-.78-.26-1.65-.3-1.05-.05-1.37-.06-4.04-.06Zm0 3.68a4.16 4.16 0 1 1 0 8.32 4.16 4.16 0 0 1 0-8.32Zm0 6.86a2.7 2.7 0 1 0 0-5.4 2.7 2.7 0 0 0 0 5.4Zm5.3-7.04a.97.97 0 1 1-1.94 0 .97.97 0 0 1 1.94 0Z'
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/',
    path: 'M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.76V21h-4v-5.6c0-1.34-.02-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.96V21h-4V9Z'
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
  const fade = 'linear-gradient(to bottom, #000 62.159%, transparent 100%)';

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
      className="text-[16px] font-light text-nav-muted transition-colors duration-200 hover:text-ink"
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
      <h1 className="text-[clamp(2.75rem,1.8rem+3.9vw,6rem)] font-light leading-[0.885] tracking-[-0.02em]">
        <span className="bg-gradient-to-r from-accent-a via-accent-b via-[17.189%] to-accent-c to-[42.972%] bg-clip-text text-transparent">
          {HEADLINE.accent}
        </span>{' '}
        {HEADLINE.rest}
      </h1>

      <p className="mt-8 max-w-[33rem] text-[16px] font-light leading-[24px] text-muted">{BIO}</p>

      <div className="mt-10 flex flex-wrap items-center gap-4">
        <a
          href="#case-studies"
          className="group inline-flex h-[44px] items-center gap-[6px] rounded-full bg-ink px-7 text-[16px] font-light text-white transition-transform duration-200 hover:-translate-y-0.5"
        >
          Book A Call
          <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
        </a>

        <a
          href="#contact"
          className="group inline-flex items-center gap-[6px] text-[16px] font-light text-ink"
        >
          Get Started
          <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
        </a>
      </div>

      <div className="mt-12">
        <p className="text-[16px] font-light text-ink">Follow me on:</p>
        <ul className="mt-4 flex items-center gap-[14px]">
          {SOCIALS.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                aria-label={s.label}
                target="_blank"
                rel="noreferrer"
                /* Opaque, not a tint: on phones the cutout passes behind this
                   row, and a translucent chip would disappear into her hair. */
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f1f1f3] text-ink ring-1 ring-black/[0.06] transition-colors duration-200 hover:bg-[#e4e4e8]"
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
              <div className="mx-auto hidden w-full max-w-[1314px] items-center justify-center gap-[22px] px-8 md:flex">
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
              className="gpu relative aspect-[624/917] h-[62vh]"
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
              className="gpu relative aspect-[624/917] h-[44vh] sm:h-[62vh] lg:h-[88vh]"
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
              className="gpu block whitespace-nowrap text-[clamp(64px,18.8vw,301px)] font-bold leading-[0.9] tracking-[-0.02em] text-ink"
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
              className="gpu block whitespace-nowrap text-[44px] font-bold leading-[0.9] tracking-[-0.02em] text-ink"
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
              <div className="mx-auto w-full max-w-[1314px] px-6 lg:px-8">
                <HeroCopy />
              </div>
            </div>
          )}
        </AnimatePresence>
      </section>
    </LayoutGroup>
  );
}
