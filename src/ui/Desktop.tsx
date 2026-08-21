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
const GRID_X0 = 8
const GRID_Y0 = 36

function defaultPos(i: number): { x: number; y: number } {
  const vh = window.innerHeight - TASKBAR_H - 44
  const perCol = Math.max(1, Math.floor(vh / ICON_H))
  const col = Math.floor(i / perCol)
  return {
    x: Math.max(8, window.innerWidth - 92 - col * ICON_W),
    y: 36 + (i % perCol) * ICON_H,
  }
}

function cellOf(x: number, y: number): { col: number; row: number } {
  return {
    col: Math.round((x - GRID_X0) / ICON_W),
    row: Math.round((y - GRID_Y0) / ICON_H),
  }
}

function posOf(col: number, row: number): { x: number; y: number } {
  return { x: GRID_X0 + col * ICON_W, y: GRID_Y0 + row * ICON_H }
}

function gridBounds(): { maxCol: number; maxRow: number } {
  return {
    maxCol: Math.max(0, Math.floor((window.innerWidth - ICON_W - 4 - GRID_X0) / ICON_W)),
    maxRow: Math.max(0, Math.floor((window.innerHeight - TASKBAR_H - ICON_H - GRID_Y0) / ICON_H)),
  }
}

function resolveFreeCell(id: string, x: number, y: number): { x: number; y: number } {
  const st = useOS.getState()
  const occupied = new Set<string>()
  Object.entries(st.iconPos).forEach(([oid, op]) => {
    if (oid === id) return
    const c = cellOf(op.x, op.y)
    occupied.add(c.col + ',' + c.row)
  })
  const { maxCol, maxRow } = gridBounds()
  const raw = cellOf(x, y)
  const start: { col: number; row: number } = {
    col: Math.max(0, Math.min(maxCol, raw.col)),
    row: Math.max(0, Math.min(maxRow, raw.row)),
  }
  const key = (c: { col: number; row: number }) => c.col + ',' + c.row
  if (!occupied.has(key(start))) return posOf(start.col, start.row)
  let best: { col: number; row: number } | null = null
  let bestD = Infinity
  for (let col = 0; col <= maxCol; col++) {
    for (let row = 0; row <= maxRow; row++) {
      if (occupied.has(col + ',' + row)) continue
      const d = Math.hypot(col - start.col, row - start.row)
      if (d < bestD) {
        bestD = d
        best = { col, row }
      }
    }
  }
  return best ? posOf(best.col, best.row) : posOf(start.col, start.row)
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
        const free = resolveFreeCell(id, cx, cy)
        useOS.getState().setIconPos(id, free.x, free.y)
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