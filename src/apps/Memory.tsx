import { useEffect, useState } from 'react'
import { WinBody, WinStatusbar, StatusPanel } from '../ui/Window'
import { clickSnd, beep } from '../os/sound'
import { useOS } from '../os/store'
import { submitScore, getPlayerName, formatScore } from '../os/leaderboard'
import type { GameId } from '../os/leaderboard'
import { ScoreTable, NameField } from '../ui/ArcadeScores'

type Diff = 'easy' | 'normal' | 'hard'

const SYMBOL_POOL = ['JS', 'AI', 'DB', 'API', 'UX', 'GIT', 'SQL', '🤖', 'TS', 'HTML', '☕', '🐍']
const MEM_DIFFS: Record<Diff, { pairs: number; label: string }> = {
  easy: { pairs: 6, label: 'EASY' },
  normal: { pairs: 8, label: 'NORMAL' },
  hard: { pairs: 10, label: 'HARD' },
}

interface MemCard {
  v: string
  i: number
  fl: boolean
  ma: boolean
}

function makeCards(pairs: number): MemCard[] {
  return SYMBOL_POOL.slice(0, pairs)
    .concat(SYMBOL_POOL.slice(0, pairs))
    .sort(() => Math.random() - 0.5)
    .map((v, i) => ({ v, i, fl: false, ma: false }))
}

export default function Memory() {
  const [diff, setDiff] = useState<Diff>('normal')
  const d = MEM_DIFFS[diff]
  const [cards, setCards] = useState<MemCard[]>(() => makeCards(d.pairs))
  const [moves, setMoves] = useState(0)
  const [first, setFirst] = useState<number | null>(null)
  const [locked, setLocked] = useState(false)
  const [finished, setFinished] = useState(false)
  const [winTime, setWinTime] = useState(0)
  const [winMoves, setWinMoves] = useState(0)
  const [started, setStarted] = useState(false)
  const [time, setTime] = useState(0)
  const [nameErr, setNameErr] = useState(false)

  const board: GameId = ('memory-' + diff) as GameId
  const matched = cards.filter((c) => c.ma).length / 2

  useEffect(() => {
    if (!started || finished) return
    const t = window.setInterval(() => setTime((s) => s + 1), 1000)
    return () => window.clearInterval(t)
  }, [started, finished])

  const start = (nd: Diff = diff) => {
    if (!getPlayerName().trim()) {
      setNameErr(true)
      document.getElementById('arcadeName')?.focus()
      return
    }
    clickSnd()
    const ndd = MEM_DIFFS[nd]
    setDiff(nd)
    setCards(makeCards(ndd.pairs))
    setMoves(0)
    setFirst(null)
    setLocked(false)
    setFinished(false)
    setWinTime(0)
    setWinMoves(0)
    setStarted(false)
    setTime(0)
  }

  const flip = (i: number) => {
    if (locked) return
    const c = cards[i]
    if (!c || c.fl || c.ma) return
    clickSnd()

    if (first === null) {
      if (!started) setStarted(true)
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
      if (cards.filter((x) => x.ma).length / 2 + 1 === d.pairs) {
        const mv = moves + 1
        setFinished(true)
        setWinTime(time)
        setWinMoves(mv)
        submitScore(board, getPlayerName(), time)
        useOS.getState().notify('MEMORY.EXE', '🎉 All pairs matched! Time: ' + formatScore(board, time) + ' · Moves: ' + mv)
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
        {moves === 0 && !finished && (
          <div style={{ marginBottom: 8 }}>
            <ScoreTable game={board} limit={3} title="TOP PLAYERS" />
            <div style={{ marginTop: 6 }}>
              <NameField onChange={() => setNameErr(false)} />
              {nameErr && <div className="arcade-err">⚠ TYPE YOUR NAME TO PLAY</div>}
            </div>
          </div>
        )}
        <div style={{ textAlign: 'center', marginBottom: 6 }}>
          <span style={{ fontFamily: 'var(--font-vt)', fontSize: 22, color: '#00ff00' }}>MEMORY.EXE</span>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#6688aa' }}>Match all pairs · Fastest time wins</div>
          <div style={{ display: 'flex', gap: 4, justifyContent: 'center', marginTop: 6 }}>
            {(Object.keys(MEM_DIFFS) as Diff[]).map((kd) => (
              <button
                key={kd}
                className={'retro-btn' + (diff === kd ? ' sel' : '')}
                style={{ fontSize: 13, padding: '1px 8px', marginTop: 0 }}
                onClick={() => start(kd)}
              >
                {MEM_DIFFS[kd].label}
              </button>
            ))}
            <button className="retro-btn" style={{ fontSize: 13, padding: '1px 8px', marginTop: 0 }} onClick={() => start(diff)}>
              [ NEW ]
            </button>
          </div>
        </div>
        <div className="arcade-hud">
          <span>TIME: <span style={{ color: '#fff' }}>{time}s</span></span>
          <span>MOVES: <span style={{ color: '#fff' }}>{moves}</span></span>
          <span>LEFT: <span style={{ color: '#fff' }}>{d.pairs - matched}</span></span>
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
        {finished && (
          <div style={{ textAlign: 'center', marginTop: 12 }}>
            <div style={{ fontFamily: 'var(--font-vt)', fontSize: 20, color: '#00ff00' }}>🎉 ALL PAIRS MATCHED!</div>
            <div style={{ fontFamily: 'var(--font-vt)', fontSize: 18, color: '#ffcc00', margin: '4px 0 8px' }}>TIME: {formatScore(board, winTime)} · MOVES: {winMoves}</div>
            <ScoreTable game={board} limit={5} title="TOP PLAYERS" />
            <button className="retro-btn" style={{ fontSize: 15, padding: '2px 12px' }} onClick={() => start(diff)}>[ PLAY AGAIN ]</button>
          </div>
        )}
      </WinBody>
      <WinStatusbar>
        <StatusPanel>{d.pairs} pairs</StatusPanel>
        <StatusPanel>{d.label}</StatusPanel>
        <StatusPanel>Match the symbols</StatusPanel>
      </WinStatusbar>
    </>
  )
}