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
| `snakeWin`  | Snake            | 🐍   | Arcade game, 3 difficulties, speed ramp + high scores |
| `memoryWin` | Memory           | 🃏   | Match pairs, timer + difficulty + high scores          |
| `mineWin`   | Minesweeper      | 💣   | 3 difficulty grids, first-click-safe, timer + high scores |
| `hallWin`   | Hall of Fame     | 🏆   | All high-score boards (every game & difficulty)         |
| `recycleWin`| Recycle Bin      | 🗑   | Eject-cartoon joke app                          |
| `resumeWin` | Resume Viewer    | 📄   | Shows `public/Shreenidhi_M_Resume.pdf` in-app   |

---

## Games & High-Score System

### Scoring rules

| Game | Score | Winner | Sort | Leaderboard key |
| ---- | ----- | ------ | ---- | --------------- |
| Snake (easy/normal/hard) | Points (`+10` per food) | Highest | Descending | `sm-os-scores-snake` |
| Memory (easy/normal/hard) | Clear time (seconds) | Fastest | Ascending | `sm-os-scores-memory-<diff>` |
| Minesweeper (easy/medium/hard) | Clear time (seconds) | Fastest | Ascending | `sm-os-scores-minesweeper-<diff>` |

Each difficulty has its **own leaderboard** so new players see the scores they need to beat on the exact board they chose.

### How it works — `src/os/leaderboard.ts`

- Every game+difficulty stores a top-5 list under its own `localStorage` key.
- `getScores(game)` reads and sorts the board; `submitScore(game, name, score)` inserts, trims to 5 and persists.
- A **shared player name** (`sm-os-player-name`) is read/written via `getPlayerName()` / `setPlayerName()`.
- `formatScore(game, score)` renders time scores as `1:25` / `9s`, plain numbers otherwise.

### UX flow (shared by all three games)

1. Each game's start screen shows a **`PLAYER NAME`** field (pre-filled with the saved name) plus the current top players — so a new player enters their name once and sees what to beat.
2. The name is saved to `localStorage` as they type, so it carries across all three games and all future visits.
3. When a game ends, the score is **auto-saved** under that name (no post-game prompt) and the updated board is shown.
4. The **Hall of Fame** window shows all boards (Snake + all Memory and Minesweeper difficulties) at once.

### Game details

- **Snake**: difficulty select on the start screen (Easy/Normal/Hard); speed ramps up by 4 ms per food eaten (floor 55 ms) so it gets harder as you grow.
- **Memory**: difficulty changes the number of pairs (6/8/10); a timer starts on the first flip; the leaderboard score is your clear time.
- **Minesweeper**: Easy 9×9/10, Medium 16×16/40, Hard 16×30/99 with adaptive cell size; the **first click can never detonate a mine** (a mine on the clicked cell is relocated); timer starts on the first click and only winning times make the board.

---

## Terminal Reference — `src/apps/Terminal.tsx`

Typing welcome sequence runs on open, then a live prompt accepts commands (`↑`/`↓` scroll history, `Tab` no-ops).

**Windows**: `about`, `skills` (`--json`), `radar`, `projects` (`--json`), `experience`, `ai`, `certs` (`--json`), `contact`, `files`, `code`, `clock`, `display`, `browser`

**Games**: `snake`, `memory`, `minesweeper` (alias `mine`), `halloffame` (aliases `hall`, `scores`)

**Files**: `ls`, `pwd`, `cat [about|skills]`, `history`, `clear`, `exit`

**System**: `whoami`, `uname`, `date`, `neofetch`, `w`, `sysinfo`, `sudo`, `theme [blue|amber|red|green|purple]`, `wallpaper [0-5]`

**Power**: `screensaver [on|off]`, `power` (launches the screensaver)

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

## Screensaver

Launchable from the Start menu (💤 Screensaver), the `screensaver` / `power` terminal commands, or… any time you want a break. Shows a falling-matrix rain with a bouncing `SM-OS` banner; **any key, click, or scroll** dismisses it and returns to the desktop.

---

## Themes & Wallpapers

- **Themes**: `blue`, `amber`, `red`, `green`, `purple` — switched in the Display app, via `theme` terminal command, or persisted setting.
- **Wallpapers** (`src/os/wallpapers.ts`): 6 canvas-animated options — `0 Matrix`, `1 Starfield`, `2 Plasma`, `3 Grid`, `4 Nebula`, `5 Circuit` (default `4`). Each uses a `WeakMap` to keep per-canvas animation state.

---

## Persistence Keys (localStorage)

| Key                       | Purpose                          |
| ------------------------- | -------------------------------- |
| `sm-os-settings`          | theme, wallpaper, muted, scanlines |
| `sm-os-player-name`       | shared arcade player name         |
| `sm-os-scores-snake`      | Snake top-5 board                 |
| `sm-os-scores-memory-<diff>` | Memory top-5 per difficulty     |
| `sm-os-scores-minesweeper-<diff>` | Minesweeper top-5 per difficulty |

Scores are per-browser/machine (no backend — works on a static host).

---

## Performance & SEO

- **Code-splitting**: every app is `React.lazy`-loaded and rendered inside a `Suspense` boundary in the window chrome, so the initial bundle only contains the OS shell + the first app you open.
- **SEO / Open Graph**: `index.html` ships title, description, `og:`/`twitter:` tags and a generated 1200×630 preview image (`public/og.png`) so links look sharp when shared. Update the canonical `og:url` / `og:image` domain in `index.html` if your Vercel domain differs from `sm-os-portfolio.vercel.app`.

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