import { WinBody, WinStatusbar, StatusPanel, promptLine } from '../ui/Window'
import { aiTools } from '../data/content'

export default function AITools() {
  return (
    <>
      <WinBody>
        {promptLine('cat ai_tools.cfg')}
        <div className="ai-grid">
          {aiTools.map((t) => (
            <div key={t.name} className="ai-card">
              <div className="ai-name">{t.name}</div>
              <div className="ai-desc">{t.desc}</div>
            </div>
          ))}
        </div>
      </WinBody>
      <WinStatusbar>
        <StatusPanel>12 tools loaded</StatusPanel>
        <StatusPanel>AI workflow: READY</StatusPanel>
      </WinStatusbar>
    </>
  )
}