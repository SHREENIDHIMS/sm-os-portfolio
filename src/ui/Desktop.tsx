import { useEffect, useRef } from 'react'
import { APPS } from '../os/registry'
import { useOS, TASKBAR_H } from '../os/store'
import { openSnd } from '../os/sound'
import { Wallpaper } from './Wallpaper'
import { Window } from './Window'
import { Taskbar } from './Taskbar'
import { StartMenu } from './StartMenu'
import { ContextMenu } from './ContextMenu'
import { Clippy } from './Clippy'
import { Notifications } from './Notifications'
import Assistant from './Assistant'

const desktopIcons = APPS.filter((a) => a.desktop)

const ICON_W = 78
const ICON_H = 92

function defaultPos(i: number): { x: number; y: number } {
  const vh = window.innerHeight - TASKBAR_H - 44
  const perCol = Math.max(1, Math.floor(vh / ICON_H))
  const col = Math.floor(i / perCol)
  return {
    x: Math.max(8, window.innerWidth - 92 - col * ICON_W),
    y: 36 + (i % perCol) * ICON_H,
  }
}

export function Desktop() {
  const windows = useOS((s) => s.windows)
  const setCtx = useOS((s) => s.setCtx)
  const setStartOpen = useOS((s) => s.setStartOpen)
  const assistantOpen = useOS((s) => s.assistantOpen)
  const iconPos = useOS((s) => s.iconPos)
  const justDragged = useRef(false)

  useEffect(() => {
    const onResize = () => {
      const st = useOS.getState()
      Object.entries(st.iconPos).forEach(([id, p]) => {
        const nx = Math.max(0, Math.min(p.x, window.innerWidth - ICON_W))
        const ny = Math.max(0, Math.min(p.y, window.innerHeight - TASKBAR_H - ICON_H))
        if (nx !== p.x || ny !== p.y) st.setIconPos(id, nx, ny)
      })
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const dragIcon = (e: React.PointerEvent<HTMLDivElement>, id: string, idx: number) => {
    if (e.button !== 0) return
    e.preventDefault()
    const start = { x: e.clientX, y: e.clientY }
    const p = useOS.getState().iconPos[id] || defaultPos(idx)
    let moved = false
    let cx = p.x
    let cy = p.y
    const onMove = (ev: PointerEvent) => {
      const dx = ev.clientX - start.x
      const dy = ev.clientY - start.y
      if (!moved && Math.hypot(dx, dy) > 5) moved = true
      if (!moved) return
      justDragged.current = true
      cx = Math.max(0, Math.min(window.innerWidth - ICON_W, p.x + dx))
      cy = Math.max(0, Math.min(window.innerHeight - TASKBAR_H - ICON_H, p.y + dy))
      useOS.getState().setIconPos(id, cx, cy)
    }
    const onUp = () => {
      document.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerup', onUp)
      document.removeEventListener('pointercancel', onCancel)
      if (moved) {
        const gx = Math.max(8, Math.min(window.innerWidth - ICON_W - 4, 8 + Math.round((cx - 8) / ICON_W) * ICON_W))
        const gy = Math.max(36, Math.min(window.innerHeight - TASKBAR_H - ICON_H, 36 + Math.round((cy - 36) / ICON_H) * ICON_H))
        useOS.getState().setIconPos(id, gx, gy)
      }
      setTimeout(() => { justDragged.current = false }, 50)
    }
    const onCancel = () => {
      document.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerup', onUp)
      document.removeEventListener('pointercancel', onCancel)
      setTimeout(() => { justDragged.current = false }, 50)
    }
    document.addEventListener('pointermove', onMove)
    document.addEventListener('pointerup', onUp)
    document.addEventListener('pointercancel', onCancel)
  }

  const openWindows = APPS.filter((a) => windows[a.id]?.open)

  const onDesktopContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    setCtx(true, { x: Math.min(e.clientX, window.innerWidth - 180), y: Math.min(e.clientY, window.innerHeight - 160) })
  }

  const onDesktopClick = (e: React.MouseEvent) => {
    if (!(e.target as HTMLElement).closest('#desktopIcons')) {
      document.querySelectorAll('.desk-icon').forEach((d) => d.classList.remove('selected'))
    }
    setStartOpen(false)
    setCtx(false)
  }

  return (
    <>
      <div id="desktop" className="visible" onContextMenu={onDesktopContextMenu} onClick={onDesktopClick}>
        <Wallpaper />
        <div id="desktopOverlay" />
        <div className="status-bar-top">
          <span style={{ color: '#00ff00', fontSize: 10, textShadow: '0 0 6px rgba(0,255,0,0.6)' }}>⬤ Available for opportunities</span>
          <a
            href="https://linkedin.com/in/shreenidhi-m03"
            target="_blank"
            rel="noreferrer"
            style={{ color: '#ffcc00', border: '1px solid rgba(200,200,100,0.5)', padding: '1px 8px', textDecoration: 'none', background: 'rgba(0,0,50,0.6)', fontSize: 10 }}
          >
            🔗 LinkedIn
          </a>
        </div>
        <div id="desktopIcons">
          {desktopIcons.map((a, i) => {
            const p = iconPos[a.id] || defaultPos(i)
            return (
              <div
                key={a.id}
                className="desk-icon"
                style={{ left: p.x, top: p.y }}
                role="button"
                tabIndex={0}
                aria-label={'Open ' + a.label}
                onPointerDown={(e) => dragIcon(e, a.id, i)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    openSnd()
                    useOS.getState().openWin(a.id, a.w, a.h)
                  }
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  if (justDragged.current) return
                  openSnd()
                  document.querySelectorAll('.desk-icon').forEach((d) => d.classList.remove('selected'))
                  e.currentTarget.classList.add('selected')
                  useOS.getState().openWin(a.id, a.w, a.h)
                }}
              >
                <div className="di-ico">{a.icon}</div>
                <div className="di-lbl">{a.label}</div>
              </div>
            )
          })}
        </div>
        {openWindows.map((a) => (
          <Window key={a.id} meta={a} />
        ))}
      </div>
      <Taskbar />
      <StartMenu />
      <ContextMenu />
      <Clippy />
      <Notifications />
      {assistantOpen && <Assistant />}
    </>
  )
}