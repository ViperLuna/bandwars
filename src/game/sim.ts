import type { GameState } from './types'

/** Advance the game by one week. Pure: returns a new state. */
export function advanceWeek(state: GameState): GameState {
  return { ...state, week: state.week + 1 }
}
