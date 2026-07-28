"use client";

/**
 * HeroBuildUp — a self-contained "website building itself" hero animation.
 *
 * Sequence (auto-plays on mount, optionally loops):
 *   1. Big centered "Rakhi.UX" wordmark with the grayscale portrait overlapping it.
 *   2. Wordmark shrinks into the navbar; nav links fade in beside it.
 *   3. Hero heading reveals line by line (gradient line, then dark line).
 *   4. Paragraph → CTA buttons → social icons stagger in.
 *   5. Portrait settles into the right-hand column with a faded bottom edge.
 *   6. "About Me" peeks in from below: colored-word heading, copy, a "Know
 *      More" CTA, a reused-portrait banner, then a 4-up stats row.
 *
 * Requirements: react, framer-motion, lucide-react, tailwindcss.
 *   npm i framer-motion lucide-react
 *
 * IMAGE: expects a background-free portrait at `public/rakhi-portrait-cutout.png`
 * so the wordmark stays readable where she overlaps it during the splash. A
 * portrait on a solid white backdrop will punch a visible rectangle out of the
 * letters instead. `public/make-cutout.cjs` generates the cutout from the
 * original: `node public/make-cutout.cjs public/rakhi-portrait.png public/rakhi-portrait-cutout.png`
 *
 * ANIMATION NOTE: the wordmark and the portrait are each a *single* node that
 * stays mounted for the whole sequence and animates via `layout`. Do not split
 * them into two nodes joined by `layoutId` — that crossfades between two very
 * differently sized elements and shows a pale ghost mid-flight.
 *
 * ANIMATION NOTE 2: never put a Tailwind transform utility (`-translate-x-1/2`,
 * `scale-*`, `rotate-*`) on a `motion.*` element. Framer writes its own inline
 * `transform` and silently overrides the class, which knocks the element off
 * position. Centre with `mx-auto` / `inset-x-0` instead.
 */

import { useEffect, useState, type ComponentType } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";

/* -------------------------------------------------------------------------- */
/* Content                                                                     */
/* -------------------------------------------------------------------------- */

const NAV_LEFT = ["Meet Rakhi", "Book online"];
const NAV_RIGHT = ["Photo Gallery", "Contact"];

/* -------------------------------------------------------------------------- */
/* Brand icons                                                                 */
/*                                                                             */
/* lucide-react removed every brand icon in v1 — there is no Facebook /        */
/* Instagram / Linkedin / Twitter export any more, and importing one throws at  */
/* module load. The social glyphs are inlined; lucide still supplies the arrows.*/
/* -------------------------------------------------------------------------- */

type IconProps = { className?: string };

function XMark({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookMark({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M14.02 21.5v-8.19h2.74l.41-3.19h-3.15V8.08c0-.92.26-1.55 1.58-1.55h1.68V3.68c-.29-.04-1.29-.13-2.45-.13-2.43 0-4.09 1.48-4.09 4.21v2.36H7.99v3.19h2.75v8.19h3.28z" />
    </svg>
  );
}

function InstagramMark({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <rect x="2.75" y="2.75" width="18.5" height="18.5" rx="5.25" />
      <circle cx="12" cy="12" r="4.1" />
      <circle cx="17.3" cy="6.7" r="1.05" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedInMark({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M6.94 8.98H3.56V21h3.38V8.98zM5.25 3.2a1.96 1.96 0 1 0 0 3.92 1.96 1.96 0 0 0 0-3.92zM21 14.42c0-3.2-.69-5.51-4.42-5.51-1.8 0-3 .95-3.49 1.9h-.05V8.98H9.83V21h3.37v-5.95c0-1.57.3-3.08 2.24-3.08 1.91 0 1.94 1.79 1.94 3.18V21H21v-6.58z" />
    </svg>
  );
}

const SOCIALS: { label: string; Icon: ComponentType<IconProps>; href: string }[] = [
  { label: "X", Icon: XMark, href: "#" },
  { label: "Facebook", Icon: FacebookMark, href: "#" },
  { label: "Instagram", Icon: InstagramMark, href: "#" },
  { label: "LinkedIn", Icon: LinkedInMark, href: "#" },
];

/* -------------------------------------------------------------------------- */
/* Motion                                                                      */
/* -------------------------------------------------------------------------- */

const EASE_OUT = "easeOut" as const;

/**
 * The wordmark / portrait flight from splash to final position. Wants an ease
 * that commits early — a symmetric easeInOut reads as "stuck" for the first
 * third of the move at this distance.
 */
const MORPH = { duration: 0.85, ease: [0.22, 1, 0.36, 1] as const };

/** Parent that releases its children one after another. */
const stagger: Variants = {
  hidden: {},
  show: { transition: { delayChildren: 0.3, staggerChildren: 0.15 } },
};

/** Standard step: fade up. */
const rise: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_OUT } },
};

/** CTA buttons scale in rather than slide. */
const pop: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.94 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: EASE_OUT } },
};

/** Heading lines: masked wipe from below. */
const lineWipe: Variants = {
  hidden: { y: "110%" },
  show: { y: "0%", transition: { duration: 0.6, ease: EASE_OUT } },
};

const socialsGroup: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.09 } } };

const socialItem: Variants = {
  hidden: { opacity: 0, y: 12, scale: 0.7 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: EASE_OUT } },
};

/** About section: same stagger family, its own delayChildren so it kicks off
 *  once the section itself has finished peeking in from below. */
const aboutStagger: Variants = {
  hidden: {},
  show: { transition: { delayChildren: 0.25, staggerChildren: 0.12 } },
};

const statsGroup: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };

const statItem: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT } },
};

const ABOUT_STATS = [
  { number: "20+", label: "Books Published" },
  { number: "100+", label: "Seminars" },
  { number: "30+", label: "TV Shows" },
  { number: "15+", label: "Years Of Experience" },
];

/* -------------------------------------------------------------------------- */
/* Component                                                                   */
/* -------------------------------------------------------------------------- */

export type HeroBuildUpProps = {
  /** Background-free portrait. See IMAGE note at the top of the file. */
  photoSrc?: string;
  /** Where the wordmark lands. `center` matches the reference navbar. */
  logoPosition?: "center" | "left";
  /** How long the oversized wordmark holds before collapsing, in ms. */
  splashDuration?: number;
  /** Replay the whole build-up forever. */
  loop?: boolean;
  /** Pause at the end of a cycle before replaying, in ms. Only used with `loop`. */
  loopDelay?: number;
};

export default function HeroBuildUp({
  photoSrc = "/rakhi-portrait-cutout.png",
  logoPosition = "center",
  splashDuration = 1700,
  loop = false,
  loopDelay = 6500,
}: HeroBuildUpProps) {
  const reduceMotion = useReducedMotion();
  const [built, setBuilt] = useState(false);
  // Bumping the cycle replays every variant.
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (reduceMotion) {
      setBuilt(true);
      return;
    }

    setBuilt(false);
    const timers = [setTimeout(() => setBuilt(true), splashDuration)];
    if (loop) {
      timers.push(setTimeout(() => setCycle((c) => c + 1), splashDuration + loopDelay));
    }
    return () => timers.forEach(clearTimeout);
  }, [cycle, loop, loopDelay, reduceMotion, splashDuration]);

  const runtime = built ? "show" : "hidden";
  const logoLeft = logoPosition === "left";

  /**
   * Gentle bottom fade. The supplied portrait already dissolves at the hem, so a
   * steeper ramp here would clip the jacket twice.
   */
  const fadeBottom = {
    WebkitMaskImage:
      "linear-gradient(to bottom, #000 0%, #000 86%, rgba(0,0,0,0.5) 95%, transparent 100%)",
    maskImage:
      "linear-gradient(to bottom, #000 0%, #000 86%, rgba(0,0,0,0.5) 95%, transparent 100%)",
  } as const;

  return (
    <div
      key={cycle}
      className="relative min-h-screen w-full bg-white text-neutral-900 antialiased"
      style={{ fontFamily: "'Poppins', ui-sans-serif, system-ui, sans-serif" }}
    >
      {/* No white "curtain" element here on purpose. Every built-page element
          starts at opacity 0, so the page is already blank during the splash —
          and an overlay would sit ABOVE the header once it drops to z-30 on
          build, washing the wordmark out to grey exactly as it takes flight. */}

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* Navbar ------------------------------------------------------------ */}
        <header
          className={
            built
              ? `relative z-30 flex items-center py-6 ${
                  logoLeft ? "justify-between" : "justify-center gap-6 lg:gap-10"
                }`
              : "fixed inset-0 z-50 flex items-start justify-center pt-[26vh]"
          }
        >
          {/* Left links. Absolute during the splash so they contribute no width
              and cannot shove the centred wordmark off-axis. Omitted entirely in
              `left` mode — an empty <nav> still claims a `justify-between` slot
              and would push the wordmark away from the edge. */}
          {!logoLeft && (
            <motion.nav
              initial={false}
              animate={{ opacity: built ? 1 : 0 }}
              transition={{ duration: 0.45, ease: EASE_OUT, delay: built ? 0.45 : 0 }}
              className={`items-center gap-8 text-sm text-neutral-500 ${
                built ? "hidden md:flex" : "pointer-events-none absolute opacity-0"
              }`}
            >
              {NAV_LEFT.map((item) => (
                <a key={item} href="#" className="transition-colors hover:text-neutral-900">
                  {item}
                </a>
              ))}
            </motion.nav>
          )}

          <motion.a
            href="#"
            layout
            transition={MORPH}
            className={`z-50 whitespace-nowrap font-extrabold leading-none tracking-tight ${
              built ? "text-2xl sm:text-3xl" : "text-[clamp(3.25rem,18vw,17rem)]"
            }`}
          >
            Rakhi.UX
          </motion.a>

          <motion.nav
            initial={false}
            animate={{ opacity: built ? 1 : 0 }}
            transition={{ duration: 0.45, ease: EASE_OUT, delay: built ? 0.55 : 0 }}
            className={`items-center gap-8 text-sm text-neutral-500 ${
              built ? "hidden md:flex" : "pointer-events-none absolute opacity-0"
            }`}
          >
            {(logoLeft ? [...NAV_LEFT, ...NAV_RIGHT] : NAV_RIGHT).map((item) => (
              <a key={item} href="#" className="transition-colors hover:text-neutral-900">
                {item}
              </a>
            ))}
          </motion.nav>
        </header>

        {/* Hero -------------------------------------------------------------- */}
        <section className="relative grid items-center gap-10 pb-16 pt-6 lg:grid-cols-[minmax(0,1fr)_26rem] lg:gap-6 lg:pb-24 lg:pt-10">
          <motion.div variants={stagger} initial="hidden" animate={runtime}>
            {/* Heading: masked line-by-line reveal. The wrappers need vertical
                slack or the descenders in "Daily Journey." get sheared off. */}
            <motion.h2
              variants={stagger}
              className="text-[clamp(2.5rem,7vw,4.5rem)] font-bold leading-[1.05] tracking-tight"
            >
              <span className="block overflow-hidden py-[0.12em]">
                <motion.span variants={lineWipe} className="block">
                  <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
                    Revitalize
                  </span>{" "}
                  Your
                </motion.span>
              </span>
              <span className="block overflow-hidden py-[0.12em]">
                <motion.span variants={lineWipe} className="block text-neutral-900">
                  Daily Journey.
                </motion.span>
              </span>
            </motion.h2>

            <motion.p
              variants={rise}
              className="mt-6 max-w-xl text-base leading-relaxed text-neutral-500"
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero
              et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosqu ad
              litora torquent per conubia nostra.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={stagger} className="mt-9 flex flex-wrap items-center gap-6">
              <motion.a
                variants={pop}
                href="#"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="group inline-flex items-center gap-2 rounded-full bg-neutral-900 px-7 py-3.5 text-sm font-medium text-white shadow-lg shadow-neutral-900/15 transition-shadow hover:shadow-xl hover:shadow-neutral-900/25"
              >
                Book A Call
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </motion.a>

              <motion.a
                variants={pop}
                href="#"
                className="group inline-flex items-center gap-2 text-sm font-medium text-neutral-900"
              >
                Get Started
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </motion.a>
            </motion.div>

            {/* Socials */}
            <motion.div variants={rise} className="mt-12">
              <p className="text-sm font-medium text-neutral-900">Follow me on:</p>
              <motion.ul variants={socialsGroup} className="mt-4 flex items-center gap-3">
                {SOCIALS.map(({ label, Icon, href }) => (
                  <motion.li key={label} variants={socialItem}>
                    <a
                      href={href}
                      aria-label={label}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-800 shadow-sm transition-colors hover:bg-neutral-900 hover:text-white"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          </motion.div>

          {/* Portrait — ONE node for the whole sequence. During the splash it goes
              `fixed` and centres itself over the wordmark; on build it drops back
              into this grid cell and `layout` flies it across. */}
          <motion.div
            layout
            transition={MORPH}
            style={fadeBottom}
            className={
              built
                ? "relative z-10 mx-auto h-[22rem] w-full max-w-sm sm:h-[28rem] lg:h-[34rem] lg:max-w-none"
                : "fixed inset-x-0 top-[15vh] z-50 mx-auto h-[min(72vh,34rem)] w-[min(52vw,21rem)]"
            }
          >
            <img
              src={photoSrc}
              alt="Rakhi Das, UI/UX Designer"
              className="h-full w-full object-contain object-bottom grayscale"
            />
          </motion.div>
        </section>

        {/* About Me · peeks in from below ------------------------------------ */}
        <motion.section
          initial={{ opacity: 0, y: 64 }}
          animate={built ? { opacity: 1, y: 0 } : { opacity: 0, y: 64 }}
          transition={{ duration: 0.6, ease: EASE_OUT, delay: built ? 1.6 : 0 }}
          className="relative z-20 border-t border-neutral-200 bg-white py-14 lg:py-20"
        >
          <motion.div variants={aboutStagger} initial="hidden" animate={runtime}>
            <motion.p
              variants={rise}
              className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-400"
            >
              About Me
            </motion.p>

            <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:gap-16">
              <motion.h3
                variants={rise}
                className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl"
              >
                Embark on a Voyage Through My{" "}
                <span className="text-orange-500">Creative</span>{" "}
                <span className="text-violet-600">Universe</span>
              </motion.h3>

              <motion.div variants={rise} className="space-y-5 text-base leading-relaxed text-neutral-500">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate
                  libero et velit interdum, ac aliquet odio mattis. Class aptent taciti
                  sociosqu ad litora torquent per conubia nostra,
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate
                  libero et velit interdum, ac aliquet odio mattis. Class aptent taciti
                  sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.
                  Curabitur tempus urna at turpis condimentum lobortis.
                </p>
              </motion.div>
            </div>

            <motion.a
              variants={rise}
              href="#"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="group mt-6 inline-flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-neutral-900/15 transition-shadow hover:shadow-xl hover:shadow-neutral-900/25"
            >
              Know More
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </motion.a>

            {/* Banner: the same portrait reused on a soft gradient panel — there is
                no second, landscape "workspace" photo asset, so her cutout is
                re-composited here rather than substituting a stock image. */}
            <motion.div
              variants={rise}
              className="relative mt-10 h-64 overflow-hidden rounded-3xl bg-gradient-to-br from-purple-100 via-pink-50 to-orange-100 sm:h-80 lg:h-96"
            >
              <img
                src={photoSrc}
                alt=""
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 mx-auto h-full w-auto object-contain object-bottom grayscale"
              />
            </motion.div>

            <motion.div
              variants={statsGroup}
              className="mt-10 grid grid-cols-2 gap-8 sm:grid-cols-4 lg:mt-14"
            >
              {ABOUT_STATS.map(({ number, label }) => (
                <motion.div key={label} variants={statItem}>
                  <p className="text-4xl font-bold tracking-tight text-neutral-300 sm:text-5xl">
                    {number}
                  </p>
                  <p className="mt-2 text-sm text-neutral-500">{label}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.section>
      </div>
    </div>
  );
}
