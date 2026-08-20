export type WpFn = (c: HTMLCanvasElement, ctx: CanvasRenderingContext2D, f: number) => void

const state = new WeakMap<HTMLCanvasElement, Record<string, unknown>>()

function st(c: HTMLCanvasElement): Record<string, unknown> {
  let s = state.get(c)
  if (!s) {
    s = {}
    state.set(c, s)
  }
  return s
}

export const wps: { name: string; fn: WpFn }[] = [
  { name: 'Matrix', fn: wpMatrix },
  { name: 'Starfield', fn: wpStars },
  { name: 'Plasma', fn: wpPlasma },
  { name: 'Grid', fn: wpGrid },
  { name: 'Nebula', fn: wpNebula },
  { name: 'Circuit', fn: wpCircuit },
]

function wpMatrix(c: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  const W = c.width
  const H = c.height
  const s = st(c)
  if (!s.col) {
    const col: number[] = []
    for (let i = 0; i < Math.floor(W / 14); i++) col.push(Math.floor((Math.random() * H) / 14))
    s.col = col
  }
  const col = s.col as number[]
  ctx.fillStyle = 'rgba(0,0,10,0.12)'
  ctx.fillRect(0, 0, W, H)
  ctx.font = '12px Share Tech Mono'
  col.forEach((y, x) => {
    ctx.fillStyle = y === 0 ? '#aaffaa' : 'rgba(0,220,60,0.85)'
    ctx.fillText(String.fromCharCode(0x30a0 + ((Math.random() * 96) | 0)), x * 14, y * 14)
    col[x] = y * 14 > H && Math.random() > 0.97 ? 0 : y + 1
  })
}

function wpStars(c: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  const W = c.width
  const H = c.height
  const s = st(c)
  if (!s.list) {
    const list: { x: number; y: number; z: number; pz: number }[] = []
    for (let i = 0; i < 200; i++) list.push({ x: Math.random() * W, y: Math.random() * H, z: Math.random() * W, pz: 0 })
    s.list = list
  }
  const list = s.list as { x: number; y: number; z: number; pz: number }[]
  ctx.fillStyle = 'rgba(0,0,15,0.22)'
  ctx.fillRect(0, 0, W, H)
  list.forEach((p) => {
    p.pz = p.z
    p.z -= 4
    if (p.z <= 0) {
      p.x = Math.random() * W
      p.y = Math.random() * H
      p.z = W
      p.pz = W
    }
    const sx = ((p.x - W / 2) * (W / p.z)) + W / 2
    const sy = ((p.y - H / 2) * (W / p.z)) + H / 2
    const px = ((p.x - W / 2) * (W / p.pz)) + W / 2
    const py = ((p.y - H / 2) * (W / p.pz)) + H / 2
    const a = 1 - p.z / W
    ctx.strokeStyle = `rgba(180,210,255,${a})`
    ctx.lineWidth = Math.max(0.5, (1 - p.z / W) * 2.5)
    ctx.beginPath()
    ctx.moveTo(px, py)
    ctx.lineTo(sx, sy)
    ctx.stroke()
  })
}

function wpPlasma(c: HTMLCanvasElement, ctx: CanvasRenderingContext2D, f: number) {
  const W = c.width
  const H = c.height
  const t = f * 0.02
  const W2 = Math.floor(W / 4)
  const H2 = Math.floor(H / 4)
  const img = ctx.createImageData(W2, H2)
  for (let y = 0; y < H2; y++) {
    for (let x = 0; x < W2; x++) {
      const v = Math.sin(x * 0.3 + t) + Math.sin(y * 0.3 + t) + Math.sin((x + y) * 0.2 + t) + Math.sin(Math.sqrt(x * x + y * y) * 0.3 + t)
      const i = (y * W2 + x) * 4
      img.data[i] = (Math.sin(v * Math.PI) * 127 + 127) | 0
      img.data[i + 1] = (Math.sin(v * Math.PI + 2) * 127 + 127) | 0
      img.data[i + 2] = (Math.sin(v * Math.PI + 4) * 127 + 127) | 0
      img.data[i + 3] = 200
    }
  }
  const s = st(c)
  if (!s.tmp) {
    const t2 = document.createElement('canvas')
    t2.width = W2
    t2.height = H2
    s.tmp = t2
  }
  const tmp = s.tmp as HTMLCanvasElement
  tmp.getContext('2d')!.putImageData(img, 0, 0)
  ctx.drawImage(tmp, 0, 0, W, H)
}

function wpGrid(c: HTMLCanvasElement, ctx: CanvasRenderingContext2D, f: number) {
  const W = c.width
  const H = c.height
  const t = f * 0.6
  const gs = 44
  ctx.fillStyle = 'rgba(0,0,20,0.2)'
  ctx.fillRect(0, 0, W, H)
  ctx.strokeStyle = 'rgba(0,100,255,0.18)'
  ctx.lineWidth = 1
  for (let x = (t % gs) - gs; x < W + gs; x += gs) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, H)
    ctx.stroke()
  }
  for (let y = ((t * 0.5) % gs) - gs; y < H + gs; y += gs) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(W, y)
    ctx.stroke()
  }
  const s = st(c)
  if (!s.dots) {
    const dots: { x: number; y: number; vx: number; vy: number }[] = []
    for (let i = 0; i < 25; i++) dots.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 1.5, vy: (Math.random() - 0.5) * 1.5 })
    s.dots = dots
  }
  const dots = s.dots as { x: number; y: number; vx: number; vy: number }[]
  dots.forEach((d) => {
    d.x = (d.x + d.vx + W) % W
    d.y = (d.y + d.vy + H) % H
    ctx.fillStyle = 'rgba(0,180,255,.7)'
    ctx.beginPath()
    ctx.arc(d.x, d.y, 2, 0, Math.PI * 2)
    ctx.fill()
  })
}

function wpNebula(c: HTMLCanvasElement, ctx: CanvasRenderingContext2D, f: number) {
  const W = c.width
  const H = c.height
  const s = st(c)
  if (f === 0 || !s.base) {
    ctx.fillStyle = '#000010'
    ctx.fillRect(0, 0, W, H)
    const cols = ['rgba(80,0,180,', 'rgba(0,40,180,', 'rgba(180,0,80,']
    for (let i = 0; i < 5; i++) {
      const g = ctx.createRadialGradient(Math.random() * W, Math.random() * H, 0, Math.random() * W, Math.random() * H, 200 + Math.random() * 200)
      const col = cols[Math.floor(Math.random() * cols.length)]
      g.addColorStop(0, col + '0.35)')
      g.addColorStop(1, col + '0)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, W, H)
    }
    const stars: { x: number; y: number; r: number; t: number }[] = []
    for (let i = 0; i < 280; i++) stars.push({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.5, t: Math.random() * Math.PI * 2 })
    s.stars = stars
    s.base = ctx.getImageData(0, 0, W, H)
  }
  if (f % 3 === 0) {
    ctx.putImageData(s.base as ImageData, 0, 0)
    const stars = s.stars as { x: number; y: number; r: number; t: number }[]
    stars.forEach((p) => {
      p.t += 0.12
      const a = Math.sin(p.t) * 0.5 + 0.5
      ctx.fillStyle = `rgba(255,255,255,${a})`
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
      ctx.fill()
    })
  }
}

function wpCircuit(c: HTMLCanvasElement, ctx: CanvasRenderingContext2D, f: number) {
  const W = c.width
  const H = c.height
  const s = st(c)
  if (f === 0 || !s.cr) {
    ctx.fillStyle = '#000a00'
    ctx.fillRect(0, 0, W, H)
    ctx.strokeStyle = 'rgba(0,80,0,.6)'
    ctx.lineWidth = 1
    const paths: { x: number; y: number }[] = []
    for (let i = 0; i < 40; i++) {
      let x = (Math.random() * W) | 0
      let y = (Math.random() * H) | 0
      ctx.beginPath()
      ctx.moveTo(x, y)
      for (let j = 0; j < 5; j++) {
        if (Math.random() > 0.5) x = x + ((Math.random() > 0.5 ? 80 : -80) | 0)
        else y = y + ((Math.random() > 0.5 ? 80 : -80) | 0)
        ctx.lineTo(x, y)
        paths.push({ x, y })
      }
      ctx.stroke()
      ctx.fillStyle = 'rgba(0,150,0,.5)'
      ctx.beginPath()
      ctx.arc(x, y, 3, 0, Math.PI * 2)
      ctx.fill()
    }
    s.cr = { paths, pulses: [] }
    s.base = ctx.getImageData(0, 0, W, H)
  }
  const cr = s.cr as { paths: { x: number; y: number }[]; pulses: { x: number; y: number; r: number; life: number }[] }
  ctx.putImageData(s.base as ImageData, 0, 0)
  if (f % 20 === 0) {
    const p = cr.paths[Math.floor(Math.random() * cr.paths.length)]
    if (p) cr.pulses.push({ x: p.x, y: p.y, r: 0, life: 25 })
  }
  cr.pulses = cr.pulses.filter((p) => p.life > 0)
  cr.pulses.forEach((p) => {
    ctx.strokeStyle = `rgba(0,255,80,${p.life / 25})`
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2)
    ctx.stroke()
    p.r++
    p.life--
  })
}