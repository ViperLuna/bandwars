import type { GameState } from './types'

/** Swappable save layer: localStorage now, Supabase later. */
export interface SaveBackend {
  save(state: GameState): Promise<void>
  load(): Promise<GameState | null>
}

const KEY = 'bandwars-save'

export const localBackend: SaveBackend = {
  async save(state) {
    try { localStorage.setItem(KEY, JSON.stringify(state)) } catch { /* ignore */ }
  },
  async load() {
    try {
      const raw = localStorage.getItem(KEY)
      return raw ? (JSON.parse(raw) as GameState) : null
    } catch { return null }
  },
}
