import { useEffect, useRef, useState } from 'react'
import { WinBody, WinMenubar, MenuItem, WinStatusbar, StatusPanel } from '../ui/Window'
import { clickSnd } from '../os/sound'

const DEFAULT_CITY = 'Visakhapatnam'

interface Current { temp: number; code: number; wind: number }
interface Day { date: string; code: number; max: number; min: number }

function wEmoji(code: number): string {
  if (code === 0) return '☀️'
  if (code <= 3) return '⛅'
  if (code <= 48) return '🌫️'
  if (code <= 67) return '🌧️'
  if (code <= 77) return '❄️'
  if (code <= 82) return '🌦️'
  if (code <= 86) return '🌨️'
  return '⛈️'
}

function wText(code: number): string {
  if (code === 0) return 'Clear sky'
  if (code <= 3) return 'Partly cloudy'
  if (code <= 48) return 'Foggy'
  if (code <= 67) return 'Rain'
  if (code <= 77) return 'Snow'
  if (code <= 82) return 'Showers'
  if (code <= 86) return 'Snow showers'
  return 'Thunderstorm'
}

export default function Weather() {
  const [city, setCity] = useState(DEFAULT_CITY)
  const [place, setPlace] = useState('')
  const [cur, setCur] = useState<Current | null>(null)
  const [days, setDays] = useState<Day[]>([])
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const seqRef = useRef(0)

  const load = async (c: string) => {
    const seq = ++seqRef.current
    abortRef.current?.abort()
    const ac = new AbortController()
    abortRef.current = ac
    setBusy(true)
    setErr(null)
    try {
      const g = await (await fetch('https://geocoding-api.open-meteo.com/v1/search?name=' + encodeURIComponent(c) + '&count=1&language=en', { signal: ac.signal })).json()
      if (!g.results || g.results.length === 0) {
        setErr('City not found — try another spelling')
        setBusy(false)
        return
      }
      const hit = g.results[0]
      const w = await (await fetch(
        'https://api.open-meteo.com/v1/forecast?latitude=' + hit.latitude + '&longitude=' + hit.longitude +
        '&current=temperature_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=5',
        { signal: ac.signal },
      )).json()
      if (seq !== seqRef.current) return
      setPlace(hit.name + ', ' + (hit.country || ''))
      setCur({ temp: Math.round(w.current.temperature_2m), code: w.current.weather_code, wind: Math.round(w.current.wind_speed_10m) })
      setDays((w.daily.time as string[]).map((d, i) => ({
        date: d,
        code: w.daily.weather_code[i],
        max: Math.round(w.daily.temperature_2m_max[i]),
        min: Math.round(w.daily.temperature_2m_min[i]),
      })))
    } catch (e) {
      if ((e as Error).name === 'AbortError') return
      setErr('Network error — check your connection')
    } finally {
      if (seq === seqRef.current) setBusy(false)
    }
  }

  useEffect(() => {
    load(DEFAULT_CITY)
    return () => abortRef.current?.abort()
  }, [])

  const submit = () => {
    clickSnd()
    if (city.trim()) load(city.trim())
  }

  return (
    <>
      <WinMenubar>
        <MenuItem>File</MenuItem>
        <MenuItem>View</MenuItem>
      </WinMenubar>
      <WinBody style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <input
            className="wt-input"
            value={city}
            placeholder="Search city…"
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') submit() }}
          />
          <button className="retro-btn" style={{ fontSize: 11 }} onClick={submit}>Go</button>
        </div>
        {busy && <div className="wt-note">Fetching weather…</div>}
        {err && <div className="wt-note" style={{ color: '#c00' }}>⚠ {err}</div>}
        {cur && (
          <div className="wt-now">
            <div style={{ fontSize: 44 }}>{wEmoji(cur.code)}</div>
            <div>
              <div style={{ fontSize: 30, fontWeight: 700 }}>{cur.temp}°C</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>{wText(cur.code)} · 💨 {cur.wind} km/h</div>
            </div>
          </div>
        )}
        {place && <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>📍 {place}</div>}
        {days.length > 0 && (
          <div className="wt-days">
            {days.map((d) => (
              <div key={d.date} className="wt-day">
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10 }}>
                  {new Date(d.date + 'T12:00:00').toLocaleDateString(undefined, { weekday: 'short' })}
                </div>
                <div style={{ fontSize: 22 }}>{wEmoji(d.code)}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>{d.max}° / {d.min}°</div>
              </div>
            ))}
          </div>
        )}
      </WinBody>
      <WinStatusbar>
        <StatusPanel>Open-Meteo live data</StatusPanel>
        <StatusPanel>{busy ? 'Updating…' : 'Up to date'}</StatusPanel>
      </WinStatusbar>
    </>
  )
}