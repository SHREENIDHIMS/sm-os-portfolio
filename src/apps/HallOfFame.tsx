import { WinBody, WinStatusbar, StatusPanel } from '../ui/Window'
import { ScoreTable } from '../ui/ArcadeScores'
import type { GameId } from '../os/leaderboard'

const GAMES: { id: GameId; title: string; icon: string; subtitle: string }[] = [
  { id: 'snake', title: 'SNAKE.EXE', icon: '🐍', subtitle: 'Highest points' },
  { id: 'memory-easy', title: 'MEMORY.EXE', icon: '🃏', subtitle: 'Easy · 6 pairs · fastest' },
  { id: 'memory-normal', title: 'MEMORY.EXE', icon: '🃏', subtitle: 'Normal · 8 pairs · fastest' },
  { id: 'memory-hard', title: 'MEMORY.EXE', icon: '🃏', subtitle: 'Hard · 10 pairs · fastest' },
  { id: 'minesweeper-easy', title: 'MINESWEEPER', icon: '💣', subtitle: 'Easy · 9x9 · fastest clear' },
  { id: 'minesweeper-medium', title: 'MINESWEEPER', icon: '💣', subtitle: 'Medium · 16x16 · fastest' },
  { id: 'minesweeper-hard', title: 'MINESWEEPER', icon: '💣', subtitle: 'Hard · 16x30 · fastest' },
]

export default function HallOfFame() {
  return (
    <>
      <WinBody>
        <div style={{ textAlign: 'center', marginBottom: 12 }}>
          <span style={{ fontFamily: 'var(--font-vt)', fontSize: 24, color: '#00ff00' }}>🏆 HALL OF FAME</span>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#6688aa' }}>Top players across every SM-OS game and difficulty</div>
        </div>
        <div className="hof-grid">
          {GAMES.map((g) => (
            <div key={g.id}>
              <div className="arcade-title" style={{ fontSize: 15, marginBottom: 2 }}>{g.icon} {g.title}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#6688aa', textAlign: 'center', marginBottom: 6 }}>{g.subtitle}</div>
              <ScoreTable game={g.id} limit={5} title="TOP 5" />
            </div>
          ))}
        </div>
      </WinBody>
      <WinStatusbar>
        <StatusPanel>LOCAL SCORES</StatusPanel>
        <StatusPanel>per game & difficulty</StatusPanel>
      </WinStatusbar>
    </>
  )
}