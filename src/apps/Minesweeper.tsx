import { useEffect, useState } from 'react'
import { WinBody, WinStatusbar, StatusPanel } from '../ui/Window'
import { clickSnd, beep } from '../os/sound'
import { useOS } from '../os/store'
import { submitScore, getPlayerName, formatScore } from '../os/leaderboard'
import type { GameId } from '../os/leaderboard'
import { ScoreTable, NameField } from '../ui/ArcadeScores'

type Diff = 'easy' | 'medium' | 'hard'

const DIFFS: Record<Diff, { rows: number; cols: number; mines: number; label: string }> = {
  easy: { rows: 9, cols: 9, mines: 10, label: 'EASY' },
  medium: { rows: 16, cols: 16, mines: 40, label: 'MEDIUM' },
  hard: { rows: 16, cols: 30, mines: 99, label: 'HARD' },
}

interface Cell {
  mine: boolean
  open: boolean
  flag: boolean
  n: number
}

function makeGrid(rows: number, cols: number, mines: number): Cell[][] {
  const g: Cell[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({ mine: false, open: false, flag: false, n: 0 })),
  )
  let placed = 0
  while (placed < mines) {
    const r = Math.floor(Math.random() * rows)
    const c = Math.floor(Math.random() * cols)
    if (!g[r][c].mine) {
      g[r][c].mine = true
      placed++
    }
  }
  recomputeCounts(g)
  return g
}

function recomputeCounts(g: Cell[][]) {
  const rows = g.length
  const cols = g[0].length
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!g[r][c].mine) {
        let n = 0
        for (let dr = -1; dr <= 1; dr++)
          for (let dc = -1; dc <= 1; dc++) {
            const rr = r + dr
            const cc = c + dc
            if (rr >= 0 && rr < rows && cc >= 0 && cc < cols && g[rr][cc].mine) n++
          }
        g[r][c].n = n
      }
    }
  }
}

export default function Minesweeper() {
  const [diff, setDiff] = useState<Diff>('easy')
  const d = DIFFS[diff]
  const [grid, setGrid] = useState<Cell[][]>(() => makeGrid(d.rows, d.cols, d.mines))
  const [lost, setLost] = useState(false)
  const [won, setWon] = useState(false)
  const [flags, setFlags] = useState(0)
  const [started, setStarted] = useState(false)
  const [time, setTime] = useState(0)
  const [winTime, setWinTime] = useState(0)
  const [nameErr, setNameErr] = useState(false)

  const board: GameId = ('minesweeper-' + diff) as GameId

  useEffect(() => {
    if (!started || won || lost) return
    const t = window.setInterval(() => setTime((s) => s + 1), 1000)
    return () => window.clearInterval(t)
  }, [started, won, lost])

  const changeDiff = (nd: Diff) => {
    clickSnd()
    const ndd = DIFFS[nd]
    setDiff(nd)
    setGrid(makeGrid(ndd.rows, ndd.cols, ndd.mines))
    setLost(false)
    setWon(false)
    setFlags(0)
    setStarted(false)
    setTime(0)
    setWinTime(0)
  }

  const reveal = (r: number, c: number) => {
    if (lost || won) return
    if (!started && !getPlayerName().trim()) {
      setNameErr(true)
      document.getElementById('arcadeName')?.focus()
      return
    }
    clickSnd()
    if (!started) setStarted(true)
    let next = grid.map((row) => row.map((cell) => ({ ...cell })))
    if (next[r][c].flag || next[r][c].open) return
    if (!started && next[r][c].mine) {
      next[r][c].mine = false
      const spots: [number, number][] = []
      for (let rr = 0; rr < d.rows; rr++)
        for (let cc = 0; cc < d.cols; cc++)
          if (!next[rr][cc].mine && !(rr === r && cc === c)) spots.push([rr, cc])
      const [mr, mc] = spots[(Math.random() * spots.length) | 0]
      next[mr][mc].mine = true
      recomputeCounts(next)
    }
    if (next[r][c].mine) {
      next = next.map((row) => row.map((cell) => ({ ...cell, open: cell.mine ? true : cell.open })))
      setGrid(next)
      setLost(true)
      beep(150, 0.4, 'sawtooth', 0.12)
      useOS.getState().notify('MINESWEEPER.EXE', '💥 BOOM! You hit a mine.')
      return
    }
    const flood = (rr: number, cc: number) => {
      const cell = next[rr][cc]
      if (cell.open || cell.flag) return
      cell.open = true
      if (cell.n === 0) {
        for (let dr = -1; dr <= 1; dr++)
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue
            const r2 = rr + dr
            const c2 = cc + dc
            if (r2 >= 0 && r2 < d.rows && c2 >= 0 && c2 < d.cols) flood(r2, c2)
          }
      }
    }
    flood(r, c)
    setGrid(next)
    const opened = next.flat().filter((cell) => cell.open).length
    if (opened === d.rows * d.cols - d.mines) {
      setWon(true)
      setWinTime(time)
      submitScore(board, getPlayerName(), time)
      beep(880, 0.12, 'sine', 0.12)
      useOS.getState().notify('MINESWEEPER.EXE', '🏆 You cleared the minefield in ' + formatScore(board, time) + '!')
    }
  }

  const toggleFlag = (r: number, c: number) => {
    if (lost || won) return
    clickSnd()
    if (grid[r][c].open) return
    const next = grid.map((row) => row.map((cell) => ({ ...cell })))
    next[r][c].flag = !next[r][c].flag
    setGrid(next)
    setFlags(next.flat().filter((cell) => cell.flag).length)
  }

  const reset = () => {
    clickSnd()
    setGrid(makeGrid(d.rows, d.cols, d.mines))
    setLost(false)
    setWon(false)
    setFlags(0)
    setStarted(false)
    setTime(0)
    setWinTime(0)
  }

  const cellPx = Math.max(9, Math.min(32, Math.floor(340 / d.cols)))

  return (
    <>
      <WinBody>
        {!started && (
          <div style={{ marginBottom: 8 }}>
            <ScoreTable game={board} limit={3} title="BEST TIMES" />
            {!getPlayerName().trim() && (
              <div style={{ marginTop: 6 }}>
                <NameField onChange={() => setNameErr(false)} />
                {nameErr && <div className="arcade-err">⚠ TYPE YOUR NAME TO PLAY</div>}
              </div>
            )}
          </div>
        )}
        <div style={{ textAlign: 'center', marginBottom: 6 }}>
          <span style={{ fontFamily: 'var(--font-vt)', fontSize: 22, color: '#00ff00' }}>MINESWEEPER.EXE</span>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#6688aa' }}>
            {won ? '🎉 CLEARED!' : lost ? '💥 BOOM!' : `${d.mines} mines · ${d.rows}x${d.cols} · Right-click to flag`}
          </div>
          <div style={{ display: 'flex', gap: 4, justifyContent: 'center', marginTop: 6 }}>
            {(Object.keys(DIFFS) as Diff[]).map((kd) => (
              <button
                key={kd}
                className={'retro-btn' + (diff === kd ? ' sel' : '')}
                style={{ fontSize: 13, padding: '1px 8px', marginTop: 0 }}
                onClick={() => changeDiff(kd)}
              >
                {DIFFS[kd].label}
              </button>
            ))}
            <button className="retro-btn" style={{ fontSize: 13, padding: '1px 8px', marginTop: 0 }} onClick={reset}>
              [ NEW ]
            </button>
          </div>
        </div>
        <div className="arcade-hud">
          <span>MINES: <span style={{ color: '#fff' }}>{d.mines - flags}</span></span>
          <span>TIME: <span style={{ color: '#fff' }}>{time}s</span></span>
          <span>FLAGS: <span style={{ color: '#fff' }}>{flags}</span></span>
        </div>
        <div className="mine-grid" style={{ gridTemplateColumns: `repeat(${d.cols},${cellPx}px)` }}>
          {grid.map((row, r) =>
            row.map((cell, c) => (
              <button
                key={r + '-' + c}
                className={'mine-cell' + (cell.open ? ' open' : '') + (cell.mine && cell.open ? ' bomb' : '') + (cell.n > 0 && cell.open ? ' n' + cell.n : '')}
                style={{ width: cellPx, height: cellPx, fontSize: Math.max(9, cellPx - 8) }}
                onClick={() => reveal(r, c)}
                onContextMenu={(e) => {
                  e.preventDefault()
                  toggleFlag(r, c)
                }}
              >
                {cell.flag ? '🚩' : cell.open ? (cell.mine ? '💣' : cell.n > 0 ? cell.n : '') : ''}
              </button>
            )),
          )}
        </div>
        {lost && (
          <div style={{ textAlign: 'center', marginTop: 12 }}>
            <div style={{ fontFamily: 'var(--font-vt)', fontSize: 20, color: '#ff5555' }}>💥 BOOM! GAME OVER</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#6688aa', margin: '4px 0 8px' }}>You hit a mine — all mines revealed.</div>
            <button className="retro-btn" style={{ fontSize: 15, padding: '2px 12px' }} onClick={reset}>[ RETRY ]</button>
          </div>
        )}
        {won && (
          <div style={{ textAlign: 'center', marginTop: 12 }}>
            <div style={{ fontFamily: 'var(--font-vt)', fontSize: 20, color: '#00ff00' }}>🏆 CLEARED!</div>
            <div style={{ fontFamily: 'var(--font-vt)', fontSize: 18, color: '#ffcc00', margin: '4px 0 8px' }}>TIME: {formatScore(board, winTime)}</div>
            <ScoreTable game={board} limit={5} title="BEST TIMES" />
            <button className="retro-btn" style={{ fontSize: 15, padding: '2px 12px' }} onClick={reset}>[ PLAY AGAIN ]</button>
          </div>
        )}
      </WinBody>
      <WinStatusbar>
        <StatusPanel>{won ? 'WINNER' : lost ? 'GAME OVER' : 'SAFE'}</StatusPanel>
        <StatusPanel>{d.label} · {d.rows}x{d.cols}</StatusPanel>
        <StatusPanel>click · right-click</StatusPanel>
      </WinStatusbar>
    </>
  )
}