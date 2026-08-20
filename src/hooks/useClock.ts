import { useEffect, useState } from 'react'

export interface ClockInfo {
  time12: string
  time24: string
  dateStr: string
}

export function useClock(): ClockInfo {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  return {
    time12: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
    time24: now.toLocaleTimeString('en-IN', { hour12: false }),
    dateStr: now.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
  }
}

export function useCalendar() {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const today = now.getDate()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells: { day: number; other: boolean; today: boolean }[] = []
  for (let i = 0; i < firstDay; i++) {
    cells.push({ day: new Date(year, month, -firstDay + i + 1).getDate(), other: true, today: false })
  }
  for (let i = 1; i <= daysInMonth; i++) {
    cells.push({ day: i, other: false, today: i === today })
  }
  return { cells, now }
}