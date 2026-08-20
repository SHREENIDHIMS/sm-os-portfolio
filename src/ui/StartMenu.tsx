import { useOS } from '../os/store'
import { APPS, appById, openApp } from '../os/registry'
import { clickSnd } from '../os/sound'

export function StartMenu() {
  const startOpen = useOS((s) => s.startOpen)
  const setStartOpen = useOS((s) => s.setStartOpen)

  const menuApps = APPS.filter((a) => a.menu)

  const launch = (id: string) => {
    clickSnd()
    setStartOpen(false)
    openApp(id)
  }

  const resume = () => {
    clickSnd()
    setStartOpen(false)
    useOS.getState().openWin('resumeWin', 640, 560)
  }

  const games = menuApps.filter((a) => ['snakeWin', 'memoryWin', 'mineWin'].includes(a.id))
  const apps = menuApps.filter((a) => !games.includes(a))
  const meta = appById['resumeWin']

  return (
    <div className={'start-menu' + (startOpen ? ' open' : '')}>
      <div className="sm-header">⊞ SM-OS v2.0</div>
      {apps.map((a) => (
        <button key={a.id} className="sm-item" onClick={() => launch(a.id)}>
          {a.icon} {a.label}
        </button>
      ))}
      <div className="sm-sep" />
      {games.map((a) => (
        <button key={a.id} className="sm-item" onClick={() => launch(a.id)}>
          {a.icon} {a.label}
        </button>
      ))}
      <div className="sm-sep" />
      <button className="sm-item" onClick={resume}>
        {meta.icon} Resume
      </button>
      <div className="sm-sep" />
      <button className="sm-item" style={{ color: '#ff8888' }} onClick={() => { clickSnd(); setStartOpen(false); useOS.getState().shutdownOS() }}>
        ⏻ Shut Down
      </button>
    </div>
  )
}