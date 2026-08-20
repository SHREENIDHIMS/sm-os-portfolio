import { useEffect, useRef, useState } from 'react'
import { WinBody, WinMenubar, MenuItem, WinStatusbar, StatusPanel } from '../ui/Window'
import { clickSnd } from '../os/sound'

const KEY = 'sm-os-notepad'

export default function Notepad() {
  const [text, setText] = useState('')
  const [saved, setSaved] = useState(true)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    try {
      setText(window.localStorage.getItem(KEY) || '')
    } catch {
      /* storage unavailable */
    }
  }, [])

  const onChange = (v: string) => {
    setText(v)
    setSaved(false)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      try {
        window.localStorage.setItem(KEY, v)
      } catch {
        /* storage unavailable */
      }
      setSaved(true)
    }, 500)
  }

  const words = text.trim() ? text.trim().split(/\s+/).length : 0

  return (
    <>
      <WinMenubar>
        <MenuItem>File</MenuItem>
        <MenuItem>Edit</MenuItem>
        <MenuItem>Format</MenuItem>
      </WinMenubar>
      <WinBody style={{ padding: 0, display: 'flex', flexDirection: 'column' }}>
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