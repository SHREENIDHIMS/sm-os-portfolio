import { lazy, type ComponentType } from 'react'
import { useOS } from './store'

const Terminal = lazy(() => import('../apps/Terminal'))
const About = lazy(() => import('../apps/About'))
const Skills = lazy(() => import('../apps/Skills'))
const Radar = lazy(() => import('../apps/Radar'))
const Projects = lazy(() => import('../apps/Projects'))
const Career = lazy(() => import('../apps/Career'))
const Files = lazy(() => import('../apps/Files'))
const AITools = lazy(() => import('../apps/AITools'))
const Certs = lazy(() => import('../apps/Certs'))
const Contact = lazy(() => import('../apps/Contact'))
const Display = lazy(() => import('../apps/Display'))
const CodePlayground = lazy(() => import('../apps/CodePlayground'))
const Clock = lazy(() => import('../apps/Clock'))
const Snake = lazy(() => import('../apps/Snake'))
const Memory = lazy(() => import('../apps/Memory'))
const Minesweeper = lazy(() => import('../apps/Minesweeper'))
const HallOfFame = lazy(() => import('../apps/HallOfFame'))
const Recycle = lazy(() => import('../apps/Recycle'))
const Browser = lazy(() => import('../apps/Browser'))
const ResumeViewer = lazy(() => import('../apps/ResumeViewer'))
const WebView = lazy(() => import('../apps/WebView'))

export interface AppMeta {
  id: string
  icon: string
  label: string
  title: string
  w: number
  h: number
  component: ComponentType<{ winId?: string }>
  desktop?: boolean
  menu?: boolean
}

export const APPS: AppMeta[] = [
  { id: 'termWin', icon: '>_', label: 'TERMINAL', title: 'TERMINAL_V2.0.EXE — bash 5.2.0', w: 620, h: 460, component: Terminal, desktop: true, menu: true },
  { id: 'aboutWin', icon: '👤', label: 'ABOUT', title: 'ABOUT.EXE — Shreenidhi M', w: 470, h: 460, component: About, desktop: true, menu: true },
  { id: 'skillsWin', icon: '⚙', label: 'SKILLS', title: 'SKILLS.SYS — Tech Stack', w: 460, h: 480, component: Skills, desktop: true, menu: true },
  { id: 'radarWin', icon: '📊', label: 'RADAR', title: 'SKILL_ANALYSIS.EXE', w: 430, h: 440, component: Radar, desktop: true, menu: true },
  { id: 'projectsWin', icon: '📁', label: 'PROJECTS', title: 'PROJECTS — /home/shreenidhi/work', w: 470, h: 520, component: Projects, desktop: true, menu: true },
  { id: 'expWin', icon: '🏆', label: 'CAREER', title: 'CAREER.LOG — Experience', w: 450, h: 500, component: Career, desktop: true, menu: true },
  { id: 'fileWin', icon: '📁', label: 'FILES', title: 'FILE_MANAGER.EXE — Home', w: 560, h: 440, component: Files, desktop: true, menu: true },
  { id: 'aiWin', icon: '🤖', label: 'AI TOOLS', title: 'AI_TOOLS.CFG — Loaded Stack', w: 490, h: 480, component: AITools, desktop: true, menu: true },
  { id: 'certsWin', icon: '🏅', label: 'CERTS', title: 'CERTIFICATES.LOG — Credentials', w: 430, h: 400, component: Certs, desktop: true, menu: true },
  { id: 'contactWin', icon: '📧', label: 'CONTACT', title: 'CONTACT.SH — Reach Out', w: 390, h: 400, component: Contact, desktop: true, menu: true },
  { id: 'displayWin', icon: '🖥', label: 'DISPLAY', title: 'DISPLAY.CPL — Properties', w: 450, h: 480, component: Display, desktop: true, menu: true },
  { id: 'codeWin', icon: '💻', label: 'CODE', title: 'CODE_PLAYGROUND.JS — JavaScript Runner', w: 580, h: 420, component: CodePlayground, desktop: true, menu: true },
  { id: 'clockWin', icon: '🕐', label: 'CLOCK', title: 'CLOCK.EXE', w: 330, h: 440, component: Clock, desktop: true, menu: true },
  { id: 'browserWin', icon: '🌐', label: 'BROWSER', title: 'SM-BROWSER v1.0', w: 580, h: 480, component: Browser, desktop: true, menu: true },
  { id: 'snakeWin', icon: '🐍', label: 'SNAKE', title: 'SNAKE.EXE — Classic Arcade', w: 440, h: 540, component: Snake, desktop: true, menu: true },
  { id: 'memoryWin', icon: '🃏', label: 'MEMORY', title: 'MEMORY.EXE — Match Pairs', w: 370, h: 500, component: Memory, desktop: true, menu: true },
  { id: 'mineWin', icon: '💣', label: 'MINES', title: 'MINESWEEPER.EXE', w: 420, h: 500, component: Minesweeper, desktop: true, menu: true },
  { id: 'hallWin', icon: '🏆', label: 'HALL OF FAME', title: 'HALL_OF_FAME.EXE — Top Players', w: 660, h: 620, component: HallOfFame, desktop: true, menu: true },
  { id: 'recycleWin', icon: '🗑', label: 'RECYCLE', title: 'RECYCLE BIN', w: 380, h: 360, component: Recycle, desktop: true, menu: false },
  { id: 'resumeWin', icon: '📄', label: 'RESUME', title: 'RESUME_VIEWER.EXE — Shreenidhi_M_Resume.pdf', w: 640, h: 560, component: ResumeViewer, desktop: true, menu: false },
  { id: 'webWin', icon: '🌐', label: 'SITE VIEWER', title: 'WEB_VIEW.EXE — External Page', w: 680, h: 540, component: WebView, desktop: false, menu: false },
  ...Array.from({ length: 9 }, (_, i) => ({
    id: 'webWin-' + (i + 1),
    icon: '🌐',
    label: 'SITE VIEWER',
    title: 'WEB_VIEW.EXE — External Page',
    w: 680,
    h: 540,
    component: WebView,
    desktop: false,
    menu: false,
  })),
]

export const appById = Object.fromEntries(APPS.map((a) => [a.id, a])) as Record<string, AppMeta>

export const openApp = (id: string) => {
  const meta = appById[id]
  if (meta) useOS.getState().openWin(id, meta.w, meta.h)
}