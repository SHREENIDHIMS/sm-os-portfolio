import { WinBody, WinStatusbar, StatusPanel, promptLine } from '../ui/Window'
import { certs } from '../data/content'

export default function Certs() {
  return (
    <>
      <WinBody>
        {promptLine('ls -la ./certs/')}
        {certs.map((c) => (
          <div key={c.name} className="exp-item" style={{ borderLeftColor: c.color }}>
            <div className="exp-company" style={{ color: c.color }}>
              {c.icon} {c.name}
            </div>
            <div className="exp-role" style={{ color: '#fff' }}>{c.issuer}</div>
            <div className="exp-period">{c.detail}</div>
          </div>
        ))}
      </WinBody>
      <WinStatusbar>
        <StatusPanel>3 certificates</StatusPanel>
        <StatusPanel>VERIFIED</StatusPanel>
      </WinStatusbar>
    </>
  )
}