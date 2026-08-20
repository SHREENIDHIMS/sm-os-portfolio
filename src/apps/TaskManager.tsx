import { useEffect, useState } from 'react'
import { WinBody, WinMenubar, MenuItem, WinStatusbar, StatusPanel } from '../ui/Window'
import { useOS } from '../os/store'
import { appById } from '../os/registry'
import { clickSnd } from '../os/sound'

function Graph({ data, color, label }: { data: number[]; color: string; label: string }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, marginBottom: 2 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 1, height: 54, background: '#000', padding: 2, border: '1px solid #8090b0' }}>
        {data.map((v, i) => (
          <div key={i} style={{ flex: 1, height: v + '%', background: color }} />
        ))}
      </div>
    </div>
  )
}

export default function TaskManager() {
  const windows = useOS((s) => s.windows)
  const [cpu, setCpu] = useState<number[]>(Array(40).fill(8))
  const [ram, setRam] = useState<number[]>(Array(40).fill(28))

  const openIds = Object.keys(windows).filter((k) => windows[k].open || windows[k].minimized)

  useEffect(() => {
    const iv = setInterval(() => {
      const load = Math.min(92, 6 + openIds.length * 9)
      setCpu((c) => [...c.slice(1), Math.max(3, Math.min(98, load + (Math.random() * 24 - 12)))])
      setRam((r) => [...r.slice(1), Math.max(16, Math.min(90, 22 + openIds.length * 6 + (Math.random() * 8 - 4)))])
    }, 900)
    return () => clearInterval(iv)
  }, [openIds.length])

  const endTask = (id: string) => {
    clickSnd()
    useOS.getState().closeWin(id)
  }

  return (
    <>
      <WinMenubar>
        <MenuItem>File</MenuItem>
        <MenuItem>Options</MenuItem>
        <MenuItem>View</MenuItem>
      </WinMenubar>
      <WinBody style={{ padding: 10 }}>
        <Graph data={cpu} color="#00ff00" label={'CPU USAGE — ' + Math.round(cpu[cpu.length - 1]) + '%'} />
        <Graph data={ram} color="#ffcc00" label={'MEMORY — ' + Math.round(ram[ram.length - 1]) + '% of 16GB'} />
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, margin: '8px 0 4px' }}>
          PROCESSES ({openIds.length + 3})
        </div>
        <div style={{ border: '1px solid #8090b0', background: '#fff', maxHeight: 150, overflowY: 'auto' }}>
          <div className="tm-row tm-head">
            <span>Process</span>
            <span>Status</span>
            <span></span>
          </div>
          {['kernel_sm-os', 'explorer.exe', 'clippy-agent'].map((p) => (
            <div key={p} className="tm-row">
              <span>{p}</span>
              <span style={{ color: '#008000' }}>Running</span>
              <span></span>
            </div>
          ))}
          {openIds.map((id) => {
            const meta = appById[id] || appById[id.replace(/-\d+$/, '')]
            return (
              <div key={id} className="tm-row">
                <span>{(meta ? meta.icon + ' ' + meta.label : id)}</span>
                <span style={{ color: windows[id].minimized ? '#888' : '#008000' }}>
                  {windows[id].minimized ? 'Minimized' : 'Running'}
                </span>
                <button className="retro-btn" style={{ fontSize: 9, padding: '0 6px' }} onClick={() => endTask(id)}>
                  End Task
                </button>
              </div>
            )
          })}
          {openIds.length === 0 && (
            <div className="tm-row"><span style={{ color: '#666' }}>No user applications running</span><span></span><span></span></div>
          )}
        </div>
      </WinBody>
      <WinStatusbar>
        <StatusPanel>Processes: {openIds.length + 3}</StatusPanel>
        <StatusPanel>CPU: {Math.round(cpu[cpu.length - 1])}%</StatusPanel>
      </WinStatusbar>
    </>
  )
}