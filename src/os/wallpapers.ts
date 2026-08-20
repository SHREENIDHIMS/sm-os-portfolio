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
  { name: 'Synthwave', fn: wpSynth },
  { name: 'Aurora', fn: wpAurora },
  { name: 'Network', fn: wpNet },
  { name: 'Rain', fn: wpRain },
  { name: 'Fireflies', fn: wpFireflies },
  { name: 'Snowfall', fn: wpSnow },
  { name: 'Classic Blue', fn: wpClassic },
  { name: 'Teal', fn: wpTeal },
  { name: 'Graphite', fn: wpGraphite },
]

function wpClassic(c: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  const g = ctx.createLinearGradient(0, 0, 0, c.height)
  g.addColorStop(0, '#0000b4')
  g.addColorStop(1, '#00005a')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, c.width, c.height)
}

function wpTeal(c: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = '#0e8080'
  ctx.fillRect(0, 0, c.width, c.height)
}

function wpGraphite(c: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  const g = ctx.createLinearGradient(0, 0, 0, c.height)
  g.addColorStop(0, '#2c2c38')
  g.addColorStop(1, '#12121a')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, c.width, c.height)
}

function twinkleStars(c: HTMLCanvasElement, ctx: CanvasRenderingContext2D, t: number, n: number, maxY: number) {
  const s = st(c)
  if (!s.tw) {
    const arr: { x: number; y: number; p: number }[] = []
    for (let i = 0; i < n; i++) arr.push({ x: Math.random() * c.width, y: Math.random() * maxY, p: Math.random() * Math.PI * 2 })
    s.tw = arr
  }
  const arr = s.tw as { x: number; y: number; p: number }[]
  arr.forEach((p) => {
    const a = 0.25 + 0.75 * Math.abs(Math.sin(p.p + t))
    ctx.fillStyle = `rgba(255,255,255,${a})`
    ctx.fillRect(p.x, p.y, 1.4, 1.4)
  })
}

function wpSynth(c: HTMLCanvasElement, ctx: CanvasRenderingContext2D, f: number) {
  const W = c.width
  const H = c.height
  const hz = H * 0.6
  const g = ctx.createLinearGradient(0, 0, 0, hz)
  g.addColorStop(0, '#0b0020')
  g.addColorStop(1, '#3a0045')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, W, hz)
  twinkleStars(c, ctx, f * 0.05, 90, hz * 0.85)
  const r = Math.min(W, H) * 0.16
  const cx = W / 2
  const cy = hz - r * 0.1
  ctx.save()
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.clip()
  const sg = ctx.createLinearGradient(0, cy - r, 0, cy + r)
  sg.addColorStop(0, '#ffdd55')
  sg.addColorStop(0.55, '#ff6699')
  sg.addColorStop(1, '#cc2277')
  ctx.fillStyle = sg
  ctx.fillRect(cx - r, cy - r, r * 2, r * 2)
  ctx.fillStyle = '#1a0033'
  let yy = cy - r * 0.15
  let k = 2
  while (yy < cy + r) {
    ctx.fillRect(cx - r, yy, r * 2, k)
    yy += k + 9
    k += 1.6
  }
  ctx.restore()
  ctx.fillStyle = '#05000f'
  ctx.fillRect(0, hz, W, H - hz)
  ctx.strokeStyle = 'rgba(255,60,160,0.45)'
  ctx.lineWidth = 1
  for (let i = 0; i < 11; i++) {
    const p = ((i / 11) + (f * 0.004)) % 1
    const y = hz + (H - hz) * p * p
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(W, y)
    ctx.stroke()
  }
  for (let i = -10; i <= 10; i++) {
    ctx.beginPath()
    ctx.moveTo(W / 2 + i * W * 0.095, H)
    ctx.lineTo(W / 2 + i * W * 0.012, hz)
    ctx.stroke()
  }
}

function wpAurora(c: HTMLCanvasElement, ctx: CanvasRenderingContext2D, f: number) {
  const W = c.width
  const H = c.height
  const t = f * 0.01
  ctx.fillStyle = '#010208'
  ctx.fillRect(0, 0, W, H)
  twinkleStars(c, ctx, t * 3, 120, H * 0.9)
  const bands: [string, number][] = [
    ['rgba(0,255,170,', 0],
    ['rgba(110,80,255,', 2.1],
    ['rgba(255,90,190,', 4.2],
  ]
  bands.forEach(([col, ph], bi) => {
    ctx.beginPath()
    for (let x = -20; x <= W + 20; x += 14) {
      const y = H * 0.34 + Math.sin(x * 0.006 + t * 2 + ph) * H * 0.08 + Math.sin(x * 0.013 - t * 1.4 + ph) * H * 0.045
      if (x === -20) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.strokeStyle = col + '0.22)'
    ctx.lineWidth = 52 + 14 * Math.sin(t + bi)
    ctx.lineCap = 'round'
    ctx.stroke()
    ctx.strokeStyle = col + '0.5)'
    ctx.lineWidth = 12
    ctx.stroke()
  })
}

function wpNet(c: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  const W = c.width
  const H = c.height
  const s = st(c)
  ctx.fillStyle = 'rgba(2,6,16,0.22)'
  ctx.fillRect(0, 0, W, H)
  if (!s.nodes) {
    const nodes: { x: number; y: number; vx: number; vy: number }[] = []
    for (let i = 0; i < 60; i++) nodes.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 1.1, vy: (Math.random() - 0.5) * 1.1 })
    s.nodes = nodes
  }
  const nodes = s.nodes as { x: number; y: number; vx: number; vy: number }[]
  nodes.forEach((n) => {
    n.x = (n.x + n.vx + W) % W
    n.y = (n.y + n.vy + H) % H
  })
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x
      const dy = nodes[i].y - nodes[j].y
      const d = Math.sqrt(dx * dx + dy * dy)
      if (d < 130) {
        ctx.strokeStyle = `rgba(90,140,255,${(1 - d / 130) * 0.35})`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(nodes[i].x, nodes[i].y)
        ctx.lineTo(nodes[j].x, nodes[j].y)
        ctx.stroke()
      }
    }
  }
  nodes.forEach((n) => {
    ctx.fillStyle = 'rgba(120,200,255,0.9)'
    ctx.beginPath()
    ctx.arc(n.x, n.y, 1.8, 0, Math.PI * 2)
    ctx.fill()
  })
}

function wpRain(c: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  const W = c.width
  const H = c.height
  const s = st(c)
  ctx.fillStyle = 'rgba(8,12,22,0.28)'
  ctx.fillRect(0, 0, W, H)
  if (!s.drops) {
    const drops: { x: number; y: number; l: number; v: number }[] = []
    for (let i = 0; i < 130; i++) drops.push({ x: Math.random() * W, y: Math.random() * H, l: 8 + Math.random() * 14, v: 7 + Math.random() * 8 })
    s.drops = drops
    s.rings = [] as { x: number; y: number; r: number; life: number }[]
  }
  const drops = s.drops as { x: number; y: number; l: number; v: number }[]
  const rings = (s.rings || []) as { x: number; y: number; r: number; life: number }[]
  ctx.strokeStyle = 'rgba(150,185,255,0.35)'
  ctx.lineWidth = 1
  drops.forEach((d) => {
    ctx.beginPath()
    ctx.moveTo(d.x, d.y)
    ctx.lineTo(d.x - 1.5, d.y + d.l)
    ctx.stroke()
    d.y += d.v
    d.x -= 0.4
    if (d.y > H) {
      rings.push({ x: d.x, y: H - 2, r: 1, life: 12 })
      d.y = -d.l
      d.x = Math.random() * W
    }
  })
  for (let i = rings.length - 1; i >= 0; i--) {
    const rg = rings[i]
    ctx.strokeStyle = `rgba(150,185,255,${rg.life / 24})`
    ctx.beginPath()
    ctx.ellipse(rg.x, rg.y, rg.r * 2.2, rg.r * 0.7, 0, 0, Math.PI * 2)
    ctx.stroke()
    rg.r += 0.7
    rg.life--
    if (rg.life <= 0) rings.splice(i, 1)
  }
}

function wpFireflies(c: HTMLCanvasElement, ctx: CanvasRenderingContext2D, f: number) {
  const W = c.width
  const H = c.height
  const s = st(c)
  ctx.fillStyle = 'rgba(2,16,9,0.18)'
  ctx.fillRect(0, 0, W, H)
  if (!s.flies) {
    const flies: { x: number; y: number; a: number; p: number }[] = []
    for (let i = 0; i < 34; i++) flies.push({ x: Math.random() * W, y: Math.random() * H, a: Math.random() * Math.PI * 2, p: Math.random() * Math.PI * 2 })
    s.flies = flies
  }
  const flies = s.flies as { x: number; y: number; a: number; p: number }[]
  flies.forEach((fl) => {
    fl.a += (Math.random() - 0.5) * 0.25
    fl.x = (fl.x + Math.cos(fl.a) * 0.9 + W) % W
    fl.y = (fl.y + Math.sin(fl.a) * 0.9 + H) % H
    const glow = 0.35 + 0.65 * Math.abs(Math.sin(fl.p + f * 0.03))
    ctx.shadowColor = 'rgba(190,255,80,0.9)'
    ctx.shadowBlur = 14 * glow
    ctx.fillStyle = `rgba(210,255,120,${glow})`
    ctx.beginPath()
    ctx.arc(fl.x, fl.y, 2.2, 0, Math.PI * 2)
    ctx.fill()
  })
  ctx.shadowBlur = 0
}

function wpSnow(c: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  const W = c.width
  const H = c.height
  const s = st(c)
  ctx.fillStyle = 'rgba(7,11,26,0.2)'
  ctx.fillRect(0, 0, W, H)
  if (!s.flakes) {
    const flakes: { x: number; y: number; r: number; ph: number; sp: number }[] = []
    for (let i = 0; i < 120; i++) flakes.push({ x: Math.random() * W, y: Math.random() * H, r: 1 + Math.random() * 2.4, ph: Math.random() * Math.PI * 2, sp: 0.6 + Math.random() * 1.4 })
    s.flakes = flakes
  }
  const flakes = s.flakes as { x: number; y: number; r: number; ph: number; sp: number }[]
  flakes.forEach((fl) => {
    fl.y += fl.sp
    fl.x += Math.sin(fl.ph + fl.y * 0.012) * 0.5
    if (fl.y > H + 4) {
      fl.y = -4
      fl.x = Math.random() * W
    }
    ctx.fillStyle = `rgba(235,245,255,${0.45 + fl.r / 6})`
    ctx.beginPath()
    ctx.arc(fl.x, fl.y, fl.r, 0, Math.PI * 2)
    ctx.fill()
  })
}

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