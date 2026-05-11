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
      '2x acceleration in delivery cycles',
      '40% reduction in design-to-production handoff',
      '60% decrease in QA-reported regressions',
    ],
  },
  {
    company: 'MediaMonks',
    role: 'Frontend Developer',
    period: 'Oct 2019 – Dec 2022',
    highlights: [
      'Pixel-perfect implementations for global brand campaigns',
      'Email development expertise (MJML, cross-client compatibility)',
      'Component system architecture',
    ],
  },
    {
    company: 'Buenos Aires City Government',
    role: 'Frontend Developer',
    period: 'May 2016 – Jan 2018',
    highlights: [
      'Built and maintained user-facing web interfaces for internal systems using HTML5, CSS3 (Sass), Bootstrap, and AngularJS',
      '~20% reduction in reported bugs by automating QA flows with Selenium',
      'Managed feature delivery in agile teams using Trello and Git across multiple internal products',
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
