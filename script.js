(function () {
  'use strict';

  var data = window.PORTFOLIO_DATA;

  var SOCIAL_ICONS = {
    twitter: { color: '#0088ff', rotate: '10deg', path: '<path d="M18.9 3H21l-6.53 7.46L22.5 21h-6.9l-4.8-6.27L4.6 21H2.5l7-8L2 3h7.06l4.34 5.73L18.9 3Zm-1.2 16h1.15L7.36 4.9H6.1L17.7 19Z"/>' },
    facebook: { color: '#ff8d28', rotate: '-5deg', path: '<path d="M13.5 21v-7.5H16l.4-3H13.5V8.4c0-.87.24-1.46 1.5-1.46H16.5V4.35c-.26-.03-1.15-.11-2.19-.11-2.17 0-3.66 1.32-3.66 3.75V10.5H8.2v3h2.45V21h2.85Z"/>' },
    instagram: { color: '#fa5f72', rotate: '7deg', path: '<path d="M12 2c2.72 0 3.06.01 4.12.06 1.06.05 1.79.22 2.43.47.66.26 1.22.6 1.77 1.15.55.55.89 1.11 1.15 1.77.25.64.42 1.37.47 2.43.05 1.06.06 1.4.06 4.12s-.01 3.06-.06 4.12c-.05 1.06-.22 1.79-.47 2.43a4.9 4.9 0 0 1-1.15 1.77 4.9 4.9 0 0 1-1.77 1.15c-.64.25-1.37.42-2.43.47-1.06.05-1.4.06-4.12.06s-3.06-.01-4.12-.06c-1.06-.05-1.79-.22-2.43-.47a4.9 4.9 0 0 1-1.77-1.15 4.9 4.9 0 0 1-1.15-1.77c-.25-.64-.42-1.37-.47-2.43C2.01 15.06 2 14.72 2 12s.01-3.06.06-4.12c.05-1.06.22-1.79.47-2.43.26-.66.6-1.22 1.15-1.77A4.9 4.9 0 0 1 5.45 2.53c.64-.25 1.37-.42 2.43-.47C8.94 2.01 9.28 2 12 2Zm0 5.84a4.16 4.16 0 1 0 0 8.32 4.16 4.16 0 0 0 0-8.32Zm0 6.86a2.7 2.7 0 1 1 0-5.4 2.7 2.7 0 0 1 0 5.4Zm5.3-7.04a.97.97 0 1 1-1.94 0 .97.97 0 0 1 1.94 0Z"/>' },
    linkedin: { color: '#0367bf', rotate: '-13deg', path: '<path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.76V21h-4v-5.6c0-1.34-.02-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.96V21h-4V9Z"/>' }
  };

  var ARROW_SVG = '<svg viewBox="0 0 14 10" fill="none" aria-hidden="true"><path d="M0 5h12M7 1l5 4-5 4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var LINK_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13 5h6v6M19 5 10 14M18 13v6a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h6"/></svg>';

  function el(tag, className, html) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (html !== undefined) node.innerHTML = html;
    return node;
  }

  function tile(fill) {
    return fill.image ? 'url(' + fill.image + ')' : fill.color;
  }

  /* -----------------------------------------------------------
     Nav — same link set renders into the desktop bar (split left/
     right of the logo) and the mobile drawer (one flat list).
  ----------------------------------------------------------- */
  function renderNav() {
    var logoMark = data.profile.logoFirst + data.profile.logoLast;
    document.getElementById('logo').textContent = logoMark;
    document.getElementById('introBrand').textContent = logoMark;
    document.title = data.meta.title;
    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', data.meta.description);

    var left = document.getElementById('navLeft');
    var right = document.getElementById('navRight');
    var mobile = document.getElementById('navMenuMobile');

    data.nav.left.forEach(function (link) {
      left.appendChild(navItem(link));
      mobile.appendChild(navLink(link));
    });
    data.nav.right.forEach(function (link) {
      right.appendChild(navItem(link));
      mobile.appendChild(navLink(link));
    });
  }

  function navItem(link) {
    var li = el('li');
    li.appendChild(navLink(link));
    return li;
  }

  function navLink(link) {
    var a = el('a', null, link.label);
    a.href = link.href;
    return a;
  }

  /* -----------------------------------------------------------
     Hero
  ----------------------------------------------------------- */
  function renderHero() {
    var badge = document.getElementById('heroBadge');
    badge.innerHTML =
      '<span class="icon">' + data.hero.badgeIcon + '</span> ' +
      data.hero.badgeWord + ' ' +
      '<span class="muted">' + data.hero.badgeWordMuted + '</span>';

    var headline = document.getElementById('heroHeadline');
    headline.textContent = '';
    headline.appendChild(document.createTextNode(data.hero.headlinePre));
    headline.appendChild(el('span', 'gradient-text', data.hero.headlineHighlight));
    headline.appendChild(document.createTextNode(data.hero.headlinePost));

    var primary = document.getElementById('heroCtaPrimary');
    primary.href = data.hero.ctaPrimary.href;
    primary.querySelector('span').textContent = data.hero.ctaPrimary.label;

    var secondary = document.getElementById('heroCtaSecondary');
    secondary.href = data.hero.ctaSecondary.href;
    secondary.querySelector('span').textContent = data.hero.ctaSecondary.label;

    var photo = document.getElementById('heroPhoto');
    photo.src = data.hero.photo;
    photo.alt = data.hero.photoAlt;

    var introPhoto = document.getElementById('introPortraitImg');
    introPhoto.src = data.hero.photo;
  }

  /* -----------------------------------------------------------
     My Works — first two projects render full-width, the rest are
     paired two-per-row, same as the Figma reference.
  ----------------------------------------------------------- */
  function buildWorkItem(project, index) {
    var item = el('div', 'work-item');

    var headingRow = el('div', 'work-heading-row');
    var headingCol = el('div', 'work-heading-col');
    /* Matches the Figma reference: only the first project carries the arrow glyph. */
    headingCol.appendChild(el('p', 'work-title', project.heading + (index === 0 ? ' ' + ARROW_SVG : '')));
    headingCol.appendChild(el('p', 'work-date gradient-text', project.dateRange));
    headingRow.appendChild(headingCol);
    headingRow.appendChild(el('p', 'work-desc', project.description));
    item.appendChild(headingRow);

    var image = el('div', 'work-image');
    image.style.background = tile(project);
    item.appendChild(image);

    return item;
  }

  function renderWorks() {
    document.getElementById('worksEyebrow').textContent = data.works.eyebrow;
    document.getElementById('worksHeading').textContent = data.works.heading;

    var cta = document.getElementById('worksCta');
    cta.href = data.works.ctaHref;
    cta.querySelector('span').textContent = data.works.ctaLabel;

    var list = document.getElementById('worksList');
    var projects = data.works.projects;

    projects.forEach(function (project, index) {
      if (index < 2) {
        list.appendChild(buildWorkItem(project, index));
        return;
      }
      var pairIndex = index - 2;
      var row = pairIndex % 2 === 0 ? el('div', 'work-row') : list.lastElementChild;
      row.appendChild(buildWorkItem(project, index));
      if (pairIndex % 2 === 0) list.appendChild(row);
    });
  }

  /* -----------------------------------------------------------
     Testimonials — horizontally-scrolling cards; the arrow buttons
     just page the track by one card width.
  ----------------------------------------------------------- */
  function renderTestimonials() {
    document.getElementById('testimonialsEyebrow').textContent = data.testimonials.eyebrow;

    var heading = document.getElementById('testimonialsHeading');
    heading.textContent = '';
    heading.appendChild(document.createTextNode(data.testimonials.headingPre));
    heading.appendChild(el('span', 'gradient-text', data.testimonials.headingHighlight));

    var track = document.getElementById('testimonialsTrack');
    data.testimonials.items.forEach(function (t) {
      var card = el('div', 'testimonial-card');

      var photo = el('div', 'testimonial-photo');
      photo.style.background = tile(t);
      card.appendChild(photo);

      var body = el('div', 'testimonial-body');
      body.appendChild(el('p', 'testimonial-quote', t.quote));
      body.appendChild(el('p', 'testimonial-name', t.name));
      body.appendChild(el('p', 'testimonial-title', t.title));
      card.appendChild(body);

      track.appendChild(card);
    });

    var prev = document.getElementById('testimonialsPrev');
    var next = document.getElementById('testimonialsNext');
    function page(dir) {
      var card = track.querySelector('.testimonial-card');
      var amount = card ? card.getBoundingClientRect().width + 31 : 300;
      track.scrollBy({ left: dir * amount, behavior: 'smooth' });
    }
    prev.addEventListener('click', function () { page(-1); });
    next.addEventListener('click', function () { page(1); });
  }

  /* -----------------------------------------------------------
     My Gallery — a loose collage grid; each tile's footprint comes
     from its `size` field (tall | wide | normal) in data.js.
  ----------------------------------------------------------- */
  function renderGallery() {
    document.getElementById('galleryEyebrow').textContent = data.gallery.eyebrow;

    var heading = document.getElementById('galleryHeading');
    heading.textContent = '';
    heading.appendChild(document.createTextNode(data.gallery.headingPre));
    heading.appendChild(el('span', 'gradient-text', data.gallery.headingHighlight));

    document.getElementById('galleryParagraph').textContent = data.gallery.paragraph;

    var grid = document.getElementById('galleryGrid');
    data.gallery.tiles.forEach(function (item) {
      var className = 'gallery-tile';
      if (item.size === 'tall') className += ' is-tall';
      if (item.size === 'wide') className += ' is-wide';
      var t = el('div', className);
      t.style.background = tile(item);
      grid.appendChild(t);
    });
  }

  /* -----------------------------------------------------------
     Footer
  ----------------------------------------------------------- */
  function renderFooter() {
    document.getElementById('footerWatermark').textContent = data.footer.watermark;

    var avatar = document.getElementById('footerAvatar');
    avatar.src = data.footer.avatar;
    avatar.alt = '';

    document.getElementById('footerHeading').textContent = data.footer.heading;
    document.getElementById('footerTagline').textContent = data.footer.tagline;

    var email = document.getElementById('footerEmail');
    email.href = 'mailto:' + data.profile.email;
    email.querySelector('span').textContent = data.profile.email;

    var cv = document.getElementById('footerCv');
    cv.href = data.footer.cvHref || '#';
    if (!data.footer.cvHref) cv.setAttribute('aria-disabled', 'true');

    var socialList = document.getElementById('footerSocialList');
    Object.keys(data.social).forEach(function (key) {
      var meta = SOCIAL_ICONS[key];
      if (!meta) return;
      var url = data.social[key];

      var li = el('li');
      var a = el('a', 'footer-social-link', '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' + meta.path + '</svg>');
      a.href = url;
      a.style.backgroundColor = meta.color;
      a.style.transform = 'rotate(' + meta.rotate + ')';
      a.setAttribute('aria-label', key.charAt(0).toUpperCase() + key.slice(1) + ' profile');
      if (url && url.indexOf('http') === 0) {
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
      }
      li.appendChild(a);
      socialList.appendChild(li);
    });

    document.getElementById('footerCopyright').textContent =
      '© ' + new Date().getFullYear() + ' • ' + data.footer.copyright;
  }

  function renderAll() {
    renderNav();
    renderHero();
    renderWorks();
    renderTestimonials();
    renderGallery();
    renderFooter();
  }

  renderAll();
  initHeroMorph();

  /* ===========================================================
     Hero intro morph (giant splash -> navbar logo + hero photo)

     The splash brand + portrait hold on screen until the visitor's
     first pointer move. At that point we measure where the intro
     copies currently sit and where the real navbar logo / hero photo
     live, then hand the flight off to a manual FLIP: set a CSS
     transition, move the intro elements to the target rect, and
     crossfade with the real elements once the move is most of the
     way there. Nav links and the hero copy column get a simpler CSS
     opacity/translate reveal at the same moment. No animation
     library needed — this is the only motion left on the page.
  =========================================================== */
  function initHeroMorph() {
    var overlay = document.getElementById('introOverlay');
    var introBrand = document.getElementById('introBrand');
    var introPortrait = document.getElementById('introPortrait');
    var finalLogo = document.getElementById('logo');
    var finalPhotoWrap = document.getElementById('heroPhotoWrap');

    if (!overlay || !introBrand || !introPortrait || !finalLogo || !finalPhotoWrap) return;

    function reveal() {
      document.body.classList.remove('intro-active');
      overlay.style.display = 'none';
    }

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      reveal();
      return;
    }

    var ENTRANCE_DONE = 1400; /* matches the intro-portrait CSS entrance duration */
    var MOVE_MS = 1100;
    var CROSSFADE_MS = 450;
    var EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
    var armed = false;
    var requested = false;
    var fired = false;

    function morph() {
      if (fired) return;
      fired = true;

      /* Freeze the CSS entrance animation at its settled state so this
         function owns transform/opacity cleanly from here on. */
      introBrand.style.animation = 'none';
      introBrand.style.opacity = '1';
      introBrand.style.transform = 'translateY(0)';
      introPortrait.style.animation = 'none';
      introPortrait.style.opacity = '1';
      introPortrait.style.transform = 'translateY(0) scale(1)';

      var brandFrom = introBrand.getBoundingClientRect();
      var brandTo = finalLogo.getBoundingClientRect();
      var brandScale = brandTo.width / brandFrom.width;
      var brandX = (brandTo.left + brandTo.width / 2) - (brandFrom.left + brandFrom.width / 2);
      var brandY = (brandTo.top + brandTo.height / 2) - (brandFrom.top + brandFrom.height / 2);

      var photoFrom = introPortrait.getBoundingClientRect();
      var photoTo = finalPhotoWrap.getBoundingClientRect();
      var photoScale = photoTo.width / photoFrom.width;
      var photoX = (photoTo.left + photoTo.width / 2) - (photoFrom.left + photoFrom.width / 2);
      var photoY = (photoTo.top + photoTo.height / 2) - (photoFrom.top + photoFrom.height / 2);

      /* Nav links + hero copy: plain CSS fade/slide, defined in styles.css. */
      document.body.classList.remove('intro-active');
      /* The class removal above would also reveal the real logo/photo —
         hold them at 0 a little longer, until the crossfade below. */
      finalLogo.style.transition = 'none';
      finalLogo.style.opacity = '0';
      finalPhotoWrap.style.transition = 'none';
      finalPhotoWrap.style.opacity = '0';

      /* Two rAFs so the browser commits the styles above before the
         transitioned move starts — otherwise it can coalesce into the
         final frame and skip the animation entirely. */
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          introBrand.style.transition = 'transform ' + MOVE_MS + 'ms ' + EASE;
          introBrand.style.transform = 'translate(' + brandX + 'px, ' + brandY + 'px) scale(' + brandScale + ')';

          introPortrait.style.transition = 'transform ' + MOVE_MS + 'ms ' + EASE;
          introPortrait.style.transform = 'translate(' + photoX + 'px, ' + photoY + 'px) scale(' + photoScale + ')';
        });
      });

      window.setTimeout(function () {
        introBrand.style.transition += ', opacity ' + CROSSFADE_MS + 'ms ease';
        introBrand.style.opacity = '0';
        introPortrait.style.transition += ', opacity ' + CROSSFADE_MS + 'ms ease';
        introPortrait.style.opacity = '0';

        finalLogo.style.transition = 'opacity ' + CROSSFADE_MS + 'ms ease';
        finalLogo.style.opacity = '1';
        finalPhotoWrap.style.transition = 'opacity ' + CROSSFADE_MS + 'ms ease';
        finalPhotoWrap.style.opacity = '1';
      }, MOVE_MS * 0.5);

      /* Hidden right as the crossfade finishes, not after the (longer)
         move — otherwise the overlay's opaque white sits over the
         already-faded-in real elements for a beat, a dead blank gap. */
      window.setTimeout(function () {
        overlay.style.display = 'none';
      }, MOVE_MS * 0.5 + CROSSFADE_MS);
    }

    function advance() {
      if (!armed) {
        requested = true;
        return;
      }
      morph();
    }

    window.setTimeout(function () {
      armed = true;
      if (requested) morph();
    }, ENTRANCE_DONE);

    var events = ['mousemove', 'pointerdown', 'touchstart', 'wheel', 'keydown'];
    events.forEach(function (evt) {
      window.addEventListener(evt, advance, { passive: true });
    });
  }

  /* ===========================================================
     Mobile nav drawer
  =========================================================== */
  var navToggle = document.getElementById('navToggle');
  var navMenu = document.getElementById('navMenuMobile');

  function closeMenu() {
    navMenu.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open navigation menu');
  }

  function openMenu() {
    navMenu.classList.add('open');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Close navigation menu');
  }

  navToggle.addEventListener('click', function () {
    if (navMenu.classList.contains('open')) closeMenu();
    else openMenu();
  });

  navMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      closeMenu();
      navToggle.focus();
    }
  });

  document.addEventListener('click', function (e) {
    var isClickInside = navMenu.contains(e.target) || navToggle.contains(e.target);
    if (!isClickInside && navMenu.classList.contains('open')) closeMenu();
  });

  /* ===========================================================
     Scroll reveal — simple fade/rise the first time each element
     enters the viewport.
  =========================================================== */
  var revealTargets = document.querySelectorAll('.work-item, .testimonial-card, .gallery-tile');
  revealTargets.forEach(function (target) {
    target.setAttribute('data-reveal', '');
  });

  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealTargets.forEach(function (target) { observer.observe(target); });
  } else {
    revealTargets.forEach(function (target) { target.classList.add('in-view'); });
  }

})();
