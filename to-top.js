/* ==========================================================================
   Back-to-top button — shared by index.html and the case study
   ==========================================================================
   This used to live inside script.js, sharing one scroll pass with the
   navbar's hide-on-scroll. That coupling was the only thing keeping it off
   the case study, which can't load script.js (no data.js to render from) —
   and the case study is the longest page on the site, the one that actually
   needs the shortcut. So the button moved out here and the navbar kept its
   own pass in script.js; both are rAF-throttled, so the second listener
   costs a comparison per frame, not a layout.

   Requires nothing but a `#toTop` element and the `.to-top` styles in
   styles.css. Pages without the button simply return.
   ========================================================================== */
(function () {
  'use strict';

  var toTop = document.getElementById('toTop');
  if (!toTop) return;

  /* Far enough down that the button is a genuine shortcut, not clutter. */
  var TO_TOP_AFTER = 600;
  var CONFLICT_PAD = 12;
  var ticking = false;

  /* The floating button is parked in the bottom-right corner, which is
     exactly where other CTAs end up as they scroll past — the works
     section's right-ranged "View more projects" and the footer's email/CV
     pair both land under it, two tap targets stacked on the same pixels.
     Rather than guess at safe offsets, the real rects are compared each
     frame and the button stands down while it would sit on top of something
     else clickable.

     The case study has neither of the home page's CTAs, so those halves of
     the selector simply match nothing there and `.cs-back` gets the same
     clearance. */
  var conflicts = document.querySelectorAll('.works-more, .footer-actions, .cs-back');

  function isBlocked() {
    /* `visibility: hidden` still lays the button out, so its box is
       measurable even while it's faded out. */
    var box = toTop.getBoundingClientRect();
    var top = box.top - CONFLICT_PAD;
    var bottom = box.bottom + CONFLICT_PAD;
    var left = box.left - CONFLICT_PAD;
    var right = box.right + CONFLICT_PAD;

    for (var i = 0; i < conflicts.length; i++) {
      var r = conflicts[i].getBoundingClientRect();
      if (r.width === 0 && r.height === 0) continue;
      if (r.left < right && r.right > left && r.top < bottom && r.bottom > top) return true;
    }
    return false;
  }

  function update() {
    ticking = false;
    toTop.classList.toggle('is-visible', window.pageYOffset > TO_TOP_AFTER && !isBlocked());
  }

  function request() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  }

  window.addEventListener('scroll', request, { passive: true });
  /* Rotating a phone re-flows the CTA rows without scrolling, which can move
     one into or out of the button's corner. */
  window.addEventListener('resize', request, { passive: true });

  toTop.addEventListener('click', function () {
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  });

  update();
})();
