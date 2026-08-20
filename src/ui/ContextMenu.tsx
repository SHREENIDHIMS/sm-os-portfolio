import { useOS } from '../os/store'
import { clickSnd } from '../os/sound'
import { openApp } from '../os/registry'

export function ContextMenu() {
  const ctxOpen = useOS((s) => s.ctxOpen)
  const ctxPos = useOS((s) => s.ctxPos)
  const setCtx = useOS((s) => s.setCtx)

  const doAction = (action: string) => {
    clickSnd()
    setCtx(false)
    if (action === 'refresh') useOS.getState().notify('SM-OS', 'Desktop refreshed.')
    if (action === 'display') openApp('displayWin')
    if (action === 'terminal') openApp('termWin')
    if (action === 'about') openApp('aboutWin')
  }

  return (
    <div className={'ctx-menu' + (ctxOpen ? ' open' : '')} style={{ left: ctxPos.x, top: ctxPos.y }}>
      <div className="ctx-item" onClick={() => doAction('refresh')}>🔄 Refresh Desktop</div>
      <div className="ctx-sep" />
      <div className="ctx-item" onClick={() => doAction('display')}>🖥 Display Properties</div>
      <div className="ctx-item" onClick={() => doAction('terminal')}>▶ Open Terminal</div>
      <div className="ctx-sep" />
      <div className="ctx-item" onClick={() => doAction('about')}>ℹ About SM-OS</div>
    </div>
  )
}