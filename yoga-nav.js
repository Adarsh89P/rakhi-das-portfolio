/* ==========================================================================
   YOGA CASE STUDY — index rail, chip strip and reading progress
   ==========================================================================
   Three jobs, one shared frame:

     1. Mark the section currently being read in both the desktop rail and
        the mobile chip strip.
     2. Keep the active chip scrolled into view in the horizontal strip —
        an indicator you cannot see is not an indicator.
     3. Drive the hairline progress bar under the top bar.

   Everything subscribes to window.SiteMotion.onFrame rather than adding its
   own scroll listener, so the whole page still costs exactly one listener
   and one rAF. Section geometry is measured on resize, never per frame:
   reading offsetTop inside the scroll handler would force a layout on every
   tick for values that only change when the page reflows.
   ========================================================================== */
(function () {
  'use strict';

  var rail = document.getElementById('yRail');
  var chipBar = document.getElementById('yChips');
  var progress = document.getElementById('yProgress');
  if (!rail && !chipBar && !progress) return;

  var railLinks = rail ? slice(rail.querySelectorAll('.y-rail-link')) : [];
  var chips = chipBar ? slice(chipBar.querySelectorAll('.y-chip')) : [];
  var chipScroll = chipBar ? chipBar.querySelector('.y-chips-scroll') : null;

  function slice(list) {
    return Array.prototype.slice.call(list);
  }

  /* Build the section list from the rail (or the chips, if the rail is
     absent) so the markup stays the single source of truth: adding a
     section to the page means adding one link, not editing this file. */
  var source = railLinks.length ? railLinks : chips;
  var sections = [];
  source.forEach(function (link) {
    var id = (link.getAttribute('href') || '').replace(/^#/, '');
    var el = id && document.getElementById(id);
    if (!el) return;
    sections.push({
      id: id,
      el: el,
      top: 0,
      rail: rail ? rail.querySelector('.y-rail-link[href="#' + id + '"]') : null,
      chip: chipBar ? chipBar.querySelector('.y-chip[href="#' + id + '"]') : null
    });
  });
  if (!sections.length && !progress) return;

  /* ---- Geometry -------------------------------------------------------
     `offset` is how far above a section's top the marker should flip. The
     sticky bars occupy the top of the viewport, so a section is "current"
     once its heading clears them, not once its box touches y=0. */
  var offset = 0;
  var docHeight = 0;

  function measure() {
    var top = document.querySelector('.y-top');
    var barH = top ? top.offsetHeight : 58;
    /* Below 1024 the chip strip stacks under the top bar and takes its own
       height out of the readable area. offsetParent is null when it is
       display:none, which is the cheapest way to ask "is it showing?". */
    var chipsH = chipBar && chipBar.offsetParent ? chipBar.offsetHeight : 0;
    offset = barH + chipsH + 24;

    for (var i = 0; i < sections.length; i++) {
      sections[i].top = sections[i].el.getBoundingClientRect().top + window.pageYOffset;
    }

    docHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    );
  }

  /* ---- Active marker --------------------------------------------------- */
  var current = -1;

  function setActive(index) {
    if (index === current) return;
    current = index;

    for (var i = 0; i < sections.length; i++) {
      var on = i === index;
      var s = sections[i];
      if (s.rail) {
        s.rail.classList.toggle('is-active', on);
        /* aria-current is the part a screen reader actually announces;
           the class is only paint. */
        if (on) s.rail.setAttribute('aria-current', 'true');
        else s.rail.removeAttribute('aria-current');
      }
      if (s.chip) {
        s.chip.classList.toggle('is-active', on);
        if (on) s.chip.setAttribute('aria-current', 'true');
        else s.chip.removeAttribute('aria-current');
      }
    }

    if (index >= 0) keepChipVisible(sections[index].chip);
  }

  /* Scroll the strip, not the page. `scrollIntoView` would scroll every
     scrollable ancestor including the document, yanking the reader away
     from what they were reading. */
  function keepChipVisible(chip) {
    if (!chip || !chipScroll || !chipScroll.offsetParent) return;

    /* Measured from viewport rects rather than offsetLeft. The strip's
       offsetParent is the sticky wrapper, not the scroll box, so offsetLeft
       is in a different coordinate space than scrollLeft and the two cannot
       be compared directly — that mismatch left the active chip half off
       the right edge. Rect deltas are unambiguous. */
    var pad = 16;
    var sb = chipScroll.getBoundingClientRect();
    var cb = chip.getBoundingClientRect();

    var delta = 0;
    if (cb.left < sb.left + pad) delta = cb.left - sb.left - pad;
    else if (cb.right > sb.right - pad) delta = cb.right - sb.right + pad;
    if (!delta) return;

    var next = chipScroll.scrollLeft + delta;
    var max = chipScroll.scrollWidth - chipScroll.clientWidth;
    if (next < 0) next = 0;
    else if (next > max) next = max;

    if (window.SiteMotion && window.SiteMotion.reduced) chipScroll.scrollLeft = next;
    else if (chipScroll.scrollTo) chipScroll.scrollTo({ left: next, behavior: 'smooth' });
    else chipScroll.scrollLeft = next;
  }

  /* ---- Progress ---------------------------------------------------------
     Quantised to 1/500ths. Writing a fresh transform on every pixel of
     scroll is a style recalculation nobody can see; 500 steps is finer than
     the bar is wide on any display it will meet. */
  var lastStep = -1;

  function setProgress(y, vh) {
    if (!progress) return;
    var scrollable = docHeight - vh;
    var ratio = scrollable > 0 ? y / scrollable : 0;
    if (ratio < 0) ratio = 0;
    else if (ratio > 1) ratio = 1;

    var step = Math.round(ratio * 500);
    if (step === lastStep) return;
    lastStep = step;
    progress.style.transform = 'scaleX(' + (step / 500) + ')';
  }

  /* ---- Frame ----------------------------------------------------------- */
  function onFrame(y, vh) {
    setProgress(y, vh);

    if (!sections.length) return;

    var line = y + offset;
    var index = -1;
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].top <= line) index = i;
      else break;
    }

    /* At the very bottom the last section may be too short to ever cross
       the line — a reader who has hit the end is unambiguously in it. */
    if (docHeight - (y + vh) < 4) index = sections.length - 1;

    setActive(index);
  }

  measure();
  if (window.SiteMotion) {
    window.SiteMotion.onFrame(onFrame);
  } else {
    /* motion.js missing is not a reason for the page to lose its nav. */
    window.addEventListener('scroll', function () {
      onFrame(window.pageYOffset, window.innerHeight);
    }, { passive: true });
    onFrame(window.pageYOffset, window.innerHeight);
  }

  /* Re-measure on anything that can move a section: viewport changes and
     images arriving late (every figure here is lazy-loaded, so the document
     grows for a while after first paint). */
  var reflow = debounce(function () {
    measure();
    current = -1; /* force the marker to re-evaluate against new offsets */
    if (window.SiteMotion) window.SiteMotion.refresh();
    else onFrame(window.pageYOffset, window.innerHeight);
  }, 120);

  window.addEventListener('resize', reflow, { passive: true });
  window.addEventListener('orientationchange', reflow);
  window.addEventListener('load', reflow);

  if (window.ResizeObserver) {
    var ro = new ResizeObserver(reflow);
    ro.observe(document.body);
  }

  function debounce(fn, wait) {
    var t;
    return function () {
      clearTimeout(t);
      t = setTimeout(fn, wait);
    };
  }
})();
