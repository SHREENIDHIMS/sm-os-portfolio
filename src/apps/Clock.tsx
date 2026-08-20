import { WinBody, WinStatusbar, StatusPanel } from '../ui/Window'
import { useClock, useCalendar } from '../hooks/useClock'

export default function Clock() {
  const { time24, dateStr } = useClock()
  const { cells, now } = useCalendar()

  return (
    <>
      <WinBody style={{ background: '#000020' }}>
        <div className="big-clock">{time24}</div>
        <div className="big-date">{dateStr}</div>
        <div className="cal-grid">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
            <div key={d} className="cal-cell hdr">{d}</div>
          ))}
          {cells.map((c, i) => (
            <div key={i} className={'cal-cell' + (c.today ? ' today' : '') + (c.other ? ' other' : '')}>{c.day}</div>
          ))}
        </div>
      </WinBody>
      <WinStatusbar style={{ background: '#000a00', borderTopColor: '#003300' }}>
        <StatusPanel style={{ color: '#00ff00', borderColor: '#003300', background: '#000500' }}>IST (UTC+5:30)</StatusPanel>
        <StatusPanel style={{ color: '#00ff00', borderColor: '#003300', background: '#000500' }}>{now.getFullYear()} Cal</StatusPanel>
      </WinStatusbar>
    </>
  )
}