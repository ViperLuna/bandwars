import type { GameState } from './types'

export const WEEKS_PER_YEAR = 52

/** Advance the game by one week. Pure: returns a new state. */
export function advanceWeek(state: GameState): GameState {
  return { ...state, week: state.week + 1 }
}

export const yearOf = (week: number) => Math.floor((week - 1) / WEEKS_PER_YEAR) + 1
export const weekOfYear = (week: number) => ((week - 1) % WEEKS_PER_YEAR) + 1
