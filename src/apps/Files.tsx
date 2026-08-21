import { useState } from 'react'
import { WinMenubar, MenuItem, WinStatusbar, StatusPanel } from '../ui/Window'
import { fileStructure } from '../data/files'
import type { ProjectDetail } from '../data/files'
import { clickSnd } from '../os/sound'
import { useOS } from '../os/store'
import { openApp } from '../os/registry'

const sideNav = [
  { id: 'home', icon: '🏠', label: 'Home' },
  { id: 'projects', icon: '📁', label: 'Projects' },
  { id: 'games', icon: '🎮', label: 'Games' },
  { id: 'system', icon: '⚙', label: 'System' },
]

const sideMap: Record<string, string> = {
  home: 'home',
  projects: 'projects',
  'proj-ai': 'projects',
  'proj-enterprise': 'projects',
  'proj-web': 'projects',
  games: 'games',
  system: 'system',
}

export default function Files() {
  const [folder, setFolder] = useState('home')
  const [detail, setDetail] = useState<ProjectDetail | null>(null)

  const fs = fileStructure[folder]
  if (!fs) return null

  const canGoBack = !!fs.parent || !!detail
  const activeSide = sideMap[folder] || 'home'
  const displayName = folder === 'home' ? 'Home' : folder.replace('proj-', '')
  const addr = detail ? fs.path + '\\' + detail.title : fs.path

  const nav = (f: string) => {
    clickSnd()
    setDetail(null)
    setFolder(f)
  }

  const back = () => {
    clickSnd()
    if (detail) {
      setDetail(null)
      return
    }
    if (fs.parent) setFolder(fs.parent)
  }

  const onItemClick = (item: (typeof fs.items)[number]) => {
    clickSnd()
    if (item.type === 'folder') nav(item.target as string)
    else if (item.type === 'win') useOS.getState().openWin(item.target as string, 460, 440)
    else if (item.type === 'project') setDetail(item.target as ProjectDetail)
    else if (item.type === 'resume') openApp('resumeWin')
  }

  return (
    <>
      <WinMenubar>
        <MenuItem onClick={back} style={{ color: canGoBack ? '#000080' : '#808080', cursor: canGoBack ? 'pointer' : 'default' }}>
          ← Back
        </MenuItem>
        <MenuItem>File</MenuItem>
        <MenuItem>Edit</MenuItem>
        <MenuItem>View</MenuItem>
      </WinMenubar>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 6px', background: '#c0c0c0', borderBottom: '1px solid #808080' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#000080' }}>Address:</span>
          <div className="file-addr">{addr}</div>
        </div>
        <div className="file-layout">
          <div className="file-sidebar">
            {sideNav.map((s) => (
              <div
                key={s.id}
                className={'file-sidebar-item' + (activeSide === s.id ? ' active' : '')}
                onClick={() => nav(s.id)}
              >
                <span>{s.icon}</span>
                {s.label}
              </div>
            ))}
          </div>
          <div className="file-content">
            {detail ? (
              <div style={{ padding: 8 }}>
                <div className="file-detail-card">
                  <div className="file-detail-title">{detail.title}</div>
                  <div className="file-detail-desc">{detail.desc}</div>
                  <div style={{ marginBottom: 8 }}>
                    {detail.tags.map((t) => (
                      <span key={t} className="tag">{t}</span>
                    ))}
                  </div>
                  {detail.github && (
                    <a className="project-link" href={detail.github} target="_blank" rel="noreferrer">📂 GitHub</a>
                  )}
                  {detail.demo && (
                    <a className="project-link" href={detail.demo} target="_blank" rel="noreferrer">🌐 Live Demo</a>
                  )}
                  <div style={{ marginTop: 10, fontFamily: 'var(--font-mono)', fontSize: 9, color: '#6688aa' }}>← Back button to return</div>
                </div>
              </div>
            ) : (
              <div className="file-grid">
                {fs.items.map((item) => (
                  <div key={item.name} className="file-item" onClick={() => onItemClick(item)}>
                    <div className="file-item-icon">{item.icon}</div>
                    <div className="file-item-name">{item.name}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <WinStatusbar>
        <StatusPanel>{detail ? '1 item' : fs.items.length + ' objects'}</StatusPanel>
        <StatusPanel>{addr}</StatusPanel>
        <StatusPanel>FILE_MANAGER.EXE — {displayName}</StatusPanel>
      </WinStatusbar>
    </>
  )
}