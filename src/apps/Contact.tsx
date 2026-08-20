import { WinBody, WinStatusbar, StatusPanel, promptLine } from '../ui/Window'
import { contactItems } from '../data/content'

export default function Contact() {
  return (
    <>
      <WinBody>
        {promptLine('./contact.sh --list')}
        <ul className="contact-list">
          {contactItems.map((c) => (
            <li key={c.label}>
              <span className="c-icon">{c.icon}</span>
              <span className="c-label">{c.label}</span>
              {c.href ? (
                <a className="c-val" href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                  {c.value}
                </a>
              ) : (
                <span className="c-val">{c.value}</span>
              )}
            </li>
          ))}
        </ul>
        <div style={{ marginTop: 12, padding: 10, background: '#000060', border: '1px solid #00aa00' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#6688aa', marginBottom: 4 }}>// availability</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#00ff00' }}>✓ Open to entry-level software roles</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#00ffff', marginTop: 3 }}>→ Backend / full-stack development</div>
        </div>
      </WinBody>
      <WinStatusbar>
        <StatusPanel><span className="status-dot" /> AVAILABLE</StatusPanel>
      </WinStatusbar>
    </>
  )
}