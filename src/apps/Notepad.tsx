import { useEffect, useRef, useState } from 'react'
import { WinBody, WinMenubar, MenuItem, WinStatusbar, StatusPanel } from '../ui/Window'
import { useOS } from '../os/store'
import { clickSnd } from '../os/sound'

const KEY = 'sm-os-notepad'

export default function Notepad() {
  const [text, setText] = useState('')
  const [saved, setSaved] = useState(true)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const notify = useOS((s) => s.notify)

  useEffect(() => {
    try {
      setText(window.localStorage.getItem(KEY) || '')
    } catch {
      /* storage unavailable */
    }
  }, [])

  const persist = (v: string) => {
    try {
      window.localStorage.setItem(KEY, v)
    } catch {
      /* storage unavailable */
    }
    setSaved(true)
  }

  const onChange = (v: string) => {
    setText(v)
    setSaved(false)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => persist(v), 500)
  }

  const saveNow = () => {
    clickSnd()
    if (timer.current) clearTimeout(timer.current)
    persist(text)
    notify('NOTEPAD.EXE', '💾 Notes saved.')
  }

  const download = () => {
    clickSnd()
    if (timer.current) clearTimeout(timer.current)
    persist(text)
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'shreenidhi-notes.txt'
    a.click()
    URL.revokeObjectURL(a.href)
    notify('NOTEPAD.EXE', '📥 Downloaded shreenidhi-notes.txt')
  }

  const clearAll = () => {
    clickSnd()
    setText('')
    persist('')
    notify('NOTEPAD.EXE', '🗑 Notes cleared.')
  }

  const words = text.trim() ? text.trim().split(/\s+/).length : 0

  return (
    <>
      <WinMenubar>
        <MenuItem onClick={saveNow}>Save</MenuItem>
        <MenuItem onClick={download}>Download .txt</MenuItem>
        <MenuItem onClick={clearAll}>Clear</MenuItem>
      </WinMenubar>
      <WinBody style={{ padding: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', gap: 6, padding: '6px 8px', background: 'var(--panel)', borderBottom: '1px solid #333388' }}>
          <button className="retro-btn" style={{ fontSize: 11, padding: '2px 10px', marginTop: 0 }} onClick={saveNow}>💾 Save</button>
          <button className="retro-btn" style={{ fontSize: 11, padding: '2px 10px', marginTop: 0 }} onClick={download}>📥 Download .txt</button>
          <button className="retro-btn" style={{ fontSize: 11, padding: '2px 10px', marginTop: 0 }} onClick={clearAll}>🗑 Clear</button>
        </div>
        <textarea
          value={text}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type your notes here — they save automatically…"
          spellCheck={false}
          style={{ flex: 1, border: 'none', outline: 'none', resize: 'none', padding: 10, fontFamily: 'var(--font-mono)', fontSize: 13, lineHeight: 1.6 }}
        />
      </WinBody>
      <WinStatusbar>
        <StatusPanel>{words} words · {text.length} chars</StatusPanel>
        <StatusPanel>{saved ? '✓ Saved' : 'Saving…'}</StatusPanel>
      </WinStatusbar>
    </>
  )
}