export type GameId =
  | 'snake'
  | 'memory-easy'
  | 'memory-normal'
  | 'memory-hard'
  | 'minesweeper-easy'
  | 'minesweeper-medium'
  | 'minesweeper-hard'

export interface ScoreEntry {
  name: string
  score: number
  date: string
}

const MAX = 5
const KEY = (g: GameId) => 'sm-os-scores-' + g
const NAME_KEY = 'sm-os-player-name'
const order: Record<GameId, 'desc' | 'asc'> = {
  snake: 'desc',
  'memory-easy': 'asc',
  'memory-normal': 'asc',
  'memory-hard': 'asc',
  'minesweeper-easy': 'asc',
  'minesweeper-medium': 'asc',
  'minesweeper-hard': 'asc',
}
const isTime = (g: GameId) => g.startsWith('minesweeper') || g.startsWith('memory')

function sort(list: ScoreEntry[], g: GameId): ScoreEntry[] {
  return [...list].sort((a, b) => (order[g] === 'desc' ? b.score - a.score : a.score - b.score))
}

export function getScores(g: GameId): ScoreEntry[] {
  try {
    const raw = window.localStorage.getItem(KEY(g))
    if (!raw) return []
    const arr = JSON.parse(raw)
    if (!Array.isArray(arr)) return []
    return sort(
      arr.filter((e) => e && typeof e.name === 'string' && typeof e.score === 'number').slice(0, MAX),
      g,
    )
  } catch {
    return []
  }
}

export function qualifies(g: GameId, score: number): boolean {
  const list = getScores(g)
  if (list.length < MAX) return true
  const worst = order[g] === 'desc' ? Math.min(...list.map((e) => e.score)) : Math.max(...list.map((e) => e.score))
  return order[g] === 'desc' ? score > worst : score < worst
}

export function submitScore(g: GameId, name: string, score: number): ScoreEntry[] {
  const entry: ScoreEntry = {
    name: (name.trim() || 'PLAYER').toUpperCase().slice(0, 12),
    score,
    date: new Date().toISOString(),
  }
  const list = sort([...getScores(g), entry], g).slice(0, MAX)
  try {
    window.localStorage.setItem(KEY(g), JSON.stringify(list))
  } catch {
    /* storage unavailable */
  }
  return list
}

export function formatScore(g: GameId, score: number): string {
  if (isTime(g)) {
    const m = Math.floor(score / 60)
    const s = score % 60
    return m > 0 ? m + ':' + s.toString().padStart(2, '0') : s + 's'
  }
  return String(score)
}

export function getPlayerName(): string {
  try {
    return (window.localStorage.getItem(NAME_KEY) || '').slice(0, 12)
  } catch {
    return ''
  }
}

export function setPlayerName(name: string) {
  try {
    window.localStorage.setItem(NAME_KEY, name.trim().toUpperCase().slice(0, 12))
  } catch {
    /* storage unavailable */
  }
}