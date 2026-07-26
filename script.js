(function () {
  'use strict';

  var data = window.PORTFOLIO_DATA;

  /* -----------------------------------------------------------
     Small inline icon library (SVG strings, keyed by name)
  ----------------------------------------------------------- */
  var ICONS = {
    certificate: '<circle cx="12" cy="8" r="6"></circle><path d="M9 13.5 7 22l5-3 5 3-2-8.5"></path>',
    badge: '<path d="M12 2 2 7l10 5 10-5-10-5Z"></path><path d="M2 17l10 5 10-5M2 12l10 5 10-5"></path>',
    star: '<path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8"></path><circle cx="12" cy="12" r="4"></circle>',
    network: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"></path>',
    lock: '<rect x="4" y="10" width="16" height="10" rx="2"></rect><path d="M8 10V7a4 4 0 0 1 8 0v3"></path>',
    quote: '<path d="M7 7h4v6a4 4 0 0 1-4 4H6v-2h1a2 2 0 0 0 2-2H7V7Zm9 0h4v6a4 4 0 0 1-4 4h-1v-2h1a2 2 0 0 0 2-2h-2V7Z"></path>',
    paperclip: '<path d="M8 12.5V7a4 4 0 0 1 8 0v9a2.5 2.5 0 0 1-5 0V8"></path>',
    pin: '<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11Z"></path><circle cx="12" cy="10" r="2.5"></circle>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"></path>'
  };

  var SOCIAL_ICONS = {
    linkedin: '<path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.76V21h-4v-5.6c0-1.34-.02-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.96V21h-4V9Z"/>',
    github: '<path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.15-1.11-1.46-1.11-1.46-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.56-1.11-4.56-4.93 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.83-2.34 4.68-4.57 4.92.36.31.68.92.68 1.85v2.75c0 .26.18.58.69.48A10 10 0 0 0 12 2Z"/>',
    twitter: '<path d="M18.9 3H21l-6.53 7.46L22.5 21h-6.9l-4.8-6.27L4.6 21H2.5l7-8L2 3h7.06l4.34 5.73L18.9 3Zm-1.2 16h1.15L7.36 4.9H6.1L17.7 19Z"/>',
    dribbble: '<path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm6.6 4.7a8.2 8.2 0 0 1 1.8 5c-.26-.05-2.86-.58-5.48-.25-.06-.14-.11-.29-.17-.43a20 20 0 0 0-.5-1.16c2.9-1.18 4.2-2.86 4.35-3.16ZM12 3.8c1.83 0 3.5.66 4.8 1.75-.13.27-1.3 1.8-4.1 2.86A44.6 44.6 0 0 0 9.6 4.2c.77-.26 1.57-.4 2.4-.4Zm-4.05 1.1a45 45 0 0 1 3.1 4.4c-3.9 1.04-7.34 1-7.7 1a8.24 8.24 0 0 1 4.6-5.4Zm-4.75 7.13v-.2c.35.01 4.4.06 8.56-1.18.24.46.46.93.67 1.4l-.4.12c-4.32 1.4-6.62 5.22-6.81 5.54a8.16 8.16 0 0 1-2.02-5.68Zm7.5 8.16A8.2 8.2 0 0 1 5.9 17.7c.15-.26 1.85-3.15 6.6-4.75.02-.01.03 0 .05-.01a37 37 0 0 1 1.87 6.99 8.2 8.2 0 0 1-3.72.16Zm5-.72a38.8 38.8 0 0 0-1.72-6.5c2.42-.38 4.54.24 4.8.32a8.25 8.25 0 0 1-3.08 6.18Z"/>'
  };

  function svg(iconKey, viewBox, filled) {
    var attrs = filled
      ? 'fill="currentColor" aria-hidden="true"'
      : 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
    return '<svg viewBox="' + (viewBox || '0 0 24 24') + '" ' + attrs + '>' + iconKey + '</svg>';
  }

  function el(tag, className, html) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (html !== undefined) node.innerHTML = html;
    return node;
  }

  /* -----------------------------------------------------------
     Render: static text fields
  ----------------------------------------------------------- */
  function renderProfile() {
    document.title = data.meta.title;
    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', data.meta.description);

    document.getElementById('logo').innerHTML =
      data.profile.logoFirst + '<span>' + data.profile.logoLast + '</span>';

    document.getElementById('heroEyebrow').textContent = data.profile.eyebrow;
    document.getElementById('heroWordTop').textContent = data.profile.heroWordTop;
    document.getElementById('heroWordBottom').textContent = data.profile.heroWordBottom;
    document.getElementById('heroTagline').textContent = data.profile.tagline + ' ';
    document.getElementById('heroInitials').textContent = data.profile.initials;

    var chip = document.getElementById('companyChip');
    var chipAvatar = el('span', 'company-chip-avatar', data.profile.companyChip.initial);
    chip.appendChild(chipAvatar);
    chip.appendChild(document.createTextNode(data.profile.companyChip.name));

    document.getElementById('basedInCity').textContent = data.profile.city;

    var footerName = document.getElementById('footerName');
    footerName.textContent = data.footer.name;
    document.getElementById('year').textContent = new Date().getFullYear();
  }

  function renderWhatIDo() {
    document.getElementById('whatIDoEyebrow').textContent = data.whatIDo.eyebrow;

    var statement = document.getElementById('whatIDoStatement');
    statement.appendChild(document.createTextNode(data.whatIDo.statementPre + ' '));
    statement.appendChild(el('span', 'statement-highlight', data.whatIDo.highlight));
    statement.appendChild(document.createTextNode(' ' + data.whatIDo.statementPost));

    var statsWrap = document.getElementById('whatIDoStats');
    data.whatIDo.stats.forEach(function (stat) {
      var block = el('div', 'what-i-do-stat');
      block.appendChild(el('span', 'stat-number-lg', stat.number));
      block.appendChild(el('span', 'stat-label', stat.label));
      block.appendChild(el('span', 'stat-sub', stat.sub));
      statsWrap.appendChild(block);
    });
  }

  function renderAbout() {
    document.getElementById('aboutInitials').textContent = data.profile.initials;

    var aboutText = document.getElementById('aboutText');
    data.about.paragraphs.forEach(function (p) {
      aboutText.appendChild(el('p', null, p));
    });

    var statsGrid = document.getElementById('statsGrid');
    data.stats.forEach(function (stat) {
      var card = el('div', 'stat-card');
      card.appendChild(el('span', 'stat-number', stat.number));
      card.appendChild(el('span', 'stat-label', stat.label));
      statsGrid.appendChild(card);
    });

    document.getElementById('aboutSignature').textContent = data.about.signature;
  }

  function renderSkillBar(container, skill) {
    var bar = el('div', 'skill-bar');
    var head = el('div', 'skill-bar-head');
    head.appendChild(el('span', null, skill.name));
    head.appendChild(el('span', null, skill.value + '%'));
    var track = el('div', 'skill-track');
    var fill = el('div', 'skill-fill');
    fill.style.setProperty('--value', skill.value + '%');
    track.appendChild(fill);
    bar.appendChild(head);
    bar.appendChild(track);
    container.appendChild(bar);
  }

  function renderSkills() {
    var designCol = document.getElementById('skillsDesign');
    data.skills.design.forEach(function (skill) {
      renderSkillBar(designCol, skill);
    });

    var frontendCol = document.getElementById('skillsFrontend');
    data.skills.frontend.forEach(function (skill) {
      renderSkillBar(frontendCol, skill);
    });

    var tagsCol = document.getElementById('skillsTags');
    data.skills.tags.forEach(function (tag) {
      tagsCol.appendChild(el('span', 'tag', tag));
    });
  }

  /* -----------------------------------------------------------
     Progress rail shared by both pinned decks: a counter plus one
     dot per card. Dots are buttons that jump to that card's slice
     of the pinned scroll range (wired up in initStacks).
  ----------------------------------------------------------- */
  function renderProgress(container, count, labelFor) {
    var counter = el('span', 'stack-count');
    counter.innerHTML = '<span class="stack-count-current">01</span><span class="stack-count-sep">/</span>' +
      '<span class="stack-count-total">' + pad(count) + '</span>';
    container.appendChild(counter);

    var dots = el('div', 'stack-dots');
    for (var i = 0; i < count; i++) {
      var dot = el('button', 'stack-dot' + (i === 0 ? ' is-active' : ''));
      dot.type = 'button';
      dot.setAttribute('data-index', String(i));
      dot.setAttribute('aria-label', labelFor(i));
      dots.appendChild(dot);
    }
    container.appendChild(dots);
  }

  function pad(n) {
    return n < 10 ? '0' + n : String(n);
  }

  /* -----------------------------------------------------------
     Experience — layered 3D card deck (motion lives in initStacks)
  ----------------------------------------------------------- */
  function renderExperience() {
    var stage = document.getElementById('experienceStage');
    var logoPalette = [
      ['#6c5ce7', '#5b8def'],
      ['#00b8a9', '#5b8def'],
      ['#f5a623', '#ef7b7b'],
      ['#c65ce7', '#6c5ce7']
    ];

    data.experience.forEach(function (job, index) {
      var pair = logoPalette[index % logoPalette.length];
      var card = el('article', 'exp-card' + (index === 0 ? ' is-active' : ''));
      card.setAttribute('data-index', String(index));
      card.style.setProperty('--card-from', pair[0]);
      card.style.setProperty('--card-to', pair[1]);

      var inner = el('div', 'exp-card-inner');

      var head = el('header', 'exp-card-head');

      var logo = el('span', 'exp-logo');
      if (job.logo) {
        var logoImg = el('img');
        logoImg.src = job.logo;
        logoImg.alt = job.company + ' logo';
        logo.appendChild(logoImg);
      } else {
        logo.textContent = job.logoLetter;
        logo.classList.add('exp-logo-letter');
      }
      head.appendChild(logo);

      var titles = el('div', 'exp-card-titles');
      titles.appendChild(el('h3', 'exp-company', job.company));
      titles.appendChild(el('p', 'exp-role', job.role));
      head.appendChild(titles);

      head.appendChild(el('span', 'exp-duration', job.date));
      inner.appendChild(head);

      if (job.location) {
        inner.appendChild(el('p', 'exp-location', svg(ICONS.pin) + '<span>' + job.location + '</span>'));
      }

      if (job.summary) {
        inner.appendChild(el('p', 'exp-summary', job.summary));
      }

      if (job.achievements && job.achievements.length) {
        inner.appendChild(el('p', 'exp-label', 'Key achievements'));
        var list = el('ul', 'exp-achievements');
        job.achievements.forEach(function (bullet) {
          list.appendChild(el('li', null, bullet));
        });
        inner.appendChild(list);
      }

      if (job.tech && job.tech.length) {
        var badges = el('div', 'tag-list exp-tech');
        job.tech.forEach(function (item) {
          badges.appendChild(el('span', 'tag tag-soft', item));
        });
        inner.appendChild(badges);
      }

      card.appendChild(inner);
      stage.appendChild(card);
    });

    renderProgress(document.getElementById('expProgress'), data.experience.length, function (i) {
      return 'Go to experience ' + (i + 1) + ': ' + data.experience[i].company;
    });
  }

  function renderAchievements() {
    var grid = document.getElementById('achievementsGrid');
    data.achievements.forEach(function (item) {
      var card = el('div', 'achievement-card');
      var iconWrap = el('div', 'achievement-icon', svg(ICONS[item.icon] || ICONS.star));
      card.appendChild(iconWrap);
      card.appendChild(el('h3', null, item.title));
      card.appendChild(el('p', null, item.subtitle));
      grid.appendChild(card);
    });
  }

  /* -----------------------------------------------------------
     Case studies — one full-height card at a time (motion lives
     in initStacks). Supply project.image in data.js for a real
     hero shot; otherwise a gradient cover stands in for it.
  ----------------------------------------------------------- */
  function renderCaseStudies() {
    var stage = document.getElementById('caseStudyStage');
    /* Cycled gradient pairs so each card reads as its own "cover", like a slide deck. */
    var gradients = [
      ['#5b8def', '#6c5ce7'],
      ['#6c5ce7', '#c65ce7'],
      ['#00b8a9', '#5b8def'],
      ['#f5a623', '#ef7b7b'],
      ['#ef7b7b', '#6c5ce7']
    ];

    data.projects.forEach(function (project, index) {
      var pair = gradients[index % gradients.length];
      var card = el('article', 'cs-card' + (index === 0 ? ' is-active' : ''));
      card.setAttribute('data-index', String(index));
      card.style.setProperty('--card-from', pair[0]);
      card.style.setProperty('--card-to', pair[1]);

      var inner = el('div', 'cs-card-inner');

      /* --- hero media --- */
      var media = el('div', 'cs-media');
      var frame = el('div', 'cs-media-frame');

      if (project.image) {
        var img = el('img', 'cs-media-img');
        img.src = project.image;
        img.alt = project.title;
        img.loading = 'lazy';
        frame.appendChild(img);
      } else {
        var cover = el('div', 'cs-media-img cs-cover');
        cover.setAttribute('aria-hidden', 'true');
        cover.appendChild(el('span', 'cs-cover-number', project.number));
        var mock = el('div', 'cs-cover-mock');
        mock.appendChild(el('span', 'cs-cover-dot'));
        mock.appendChild(el('span', 'cs-cover-bar cs-cover-bar-lg'));
        mock.appendChild(el('span', 'cs-cover-bar cs-cover-bar-md'));
        mock.appendChild(el('span', 'cs-cover-bar cs-cover-bar-sm'));
        cover.appendChild(mock);
        frame.appendChild(cover);
      }

      media.appendChild(frame);

      var badges = el('div', 'cs-media-badges');
      badges.appendChild(el('span', 'cs-category', project.category || 'Case Study'));
      badges.appendChild(el('span', 'cs-year', project.year));
      media.appendChild(badges);
      inner.appendChild(media);

      /* --- body --- */
      var body = el('div', 'cs-body');
      body.appendChild(el('h3', 'cs-title', project.title));
      body.appendChild(el('p', 'cs-desc', project.description));

      var chips = el('div', 'tag-list cs-chips');
      project.tags.forEach(function (tag) {
        chips.appendChild(el('span', 'tag tag-soft', tag));
      });
      body.appendChild(chips);

      if (project.metrics && project.metrics.length) {
        var metrics = el('div', 'cs-metrics');
        project.metrics.forEach(function (metric) {
          var item = el('div', 'cs-metric');
          item.appendChild(el('span', 'cs-metric-value', metric.value));
          item.appendChild(el('span', 'cs-metric-label', metric.label));
          metrics.appendChild(item);
        });
        body.appendChild(metrics);
      }

      var actions = el('div', 'cs-actions');
      if (project.status === 'soon') {
        actions.appendChild(el('span', 'project-lock', svg(ICONS.lock) + '<span>Coming Soon</span>'));
      } else {
        var caseBtn = el('a', 'btn btn-primary cs-btn', '<span>View Case Study</span>' + svg(ICONS.arrow));
        caseBtn.href = project.links.case;
        actions.appendChild(caseBtn);

        if (project.links.demo) {
          var demo = el('a', 'cs-link', 'Live Demo');
          demo.href = project.links.demo;
          actions.appendChild(demo);
        }
      }
      body.appendChild(actions);

      inner.appendChild(body);
      card.appendChild(inner);
      stage.appendChild(card);
    });

    renderProgress(document.getElementById('csProgress'), data.projects.length, function (i) {
      return 'Go to case study ' + (i + 1) + ': ' + data.projects[i].title;
    });
  }

  function renderTestimonials() {
    var track = document.getElementById('testimonialsTrack');
    data.testimonials.forEach(function (t) {
      var card = el('div', 'testimonial-card');
      card.appendChild(el('div', 'testimonial-quote-icon', svg(ICONS.quote, '0 0 24 24', true)));
      card.appendChild(el('p', 'testimonial-quote', '“' + t.quote + '”'));

      var author = el('div', 'testimonial-author');
      var avatarWrap = el('div', 'testimonial-avatar-wrap');
      avatarWrap.appendChild(el('span', 'testimonial-clip', svg(ICONS.paperclip || ICONS.quote, '0 0 24 24', false)));
      var avatar = el('div', 'testimonial-avatar', t.name.charAt(0));
      avatarWrap.appendChild(avatar);
      var meta = el('div', 'testimonial-meta');
      meta.appendChild(el('span', 'testimonial-name', t.name));
      meta.appendChild(el('span', 'testimonial-title', t.title));
      author.appendChild(avatarWrap);
      author.appendChild(meta);
      card.appendChild(author);

      track.appendChild(card);
    });
  }

  function renderCta() {
    var heading = document.getElementById('ctaHeading');
    heading.innerHTML =
      data.cta.heading + ' <span class="script-accent">' + data.cta.accent + '</span> ' + data.cta.headingEnd;
    document.getElementById('ctaBody').textContent = data.cta.body;
    document.getElementById('ctaBgWord').textContent = data.cta.bgWord;
  }

  function renderSocial(containerId, isFooter) {
    var container = document.getElementById(containerId);
    Object.keys(data.social).forEach(function (key) {
      var url = data.social[key];
      var li = el('li');
      var a = el('a', null, svg(SOCIAL_ICONS[key], '0 0 24 24', true) + (isFooter ? '' : '<span>' + capitalize(key) + '</span>'));
      a.href = url;
      a.setAttribute('aria-label', capitalize(key) + ' profile');
      if (url && url.indexOf('http') === 0) {
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
      }
      li.appendChild(a);
      container.appendChild(li);
    });
  }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function renderContact() {
    document.getElementById('contactBlurb').textContent =
      'Based in ' + data.profile.heroMeta[0] + '. Open to freelance work and interesting collaborations.';
    renderSocial('socialList', false);
    renderSocial('footerSocialList', true);
  }

  function renderAll() {
    renderProfile();
    renderWhatIDo();
    renderAbout();
    renderSkills();
    renderExperience();
    renderAchievements();
    renderCaseStudies();
    renderTestimonials();
    renderCta();
    renderContact();
  }

  renderAll();

  /* ===========================================================
     Pinned scroll decks — GSAP ScrollTrigger

     Both the Case Studies and Experience sections pin themselves
     to the viewport and hand their card transitions over to the
     scroll position (scrubbed, never snapped). When GSAP is
     unavailable or the visitor prefers reduced motion, the whole
     thing degrades to a plain stacked list via .stacks-static.
  =========================================================== */
  var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* Shallow copy of `base` with `extra` layered on top — keeps the
     shared card states below readable without mutating them. */
  function merge(base, extra) {
    var out = {};
    var key;
    for (key in base) {
      if (Object.prototype.hasOwnProperty.call(base, key)) out[key] = base[key];
    }
    for (key in extra) {
      if (Object.prototype.hasOwnProperty.call(extra, key)) out[key] = extra[key];
    }
    return out;
  }

  function cardsIn(stageId) {
    var stage = document.getElementById(stageId);
    if (!stage) return [];
    return Array.prototype.slice.call(stage.children);
  }

  /* Which card owns the screen at timeline time `t`. */
  function indexAt(switchTimes, t) {
    var index = 0;
    for (var i = 0; i < switchTimes.length; i++) {
      if (t >= switchTimes[i]) index = i;
    }
    return index;
  }

  function setActiveIndex(cards, progressEl, index) {
    if (progressEl.getAttribute('data-index') === String(index)) return;
    progressEl.setAttribute('data-index', String(index));

    cards.forEach(function (card, i) {
      card.classList.toggle('is-active', i === index);
    });

    var dots = progressEl.querySelectorAll('.stack-dot');
    Array.prototype.forEach.call(dots, function (dot, i) {
      dot.classList.toggle('is-active', i === index);
    });

    var current = progressEl.querySelector('.stack-count-current');
    if (current) current.textContent = pad(index + 1);
  }

  /* Clicking a progress dot scrolls to that card's slice of the pin range. */
  function wireProgressJumps(progressEl, trigger, switchTimes, duration) {
    progressEl.addEventListener('click', function (e) {
      var dot = e.target.closest ? e.target.closest('.stack-dot') : null;
      if (!dot) return;

      var i = Number(dot.getAttribute('data-index')) || 0;
      var ratio = duration ? switchTimes[i] / duration : 0;
      /* Nudge just past the switch point so the target card is fully settled. */
      var range = trigger.end - trigger.start;
      var top = trigger.start + range * Math.min(ratio + 0.02, 1);
      window.scrollTo({ top: top, behavior: motionQuery.matches ? 'auto' : 'smooth' });
    });
  }

  /* -----------------------------------------------------------
     Case studies: cards rise from below, the active one drifts
     from 1.0 to 1.03, and the outgoing card lifts, blurs and fades.
  ----------------------------------------------------------- */
  function buildCaseStudyDeck() {
    var pin = document.getElementById('csPin');
    var progressEl = document.getElementById('csProgress');
    var cards = cardsIn('caseStudyStage');
    if (!pin || cards.length < 2) return;

    /* autoAlpha rather than opacity: it flips visibility:hidden at 0, so the
       four off-screen cards stop being painted and blurred every frame. */
    var DWELL = 0.55;
    var enter = { yPercent: 105, scale: 0.92, autoAlpha: 0, filter: 'blur(14px)' };
    var active = { yPercent: 0, scale: 1, autoAlpha: 1, filter: 'blur(0px)' };
    var settled = { yPercent: 0, scale: 1.03, autoAlpha: 1, filter: 'blur(0px)' };
    var exit = { yPercent: -14, scale: 0.94, autoAlpha: 0, filter: 'blur(12px)' };

    cards.forEach(function (card, i) {
      gsap.set(card, merge(i === 0 ? active : enter, { zIndex: i + 1 }));
    });

    var tl = gsap.timeline({ defaults: { ease: 'none' } });
    var switchTimes = [0];

    tl.to(cards[0], merge(settled, { duration: DWELL }), 0);

    for (var i = 1; i < cards.length; i++) {
      var at = tl.duration();
      tl.fromTo(cards[i - 1], settled, merge(exit, { duration: 1 }), at);
      tl.fromTo(cards[i], enter, merge(active, { duration: 1 }), at);
      tl.to(cards[i], merge(settled, { duration: DWELL }), at + 1);
      switchTimes.push(at + 0.5);
    }

    /* Hold on the final card before the section releases the scroll. */
    tl.to({}, { duration: 0.4 });

    var duration = tl.duration();

    var trigger = ScrollTrigger.create({
      animation: tl,
      trigger: pin,
      start: 'top top',
      end: function () {
        return '+=' + Math.round(cards.length * window.innerHeight * 0.9);
      },
      pin: pin,
      pinSpacing: true,
      anticipatePin: 1,
      scrub: 0.7,
      invalidateOnRefresh: true,
      onUpdate: function (self) {
        setActiveIndex(cards, progressEl, indexAt(switchTimes, duration * self.progress));
      }
    });

    wireProgressJumps(progressEl, trigger, switchTimes, duration);
  }

  /* -----------------------------------------------------------
     Experience: a layered 3D deck. `depth` is a card's distance
     from the active slot — 0 is centre stage, positive is waiting
     behind, negative is already seen (rotated back and faded out).
  ----------------------------------------------------------- */
  function experienceState(depth) {
    if (depth === 0) {
      return { yPercent: 0, z: 0, scale: 1, rotateX: 0, autoAlpha: 1, filter: 'blur(0px)', zIndex: 60 };
    }

    if (depth < 0) {
      return {
        yPercent: -26,
        z: -260,
        scale: 0.88,
        rotateX: -16,
        autoAlpha: 0,
        filter: 'blur(12px)',
        zIndex: Math.max(1, 10 + depth)
      };
    }

    /* Only three cards are ever visible behind the active one. Offsets are
       generous on purpose — the cards are near-opaque, so a small peek
       would read as a shadow rather than as a stack. */
    var d = Math.min(depth, 3);
    var offsets = [0, 17, 30, 40];
    var opacities = [1, 0.78, 0.42, 0.18];
    var blurs = [0, 1.5, 3.5, 5.5];
    return {
      yPercent: offsets[d],
      z: -70 * d,
      scale: 1 - 0.015 * d,
      rotateX: 4 * d,
      autoAlpha: depth > 3 ? 0 : opacities[d],
      filter: 'blur(' + blurs[d] + 'px)',
      zIndex: 60 - d
    };
  }

  /* One scroll step: every card shifts one slot forward in the deck. */
  function addExperienceStep(tl, cards, step, at, duration) {
    cards.forEach(function (card, i) {
      tl.fromTo(
        card,
        experienceState(i - step),
        merge(experienceState(i - step - 1), { duration: duration }),
        at
      );
    });
  }

  function buildExperienceDeck() {
    var pin = document.getElementById('expPin');
    var progressEl = document.getElementById('expProgress');
    var cards = cardsIn('experienceStage');
    if (!pin || cards.length < 2) return;

    var STEP = 1;
    var HOLD = 0.45;

    cards.forEach(function (card, i) {
      gsap.set(card, experienceState(i));
    });

    var tl = gsap.timeline({ defaults: { ease: 'none' } });
    var switchTimes = [0];

    for (var s = 0; s < cards.length - 1; s++) {
      var at = HOLD + s * (STEP + HOLD);
      addExperienceStep(tl, cards, s, at, STEP);
      switchTimes.push(at + STEP * 0.5);
    }

    tl.to({}, { duration: HOLD });

    var duration = tl.duration();

    var trigger = ScrollTrigger.create({
      animation: tl,
      trigger: pin,
      start: 'top top',
      end: function () {
        return '+=' + Math.round(cards.length * window.innerHeight * 0.85);
      },
      pin: pin,
      pinSpacing: true,
      anticipatePin: 1,
      scrub: 0.7,
      invalidateOnRefresh: true,
      onUpdate: function (self) {
        setActiveIndex(cards, progressEl, indexAt(switchTimes, duration * self.progress));
      }
    });

    wireProgressJumps(progressEl, trigger, switchTimes, duration);
  }

  function initStacks() {
    if (!window.gsap || !window.ScrollTrigger || motionQuery.matches) {
      document.body.classList.add('stacks-static');
      return;
    }

    window.gsap.registerPlugin(window.ScrollTrigger);
    buildCaseStudyDeck();
    buildExperienceDeck();

    /* Late-loading webfonts change card heights, so re-measure once settled. */
    window.addEventListener('load', function () {
      window.ScrollTrigger.refresh();
    });
  }

  initStacks();

  /* ===========================================================
     Smooth anchor scrolling

     Done in JS rather than `html { scroll-behavior: smooth }`
     because that CSS also applies to ScrollTrigger's own pin
     corrections, which makes pinned sections judder.
  =========================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var hash = link.getAttribute('href');
      if (!hash || hash === '#') return;

      var target = document.querySelector(hash);
      if (!target) return;

      e.preventDefault();

      /* Pinned sections start flush with the viewport top (they carry
         their own header padding); everything else clears the header. */
      var offset = target.classList.contains('stack-section')
        ? 0
        : parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 76;

      var top = window.pageYOffset + target.getBoundingClientRect().top - offset + 1;
      window.scrollTo({ top: top, behavior: motionQuery.matches ? 'auto' : 'smooth' });
      if (history.replaceState) history.replaceState(null, '', hash);
    });
  });

  /* ===========================================================
     Theme toggle (defaults to light; persists choice in localStorage)
  =========================================================== */
  var root = document.documentElement;
  var THEME_KEY = 'portfolio-theme';
  var themeToggle = document.getElementById('themeToggle');

  function applyTheme(theme) {
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      themeToggle.setAttribute('aria-pressed', 'true');
      themeToggle.setAttribute('aria-label', 'Switch to light mode');
    } else {
      root.removeAttribute('data-theme');
      themeToggle.setAttribute('aria-pressed', 'false');
      themeToggle.setAttribute('aria-label', 'Switch to dark mode');
    }
  }

  var storedTheme = null;
  try {
    storedTheme = localStorage.getItem(THEME_KEY);
  } catch (e) {
    storedTheme = null;
  }

  applyTheme(storedTheme === 'dark' ? 'dark' : 'light');

  themeToggle.addEventListener('click', function () {
    var isDark = root.getAttribute('data-theme') === 'dark';
    var next = isDark ? 'light' : 'dark';
    applyTheme(next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch (e) {
      /* localStorage unavailable; theme just won't persist */
    }
  });

  /* ===========================================================
     Mobile hamburger menu
  =========================================================== */
  var navToggle = document.getElementById('navToggle');
  var navMenu = document.getElementById('navMenu');

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
    if (navMenu.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  navMenu.querySelectorAll('.nav-link').forEach(function (link) {
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
    if (!isClickInside && navMenu.classList.contains('open')) {
      closeMenu();
    }
  });

  /* ===========================================================
     Scroll reveal (runs after dynamic render so nodes exist)
  =========================================================== */
  /* .exp-card and .cs-card are driven by ScrollTrigger (see initStacks) so
     they're excluded here — two transform-based animations fighting over the
     same property would cancel each other out. */
  var revealTargets = document.querySelectorAll(
    '.stat-card, .achievement-card, .testimonial-card, .skill-bar'
  );

  revealTargets.forEach(function (el) {
    el.setAttribute('data-reveal', '');
  });

  var skillFills = document.querySelectorAll('.skill-fill');
  var prefersReducedMotion = motionQuery.matches;

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealTargets.forEach(function (target) {
      observer.observe(target);
    });

    var fillObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            fillObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    skillFills.forEach(function (target) {
      fillObserver.observe(target);
    });
  } else {
    revealTargets.forEach(function (target) {
      target.classList.add('in-view');
    });
    skillFills.forEach(function (target) {
      target.classList.add('in-view');
    });
  }

  /* ===========================================================
     Contact form validation (front-end only demo, no backend)
  =========================================================== */
  var form = document.getElementById('contactForm');
  var formStatus = document.getElementById('formStatus');
  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setFieldError(fieldId, message) {
    var field = document.getElementById(fieldId);
    var errorEl = document.getElementById(fieldId + 'Error');
    var group = field.closest('.form-group');

    if (message) {
      group.classList.add('has-error');
      errorEl.textContent = message;
      field.setAttribute('aria-invalid', 'true');
    } else {
      group.classList.remove('has-error');
      errorEl.textContent = '';
      field.removeAttribute('aria-invalid');
    }
    return !message;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var name = document.getElementById('name').value.trim();
    var email = document.getElementById('email').value.trim();
    var message = document.getElementById('message').value.trim();

    var validName = setFieldError('name', name ? '' : 'Please enter your name.');
    var validEmail = setFieldError(
      'email',
      !email ? 'Please enter your email.' : !emailPattern.test(email) ? 'Please enter a valid email address.' : ''
    );
    var validMessage = setFieldError('message', message ? '' : 'Please enter a message.');

    if (!validName || !validEmail || !validMessage) {
      formStatus.textContent = 'Please fix the errors above and try again.';
      formStatus.className = 'form-status error';
      var firstInvalid = form.querySelector('[aria-invalid="true"]');
      if (firstInvalid) {
        firstInvalid.focus();
      }
      return;
    }

    /* No backend is wired up; this simply simulates a successful submission. */
    formStatus.textContent = 'Thanks, ' + name + '! Your message has been sent.';
    formStatus.className = 'form-status success';
    form.reset();
  });
})();
