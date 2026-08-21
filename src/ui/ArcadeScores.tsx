import { useState } from 'react'
import { getScores, formatScore, getPlayerName, setPlayerName } from '../os/leaderboard'
import type { GameId, ScoreEntry } from '../os/leaderboard'

export function ScoreTable({ game, limit = 5, title = 'TOP PLAYERS' }: { game: GameId; limit?: number; title?: string }) {
  const scores = getScores(game).slice(0, limit)
  return (
    <div className="arcade-table">
      <div className="arcade-title">{title}</div>
      {scores.length === 0 ? (
        <div className="arcade-empty">NO SCORES YET<br />BE THE FIRST!</div>
      ) : (
        scores.map((e, i) => (
          <div className="arcade-row" key={i}>
            <span className="arcade-rank">{String(i + 1).padStart(2, '0')}</span>
            <span className="arcade-name">{e.name}</span>
            <span className="arcade-score">{formatScore(game, e.score)}</span>
          </div>
        ))
      )}
    </div>
  )
}

export function NameField({ title = 'PLAYER NAME', onChange }: { title?: string; onChange?: (v: string) => void }) {
  const [name, setName] = useState(getPlayerName())
  return (
    <div className="arcade-namefield">
      <div className="arcade-title" style={{ fontSize: 13, marginBottom: 2 }}>{title}</div>
      <input
        id="arcadeName"
        className="arcade-input arcade-input-sm"
        value={name}
        maxLength={12}
        placeholder="ENTER YOUR NAME"
        spellCheck={false}
        onChange={(e) => {
          const v = e.target.value.toUpperCase().replace(/[^A-Z0-9 _-]/g, '')
          setName(v)
          setPlayerName(v)
          onChange?.(v)
        }}
      />
    </div>
  )
}

export type { GameId, ScoreEntry }