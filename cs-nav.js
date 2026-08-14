/* ==========================================================================
   Case-study navigation — scrollspy, reading progress, mobile drawer
   ==========================================================================
   Three behaviours that all key off the same scroll position, so they share
   one reader on window.SiteMotion's ticker rather than adding a third scroll
   listener to the page. Everything written per frame is a class toggle behind
   a change-guard or a custom property consumed by `transform`, so a frame
   that changes nothing costs nothing and a frame that does costs no layout.

   Load order: after motion.js (reads window.SiteMotion).
   ========================================================================== */
(function () {
  'use strict';

  var motion = window.SiteMotion;

  var nav = document.querySelector('.cs-nav');
  if (!nav || !motion) return;

  var progress = nav.querySelector('.cs-progress');
  var drawer = document.querySelector('.cs-drawer');
  var toggle = nav.querySelector('.cs-nav-toggle');

  /* Every link that points at a section on this page, from both the desktop
     bar and the drawer. One link can appear twice — once in each — so the
     spy tracks sections and updates all links that name them. */
  var links = Array.prototype.slice.call(
    document.querySelectorAll('.cs-nav-link, .cs-drawer a')
  ).filter(function (a) {
    return (a.getAttribute('href') || '').charAt(0) === '#';
  });

  var sections = [];
  links.forEach(function (a) {
    var id = a.getAttribute('href').slice(1);
    var el = document.getElementById(id);
    if (!el) return;

    var existing = null;
    sections.forEach(function (s) { if (s.id === id) existing = s; });
    if (existing) {
      existing.links.push(a);
    } else {
      sections.push({ id: id, el: el, links: [a], top: 0 });
    }
  });

  /* ---------------------------------------------------------------------
     Geometry is measured once per resize, not once per frame. Reading
     getBoundingClientRect inside the scroll handler is what turns a cheap
     scrollspy into a layout thrash on every frame.
     --------------------------------------------------------------------- */
  var docSpan = 1;
  var navHeight = 68;

  function measure() {
    navHeight = nav.offsetHeight || 68;
    var pageY = window.pageYOffset || document.documentElement.scrollTop || 0;

    sections.forEach(function (s) {
      s.top = s.el.getBoundingClientRect().top + pageY;
    });

    docSpan = Math.max(
      1,
      (document.documentElement.scrollHeight || 0) - window.innerHeight
    );
  }

  /* ---------------------------------------------------------------------
     Per-frame work
     --------------------------------------------------------------------- */
  var activeId = null;
  var lastProgress = -1;

  function update(scrollY) {
    /* Reading progress, quantised to 1/500ths. The bar is ~1280px wide, so
       finer steps than that are sub-pixel and only cost a style write. */
    if (progress) {
      var p = Math.round(Math.min(1, Math.max(0, scrollY / docSpan)) * 500) / 500;
      if (p !== lastProgress) {
        lastProgress = p;
        progress.style.setProperty('--p', p);
      }
    }

    if (!sections.length) return;

    /* A section counts as current once its top has passed the line just
       below the sticky bar — the same line the anchor scroll lands on, so
       clicking a link and scrolling to it agree on which one is active. */
    var line = scrollY + navHeight + 24;
    var current = sections[0];

    for (var i = 0; i < sections.length; i++) {
      if (sections[i].top <= line) current = sections[i];
      else break;
    }

    /* The last section is usually shorter than a viewport, so scrolling to
       the very bottom can never push its top past the line. Bottom of the
       document always means the final section. */
    if (scrollY >= docSpan - 2) current = sections[sections.length - 1];

    if (current.id === activeId) return;
    activeId = current.id;

    sections.forEach(function (s) {
      var on = s === current;
      s.links.forEach(function (a) {
        a.classList.toggle('is-active', on);
        if (on) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
    });
  }

  /* ---------------------------------------------------------------------
     Mobile drawer
     --------------------------------------------------------------------- */
  function setOpen(open) {
    if (!drawer || !toggle) return;
    if (open) {
      nav.setAttribute('data-open', '');
      drawer.setAttribute('data-open', '');
    } else {
      nav.removeAttribute('data-open');
      drawer.removeAttribute('data-open');
    }
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  if (toggle && drawer) {
    toggle.addEventListener('click', function () {
      setOpen(!nav.hasAttribute('data-open'));
    });

    /* Picking a destination is the end of the drawer's job. */
    drawer.addEventListener('click', function (event) {
      if (event.target.closest('a')) setOpen(false);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && nav.hasAttribute('data-open')) {
        setOpen(false);
        toggle.focus();
      }
    });

    /* Widening past the breakpoint restores the desktop bar; a drawer left
       open would then be an orphaned panel over the content. */
    var wide = window.matchMedia('(min-width: 1081px)');
    var onWide = function (event) { if (event.matches) setOpen(false); };
    if (wide.addEventListener) wide.addEventListener('change', onWide);
    else if (wide.addListener) wide.addListener(onWide);
  }

  /* ---------------------------------------------------------------------
     Anchor scrolling. `scroll-margin-top` on .cs-sec already offsets the
     landing point, so native behaviour lands correctly — this only picks
     the smooth-vs-instant behaviour and moves focus, which the browser
     does not do for a JS-driven scroll.
     --------------------------------------------------------------------- */
  links.forEach(function (a) {
    a.addEventListener('click', function (event) {
      var target = document.getElementById(a.getAttribute('href').slice(1));
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({
        behavior: motion.reduced ? 'auto' : 'smooth',
        block: 'start'
      });

      /* Keyboard users must end up *inside* the section they chose, not
         still on the link they clicked. tabindex -1 makes a non-interactive
         section focusable without adding it to the tab order. */
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });

      if (history.replaceState) {
        history.replaceState(null, '', '#' + target.id);
      }
    });
  });

  /* ---------------------------------------------------------------------
     Pannable images
     ---------------------------------------------------------------------
     Below 720px the wide screenshots and diagrams keep a legible minimum
     width and scroll inside their own box (see case-study.css). A scroll
     container that only answers to touch and the mouse wheel cannot be
     reached with a keyboard, so it has to become a focus stop — but only
     while it genuinely overflows. Hard-coding `tabindex` in the markup
     would leave six dead tab stops on every desktop viewport, where these
     boxes do not scroll at all.
     --------------------------------------------------------------------- */
  var pans = Array.prototype.slice.call(document.querySelectorAll('.cs-pan'));

  function syncPans() {
    pans.forEach(function (pan) {
      var scrolls = pan.scrollWidth - pan.clientWidth > 2;
      if (scrolls === pan.hasAttribute('tabindex')) return;

      if (scrolls) {
        pan.setAttribute('tabindex', '0');
        pan.setAttribute('role', 'group');
        pan.setAttribute('aria-label', 'Scrollable image — pan sideways to see the full interface');
      } else {
        pan.removeAttribute('tabindex');
        pan.removeAttribute('role');
        pan.removeAttribute('aria-label');
        pan.scrollLeft = 0;
      }
    });
  }

  /* ---------------------------------------------------------------------
     Wiring
     --------------------------------------------------------------------- */
  measure();
  syncPans();
  motion.onFrame(update);

  window.addEventListener('resize', function () {
    measure();
    syncPans();
  });

  /* Lazy images below the fold change the document height as they arrive,
     which moves every section top beneath them. Re-measuring on load catches
     the settled layout — and a just-decoded image is also the first moment
     its pan box knows whether it overflows. */
  window.addEventListener('load', function () {
    measure();
    syncPans();
    motion.refresh();
  });
})();
