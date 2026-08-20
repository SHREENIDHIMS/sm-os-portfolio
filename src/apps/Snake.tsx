import { useEffect, useRef, useState } from 'react'
import { WinBody, WinStatusbar, StatusPanel } from '../ui/Window'
import { clickSnd, beep } from '../os/sound'

const SZ = 20
const SPD = 155

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
})

export default function Snake() {
  const g = useRef<Game>(fresh())
  const [, force] = useState(0)
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
    const parent = board.parentElement
    if (!parent) return
    const sz = Math.min(parent.clientWidth - 20, window.innerHeight * 0.45, 360)
    if (sz <= 0) return
    board.style.width = sz + 'px'
    board.style.height = sz + 'px'
    board.style.backgroundSize = sz / SZ + 'px ' + sz / SZ + 'px'
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

  const start = () => {
    clickSnd()
    if (timer.current) clearInterval(timer.current)
    const s = [{ x: 10, y: 10 }]
    Object.assign(g.current, fresh(), { snake: s, food: randFood(s), running: true, started: true })
    timer.current = window.setInterval(step, SPD)
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
      beep(200, 0.3, 'sawtooth', 0.1)
      render()
      return
    }

    const ate = game.food.x === head.x && game.food.y === head.y
    if (ate) {
      game.snake = [head, ...game.snake]
      game.score += 10
      game.food = randFood(game.snake)
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

  const cellPx = boardRef.current ? Math.max(8, Math.floor(boardRef.current.clientWidth / SZ)) : 16
  const game = g.current

  return (
    <>
      <WinBody style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        {!game.started ? (
          <div style={{ textAlign: 'center', padding: 20 }}>
            <div style={{ fontFamily: 'var(--font-vt)', fontSize: 'clamp(40px,10vw,80px)', color: '#10860c', letterSpacing: 2, lineHeight: 0.9 }}>SNAKE v2.0</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#6688aa', margin: '10px 0' }}>Arrow keys / WASD / D-Pad / Swipe</div>
            <button className="retro-btn" onClick={start}>[ START GAME ]</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, width: '100%', paddingTop: 0 }}>
            <div className="snake-hud">
              <span>SCORE: <span style={{ color: '#fff' }}>{game.score}</span></span>
              <span>HI: <span style={{ color: '#fff' }}>{game.hi}</span></span>
            </div>
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
                <div>GAME OVER</div>
                <div style={{ color: '#ffcc00', fontSize: 18, marginTop: 5 }}>Score: {game.score}</div>
                <button className="retro-btn" onClick={start}>[ RETRY ]</button>
              </div>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#6688aa' }}>Walls wrap · Avoid your tail</div>
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