export interface Project {
  name: string
  company: string
  desc: string
  tags: string[]
  github?: string
  demo?: string
  tagColor?: string
}

export const projects: Project[] = [
  {
    name: '🛒 E-Commerce REST API',
    company: 'Tap Academy Internship · 02/2026 → Present',
    desc: 'RESTful backend with product catalogue, cart, order management, transactional operations, DTO pattern, MVC architecture, BigDecimal financial precision.',
    tags: ['Spring Boot', 'JPA', 'PostgreSQL', 'Hibernate', 'Docker', 'Maven'],
    github: 'https://github.com/SHREENIDHIMS/E-Com',
    tagColor: 'g',
  },
  {
    name: '🍽️ OnlyFoods — Food Delivery',
    company: 'Tap Academy Internship · 12/2025 → 2026',
    desc: 'Full-stack food delivery with session auth, restaurant browsing, cart, checkout, saved addresses, BCrypt hashing, JDBC DAO, responsive dark/light UI.',
    tags: ['Jakarta EE', 'Servlets', 'JSP', 'MySQL', 'BCrypt'],
    github: 'https://github.com/SHREENIDHIMS/OnlyFoods',
    demo: 'https://onlyfoods-production.up.railway.app',
    tagColor: 'g',
  },
  {
    name: '🌱 Smart AgriBot — AI Crop Disease',
    company: 'GITAM University · 09/2024 → 2025',
    desc: 'Real-time crop disease detection via CNN with 90%+ accuracy. Image-upload diagnosis, Raspberry Pi, IoT sensors, cloud-backed model training.',
    tags: ['TensorFlow', 'CNN', 'OpenCV', 'Raspberry Pi', 'IoT'],
    github: 'https://github.com/SHREENIDHIMS',
    tagColor: 'p',
  },
  {
    name: '🎵 Folio Instrumenta — AI Music Studio',
    company: 'Personal Project · 04/2026',
    desc: 'Virtual music studio with AI-powered instrument recognition from uploaded images. Educational insights, collection management, and browser-based audio synthesis.',
    tags: ['AI Vision', 'Browser Audio', 'Lovable AI', 'UI/UX'],
    demo: 'https://folio-instrumenta.lovable.app/',
    tagColor: 'p',
  },
  {
    name: '✈️ RoamAI — Travel Planning Platform',
    company: 'Personal Project · 05/2026',
    desc: 'AI-powered travel itinerary and recommendation platform. Conversational travel workflows, trip optimization, and destination intelligence.',
    tags: ['AI Agents', 'LLMs', 'Prompt Engineering', 'UI/UX'],
    demo: 'https://roam-ai-voyage.lovable.app',
    tagColor: 'g',
  },
]