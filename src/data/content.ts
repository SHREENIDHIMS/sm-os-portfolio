export interface Cert {
  icon: string
  name: string
  issuer: string
  detail: string
  color: string
}

export const certs: Cert[] = [
  {
    icon: '🎨',
    name: 'Google UX Design Professional',
    issuer: 'Google — Professional Certificate',
    detail: 'UX Research · Wireframing · Prototyping · Figma',
    color: '#ffcc00',
  },
  {
    icon: '🗄️',
    name: 'SQL: A Practical Introduction for Querying Databases',
    issuer: 'IBM',
    detail: 'SQL · Relational Databases · Data Querying',
    color: '#00ffff',
  },
  {
    icon: '💻',
    name: 'Fundamentals of C Programming',
    issuer: 'FacePrep',
    detail: 'C Language · Data Structures · Algorithms',
    color: '#cc88ff',
  },
]

export const aiTools = [
  { name: 'Claude Code', desc: 'Agentic coding, refactors, repo navigation' },
  { name: 'ChatGPT', desc: 'Research, planning, debugging, docs' },
  { name: 'GitHub Copilot', desc: 'IDE completion, pair programming' },
  { name: 'Cursor', desc: 'AI-first coding and codebase chat' },
  { name: 'Lovable', desc: 'Rapid app prototyping & UI generation' },
  { name: 'n8n', desc: 'Automation flows, webhooks, integrations' },
  { name: 'Firebase', desc: 'Auth, hosting, realtime backends' },
  { name: 'Supabase', desc: 'Postgres backend, auth, storage' },
  { name: 'Vercel', desc: 'Frontend deployment and serverless' },
  { name: 'Netlify', desc: 'Static app deployment and previews' },
  { name: 'PostgreSQL', desc: 'Relational DB design and querying' },
  { name: 'Docker', desc: 'Containerization and deployment' },
]

export const contactItems = [
  { icon: '📧', label: 'Email', value: 'nshreenidhi655@gmail.com', href: 'mailto:nshreenidhi655@gmail.com' },
  { icon: '🔗', label: 'LinkedIn', value: 'in/shreenidhi-m03', href: 'https://linkedin.com/in/shreenidhi-m03' },
  { icon: '🐙', label: 'GitHub', value: 'github.com/SHREENIDHIMS', href: 'https://github.com/SHREENIDHIMS' },
  { icon: '📞', label: 'Phone', value: '+91 82961 33950', href: 'tel:+918296133950' },
  { icon: '📍', label: 'Location', value: 'Bengaluru, India', href: null },
]

export const experience = [
  {
    company: 'Tap Academy, Bengaluru',
    role: 'Java Full Stack Developer Intern',
    period: '10/2025 → 05/2026',
    desc: '• Developed enterprise applications using Java, Spring Boot, PostgreSQL, and REST APIs.<br>• Designed database schemas and backend services following Agile practices.<br>• Containerized applications using Docker; managed code with Git/GitHub.<br>• Applied layered architecture, DTO patterns, and software engineering best practices.<br>• Projects: E-Commerce REST API Platform & OnlyFoods food delivery app.',
    color: '#00ff00',
    companyColor: '#00ffff',
  },
  {
    company: 'Aikyam Community',
    role: 'Community Volunteer',
    period: '2021 → Present · Mysuru, Karnataka',
    desc: '• Road-cleaning and garbage collection drives, contributing to community hygiene.<br>• Raised awareness about environmental responsibility through outreach campaigns.<br>• Assisted in organizing community programs — developed leadership and coordination skills.',
    color: '#44ff44',
    companyColor: '#44ff44',
  },
]

export const education = [
  {
    company: 'GITAM University, Bengaluru',
    role: 'B.Tech — Computer Science & Engineering',
    period: '2021 → 2025 · CGPA: 7.08 / 10.0',
    desc: 'Key areas: OOP, DBMS, Microservices, Agile, AI/ML, Data Structures & Algorithms.',
    color: '#4488ff',
    companyColor: '#6699ff',
    descColor: '#8899bb',
  },
  {
    company: 'Nisarga Independent Pre-University College',
    role: '12th Grade — Science · Score: 76%',
    period: '2019 → 2021 · Chamarajanagara, India',
    desc: '',
    color: '#333388',
    companyColor: '#6688aa',
  },
]

export const clippyTips = [
  "It looks like you're hiring a developer 👀",
  'May I suggest Shreenidhi for the role?',
  'This portfolio was built with React, TS & Tailwind ⚡',
  "Try typing 'help' in the Terminal!",
  "The terminal has a 'neofetch' command 😄",
  'Need a backend dev? Check the Projects window 🚀',
  "Type 'theme purple' in the terminal for a fresh look!",
  'Shreenidhi knows Java, Spring Boot, PostgreSQL & AI!',
  'Check out Folio Instrumenta — AI music studio! 🎵',
  '3 certifications: Google UX, IBM SQL & FacePrep C 🏅',
  "Type 'certs' in Terminal to see certifications!",
  'Drag a window to the screen edge to snap it 🖥',
  "Press Ctrl+Alt+T to open the Terminal anytime 🎹",
]