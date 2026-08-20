import { useState } from 'react'
import { useOS } from '../os/store'
import { clippyTips } from '../data/content'
import { clickSnd } from '../os/sound'

export function Clippy() {
  const visible = useOS((s) => s.clippyVisible)
  const setClippy = useOS((s) => s.setClippy)
  const [idx, setIdx] = useState(0)

  if (!visible) return null

  const next = () => {
    clickSnd()
    setIdx((i) => (i + 1) % clippyTips.length)
  }

  return (
    <div id="clippy" className="open">
      <div className="clippy-header">
        <span>📎 Clippy</span>
        <button className="clippy-close" onClick={() => { clickSnd(); setClippy(false) }}>✕</button>
      </div>
      <div className="clippy-body">
        <img src="https://media.tenor.com/9z1B7d2L4TsAAAAi/clippy.gif" alt="clippy" onError={(e) => (e.currentTarget.style.display = 'none')} />
        <div className="clippy-text">
          <p>{clippyTips[idx]}</p>
          <div className="clippy-actions">
            <button onClick={next}>📎 NEXT TIP</button>
            <button onClick={() => { clickSnd(); setClippy(false) }}>Go Away</button>
          </div>
        </div>
      </div>
    </div>
  )
}