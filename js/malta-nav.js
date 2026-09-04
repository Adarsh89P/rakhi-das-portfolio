/* ==========================================================================
   MALTA TAXI — rail, chips, progress, and the card tilt
   ==========================================================================
   Three jobs on one shared frame:

     1. Mark the section being read, in both the desktop rail and the mobile
        chip strip, and keep the active chip scrolled into view.
     2. Drive the reading-progress hairline under the top bar.
     3. Resolve the pointer against each card's own box, so the tilt and the
        specular sweep in malta-case.css have a centre to work from.

   Same contract as banking-nav.js: everything subscribes to
   window.SiteMotion.onFrame rather than adding its own scroll listener, and
   section geometry is measured on reflow, never per frame.

   The WebGL scene and the page-level `--mx`/`--my` live in malta-3d.js,
   which is a module and may never execute. Nothing here depends on it: the
   rail, the progress bar and the tilt all work on their own.
   ========================================================================== */
(function () {
  'use strict';

  var motion = window.SiteMotion;
  if (!motion) return;

  function slice(list) {
    return Array.prototype.slice.call(list);
  }

  function clamp01(n) {
    return n < 0 ? 0 : n > 1 ? 1 : n;
  }

  /* ----------------------------------------------------------------------
     1 + 2. Scrollspy and progress
     ---------------------------------------------------------------------- */
  var rail = document.getElementById('mRail');
  var chipBar = document.getElementById('mChips');
  var progress = document.getElementById('mProgress');

  var railLinks = rail ? slice(rail.querySelectorAll('.m-rail-link')) : [];
  var chips = chipBar ? slice(chipBar.querySelectorAll('.m-chip')) : [];
  var chipScroll = chipBar ? chipBar.querySelector('.m-chips-scroll') : null;

  /* The markup is the single source of truth for which sections exist: add a
     link and the section is tracked, with no list to keep in step here. */
  var source = railLinks.length ? railLinks : chips;
  var sections = [];

  source.forEach(function (link) {
    var id = (link.getAttribute('href') || '').replace(/^#/, '');
    var el = id && document.getElementById(id);
    if (!el) return;
    sections.push({
      el: el,
      top: 0,
      rail: rail ? rail.querySelector('.m-rail-link[href="#' + id + '"]') : null,
      chip: chipBar ? chipBar.querySelector('.m-chip[href="#' + id + '"]') : null
    });
  });

  var activeIndex = -1;
  var docHeight = 0;
  var offset = 0;

  function measureSections() {
    var top = document.querySelector('.m-top');
    /* A section counts as "reached" once its heading clears the sticky
       chrome, not once its box touches y = 0 — otherwise the mark jumps a
       section early on every page that has a sticky bar. */
    offset = (top ? top.offsetHeight : 0) + 24;

    for (var i = 0; i < sections.length; i++) {
      var box = sections[i].el.getBoundingClientRect();
      sections[i].top = box.top + window.pageYOffset;
    }

    /* Sorted by position, every time. The loop in onFrame takes the LAST
       section whose top has passed the reading line, which is only correct
       while the array is in ascending order — and nothing guarantees the
       rail lists its links in the same order the sections appear. (It did
       not, once: a Solution link sat between Needs and Palette while its
       box was 700px above Needs, and the rail read "Solution" for the whole
       middle of the page.) Each entry carries its own rail and chip
       elements, so reordering the array costs nothing and makes the markup
       order un-break-able from here on. */
    sections.sort(function (a, b) { return a.top - b.top; });

    docHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    );
  }

  function setActive(index) {
    if (index === activeIndex) return;

    if (sections[activeIndex]) {
      if (sections[activeIndex].rail) sections[activeIndex].rail.classList.remove('is-active');
      if (sections[activeIndex].chip) sections[activeIndex].chip.classList.remove('is-active');
    }

    activeIndex = index;
    var next = sections[index];
    if (!next) return;

    if (next.rail) next.rail.classList.add('is-active');
    if (next.chip) {
      next.chip.classList.add('is-active');
      keepChipVisible(next.chip);
    }
  }

  /* An indicator you cannot see is not an indicator: the active chip is
     pulled into the middle of the horizontal strip when it lands outside. */
  function keepChipVisible(chip) {
    if (!chipScroll) return;
    var stripLeft = chipScroll.scrollLeft;
    var stripRight = stripLeft + chipScroll.clientWidth;
    var chipLeft = chip.offsetLeft;
    var chipRight = chipLeft + chip.offsetWidth;

    if (chipLeft < stripLeft + 12 || chipRight > stripRight - 12) {
      var target = chipLeft - (chipScroll.clientWidth - chip.offsetWidth) / 2;
      if (chipScroll.scrollTo) {
        chipScroll.scrollTo({ left: target, behavior: motion.reduced ? 'auto' : 'smooth' });
      } else {
        chipScroll.scrollLeft = target;
      }
    }
  }

  /* ----------------------------------------------------------------------
     3. Card tilt
     ----------------------------------------------------------------------
     `--cx` / `--cy` are the pointer's position INSIDE the card, 0..1. The
     CSS turns them into a rotation and a light position; this file only
     supplies the two numbers.

     Delegated to the grid rather than bound per card, so a card added to the
     markup later tilts with no change here. Gated behind a fine pointer,
     because a touch device has no hover to resolve and would leave the last
     touched card frozen mid-tilt.

     Nothing is written on pointerleave: the values are only ever read while
     the card matches `:hover` or `:focus-within`, and the CSS returns it to
     flat with its own transition when it stops matching. Resetting them
     would fight that transition, not help it. */
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (fine && !motion.reduced) {
    slice(document.querySelectorAll('.m-grid')).forEach(function (grid) {
      grid.addEventListener('pointermove', function (e) {
        var card = e.target.closest ? e.target.closest('.m-card') : null;
        if (!card || !grid.contains(card)) return;

        var box = card.getBoundingClientRect();
        card.style.setProperty('--cx', ((e.clientX - box.left) / box.width).toFixed(3));
        card.style.setProperty('--cy', ((e.clientY - box.top) / box.height).toFixed(3));
      }, { passive: true });
    });
  }

  /* ----------------------------------------------------------------------
     The shared frame
     ---------------------------------------------------------------------- */
  function onFrame(y, vh) {
    if (sections.length) {
      var line = y + offset;
      var index = 0;
      for (var i = 0; i < sections.length; i++) {
        if (sections[i].top <= line) index = i;
      }

      /* At the very bottom the last section may be too short to ever cross
         the line — mark it anyway, or the final entry never lights up. */
      if (y + vh >= docHeight - 2) index = sections.length - 1;
      setActive(index);
    }

    if (progress) {
      var scrollable = docHeight - vh;
      progress.style.setProperty('--m-read', scrollable > 0 ? String(clamp01(y / scrollable)) : '0');
    }
  }

  measureSections();
  motion.onFrame(onFrame);

  /* Geometry changes on reflow, not on scroll. Late images are the common
     case: they change the document height and move every threshold under
     them. */
  var reflowTimer = 0;
  function reflow() {
    window.clearTimeout(reflowTimer);
    reflowTimer = window.setTimeout(function () {
      measureSections();
      activeIndex = -1;
      motion.refresh();
    }, 120);
  }

  window.addEventListener('resize', reflow, { passive: true });
  window.addEventListener('orientationchange', reflow);
  window.addEventListener('load', reflow);
})();
