import { addLog } from './band'
import { getPersonality } from './data'
import { createRng } from './rng'
import type { GameState, Member } from './types'

export const WEEKS_PER_YEAR = 52

/**
 * PLACEHOLDER income (odd jobs and busking) so the early game isn't a pure
 * death spiral. Replaced by real gig/stream income in later steps.
 */
export const BASE_WEEKLY_INCOME = 60

const clamp = (n: number) => Math.max(0, Math.min(100, n))

/** Advance the game by one week. Pure: returns a new state. */
export function advanceWeek(state: GameState): GameState {
  const r = createRng(state.seed)
  let s: GameState = { ...state, week: state.week + 1, candidates: [], searched: false }
  const log = (text: string) => { s = { ...s, log: addLog(s, text) } }

  s = { ...s, money: s.money + BASE_WEEKLY_INCOME }

  const payroll = s.members.reduce((sum, m) => sum + m.salary, 0)
  const paid = s.money >= payroll
  if (paid) s = { ...s, money: s.money - payroll }
  else log("You couldn't make payroll. The band is not happy.")

  const survivors: Member[] = []
  let quitCount = 0
  for (const m of s.members) {
    if (m.id === 'founder') { survivors.push(m); continue }
    const p = getPersonality(m.personality)
    let mood = paid ? m.mood + Math.round((70 - m.mood) * 0.15) : m.mood - 12
    if (r.next() < p.dramaChance) {
      mood += p.dramaMood
      log(p.dramaText.replace('{name}', m.name))
    }
    mood = clamp(mood)
    const quitChance = mood < 40 ? ((40 - mood) / 100) * p.quitMod * (1 + 0.1 * (s.members.length - 1)) : 0
    if (r.next() < quitChance) {
      quitCount++
      log(`${m.name} quit the band.`)
      continue
    }
    survivors.push({ ...m, mood })
  }
  if (quitCount > 0) {
    for (let i = 0; i < survivors.length; i++) {
      if (survivors[i].id !== 'founder') survivors[i] = { ...survivors[i], mood: clamp(survivors[i].mood - 5 * quitCount) }
    }
  }
  return { ...s, members: survivors, seed: r.seed() }
}

export const yearOf = (week: number) => Math.floor((week - 1) / WEEKS_PER_YEAR) + 1
export const weekOfYear = (week: number) => ((week - 1) % WEEKS_PER_YEAR) + 1
