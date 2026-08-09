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

  /* Nav links either side of the centered logo, left-to-right. */
  nav: {
    left: [
      { label: 'Home', href: '#home' },
      { label: 'About', href: '#about' }
    ],
    right: [
      { label: 'Resume', href: 'public/works/Rakhi_Das_UIUX_Designer_Resume_.pdf' },
      { label: 'Behance', href: 'https://www.behance.net/rakhidas1' }
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
    ctaPrimary: { label: 'Book A Call', href: '#footer' },
    ctaSecondary: { label: 'Get Started', href: '#works' },
    photo: 'public/hero/rakhi-portrait-cutout.png',
    photoAlt: 'Rakhi Das, UI/UX Designer',
    /* The splash uses its own square, closer crop; falls back to `photo`. */
    introPhoto: 'public/hero/rakhi.png'
  },

  /* A short introduction between the hero and the work, and where the nav's
     "About" link lands. The first paragraph is set larger than the rest — it
     is the one line a visitor who reads nothing else should still come away
     with. Every word fades in as the section scrolls up. */
  about: {
    eyebrow: 'About Me',
    lead: "I'm a product designer who loves crafting calm, clear experiences that users love and teams trust. I design with a systems mindset — simplifying complex workflows, elevating visual clarity, and shaping products that scale with intention.",
    /* Renders under the lead in smaller, lighter type. */
    paragraphs: [
      'Most projects start with a conversation and end with something a teammate can reuse: a flow, a pattern, a component with the edge cases already answered.',
      'I care about the quiet decisions — the empty state, the error message, the spacing that makes a dense screen readable — because those are the parts people actually feel.'
    ]
  },

  works: {
    eyebrow: 'My Works',
    heading: 'Projects you need to see',
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
        heading: 'SaaS Dashboard Redesign',
        dateRange: 'Mar 2025 – Jul 2025',
        description: 'Simplifying complex healthcare journeys into intuitive digital experiences for patients, doctors, and administrators.',
        color: '#49acea',
        image: 'public/Surksha/Frame21.png',
        href: 'suraksha_case_study.html'
      },
      {
        fullWidth: true,
        heading: 'Yoga All-in-One Elevate Health & Serenity.',
        dateRange: 'Jan 2024 – Nov 2024',
        description: 'A unified app offering guided yoga sessions, personalized routines, progress tracking, and a calming, intuitive experience to support a consistent wellness journey',
        color: '#fedfe7',
        image: 'public/MobileBanking/yogaapp.jpg',
        href: 'https://www.behance.net/gallery/227695287/Yoga-Lifestyle'
      },
      {
        fullWidth: true,
        heading: 'Influencer Marketing Platform',
        dateRange: 'Jan 2023 - Sept 2023',
        description: 'Designed a centralized platform to simplify influencer–brand collaboration, from discovery and communication to payments and campaign tracking.',
        color: '#f1f2f4',
        image: 'public/unused/chekky.png',
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
       `color` is one of the site's 3 pastel tokens (see --exp-blue/-peach/
       -pink below) — cards cascade in a fanned stack, so keep them varied. */
    items: [
      {
        role: 'Associate UI/UX Designer',
        company: 'Sundew',
        dateRange: 'Dec 2024 – Present',
        logoLetter: 'S',
        logo: 'public/logos/sundew.png',
        color: 'var(--exp-blue)',
        description: 'Designing research-led product experiences for a fast-moving startup, from first interview to shipped interface.'
      },
      {
        role: 'Associate UI/UX Designer',
        company: 'Fortmindz',
        dateRange: 'Jun 2023 – Feb 2025',
        logoLetter: 'F',
        logo: 'public/logos/Fortmindz.png',
        color: 'var(--exp-peach)',
        description: 'Owned interface design for web and mobile products, backed by a reusable component library.'
      },
      {
        role: 'User Experience Designer',
        company: 'Pixel Consultancy',
        dateRange: 'Nov 2022 – Jun 2023',
        logoLetter: 'P',
        logo: '',
        color: 'var(--exp-pink)',
        description: 'Translated client briefs into interactive prototypes that made design decisions easy to review.'
      },
      {
        role: 'Jr. Implementation Associate',
        company: 'Granicus',
        dateRange: 'Oct 2020 – Feb 2023',
        logoLetter: 'G',
        logo: 'public/logos/Granicus.png',
        color: 'var(--exp-blue)',
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
    headingPre: 'When I’m Out of Canvas',
    headingHighlight: 'My Gallery',
    paragraph: "A few frames from outside the design tools — travel, light and moments worth keeping. Swap these placeholder tiles for real photos any time by adding an `image` url in data.js.",
    /* Order here IS position in the collage — the grid places tiles by
       nth-child, so moving an entry moves the photo. Slot shapes below are
       the Figma sizes at 1314px wide; pick photos whose crop suits them,
       since every tile is `object-fit: cover` and centred.

         1. 209x213  square-ish   top-left
         2. 209x256  portrait     bottom-left
         3. 306x485  tall         full-height, left of centre
         4. 216x148  landscape    top strip
         5. 216x148  landscape    top strip
         6. 449x321  landscape    large centre block
         7. 306x485  tall         full-height, far right

       `color` shows through until `image` is set, so unfilled slots stay
       visible rather than collapsing. Fill in `alt` with a real
       description whenever you add an `image`. */
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
  social: {
    twitter: '#',
    behance: 'https://www.behance.net/rakhidas1',
    instagram: '#',
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
