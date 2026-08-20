import { WinBody, WinStatusbar, StatusPanel } from '../ui/Window'
import { ScoreTable } from '../ui/ArcadeScores'
import type { GameId } from '../os/leaderboard'

const GAMES: { id: GameId; title: string; icon: string; subtitle: string }[] = [
  { id: 'snake', title: 'SNAKE.EXE', icon: '🐍', subtitle: 'Highest points' },
  { id: 'memory', title: 'MEMORY.EXE', icon: '🃏', subtitle: 'Fewest moves' },
  { id: 'minesweeper', title: 'MINESWEEPER.EXE', icon: '💣', subtitle: 'Fastest clear' },
]

export default function HallOfFame() {
  return (
    <>
      <WinBody>
        <div style={{ textAlign: 'center', marginBottom: 12 }}>
          <span style={{ fontFamily: 'var(--font-vt)', fontSize: 24, color: '#00ff00' }}>🏆 HALL OF FAME</span>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#6688aa' }}>Top players across SM-OS games</div>
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
        <StatusPanel>saved per browser</StatusPanel>
      </WinStatusbar>
    </>
  )
}