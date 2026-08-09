(function () {
  'use strict';

  var data = window.PORTFOLIO_DATA;

  var SOCIAL_ICONS = {
    twitter: { color: '#0088ff', rotate: '10deg', path: '<path d="M18.9 3H21l-6.53 7.46L22.5 21h-6.9l-4.8-6.27L4.6 21H2.5l7-8L2 3h7.06l4.34 5.73L18.9 3Zm-1.2 16h1.15L7.36 4.9H6.1L17.7 19Z"/>' },
    /* Behance is a "Bē" ligature: a two-bowl B, then a bar over an e. The
       counters are cut with fill-rule="evenodd" rather than drawn as
       separate shapes, so the mark stays one solid colour at 26px. Tile
       colour and tilt are unchanged from the slot it replaces, keeping the
       fan's blue / orange / pink / blue rhythm intact. */
    behance: { color: '#ff8d28', rotate: '-5deg', path: '<path fill-rule="evenodd" d="M2.5 6h5.3c1.1 0 1.97.26 2.6.79.63.53.95 1.27.95 2.21 0 .55-.13 1.03-.4 1.43-.26.4-.65.72-1.15.95.7.2 1.23.56 1.6 1.1.36.53.55 1.19.55 1.97 0 .62-.12 1.16-.36 1.62-.24.46-.56.83-.96 1.12-.4.29-.86.5-1.38.63-.52.13-1.05.19-1.6.19H2.5V6Zm2.4 4.6h2.6c.45 0 .82-.11 1.1-.33.28-.22.42-.55.42-.99 0-.49-.15-.83-.44-1.02-.29-.19-.7-.28-1.21-.28H4.9v2.62Zm0 5.28h2.9c.25 0 .49-.03.71-.08.22-.05.41-.14.57-.25.16-.12.29-.28.38-.47.09-.2.14-.44.14-.72 0-.56-.16-.96-.47-1.2-.31-.24-.73-.36-1.25-.36H4.9v3.08Z"/><path d="M15.1 6.9h5.8v1.5h-5.8Z"/><path fill-rule="evenodd" d="M18.05 10.2c.94 0 1.73.31 2.34.94.61.62.92 1.48.92 2.56v.62h-5.42c.05.58.25 1.02.59 1.32.33.3.78.45 1.34.45.41 0 .77-.09 1.06-.28.29-.19.48-.42.57-.69h1.94c-.29.94-.75 1.62-1.38 2.04-.63.42-1.4.63-2.29.63-.62 0-1.19-.11-1.69-.32a3.5 3.5 0 0 1-1.27-.88 3.9 3.9 0 0 1-.8-1.35 5 5 0 0 1-.28-1.7c0-.6.1-1.16.29-1.67.19-.52.46-.96.81-1.34.35-.37.78-.66 1.27-.87.5-.2 1.04-.31 1.63-.31Zm-.03 1.56c-.44 0-.8.09-1.09.26-.29.17-.51.38-.67.63-.15.25-.25.51-.31.77h4.05c-.08-.52-.27-.92-.57-1.2-.3-.29-.77-.46-1.41-.46Z"/>' },
    instagram: { color: '#fa5f72', rotate: '7deg', path: '<path d="M12 2c2.72 0 3.06.01 4.12.06 1.06.05 1.79.22 2.43.47.66.26 1.22.6 1.77 1.15.55.55.89 1.11 1.15 1.77.25.64.42 1.37.47 2.43.05 1.06.06 1.4.06 4.12s-.01 3.06-.06 4.12c-.05 1.06-.22 1.79-.47 2.43a4.9 4.9 0 0 1-1.15 1.77 4.9 4.9 0 0 1-1.77 1.15c-.64.25-1.37.42-2.43.47-1.06.05-1.4.06-4.12.06s-3.06-.01-4.12-.06c-1.06-.05-1.79-.22-2.43-.47a4.9 4.9 0 0 1-1.77-1.15 4.9 4.9 0 0 1-1.15-1.77c-.25-.64-.42-1.37-.47-2.43C2.01 15.06 2 14.72 2 12s.01-3.06.06-4.12c.05-1.06.22-1.79.47-2.43.26-.66.6-1.22 1.15-1.77A4.9 4.9 0 0 1 5.45 2.53c.64-.25 1.37-.42 2.43-.47C8.94 2.01 9.28 2 12 2Zm0 5.84a4.16 4.16 0 1 0 0 8.32 4.16 4.16 0 0 0 0-8.32Zm0 6.86a2.7 2.7 0 1 1 0-5.4 2.7 2.7 0 0 1 0 5.4Zm5.3-7.04a.97.97 0 1 1-1.94 0 .97.97 0 0 1 1.94 0Z"/>' },
    linkedin: { color: '#0367bf', rotate: '-13deg', path: '<path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.76V21h-4v-5.6c0-1.34-.02-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.96V21h-4V9Z"/>' }
  };

  var ARROW_SVG = '<svg viewBox="0 0 14 10" fill="none" aria-hidden="true"><path d="M0 5h12M7 1l5 4-5 4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var ARROW_DIAGONAL_SVG = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function el(tag, className, html) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (html !== undefined) node.innerHTML = html;
    return node;
  }

  /* Fills a tile with its placeholder color, then layers the real media on
     top the moment `fill.image` (or `fill.video`) is set in data.js — so
     dropping in a real asset later gets correct alt text and lazy-loading
     for free. Video wins over image, which becomes its poster. */
  function applyTileFill(container, fill, altText) {
    container.style.backgroundColor = fill.color;

    if (fill.video) {
      container.classList.add('has-video');
      container.appendChild(buildTileVideo(fill, altText));
      return;
    }

    if (!fill.image) return;
    var img = el('img', 'tile-img');
    img.src = fill.image;
    img.alt = altText || '';
    img.loading = 'lazy';
    img.decoding = 'async';
    container.appendChild(img);
  }

  /* A silent, looping preview — decorative in the a11y sense, since the
     frame around it is already a labelled link, so it is hidden from screen
     readers rather than announced as an unlabelled media element.

     Muted is set as both property and attribute: iOS Safari reads the
     attribute at parse time and will refuse to autoplay without it, while
     the property is what every other browser's autoplay gate checks. */
  function buildTileVideo(fill, altText) {
    var video = el('video', 'tile-video');
    video.src = fill.video;
    if (fill.image) video.poster = fill.image;
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute('muted', '');
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.preload = 'metadata';
    video.setAttribute('aria-hidden', 'true');

    /* Reduced motion gets the poster frame and a set of controls instead of
       a loop that starts on its own — the preview stays available, it just
       stops being something that moves without being asked. */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      video.controls = true;
      video.removeAttribute('aria-hidden');
      video.setAttribute('aria-label', altText || '');
    } else {
      video.autoplay = true;
      video.loop = true;
    }

    return video;
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
    introPhoto.src = data.hero.introPhoto || data.hero.photo;
  }

  /* -----------------------------------------------------------
     My Works — projects flagged `fullWidth` in data.js render on
     their own row, the rest are paired two-per-row.
  ----------------------------------------------------------- */
  /* Points an <a> at a project. Off-site case studies (a live Figma
     prototype, a write-up) open in a new tab so the portfolio itself is
     never navigated away from. Shared by the title and the image, which
     are two separate links to the same destination. */
  function linkToProject(anchor, project) {
    var href = project.href || '#';
    anchor.href = href;
    if (/^https?:/i.test(href)) {
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
    }
  }

  /* One item per project: the copy first — title, date and summary, all
     ranged left — then the artwork floating on its own tinted mat beneath it.
     A full-width item runs the summary as a second column beside the title;
     a paired one stacks it. The entrance is triggered by reveal.js adding
     `.in-view` and the keyframes live in styles.css, so there is no observer
     or animation state to keep here. */
  function buildWorkItem(project) {
    var item = el('div', 'work-item');

    /* A dead '#' href would be a link that goes nowhere, so the frame is only
       an anchor once the project actually has a destination — and the hover
       arrow, which promises a click target, comes with it. */
    var hasLink = !!project.href && project.href !== '#';
    var frame = el(hasLink ? 'a' : 'div', 'work-image');
    /* Marked on the frame as well as the fill, because it is the frame that
       has to change shape to match the video. */
    if (project.video) frame.classList.add('has-video');
    if (hasLink) {
      linkToProject(frame, project);
      frame.setAttribute('aria-label', 'View project: ' + project.heading);
    }

    var fill = el('div', 'work-image-fill');
    applyTileFill(fill, project, project.heading + ' — project preview');
    frame.appendChild(fill);
    if (hasLink) frame.appendChild(el('span', 'work-image-arrow', ARROW_DIAGONAL_SVG));

    var body = el('div', 'work-item-body');

    /* Title and date travel together: the date is a caption on the title,
       not a third sibling, so the summary column can sit beside the pair. */
    var headline = el('div', 'work-item-headline');

    var title = el('h3', 'work-item-title');
    if (hasLink) {
      /* With the CTA button gone, the title carries the link alongside the
         frame — the copy is the first thing read, so it should be clickable
         too. The arrow is the hover affordance in place of an underline; it
         is always in the flow (just invisible at rest) so nothing shifts
         when it appears. Unlinked projects stay plain text rather than a
         dead anchor. */
      var titleLink = el('a', 'work-item-link');
      titleLink.appendChild(document.createTextNode(project.heading));
      titleLink.insertAdjacentHTML('beforeend', '<span class="work-item-arrow">' + ARROW_SVG + '</span>');
      linkToProject(titleLink, project);
      title.appendChild(titleLink);
    } else {
      title.textContent = project.heading;
    }
    headline.appendChild(title);
    headline.appendChild(el('p', 'work-item-date gradient-text', project.dateRange));
    body.appendChild(headline);

    body.appendChild(el('p', 'work-item-desc', project.description));

    item.appendChild(body);
    item.appendChild(frame);
    return item;
  }

  function renderWorks() {
    document.getElementById('worksEyebrow').textContent = data.works.eyebrow;
    document.getElementById('worksHeading').textContent = data.works.heading;

    var list = document.getElementById('worksList');

    /* A `fullWidth` project takes a row of its own; the rest fill pair rows
       two at a time, in order. `openRow` is the pair row still waiting for
       its second half — a full-width item in between closes it, so a pair
       is always two projects that actually sit side by side. */
    var openRow = null;

    data.works.projects.forEach(function (project) {
      if (project.fullWidth) {
        list.appendChild(buildWorkItem(project));
        openRow = null;
        return;
      }
      if (!openRow) {
        openRow = el('div', 'work-row');
        list.appendChild(openRow);
      }
      openRow.appendChild(buildWorkItem(project));
      if (openRow.children.length === 2) openRow = null;
    });

    var more = document.getElementById('worksMoreCta');
    var moreLabel = el('span');
    moreLabel.textContent = data.works.ctaMore.label;
    more.appendChild(moreLabel);
    more.insertAdjacentHTML('beforeend', ARROW_SVG);
    more.href = data.works.ctaMore.href;
    if (/^https?:/i.test(more.href)) {
      more.target = '_blank';
      more.rel = 'noopener noreferrer';
    }
  }

  /* -----------------------------------------------------------
     About — a block of copy between the hero and the work, whose
     words light up one after another as the section scrolls past.
  ----------------------------------------------------------- */
  function renderAbout() {
    document.getElementById('aboutEyebrow').textContent = data.about.eyebrow;

    var copy = document.getElementById('aboutCopy');
    copy.appendChild(fadeParagraph('about-lead', data.about.lead));
    data.about.paragraphs.forEach(function (text) {
      copy.appendChild(fadeParagraph('about-line', text));
    });

    initAboutFade(copy);
  }

  /* One <span> per word so each can be faded on its own. The spaces stay as
     plain text nodes between them, which is what keeps the paragraph
     selectable and copyable as ordinary prose. */
  function fadeParagraph(className, text) {
    var p = el('p', className);
    text.split(' ').forEach(function (word, index) {
      if (index) p.appendChild(document.createTextNode(' '));
      var span = el('span', 'about-word');
      span.textContent = word;
      p.appendChild(span);
    });
    return p;
  }

  /* The fade is tied to scroll position rather than played once on entry:
     the block's own travel through the lower half of the viewport is the
     timeline, so the words arrive at the pace the visitor scrolls and run
     backwards if they scroll back up.

     Reads are batched into a rAF — a scroll handler that measures on every
     event forces layout dozens of times a second. */
  function initAboutFade(copy) {
    var words = Array.prototype.slice.call(copy.querySelectorAll('.about-word'));
    if (!words.length) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      words.forEach(function (word) { word.style.opacity = '1'; });
      return;
    }

    var queued = false;

    function paint() {
      queued = false;
      var box = copy.getBoundingClientRect();
      var viewport = window.innerHeight || document.documentElement.clientHeight;

      /* 0 when the block's top is still at 85% of the viewport height, 1 once
         it has risen to 35% — a band tall enough that the last word lands
         well before the block leaves the screen. */
      var start = viewport * 0.85;
      var end = viewport * 0.35;
      var progress = (start - box.top) / (start - end);
      progress = Math.max(0, Math.min(1, progress));

      /* Spread over the word count with a one-word-wide ramp, so the light
         travels through the text instead of the whole block stepping at once. */
      var head = progress * (words.length + 1);
      words.forEach(function (word, index) {
        var lit = Math.max(0, Math.min(1, head - index));
        word.style.opacity = (0.18 + lit * 0.82).toFixed(3);
      });
    }

    function request() {
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(paint);
    }

    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    request();
  }

  /* -----------------------------------------------------------
     Experience — a loose stack of role cards. Add/remove/reorder
     entries in data.js; nothing here needs to change.
  ----------------------------------------------------------- */
  function renderExperience() {
    document.getElementById('experienceEyebrow').textContent = data.experience.eyebrow;
    document.getElementById('experienceHeading').textContent = data.experience.heading;

    var list = document.getElementById('experienceList');
    data.experience.items.forEach(function (job) {
      var card = el('div', 'exp-card');
      if (job.color) card.style.backgroundColor = job.color;

      var top = el('div', 'exp-card-top');
      var logo = el('span', 'exp-logo');
      if (job.logo) {
        /* Flags the plate for styles.css: a real mark needs a light plate and
           a contained fit, where the lettermark fallback wants the dark one. */
        logo.classList.add('has-logo');
        var logoImg = el('img');
        logoImg.src = job.logo;
        logoImg.alt = job.company + ' logo';
        logo.appendChild(logoImg);
      } else {
        logo.textContent = job.logoLetter;
        logo.setAttribute('aria-hidden', 'true');
      }
      top.appendChild(logo);
      top.appendChild(el('span', 'exp-date gradient-text', job.dateRange));
      card.appendChild(top);

      card.appendChild(el('p', 'exp-role', job.role));
      card.appendChild(el('p', 'exp-company', job.company));
      card.appendChild(el('p', 'exp-desc', job.description));

      list.appendChild(card);
    });
  }

  /* -----------------------------------------------------------
     Marquee — the looping horizontal strip behind both the
     testimonials and the gallery. Fill the returned strip with
     items, then call `start()` on the handle.
  ----------------------------------------------------------- */
  var MARQUEE_SPEED_PX_PER_SEC = 55;

  function createMarquee(track) {
    var strip = el('div', 'marquee-strip');
    track.appendChild(strip);

    return {
      strip: strip,

      start: function () {
        /* The strip is rendered twice so translating it by exactly one set's
           width lands on an identical frame — that's what makes the loop
           seamless. The clones are decoration: hidden from screen readers so
           the content isn't announced twice. */
        Array.prototype.slice.call(strip.children).forEach(function (item) {
          var clone = item.cloneNode(true);
          clone.setAttribute('aria-hidden', 'true');
          strip.appendChild(clone);
        });

        /* Constant travel speed regardless of item count: time the half-loop
           from its measured width rather than hard-coding a duration. */
        function size() {
          /* The strip is `max-content` wide, so items inside it have no
             definite percentage to size against. Publish the track's real
             width — scrollbar already excluded, unlike 100vw — for any item
             that wants to fit a whole number of itself into one view. */
          track.style.setProperty('--track-w', track.clientWidth + 'px');

          var halfWidth = strip.scrollWidth / 2;
          if (!halfWidth) return;
          strip.style.setProperty('--marquee-duration', (halfWidth / MARQUEE_SPEED_PX_PER_SEC) + 's');
        }
        size();
        /* Re-measure once everything has settled: if this runs before the
           strip has been laid out, scrollWidth reads 0 and the duration
           never gets set. */
        window.addEventListener('load', size);
        window.addEventListener('resize', size);
      },

      /* Flip travel direction. Reversing mid-run would normally jump, because
         elapsed time maps to the mirrored position — so the current progress
         is measured and replayed as a negative delay, which puts the strip
         back exactly where it already was. */
      setReversed: function (reversed) {
        if (strip.classList.contains('is-reversed') === reversed) return;

        var half = strip.scrollWidth / 2;
        var shifted = 0;
        var transform = window.getComputedStyle(strip).transform;
        if (transform && transform !== 'none') {
          var parts = transform.match(/matrix.*\((.+)\)/);
          if (parts) {
            var values = parts[1].split(', ');
            shifted = Math.abs(parseFloat(values[values.length - 2])) || 0;
          }
        }

        /* `shifted` is how far along the half-loop the strip already sits.
           Forward maps elapsed time straight onto that; reverse mirrors it.
           So the delay that preserves the current position differs per
           direction — using one formula for both jumps on the way back. */
        var duration = half / MARQUEE_SPEED_PX_PER_SEC;
        var progress = half ? shifted / half : 0;
        var replayed = reversed ? 1 - progress : progress;
        strip.classList.toggle('is-reversed', reversed);
        strip.style.animationDelay = -replayed * duration + 's';
      }
    };
  }

  /* -----------------------------------------------------------
     Testimonials — horizontally-scrolling cards; the arrow buttons
     just flip the direction the strip travels.
  ----------------------------------------------------------- */
  function renderTestimonials() {
    document.getElementById('testimonialsEyebrow').textContent = data.testimonials.eyebrow;

    var heading = document.getElementById('testimonialsHeading');
    heading.textContent = '';
    heading.appendChild(document.createTextNode(data.testimonials.headingPre));
    heading.appendChild(el('span', 'gradient-text', data.testimonials.headingHighlight));

    var marquee = createMarquee(document.getElementById('testimonialsTrack'));

    data.testimonials.items.forEach(function (t) {
      var card = el('div', 'testimonial-card');

      var photo = el('div', 'testimonial-photo');
      applyTileFill(photo, t, t.name + ' — headshot');
      card.appendChild(photo);

      var body = el('div', 'testimonial-body');
      body.appendChild(el('p', 'testimonial-quote', t.quote));
      body.appendChild(el('p', 'testimonial-name', t.name));
      body.appendChild(el('p', 'testimonial-title', t.title));
      card.appendChild(body);

      marquee.strip.appendChild(card);
    });

    marquee.start();

    document.getElementById('testimonialsPrev').addEventListener('click', function () {
      marquee.setReversed(true);
    });
    document.getElementById('testimonialsNext').addEventListener('click', function () {
      marquee.setReversed(false);
    });
  }

  /* -----------------------------------------------------------
     My Gallery — the same looping strip as the testimonials, with
     uniform photo tiles and no arrows.
  ----------------------------------------------------------- */
  function renderGallery() {
    document.getElementById('galleryEyebrow').textContent = data.gallery.eyebrow;

    var heading = document.getElementById('galleryHeading');
    heading.textContent = '';
    heading.appendChild(document.createTextNode(data.gallery.headingPre));
    heading.appendChild(el('span', 'gradient-text', data.gallery.headingHighlight));

    document.getElementById('galleryParagraph').textContent = data.gallery.paragraph;

    var marquee = createMarquee(document.getElementById('galleryTrack'));
    data.gallery.tiles.forEach(function (item) {
      var t = el('div', 'gallery-tile');
      applyTileFill(t, item, item.alt);
      marquee.strip.appendChild(t);
    });
    marquee.start();
  }

  /* -----------------------------------------------------------
     Footer
  ----------------------------------------------------------- */
  function renderFooter() {
    document.getElementById('footerWatermark').textContent = data.footer.watermark;

    var avatar = document.getElementById('footerAvatar');
    avatar.src = data.footer.avatar;
    avatar.alt = data.footer.avatarAlt || '';

    document.getElementById('footerHeading').textContent = data.footer.heading;
    document.getElementById('footerTagline').textContent = data.footer.tagline;

    var email = document.getElementById('footerEmail');
    email.href = 'mailto:' + data.profile.email;
    email.querySelector('span').textContent = data.profile.email;

    var cv = document.getElementById('footerCv');
    cv.href = data.footer.cvHref || '#';
    if (!data.footer.cvHref) {
      cv.setAttribute('aria-disabled', 'true');
      cv.addEventListener('click', function (e) { e.preventDefault(); });
    } else {
      cv.setAttribute('download', data.footer.cvDownloadName || '');
      cv.setAttribute('target', '_blank');
      cv.setAttribute('rel', 'noopener');
    }

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

  /* -----------------------------------------------------------
     SEO: Person structured data, built from the same fields the
     page already renders — nothing to keep in sync by hand.
  ----------------------------------------------------------- */
  function renderSEO() {
    var node = document.getElementById('personSchema');
    if (!node) return;

    var sameAs = Object.keys(data.social)
      .map(function (key) { return data.social[key]; })
      .filter(function (url) { return url && url.indexOf('http') === 0; });

    node.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: data.profile.name,
      jobTitle: data.profile.jobTitle,
      email: data.profile.email,
      sameAs: sameAs
    });
  }

  function renderAll() {
    renderNav();
    renderHero();
    renderAbout();
    renderWorks();
    renderExperience();
    /* Testimonials are parked: the section is commented out in index.html,
       so this render has no elements to fill. Uncomment both together. */
    // renderTestimonials();
    renderGallery();
    renderFooter();
    renderSEO();
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

    var docEl = document.documentElement;

    function unlockScroll() {
      docEl.classList.remove('intro-lock');
    }

    function reveal() {
      document.body.classList.remove('intro-active');
      overlay.style.display = 'none';
      unlockScroll();
    }

    /* sessionStorage throws in private mode and with storage blocked, so
       both accesses are guarded and simply fall back to playing the intro. */
    var SEEN_KEY = 'rakhi:introSeen';

    function hasSeenIntro() {
      try {
        return window.sessionStorage.getItem(SEEN_KEY) === '1';
      } catch (err) {
        return false;
      }
    }

    function rememberIntro() {
      try {
        window.sessionStorage.setItem(SEEN_KEY, '1');
      } catch (err) {
        /* Nothing to do — it just plays again next time. */
      }
    }

    /* Three reasons to skip straight to the page. The visitor asked for no
       motion; or they deep-linked to a section — arriving at index.html#works
       from a case study, where a full-screen splash would hijack the jump
       they actually asked for; or the splash already played in this tab, so
       it has done its job as a first impression. */
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var deepLinked = window.location.hash.length > 1;
    /* A reload restores the previous scroll offset, so the page can already
       be at "My Works" before a single frame is drawn. A full-screen splash
       over the middle of the page is never right, and the morph's target
       rects would be off-screen. */
    var alreadyScrolled = window.pageYOffset > 4;

    if (reduceMotion || deepLinked || alreadyScrolled || hasSeenIntro()) {
      reveal();
      return;
    }

    rememberIntro();
    docEl.classList.add('intro-lock');

    var ENTRANCE_DONE = 1400; /* matches the intro-portrait CSS entrance duration */
    /* Kept deliberately short: the whole point of the splash is the handoff,
       and every extra millisecond is another millisecond the page is frozen
       under an opaque overlay waiting on it. */
    var MOVE_MS = 900;
    var CROSSFADE_MS = 380;
    var EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
    var armed = false;
    var fired = false;
    var finished = false;

    function morph() {
      /* `finished` covers the bail-out case: the overlay is already gone, so
         starting a flight now would only re-hide the real logo and photo. */
      if (fired || finished) return;
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
        /* The overlay's own white is what the intro elements sit on. Leaving
           it opaque through the crossfade means they fade out against a
           blank sheet with the real page still hidden behind it — a beat
           where the viewport is simply empty, and then everything pops in
           at once when the overlay is removed. Fading the backdrop out on
           the same curve turns that into an actual crossfade: the hero copy
           and photo rise into view underneath as the splash thins out. */
        overlay.style.transition = 'background-color ' + CROSSFADE_MS + 'ms ease';
        overlay.style.backgroundColor = 'rgba(255, 255, 255, 0)';

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
      window.setTimeout(finish, MOVE_MS * 0.5 + CROSSFADE_MS);
    }

    /* End state, reachable from any point in the flight. Normally this is
       just the last step of morph(); it is also the escape hatch if a scroll
       slips past the lock (iOS momentum, a focus jump, an extension), where
       carrying on would strand a fixed overlay over the wrong section. */
    function finish() {
      if (finished) return;
      finished = true;

      overlay.style.display = 'none';
      document.body.classList.remove('intro-active');
      finalLogo.style.transition = 'none';
      finalLogo.style.opacity = '1';
      finalPhotoWrap.style.transition = 'none';
      finalPhotoWrap.style.opacity = '1';
      unlockScroll();
      window.removeEventListener('scroll', onIntroScroll);
    }

    function onIntroScroll() {
      if (window.pageYOffset > 4) finish();
    }

    window.addEventListener('scroll', onIntroScroll, { passive: true });

    function advance() {
      if (armed) morph();
    }

    /* Arms *and* fires. The entrance needs to finish before the morph can
       measure anything, so early input only queues the flight — but once the
       entrance is done the splash hands over on its own rather than waiting
       on an interaction that may never come. With the scroll frozen behind
       it, a splash that waits indefinitely is a page that never opens. */
    window.setTimeout(function () {
      armed = true;
      morph();
    }, ENTRANCE_DONE);

    var events = ['mousemove', 'pointerdown', 'touchstart', 'wheel', 'keydown'];
    events.forEach(function (evt) {
      window.addEventListener(evt, advance, { passive: true });
    });
  }

  /* ===========================================================
     Theme

     The <head> script has already applied the stored theme before
     first paint; this only owns the button and keeps the label,
     pressed state and address-bar colour in step with it.
  =========================================================== */
  var THEME_KEY = 'rakhi:theme';
  var themeToggle = document.getElementById('themeToggle');
  var themeMeta = document.querySelector('meta[name="theme-color"]');
  /* Must match --surface in each theme, or the mobile address bar tears
     against the top of the page. */
  var THEME_SURFACE = { dark: '#0b0d12', light: '#ffffff' };

  function currentTheme() {
    return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }

  function applyTheme(theme, animate) {
    var docEl = document.documentElement;

    /* The blanket transition is hung on <html> only for the length of the
       fade — see styles.css. Leaving it on permanently would override every
       component's own transition. */
    if (animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      docEl.classList.add('theme-switching');
      window.setTimeout(function () {
        docEl.classList.remove('theme-switching');
      }, 320);
    }

    if (theme === 'dark') docEl.setAttribute('data-theme', 'dark');
    else docEl.removeAttribute('data-theme');

    if (themeMeta) themeMeta.setAttribute('content', THEME_SURFACE[theme]);

    if (themeToggle) {
      themeToggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
      themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    }
  }

  /* No animation on this first pass: it's only catching the button and the
     meta tag up to what the <head> script already painted. */
  applyTheme(currentTheme(), false);

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      applyTheme(next, true);
      try {
        window.localStorage.setItem(THEME_KEY, next);
      } catch (err) {
        /* Storage blocked — the choice just won't survive a reload. */
      }
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
    /* Put the bar back under scroll's control. Sits here rather than on the
       toggle's click so Escape and outside-clicks are covered too. */
    updateScrollChrome();
  }

  function openMenu() {
    navMenu.classList.add('open');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Close navigation menu');
    /* The drawer lives inside the header — if the header is tucked away,
       the menu would open off-screen. */
    updateScrollChrome();
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
     Scroll chrome — the nav tucks away as soon as you leave the top
     of the page and stays away, rather than flying back in on every
     upward flick.
  =========================================================== */
  var siteHeader = document.getElementById('siteHeader');
  /* Past the bar's own height, so the very top of the page never flickers. */
  var HIDE_AFTER = 100;
  var headerTicking = false;

  function updateScrollChrome() {
    headerTicking = false;

    /* The drawer is a child of the header, so hiding it would drag an open
       menu off-screen with it. */
    var scrolledAway = window.pageYOffset > HIDE_AFTER && !navMenu.classList.contains('open');
    siteHeader.classList.toggle('is-hidden', scrolledAway);
  }

  function requestScrollChrome() {
    if (headerTicking) return;
    headerTicking = true;
    window.requestAnimationFrame(updateScrollChrome);
  }

  window.addEventListener('scroll', requestScrollChrome, { passive: true });
  updateScrollChrome();

  /* Scroll reveal used to live here, and the back-to-top button with it.
     Both moved to files of their own (reveal.js, to-top.js) so the case
     study — which can't load this file, since it has no data.js to render
     from — gets the same treatment. Both load straight after this script. */

})();
