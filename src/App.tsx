import { useEffect } from 'react'
import { useOS } from './os/store'
import { useThemeEffect, useShortcuts } from './hooks/useOSEffects'
import { Boot } from './ui/Boot'
import { Welcome } from './ui/Boot'
import { Desktop } from './ui/Desktop'
import { Screensaver } from './ui/Screensaver'

export default function App() {
  const phase = useOS((s) => s.phase)
  const screensaver = useOS((s) => s.screensaver)
  useThemeEffect()
  useShortcuts()

  useEffect(() => {
    try {
      if (window.sessionStorage.getItem('sm-os-booted')) useOS.getState().setPhase('desktop')
    } catch {
      /* storage unavailable */
    }
  }, [])

  useEffect(() => {
    if (phase !== 'desktop') return
    try {
      window.sessionStorage.setItem('sm-os-booted', '1')
    } catch {
      /* storage unavailable */
    }
  }, [phase])

  if (phase === 'desktop')
    return (
      <>
        <Desktop />
        {screensaver && <Screensaver />}
      </>
    )
  if (phase === 'welcome') return <Welcome />
  return <Boot />
}