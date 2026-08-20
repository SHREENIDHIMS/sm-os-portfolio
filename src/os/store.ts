import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ThemeName = 'blue' | 'amber' | 'red' | 'green' | 'purple'
export type Phase = 'boot' | 'welcome' | 'desktop'
export type SnapRegion = 'left' | 'right' | 'max' | 'restore'

export interface WinState {
  open: boolean
  minimized: boolean
  focused: boolean
  x: number
  y: number
  w: number
  h: number
  z: number
  placed: boolean
  maximized: boolean
  prev: { x: number; y: number; w: number; h: number } | null
}

export interface Notif {
  id: number
  title: string
  msg: string
}

export interface PersistedSettings {
  theme: ThemeName
  wallpaper: number
  muted: boolean
  scanlines: boolean
}

interface OSState extends PersistedSettings {
  phase: Phase
  windows: Record<string, WinState>
  zTop: number
  startOpen: boolean
  ctxOpen: boolean
  ctxPos: { x: number; y: number }
  notifs: Notif[]
  clippyVisible: boolean
  notifSeq: number
  shutdown: boolean

  setPhase: (p: Phase) => void
  shutdownOS: () => void
  openWin: (id: string, w: number, h: number) => void
  closeWin: (id: string) => void
  minimizeWin: (id: string) => void
  toggleMaximize: (id: string) => void
  snapWin: (id: string, region: SnapRegion) => void
  focusWin: (id: string) => void
  moveWin: (id: string, x: number, y: number) => void
  closeAll: () => void
  setTheme: (t: ThemeName) => void
  setWallpaper: (n: number) => void
  toggleMuted: () => void
  toggleScanlines: () => void
  setStartOpen: (v: boolean) => void
  setCtx: (open: boolean, pos?: { x: number; y: number }) => void
  notify: (title: string, msg: string) => void
  dismissNotif: (id: number) => void
  setClippy: (v: boolean) => void
}

const TASKBAR_H = 40

function defaultWin(id: string, w: number, h: number): WinState {
  return {
    open: false,
    minimized: false,
    focused: false,
    x: 80,
    y: 60,
    w,
    h,
    z: 20,
    placed: false,
    maximized: false,
    prev: null,
  }
}

export const useOS = create<OSState>()(
  persist(
    (set, get) => ({
      phase: 'boot',
      windows: {},
      zTop: 20,
      theme: 'blue',
      wallpaper: 4,
      muted: false,
      scanlines: true,
      startOpen: false,
      ctxOpen: false,
      ctxPos: { x: 0, y: 0 },
      notifs: [],
      clippyVisible: false,
      notifSeq: 0,
      shutdown: false,

      setPhase: (p) => set({ phase: p }),
      shutdownOS: () => {
        set({ shutdown: true, phase: 'boot', startOpen: false })
        setTimeout(() => useOS.getState().closeAll(), 200)
      },

      openWin: (id, w, h) => {
        const cur = get().windows[id] || defaultWin(id, w, h)
        const vw = window.innerWidth
        const vh = window.innerHeight
        let x = cur.x
        let y = cur.y
        let maximized = cur.maximized

        if (!cur.placed) {
          const keys = Object.keys(get().windows)
          const cascade = (keys.length % 5) * 20
          x = Math.max(8, Math.min(vw - w - 8, 80 + cascade))
          y = Math.max(8, Math.min(vh - h - TASKBAR_H - 8, 60 + cascade))
          if (vw < 700) maximized = true
        }

        set((s) => ({
          zTop: s.zTop + 1,
          windows: {
            ...s.windows,
            [id]: {
              ...cur,
              open: true,
              minimized: false,
              focused: true,
              x,
              y,
              w,
              h,
              z: s.zTop + 1,
              placed: true,
              maximized,
            },
          },
          startOpen: false,
        }))
        Object.keys(get().windows).forEach((k) => {
          if (k !== id && get().windows[k]?.focused) {
            set((s) => ({
              windows: { ...s.windows, [k]: { ...s.windows[k], focused: false } },
            }))
          }
        })
      },

      closeWin: (id) =>
        set((s) => ({
          windows: {
            ...s.windows,
            [id]: { ...s.windows[id], open: false, minimized: false, focused: false, maximized: false, prev: null },
          },
        })),

      minimizeWin: (id) =>
        set((s) => ({
          windows: { ...s.windows, [id]: { ...s.windows[id], minimized: true, focused: false } },
        })),

      toggleMaximize: (id) => {
        const win = get().windows[id]
        if (!win) return
        if (win.maximized) {
          const p = win.prev || { x: 80, y: 60, w: win.w, h: win.h }
          set((s) => ({
            windows: { ...s.windows, [id]: { ...s.windows[id], maximized: false, x: p.x, y: p.y, w: p.w, h: p.h, prev: null } },
          }))
        } else {
          set((s) => ({
            windows: {
              ...s.windows,
              [id]: { ...s.windows[id], maximized: true, prev: { x: s.windows[id].x, y: s.windows[id].y, w: s.windows[id].w, h: s.windows[id].h } },
            },
          }))
        }
      },

      snapWin: (id, region) => {
        const win = get().windows[id]
        if (!win) return
        const vw = window.innerWidth
        const vh = window.innerHeight - TASKBAR_H
        if (region === 'max') {
          get().toggleMaximize(id)
          return
        }
        if (region === 'restore') {
          const p = win.prev || { x: 80, y: 60, w: win.w, h: win.h }
          set((s) => ({
            windows: { ...s.windows, [id]: { ...s.windows[id], maximized: false, x: p.x, y: p.y, w: p.w, h: p.h, prev: null } },
          }))
          return
        }
        const half = Math.floor(vw / 2)
        set((s) => ({
          windows: {
            ...s.windows,
            [id]: {
              ...s.windows[id],
              maximized: false,
              x: region === 'left' ? 0 : half,
              y: 0,
              w: half,
              h: vh,
              prev: win.prev,
            },
          },
        }))
      },

      focusWin: (id) => {
        const win = get().windows[id]
        if (!win) return
        if (win.focused) return
        const next: Record<string, WinState> = {}
        Object.keys(get().windows).forEach((k) => {
          if (get().windows[k]?.focused) next[k] = { ...get().windows[k], focused: false }
        })
        set((s) => ({
          zTop: s.zTop + 1,
          windows: { ...s.windows, ...next, [id]: { ...s.windows[id], focused: true, z: s.zTop + 1 } },
        }))
      },

      moveWin: (id, x, y) =>
        set((s) => ({
          windows: { ...s.windows, [id]: { ...s.windows[id], x, y } },
        })),

      closeAll: () =>
        set((s) => {
          const w = { ...s.windows }
          Object.keys(w).forEach((k) => {
            w[k] = { ...w[k], open: false, minimized: false, focused: false, maximized: false, prev: null }
          })
          return { windows: w }
        }),

      setTheme: (t) => set({ theme: t }),
      setWallpaper: (n) => set({ wallpaper: n }),
      toggleMuted: () => set((s) => ({ muted: !s.muted })),
      toggleScanlines: () => set((s) => ({ scanlines: !s.scanlines })),
      setStartOpen: (v) => set({ startOpen: v }),
      setCtx: (open, pos) => set({ ctxOpen: open, ctxPos: pos || get().ctxPos }),

      notify: (title, msg) => {
        const id = get().notifSeq + 1
        set((s) => ({ notifs: [...s.notifs, { id, title, msg }].slice(-4), notifSeq: id }))
        setTimeout(() => get().dismissNotif(id), 3200)
      },
      dismissNotif: (id) => set((s) => ({ notifs: s.notifs.filter((n) => n.id !== id) })),
      setClippy: (v) => set({ clippyVisible: v }),
    }),
    {
      name: 'sm-os-settings',
      partialize: (s) => ({ theme: s.theme, wallpaper: s.wallpaper, muted: s.muted, scanlines: s.scanlines }),
      storage: {
        getItem: (n) => (typeof window !== 'undefined' ? window.localStorage.getItem(n) : null),
        setItem: (n, v) => {
          if (typeof window !== 'undefined') window.localStorage.setItem(n, v)
        },
        removeItem: (n) => {
          if (typeof window !== 'undefined') window.localStorage.removeItem(n)
        },
      },
    },
  ),
)