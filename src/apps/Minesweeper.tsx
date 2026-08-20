import { useState } from 'react'
import { WinBody, WinStatusbar, StatusPanel } from '../ui/Window'
import { clickSnd, beep } from '../os/sound'
import { useOS } from '../os/store'

const COLS = 9
const ROWS = 9
const MINES = 10

interface Cell {
  mine: boolean
  open: boolean
  flag: boolean
  n: number
}

function makeGrid(): Cell[][] {
  const g: Cell[][] = Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({ mine: false, open: false, flag: false, n: 0 })),
  )
  let placed = 0
  while (placed < MINES) {
    const r = Math.floor(Math.random() * ROWS)
    const c = Math.floor(Math.random() * COLS)
    if (!g[r][c].mine) {
      g[r][c].mine = true
      placed++
    }
  }
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (!g[r][c].mine) {
        let n = 0
        for (let dr = -1; dr <= 1; dr++)
          for (let dc = -1; dc <= 1; dc++) {
            const rr = r + dr
            const cc = c + dc
            if (rr >= 0 && rr < ROWS && cc >= 0 && cc < COLS && g[rr][cc].mine) n++
          }
        g[r][c].n = n
      }
    }
  }
  return g
}

export default function Minesweeper() {
  const [grid, setGrid] = useState<Cell[][]>(() => makeGrid())
  const [lost, setLost] = useState(false)
  const [won, setWon] = useState(false)
  const [flags, setFlags] = useState(0)

  const reveal = (r: number, c: number) => {
    if (lost || won) return
    clickSnd()
    let next = grid.map((row) => row.map((cell) => ({ ...cell })))
    if (next[r][c].flag || next[r][c].open) return
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
            if (r2 >= 0 && r2 < ROWS && c2 >= 0 && c2 < COLS) flood(r2, c2)
          }
      }
    }
    flood(r, c)
    setGrid(next)
    const opened = next.flat().filter((cell) => cell.open).length
    if (opened === COLS * ROWS - MINES) {
      setWon(true)
      beep(880, 0.12, 'sine', 0.12)
      useOS.getState().notify('MINESWEEPER.EXE', '🏆 You cleared the minefield!')
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
    setGrid(makeGrid())
    setLost(false)
    setWon(false)
    setFlags(0)
  }

  return (
    <>
      <WinBody>
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <span style={{ fontFamily: 'var(--font-vt)', fontSize: 22, color: '#00ff00' }}>MINESWEEPER.EXE</span>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#6688aa' }}>
            {won ? '🎉 CLEARED!' : lost ? '💥 BOOM!' : `${MINES} mines · ${ROWS}x${COLS} · Right-click to flag`}
          </div>
          <button className="retro-btn" style={{ fontSize: 15, padding: '2px 12px', marginTop: 6 }} onClick={reset}>[ NEW GAME ]</button>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-vt)', fontSize: 18, color: '#ffcc00' }}>
          <span>MINES: <span style={{ color: '#fff' }}>{MINES - flags}</span></span>
          <span>FLAGS: <span style={{ color: '#fff' }}>{flags}</span></span>
        </div>
        <div className="mine-grid" style={{ gridTemplateColumns: `repeat(${COLS},32px)` }}>
          {grid.map((row, r) =>
            row.map((cell, c) => (
              <button
                key={r + '-' + c}
                className={'mine-cell' + (cell.open ? ' open' : '') + (cell.mine && cell.open ? ' bomb' : '') + (cell.n > 0 && cell.open ? ' n' + cell.n : '')}
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
      </WinBody>
      <WinStatusbar>
        <StatusPanel>{won ? 'WINNER' : lost ? 'GAME OVER' : 'SAFE'}</StatusPanel>
        <StatusPanel>click · right-click</StatusPanel>
      </WinStatusbar>
    </>
  )
}