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
    paperclip: '<path d="M8 12.5V7a4 4 0 0 1 8 0v9a2.5 2.5 0 0 1-5 0V8"></path>'
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

  function renderExperience() {
    var track = document.getElementById('experienceTrack');
    /* Alternating rotation/lift per card gives the scattered "fan" look; cycles every 4 cards. */
    var rotations = [-4, 3, -3, 4];
    var lifts = [0, 16, 4, 20];

    data.experience.forEach(function (job, index) {
      var card = el('article', 'experience-card');
      card.style.setProperty('--rot', rotations[index % rotations.length] + 'deg');
      card.style.setProperty('--lift', lifts[index % lifts.length] + 'px');
      card.style.zIndex = String(data.experience.length - index);

      var head = el('div', 'experience-card-head');
      head.appendChild(el('span', 'experience-logo-chip', job.logoLetter));
      head.appendChild(el('span', 'experience-date', job.date));
      card.appendChild(head);

      card.appendChild(el('h3', null, job.role));
      card.appendChild(el('p', 'timeline-company', job.company));

      card.appendChild(el('p', 'experience-description', job.bullets.join(' ')));

      track.appendChild(card);
    });

    var prevBtn = document.getElementById('experiencePrev');
    var nextBtn = document.getElementById('experienceNext');
    var scrollAmount = function () {
      var card = track.querySelector('.experience-card');
      return card ? card.getBoundingClientRect().width + 24 : 320;
    };
    prevBtn.addEventListener('click', function () {
      track.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
    });
    nextBtn.addEventListener('click', function () {
      track.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
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

  function renderCaseStudies() {
    var tablist = document.getElementById('caseStudyTablist');
    var panelsWrap = document.getElementById('caseStudyPanels');
    var tabs = [];
    var panels = [];

    function activate(activeIndex) {
      tabs.forEach(function (tab, i) {
        var isActive = i === activeIndex;
        tab.classList.toggle('is-active', isActive);
        tab.setAttribute('aria-selected', String(isActive));
        tab.tabIndex = isActive ? 0 : -1;
        panels[i].hidden = !isActive;
      });
    }

    data.projects.forEach(function (project, index) {
      var tabId = 'cs-tab-' + index;
      var panelId = 'cs-panel-' + index;

      var tab = el('button', 'case-study-tab', project.tabLabel || project.number);
      tab.type = 'button';
      tab.id = tabId;
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-controls', panelId);
      tab.setAttribute('aria-selected', 'false');
      tab.tabIndex = -1;
      tab.addEventListener('click', function () {
        activate(index);
      });
      tab.addEventListener('keydown', function (e) {
        var lastIndex = tabs.length - 1;
        var nextIndex = null;
        if (e.key === 'ArrowRight') nextIndex = index === lastIndex ? 0 : index + 1;
        if (e.key === 'ArrowLeft') nextIndex = index === 0 ? lastIndex : index - 1;
        if (e.key === 'Home') nextIndex = 0;
        if (e.key === 'End') nextIndex = lastIndex;
        if (nextIndex !== null) {
          e.preventDefault();
          activate(nextIndex);
          tabs[nextIndex].focus();
        }
      });
      tablist.appendChild(tab);
      tabs.push(tab);

      var panel = el('div', 'case-study-panel');
      panel.id = panelId;
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', tabId);
      panel.hidden = true;

      var head = el('div', 'project-stack-head');
      head.appendChild(el('span', 'project-number', project.number));
      head.appendChild(el('span', 'project-year', project.year));
      panel.appendChild(head);

      panel.appendChild(el('h3', null, project.title));

      var tagList = el('div', 'tag-list');
      project.tags.forEach(function (tag) {
        tagList.appendChild(el('span', 'tag', tag));
      });
      panel.appendChild(tagList);

      panel.appendChild(el('p', null, project.description));

      var links = el('div', 'project-links');
      if (project.status === 'soon') {
        var lockPill = el('span', 'project-lock', svg(ICONS.lock) + '<span>Coming Soon</span>');
        links.appendChild(lockPill);
      } else {
        var demo = el('a', 'project-link', 'Live Demo');
        demo.href = project.links.demo;
        var caseStudy = el('a', 'project-link', 'Case Study');
        caseStudy.href = project.links.case;
        links.appendChild(demo);
        links.appendChild(caseStudy);
      }
      panel.appendChild(links);

      panelsWrap.appendChild(panel);
      panels.push(panel);
    });

    activate(0);
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
  var revealTargets = document.querySelectorAll(
    '.stat-card, .experience-card, .achievement-card, .testimonial-card, .skill-bar'
  );

  revealTargets.forEach(function (el) {
    el.setAttribute('data-reveal', '');
  });

  var skillFills = document.querySelectorAll('.skill-fill');
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
