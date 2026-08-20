import { WinBody, WinStatusbar, StatusPanel } from '../ui/Window'
import { radarSkills, radarStatus } from '../data/skills'

const TOTAL = 20

export default function Radar() {
  return (
    <>
      <WinBody style={{ background: '#000a00' }}>
        <div className="radar-wrap">
          <div className="radar-header">
            <span style={{ fontSize: 22 }}>📊</span>
            <span className="radar-header-title">SKILL ANALYSIS</span>
          </div>
          {radarSkills.map((s) => {
            const filled = Math.round((s.pct / 100) * TOTAL)
            return (
              <div key={s.label} className="radar-row">
                <div className="radar-label-row">
                  <span className="radar-label">{s.label}</span>
                  <span className="radar-pct">{s.pct}%</span>
                </div>
                <div className="radar-bar">
                  {Array.from({ length: TOTAL }, (_, i) => (
                    <div
                      key={i}
                      className={'radar-seg' + (i < filled ? ' on' : '')}
                      style={i < filled ? { background: s.color, boxShadow: `0 0 4px ${s.color}50` } : undefined}
                    />
                  ))}
                </div>
              </div>
            )
          })}
          <div className="radar-status-bar">
            {radarStatus.map((s) => (
              <span key={s.label} className={'radar-status-item' + (s.on ? ' on' : '')}>
                {s.label}: {s.val}
              </span>
            ))}
          </div>
        </div>
      </WinBody>
      <WinStatusbar style={{ background: '#000a00', borderTopColor: '#003300' }}>
        <StatusPanel style={{ color: '#00ff00', borderColor: '#003300', background: '#000500' }}>8 DOMAINS SCANNED</StatusPanel>
        <StatusPanel style={{ color: '#00ff00', borderColor: '#003300', background: '#000500' }}>OPTIMAL</StatusPanel>
      </WinStatusbar>
    </>
  )
}