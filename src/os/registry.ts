import type { ComponentType } from 'react'
import { useOS } from './store'
import Terminal from '../apps/Terminal'
import About from '../apps/About'
import Skills from '../apps/Skills'
import Radar from '../apps/Radar'
import Projects from '../apps/Projects'
import Career from '../apps/Career'
import Files from '../apps/Files'
import AITools from '../apps/AITools'
import Certs from '../apps/Certs'
import Contact from '../apps/Contact'
import Display from '../apps/Display'
import CodePlayground from '../apps/CodePlayground'
import Clock from '../apps/Clock'
import Snake from '../apps/Snake'
import Memory from '../apps/Memory'
import Minesweeper from '../apps/Minesweeper'
import Recycle from '../apps/Recycle'
import Browser from '../apps/Browser'
import ResumeViewer from '../apps/ResumeViewer'

export interface AppMeta {
  id: string
  icon: string
  label: string
  title: string
  w: number
  h: number
  component: ComponentType
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
  { id: 'snakeWin', icon: '🐍', label: 'SNAKE', title: 'SNAKE.EXE — Classic Arcade', w: 440, h: 520, component: Snake, desktop: true, menu: true },
  { id: 'memoryWin', icon: '🃏', label: 'MEMORY', title: 'MEMORY.EXE — Match Pairs', w: 350, h: 460, component: Memory, desktop: true, menu: true },
  { id: 'mineWin', icon: '💣', label: 'MINES', title: 'MINESWEEPER.EXE', w: 360, h: 440, component: Minesweeper, desktop: true, menu: true },
  { id: 'recycleWin', icon: '🗑', label: 'RECYCLE', title: 'RECYCLE BIN', w: 380, h: 360, component: Recycle, desktop: true, menu: false },
  { id: 'resumeWin', icon: '📄', label: 'RESUME', title: 'RESUME_VIEWER.EXE — Shreenidhi_M_Resume.pdf', w: 640, h: 560, component: ResumeViewer, desktop: true, menu: false },
]

export const appById = Object.fromEntries(APPS.map((a) => [a.id, a])) as Record<string, AppMeta>

export const openApp = (id: string) => {
  const meta = appById[id]
  if (meta) useOS.getState().openWin(id, meta.w, meta.h)
}