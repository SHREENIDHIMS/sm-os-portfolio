import { useEffect } from 'react'
import { useOS } from '../os/store'
import type { ThemeName } from '../os/store'
import { openApp } from '../os/registry'

const themes: Record<ThemeName, { bg: string; sur: string; sur2: string; win: string; acc: string; acc2: string }> = {
  blue: { bg: '#0000aa', sur: '#000080', sur2: '#00008b', win: '#000090', acc: '#00ff00', acc2: '#44ff44' },
  amber: { bg: '#402000', sur: '#301800', sur2: '#402000', win: '#301500', acc: '#ffcc00', acc2: '#ffdd44' },
  red: { bg: '#440010', sur: '#330008', sur2: '#440010', win: '#330010', acc: '#ff4444', acc2: '#ff6666' },
  green: { bg: '#003020', sur: '#002015', sur2: '#003020', win: '#002015', acc: '#00ff88', acc2: '#44ffaa' },
  purple: { bg: '#200040', sur: '#180030', sur2: '#200040', win: '#180030', acc: '#cc88ff', acc2: '#ddaaff' },
}

export function useThemeEffect() {
  const theme = useOS((s) => s.theme)
  const scanlines = useOS((s) => s.scanlines)

  useEffect(() => {
    const th = themes[theme]
    const r = document.documentElement.style
    r.setProperty('--bg', th.bg)
    r.setProperty('--surface', th.sur)
    r.setProperty('--surface2', th.sur2)
    r.setProperty('--win-bg', th.win)
    r.setProperty('--green', th.acc)
    r.setProperty('--green2', th.acc2)
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
      const os = useOS.getState()
      if (e.key === 'Escape') {
        if (os.startOpen) os.setStartOpen(false)
        else if (os.ctxOpen) os.setCtx(false)
        return
      }
      if (e.ctrlKey && e.altKey) {
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