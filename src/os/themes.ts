import type { ThemeName } from './store'

export interface ThemeDef {
  id: ThemeName
  label: string
  bg: string
  sur: string
  sur2: string
  win: string
  acc: string
  acc2: string
  panel: string
  swatch: string
}

export const THEMES: Record<ThemeName, ThemeDef> = {
  blue: { id: 'blue', label: 'Blue', bg: '#0000aa', sur: '#000080', sur2: '#000096', win: '#00008f', acc: '#00ff00', acc2: '#44ff44', panel: '#000048', swatch: 'linear-gradient(180deg,#0000b0,#000060)' },
  amber: { id: 'amber', label: 'Amber', bg: '#402000', sur: '#301800', sur2: '#3a1c00', win: '#301500', acc: '#ffcc00', acc2: '#ffdd44', panel: '#1e0e00', swatch: 'linear-gradient(180deg,#402000,#201000)' },
  red: { id: 'red', label: 'Red', bg: '#440010', sur: '#330008', sur2: '#3c000c', win: '#330010', acc: '#ff4444', acc2: '#ff6666', panel: '#200006', swatch: 'linear-gradient(180deg,#400010,#200008)' },
  green: { id: 'green', label: 'Green', bg: '#003020', sur: '#002015', sur2: '#00281c', win: '#002015', acc: '#00ff88', acc2: '#44ffaa', panel: '#001409', swatch: 'linear-gradient(180deg,#003020,#001510)' },
  purple: { id: 'purple', label: 'Purple', bg: '#200040', sur: '#180030', sur2: '#1e003a', win: '#180030', acc: '#cc88ff', acc2: '#ddaaff', panel: '#100022', swatch: 'linear-gradient(180deg,#200040,#100020)' },
}

export const THEME_LIST: ThemeDef[] = Object.values(THEMES)
