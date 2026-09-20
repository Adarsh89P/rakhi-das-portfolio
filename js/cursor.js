/* ==========================================================================
   Inverted cursor — a circle that inverts whatever it passes over
   ==========================================================================
   A port of the `inverted-cursor` React component to this site's stack. The
   effect is unchanged: a white disc, `mix-blend-mode: difference`, easing
   toward the pointer at 0.2 of the remaining distance per frame, faded in on
   first movement and out when the pointer leaves the window.

   WHY IT IS NOT THE REACT COMPONENT
   That component is React + Tailwind + TypeScript on a shadcn layout. This
   site is static HTML with plain <script> tags, no build step and no
   node_modules it needs at runtime. Installing React, Tailwind, TypeScript
   and a bundler to run forty lines of rAF would be a rewrite of the whole
   portfolio to host one visual effect. The effect is the thing worth having,
   so it is ported rather than imported — same geometry, same easing
   constant, same blend mode.

   FOUR THINGS THE ORIGINAL DOES THAT ARE FIXED HERE
   These are real bugs, not stylistic differences:

     1. `useEffect(..., [animate])`. `animate` is a new function on every
        render and every mouse move sets state, so the effect tears itself
        down and rebuilds — removing and re-adding three listeners, and
        cancelling and restarting the rAF loop — on every frame the pointer
        moves. Here the position is a pair of numbers in closure scope, so
        nothing re-subscribes.

     2. `document.body.style.cursor = 'none'` hides the arrow on the body
        only. Every link and button sets `cursor: pointer` itself, so the
        native arrow reappears over exactly the elements the disc is most
        likely to be sitting on. This uses a class and a `*` selector.

     3. The rAF loop never stops. It runs at 60fps forever, including over a
        cursor that has been still for ten minutes. This one parks itself
        once the disc has caught up and restarts on the next movement.

     4. No pointer-type check. On a touch device the component still hides
        the cursor and parks a disc off-screen. This declines to run at all
        where there is no pointer to replace.

   And, as before: `cursor: none` lives on `html.has-cursor`, a class added
   only once there is a working replacement on screen. No JS, a blocked
   script, a coarse pointer or a throw all leave the real pointer alone.
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  var cursor = document.getElementById('cursor');
  if (!cursor) return;

  /* No pointer to replace. A coarse pointer or a device that never hovers
     keeps its own behaviour and this file does nothing at all. */
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  var motion = window.SiteMotion;

  /* The disc is centred on the pointer, so every position it is given is
     offset by half its width. Read from the stylesheet rather than hardcoded
     here, so the size is set in one place — the CSS — and this stays in step
     with it automatically. */
  function radius() {
    var size = parseFloat(getComputedStyle(cursor).width);
    return (size || 60) / 2;
  }

  var half = radius();

  var targetX = 0;
  var targetY = 0;
  var drawX = 0;
  var drawY = 0;
  var placed = false;
  var running = false;

  /* The original's easing constant, kept: each frame closes a fifth of the
     remaining gap, which is what gives the disc its drag. 1 removes the lag
     entirely, which is what a reduced-motion request resolves to — the
     pointer still needs to be visible, it just should not trail. */
  function ease() {
    return motion && motion.reduced ? 1 : 0.2;
  }

  function frame() {
    var k = ease();
    var dx = targetX - drawX;
    var dy = targetY - drawY;

    /* Below a quarter pixel there is nothing left to move. Snap to the
       target, drop out of the loop, and let the next pointermove restart it. */
    if (Math.abs(dx) < 0.25 && Math.abs(dy) < 0.25) {
      drawX = targetX;
      drawY = targetY;
      running = false;
    } else {
      drawX += dx * k;
      drawY += dy * k;
      window.requestAnimationFrame(frame);
    }

    cursor.style.transform = 'translate3d(' + (drawX - half) + 'px, ' + (drawY - half) + 'px, 0)';
  }

  function request() {
    if (running) return;
    running = true;
    window.requestAnimationFrame(frame);
  }

  window.addEventListener('pointermove', function (e) {
    /* Mouse and trackpad only. A pen or a touch reporting a fine pointer
       would otherwise strand the disc wherever it was last tapped. */
    if (e.pointerType && e.pointerType !== 'mouse') return;

    targetX = e.clientX;
    targetY = e.clientY;

    /* The first sighting is a jump. Easing in from 0,0 would send the disc
       gliding across the page from the top-left corner the first time the
       visitor moves, which reads as a loading artefact. */
    if (!placed) {
      placed = true;
      drawX = targetX;
      drawY = targetY;
      root.classList.add('has-cursor');
      cursor.classList.add('is-live');
    }

    request();
  }, { passive: true });

  /* Out of the window, or away from the tab, and it goes. A disc frozen at
     the edge of the page after the pointer has left is a bug you can see. */
  function hide() { cursor.classList.remove('is-live'); }
  function show() { if (placed) cursor.classList.add('is-live'); }

  document.addEventListener('mouseleave', hide);
  document.addEventListener('mouseenter', show);
  window.addEventListener('blur', hide);
  window.addEventListener('focus', show);

  /* The size is a CSS custom property and could be changed at any breakpoint,
     so the half-width is re-read rather than captured once. */
  window.addEventListener('resize', function () {
    half = radius();
    request();
  }, { passive: true });
})();
