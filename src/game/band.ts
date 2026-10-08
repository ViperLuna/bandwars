import { getGenre, getMethod, getPersonality, getRarity, names, personalities, rarities } from './data'
import { createRng } from './rng'
import type { Rng } from './rng'
import type { GameState, LogEntry, Member, Result } from './types'

export const MAX_LOG = 40

export const addLog = (state: GameState, text: string): LogEntry[] =>
  [{ week: state.week, text }, ...state.log].slice(0, MAX_LOG)

/** Roll one recruit. Instruments the band is missing are 3x as likely. */
export function generateMember(r: Rng, state: GameState, rarityIdx: number, id: string): Member {
  const genre = getGenre(state.genreId)!
  const have = new Set(state.members.map((m) => m.instrument))
  const instrument = genre.instruments[r.weighted(genre.instruments.map((i) => (have.has(i) ? 1 : 3)))]
  const rarity = rarities[rarityIdx]
  return {
    id,
    name: `${r.pick(names.first)} ${r.pick(names.last)}`,
    instrument,
    skill: r.int(rarity.skillMin, rarity.skillMax),
    rarity: rarity.id,
    personality: r.pick(personalities).id,
    mood: 70,
    salary: r.int(rarity.salaryMin, rarity.salaryMax),
  }
}

/** Run a recruiting search (the gacha pull). Replaces this week's candidate pool. */
export function search(state: GameState, methodId: string): Result {
  const method = getMethod(methodId)
  if (!method) return { ok: false, reason: 'Unknown search method.' }
  if (state.searched) return { ok: false, reason: "You've already searched this week." }
  if (state.money < method.cost) return { ok: false, reason: "You can't afford that." }
  const r = createRng(state.seed)
  let nextId = state.nextId
  const candidates = Array.from({ length: method.count }, () =>
    generateMember(r, state, r.weighted(method.weights), `m${nextId++}`),
  )
  const next: GameState = { ...state, money: state.money - method.cost, candidates, searched: true, seed: r.seed(), nextId }
  return { ok: true, state: { ...next, log: addLog(next, `${method.name}: found ${candidates.length} possible recruits.`) } }
}

export function hire(state: GameState, candidateId: string): Result {
  const c = state.candidates.find((m) => m.id === candidateId)
  if (!c) return { ok: false, reason: 'That person is gone.' }
  const max = getGenre(state.genreId)!.maxMembers
  if (state.members.length >= max) return { ok: false, reason: `Your band is full (max ${max}).` }
  const next: GameState = {
    ...state,
    members: [...state.members, c],
    candidates: state.candidates.filter((m) => m.id !== candidateId),
  }
  return { ok: true, state: { ...next, log: addLog(next, `${c.name} (${c.instrument}) joined the band.`) } }
}

export function fire(state: GameState, memberId: string): Result {
  const m = state.members.find((x) => x.id === memberId)
  if (!m || m.id === 'founder') return { ok: false, reason: "You can't fire that person." }
  const next: GameState = {
    ...state,
    members: state.members
      .filter((x) => x.id !== memberId)
      .map((x) => ({ ...x, mood: Math.max(0, x.mood - 4) })),
  }
  return { ok: true, state: { ...next, log: addLog(next, `${m.name} was fired. Awkward in the van.`) } }
}

export const describeMember = (m: Member) =>
  `${getRarity(m.rarity).name} ${m.instrument} · ${getPersonality(m.personality).name}`
