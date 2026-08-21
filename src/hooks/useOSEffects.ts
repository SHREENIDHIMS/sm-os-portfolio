import { useEffect } from 'react'
import { useOS } from '../os/store'
import { THEMES } from '../os/themes'
import { openApp } from '../os/registry'

export function useThemeEffect() {
  const theme = useOS((s) => s.theme)
  const scanlines = useOS((s) => s.scanlines)

  useEffect(() => {
    const th = THEMES[theme]
    const r = document.documentElement.style
    r.setProperty('--bg', th.bg)
    r.setProperty('--surface', th.sur)
    r.setProperty('--surface2', th.sur2)
    r.setProperty('--win-bg', th.win)
    r.setProperty('--green', th.acc)
    r.setProperty('--green2', th.acc2)
    r.setProperty('--panel', th.panel)
  }, [theme])

  useEffect(() => {
    let st = document.getElementById('dynSt') as HTMLStyleElement | null
    if (!scanlines) {
      if (!st) {
        st = document.createElement('style')
        st.id = 'dynSt'
        document.head.appendChild(st)
      }
      st.textContent = 'body::after{opacity:0!important;}'
    } else if (st) {
      st.remove()
    }
  }, [scanlines])
}

export function useShortcuts() {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement | null
      const typing = !!t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)
      const os = useOS.getState()
      if (e.key === 'Escape') {
        if (os.startOpen) os.setStartOpen(false)
        else if (os.ctxOpen) os.setCtx(false)
        return
      }
      if (e.ctrlKey && e.altKey && !typing) {
        const key = e.key.toLowerCase()
        if (key === 't') openApp('termWin')
        if (key === 'f') openApp('fileWin')
        if (key === 'r') openApp('resumeWin')
        if (key === 'm') openApp('memoryWin')
        if (key === 's') openApp('snakeWin')
        if (key === 'd') openApp('displayWin')
        if (key === 'p') openApp('projectsWin')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
}