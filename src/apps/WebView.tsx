import { useEffect, useState } from 'react'
import { WinBody, WinMenubar, MenuItem, WinStatusbar, StatusPanel } from '../ui/Window'
import { useOS } from '../os/store'
import { toEmbed } from '../os/webview'
import { clickSnd } from '../os/sound'

export default function WebView({ winId }: { winId?: string }) {
  const id = winId || 'webWin'
  const url = useOS((s) => s.webUrls[id] || '')
  const [draft, setDraft] = useState(url)

  useEffect(() => {
    setDraft(url)
  }, [url])

  const nav = () => {
    clickSnd()
    let t = draft.trim()
    if (!t) return
    if (!/^https?:\/\//i.test(t) && !t.startsWith('mailto:')) {
      const looksUrl = !t.includes(' ') && t.includes('.')
      t = looksUrl
        ? 'https://' + t
        : 'https://en.wikipedia.org/wiki/Special:Search?search=' + encodeURIComponent(t)
    }
    if (t !== url) useOS.getState().navigateWeb(id, toEmbed(t))
    else setDraft(url)
  }

  const openTab = () => {
    clickSnd()
    if (url) window.open(url, '_blank', 'noopener')
  }

  return (
    <>
      <WinMenubar>
        <MenuItem>File</MenuItem>
        <MenuItem>View</MenuItem>
        <MenuItem>Tools</MenuItem>
      </WinMenubar>
      <WinBody style={{ padding: 0, display: 'flex', flexDirection: 'column' }}>
        <div className="webview-bar">
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#000080' }}>URL:</span>
          <input
            className="webview-input"
            value={draft}
            spellCheck={false}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') nav() }}
          />
          <button className="browser-go" onClick={nav}>Go ▶</button>
          <button className="browser-go" onClick={openTab}>Open in Tab ▶</button>
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#6688aa', textAlign: 'center', padding: '3px 0', background: 'var(--panel)' }}>
          Type a word to search or a URL — some sites refuse frames; if blank, hit "Open in Tab".
        </div>
        {url ? (
          <iframe
            key={url}
            src={url}
            title="site viewer"
            style={{ flex: 1, width: '100%', border: 'none', background: '#fff' }}
          />
        ) : (
          <div style={{ flex: 1, background: 'var(--panel)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-vt)', fontSize: 18, color: '#00ff00' }}>NO PAGE LOADED</div>
        )}
      </WinBody>
      <WinStatusbar>
        <StatusPanel><span className="status-dot" /> Frame loading</StatusPanel>
        <StatusPanel>External site</StatusPanel>
      </WinStatusbar>
    </>
  )
}