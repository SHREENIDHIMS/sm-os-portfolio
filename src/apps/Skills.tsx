import { WinBody, WinStatusbar, StatusPanel, promptLine } from '../ui/Window'
import { skillCategories } from '../data/skills'

export default function Skills() {
  return (
    <>
      <WinBody>
        {promptLine('./skills --monitor')}
        {skillCategories.map((cat) => (
          <div key={cat.cat} className="skill-section">
            <div className="skill-cat">{cat.cat}</div>
            {cat.skills.map((s) => (
              <div key={s.name} className="skill-row">
                <div className="skill-label-row">
                  <span>{s.name}</span>
                  <span>{s.pct}%</span>
                </div>
                <div className="skill-track">
                  <div className="skill-fill" style={{ width: s.pct + '%', background: cat.color }} />
                </div>
              </div>
            ))}
          </div>
        ))}
      </WinBody>
      <WinStatusbar>
        <StatusPanel>MODE: JOB READY</StatusPanel>
        <StatusPanel>CGPA 7.08/10</StatusPanel>
        <StatusPanel>3 CERTS</StatusPanel>
      </WinStatusbar>
    </>
  )
}