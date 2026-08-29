/*
  Single source of truth for all portfolio content.
  Edit this file to re-skin the site for a different person/brand —
  index.html, styles.css and script.js do not need to change.
*/
var PORTFOLIO_DATA = {

  meta: {
    title: 'Rakhi Das | UI/UX Designer',
    description: 'Portfolio of Rakhi Das, a UI/UX Designer based in Kolkata, India specializing in usability testing, heuristic evaluation, and intuitive product design.'
  },

  profile: {
    logoFirst: 'Rakhi',
    logoLast: '.UX',
    name: 'Rakhi Das',
    jobTitle: 'UI/UX Designer',
    email: 'dasrakhi303@gmail.com'
  },

  /* Nav links either side of the centered logo, left-to-right. Kept to three
     a side so the two groups balance around the wordmark.

     The page has six destinations and the nav used to name two of them, so
     Work, Experience and Contact were the sections a visitor had to find by
     scrolling. Behance came out to make room: it is still reachable from the
     footer icons and from 'View more projects' at the end of the work list,
     and an outbound link is the one thing a site nav should not spend a slot
     on. Contact points at the footer, which is where the email and CV live. */
  nav: {
    left: [
      { label: 'Home', href: '#home' },
      { label: 'About', href: '#about' },
      { label: 'Work', href: '#works' }
    ],
    right: [
      { label: 'Experience', href: '#experience' },
      { label: 'Contact', href: '#footer' },
      { label: 'Resume', href: 'public/works/Rakhi_Das_UIUX_Designer_Resume.pdf' }
    ]
  },

  hero: {
    /* Top line: an icon glyph + two differently-coloured words. */
    badgeIcon: '✦',
    badgeWord: 'Product',
    badgeWordMuted: 'Designer',
    /* Bottom line: a sentence with one gradient-highlighted word. */
    headlinePre: 'I design products that feels ',
    headlineHighlight: 'simple',
    headlinePost: ', even when they are not.',
    photo: 'public/hero/rakhi-portrait-cutout.png',
    photoAlt: 'Rakhi Das, UI/UX Designer',
    /* The splash uses its own square, closer crop; falls back to `photo`. */
    introPhoto: 'public/hero/rakhi-portrait-cutout.png'
  },

  /* A short introduction between the hero and the work, and where the nav's
     "About" link lands. The first paragraph is set larger than the rest — it
     is the one line a visitor who reads nothing else should still come away
     with. Every word fades in as the section scrolls up. */
  about: {
    eyebrow: 'About Me',
    /* `{...}` marks an accented run. Plain text rather than HTML so the copy
       stays editable here without markup in it — fadeParagraph in script.js
       turns each word into its own span either way, which is what the
       scroll-driven word fade needs. */
    lead: 'I turn complex workflows into calm, clear products that scale with {intention}.',
    /* Renders under the lead in smaller, lighter type. */
    paragraphs: [
      '4 years designing research-led experiences — sweating the quiet details, from empty states to {design systems}, that make a product feel effortless.'
    ],
    /* Capability pills under the copy. Order is deliberate: tools first, then
       research, then the craft — it reads as a working sequence rather than
       an alphabetised dump. */
    skills: [
      'Figma',
      'User Research',
      'Design Systems',
      'Prototyping',
      'Wireframing',
      'Usability Testing',
      'Interaction Design',
      'Design Tokens'
    ]
  },

  works: {
    /* The eyebrow names the section on its own — there is no heading row
       under it any more, so the projects start straight after the rule. */
    eyebrow: 'My Works',
    /* The closing link under the last row — where the projects that did not
       make the cut live. */
    ctaMore: { label: 'View more projects', href: 'https://www.behance.net/rakhidas1' },
    /*
      `fullWidth: true` gives a project a row of its own; everything without
      it pairs up two to a row, in order — so the ones you most want seen go
      first and get the flag.

      `video` wins if present, and must be a real video file — it takes a
      16:9 frame and `image` becomes its poster.

      Otherwise `image` is the artwork and it fills its frame edge to edge.
      Author it at the frame's shape so nothing is lost: 1314x580 for a
      full-width project, 629x580 for a paired one.
      `color` backs the frame while the image loads and shows through any
      transparency, so keep it close to the artwork's own background.

      `fit: 'contain'` is the escape hatch for artwork that is *not* the
      frame's shape: it shows the whole image, letterboxed against `color`,
      instead of cropping it to fill. Prefer re-exporting at the frame's
      shape — this exists for the cases where the source can't be re-cut.

      `href` is the case study link, carried by both the title and the
      artwork — point it at a real page any time; '#' leaves the title as
      plain text and the frame as a plain div rather than linking nowhere.
    */
    /* Unused while the layout has no CTA button under each project; kept so
       the button can come back without re-authoring its label. */
    ctaProjectLabel: 'Read case study',
    projects: [
      {
        fullWidth: true,
        /* Was 'SaaS Dashboard Redesign', which named the wrong category —
           the case study behind this card is a healthcare diagnostic
           ecosystem — and hid the one fact that makes it worth opening: it is
           five products, not a dashboard. */
        heading: 'Suraksha — Diagnostic Ecosystem',
        dateRange: 'Mar 2025 – Jul 2025',
        description: 'Five connected products — patient app, front desk and admin dashboards, home collector app and website — redesigned into one diagnostic system for patients, technicians and administrators.',
        /* The plate colour behind the layers — the original export's own
           background, sampled from it rather than picked. */
        color: '#0044c5',
        /* The layered hero, in paint order. Replaces the flattened
           Frame21.png export: each product surface is its own element, so it
           can be positioned and animated independently and the composition
           can be rebuilt for small screens instead of shrunk.

           `depth` is that layer's share of the pointer's travel (hero.js);
           `float` gives a layer the idle drift. Positions and the two
           compositions live in hero.css — this is just what is in the picture.

           `webp` is set only on the three layers where WebP actually beats
           PNG. It is not a blanket win here: the dashboard and the patient
           card are flat-fill UI with sharp text, which PNG's filtering
           compresses better — re-encoding them cost 24% and 29% respectively.
           The device shots have photographic content and gain 42-51%.

           Shared by the case study banner, which renders the same list. */
        layers: [
          { name: 'dash',   src: 'public/Surksha/banner/dash.png',      w: 1700, h: 816, depth: 0.35 },
          { name: 'table',  src: 'public/Surksha/banner/table.png',     w: 448,  h: 436, depth: 0.55, webp: 'public/Surksha/banner/table.webp' },
          { name: 'card',   src: 'public/Surksha/banner/card.png',      w: 824,  h: 883, depth: 0.7 },
          { name: 'phones', src: 'public/Surksha/banner/phone.png',     w: 845,  h: 658, depth: 1, float: true, webp: 'public/Surksha/banner/phone.webp' },
          /* Small screens only: the middle device cut out of the strip above,
             the one phone in it with an unoccluded silhouette. */
          { name: 'app',    src: 'public/Surksha/banner/phone-app.png', w: 319,  h: 658, depth: 1, float: true, webp: 'public/Surksha/banner/phone-app.webp' }
        ],
        href: 'suraksha_case_study.html'
      },
      {
        fullWidth: true,
        heading: 'Yoga All-in-One Elevate Health & Serenity.',
        dateRange: 'Jan 2024 – Nov 2024',
        description: 'A unified app offering guided yoga sessions, personalized routines, progress tracking, and a calming, intuitive experience to support a consistent wellness journey',
        /* Sampled from the artwork's own top and bottom edge rows (#f6c9c9 and
           #f4c3b6), not picked from the pastel set: below 608px this artwork
           is letterboxed rather than cropped, so `color` becomes a visible mat
           either side of it. The previous #fedfe7 was 60-87 off those edges
           and drew a seam across the tile; this is within 14. On desktop the
           image covers the whole frame, so the mat is never seen there. */
        color: '#f5c6c0',
        image: 'public/MobileBanking/yogaapp.jpg',
        href: 'https://www.behance.net/gallery/227695287/Yoga-Lifestyle'
      },
      {
        fullWidth: true,
        heading: 'Influencer Marketing Platform',
        dateRange: 'Jan 2023 - Sept 2023',
        description: 'Designed a centralized platform to simplify influencer–brand collaboration, from discovery and communication to payments and campaign tracking.',
        /* The one artwork not authored at the frame's 1314x580: it is
           1032x580, so `cover` had to scale it up 1.27x to fill the width
           and lost ~21% off the top and bottom. `fit: 'contain'` shows it
           whole instead, and `color` is the artwork's own background blue
           so the side margins read as the composition continuing rather
           than as empty frame. */
        color: '#006aff',
        fit: 'contain',
        image: 'public/InfluencerMarketing/chekky.png',
        href: 'https://www.figma.com/deck/7Z5C9KMnP7e2YqW3y3xLEM/Cheeky?node-id=2-1411&t=EG6GvTgBjcCRHNGp-1&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1'
      },
      {
        heading: 'Malta Taxi App 🚖 ',
        dateRange: 'Jan 2024 - July 2024',
        description: 'Reduced UI inconsistencies, aligned four product teams, and accelerated product delivery through a scalable design system.',
        color: '#c4e8ff',
        image: 'public/E-Commerce/maltaapp.png',
        href: 'https://www.figma.com/deck/G1rWYCuzvK9zAcaNAPnUlp/Malta-Taxi-App-%F0%9F%9A%96?node-id=3-135&t=P6Jhoz7hQMnUGJhQ-1&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1'
      },
      {
        heading: 'Mobile Banking Onboarding',
        dateRange: 'Nov 2025 - Nov 2025',
        description: 'Redesigned QIIB’s digital banking experience with a scalable design system, creating a more consistent and intuitive experience across products.',
        color: '#ffe9d1',
        image: 'public/Banking/bankingOnboarding.png',
        href: 'https://www.figma.com/deck/H9bCGMIJ1tQf27i2qyglc7/Mobile-Banking-Onboarding?node-id=1-152&t=J5FDokLa6WodmhZT-1&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1'
      }
    ]
  },

  experience: {
    eyebrow: 'My Journey',
    heading: "Where I've worked",
    /* `logoLetter` renders as a lettermark badge; swap in a real `logo`
       image url per item any time (falls back to the letter until then).
       `color` is one of the site's 4 card tints (see --exp-lilac/-blush/
       -pink below) — cards cascade in a fanned stack, so keep them varied. */
    items: [
      {
        role: 'Associate UI/UX Designer',
        company: 'Sundew',
        dateRange: 'Dec 2024 – Present',
        logoLetter: 'S',
        logo: 'public/logos/sundew.png',
        color: 'var(--exp-lilac)',
        description: 'Designing research-led product experiences for a fast-moving startup, from first interview to shipped interface.'
      },
      {
        role: 'Associate UI/UX Designer',
        company: 'Fortmindz',
        dateRange: 'Jun 2023 – Feb 2025',
        logoLetter: 'F',
        logo: 'public/logos/Fortmindz.png',
        color: 'var(--exp-cream)',
        description: 'Owned interface design for web and mobile products, backed by a reusable component library.'
      },
      {
        role: 'User Experience Designer',
        company: 'Pixel Consultancy',
        dateRange: 'Nov 2022 – Jun 2023',
        logoLetter: 'P',
        logo: '',
        color: 'var(--exp-blush)',
        description: 'Translated client briefs into interactive prototypes that made design decisions easy to review.'
      },
      {
        role: 'Jr. Implementation Associate',
        company: 'Granicus',
        dateRange: 'Oct 2020 – Feb 2023',
        logoLetter: 'G',
        logo: 'public/logos/Granicus.png',
        color: 'var(--exp-stone)',
        description: 'Client-facing implementation work that became the foundation for a move into UX design.'
      }
    ]
  },

  testimonials: {
    eyebrow: 'TESTIMONIALS',
    headingPre: "But don't just take our ",
    headingHighlight: 'word for it.',
    /* `color` fills the placeholder photo tile until a real headshot is supplied via `image`. */
    items: [
      { quote: 'Rakhi has a rare ability to turn a vague product idea into something the whole team can rally around. Her research is thorough and her interfaces are always clean and considered.', name: 'Add a Name', title: 'Product Manager, Placeholder Co.', color: '#f4d9c6', image: '' },
      { quote: 'Working with Rakhi on our onboarding flow was a great experience — she pushed back on assumptions with real usability data instead of opinions.', name: 'Add a Name', title: 'Engineering Lead, Placeholder Inc.', color: '#dbe7f5', image: '' },
      { quote: 'Detail-oriented, collaborative, and genuinely curious about the people using the product. Exactly who you want in a design review.', name: 'Add a Name', title: 'Founder, Placeholder Startup', color: '#e6dcf2', image: '' },
      { quote: 'Rakhi turns ambiguous briefs into interfaces the whole team trusts on day one. A pleasure to collaborate with.', name: 'Add a Name', title: 'Design Lead, Placeholder Studio', color: '#f5dde0', image: '' }
    ]
  },

  gallery: {
    eyebrow: 'MY GALLERY',
    /* `headingPre` runs straight into the highlighted words, so it has to
       carry its own trailing space — without it the two render as one word. */
    headingPre: 'When I’m Out of Canvas, ',
    headingHighlight: 'My Gallery',
    paragraph: 'A few frames from outside the design tools — travel, light and moments worth keeping.',
    /* Order here is left-to-right along the scrolling strip. Every tile is
       the same shape — roughly 306x265 at full width — and `object-fit:
       cover`, centred, so pick photos whose subject survives a slight crop
       top and bottom. Add as many as you like; the strip times itself from
       its own measured width, so more photos means a longer loop, not a
       faster one.

       `color` shows through until `image` is set, so an unfilled tile stays
       visible rather than collapsing. Fill in `alt` with a real description
       whenever you add an `image`. */
    tiles: [
      { color: '#e7d9c9', image: 'public/gallery/img1.png', alt: 'A whitewashed stone house built into a rust-coloured cliff face, prayer flags strung above it' },
      { color: '#d8c9e0', image: 'public/gallery/img2.png', alt: 'Pine branches in the foreground with a valley town half-swallowed by low cloud behind' },
      { color: '#c9dce0', image: 'public/gallery/img3.png', alt: 'Rakhi in a denim jacket standing on a rock in a wide green glacial valley' },
      { color: '#e0d3c9', image: 'public/gallery/image5.png', alt: 'Cloud spilling over a dark ridgeline at dawn, a corrugated rooftop in the foreground' },
      { color: '#d0dde5', image: 'public/gallery/img4.png', alt: 'Sun rising through a notch between two ridges, power lines crossing the sky' },
      { color: '#e5d6d0', image: 'public/gallery/Rectangle%206.png', alt: 'A timber and stone house beside a village road, snow-dusted peaks catching the evening light' },
      { color: '#dfe0d3', image: 'public/gallery/Rectangle%207.png', alt: 'Rakhi standing with arms outstretched above terraced fields, a hillside monastery in the distance' }
    ]
  },

  /* Key order is render order in the footer fan. Each key must have a
     matching entry in SOCIAL_ICONS (script.js) or it is skipped. */
  /* Only real profiles belong here. An entry whose URL is missing or '#' is
     skipped by the renderer rather than shipped as an icon that goes nowhere,
     so adding a profile is: uncomment the line, paste the URL, done.

     twitter and instagram were both '#' — two dead links in the footer of
     every page. Commented rather than deleted so the handles can come back
     without having to re-derive the key names the icon set expects. */
  social: {
    // twitter: '',
    behance: 'https://www.behance.net/rakhidas1',
    // instagram: '',
    linkedin: 'https://www.linkedin.com/in/rakhi-das-183381158/'
  },

  footer: {
    watermark: 'Rakhi.UX',
    heading: "Want to get in touch? I'd love to connect with you!",
    tagline: "I'm currently open to full-time opportunities! Let's create something amazing together! ✨",
    avatar: 'public/footer/footer-image.png',
    avatarAlt: 'Rakhi Das',
    cvHref: 'public/works/Rakhi_Das_UIUX_Designer_Resume.pdf',
    cvDownloadName: 'Rakhi_Das_UIUX_Designer_Resume.pdf',
    copyright: 'Rakhi Das • Built with pixels, prototypes, and plenty of late-night ideas.'
  }
};
