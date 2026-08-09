/* ==========================================================================
   Scroll reveal — shared by index.html and the case study
   ==========================================================================
   Fade-up-on-enter for the page's content blocks. Previously this lived at
   the bottom of script.js and covered four selectors on the home page only;
   the case study never loaded script.js, so it had no reveals at all. It is
   its own file now because that is the only thing both pages need to share
   — script.js also renders the home page from data.js and would throw here.

   Load order matters: this must run *after* script.js, because most of the
   home page's reveal targets don't exist in the markup — they're built from
   data.js. Both are plain <script> tags at the end of <body>, so they run in
   order.

   Deliberately not in the list:
     - the hero and the navbar, which already have the intro morph's own
       entrance and would fight it for the same properties;
     - .footer-watermark, which is absolutely positioned by a transform of
       its own that this would overwrite.
   ========================================================================== */
(function () {
  'use strict';

  /* One list covering both pages. The two sets of class names don't overlap,
     so the selectors for the other page simply match nothing. */
  var SELECTOR = [
    /* --- home page --- */
    '.eyebrow-rule',
    /* .about-lead / .about-line are deliberately absent: their words are
       faded individually by initAboutFade in script.js, and a block-level
       fade on the same element would fight it for opacity. */
    '.works-head',
    '.works-more',
    /* A work item opts out of the fade-and-lift below (see styles.css) and
       uses `.in-view` purely as the cue to start its own entrance — the
       frame wipe, the artwork's blur settle and the copy stagger. */
    '.work-item',
    '.experience-heading',
    '.exp-card',
    '.testimonials-head',
    '.testimonial-card',
    '.gallery-head',
    '.gallery-tile',

    /* --- case study --- */
    '.cs-back',
    '.cs-hero-title',
    '.cs-hero-sub',
    '.cs-tags',
    '.cs-eyebrow',
    '.cs-heading',
    '.cs-body',
    '.cs-lead',
    '.cs-list li',
    '.cs-figure',
    '.cs-role',
    '.cs-ba-card',
    '.cs-thanks',

    /* --- footer, on both pages --- */
    '.footer-intro',
    '.footer-actions',
    '.footer-social',
    '.footer-bottom'
  ].join(',');

  /* Containers whose children lie *outside* the viewport by design. A
     marquee track is a carousel: its cards are laid out in a row thousands
     of pixels wide inside an `overflow: hidden` box, so only the first few
     are ever within the viewport. Observing each card against the viewport
     means the rest never intersect, never get `.in-view`, and stay at
     opacity 0 for good — click the carousel's next arrow on the current
     site and the cards you page to are blank. (That bug predates this file;
     the old four-selector version had the same problem.)

     The fix is to trigger those children off their container instead: when
     the track comes into view, everything inside it reveals, wherever it
     happens to sit on the horizontal axis. */
  var GROUP_SELECTOR = '.marquee-track';

  var REVEAL_MS = 600; /* keep in step with the [data-reveal] transition */
  var STAGGER_MS = 60;
  var STAGGER_CAP = 240; /* a long list shouldn't trail in for two seconds */

  var targets = Array.prototype.slice.call(document.querySelectorAll(SELECTOR));
  if (!targets.length) return;

  targets.forEach(function (target) {
    target.setAttribute('data-reveal', '');
  });

  /* Nothing to animate: show everything as it is and leave. Covers both the
     reduced-motion request and any browser without IntersectionObserver —
     in either case the content must end up visible, never stuck at 0. */
  if (
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    !('IntersectionObserver' in window)
  ) {
    targets.forEach(function (target) {
      target.classList.add('in-view');
    });
    return;
  }

  /* Siblings come in one after another rather than as a block. querySelectorAll
     returns document order, so same-parent targets are always contiguous —
     tracking the current run is enough, no grouping pass needed. */
  var runParent = null;
  var runIndex = 0;

  /* One record per target: the element, its stagger delay, and the element
     whose arrival should trigger it — itself, or the group container it
     sits inside. */
  var items = targets.map(function (target) {
    if (target.parentNode === runParent) {
      runIndex += 1;
    } else {
      runParent = target.parentNode;
      runIndex = 0;
    }

    var delay = Math.min(runIndex * STAGGER_MS, STAGGER_CAP);
    if (delay) target.style.transitionDelay = delay + 'ms';

    return {
      el: target,
      delay: delay,
      trigger: target.closest(GROUP_SELECTOR) || target
    };
  });

  var triggers = [];
  items.forEach(function (item) {
    if (triggers.indexOf(item.trigger) === -1) triggers.push(item.trigger);
  });

  function reveal(item) {
    item.el.classList.add('in-view');

    /* The stagger delay has done its job once the element has arrived, and it
       has to come back off: `transition-delay` is not property-specific, so
       leaving it set would also delay the element's *hover* transition by up
       to 240ms — .exp-card's lift and .btn's nudge would both feel broken.
       Cleared a beat after the reveal finishes. */
    if (!item.delay) return;
    window.setTimeout(function () {
      item.el.style.transitionDelay = '';
    }, item.delay + REVEAL_MS + 50);
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);

      items.forEach(function (item) {
        if (item.trigger === entry.target) reveal(item);
      });
    });
  }, { threshold: 0.12 });

  triggers.forEach(function (trigger) {
    observer.observe(trigger);
  });
})();
