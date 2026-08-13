/* ==========================================================================
   Suraksha banner — layered pointer parallax
   ==========================================================================
   The banner is four cut-out layers stacked on a navy plate (see the
   "layered depth stage" block in case-study.css). This file gives each layer
   a share of the pointer's travel, scaled by its `data-depth`:

     dashboard 0.35   table 0.55   card 0.70   phones 1.00

   so the phones move about three times as far as the dashboard, and the plate
   itself only tilts — the background barely moves. That ordering is the whole
   point of the effect; depth lives in the markup rather than here so the
   layers and their rates stay in one place.

   It also tilts the plate in 3D and rakes a highlight across it, both driven
   by the same pointer sample.

   Cost: no requestAnimationFrame loop of its own. Pointer samples are stored
   and the shared frame in motion.js is asked to run, so this coalesces with
   the scroll work into a single frame. Writes CSS custom properties only —
   composition stays in the stylesheet.
   ========================================================================== */
(function () {
  'use strict';

  var motion = window.SiteMotion;
  var stage = document.querySelector('[data-stage]');
  if (!stage || !motion) return;

  var tilt = stage.querySelector('.cs-banner-tilt');
  var plate = stage.querySelector('.cs-banner-plate');
  var sheen = stage.querySelector('.cs-banner-sheen');
  if (!tilt || !plate) return;

  var layers = Array.prototype.slice.call(stage.querySelectorAll('.cs-lyr')).map(function (el) {
    return { el: el, depth: parseFloat(el.getAttribute('data-depth')) || 0 };
  });

  /* Degrees at the very corner. Small on purpose: past about 6deg the text
     inside the screenshots visibly keystones and the plate stops reading as a
     product shot. */
  var MAX_TILT = 3.6;
  /* Travel for a depth-1 layer, as a fraction of the plate's width, so the
     parallax scales with the banner instead of being a fixed pixel nudge that
     looks huge on a phone and invisible on a 4K display. */
  var SHIFT_RATIO = 0.016;

  /* The entrance is owned by reveal.js (it puts `.in-view` on .cs-figure);
     this only waits for it, then releases the phones' drift. Gating the drift
     stops it running underneath the entrance and moving the phones twice. */
  function markEntered() {
    stage.setAttribute('data-entered', '');
  }

  if (motion.reduced) {
    /* Everything that moves is disabled in CSS; the layers still fade in.
       Release the (already disabled) drift flag so state stays consistent. */
    markEntered();
    return;
  }

  if (stage.classList.contains('in-view')) {
    markEntered();
  } else if ('MutationObserver' in window) {
    var mo = new MutationObserver(function () {
      if (stage.classList.contains('in-view')) {
        markEntered();
        mo.disconnect();
      }
    });
    mo.observe(stage, { attributes: true, attributeFilter: ['class'] });
  } else {
    markEntered();
  }

  /* Touch devices have no hovering pointer. Skipping the listeners also means
     no pointermove work during a scroll-drag, which is when a phone can least
     afford it. The entrance and the drift still run. */
  if (motion.touch) return;

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
      /* Vertical travel is deliberately shallower than horizontal: the plate
         is nearly 2.6:1, so equal travel on both axes reads as more vertical
         movement than the composition can absorb. */
      l.el.style.setProperty('--py', (ny * reach * l.depth * 0.55).toFixed(2) + 'px');
    }

    if (sheen) {
      sheen.style.setProperty('--sheen-x', (p.x * 100).toFixed(1) + '%');
      sheen.style.setProperty('--sheen-y', (p.y * 100).toFixed(1) + '%');
    }
  }

  motion.onFrame(apply);

  stage.addEventListener('pointermove', function (e) {
    /* Ignore coarse pointers that slip past the touch check — a stylus tap, or
       a touchscreen laptop being touched rather than moused. */
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

    /* Back to rest. The long expo curves on .cs-banner-tilt and .cs-lyr are
       what make the release feel sprung rather than snapped — it is the
       release, not the tracking, that carries the weight. */
    tilt.style.setProperty('--tilt-x', '0deg');
    tilt.style.setProperty('--tilt-y', '0deg');
    for (var i = 0; i < layers.length; i++) {
      layers[i].el.style.setProperty('--px', '0px');
      layers[i].el.style.setProperty('--py', '0px');
    }
  }, { passive: true });
})();
