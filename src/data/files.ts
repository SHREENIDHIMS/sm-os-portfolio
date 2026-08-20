export type FileTarget =
  | { type: 'folder'; target: string }
  | { type: 'win'; target: string }
  | { type: 'resume'; target: null }
  | { type: 'project'; target: ProjectDetail }

export interface ProjectDetail {
  title: string
  desc: string
  tags: string[]
  github?: string
  demo?: string
}

export interface FolderItem {
  name: string
  icon: string
  type: 'folder' | 'win' | 'resume' | 'project'
  target: string | null | ProjectDetail
}

export interface Folder {
  parent: string | null
  path: string
  items: FolderItem[]
}

export const fileStructure: Record<string, Folder> = {
  home: {
    parent: null,
    path: 'C:\\Home',
    items: [
      { name: 'Projects', icon: '📁', type: 'folder', target: 'projects' },
      { name: 'Games', icon: '🎮', type: 'folder', target: 'games' },
      { name: 'System', icon: '⚙', type: 'folder', target: 'system' },
      { name: 'About.txt', icon: '📄', type: 'win', target: 'aboutWin' },
      { name: 'Contact.sh', icon: '📋', type: 'win', target: 'contactWin' },
      { name: 'Resume.pdf', icon: '📄', type: 'resume', target: null },
    ],
  },
  projects: {
    parent: 'home',
    path: 'C:\\Home\\Projects',
    items: [
      { name: 'AI', icon: '🧠', type: 'folder', target: 'proj-ai' },
      { name: 'Enterprise', icon: '🏢', type: 'folder', target: 'proj-enterprise' },
      { name: 'Web', icon: '🌐', type: 'folder', target: 'proj-web' },
    ],
  },
  'proj-ai': {
    parent: 'projects',
    path: 'C:\\Projects\\AI',
    items: [
      {
        name: 'SmartAgriBot',
        icon: '🌱',
        type: 'project',
        target: {
          title: 'Smart AgriBot',
          desc: 'Real-time crop disease detection with CNN and TensorFlow. 90%+ accuracy, Raspberry Pi integration, IoT sensors.',
          tags: ['TensorFlow', 'CNN', 'OpenCV', 'Raspberry Pi', 'IoT'],
          github: 'https://github.com/SHREENIDHIMS',
        },
      },
      {
        name: 'FolioInstrumenta',
        icon: '🎵',
        type: 'project',
        target: {
          title: 'Folio Instrumenta',
          desc: 'AI-powered virtual music studio. Instrument recognition from uploaded images, browser audio synthesis, educational insights.',
          tags: ['AI Vision', 'Browser Audio', 'Lovable AI', 'UI/UX'],
          demo: 'https://folio-instrumenta.lovable.app/',
        },
      },
      {
        name: 'RoamAI',
        icon: '✈️',
        type: 'project',
        target: {
          title: 'RoamAI — Travel Platform',
          desc: 'AI-powered itinerary and travel recommendation platform. Conversational workflows and trip optimization.',
          tags: ['AI Agents', 'LLMs', 'Prompt Engineering', 'UI/UX'],
          demo: 'https://roam-ai-voyage.lovable.app',
        },
      },
    ],
  },
  'proj-enterprise': {
    parent: 'projects',
    path: 'C:\\Projects\\Enterprise',
    items: [
      {
        name: 'EcommerceAPI',
        icon: '🛒',
        type: 'project',
        target: {
          title: 'E-Commerce REST API',
          desc: 'Spring Boot RESTful backend — product catalogue, cart, orders, DTO pattern, JPA relationships, BigDecimal precision. PostgreSQL, Docker.',
          tags: ['Spring Boot', 'JPA', 'PostgreSQL', 'Hibernate', 'Docker', 'Maven'],
          github: 'https://github.com/SHREENIDHIMS/E-Com',
        },
      },
      {
        name: 'DTO_Service',
        icon: '📦',
        type: 'project',
        target: {
          title: 'DTO Service Layer',
          desc: 'Enterprise microservice communication system with clean DTO/DAO separation.',
          tags: ['Java', 'Spring Boot', 'JPA', 'MVC'],
          github: 'https://github.com/SHREENIDHIMS/E-Com',
        },
      },
    ],
  },
  'proj-web': {
    parent: 'projects',
    path: 'C:\\Projects\\Web',
    items: [
      {
        name: 'OnlyFoods',
        icon: '🍽️',
        type: 'project',
        target: {
          title: 'OnlyFoods — Food Delivery',
          desc: 'Full-stack food delivery platform. Jakarta EE, session auth, BCrypt hashing, JDBC DAO, cart, checkout, responsive dark/light UI.',
          tags: ['Jakarta EE', 'Servlets', 'JSP', 'MySQL', 'JDBC', 'BCrypt'],
          github: 'https://github.com/SHREENIDHIMS/OnlyFoods',
          demo: 'https://onlyfoods-production.up.railway.app',
        },
      },
      {
        name: 'SM_Portfolio',
        icon: '💻',
        type: 'project',
        target: {
          title: 'SM-OS Portfolio',
          desc: 'Retro OS-style interactive portfolio website built with React, TypeScript, Tailwind CSS and Vite.',
          tags: ['React', 'TypeScript', 'Tailwind', 'Vite', 'Retro OS'],
          github: 'https://github.com/SHREENIDHIMS/sm-os-portfolio',
        },
      },
    ],
  },
  games: {
    parent: 'home',
    path: 'C:\\Home\\Games',
    items: [
      { name: 'Snake.exe', icon: '🐍', type: 'win', target: 'snakeWin' },
      { name: 'Memory.exe', icon: '🃏', type: 'win', target: 'memoryWin' },
      { name: 'Minesweeper.exe', icon: '💣', type: 'win', target: 'mineWin' },
      { name: 'HallOfFame.exe', icon: '🏆', type: 'win', target: 'hallWin' },
      { name: 'Code.js', icon: '💻', type: 'win', target: 'codeWin' },
    ],
  },
  system: {
    parent: 'home',
    path: 'C:\\Home\\System',
    items: [
      { name: 'Skills.sys', icon: '⚙', type: 'win', target: 'skillsWin' },
      { name: 'Career.log', icon: '🏆', type: 'win', target: 'expWin' },
      { name: 'AI_Tools', icon: '🤖', type: 'win', target: 'aiWin' },
      { name: 'Display.cpl', icon: '🖥', type: 'win', target: 'displayWin' },
      { name: 'Clock.exe', icon: '🕐', type: 'win', target: 'clockWin' },
      { name: 'Terminal', icon: '>_', type: 'win', target: 'termWin' },
    ],
  },
}