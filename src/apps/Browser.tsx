import { useState } from 'react'
import { WinBody, WinMenubar, MenuItem, WinStatusbar, StatusPanel } from '../ui/Window'
import { clickSnd } from '../os/sound'
import { useOS } from '../os/store'

export default function Browser() {
  const [url, setUrl] = useState('https://github.com/SHREENIDHIMS')
  const [status, setStatus] = useState('Ready')

  const go = () => {
    clickSnd()
    let u = url.trim()
    if (!u) return
    if (!u.startsWith('http://') && !u.startsWith('https://') && !u.startsWith('mailto:')) u = 'https://' + u
    setUrl(u)
    open(u)
  }

  const open = (u: string) => {
    setStatus('Navigating...')
    if (u.startsWith('mailto:')) window.location.href = u
    else window.open(u, '_blank')
    setTimeout(() => setStatus('Done'), 800)
  }

  return (
    <>
      <WinMenubar>
        <MenuItem>File</MenuItem>
        <MenuItem>View</MenuItem>
        <MenuItem>Favorites</MenuItem>
      </WinMenubar>
      <WinBody style={{ padding: 0, display: 'flex', flexDirection: 'column' }}>
        <div className="browser-bar">
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#000080' }}>Address:</span>
          <input
            className="browser-input"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') go() }}
          />
          <button className="browser-go" onClick={go}>Go ▶</button>
        </div>
        <div style={{ flex: 1, minHeight: 280, background: '#000060', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ fontFamily: 'var(--font-vt)', fontSize: 28, color: '#00ff00', marginBottom: 10 }}>🌐 SM-BROWSER</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#6688aa', marginBottom: 16 }}>Quick-navigate to Shreenidhi's profiles</div>
          <div className="browser-links" style={{ width: '100%', maxWidth: 320 }}>
            <button className="browser-link-btn" onClick={() => open('https://github.com/SHREENIDHIMS')}>🐙 GitHub</button>
            <button className="browser-link-btn" onClick={() => open('https://linkedin.com/in/shreenidhi-m03')}>🔗 LinkedIn</button>
            <button className="browser-link-btn" onClick={() => open('mailto:nshreenidhi655@gmail.com')}>📧 Email</button>
            <button className="browser-link-btn" onClick={() => useOS.getState().openWin('resumeWin', 640, 560)}>📄 Resume</button>
          </div>
        </div>
      </WinBody>
      <WinStatusbar>
        <StatusPanel><span className="status-dot" /> Connected</StatusPanel>
        <StatusPanel>{status}</StatusPanel>
      </WinStatusbar>
    </>
  )
}