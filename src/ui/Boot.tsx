import { useEffect, useState } from 'react'
import { useOS } from '../os/store'
import { openApp } from '../os/registry'
import { clickSnd } from '../os/sound'
import { Wallpaper } from './Wallpaper'

export interface BootLine {
  t: string
  cls?: string
}

export const bootSeq: BootLine[] = [
  { t: 'SM-OS BIOS v2.0 (c) 2026 Shreenidhi M', cls: 'ok' },
  { t: 'CPU: GITAM-2025 @ 3.2GHz · MEM: 16GB DDR4', cls: 'ok' },
  { t: 'Detecting hardware... OK', cls: 'ok' },
  { t: 'Loading kernel modules... OK', cls: 'ok' },
  { t: 'Mounting /home/shreenidhi ... OK', cls: 'ok' },
  { t: 'Starting network services... OK', cls: 'ok' },
  { t: 'Checking certificates: GOOGLE-UX · IBM-SQL · FACEPREP-C', cls: 'ok' },
  { t: 'Initializing skill matrices... OK', cls: 'ok' },
  { t: 'Loading projects: E-COMM · ONLYFOODS · AGRIBOT · FOLIO · ROAMAI', cls: 'ok' },
  { t: '', cls: '' },
  { t: '╔══════════════════════════════════╗', cls: 'warn' },
  { t: '║  SM-OS v2.0 — All Systems OK    ║', cls: 'warn' },
  { t: '╚══════════════════════════════════╝', cls: 'warn' },
  { t: '', cls: '' },
  { t: 'Launching desktop environment...', cls: 'ok' },
]

export function Boot() {
  const [progress, setProgress] = useState(0)
  const setPhase = useOS((s) => s.setPhase)
  const shutdown = useOS((s) => s.shutdown)

  useEffect(() => {
    if (shutdown) return
    let delay = 0
    const timers: ReturnType<typeof setTimeout>[] = []
    bootSeq.forEach((line, idx) => {
      delay += line.t ? 190 : 70
      timers.push(
        setTimeout(() => {
          setProgress(Math.round(((idx + 1) / bootSeq.length) * 100))
        }, delay),
      )
    })
    timers.push(setTimeout(() => setPhase('welcome'), delay + 700))
    return () => timers.forEach(clearTimeout)
  }, [setPhase, shutdown])

  const done = Math.round((progress / 100) * bootSeq.length)

  return (
    <div id="bootScreen" style={{ background: 'transparent' }}>
      <Wallpaper />
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,8,0.62)' }} />
      <div className="boot-wrap" style={{ position: 'relative' }}>
        <div id="bootLines">
          {shutdown ? (
            <>
              <div className="boot-line ok" style={{ opacity: 1 }}>SM-OS shutting down...</div>
              <div className="boot-line warn" style={{ opacity: 1, marginTop: 8 }}>Closing all applications...</div>
              <div className="boot-line" style={{ opacity: 1 }}>Saving session data...</div>
              <div className="boot-line ok" style={{ opacity: 1, marginTop: 8 }}>Thank you for visiting! — Shreenidhi M</div>
              <div className="boot-line" style={{ opacity: 1, marginTop: 16, color: '#00ff00' }}>📧 nshreenidhi655@gmail.com</div>
              <div className="boot-line" style={{ opacity: 1, color: '#00ff00' }}>🔗 linkedin.com/in/shreenidhi-m03</div>
              <div className="boot-line" style={{ opacity: 1, color: '#00ff00' }}>🐙 github.com/SHREENIDHIMS</div>
              <div className="boot-line" style={{ opacity: 1, marginTop: 12, color: '#6688aa' }}>Refresh the page to restart.</div>
            </>
          ) : (
            bootSeq.map((line, i) =>
              i < done ? (
                <div key={i} className={'boot-line ' + (line.cls || '')}>
                  {line.t || ' '}
                </div>
              ) : null,
            )
          )}
        </div>
        <div className="boot-bar-wrap">
          <div className="boot-bar">
            <div className="boot-bar-fill" style={{ width: shutdown ? '100%' : progress + '%' }} />
          </div>
          <div className="boot-bar-label">{shutdown ? 'POWERED OFF' : 'LOADING... ' + progress + '%'}</div>
        </div>
      </div>
    </div>
  )
}

export function Welcome() {
  const enter = () => useOS.getState().setPhase('desktop')
  const enterSnake = () => {
    enter()
    setTimeout(() => openApp('snakeWin'), 200)
  }
  return (
    <div id="welcomeScreen" className="visible" style={{ background: 'transparent' }}>
      <Wallpaper />
      <div className="welcome-card">
        <div className="welcome-logo">SHREENIDHI</div>
        <div className="welcome-sub">SM-OS v2.0</div>
        <div className="welcome-desc">
          Software Engineering · Java · AI Applications · Full-Stack Apps
          <br />
          B.Tech CS Graduate GITAM 2025
        </div>
        <button className="welcome-btn" onClick={() => { clickSnd(); enter() }}>
          <span>▶</span> EXPLORE PORTFOLIO
        </button>
        <button className="welcome-btn" onClick={() => { clickSnd(); enterSnake() }}>
          <span>🐍</span> PLAY SNAKE
        </button>
        <div className="welcome-note">Desktop: Use START menu or taskbar · Drag windows · Right-click desktop</div>
      </div>
    </div>
  )
}