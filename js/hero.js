/* ==========================================================================
   Layered product hero — pointer parallax and entrance gating
   ==========================================================================
   Works on every `.hero-stage` on the page, so the same file drives the home
   page tile and the case study banner. (This replaces banner.js, which bound
   to a single `[data-stage]` on the case study alone.)

   Each layer gets a share of the pointer's travel scaled by its `data-depth`:

     dashboard 0.35   table 0.55   card 0.70   devices 1.00

   so the devices move about three times as far as the dashboard, and the plate
   itself only tilts — the background barely moves. That ordering is the whole
   point of the effect; depth lives in the data rather than here so the layers
   and their rates stay described in one place.

   Cost: no requestAnimationFrame loop of its own. Pointer samples are stored
   and the shared frame in motion.js is asked to run, so this coalesces with
   the scroll work into a single frame. Writes CSS custom properties only —
   composition stays in the stylesheet.
   ========================================================================== */
(function () {
  'use strict';

  var motion = window.SiteMotion;
  if (!motion) return;

  var stages = Array.prototype.slice.call(document.querySelectorAll('.hero-stage'));
  if (!stages.length) return;

  /* Degrees at the very corner. Small on purpose: past about 6deg the text
     inside the screenshots visibly keystones and the plate stops reading as a
     product shot. */
  var MAX_TILT = 3.6;
  /* Travel for a depth-1 layer, as a fraction of the plate's width, so the
     parallax scales with the hero instead of being a fixed pixel nudge that
     looks huge on a phone and invisible on a 4K display. */
  var SHIFT_RATIO = 0.016;

  stages.forEach(setup);
  stages.forEach(setupScrollDepth);

  /* ---- Scroll depth -------------------------------------------------------
     The banner's layers separate vertically as the section comes up the
     viewport, so the flat row resolves into stacked planes on the way in.

     Only stages marked `data-fx-depth` take it. The home page has a
     .hero-stage too — inside a work tile that already runs its own entrance —
     and a second transform arriving on those layers mid-animation would fight
     it. The attribute keeps this to the case study banner that asked for it.

     One number is published, `--fx-scroll`, 0 to 1 across the stage's travel
     through the viewport. Everything else is CSS: each layer carries a --d
     from 0 to 4 and multiplies the two. That split is deliberate — the depths
     are a design decision and belong next to the layout, not in here.

     No scroll listener of its own. motion.js already owns one passive scroll
     handler feeding a single requestAnimationFrame, and every reader on the
     page shares it; adding a second would mean two rAF loops measuring the
     same scroll on the same frame. `motion.onFrame` is that shared frame, and
     it hands the scroll position in already read. */
  function setupScrollDepth(stage) {
    if (!stage.hasAttribute('data-fx-depth')) return;

    /* Reduced motion gets the resolved composition, not the animation: the
       layers sit at their final separation and stay there. */
    if (motion.reduced) {
      stage.style.setProperty('--fx-scroll', '1');
      return;
    }

    var last = -1;

    motion.onFrame(function (scrollY, viewport) {
      var box = stage.getBoundingClientRect();

      /* 0 when the stage's top edge is at the bottom of the viewport, 1 by
         the time it has risen to a fifth of the way up. Clamped, so the
         layers hold their end position for the rest of the scroll rather
         than sliding back apart past the section. */
      var progress = 1 - (box.top - viewport * 0.2) / (viewport * 0.8);
      progress = progress < 0 ? 0 : progress > 1 ? 1 : progress;

      /* Two decimals is finer than a pixel of travel at these distances, and
         skipping the write when nothing changed keeps a still page from
         dirtying style every frame. */
      var rounded = Math.round(progress * 100) / 100;
      if (rounded === last) return;
      last = rounded;
      stage.style.setProperty('--fx-scroll', String(rounded));
    });
  }

  function setup(stage) {
    var tilt = stage.querySelector('.hero-tilt');
    var plate = stage.querySelector('.hero-plate');
    var sheen = stage.querySelector('.hero-sheen');
    if (!plate) return;

    var layers = Array.prototype.slice.call(stage.querySelectorAll('.hero-lyr')).map(function (el) {
      return { el: el, depth: parseFloat(el.getAttribute('data-depth')) || 0 };
    });

    /* The stage watches itself rather than being a reveal.js target.
       reveal.js works by putting `data-reveal` on an element — opacity 0 plus
       a translate — and on the home page the stage sits inside a `.work-item`
       that already runs its own entrance on the same tile. Two fades on nested
       boxes means the inner one starts invisible underneath an outer one that
       is also invisible, and the layer stagger is spent before either is on
       screen. Owning the trigger here keeps the hero's entrance independent of
       whatever wraps it.

       `.in-view` starts the layer stagger; `data-entered` then releases the
       idle drift, so the drift never runs underneath the entrance and moves a
       device twice. */
    function enter() {
      stage.classList.add('in-view');
      stage.setAttribute('data-entered', '');
    }

    if (motion.reduced || !('IntersectionObserver' in window)) {
      /* Everything that travels is disabled in CSS; the layers still fade in.
         Whatever happens, they must not be left at opacity 0. */
      enter();
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          io.unobserve(entry.target);
          enter();
        });
      }, { threshold: 0.2 });
      io.observe(stage);
    }

    if (motion.reduced) return;

    /* Touch devices have no hovering pointer. Skipping the listeners also means
       no pointermove work during a scroll-drag, which is when a phone can least
       afford it. The entrance and the drift still run.

       Tested positively — a real hovering, fine pointer — rather than by
       ruling out coarse ones, so nothing is attached on touch in the first
       place. Reduced motion is already handled a few lines up. */
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (!tilt) return;

    var pending = null;
    var tracking = false;

    function apply() {
      if (!pending) return;
      var p = pending;
      pending = null;

      /* -1..1 from the centre of the plate on both axes. */
      var nx = p.x * 2 - 1;
      var ny = p.y * 2 - 1;

      /* rotateX is inverted: a pointer below centre should tip the far edge up,
         which is a negative rotation about X. */
      tilt.style.setProperty('--tilt-y', (nx * MAX_TILT).toFixed(3) + 'deg');
      tilt.style.setProperty('--tilt-x', (-ny * MAX_TILT).toFixed(3) + 'deg');

      var reach = p.w * SHIFT_RATIO;
      for (var i = 0; i < layers.length; i++) {
        var l = layers[i];
        l.el.style.setProperty('--px', (nx * reach * l.depth).toFixed(2) + 'px');
        /* Vertical travel is deliberately shallower than horizontal: the
           desktop plate is 2.27:1, so equal travel on both axes reads as more
           vertical movement than the composition can absorb. */
        l.el.style.setProperty('--py', (ny * reach * l.depth * 0.55).toFixed(2) + 'px');
      }

      if (sheen) {
        sheen.style.setProperty('--sheen-x', (p.x * 100).toFixed(1) + '%');
        sheen.style.setProperty('--sheen-y', (p.y * 100).toFixed(1) + '%');
      }
    }

    motion.onFrame(apply);

    stage.addEventListener('pointermove', function (e) {
      /* Ignore coarse pointers that slip past the touch check — a stylus tap,
         or a touchscreen laptop being touched rather than moused. */
      if (e.pointerType === 'touch') return;

      var box = plate.getBoundingClientRect();
      if (!box.width || !box.height) return;

      pending = {
        x: Math.min(1, Math.max(0, (e.clientX - box.left) / box.width)),
        y: Math.min(1, Math.max(0, (e.clientY - box.top) / box.height)),
        w: box.width
      };

      if (!tracking) {
        tracking = true;
        stage.setAttribute('data-tracking', '');
      }
      motion.refresh();
    }, { passive: true });

    stage.addEventListener('pointerleave', function () {
      tracking = false;
      pending = null;
      stage.removeAttribute('data-tracking');

      /* Back to rest. The long expo curves on .hero-tilt and .hero-lyr are what
         make the release feel sprung rather than snapped — it is the release,
         not the tracking, that carries the weight. */
      tilt.style.setProperty('--tilt-x', '0deg');
      tilt.style.setProperty('--tilt-y', '0deg');
      for (var i = 0; i < layers.length; i++) {
        layers[i].el.style.setProperty('--px', '0px');
        layers[i].el.style.setProperty('--py', '0px');
      }
    }, { passive: true });
  }
})();
