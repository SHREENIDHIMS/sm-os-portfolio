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