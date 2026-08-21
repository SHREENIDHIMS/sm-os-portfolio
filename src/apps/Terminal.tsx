import { useEffect, useRef, useState } from 'react'
import { WinStatusbar, StatusPanel, StatusDot } from '../ui/Window'
import { useOS } from '../os/store'
import { openApp } from '../os/registry'
import { skillCategories } from '../data/skills'
import { projects } from '../data/projects'

interface Line {
  id: number
  cls: string
  text: string
}

let lineSeq = 0
const newLine = (cls: string, text: string): Line => ({ id: ++lineSeq, cls, text })

export default function Terminal() {
  const [lines, setLines] = useState<Line[]>([])
  const [input, setInput] = useState('')
  const [ready, setReady] = useState(false)
  const historyRef = useRef<string[]>([])
  const histIdxRef = useRef(-1)
  const startedRef = useRef(false)
  const bodyRef = useRef<HTMLDivElement>(null)
  const aliveRef = useRef(true)
  const timersRef = useRef<Set<ReturnType<typeof setInterval>>>(new Set())

  useEffect(() => {
    return () => {
      aliveRef.current = false
      timersRef.current.forEach((t) => clearInterval(t))
      timersRef.current.clear()
    }
  }, [])

  const append = (cls: string, text: string) => setLines((p) => [...p, newLine(cls, text)])

  function typeLine(text: string, cls = 'green', speed = 16) {
    const id = ++lineSeq
    if (!aliveRef.current) return Promise.resolve()
    setLines((p) => [...p, { id, cls, text: '' }])
    return new Promise<void>((resolve) => {
      let i = 0
      const t = setInterval(() => {
        if (!aliveRef.current) {
          clearInterval(t)
          resolve()
          return
        }
        i++
        setLines((p) => p.map((l) => (l.id === id ? { ...l, text: text.slice(0, i) } : l)))
        if (i >= text.length) {
          clearInterval(t)
          timersRef.current.delete(t)
          resolve()
        }
      }, speed)
      timersRef.current.add(t)
    })
  }

  const gap = (ms: number) =>
    new Promise<void>((resolve) => {
      const t = setTimeout(() => {
        timersRef.current.delete(t)
        resolve()
      }, ms)
      timersRef.current.add(t)
    })

  useEffect(() => {
    if (startedRef.current) return
    startedRef.current = true
    ;(async () => {
      await typeLine('root@shreenidhi:~$ cat welcome.txt', 'green', 14)
      await gap(200)
      await typeLine('Welcome to SM-OS [Version 2.0.2026]', 'white', 12)
      await typeLine('(c) Shreenidhi M. All rights reserved.', 'dim', 10)
      await gap(180)
      append('white', 'System Status: ONLINE')
      await typeLine('Role: Entry-Level Software Developer · Bengaluru', 'white', 12)
      await typeLine('Stack: Java · Spring Boot · Jakarta EE · MySQL · AI/ML', 'dim', 10)
      await gap(200)
      await typeLine('root@shreenidhi:~$ sh ./init_portfolio.sh', 'green', 14)
      await gap(150)
      await typeLine('Loading portfolio components...', 'cyan', 10)
      await typeLine('Mounting virtual desktop environment...', 'cyan', 10)
      await typeLine('Portfolio initialized successfully! ✓', 'green', 14)
      await gap(150)
      await typeLine("Type 'help' for commands · 'neofetch' for system info", 'dim', 10)
      setReady(true)
      const ct = setTimeout(() => {
        timersRef.current.delete(ct)
        if (aliveRef.current) useOS.getState().setClippy(true)
      }, 3000)
      timersRef.current.add(ct)
    })()
  }, [])

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight
  }, [lines])

  const openWin = (id: string) => openApp(id)

  const exec = (raw: string) => {
    const parts = raw.trim().split(/\s+/)
    const cmd = parts[0].toLowerCase()
    const arg = parts[1] || ''
    const rest = parts.slice(1).join(' ')

    append('prompt', 'root@shreenidhi:~$ ' + raw)

    switch (cmd) {
      case 'help':
        append('cyan', '╔═════════════════════════════════════╗')
        append('cyan', '║    SM-OS TERMINAL v2.0 — Commands   ║')
        append('cyan', '╚═════════════════════════════════════╝')
        append('green', '  WINDOWS: about, skills, radar, projects')
        append('green', '           experience, ai, certs, contact, files')
        append('green', '           code, clock, display, browser')
        append('green', '  GAMES:   snake, memory, minesweeper, halloffame')
        append('green', '  FILES:   ls, pwd, cat [about|skills]')
        append('green', '  SYSTEM:  whoami, uname, date, clear, exit')
        append('green', '           history, w, sysinfo, sudo')
        append('green', '  POWER:   screensaver [on|off], power')
        append('green', '  LINKS:   resume, linkedin, github')
        append('green', '  THEME:   theme [blue|amber|red|green|purple]')
        append('green', '  WP:      wallpaper [0-5]')
        append('green', '  MISC:    echo [text], neofetch, fortune')
        append('green', '  JSON:    skills --json, projects --json, certs --json')
        break
      case 'neofetch':
        append('cyan', '  ██████╗███╗   ███╗       Shreenidhi M')
        append('cyan', '  ██╔════╝████╗ ████║  ─────────────────')
        append('cyan', '  ███████╗██╔████╔██║  OS: SM-OS v2.0')
        append('green', '  ╚════██║██║╚██╔╝██║  Shell: bash 5.2.0')
        append('green', '  ███████║██║ ╚═╝ ██║  Role: Backend Dev')
        append('green', '  ╚══════╝╚═╝     ╚═╝  City: Bengaluru')
        append('white', '  Stack: Java·Spring·PostgreSQL·TF')
        append('dim', '  Projects: 5  |  Certs: 3  |  2025 Grad')
        break
      case 'whoami':
        append('green', 'shreenidhi_m')
        append('dim', 'uid=1000 groups=java,spring,mysql,ai,gitam2025')
        break
      case 'uname':
        append('dim', 'SM-OS 2.0 x86_64 GNU/Linux — VT323 Edition')
        break
      case 'date':
        append('white', new Date().toString())
        break
      case 'pwd':
        append('dim', '/home/shreenidhi')
        break
      case 'ls':
        append('amber', 'drwxr-xr-x  about/')
        append('amber', 'drwxr-xr-x  projects/')
        append('amber', 'drwxr-xr-x  experience/')
        append('amber', 'drwxr-xr-x  games/')
        append('green', '-rwxr-xr-x  terminal.sh')
        append('green', '-rwxr-xr-x  contact.sh')
        append('white', '-rw-r--r--  Shreenidhi_M_Resume.pdf')
        break
      case 'cat':
        if (arg === 'about') {
          openWin('aboutWin')
          append('cyan', '→ Opened ABOUT.EXE')
        } else if (arg === 'skills') {
          append('cyan', '→ SKILLS.SYS dump:')
          skillCategories.forEach((c) => {
            append('dim', '  ' + c.cat)
            c.skills.forEach((s) => append('green', `    ${s.name}: ${s.pct}%`))
          })
        } else {
          append('red', `cat: ${arg || '(no file)'}: No such file. Try: cat about, cat skills`)
        }
        break
      case 'echo':
        append('white', rest || '')
        break
      case 'clear':
        setLines([])
        return
      case 'exit':
        useOS.getState().closeWin('termWin')
        break
      case 'about':
        openWin('aboutWin')
        append('cyan', '→ Opened ABOUT.EXE')
        break
      case 'skills':
        openWin('skillsWin')
        append('cyan', '→ Opened SKILLS.SYS')
        if (arg === '--json') append('white', JSON.stringify(skillCategories, null, 2))
        break
      case 'radar':
        openWin('radarWin')
        append('cyan', '→ Opened SKILL_ANALYSIS.EXE')
        break
      case 'projects':
        openWin('projectsWin')
        append('cyan', '→ Opened PROJECTS')
        if (arg === '--json') append('white', JSON.stringify(projects.map((p) => p.name), null, 2))
        break
      case 'experience':
        openWin('expWin')
        append('cyan', '→ Opened CAREER.LOG')
        break
      case 'ai':
        openWin('aiWin')
        append('cyan', '→ Opened AI_TOOLS.CFG')
        break
      case 'certs':
        openWin('certsWin')
        append('cyan', '→ Opened CERTIFICATES.LOG')
        break
      case 'contact':
        openWin('contactWin')
        append('cyan', '→ Opened CONTACT.SH')
        break
      case 'files':
        openWin('fileWin')
        append('cyan', '→ Opened FILE_MANAGER.EXE')
        break
      case 'code':
        openWin('codeWin')
        append('cyan', '→ Opened CODE_PLAYGROUND.JS')
        break
      case 'clock':
        openWin('clockWin')
        append('cyan', '→ Opened CLOCK.EXE')
        break
      case 'display':
        openWin('displayWin')
        append('cyan', '→ Opened DISPLAY.CPL')
        break
      case 'browser':
        openWin('browserWin')
        append('cyan', '→ Opened SM-BROWSER')
        break
      case 'snake':
        openWin('snakeWin')
        append('cyan', '→ Launched SNAKE.EXE')
        break
      case 'memory':
        openWin('memoryWin')
        append('cyan', '→ Launched MEMORY.EXE')
        break
      case 'minesweeper':
      case 'mine':
        openWin('mineWin')
        append('cyan', '→ Launched MINESWEEPER.EXE')
        break
      case 'halloffame':
      case 'hall':
      case 'scores':
        openWin('hallWin')
        append('cyan', '→ Launched HALL_OF_FAME.EXE')
        break
      case 'resume':
        openWin('resumeWin')
        append('cyan', '→ Opening Resume...')
        break
      case 'linkedin':
        window.open('https://linkedin.com/in/shreenidhi-m03', '_blank')
        append('cyan', '→ Opening LinkedIn...')
        break
      case 'github':
        window.open('https://github.com/SHREENIDHIMS', '_blank')
        append('cyan', '→ Opening GitHub...')
        break
      case 'theme':
        if (['blue', 'amber', 'red', 'green', 'purple'].includes(arg)) {
          useOS.getState().setTheme(arg as 'blue')
          append('green', '→ Theme set to ' + arg)
        } else {
          append('red', 'Usage: theme [blue|amber|red|green|purple]')
        }
        break
      case 'wallpaper': {
        const n = parseInt(arg, 10)
        if (!isNaN(n) && n >= 0 && n < 6) {
          useOS.getState().setWallpaper(n)
          append('green', '→ Wallpaper set to #' + n)
        } else {
          append('red', 'Usage: wallpaper [0-5]  (0:Matrix 1:Stars 2:Plasma 3:Grid 4:Nebula 5:Circuit)')
        }
        break
      }
      case 'history':
        if (historyRef.current.length === 0) append('dim', 'No commands in history yet.')
        historyRef.current.forEach((h, i) => append('dim', `  ${i + 1}  ${h}`))
        break
      case 'w':
        append('white', '  USER       TTY  FROM         LOGIN@  IDLE  WHAT')
        append('green', '  shreenidhi :0   :0          10:00  0.0s  open-source')
        append('dim', '  1 user logged in · Job status: OPEN TO WORK')
        break
      case 'sysinfo':
        append('cyan', 'SM-OS v2.0 · x86_64 · 4 cores · 16GB RAM')
        append('green', 'Theme: ' + useOS.getState().theme)
        append('green', 'Wallpaper: #' + useOS.getState().wallpaper)
        append('green', 'Windows open: ' + Object.values(useOS.getState().windows).filter((w) => w.open).length)
        append('dim', 'Uptime: since GITAM 2025 · 3.2GHz')
        break
      case 'sudo':
        append('amber', 'shreenidhi is not in the sudoers file. This incident will be reported. 🚨')
        break
      case 'fortune':
        append('amber', FORTUNES[Math.floor(Math.random() * FORTUNES.length)])
        break
      case 'screensaver':
      case 'power':
        if (arg === 'off') {
          useOS.getState().setScreensaver(false)
          append('green', '→ Screensaver off')
        } else if (arg === 'on' || cmd === 'power') {
          useOS.getState().setScreensaver(true)
          append('green', '→ Screensaver activated (press any key to return)')
        } else {
          useOS.getState().setScreensaver(true)
          append('green', '→ Screensaver activated (press any key to return)')
        }
        break
      default:
        append('red', `bash: ${cmd}: command not found. Type 'help' for commands.`)
    }
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const v = input.trim()
      setInput('')
      if (!v) return
      historyRef.current.unshift(v)
      histIdxRef.current = -1
      exec(v)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      histIdxRef.current = Math.min(histIdxRef.current + 1, historyRef.current.length - 1)
      setInput(historyRef.current[histIdxRef.current] || '')
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      histIdxRef.current = Math.max(histIdxRef.current - 1, -1)
      setInput(histIdxRef.current >= 0 ? historyRef.current[histIdxRef.current] : '')
    } else if (e.key === 'Tab') {
      e.preventDefault()
    }
  }

  return (
    <>
      <div className="win-body" style={{ padding: 0, display: 'flex', flexDirection: 'column' }}>
        <div className="term-body" ref={bodyRef} onClick={() => (document.getElementById('liveTerminalInput') as HTMLInputElement | null)?.focus()}>
          <div>
            {lines.map((l) => (
              <div key={l.id} className={'term-line ' + l.cls}>
                {l.text}
              </div>
            ))}
            {ready && (
              <div className="term-input-row">
                <span className="term-prompt-span">root@shreenidhi:~$&nbsp;</span>
                <input
                  id="liveTerminalInput"
                  className="term-input"
                  type="text"
                  spellCheck={false}
                  autoComplete="off"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <WinStatusbar>
        <StatusPanel><StatusDot /> bash 5.2.0</StatusPanel>
        <StatusPanel>/home/shreenidhi</StatusPanel>
        <StatusPanel>UTF-8</StatusPanel>
      </WinStatusbar>
    </>
  )
}

const FORTUNES = [
  'The best way to predict the future is to write the code for it. — Shreenidhi',
  'git commit -m "fixes everything" is the strongest spell.',
  'Recursion: see recursion.',
  'There are 10 types of people: those who get binary and those who do not.',
  'A Java developer walks into a bar... the bartender says "We don\'t serve exceptions here."',
  'Docker: "It works on my machine" — now it works on every machine.',
  'Your only limit is your Garbage Collector pause time.',
  'AI: please hold the wheel while I refactor this legacy module.',
]