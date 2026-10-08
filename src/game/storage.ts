import { AP_PER_WEEK } from './types'
import type { GameState } from './types'

/** Swappable save layer: localStorage now, Supabase later. */
export interface SaveBackend {
  save(state: GameState): Promise<void>
  load(): Promise<GameState | null>
  clear(): Promise<void>
}

const KEY = 'bandwars-save'

export const localBackend: SaveBackend = {
  async save(state) {
    try { localStorage.setItem(KEY, JSON.stringify(state)) } catch { /* ignore */ }
  },
  async load() {
    try {
      const raw = localStorage.getItem(KEY)
      if (!raw) return null
      const s = JSON.parse(raw) as { version: number }
      if (s.version === 2) return { ...(s as object), version: 3, ap: AP_PER_WEEK, fans: 0, songs: [] } as unknown as GameState
      return s.version === 3 ? (s as GameState) : null
    } catch { return null }
  },
  async clear() {
    try { localStorage.removeItem(KEY) } catch { /* ignore */ }
  },
}

export const backend: SaveBackend = localBackend
