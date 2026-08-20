import { useOS } from './os/store'
import { useThemeEffect, useShortcuts } from './hooks/useOSEffects'
import { Boot } from './ui/Boot'
import { Welcome } from './ui/Boot'
import { Desktop } from './ui/Desktop'

export default function App() {
  const phase = useOS((s) => s.phase)
  useThemeEffect()
  useShortcuts()

  if (phase === 'desktop') return <Desktop />
  if (phase === 'welcome') return <Welcome />
  return <Boot />
}