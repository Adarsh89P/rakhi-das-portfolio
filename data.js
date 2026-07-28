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
    eyebrow: "Hey, I'm Rakhi",
    /* Big two-line display headline in the hero, like a giant poster word. */
    heroWordTop: 'product',
    heroWordBottom: 'designer',
    headline: 'UI/UX Designer — crafting intuitive apps & websites',
    bio: 'UI/UX Designer with 4+ years of experience creating intuitive mobile apps, SaaS platforms, and product interfaces. Skilled at turning complex problems into simple, user-friendly solutions through research-driven, user-centered design.',
    availabilityBadge: 'Available for freelance & collab work',
    city: 'Kolkata, India',
    heroMeta: ['Kolkata, India', '4+ Years Experience', '1,000+ Connections'],
    email: 'hello@example.com'
  },

  whatIDo: {
    eyebrow: 'What I Do',
    statementPre: 'I turn messy, real-world problems into products people actually',
    highlight: 'understand',
    statementPost: '— interfaces that feel obvious and details that quietly do the work.',
    stats: [
      { number: '4+', label: 'Years designing', sub: 'consumer apps & enterprise SaaS' },
      { number: '1,034', label: 'Network', sub: 'built across the design community' }
    ]
  },

  about: {
    paragraphs: [
      "I'm a UI/UX Designer based in Kolkata, India, with over four years of experience designing mobile apps, SaaS platforms, and product interfaces for startups and enterprises alike. My work centers on turning complex, ambiguous problems into simple, user-friendly solutions.",
      "I collaborate closely with stakeholders to align design strategy with business goals — helping products drive growth while still delivering meaningful, usable experiences for real people. My process leans heavily on research: heuristic evaluation, usability testing, and iterative prototyping guide every decision I make.",
      "I'm passionate about staying current with design trends and tools, including how AI is reshaping the UX design process, and I'm always looking for fresh perspectives to bring into my work."
    ],
    signature: 'Rakhi'
  },

  stats: [
    { number: '4+', label: 'Years of Experience' },
    { number: '4', label: 'Companies Worked With' },
    { number: '2', label: 'Design Certifications' },
    { number: '1,034', label: 'Professional Connections' }
  ],

  skills: {
    design: [
      { name: 'Figma', value: 95 },
      { name: 'User Research & Usability Testing', value: 92 },
      { name: 'Prototyping', value: 90 },
      { name: 'Adobe XD', value: 88 },
      { name: 'Design Systems', value: 85 },
      { name: 'Adobe Photoshop', value: 80 }
    ],
    frontend: [
      { name: 'HTML5', value: 75 },
      { name: 'CSS3', value: 70 },
      { name: 'JavaScript', value: 60 },
      { name: 'Bootstrap', value: 55 }
    ],
    tags: [
      'Heuristic Evaluation',
      'Interaction Design',
      'Wireframing & Mockups',
      'Design Thinking',
      'Human-Computer Interaction',
      'Case Studies'
    ]
  },

  /*
    Experience slides for the pinned horizontal story.

      number       big editorial numeral shown in the left column ("01", "02"…)
      years        short form of the duration, sits under the numeral
      date         full duration, shown as a chip on the card
      about        one-line company description — placeholder copy, swap in
                   the company's own blurb when you have it
      summary      what *you* did there, in one line
      achievements 3–5 bullets for the right column
      tech         badge row, animated in one at a time
      pattern      background motif: grid | dots | diagonal | rings
      logo         image URL; when empty, `logoLetter` renders as a lettermark
  */
  experience: [
    {
      number: '01',
      date: 'Dec 2024 – Present',
      years: '2024 — Now',
      role: 'Associate UI/UX Designer',
      company: 'Sundew',
      logo: '',
      logoLetter: 'S',
      location: 'Greater Kolkata Area · On-site',
      about: 'A digital product studio where design, engineering and strategy sit in the same room, shipping web and mobile products for client teams.',
      summary: 'Designing research-led product experiences for a fast-moving startup, from first interview to shipped interface.',
      pattern: 'grid',
      tech: ['Figma', 'User Research', 'Design Systems', 'Prototyping'],
      achievements: [
        'Engaged with users to understand their goals, translating insights into effective design solutions.',
        'Worked closely with stakeholders to align design strategies with business commitments.',
        'Developed skills in user research, interface design, and collaboration within a startup environment.'
      ]
    },
    {
      number: '02',
      date: 'Jun 2023 – Feb 2025',
      years: '2023 — 2025',
      role: 'Associate UI/UX Designer',
      company: 'Fortmindz',
      logo: '',
      logoLetter: 'F',
      location: 'Kolkata, West Bengal, India · On-site',
      about: 'A software development company building web and mobile applications for startups and established product teams.',
      summary: 'Owned interface design for web and mobile products, backed by a reusable component library.',
      pattern: 'dots',
      tech: ['Figma', 'Adobe XD', 'Usability Testing', 'Component Library'],
      achievements: [
        'Designed intuitive interfaces for web and mobile applications using research-driven design thinking.',
        'Built and maintained reusable components as part of a broader design system.',
        'Conducted usability testing and iterated on designs based on user feedback.'
      ]
    },
    {
      number: '03',
      date: 'Nov 2022 – Jun 2023',
      years: '2022 — 2023',
      role: 'User Experience Designer',
      company: 'Pixel Consultancy',
      logo: '',
      logoLetter: 'P',
      location: 'Kolkata, India',
      about: 'A design consultancy delivering interface and experience work across a rotating roster of client projects.',
      summary: 'Translated client briefs into interactive prototypes that made design decisions easy to review.',
      pattern: 'diagonal',
      tech: ['Adobe XD', 'Wireframing', 'Interaction Design'],
      achievements: [
        'Turned client briefs into wireframes and design directions the team could review early.',
        'Created interactive prototypes to communicate design concepts to stakeholders.',
        'Applied user-centered design principles across client projects.'
      ]
    },
    {
      number: '04',
      date: 'Oct 2020 – Feb 2023',
      years: '2020 — 2023',
      role: 'Jr. Implementation Associate',
      company: 'Granicus',
      logo: '',
      logoLetter: 'G',
      location: 'Bengaluru, Karnataka, India',
      about: 'A technology company serving public-sector organisations, where implementation teams work directly alongside customers.',
      summary: 'Client-facing implementation work that became the foundation for a move into UX design.',
      pattern: 'rings',
      tech: ['Client Onboarding', 'Problem Solving', 'Communication'],
      achievements: [
        'Supported client implementation and onboarding from kickoff through go-live.',
        'Built a foundation in communication and stakeholder problem-solving.',
        'Used that day-to-day exposure to real users as the springboard into UX design.'
      ]
    }
  ],

  achievements: [
    {
      icon: 'certificate',
      title: 'Using AI in the UX Design Process',
      subtitle: 'LinkedIn Learning · Issued Sep 2025'
    },
    {
      icon: 'badge',
      title: 'UX Design Certification',
      subtitle: 'Accenture (via FutureLearn) · Issued Dec 2024'
    },
    {
      icon: 'star',
      title: '4+ Years in UX Design',
      subtitle: 'Across startups and enterprise product teams.'
    },
    {
      icon: 'network',
      title: '1,000+ Network',
      subtitle: 'Professional connections built across the design community.'
    }
  ],

  /*
    Case studies for the scroll-pinned deck. One card is on screen at a time.
    `image` is optional — leave it empty and a generated gradient hero is used
    instead. `metrics` is optional too; drop the key to hide the metrics row.
  */
  projects: [
    {
      number: '01',
      year: '2025',
      category: 'Enterprise SaaS',
      title: 'SaaS Dashboard Redesign',
      image: '',
      tags: ['Figma', 'User Research', 'Prototyping'],
      description: 'Redesigned a complex analytics dashboard to simplify navigation and improve task completion for enterprise users.',
      metrics: [
        { value: '+38%', label: 'Task completion' },
        { value: '−2.4m', label: 'Time on task' },
        { value: '12', label: 'Usability sessions' }
      ],
      status: 'live',
      links: { demo: '#', case: '#' }
    },
    {
      number: '02',
      year: '2024',
      category: 'Fintech Mobile',
      title: 'Mobile Banking App — Onboarding UX',
      image: '',
      tags: ['Adobe XD', 'Usability Testing', 'Interaction Design'],
      description: 'Streamlined the onboarding journey for a fintech mobile app, reducing drop-off through iterative usability testing.',
      metrics: [
        { value: '−27%', label: 'Drop-off rate' },
        { value: '4 → 2', label: 'Steps to activate' },
        { value: '4.6★', label: 'Store rating' }
      ],
      status: 'live',
      links: { demo: '#', case: '#' }
    },
    {
      number: '03',
      year: '2026',
      category: 'E-Commerce',
      title: 'E-Commerce Usability Audit',
      image: '',
      tags: ['Heuristic Evaluation', 'Wireframing', 'Design Systems'],
      description: 'Ran a heuristic evaluation and proposed a refreshed component library to improve consistency across the platform.',
      metrics: [
        { value: '46', label: 'Issues logged' },
        { value: '10', label: 'Heuristics applied' }
      ],
      status: 'soon',
      links: { demo: '#', case: '#' }
    },
    {
      number: '04',
      year: '—',
      category: 'Add a category',
      title: 'Add your fourth case study title',
      image: '',
      tags: ['Tag one', 'Tag two', 'Tag three'],
      description: 'Add a short summary of the problem, your approach, and the outcome for this project.',
      metrics: [],
      status: 'soon',
      links: { demo: '#', case: '#' }
    },
    {
      number: '05',
      year: '—',
      category: 'Add a category',
      title: 'Add your fifth case study title',
      image: '',
      tags: ['Tag one', 'Tag two', 'Tag three'],
      description: 'Add a short summary of the problem, your approach, and the outcome for this project.',
      metrics: [],
      status: 'soon',
      links: { demo: '#', case: '#' }
    }
  ],

  /* Placeholder recommendations — replace with real testimonials from colleagues or clients. */
  testimonials: [
    {
      quote: 'Rakhi has a rare ability to turn a vague product idea into something the whole team can rally around. Her research is thorough and her interfaces are always clean and considered.',
      name: 'Add a Name',
      title: 'Product Manager, Placeholder Co.'
    },
    {
      quote: 'Working with Rakhi on our onboarding flow was a great experience — she pushed back on assumptions with real usability data instead of opinions.',
      name: 'Add a Name',
      title: 'Engineering Lead, Placeholder Inc.'
    },
    {
      quote: 'Detail-oriented, collaborative, and genuinely curious about the people using the product. Exactly who you want in a design review.',
      name: 'Add a Name',
      title: 'Founder, Placeholder Startup'
    }
  ],

  cta: {
    heading: "Let's build something",
    accent: 'great',
    headingEnd: 'together.',
    body: 'Have a project in mind, an idea that needs a second opinion, or just want to talk design? My inbox is open.',
    bgWord: 'RAKHI'
  },

  /* Replace # with your real GitHub / Twitter / Dribbble profiles. */
  social: {
    linkedin: 'https://www.linkedin.com/in/rakhi-das-183381158/',
    github: '#',
    twitter: '#',
    dribbble: '#'
  },

  footer: {
    name: 'Rakhi Das'
  }
};
