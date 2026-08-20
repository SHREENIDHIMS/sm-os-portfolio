import { useEffect } from 'react'
import { useOS } from '../os/store'
import type { ThemeName } from '../os/store'
import { openApp } from '../os/registry'

const themes: Record<ThemeName, { bg: string; sur: string; sur2: string; win: string; acc: string; acc2: string; panel: string }> = {
  blue: { bg: '#0000aa', sur: '#000080', sur2: '#000096', win: '#00008f', acc: '#00ff00', acc2: '#44ff44', panel: '#000048' },
  amber: { bg: '#402000', sur: '#301800', sur2: '#3a1c00', win: '#301500', acc: '#ffcc00', acc2: '#ffdd44', panel: '#1e0e00' },
  red: { bg: '#440010', sur: '#330008', sur2: '#3c000c', win: '#330010', acc: '#ff4444', acc2: '#ff6666', panel: '#200006' },
  green: { bg: '#003020', sur: '#002015', sur2: '#00281c', win: '#002015', acc: '#00ff88', acc2: '#44ffaa', panel: '#001409' },
  purple: { bg: '#200040', sur: '#180030', sur2: '#1e003a', win: '#180030', acc: '#cc88ff', acc2: '#ddaaff', panel: '#100022' },
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