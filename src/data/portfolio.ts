export const projects = [
  {
    title: 'Ampli',
    subtitle: 'Audio Streaming Platform for Creators',
    description:
      'Audio streaming platform for independent creators — currently in active development. Go backend with Gin + pgx/v5, BFF pattern via Next.js, Better Auth with JWKS Ed25519, and a roadmap to async HLS streaming with FFmpeg and AI-powered recommendations.',
    tech: ['Next.js 16', 'React 19', 'TypeScript', 'Go/Gin', 'PostgreSQL', 'Better Auth', 'Prisma', 'Sass', 'Web Audio API'],
    links: [{ label: 'GitHub', href: 'https://github.com/emilianooferreyra/ampli' }],
    year: '2025',
    caseSlug: 'ampli',
  },
  {
    title: 'Óptica Privada',
    subtitle: 'E-commerce for Premium Eyewear',
    description:
      'Full-featured e-commerce platform with payment integration, performance optimization, and conversion-focused UX.',
    tech: ['HTML5', 'CSS3', 'JavaScript', 'Payment Integration', 'Performance Optimization'],
    links: [{ label: 'Live', href: 'https://opticaprivada.com' }],
    year: '2025',
  },
  {
    title: 'Mentha Estudio Creativo',
    subtitle: 'Marketing Agency Website',
    description:
      'Professional website for digital marketing agency with responsive design and CMS integration.',
    tech: ['Responsive Design', 'CMS', 'Performance Optimization'],
    links: [{ label: 'Live', href: 'https://menthaestudiocreativo.com' }],
    year: '2025',
  },
] as const;

export const experience = [
  {
    company: 'Ripio',
    role: 'Frontend Developer',
    period: 'May 2023 – Jan 2024',
    highlights: [
      'Component library architecture (React, TypeScript, LitElement) enabling 2x faster delivery',
      'Reduced design-to-production bottleneck by 40% through Figma automation',
      'Established e2e testing (Cypress) cutting QA regressions by 60%',
    ],
  },
  {
    company: 'MediaMonks',
    role: 'Frontend Developer',
    period: 'Oct 2019 – Dec 2022',
    highlights: [
      'Pixel-perfect campaign implementations for global brands using HTML (Handlebars), TypeScript, Sass, GSAP',
      'Built reusable component system improving render performance and eliminating code duplication',
      'Email development: transactional and marketing newsletters with MJML, cross-client compatibility via Litmus',
    ],
  },
  {
    company: 'Buenos Aires City Government',
    role: 'Frontend Developer',
    period: 'May 2016 – Jan 2018',
    highlights: [
      'Built user-facing web interfaces for internal systems using HTML5, CSS3 (Sass), Bootstrap, AngularJS',
      'Automated QA workflows with Selenium, reducing reported bugs by ~20%',
      'Managed feature delivery in agile teams (Trello, Git) across multiple internal products',
    ],
  },
] as const;

export const stack = {
  preference:
    'JavaScript, TypeScript, React, Next.js, Node.js, Go, PostgreSQL, REST, Docker, Web Audio API',
  exposure:
    'React Native, Python, GraphQL, HLS/DASH, RTMP, FFmpeg',
  ai:
    'Claude Code, Spec-Driven Development (SDD), AI-assisted architecture and code review workflows',
} as const;
