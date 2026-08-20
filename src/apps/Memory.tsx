import { useState } from 'react'
import { WinBody, WinStatusbar, StatusPanel } from '../ui/Window'
import { clickSnd, beep } from '../os/sound'
import { useOS } from '../os/store'

const SYMBOLS = ['JS', 'AI', 'DB', 'API', 'UX', 'GIT', 'SQL', '🤖']

interface MemCard {
  v: string
  i: number
  fl: boolean
  ma: boolean
}

function makeCards(): MemCard[] {
  return [...SYMBOLS, ...SYMBOLS]
    .sort(() => Math.random() - 0.5)
    .map((v, i) => ({ v, i, fl: false, ma: false }))
}

export default function Memory() {
  const [cards, setCards] = useState<MemCard[]>(() => makeCards())
  const [moves, setMoves] = useState(0)
  const [first, setFirst] = useState<number | null>(null)
  const [locked, setLocked] = useState(false)

  const matched = cards.filter((c) => c.ma).length / 2

  const start = () => {
    clickSnd()
    setCards(makeCards())
    setMoves(0)
    setFirst(null)
    setLocked(false)
  }

  const flip = (i: number) => {
    if (locked) return
    const c = cards[i]
    if (!c || c.fl || c.ma) return
    clickSnd()

    if (first === null) {
      setFirst(i)
      setCards((prev) => prev.map((x) => (x.i === i ? { ...x, fl: true } : x)))
      return
    }

    const f = cards[first]
    setMoves((m) => m + 1)

    if (f.v === c.v) {
      setCards((prev) => prev.map((x) => (x.i === i || x.i === f.i ? { ...x, ma: true, fl: true } : x)))
      setFirst(null)
      beep(660, 0.06, 'sine', 0.1)
      if (cards.filter((x) => x.ma).length / 2 + 1 === SYMBOLS.length) {
        useOS.getState().notify('MEMORY.EXE', '🎉 All pairs matched! Moves: ' + (moves + 1))
        beep(880, 0.12, 'sine', 0.12)
      }
    } else {
      setLocked(true)
      setCards((prev) => prev.map((x) => (x.i === i || x.i === f.i ? { ...x, fl: true } : x)))
      setTimeout(() => {
        setCards((prev) => prev.map((x) => (x.i === i || x.i === f.i ? { ...x, fl: false } : x)))
        setFirst(null)
        setLocked(false)
        beep(200, 0.04, 'square', 0.06)
      }, 700)
    }
  }

  return (
    <>
      <WinBody>
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <span style={{ fontFamily: 'var(--font-vt)', fontSize: 22, color: '#00ff00' }}>MEMORY.EXE</span>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#6688aa' }}>Match all pairs · Fewer moves wins</div>
          <button className="retro-btn" style={{ fontSize: 15, padding: '2px 12px', marginTop: 6 }} onClick={start}>[ NEW GAME ]</button>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-vt)', fontSize: 18, color: '#ffcc00' }}>
          <span>MOVES: <span style={{ color: '#fff' }}>{moves}</span></span>
          <span>LEFT: <span style={{ color: '#fff' }}>{SYMBOLS.length - matched}</span></span>
        </div>
        <div className="mem-grid">
          {cards.map((c) => (
            <button
              key={c.i}
              className={'mem-card' + (c.fl ? ' flip' : '') + (c.ma ? ' match' : '')}
              onClick={() => flip(c.i)}
            >
              {c.ma || c.fl ? c.v : '?'}
            </button>
          ))}
        </div>
      </WinBody>
      <WinStatusbar>
        <StatusPanel>8 pairs</StatusPanel>
        <StatusPanel>Match the symbols</StatusPanel>
      </WinStatusbar>
    </>
  )
}