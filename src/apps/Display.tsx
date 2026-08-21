import { useEffect, useRef } from 'react'
import { WinBody, WinStatusbar, StatusPanel } from '../ui/Window'
import { useOS } from '../os/store'
import { wps } from '../os/wallpapers'
import { THEME_LIST } from '../os/themes'
import { clickSnd, openSnd } from '../os/sound'

function WpThumb({ idx }: { idx: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const cv = ref.current
    if (!cv) return
    cv.width = 120
    cv.height = 50
    const ctx = cv.getContext('2d')
    if (!ctx) return
    ctx.fillStyle = '#000010'
    ctx.fillRect(0, 0, 120, 50)
    try {
      for (let k = 0; k < 40; k++) wps[idx].fn(cv, ctx, k * 2)
    } catch {
      /* thumb draw failed */
    }
  }, [idx])
  return <canvas ref={ref} />
}

export default function Display() {
  const theme = useOS((s) => s.theme)
  const wallpaper = useOS((s) => s.wallpaper)
  const scanlines = useOS((s) => s.scanlines)
  const muted = useOS((s) => s.muted)
  const wpSpeed = useOS((s) => s.wpSpeed)
  const wpDim = useOS((s) => s.wpDim)
  const setTheme = useOS((s) => s.setTheme)
  const setWallpaper = useOS((s) => s.setWallpaper)
  const toggleScanlines = useOS((s) => s.toggleScanlines)
  const toggleMuted = useOS((s) => s.toggleMuted)
  const setWpSpeed = useOS((s) => s.setWpSpeed)
  const setWpDim = useOS((s) => s.setWpDim)
  const notify = useOS((s) => s.notify)

  const res = `${window.innerWidth}×${window.innerHeight}`

  return (
    <>
      <WinBody>
        <div className="disp-section">
          <span className="disp-label">OS Theme Color</span>
          <div className="theme-row">
            {THEME_LIST.map((t) => (
              <div
                key={t.id}
                className={'theme-sw' + (theme === t.id ? ' on' : '')}
                style={{ background: t.swatch }}
                onClick={() => {
                  clickSnd()
                  setTheme(t.id)
                  notify('DISPLAY.CPL', 'Theme: ' + t.label.toUpperCase())
                }}
              >
                <span style={{ color: t.acc }}>{t.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="disp-section">
          <span className="disp-label">Animated Wallpaper</span>
          <div className="wp-grid">
            {wps.map((wp, i) => (
              <div
                key={wp.name}
                className={'wp-thumb' + (wallpaper === i ? ' on' : '')}
                onClick={() => {
                  clickSnd()
                  setWallpaper(i)
                  notify('DISPLAY.CPL', 'Wallpaper: ' + wp.name)
                }}
              >
                <WpThumb idx={i} />
                <span className="wp-thumb-label">{wp.name}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="disp-section">
          <span className="disp-label">Picture Controls</span>
          <div className="disp-toggle">
            <span className="disp-toggle-label">Animation Speed</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <input type="range" min={25} max={200} step={25} value={Math.round(wpSpeed * 100)} onChange={(e) => setWpSpeed(Number(e.target.value) / 100)} style={{ width: 110 }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#00ff00', width: 34 }}>{wpSpeed.toFixed(2)}x</span>
            </div>
          </div>
          <div className="disp-toggle">
            <span className="disp-toggle-label">Screen Dim</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <input type="range" min={0} max={70} step={5} value={wpDim} onChange={(e) => setWpDim(Number(e.target.value))} style={{ width: 110 }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#00ff00', width: 34 }}>{wpDim}%</span>
            </div>
          </div>
        </div>
        <div className="disp-section">
          <span className="disp-label">Visual Effects</span>
          <div className="disp-toggle">
            <span className="disp-toggle-label">CRT Scanlines</span>
            <button className={'toggle-btn' + (scanlines ? ' on' : '')} onClick={() => { clickSnd(); toggleScanlines() }}>{scanlines ? 'ON' : 'OFF'}</button>
          </div>
          <div className="disp-toggle">
            <span className="disp-toggle-label">Sound Effects</span>
            <button className={'toggle-btn' + (!muted ? ' on' : '')} onClick={() => { openSnd(); toggleMuted() }}>{muted ? 'OFF' : 'ON'}</button>
          </div>
        </div>
        <div className="disp-section">
          <span className="disp-label">View Mode</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#c8c8ff' }}>
              Current: <span style={{ color: '#00ffff' }}>Desktop UI · Responsive</span>
            </span>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#6688aa', marginTop: 6 }}>
            Auto-maximizes windows on small screens
          </div>
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#6688aa', borderTop: '1px solid #222266', paddingTop: 6 }}>
          Resolution: <span style={{ color: '#00ff00' }}>{res}</span> &nbsp;|&nbsp; Color: 32-bit &nbsp;|&nbsp; 60Hz
        </div>
      </WinBody>
      <WinStatusbar>
        <StatusPanel>THEME PERSISTS</StatusPanel>
        <StatusPanel>5 themes · {wps.length} wallpapers</StatusPanel>
      </WinStatusbar>
    </>
  )
}