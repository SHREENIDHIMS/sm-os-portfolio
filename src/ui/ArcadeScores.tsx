import { useEffect, useRef, useState } from 'react'
import { getScores, submitScore, formatScore } from '../os/leaderboard'
import type { GameId, ScoreEntry } from '../os/leaderboard'
import { clickSnd } from '../os/sound'

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

export function NameEntry({ game, score, onDone, onSkip }: { game: GameId; score: number; onDone: (list: ScoreEntry[]) => void; onSkip?: () => void }) {
  const [name, setName] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const submit = () => {
    clickSnd()
    onDone(submitScore(game, name, score))
  }

  return (
    <div className="arcade-modal" onClick={(e) => { if (e.target === e.currentTarget) onSkip?.() }}>
      <div className="arcade-modal-box">
        <div className="arcade-title" style={{ fontSize: 24 }}>🎉 HIGH SCORE!</div>
        <div className="arcade-title" style={{ color: '#ffcc00', margin: '4px 0 10px' }}>SCORE: {formatScore(game, score)}</div>
        <input
          ref={inputRef}
          className="arcade-input"
          value={name}
          maxLength={12}
          placeholder="ENTER YOUR NAME"
          spellCheck={false}
          onChange={(e) => setName(e.target.value.toUpperCase().replace(/[^A-Z0-9 _-]/g, ''))}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submit()
            if (e.key === 'Escape') onSkip?.()
          }}
        />
        <div style={{ marginTop: 10 }}>
          <button className="retro-btn" onClick={submit}>[ SAVE ]</button>
        </div>
        {onSkip && (
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#6688aa', marginTop: 8 }}>ESC to skip</div>
        )}
      </div>
    </div>
  )
}