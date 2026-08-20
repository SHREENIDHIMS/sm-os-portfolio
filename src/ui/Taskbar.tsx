import { useOS } from '../os/store'
import { appById } from '../os/registry'
import { useClock } from '../hooks/useClock'
import { clickSnd } from '../os/sound'

export function Taskbar() {
  const { time12 } = useClock()
  const muted = useOS((s) => s.muted)
  const toggleMuted = useOS((s) => s.toggleMuted)
  const setStartOpen = useOS((s) => s.setStartOpen)
  const startOpen = useOS((s) => s.startOpen)
  const windows = useOS((s) => s.windows)

  const openWins = Object.keys(windows)
    .filter((id) => windows[id].open || windows[id].minimized)
    .map((id) => ({ id, ...windows[id] }))
    .sort((a, b) => a.z - b.z)

  const onTaskClick = (id: string, minimized: boolean, focused: boolean) => {
    clickSnd()
    const os = useOS.getState()
    const meta = appById[id]
    if (minimized) {
      os.minimizeWin(id)
      if (meta) os.openWin(id, meta.w, meta.h)
    } else if (focused) {
      os.minimizeWin(id)
    } else {
      os.focusWin(id)
    }
  }

  return (
    <div className="taskbar">
      <button className="start-btn" onClick={() => { clickSnd(); setStartOpen(!startOpen) }}>⊞ START</button>
      <div className="tb-sep" />
      <div className="tb-apps">
        {openWins.map((w) => {
          const meta = appById[w.id] || appById[w.id.replace(/-\d+$/, '')]
          if (!meta) return null
          return (
            <button
              key={w.id}
              className={'tb-btn' + (w.focused ? ' active' : '')}
              onClick={() => onTaskClick(w.id, w.minimized, w.focused)}
            >
              {meta.icon} {meta.label}
            </button>
          )
        })}
      </div>
      <div className="tb-tray">
        <span className="tb-tray-icon" onClick={() => { clickSnd(); useOS.getState().setAssistant(!useOS.getState().assistantOpen) }} title="SM-Assistant">🤖</span>
        <span className="tb-tray-icon" onClick={() => { clickSnd(); toggleMuted() }} title="Sound">
          {muted ? '🔇' : '🔊'}
        </span>
        <span className="tb-tray-icon" onClick={() => { clickSnd(); useOS.getState().openWin('clockWin', 330, 440) }} title="Clock">🕐</span>
        <span className="tb-clock">{time12}</span>
      </div>
    </div>
  )
}