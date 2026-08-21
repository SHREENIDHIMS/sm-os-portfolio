import { useEffect, useRef, useState } from 'react'
import { useOS } from '../os/store'
import { openApp } from '../os/registry'
import { clickSnd } from '../os/sound'

interface Msg { who: 'bot' | 'me'; text: string }

const CHIPS = ['Skills', 'Projects', 'Experience', 'Contact', 'Resume', 'Games', 'Joke']

function answer(raw: string): { text: string; action?: () => void } {
  const q = raw.toLowerCase()
  if (/(hi|hello|hey|yo)\b/.test(q)) return { text: 'Hello! I am SM-ASSISTANT v1.0 🤖 — ask me about Shreenidhi: skills, projects, experience, contact…' }
  if (q.includes('skill') || q.includes('stack') || q.includes('tech')) {
    return { text: '⚙️ Core stack: Java · Spring Boot · React · Node.js · MERN & PERN · Hibernate · MongoDB · MySQL/PostgreSQL · Docker · Git. Full details in SKILLS.SYS on the desktop.' }
  }
  if (q.includes('project')) {
    return { text: '📁 Highlights: E-COMM (Spring Boot + React store), ONLYFOODS (food ordering), AGRIBOT (agri robot), ROAMAI (AI travel planner) — and FOLIO, the OS you are using right now! Open PROJECTS for the tour.' }
  }
  if (q.includes('experience') || q.includes('career') || q.includes('work')) {
    return { text: '🏆 Computer Science Engineer (GITAM, 2025) building AI-powered applications across MERN & PERN stacks. Check CAREER.LOG for the timeline.' }
  }
  if (q.includes('education') || q.includes('college') || q.includes('study') || q.includes('degree')) {
    return { text: '🎓 B.Tech Computer Science — GITAM University, Class of 2025.' }
  }
  if (q.includes('certif')) {
    return { text: '🏅 Google UX Design · IBM SQL & Databases · FacePrep C++ — all listed in CERTIFICATES.LOG.' }
  }
  if (q.includes('contact') || q.includes('email') || q.includes('hire') || q.includes('linkedin')) {
    return { text: '📧 nshreenidhi655@gmail.com\n🔗 linkedin.com/in/shreenidhi-m03\n🐙 github.com/SHREENIDHIMS' }
  }
  if (q.includes('resume') || q.includes('cv')) {
    return {
      text: '📄 Opening RESUME_VIEWER.EXE for you…',
      action: () => openApp('resumeWin'),
    }
  }
  if (q.includes('game') || q.includes('play') || q.includes('snake') || q.includes('fun')) {
    return { text: '🐍 Try SNAKE.EXE, MEMORY.EXE or MINESWEEPER.EXE — high scores land in the Hall of Fame!' }
  }
  if (q.includes('joke')) {
    const jokes = [
      'Why do Java developers wear glasses? Because they cannot C# 😄',
      'There are 10 types of people: those who understand binary and those who do not.',
      'A SQL query walks into a bar, goes up to two tables and asks… "may I join you?"',
    ]
    return { text: jokes[Math.floor(Math.random() * jokes.length)] }
  }
  if (q.includes('who are you') || q.includes('assistant') || q.includes('help')) {
    return { text: 'I am SM-ASSISTANT v1.0, built into this OS with zero cloud calls. Ask about skills, projects, experience, contact — or say joke.' }
  }
  if (q.includes('weather')) return { text: 'Open the WEATHER app on the desktop — live data, no key needed ☀️' }
  if (q.includes('search') || q.includes('google')) return { text: 'Use SM-BROWSER 🌐 — it searches Wikipedia, shows images, maps and even plays YouTube inside the OS.' }
  return { text: 'Hmm, I did not catch that. Try: skills · projects · experience · contact · resume · games · joke' }
}

export default function Assistant() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { who: 'bot', text: 'Hi! 👋 I am SM-ASSISTANT v1.0. Ask me anything about Shreenidhi — or tap a chip below.' },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight })
  }, [msgs, typing])

  const send = (raw: string) => {
    const t = raw.trim()
    if (!t || typing) return
    clickSnd()
    setMsgs((m) => [...m, { who: 'me', text: t }])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      const a = answer(t)
      setTyping(false)
      setMsgs((m) => [...m, { who: 'bot', text: a.text }])
      a.action?.()
    }, 450)
  }

  return (
    <div className="assistant">
      <div className="as-head">
        🤖 SM-ASSISTANT v1.0
        <button className="as-close" onClick={() => { clickSnd(); useOS.getState().setAssistant(false) }}>✕</button>
      </div>
      <div className="as-body" ref={bodyRef}>
        {msgs.map((m, i) => (
          <div key={i} className={'as-msg ' + m.who}>{m.text}</div>
        ))}
        {typing && <div className="as-msg bot as-typing">● ● ●</div>}
      </div>
      <div className="as-chips">
        {CHIPS.map((c) => (
          <button key={c} className="as-chip" onClick={() => send(c)}>{c}</button>
        ))}
      </div>
      <div className="as-inputrow">
        <input
          className="as-input"
          value={input}
          placeholder="Ask about Shreenidhi…"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') send(input) }}
        />
        <button className="retro-btn" style={{ fontSize: 11 }} onClick={() => send(input)}>Send</button>
      </div>
    </div>
  )
}