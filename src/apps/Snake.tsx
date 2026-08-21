import { useEffect, useRef, useState } from 'react'
import { WinBody, WinStatusbar, StatusPanel } from '../ui/Window'
import { clickSnd, beep } from '../os/sound'
import { submitScore, getPlayerName } from '../os/leaderboard'
import { ScoreTable, NameField } from '../ui/ArcadeScores'

const SZ = 20
const BASE_SPD: Record<string, number> = { easy: 210, normal: 155, hard: 110 }
const speedFor = (d: string, eaten: number) => Math.max(55, (BASE_SPD[d] ?? 155) - eaten * 4)

interface Pt {
  x: number
  y: number
}

interface Game {
  snake: Pt[]
  food: Pt
  dir: string
  nextDir: string
  score: number
  hi: number
  running: boolean
  over: boolean
  started: boolean
  saved: boolean
  eaten: number
  diff: string
}

const fresh = (): Game => ({
  snake: [{ x: 10, y: 10 }],
  food: { x: 5, y: 5 },
  dir: 'RIGHT',
  nextDir: 'RIGHT',
  score: 0,
  hi: 0,
  running: false,
  over: false,
  started: false,
  saved: false,
  eaten: 0,
  diff: 'normal',
})

export default function Snake() {
  const g = useRef<Game>(fresh())
  const [, force] = useState(0)
  const [diff, setDiff] = useState<'easy' | 'normal' | 'hard'>('normal')
  const [nameErr, setNameErr] = useState(false)
  const [cellPx, setCellPx] = useState(16)
  const timer = useRef<number | null>(null)
  const boardRef = useRef<HTMLDivElement>(null)
  const render = () => force((n) => n + 1)

  const randFood = (body: Pt[]) => {
    let f: Pt
    do {
      f = { x: Math.floor(Math.random() * SZ), y: Math.floor(Math.random() * SZ) }
    } while (body.some((p) => p.x === f.x && p.y === f.y))
    return f
  }

  const sizeBoard = () => {
    const board = boardRef.current
    if (!board) return
    const frame = board.parentElement
    if (!frame) return
    const host = frame.parentElement
    if (!host) return
    const avail = Math.min(host.clientWidth - 34, window.innerHeight * 0.45, 360)
    if (avail <= 0) return
    const cell = Math.max(8, Math.floor(avail / SZ))
    const sz = cell * SZ
    board.style.width = sz + 'px'
    board.style.height = sz + 'px'
    board.style.backgroundSize = cell + 'px ' + cell + 'px'
    setCellPx(cell)
  }

  useEffect(() => {
    sizeBoard()
    window.addEventListener('resize', sizeBoard)
    return () => {
      window.removeEventListener('resize', sizeBoard)
      if (timer.current) clearInterval(timer.current)
    }
  }, [])

  const started = g.current.started
  useEffect(() => {
    if (started) {
      sizeBoard()
      render()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started])

  const start = (d: string = 'normal') => {
    if (!getPlayerName().trim()) {
      setNameErr(true)
      document.getElementById('arcadeName')?.focus()
      return
    }
    clickSnd()
    if (timer.current) clearInterval(timer.current)
    const s = [{ x: 10, y: 10 }]
    Object.assign(g.current, fresh(), { snake: s, food: randFood(s), running: true, started: true, diff: d })
    timer.current = window.setInterval(step, speedFor(d, 0))
    render()
  }

  const step = () => {
    const game = g.current
    if (!game.running || game.over) return
    game.dir = game.nextDir
    const head = { ...game.snake[0] }
    if (game.dir === 'UP') head.y--
    if (game.dir === 'DOWN') head.y++
    if (game.dir === 'LEFT') head.x--
    if (game.dir === 'RIGHT') head.x++
    head.x = (head.x + SZ) % SZ
    head.y = (head.y + SZ) % SZ

    if (game.snake.slice(0, -1).some((p) => p.x === head.x && p.y === head.y)) {
      game.over = true
      game.running = false
      if (timer.current) clearInterval(timer.current)
      if (game.score > game.hi) game.hi = game.score
      submitScore('snake', getPlayerName(), game.score)
      game.saved = true
      beep(200, 0.3, 'sawtooth', 0.1)
      render()
      return
    }

    const ate = game.food.x === head.x && game.food.y === head.y
    if (ate) {
      game.snake = [head, ...game.snake]
      game.score += 10
      game.eaten++
      game.food = randFood(game.snake)
      if (timer.current) clearInterval(timer.current)
      timer.current = window.setInterval(step, speedFor(game.diff, game.eaten))
      beep(660, 0.05, 'sine', 0.08)
    } else {
      game.snake = [head, ...game.snake.slice(0, -1)]
    }
    render()
  }

  const setDir = (d: string) => {
    const game = g.current
    if (!game.running || game.over) return
    const opp: Record<string, string> = { UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT' }
    if (opp[d] !== game.dir) game.nextDir = d
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return
      const k = e.key.toLowerCase()
      const map: Record<string, string> = { arrowup: 'UP', arrowdown: 'DOWN', arrowleft: 'LEFT', arrowright: 'RIGHT', w: 'UP', s: 'DOWN', a: 'LEFT', d: 'RIGHT' }
      if (map[k]) {
        e.preventDefault()
        setDir(map[k])
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const onSwipe = (dir: string) => setDir(dir)

  const game = g.current

  return (
    <>
      <WinBody style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        {!game.started ? (
          <div style={{ textAlign: 'center', padding: 20 }}>
            <div style={{ fontFamily: 'var(--font-vt)', fontSize: 'clamp(40px,10vw,80px)', color: '#39ff14', letterSpacing: 2, lineHeight: 0.9, textShadow: '0 0 14px rgba(57,255,20,0.5)' }}>SNAKE v2.0</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#6688aa', margin: '10px 0' }}>Arrow keys / WASD / D-Pad / Swipe</div>
            <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
              {(['easy', 'normal', 'hard'] as const).map((d) => (
                <button
                  key={d}
                  className={'retro-btn' + (diff === d ? ' sel' : '')}
                  style={{ fontSize: 14, padding: '2px 10px', marginTop: 0 }}
                  onClick={() => setDiff(d)}
                >
                  {d.toUpperCase()}
                </button>
              ))}
            </div>
            {(getPlayerName().trim() ? null : (
              <div style={{ marginTop: 8 }}>
                <NameField onChange={() => setNameErr(false)} />
                {nameErr && <div className="arcade-err">⚠ TYPE YOUR NAME TO PLAY</div>}
              </div>
            ))}
            <button className="retro-btn" onClick={() => start(diff)}>[ START GAME ]</button>
            <div style={{ marginTop: 12 }}>
              <ScoreTable game="snake" limit={3} title="TOP PLAYERS" />
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, width: '100%', paddingTop: 0 }}>
            <div className="snake-hud">
              <span>SCORE: <span style={{ color: '#fff' }}>{game.score}</span></span>
              <span>HI: <span style={{ color: '#fff' }}>{game.hi}</span></span>
            </div>
            <div className="snake-frame">
              <div
                className="snake-board"
                ref={boardRef}
                style={{ backgroundImage: 'linear-gradient(rgba(0,0,100,0.15) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,100,0.15) 1px,transparent 1px)' }}
                onPointerDown={(e) => {
                  const el = boardRef.current
                  if (!el) return
                  const r = el.getBoundingClientRect()
                  const dx = e.clientX - (r.left + r.width / 2)
                  const dy = e.clientY - (r.top + r.height / 2)
                  if (Math.abs(dx) > Math.abs(dy)) onSwipe(dx > 0 ? 'RIGHT' : 'LEFT')
                  else onSwipe(dy > 0 ? 'DOWN' : 'UP')
                }}
              >
                {game.snake.map((p, i) => (
                  <div
                    key={i}
                    className={'snake-cell ' + (i === 0 ? 'snake-head' : 'snake-body')}
                    style={{ left: p.x * cellPx, top: p.y * cellPx, width: cellPx, height: cellPx }}
                  />
                ))}
                <div className="snake-cell snake-food" style={{ left: game.food.x * cellPx, top: game.food.y * cellPx, width: cellPx, height: cellPx }} />
                <div className={'snake-overlay' + (game.over ? ' vis' : '')}>
                  <>
                    <div>GAME OVER</div>
                    <div style={{ color: '#ffcc00', fontSize: 18, marginTop: 5 }}>Score: {game.score}</div>
                    {game.saved && (
                      <div style={{ marginTop: 8 }}>
                        <ScoreTable game="snake" limit={3} title="TOP PLAYERS" />
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                      <button className="retro-btn" onClick={() => start(game.diff)}>[ RETRY ]</button>
                      <button
                        className="retro-btn"
                        onClick={() => {
                          if (timer.current) clearInterval(timer.current)
                          g.current.started = false
                          g.current.running = false
                          g.current.over = false
                          render()
                        }}
                      >[ MENU ]</button>
                    </div>
                  </>
                </div>
              </div>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#6688aa' }}>{game.diff.toUpperCase()} MODE · Walls wrap · Avoid your tail</div>
            <div className="snake-dpad">
              <div className="dpad-row"><div className="dpad-center" /><button className="dpad-btn" onClick={() => setDir('UP')}>▲</button><div className="dpad-center" /></div>
              <div className="dpad-row"><button className="dpad-btn" onClick={() => setDir('LEFT')}>◀</button><div className="dpad-center" /><button className="dpad-btn" onClick={() => setDir('RIGHT')}>▶</button></div>
              <div className="dpad-row"><div className="dpad-center" /><button className="dpad-btn" onClick={() => setDir('DOWN')}>▼</button><div className="dpad-center" /></div>
            </div>
          </div>
        )}
      </WinBody>
      <WinStatusbar>
        <StatusPanel>ARROWS/WASD</StatusPanel>
        <StatusPanel>📱 D-PAD</StatusPanel>
        <StatusPanel>+10 per food</StatusPanel>
      </WinStatusbar>
    </>
  )
}