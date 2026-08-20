import { useOS } from './store'

export const openWeb = (url: string) => useOS.getState().openWebUrl(url)

export function toEmbed(u: string): string {
  const m = u.match(/youtu(?:\.be\/|be\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|live\/))([\w-]{6,20})/)
  return m ? 'https://www.youtube.com/embed/' + m[1] : u
}