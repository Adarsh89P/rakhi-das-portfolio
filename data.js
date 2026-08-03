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
      { label: 'Meet kai', href: '#home' },
      { label: 'Book online', href: '#footer' }
    ],
    right: [
      { label: 'Photo Gallery', href: '#gallery' },
      { label: 'Contact', href: '#footer' }
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
    photo: 'public/rakhi-portrait-cutout.png',
    photoAlt: 'Rakhi Das, UI/UX Designer'
  },

  works: {
    eyebrow: 'My Works',
    heading: 'Projects you need to see',
    ctaLabel: 'See All',
    ctaHref: '#',
    /*
      Each project renders as a full-width row (the first two) or paired
      side-by-side (the rest, two per row). `color` fills the image box
      until a real screenshot is supplied via an optional `image` url.
      `href` is where the hover arrow / whole image tile links to —
      point it at a real case-study page any time; '#' until then.
    */
    projects: [
      {
        heading: 'SaaS Dashboard Redesign',
        dateRange: 'Mar 2025 – Jul 2025',
        description: 'Redesigned a complex analytics dashboard to simplify navigation and improve task completion for enterprise users.',
        color: '#49acea',
        image: '',
        href: '#'
      },
      {
        heading: 'Mobile Banking Onboarding',
        dateRange: 'Jan 2024 – Nov 2024',
        description: 'Streamlined the onboarding journey for a fintech mobile app, reducing drop-off through iterative usability testing.',
        color: '#fedfe7',
        image: '',
        href: '#'
      },
      {
        heading: 'E-Commerce Usability Audit',
        dateRange: 'Jun 2023 – Sep 2023',
        description: 'Ran a heuristic evaluation and proposed a refreshed component library to improve consistency across the platform.',
        color: '#c4e8ff',
        image: '',
        href: '#'
      },
      {
        heading: 'Add your fourth case study',
        dateRange: 'Add a date range',
        description: 'Add a short summary of the problem, your approach, and the outcome for this project.',
        color: '#ffe9d1',
        image: '',
        href: '#'
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
        logo: '',
        color: 'var(--exp-blue)',
        description: 'Designing research-led product experiences for a fast-moving startup, from first interview to shipped interface.'
      },
      {
        role: 'Associate UI/UX Designer',
        company: 'Fortmindz',
        dateRange: 'Jun 2023 – Feb 2025',
        logoLetter: 'F',
        logo: '',
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
        logo: '',
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
    headingPre: 'An Artistic Expedition Awaits in ',
    headingHighlight: 'My Gallery',
    paragraph: "A few frames from outside the design tools — travel, light and moments worth keeping. Swap these placeholder tiles for real photos any time by adding an `image` url in data.js.",
    /* `size` controls the tile's footprint in the collage grid: tall | wide | normal.
       `alt` only matters once `image` is filled in — give it a real description then. */
    tiles: [
      { size: 'tall', color: '#e7d9c9', image: '', alt: '' },
      { size: 'normal', color: '#d8c9e0', image: '', alt: '' },
      { size: 'wide', color: '#c9dce0', image: '', alt: '' },
      { size: 'normal', color: '#e0d3c9', image: '', alt: '' },
      { size: 'tall', color: '#d0dde5', image: '', alt: '' },
      { size: 'normal', color: '#e5d6d0', image: '', alt: '' }
    ]
  },

  /* Order matches the Figma reference: X, Facebook, Instagram, LinkedIn. */
  social: {
    twitter: '#',
    facebook: '#',
    instagram: '#',
    linkedin: 'https://www.linkedin.com/in/rakhi-das-183381158/'
  },

  footer: {
    watermark: 'Rakhi.UX',
    heading: "Want to get in touch? I'd love to connect with you!",
    tagline: "I'm currently open to full-time opportunities! Let's create something amazing together! ✨",
    avatar: 'public/rakhi-portrait.png',
    avatarAlt: 'Rakhi Das',
    cvHref: '',
    copyright: 'Rakhi Das • Built with pixels, prototypes, and plenty of late-night ideas.'
  }
};
