import { useEffect, useRef } from 'react'
import { useOS } from '../os/store'
import { wps } from '../os/wallpapers'

export function Wallpaper() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frame = useRef(0)
  const idx = useOS((s) => s.wallpaper)
  const speed = useOS((s) => s.wpSpeed)
  const dim = useOS((s) => s.wpDim)
  const speedRef = useRef(speed)

  useEffect(() => {
    speedRef.current = speed
  }, [speed])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let raf = 0

    const resize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      canvas.width = parent.clientWidth || window.innerWidth
      canvas.height = parent.clientHeight || window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      const ctx = canvas.getContext('2d')
      if (ctx && canvas.width > 0) {
        frame.current += speedRef.current
        wps[idx].fn(canvas, ctx, Math.floor(frame.current))
      }
    }

    const loop = () => {
      draw()
      raf = requestAnimationFrame(loop)
    }

    const onVisibility = () => {
      cancelAnimationFrame(raf)
      if (!document.hidden && !wps[idx].static) {
        raf = requestAnimationFrame(loop)
      } else if (wps[idx].static) {
        resize()
        draw()
      }
    }
    document.addEventListener('visibilitychange', onVisibility)

    if (wps[idx].static) {
      draw()
    } else {
      loop()
    }

    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('resize', resize)
    }
  }, [idx])

  return (
    <>
      <canvas ref={canvasRef} id="wpCanvas" />
      <div style={{ position: 'absolute', inset: 0, background: '#000', opacity: dim / 100, pointerEvents: 'none' }} />
    </>
  )
}