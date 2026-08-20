import { WinBody, WinStatusbar, StatusPanel } from '../ui/Window'

export default function Recycle() {
  return (
    <>
      <WinStatusbar>
        <StatusPanel>0 objects · 0 bytes</StatusPanel>
      </WinStatusbar>
      <WinBody style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
        <div className="recycle-empty">
          <div className="recycle-empty-icon">🗑️</div>
          <div className="recycle-empty-msg">Bin is Empty</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#6688aa', marginTop: 8 }}>No regrets. Only commits.</div>
        </div>
      </WinBody>
    </>
  )
}