import { APPS } from '../os/registry'
import { useOS } from '../os/store'
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

export function Desktop() {
  const windows = useOS((s) => s.windows)
  const setCtx = useOS((s) => s.setCtx)
  const setStartOpen = useOS((s) => s.setStartOpen)
  const assistantOpen = useOS((s) => s.assistantOpen)

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
          {desktopIcons.map((a) => (
            <div
              key={a.id}
              className="desk-icon"
              onClick={(e) => {
                e.stopPropagation()
                openSnd()
                document.querySelectorAll('.desk-icon').forEach((d) => d.classList.remove('selected'))
                e.currentTarget.classList.add('selected')
                useOS.getState().openWin(a.id, a.w, a.h)
              }}
            >
              <div className="di-ico">{a.icon}</div>
              <div className="di-lbl">{a.label}</div>
            </div>
          ))}
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