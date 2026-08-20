import { useOS } from './store'

let audioCtx: AudioContext | null = null

export function beep(freq = 600, dur = 0.07, type: OscillatorType = 'square', vol = 0.1) {
  if (useOS.getState().muted) return
  try {
    audioCtx = audioCtx || new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(freq * 0.6, audioCtx.currentTime + dur)
    gain.gain.setValueAtTime(0.001, audioCtx.currentTime)
    gain.gain.exponentialRampToValueAtTime(vol, audioCtx.currentTime + 0.005)
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur)
    osc.connect(gain)
    gain.connect(audioCtx.destination)
    osc.start()
    osc.stop(audioCtx.currentTime + dur + 0.01)
  } catch {
    /* audio unavailable */
  }
}

export const clickSnd = () => beep(440, 0.04, 'square', 0.06)
export const openSnd = () => {
  beep(440, 0.06, 'triangle', 0.09)
  setTimeout(() => beep(660, 0.06, 'triangle', 0.08), 65)
}
export const closeSnd = () => beep(300, 0.05, 'triangle', 0.08)