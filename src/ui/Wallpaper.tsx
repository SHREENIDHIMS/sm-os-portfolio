import { useEffect, useRef } from 'react'
import { useOS } from '../os/store'
import { wps } from '../os/wallpapers'

export function Wallpaper() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const idx = useOS((s) => s.wallpaper)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let raf = 0
    let frame = 0

    const resize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      canvas.width = parent.clientWidth || window.innerWidth
      canvas.height = parent.clientHeight || window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const loop = () => {
      const ctx = canvas.getContext('2d')
      if (ctx && canvas.width > 0) {
        wps[idx].fn(canvas, ctx, frame++)
      }
      raf = requestAnimationFrame(loop)
    }
    loop()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [idx])

  return <canvas ref={canvasRef} id="wpCanvas" />
}