import { useEffect, useRef, useState } from 'react'
import { WinBody, WinMenubar, MenuItem, WinStatusbar, StatusPanel } from '../ui/Window'
import { clickSnd } from '../os/sound'

const TRACKS = [
  { title: 'SoundHelix — Song 1', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { title: 'SoundHelix — Song 2', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { title: 'SoundHelix — Song 3', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
  { title: 'SoundHelix — Song 4', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
]

function fmt(s: number): string {
  if (!isFinite(s)) return '0:00'
  return Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0')
}

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [idx, setIdx] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [pos, setPos] = useState(0)
  const [dur, setDur] = useState(0)
  const [vol, setVol] = useState(0.7)
  const barsRef = useRef<number[]>(Array(24).fill(5))
  const [bars, setBars] = useState<number[]>(Array(24).fill(5))

  useEffect(() => {
    if (!playing) {
      barsRef.current = barsRef.current.map(() => 5)
      setBars([...barsRef.current])
      return
    }
    let raf = 0
    let frame = 0
    const tick = () => {
      if (frame++ % 2 === 0) {
        barsRef.current = barsRef.current.map((v) => v + (12 + Math.random() * 88 - v) * 0.22)
        setBars([...barsRef.current])
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [playing])

  useEffect(() => {
    const a = audioRef.current
    if (!a) return
    a.volume = vol
  }, [vol])

  const toggle = () => {
    clickSnd()
    const a = audioRef.current
    if (!a) return
    if (playing) {
      a.pause()
      setPlaying(false)
    } else {
      a.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
    }
  }

  const pick = (i: number) => {
    clickSnd()
    setIdx(i)
    setPlaying(true)
    setTimeout(() => audioRef.current?.play().catch(() => setPlaying(false)), 50)
  }

  const step = (d: number) => pick((idx + d + TRACKS.length) % TRACKS.length)

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const a = audioRef.current
    if (!a || !dur) return
    const rect = e.currentTarget.getBoundingClientRect()
    a.currentTime = ((e.clientX - rect.left) / rect.width) * dur
  }

  return (
    <>
      <WinMenubar>
        <MenuItem>File</MenuItem>
        <MenuItem>Play</MenuItem>
        <MenuItem>Visuals</MenuItem>
      </WinMenubar>
      <WinBody style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div className="mp-vis">
          {bars.map((h, i) => (
            <div key={i} style={{ flex: 1, height: h + '%', background: 'linear-gradient(to top,#00ff00,#ffff00)' }} />
          ))}
        </div>
        <div style={{ fontFamily: 'var(--font-vt)', fontSize: 13, color: '#00ff00', textAlign: 'center' }}>
          ♫ {TRACKS[idx].title}
        </div>
        <div className="mp-seek" onClick={seek}>
          <div className="mp-seek-fill" style={{ width: (dur ? (pos / dur) * 100 : 0) + '%' }} />
          <span className="mp-time">{fmt(pos)} / {fmt(dur)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
          <button className="retro-btn" onClick={() => step(-1)}>⏮</button>
          <button className="retro-btn" style={{ minWidth: 64 }} onClick={toggle}>{playing ? '⏸ Pause' : '▶ Play'}</button>
          <button className="retro-btn" onClick={() => step(1)}>⏭</button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-mono)', fontSize: 10 }}>
          🔊
          <input type="range" min={0} max={1} step={0.05} value={vol} onChange={(e) => setVol(Number(e.target.value))} style={{ flex: 1 }} />
        </div>
        <div className="mp-list">
          {TRACKS.map((t, i) => (
            <button key={t.src} className={'mp-item' + (i === idx ? ' act' : '')} onClick={() => pick(i)}>
              {i === idx && playing ? '▶ ' : '  '}{t.title}
            </button>
          ))}
        </div>
        <audio
          ref={audioRef}
          src={TRACKS[idx].src}
          onTimeUpdate={(e) => setPos(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => setDur(e.currentTarget.duration)}
          onEnded={() => step(1)}
        />
      </WinBody>
      <WinStatusbar>
        <StatusPanel>{playing ? '♪ Playing' : '■ Stopped'}</StatusPanel>
        <StatusPanel>{TRACKS.length} tracks</StatusPanel>
      </WinStatusbar>
    </>
  )
}