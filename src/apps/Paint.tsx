import { useRef, useState } from 'react'
import { WinBody, WinMenubar, MenuItem, WinStatusbar, StatusPanel } from '../ui/Window'
import { clickSnd } from '../os/sound'

const COLORS = ['#000000', '#7f7f7f', '#c3c3c3', '#ffffff', '#ed1c24', '#ff7f27', '#fff200', '#22b14c', '#00a2e8', '#3f48cc', '#a349a4', '#b97a57']

export default function Paint() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawing = useRef(false)
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen')
  const [color, setColor] = useState('#000000')
  const [size, setSize] = useState(3)

  const pos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const cv = canvasRef.current!
    const r = cv.getBoundingClientRect()
    return { x: (e.clientX - r.left) * (cv.width / r.width), y: (e.clientY - r.top) * (cv.height / r.height) }
  }

  const start = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    drawing.current = true
    const ctx = canvasRef.current!.getContext('2d')!
    const { x, y } = pos(e)
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + 0.1, y + 0.1)
    ctx.stroke()
  }

  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return
    const ctx = canvasRef.current!.getContext('2d')!
    const { x, y } = pos(e)
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color
    ctx.lineWidth = tool === 'eraser' ? size * 4 : size
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const end = () => {
    drawing.current = false
  }

  const clear = () => {
    clickSnd()
    const cv = canvasRef.current!
    cv.getContext('2d')!.clearRect(0, 0, cv.width, cv.height)
  }

  const save = () => {
    clickSnd()
    const a = document.createElement('a')
    a.href = canvasRef.current!.toDataURL('image/png')
    a.download = 'sm-paint.png'
    a.click()
  }

  return (
    <>
      <WinMenubar>
        <MenuItem>File</MenuItem>
        <MenuItem>Edit</MenuItem>
        <MenuItem>Image</MenuItem>
      </WinMenubar>
      <WinBody style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <button className={'retro-btn' + (tool === 'pen' ? ' sel' : '')} style={{ fontSize: 11 }} onClick={() => { clickSnd(); setTool('pen') }}>✏️ Pencil</button>
          <button className={'retro-btn' + (tool === 'eraser' ? ' sel' : '')} style={{ fontSize: 11 }} onClick={() => { clickSnd(); setTool('eraser') }}>🧽 Eraser</button>
          <div style={{ display: 'flex', gap: 2 }}>
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                title={c}
                style={{ width: 18, height: 18, background: c, border: color === c && tool === 'pen' ? '2px solid #000080' : '1px solid #8090b0', cursor: 'pointer', padding: 0 }}
              />
            ))}
          </div>
          <label style={{ fontFamily: 'var(--font-mono)', fontSize: 10, display: 'flex', alignItems: 'center', gap: 4 }}>
            Size
            <input type="range" min={1} max={20} value={size} onChange={(e) => setSize(Number(e.target.value))} style={{ width: 70 }} />
            {size}
          </label>
          <button className="retro-btn" style={{ fontSize: 11 }} onClick={clear}>🗑 Clear</button>
          <button className="retro-btn" style={{ fontSize: 11 }} onClick={save}>💾 Save PNG</button>
        </div>
        <canvas
          ref={canvasRef}
          width={800}
          height={460}
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={end}
          onPointerLeave={end}
          style={{ width: '100%', flex: 1, background: '#fff', border: '2px inset #8090b0', cursor: 'crosshair', touchAction: 'none' }}
        />
      </WinBody>
      <WinStatusbar>
        <StatusPanel>{tool === 'pen' ? 'Pencil' : 'Eraser'} · {color}</StatusPanel>
        <StatusPanel>800 × 460</StatusPanel>
      </WinStatusbar>
    </>
  )
}