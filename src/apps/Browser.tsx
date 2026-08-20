import { useState } from 'react'
import { WinBody, WinMenubar, MenuItem, WinStatusbar, StatusPanel } from '../ui/Window'
import { clickSnd } from '../os/sound'
import { useOS } from '../os/store'
import { openWeb, toEmbed } from '../os/webview'

interface WResult { title: string; link: string; snippet: string }
interface GImg { title: string; thumb: string; full: string }
interface GVid { title: string; url: string }
interface YTVid { title: string; id: string }
type Mode = 'home' | 'results'
type Tab = 'all' | 'images' | 'maps' | 'videos' | 'shorts' | 'youtube' | 'news' | 'shopping'

const TABS: { id: Tab; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'images', label: 'Images' },
  { id: 'maps', label: 'Maps' },
  { id: 'videos', label: 'Videos' },
  { id: 'shorts', label: 'Short videos' },
  { id: 'youtube', label: 'YouTube' },
  { id: 'news', label: 'News' },
  { id: 'shopping', label: 'Shopping' },
]

const YT_APIS = [
  (q: string) => 'https://api.piped.private.coffee/search?q=' + encodeURIComponent(q) + '&filter=videos',
  (q: string) => 'https://pipedapi.kavin.rocks/search?q=' + encodeURIComponent(q) + '&filter=videos',
  (q: string) => 'https://inv.nadeko.net/api/v1/search?q=' + encodeURIComponent(q) + '&type=video',
]

async function ytSearch(q: string): Promise<YTVid[]> {
  for (const build of YT_APIS) {
    try {
      const ctrl = new AbortController()
      const timer = setTimeout(() => ctrl.abort(), 6000)
      const r = await fetch(build(q), { signal: ctrl.signal })
      clearTimeout(timer)
      if (!r.ok) continue
      const d = await r.json() as unknown
      if (Array.isArray(d) && d.length > 0) {
        const vids = (d as { videoId?: string; title?: string }[])
          .filter((x) => x.videoId)
          .map((x) => ({ title: x.title || 'Untitled', id: x.videoId as string }))
        if (vids.length > 0) return vids
      } else if (d && typeof d === 'object' && Array.isArray((d as { items?: unknown }).items)) {
        const items = (d as { items: { url?: string; title?: string }[] }).items
        const vids = items
          .filter((x) => x.url && x.url.includes('v='))
          .map((x) => ({ title: x.title || 'Untitled', id: (x.url as string).split('v=')[1] }))
        if (vids.length > 0) return vids
      }
    } catch {
      /* try next instance */
    }
  }
  throw new Error('unavailable')
}

export default function Browser() {
  const [url, setUrl] = useState('https://github.com/SHREENIDHIMS')
  const [status, setStatus] = useState('Ready')
  const [mode, setMode] = useState<Mode>('home')
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<WResult[]>([])
  const [images, setImages] = useState<GImg[]>([])
  const [videos, setVideos] = useState<GVid[]>([])
  const [searched, setSearched] = useState('')
  const [searching, setSearching] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [timeMs, setTimeMs] = useState(0)
  const [corrected, setCorrected] = useState<string | null>(null)
  const [tab, setTab] = useState<Tab>('all')
  const [mapLoc, setMapLoc] = useState<{ name: string; bbox: string; marker: string } | null>(null)
  const [ytVids, setYtVids] = useState<YTVid[]>([])

  const strip = (h: string) => h.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()

  const wikiSearch = async (q: string) => {
    const r = await fetch('https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=' + encodeURIComponent(q) + '&format=json&origin=*&srlimit=10')
    const data = await r.json()
    const items: WResult[] = (data?.query?.search || []).map((s: { title: string; snippet: string }) => ({
      title: s.title,
      link: 'https://en.wikipedia.org/wiki/' + encodeURIComponent(s.title.replace(/ /g, '_')),
      snippet: strip(s.snippet),
    }))
    return { items, suggestion: (data?.query?.searchinfo?.suggestion || '') as string }
  }

  const commonsSearch = async (q: string, type: 'image' | 'video') => {
    const term = (type === 'video' ? 'filetype:video ' : '') + q
    const r = await fetch('https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=' + encodeURIComponent(term) + '&gsrnamespace=6&gsrlimit=30&prop=imageinfo&iiprop=url%7Cmime&iiurlwidth=240&format=json&origin=*')
    const d = await r.json()
    const pages: Record<string, { title: string; imageinfo?: { thumburl?: string; url?: string; mime?: string }[] }> = d?.query?.pages || {}
    return Object.values(pages)
      .map((p) => ({
        title: p.title.replace(/^File:/, ''),
        thumb: p.imageinfo?.[0]?.thumburl || '',
        full: p.imageinfo?.[0]?.url || '',
        mime: p.imageinfo?.[0]?.mime || '',
      }))
      .filter((x) => (type === 'image'
        ? /^image\/(jpeg|png|gif|webp|svg\+xml)/.test(x.mime) && !!x.thumb
        : /^video\//.test(x.mime) && !!x.full))
  }

  const runTab = async (q: string, t: Tab) => {
    setSearching(true)
    setErr(null)
    const t0 = performance.now()
    try {
      if (t === 'all') {
        let { items, suggestion } = await wikiSearch(q)
        if (items.length === 0 && suggestion) {
          setCorrected(suggestion)
          setQuery(suggestion)
          const retry = await wikiSearch(suggestion)
          items = retry.items
        }
        setResults(items)
        if (items.length === 0) setErr('No results for "' + q + '"')
      } else if (t === 'images') {
        const imgs = await commonsSearch(q, 'image')
        setImages(imgs)
        if (imgs.length === 0) setErr('No images for "' + q + '"')
      } else if (t === 'maps') {
        const r = await fetch('https://nominatim.openstreetmap.org/search?q=' + encodeURIComponent(q) + '&format=json&limit=1')
        const d = await r.json()
        if (!Array.isArray(d) || d.length === 0) {
          setMapLoc(null)
          setErr('No place found for "' + q + '"')
        } else {
          const hit = d[0] as { display_name: string; boundingbox: string[]; lat: string; lon: string }
          const bb = hit.boundingbox
          setMapLoc({
            name: hit.display_name,
            bbox: bb[2] + ',' + bb[0] + ',' + bb[3] + ',' + bb[1],
            marker: hit.lat + ',' + hit.lon,
          })
        }
      } else if (t === 'youtube') {
        try {
          const vids = await ytSearch(q)
          setYtVids(vids)
          if (vids.length === 0) setErr('No videos for "' + q + '"')
        } catch {
          setErr('YouTube search is unavailable right now — paste any youtube.com link in the address bar and it will still play here.')
        }
      } else {
        const vids = (await commonsSearch(q, 'video')).map((v) => ({ title: v.title, url: v.full }))
        setVideos(vids)
        if (vids.length === 0) setErr('No videos for "' + q + '"')
      }
      setTimeMs(Math.round(performance.now() - t0))
      setStatus('Done')
    } catch {
      setErr('Network error — check your connection')
      setStatus('Error')
    } finally {
      setSearching(false)
    }
  }

  const search = async (raw: string) => {
    clickSnd()
    const t = raw.trim()
    if (!t) return
    if (!t.includes(' ') && (t.startsWith('http://') || t.startsWith('https://') || /^[\w-]+(\.[\w-]+)+(\/.*)?$/.test(t))) {
      const u = /^https?:\/\//.test(t) ? t : 'https://' + t
      setUrl(u)
      openWeb(toEmbed(u))
      setStatus('Opened in OS Site Viewer')
      return
    }
    setQuery(t)
    setSearched(t)
    setMode('results')
    setCorrected(null)
    setErr(null)
    setResults([])
    setImages([])
    setVideos([])
    setYtVids([])
    setMapLoc(null)
    setTab('all')
    setUrl('https://en.wikipedia.org/wiki/Special:Search?search=' + encodeURIComponent(t))
    await runTab(t, 'all')
  }

  const switchTab = (t: Tab) => {
    clickSnd()
    setTab(t)
    if (!searched || searching) return
    setErr(null)
    setCorrected(null)
    setResults([])
    setImages([])
    setVideos([])
    setYtVids([])
    setMapLoc(null)
    runTab(searched, t)
  }

  const home = () => {
    clickSnd()
    setMode('home')
    setStatus('Ready')
  }

  const go = () => {
    clickSnd()
    const t = url.trim()
    if (!t) return
    const wiki = t.match(/wikipedia\.org\/wiki\/Special:Search\?search=([^&]+)/i)
    if (wiki) {
      search(decodeURIComponent(wiki[1].replace(/\+/g, ' ')))
      return
    }
    if (t.startsWith('mailto:')) {
      window.location.href = t
      return
    }
    const looksUrl = /^https?:\/\//i.test(t) || (!t.includes(' ') && t.includes('.'))
    if (!looksUrl) {
      search(t)
      return
    }
    const u = /^[a-z]+:\/\//i.test(t) ? t : 'https://' + t
    setUrl(u)
    openWeb(toEmbed(u))
    setStatus('Opened in OS Site Viewer')
  }

  const googleBar = () => (
    <div className="google-bar">
      <span className="google-logo">
        <span className="g">G</span><span className="o1">o</span><span className="o2">o</span><span className="g2">g</span><span className="l">l</span><span className="e">e</span>
      </span>
      <input
        className="google-input"
        value={query}
        placeholder="Search the web or type a URL"
        spellCheck={false}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') search(query) }}
      />
      <button className="google-search-btn" onClick={() => search(query)}>Google Search</button>
    </div>
  )

  const count = tab === 'images' ? images.length : tab === 'videos' || tab === 'shorts' ? videos.length : tab === 'youtube' ? ytVids.length : results.length

  return (
    <>
      <WinMenubar>
        <MenuItem>File</MenuItem>
        <MenuItem>View</MenuItem>
        <MenuItem>Favorites</MenuItem>
      </WinMenubar>
      <WinBody style={{ padding: 0, display: 'flex', flexDirection: 'column' }}>
        <div className="browser-bar">
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#000080' }}>Address:</span>
          <input
            className="browser-input"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') go() }}
          />
          <button className="browser-go" onClick={go}>Go ▶</button>
          <button className="browser-go" onClick={home}>⌂</button>
        </div>
        {mode === 'home' ? (
          <div className="browser-top sa-center">
            <div className="browser-banner">🌐 SM-BROWSER</div>
            {googleBar()}
            <div className="browser-quick">
              <button className="browser-link-btn" onClick={() => { clickSnd(); setUrl('https://github.com/SHREENIDHIMS'); openWeb('https://github.com/SHREENIDHIMS'); setStatus('Opened in OS Site Viewer') }}>🐙 GitHub</button>
              <button className="browser-link-btn" onClick={() => { clickSnd(); setUrl('https://linkedin.com/in/shreenidhi-m03'); openWeb('https://linkedin.com/in/shreenidhi-m03'); setStatus('Opened in OS Site Viewer') }}>🔗 LinkedIn</button>
              <button className="browser-link-btn" onClick={() => { clickSnd(); window.location.href = 'mailto:nshreenidhi655@gmail.com' }}>📧 Email</button>
              <button className="browser-link-btn" onClick={() => { clickSnd(); useOS.getState().openWin('resumeWin', 640, 560) }}>📄 Resume</button>
            </div>
            <div className="browser-tag">Live search runs inside this window — pages load in the OS Site Viewer, no new tabs.</div>
          </div>
        ) : (
          <>
            <div className="browser-top g-top">{googleBar()}</div>
            <div className="g-results">
              <div className="g-tabs">
                {TABS.map((tb) => (
                  <button key={tb.id} className={'g-tab' + (tab === tb.id ? ' act' : '')} onClick={() => switchTab(tb.id)}>
                    {tb.label}
                  </button>
                ))}
              </div>
              {tab === 'news' || tab === 'shopping' ? (
                <div className="g-note">
                  {tab === 'news' ? '📰' : '🛒'} No live {tab} source can run inside the OS — try All, Images, Maps or Videos.
                </div>
              ) : tab === 'maps' ? (
                mapLoc ? (
                  <div className="g-map">
                    <iframe
                      key={mapLoc.bbox}
                      src={'https://www.openstreetmap.org/export/embed.html?bbox=' + mapLoc.bbox + '&layer=mapnik&marker=' + mapLoc.marker}
                      title="map"
                    />
                    <div className="g-img-cap">📍 {mapLoc.name}</div>
                  </div>
                ) : null
                ) : (
                  <>
                    <div className="g-info">
                      {searching
                        ? 'Searching…'
                        : searched
                          ? 'About ' + count + ' results (' + (timeMs / 1000).toFixed(2) + ' seconds) for "' + searched + '" — powered by Wikipedia'
                          : ''}
                    </div>
                  {corrected && (
                    <div className="g-corrected">
                      Did you mean: <button className="g-corrected-link" onClick={() => search(corrected)}>{corrected}</button>
                    </div>
                  )}
                  {err && <div className="g-err">⚠ {err}</div>}
                  {tab === 'all' && results.map((r) => (
                    <button
                      key={r.link}
                      className="g-result"
                      onClick={() => { clickSnd(); setUrl(r.link); openWeb(r.link); setStatus('Opened in OS Site Viewer') }}
                    >
                      <div className="g-title">{r.title}</div>
                      <div className="g-link">{r.link}</div>
                      <div className="g-snippet">{r.snippet}</div>
                    </button>
                  ))}
                  {tab === 'images' && (
                    <div className="g-grid">
                      {images.map((im) => (
                        <button key={im.full} className="g-img" onClick={() => { clickSnd(); setUrl(im.full); openWeb(im.full); setStatus('Opened in OS Site Viewer') }}>
                          <img src={im.thumb} loading="lazy" alt={im.title} />
                          <div className="g-img-cap">{im.title}</div>
                        </button>
                      ))}
                    </div>
                  )}
                  {(tab === 'videos' || tab === 'shorts') && (
                    <div className="g-grid">
                      {videos.map((v) => (
                        <div key={v.url} className="g-video">
                          <video controls preload="metadata" src={v.url} />
                          <div className="g-img-cap">{v.title}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  {tab === 'youtube' && (
                    <div className="g-grid">
                      {ytVids.map((v) => (
                        <button
                          key={v.id}
                          className="g-img"
                          onClick={() => {
                            clickSnd()
                            const e = 'https://www.youtube.com/embed/' + v.id
                            setUrl(e)
                            openWeb(e)
                            setStatus('Playing in OS Site Viewer')
                          }}
                        >
                          <img src={'https://i.ytimg.com/vi/' + v.id + '/mqdefault.jpg'} loading="lazy" alt={v.title} />
                          <div className="g-img-cap">{v.title}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </WinBody>
      <WinStatusbar>
        <StatusPanel><span className="status-dot" /> Connected</StatusPanel>
        <StatusPanel>{status}</StatusPanel>
      </WinStatusbar>
    </>
  )
}