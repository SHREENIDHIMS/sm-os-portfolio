# SM-OS Portfolio — Shreenidhi M

A retro Windows-95-style operating system portfolio built as a single-page web app. It presents the developer's profile through a virtual desktop: boot sequence, draggable windows, a taskbar with Start menu, a terminal, wallpapers, themes, and three playable arcade games with a persistent high-score system.

Rebuilt from a single-file HTML prototype into a modular **React + TypeScript + Vite + Tailwind CSS** application.

---

## Tech Stack

| Layer      | Choice                                   |
| ---------- | ---------------------------------------- |
| Build      | [Vite](https://vitejs.dev) 8              |
| Framework  | React 19                                  |
| Language   | TypeScript                                |
| Styling    | Tailwind CSS 4 + hand-written CSS (retro theme in `src/index.css`) |
| State      | [Zustand](https://zustand.docs.pmnd.rs) 5 (with `persist` middleware) |
| Sound      | WebAudio (`src/os/sound.ts`)              |
| Persistence| `localStorage` (settings + game scores)   |

---

## Quick Start

```bash
npm install        # install dependencies
npm run dev        # start dev server (http://localhost:5173)
npm run typecheck  # tsc --noEmit — type-check the whole project
npm run build      # production build → dist/
npm run preview    # serve the production build locally
```

Node 20+ and npm 10+ are recommended.

---

## Project Structure

```
.
├── index.html                 # Vite entry HTML
├── vite.config.ts             # React + Tailwind plugins, base '/'
├── vercel.json                # Vercel build settings (forces dev-deps install)
├── package.json
└── src/
    ├── main.tsx               # React root + OS bootstrap
    ├── App.tsx                # phase switch: boot → welcome → desktop
    ├── index.css              # full retro CSS (themes, windows, apps, arcade UI)
    ├── os/                    # operating-system core
    │   ├── store.ts           # Zustand store: window manager + persisted settings
    │   ├── registry.ts        # app catalogue (id, icon, size, component)
    │   ├── leaderboard.ts     # high-score engine (localStorage, per game)
    │   ├── wallpapers.ts      # 6 animated canvas wallpapers
    │   └── sound.ts           # WebAudio beep helpers (respects mute)
    ├── ui/                    # shell chrome
    │   ├── Boot.tsx           # boot sequence + shutdown screen
    │   ├── Desktop.tsx        # desktop icons + window hosting
    │   ├── Taskbar.tsx        # start button, open windows, clock, tray
    │   ├── StartMenu.tsx      # app launcher
    │   ├── ContextMenu.tsx    # right-click desktop menu
    │   ├── Window.tsx         # draggable/resizable window chrome (+ WinBody, statusbar, menus)
    │   ├── Notifications.tsx  # toast notifications
    │   ├── Clippy.tsx         # the assistant
    │   ├── Wallpaper.tsx      # renders an animated wallpaper on a canvas
    │   └── ArcadeScores.tsx   # shared high-score table + name-entry modal
    ├── apps/                  # each window is a self-contained app (see table below)
    ├── data/                  # static content
    │   ├── content.ts         # experience, education, certs, AI tools, contact, Clippy tips
    │   ├── projects.ts        # project cards
    │   ├── skills.ts          # skill categories + radar data
    │   └── files.ts           # file-manager folder tree
    └── hooks/
        ├── useClock.ts        # live clock + calendar
        └── useOSEffects.ts    # theme CSS vars + keyboard shortcuts
```

---

## OS Architecture

### 1. Window Manager — `src/os/store.ts`

A single Zustand store holds the whole "OS" state:

- **Phase**: `boot` → `welcome` → `desktop` (plus `shutdown`).
- **Windows**: every open window is tracked in `windows[id]` with position (`x`, `y`), size (`w`, `h`), `z` order, focus, minimized/maximized flags and a `prev` rect for un-maximize.
- **Actions**: `openWin`, `closeWin`, `minimizeWin`, `toggleMaximize`, `snapWin` (left / right / maximize), `focusWin`, `moveWin`, `closeAll`.
- **Persisted settings** (localStorage key `sm-os-settings`, partialized so window layout is *not* saved): `theme`, `wallpaper`, `muted`, `scanlines`.
- **Notifications** queue (max 4 visible), Clippy visibility, Start-menu / context-menu open state.

Zustand's `persist` middleware uses `createJSONStorage`, wrapped so `localStorage` is never accessed during server-side rendering.

### 2. App Registry — `src/os/registry.ts`

Every app is declared as `AppMeta`:

```ts
{ id: 'snakeWin', icon: '🐍', label: 'SNAKE', title: 'SNAKE.EXE — Classic Arcade', w: 440, h: 520, component: Snake, desktop: true, menu: true }
```

- `desktop: true` → appears on the desktop icon grid.
- `menu: true` → appears in the Start menu.
- `openApp(id)` helper opens a window using the registered default size.

**To add a new app**: create a component in `src/apps/`, add an `AppMeta` entry, optionally add an icon to the desktop grid, a Start-menu group, a File Manager item (`src/data/files.ts`), and a terminal command.

### 3. Window Chrome — `src/ui/Window.tsx`

The chrome (title bar, minimize/maximize/close, drag-to-move, edge-snap tiling) is shared. App content is wrapped in `WinBody` (scrollable content area) and `WinStatusbar`/`StatusPanel` (bottom status strip). `WinMenubar`/`MenuItem` provide the classic menu bar (used by the File Manager).

### 4. Boot Flow — `src/ui/Boot.tsx` & `src/App.tsx`

`App.tsx` renders the current phase:

```
boot  →  welcome (part of Boot.tsx)  →  desktop
```

The boot screen plays the animated boot progress bar and typing welcome text, then flips the store phase to `desktop`. `shutdownOS()` reverses the flow and closes all windows.

---

## App Inventory

| ID          | App              | Icon | Notes                                          |
| ----------- | ---------------- | ---- | ---------------------------------------------- |
| `termWin`   | Terminal         | `>_` | Full command set (see below)                    |
| `aboutWin`  | About            | 👤   | Bio, headshot, quick facts                      |
| `skillsWin` | Skills           | ⚙   | Skill categories with percentage bars           |
| `radarWin`  | Skill Radar      | 📊   | Canvas radar chart                              |
| `projectsWin` | Projects      | 📁   | Portfolio cards with GitHub/demo links          |
| `expWin`    | Career           | 🏆   | Experience timeline                             |
| `fileWin`   | File Manager     | 📁   | Browse the fake filesystem, launch apps         |
| `aiWin`     | AI Tools         | 🤖   | AI/ML tool stack                                |
| `certsWin`  | Certificates     | 🏅   | Credentials list                                |
| `contactWin`| Contact          | 📧   | Contact links                                   |
| `displayWin`| Display          | 🖥   | Theme + wallpaper picker                        |
| `codeWin`   | Code Playground  | 💻   | In-browser JS eval                              |
| `clockWin`  | Clock            | 🕐   | Live clock + calendar                           |
| `browserWin`| Browser          | 🌐   | Iframe web browser                              |
| `snakeWin`  | Snake            | 🐍   | Arcade game + high scores                       |
| `memoryWin` | Memory           | 🃏   | Match pairs + high scores                       |
| `mineWin`   | Minesweeper      | 💣   | Classic minesweeper + timer + high scores       |
| `hallWin`   | Hall of Fame     | 🏆   | All high-score boards in one window             |
| `recycleWin`| Recycle Bin      | 🗑   | Eject-cartoon joke app                          |
| `resumeWin` | Resume Viewer    | 📄   | Shows `public/Shreenidhi_M_Resume.pdf` in-app   |

---

## Games & High-Score System

### Scoring rules

| Game        | Score                | Winner   | Sort      |
| ----------- | -------------------- | -------- | --------- |
| Snake       | Points (`+10` per food) | Highest | Descending |
| Memory      | Moves to clear       | Fewest   | Ascending |
| Minesweeper | Clear time (seconds) | Fastest  | Ascending |

### How it works — `src/os/leaderboard.ts`

- Each game stores a top-5 list under its own `localStorage` key: `sm-os-scores-snake`, `sm-os-scores-memory`, `sm-os-scores-minesweeper`.
- `getScores(game)` reads and sorts the board; `qualifies(game, score)` returns `true` if the board isn't full or the score beats the current worst entry; `submitScore(game, name, score)` inserts, trims to 5 and persists.
- `formatScore(game, score)` renders time as `1:25` / `9s` for Minesweeper, plain numbers otherwise.

### UX flow (shared by all three games)

1. Before playing, the **start screen shows the current top players** so the new user sees what to beat.
2. On game over / win, if the score qualifies, a retro **`ENTER YOUR NAME`** modal (`NameEntry` in `src/ui/ArcadeScores.tsx`) appears — max 12 chars, uppercase, `Enter` saves, `Esc` skips.
3. The board is re-rendered with the new entry; the **Hall of Fame** window shows all boards at once.

### Minesweeper timer

The timer starts on the first reveal and stops on win/loss (managed by a `useEffect` interval keyed on `started`/`won`/`lost`). Only winning times make the board.

---

## Terminal Reference — `src/apps/Terminal.tsx`

Typing welcome sequence runs on open, then a live prompt accepts commands (`↑`/`↓` scroll history, `Tab` no-ops).

**Windows**: `about`, `skills` (`--json`), `radar`, `projects` (`--json`), `experience`, `ai`, `certs` (`--json`), `contact`, `files`, `code`, `clock`, `display`, `browser`

**Games**: `snake`, `memory`, `minesweeper` (alias `mine`), `halloffame` (aliases `hall`, `scores`)

**Files**: `ls`, `pwd`, `cat [about|skills]`, `history`, `clear`, `exit`

**System**: `whoami`, `uname`, `date`, `neofetch`, `w`, `sysinfo`, `sudo`, `theme [blue|amber|red|green|purple]`, `wallpaper [0-5]`

**Links**: `resume`, `linkedin`, `github`

**Misc**: `echo [text]`, `fortune`, and `skills --json` / `projects --json` / `certs --json` dumps.

Unknown commands print `bash: <cmd>: command not found`.

---

## Keyboard Shortcuts — `src/hooks/useOSEffects.ts`

| Shortcut        | Action                     |
| --------------- | -------------------------- |
| `Escape`        | Close Start menu / context menu |
| `Ctrl+Alt+T`    | Open Terminal              |
| `Ctrl+Alt+F`    | Open File Manager          |
| `Ctrl+Alt+R`    | Open Resume                |
| `Ctrl+Alt+M`    | Open Memory                |
| `Ctrl+Alt+S`    | Open Snake                 |
| `Ctrl+Alt+D`    | Open Display               |
| `Ctrl+Alt+P`    | Open Projects              |

`useThemeEffect` also applies the active theme as CSS variables (`--bg`, `--surface`, `--win-bg`, `--green`, …) and toggles the CRT scanline overlay.

---

## Themes & Wallpapers

- **Themes**: `blue`, `amber`, `red`, `green`, `purple` — switched in the Display app, via `theme` terminal command, or persisted setting.
- **Wallpapers** (`src/os/wallpapers.ts`): 6 canvas-animated options — `0 Matrix`, `1 Starfield`, `2 Plasma`, `3 Grid`, `4 Nebula`, `5 Circuit` (default `4`). Each uses a `WeakMap` to keep per-canvas animation state.

---

## Persistence Keys (localStorage)

| Key                       | Purpose                          |
| ------------------------- | -------------------------------- |
| `sm-os-settings`          | theme, wallpaper, muted, scanlines |
| `sm-os-scores-snake`      | Snake top-5 board                 |
| `sm-os-scores-memory`     | Memory top-5 board                |
| `sm-os-scores-minesweeper`| Minesweeper top-5 board           |

Scores are per-browser/machine (no backend — works on a static host).

---

## Deployment (Vercel)

`vercel.json` configures the build:

```json
{
  "framework": "vite",
  "installCommand": "npm install --include=dev",
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

`--include=dev` is required because Vercel runs `npm install` with `NPM_CONFIG_PRODUCTION=true`, which would skip `devDependencies` (including `vite`) and fail the build with `vite: command not found`.

**Push-to-deploy**: import the repo in Vercel → auto-detects Vite → every push to the connected branch deploys. `public/favicon.ico` and `public/Shreenidhi_M_Resume.pdf` are served at `/favicon.ico` and `/Shreenidhi_M_Resume.pdf`.

---

## Conventions

- No comments in code unless requested — the code is meant to read clean.
- Content (projects, skills, certs, experience) lives in `src/data/*` so it can be edited without touching components.
- Games, shell UI, and arcade UI share components via `src/ui/ArcadeScores.tsx` and the leaderboard engine in `src/os/leaderboard.ts`.