import { WinBody, WinMenubar, MenuItem, WinStatusbar, StatusPanel, promptLine } from '../ui/Window'
import { projects } from '../data/projects'

export default function Projects() {
  return (
    <>
      <WinMenubar>
        <MenuItem>File</MenuItem>
        <MenuItem>View</MenuItem>
      </WinMenubar>
      <WinBody>
        {promptLine('ls -la ./projects/')}
        {projects.map((p) => (
          <div key={p.name} className="project-card">
            <div className="project-name">{p.name}</div>
            <div className="project-company">{p.company}</div>
            <div className="project-desc">{p.desc}</div>
            {p.tags.map((t) => (
              <span key={t} className={'tag' + (p.tagColor ? ' ' + p.tagColor : '')}>{t}</span>
            ))}
            <div>
              {p.github && (
                <a className="project-link" href={p.github} target="_blank" rel="noreferrer">📂 GitHub</a>
              )}
              {p.demo && (
                <a className="project-link" href={p.demo} target="_blank" rel="noreferrer">🌐 Live Demo</a>
              )}
            </div>
          </div>
        ))}
      </WinBody>
      <WinStatusbar>
        <StatusPanel>5 projects</StatusPanel>
        <StatusPanel>github.com/SHREENIDHIMS</StatusPanel>
      </WinStatusbar>
    </>
  )
}