import { Suspense, type CSSProperties, type ReactNode } from 'react'
import { useOS } from '../os/store'
import type { AppMeta } from '../os/registry'
import { clickSnd, closeSnd } from '../os/sound'

interface Props {
  meta: AppMeta
}

export function Window({ meta }: Props) {
  const win = useOS((s) => s.windows[meta.id])
  const App = meta.component

  const focusWin = () => useOS.getState().focusWin(meta.id)
  const minimize = () => {
    clickSnd()
    useOS.getState().minimizeWin(meta.id)
  }
  const maximize = () => {
    clickSnd()
    useOS.getState().toggleMaximize(meta.id)
  }
  const close = () => {
    closeSnd()
    useOS.getState().closeWin(meta.id)
  }

  function onTitlePointerDown(e: React.PointerEvent) {
    if (e.button !== 0) return
    focusWin()
    const st = useOS.getState()
    if (st.windows[meta.id].maximized) return
    e.preventDefault()
    const startX = e.clientX
    const startY = e.clientY
    const origX = st.windows[meta.id].x
    const origY = st.windows[meta.id].y
    function onMove(ev: PointerEvent) {
      const x = Math.max(0, Math.min(window.innerWidth - 60, origX + ev.clientX - startX))
      const y = Math.max(0, Math.min(window.innerHeight - 60, origY + ev.clientY - startY))
      useOS.getState().moveWin(meta.id, x, y)
    }
    function onUp(ev: PointerEvent) {
      document.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerup', onUp)
      document.removeEventListener('pointercancel', onCancel)
      const vw = window.innerWidth
      const os = useOS.getState()
      if (ev.clientX <= 12) os.snapWin(meta.id, 'left')
      else if (ev.clientX >= vw - 12) os.snapWin(meta.id, 'right')
      else if (ev.clientY <= 12) os.snapWin(meta.id, 'max')
    }
    function onCancel() {
      document.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerup', onUp)
      document.removeEventListener('pointercancel', onCancel)
    }
    document.addEventListener('pointermove', onMove)
    document.addEventListener('pointerup', onUp)
    document.addEventListener('pointercancel', onCancel)
  }

  if (!win || !win.open) return null

  const style: CSSProperties = win.maximized
    ? { left: 0, top: 0, width: '100vw', height: 'calc(100vh - var(--taskbar-h))', zIndex: win.z }
    : { left: win.x, top: win.y, width: win.w, height: win.h, zIndex: win.z }

  const cls = ['window', 'open']
  if (win.focused) cls.push('focused')
  if (win.minimized) cls.push('minimized')

  return (
    <div className={cls.join(' ')} style={style} onMouseDown={focusWin}>
      <div className="win-titlebar" onPointerDown={onTitlePointerDown} onDoubleClick={maximize}>
        <span className="win-icon-sm">{meta.icon}</span>
        <div className="win-title">{meta.title}</div>
        <div className="win-controls">
          <button className="win-btn" onClick={minimize} aria-label="Minimize window">_</button>
          <button className="win-btn" onClick={maximize} aria-label="Maximize window">□</button>
          <button className="win-btn cls" onClick={close} aria-label="Close window">✕</button>
        </div>
      </div>
      <Suspense
        fallback={
          <div className="win-body" style={{ display: 'grid', placeItems: 'center', fontFamily: 'var(--font-vt)', color: '#00ff00', fontSize: 18 }}>
            LOADING MODULE...
          </div>
        }
      >
        <App winId={meta.id} />
      </Suspense>
    </div>
  )
}

export function WinBody({ children, style, className }: { children: ReactNode; style?: CSSProperties; className?: string }) {
  return (
    <div className={'win-body' + (className ? ' ' + className : '')} style={style}>
      {children}
    </div>
  )
}

export function WinMenubar({ children }: { children: ReactNode }) {
  return <div className="win-menubar">{children}</div>
}

export function MenuItem({ onClick, children, style }: { onClick?: () => void; children: ReactNode; style?: CSSProperties }) {
  return (
    <span
      className="win-menu-item"
      onClick={onClick}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick() } } : undefined}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      style={style}
    >
      {children}
    </span>
  )
}

export function WinStatusbar({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div className="win-statusbar" style={style}>
      {children}
    </div>
  )
}

export function StatusPanel({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div className="status-panel" style={style}>
      {children}
    </div>
  )
}

export function StatusDot() {
  return <span className="status-dot" />
}

export function promptLine(cmd: string) {
  return (
    <div className="prompt-line">
      <span>root@shreenidhi:~$</span> {cmd}
    </div>
  )
}