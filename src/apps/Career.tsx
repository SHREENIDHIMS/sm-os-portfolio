import { WinBody, WinStatusbar, StatusPanel, promptLine } from '../ui/Window'
import { experience, education } from '../data/content'

export default function Career() {
  return (
    <>
      <WinBody>
        {promptLine('cat career.log')}

        {experience.map((e) => (
          <div key={e.company} className="exp-item" style={{ borderLeftColor: e.color }}>
            <div className="exp-company" style={{ color: e.companyColor }}>{e.company}</div>
            <div className="exp-role">{e.role}</div>
            <div className="exp-period">{e.period}</div>
            <div className="exp-desc" style={{ whiteSpace: 'pre-line' }}>{e.desc.replace(/<br\s*\/?>/gi, '\n')}</div>
          </div>
        ))}

        <div style={{ marginTop: 10, fontFamily: 'var(--font-mono)', fontSize: 9, color: '#6688aa', letterSpacing: 2, textTransform: 'uppercase', borderBottom: '1px solid #222266', paddingBottom: 4, marginBottom: 8 }}>
          // EDUCATION
        </div>

        {education.map((e) => (
          <div key={e.company} className="exp-item" style={{ borderLeftColor: e.color }}>
            <div className="exp-company" style={{ color: e.companyColor }}>{e.company}</div>
            <div className="exp-role" style={{ color: '#c8c8ff' }}>{e.role}</div>
            <div className="exp-period">{e.period}</div>
            {e.desc && <div className="exp-desc" style={{ color: e.descColor || '#8899bb' }}>{e.desc}</div>}
          </div>
        ))}
      </WinBody>
      <WinStatusbar>
        <StatusPanel>1 Internship</StatusPanel>
        <StatusPanel>2025 Graduate</StatusPanel>
        <StatusPanel>Entry-Level Ready</StatusPanel>
      </WinStatusbar>
    </>
  )
}