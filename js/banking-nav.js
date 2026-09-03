/* ==========================================================================
   BANKING CASE STUDY — rail, chips, progress, and the two scroll mechanics
   ==========================================================================
   Four jobs, one shared frame:

     1. Mark the section being read, in both the desktop rail and the mobile
        chip strip, and keep the active chip scrolled into view.
     2. Drive the reading-progress hairline under the top bar.
     3. Raise the hero device as the hero scrolls (`--b-rise`, 0 to 1).
     4. Mark the live step in the sticky flow, and swap the pinned device's
        screen to match it.

   Everything subscribes to window.SiteMotion.onFrame rather than adding its
   own scroll listener, so the whole page still costs one listener and one
   requestAnimationFrame no matter how many of these are present. Section
   geometry is measured on resize, never per frame: reading offsetTop inside
   a scroll handler forces a layout every tick for numbers that only change
   when the page reflows.

   Every block below is independent and guards its own elements, so a page
   that omits the flow, or the device, or the rail still runs the rest.
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
  var rail = document.getElementById('bRail');
  var chipBar = document.getElementById('bChips');
  var progress = document.getElementById('bProgress');

  var railLinks = rail ? slice(rail.querySelectorAll('.b-rail-link')) : [];
  var chips = chipBar ? slice(chipBar.querySelectorAll('.b-chip')) : [];
  var chipScroll = chipBar ? chipBar.querySelector('.b-chips-scroll') : null;

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
      rail: rail ? rail.querySelector('.b-rail-link[href="#' + id + '"]') : null,
      chip: chipBar ? chipBar.querySelector('.b-chip[href="#' + id + '"]') : null
    });
  });

  var activeIndex = -1;
  var docHeight = 0;
  var offset = 0;

  function measureSections() {
    var top = document.querySelector('.b-top');
    /* A section counts as "reached" once its heading clears the sticky
       chrome, not once its box touches y = 0 — otherwise the mark jumps a
       section early on every page that has a sticky bar. */
    offset = (top ? top.offsetHeight : 0) + 24;

    for (var i = 0; i < sections.length; i++) {
      var box = sections[i].el.getBoundingClientRect();
      sections[i].top = box.top + window.pageYOffset;
    }

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
     3. The hero device
     ---------------------------------------------------------------------- */
  var stage = document.getElementById('bStage');
  var device = stage ? stage.querySelector('.b-device') : null;
  var lastRise = -1;

  function riseFrame(y, vh) {
    if (!device) return;
    var box = stage.getBoundingClientRect();

    /* 0 while the stage's top edge is still low in the viewport, 1 by the
       time it has risen to a third of the way up. The device therefore
       finishes its rise well before it leaves the screen, rather than still
       tilting as it exits. */
    var rise = clamp01(1 - (box.top - vh * 0.32) / (vh * 0.55));

    var rounded = Math.round(rise * 100) / 100;
    if (rounded === lastRise) return;
    lastRise = rounded;
    device.style.setProperty('--b-rise', String(rounded));
  }

  /* Reduced motion gets the finished composition, not the animation. */
  if (device && motion.reduced) {
    device.style.setProperty('--b-rise', '1');
  }

  /* ----------------------------------------------------------------------
     4. The sticky flow
     ---------------------------------------------------------------------- */
  var flow = document.getElementById('bFlow');
  var steps = flow ? slice(flow.querySelectorAll('.b-step')) : [];
  var flowShot = flow ? flow.querySelector('[data-flow-shot]') : null;
  var activeStep = -1;
  /* Captured before the fallback sweep below can consume it: every step swap
     re-arms it, so a step pointing at a screen that has not been exported yet
     still degrades to the placeholder instead of breaking the device. */
  var flowFallback = flowShot ? flowShot.getAttribute('data-fallback') : null;

  function stepFrame(y, vh) {
    if (!steps.length) return;

    /* The live step is the last one whose top has passed the middle of the
       viewport — the same line the pinned device sits on, so the step being
       read is the step the device is showing. */
    var line = vh * 0.5;
    var index = 0;
    for (var i = 0; i < steps.length; i++) {
      if (steps[i].getBoundingClientRect().top <= line) index = i;
    }

    if (index === activeStep) return;

    if (steps[activeStep]) steps[activeStep].classList.remove('is-active');
    activeStep = index;
    steps[index].classList.add('is-active');

    /* Swap the pinned screen if this step names one. Steps without a
       `data-shot` leave whatever is showing in place, which is what should
       happen while the deck's screens are still missing. */
    var shot = steps[index].getAttribute('data-shot');
    if (flowShot && shot && flowShot.getAttribute('src') !== shot) {
      if (flowFallback) flowShot.setAttribute('data-fallback', flowFallback);
      flowShot.setAttribute('src', shot);
    }
  }

  /* ----------------------------------------------------------------------
     Image fallbacks
     ----------------------------------------------------------------------
     The page references the deck's exported assets by their intended
     filenames before those files exist. Each such <img> carries a
     `data-fallback` pointing at an asset that is already in the repo, so the
     page renders correctly either way and upgrades itself the moment the
     real export is dropped into public/Banking/ — no markup change needed.

     Bound with capture, because `error` does not bubble. */
  function swapToFallback(img) {
    var fallback = img.getAttribute('data-fallback');
    if (!fallback) return;
    /* Clear it first: if the fallback is missing too, this must not loop. */
    img.removeAttribute('data-fallback');
    img.src = fallback;
  }

  document.addEventListener('error', function (e) {
    var img = e.target;
    if (img && img.tagName === 'IMG') swapToFallback(img);
  }, true);

  /* The listener above only catches images that fail AFTER it is attached,
     and this file is the last script on the page. An eager image in the hero
     — `fetchpriority="high"`, no lazy attribute — starts loading during parse
     and has usually already failed by the time we get here, so its error
     event is long gone. Sweep once for anything that failed early:
     `complete` with a zero natural width is a load that finished and
     produced nothing. */
  slice(document.querySelectorAll('img[data-fallback]')).forEach(function (img) {
    if (img.complete && img.naturalWidth === 0) swapToFallback(img);
  });

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
      progress.style.setProperty('--b-read', scrollable > 0 ? String(clamp01(y / scrollable)) : '0');
    }

    riseFrame(y, vh);
    stepFrame(y, vh);
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
