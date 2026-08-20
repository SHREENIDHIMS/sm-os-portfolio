import { useState } from 'react'
import { WinBody, WinMenubar, MenuItem, WinStatusbar, StatusPanel } from '../ui/Window'
import { clickSnd } from '../os/sound'

const initialCode = `// SM-OS Code Playground
const greet = name => \`Welcome to SM-OS, \${name}!\`;
console.log(greet("Visitor"));

const skills = ['Java','Spring Boot','MySQL','TensorFlow'];
console.log("Skills:", skills.join(', '));

const sum = [10,20,30,40].reduce((a,b)=>a+b,0);
console.log("Sum:", sum);`

export default function CodePlayground() {
  const [code, setCode] = useState(initialCode)
  const [output, setOutput] = useState('OUTPUT: ready...')

  const run = () => {
    clickSnd()
    const logs: string[] = []
    const sc = {
      log: (...a: unknown[]) => logs.push(a.map((x) => { try { return JSON.stringify(x) } catch { return String(x) } }).join(' ')),
      error: (...a: unknown[]) => logs.push('ERROR: ' + a.join(' ')),
      warn: (...a: unknown[]) => logs.push('WARN: ' + a.join(' ')),
    }
    try {
      new Function('console', code)(sc)
      setOutput('OUTPUT:\n\n' + (logs.length ? logs.join('\n') : '(no output)'))
    } catch (err) {
      setOutput('OUTPUT:\n\nERROR: ' + (err as Error).message)
    }
  }

  const clear = () => {
    clickSnd()
    setOutput('OUTPUT: ready...')
  }

  return (
    <>
      <WinMenubar>
        <MenuItem>File</MenuItem>
        <MenuItem onClick={run}>▶ Run</MenuItem>
        <MenuItem onClick={clear}>Clear</MenuItem>
      </WinMenubar>
      <WinBody>
        <div className="prompt-line"><span>CODE_PLAYGROUND</span> — Write &amp; Run JavaScript</div>
        <textarea
          className="code-editor"
          spellCheck={false}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Tab') {
              e.preventDefault()
              const el = e.currentTarget
              const s = el.selectionStart
              el.value = el.value.substring(0, s) + '  ' + el.value.substring(el.selectionEnd)
              el.selectionStart = el.selectionEnd = s + 2
              setCode(el.value)
            }
          }}
        />
        <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
          <button className="retro-btn" style={{ fontSize: 15, padding: '2px 12px', marginTop: 0 }} onClick={run}>▶ RUN</button>
          <button className="retro-btn" style={{ fontSize: 15, padding: '2px 12px', marginTop: 0 }} onClick={clear}>⌫ CLEAR</button>
        </div>
        <div className="code-output">{output}</div>
      </WinBody>
      <WinStatusbar>
        <StatusPanel>JavaScript</StatusPanel>
        <StatusPanel>Sandboxed</StatusPanel>
      </WinStatusbar>
    </>
  )
}