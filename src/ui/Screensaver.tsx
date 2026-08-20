import { useEffect } from 'react'
import { useOS } from '../os/store'

export function Screensaver() {
  const on = useOS((s) => s.screensaver)
  const setScreensaver = useOS((s) => s.setScreensaver)

  useEffect(() => {
    if (!on) return
    const dismiss = () => setScreensaver(false)
    const events: (keyof WindowEventMap)[] = ['pointerdown', 'keydown', 'wheel']
    events.forEach((e) => window.addEventListener(e, dismiss))
    return () => events.forEach((e) => window.removeEventListener(e, dismiss))
  }, [on, setScreensaver])

  if (!on) return null

  return (
    <div id="screensaver">
      <div className="sa-rain">
        {Array.from({ length: 36 }).map((_, i) => (
          <span key={i} style={{ left: (i * 27) % 100 + '%', animationDelay: (i % 9) * 0.7 + 's' }}>
            {String.fromCharCode(0x30a0 + ((i * 37) % 96))}
          </span>
        ))}
      </div>
      <div className="sa-banner">SM-OS</div>
      <div className="sa-sub">Shreenidhi M — Portfolio · press any key to return</div>
    </div>
  )
}