/* ==========================================================================
   Motion system — shared timing tokens and one scroll/resize ticker
   ==========================================================================
   Loaded first, before every other script. Two jobs:

   1. TOKENS. The durations and easing curves the site already uses, named
      once so a new animation can pick an existing tier instead of inventing
      a duration. These mirror what was previously hardcoded in styles.css
      and script.js — nothing here changes an existing timing.

   2. ONE TICKER. Scroll-driven work used to be four `scroll` listeners and
      three independent requestAnimationFrame loops (the about-word fade and
      the header in script.js, the back-to-top button in to-top.js). Each
      scheduled its own frame, so a single scroll could schedule three
      callbacks that each measured layout separately.

      Now there is one listener and one frame. Subscribers run in
      registration order inside it, which also means every reader sees the
      same layout state — the reads can no longer interleave with another
      subscriber's writes and force extra layout passes.

   Deliberately not a library. Everything here is a few dozen lines because
   the site's motion is CSS-driven: the only JavaScript animation left is the
   intro morph, which owns its own transition and does not tick.
   ========================================================================== */
(function () {
  'use strict';

  var reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* Duration tiers, matched to interaction weight. Micro feedback has to feel
     instant; a content reveal has room to breathe. Values are the ones
     already in use across styles.css, collected rather than re-tuned. */
  var DUR = {
    micro: 150,    /* hover nudge, press feedback */
    ui: 250,       /* drawer, button state */
    reveal: 600,   /* scroll-in content */
    entrance: 860, /* the works frame wipe */
    hero: 900      /* the intro morph flight */
  };

  /* Two curves, used consistently:
     - `exit` (expo-out) for anything arriving on screen — a fast start that
       settles gently, which is what makes a reveal read as "placed" rather
       than "slid".
     - `soft` for the intro morph, a shade less aggressive so a long flight
        doesn't decelerate to a visible crawl at the end. */
  var EASE = {
    exit: 'cubic-bezier(0.16, 1, 0.3, 1)',
    soft: 'cubic-bezier(0.22, 1, 0.36, 1)'
  };

  var readers = [];
  var queued = false;

  function frame() {
    queued = false;
    /* One shared scroll offset: subscribers that only need the position no
       longer each read pageYOffset (and the viewport height) themselves. */
    var y = window.pageYOffset;
    var vh = window.innerHeight || document.documentElement.clientHeight;
    for (var i = 0; i < readers.length; i++) readers[i](y, vh);
  }

  function request() {
    if (queued) return;
    queued = true;
    window.requestAnimationFrame(frame);
  }

  window.SiteMotion = {
    DUR: DUR,
    EASE: EASE,

    /* Live, not a snapshot: the OS setting can change mid-session and
       callers re-check on each use. */
    get reduced() {
      return reduceQuery.matches;
    },

    /* Coarse pointer = touch. Used to skip hover-dependent work and to
       shorten travel distances on phones, where a large translate costs more
       to composite and reads as further because the viewport is smaller. */
    get touch() {
      return window.matchMedia('(hover: none), (pointer: coarse)').matches;
    },

    /* Subscribe to the shared frame. Returns an unsubscribe function.
       The callback receives (scrollY, viewportHeight) and must only READ
       layout at the top and WRITE after — the usual rule, but it matters
       more here because the readers share a frame. */
    onFrame: function (fn) {
      readers.push(fn);
      request();
      return function () {
        var i = readers.indexOf(fn);
        if (i !== -1) readers.splice(i, 1);
      };
    },

    /* Force a pass — for callers that change layout themselves (opening the
       mobile drawer) and need the shared readers to re-evaluate. */
    refresh: request
  };

  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', request, { passive: true });
  /* Late-loading images change the document height, which moves every
     scroll-linked threshold under it. */
  window.addEventListener('load', request);
})();
