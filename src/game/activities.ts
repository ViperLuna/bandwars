import { addLog } from './band'
import { getActivity, getGenre, getStudio } from './data'
import { createRng } from './rng'
import type { GameState, Member, Result, Song } from './types'

export const RELEASE_AP = 1
export const RELEASE_COST = 10
export const MAX_SKILL = 100

const clamp = (n: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, n))
const fail = (reason: string): Result => ({ ok: false, reason })

/** Skill gains shrink as skill climbs, so mastering takes real work. */
const gain = (skill: number, power: number) => Math.min(MAX_SKILL, skill + power * (1 - skill / 120))

function spend(state: GameState, ap: number, cost: number): string | null {
  if (state.ap < ap) return 'Not enough action points left this week.'
  if (state.money < cost) return "You can't afford that."
  return null
}

const withLog = (state: GameState, text: string): GameState => ({ ...state, log: addLog(state, text) })

/** Practice, lessons, hangout, promo, busking. */
export function doActivity(state: GameState, activityId: string, memberId?: string): Result {
  const a = getActivity(activityId)
  if (!a || a.kind === 'write') return fail('Unknown activity.')
  const err = spend(state, a.ap, a.cost)
  if (err) return fail(err)
  const r = createRng(state.seed)
  let s: GameState = { ...state, ap: state.ap - a.ap, money: state.money - a.cost }

  switch (a.kind) {
    case 'practice':
      s = { ...s, members: s.members.map((m) => ({ ...m, skill: gain(m.skill, a.power), mood: clamp(m.mood + 2) })) }
      s = withLog(s, `${a.name}: the band got a little tighter.`)
      break
    case 'lessons': {
      const target = s.members.find((m) => m.id === memberId)
      if (!target) return fail('Pick a member for lessons.')
      s = { ...s, members: s.members.map((m) => (m.id === target.id ? { ...m, skill: gain(m.skill, a.power) } : m)) }
      s = withLog(s, `${target.name} took lessons and picked up some new tricks.`)
      break
    }
    case 'hangout':
      s = { ...s, members: s.members.map((m) => ({ ...m, mood: clamp(m.mood + a.power) })) }
      s = withLog(s, 'Band hangout: everyone feels better about this whole thing.')
      break
    case 'promo': {
      const fans = a.power * (0.5 + r.next())
      s = withLog({ ...s, fans: s.fans + fans }, `Your post picked up about ${Math.max(1, Math.round(fans))} new fans.`)
      break
    }
    case 'busk': {
      const tips = Math.round(a.power * (0.5 + r.next() * 1.5))
      s = withLog({ ...s, money: s.money + tips, fans: s.fans + 0.5 + r.next() }, `Busking earned $${tips} in tips and a few curious listeners.`)
      break
    }
  }
  return { ok: true, state: { ...s, seed: r.seed() } }
}

/** Share of the genre's instruments the band covers: 0..1. */
export function genreCoverage(members: Member[], genreId: string): number {
  const wanted = getGenre(genreId)!.instruments
  const have = new Set(members.map((m) => m.instrument))
  return wanted.filter((i) => have.has(i)).length / wanted.length
}

/** Writer skill matters most, then the band, plus genre fit, effort and a little luck. */
export function songQuality(state: GameState, writer: Member, effort: number, luck: number): number {
  const avgSkill = state.members.reduce((s, m) => s + m.skill, 0) / state.members.length
  const avgMood = state.members.reduce((s, m) => s + m.mood, 0) / state.members.length
  const fit = (genreCoverage(state.members, state.genreId) - 0.5) * 20
  return Math.round(clamp(writer.skill * 0.5 + avgSkill * 0.3 + (avgMood - 50) * 0.1 + fit + effort + luck, 1, 100))
}

export function writeSong(state: GameState, activityId: string, writerId: string, title: string): Result {
  const a = getActivity(activityId)
  if (!a || a.kind !== 'write') return fail('Unknown writing session.')
  const writer = state.members.find((m) => m.id === writerId)
  if (!writer) return fail('Pick a songwriter.')
  if (!title.trim()) return fail('Give the song a title.')
  const err = spend(state, a.ap, a.cost)
  if (err) return fail(err)
  const r = createRng(state.seed)
  const quality = songQuality(state, writer, a.power, r.int(-8, 8))
  const song: Song = {
    id: `s${state.nextId}`,
    title: title.trim(),
    genreId: state.genreId,
    writerId: writer.id,
    writerName: writer.name,
    quality,
    status: 'draft',
    totalStreams: 0,
    lastWeekStreams: 0,
  }
  const s: GameState = { ...state, ap: state.ap - a.ap, money: state.money - a.cost, songs: [song, ...state.songs], nextId: state.nextId + 1, seed: r.seed() }
  return { ok: true, state: withLog(s, `${writer.name} wrote "${song.title}".`) }
}

export function recordSong(state: GameState, songId: string, studioId: string): Result {
  const song = state.songs.find((x) => x.id === songId)
  const studio = getStudio(studioId)
  if (!song || song.status !== 'draft') return fail('That song is not ready to record.')
  if (!studio) return fail('Unknown studio.')
  if (studio.locked) return fail(studio.lockedNote ?? 'Locked.')
  const err = spend(state, studio.ap, studio.cost)
  if (err) return fail(err)
  const r = createRng(state.seed)
  const production = clamp(studio.production + r.int(-8, 8))
  const finalQuality = Math.round(song.quality * 0.65 + production * 0.35)
  const songs = state.songs.map((x) => (x.id === songId ? { ...x, status: 'recorded' as const, studioId, finalQuality } : x))
  const s: GameState = { ...state, ap: state.ap - studio.ap, money: state.money - studio.cost, songs, seed: r.seed() }
  return { ok: true, state: withLog(s, `Recorded "${song.title}" at ${studio.name}.`) }
}

export function releaseSong(state: GameState, songId: string): Result {
  const song = state.songs.find((x) => x.id === songId)
  if (!song || song.status !== 'recorded') return fail('Record the song first.')
  const err = spend(state, RELEASE_AP, RELEASE_COST)
  if (err) return fail(err)
  const songs = state.songs.map((x) => (x.id === songId ? { ...x, status: 'released' as const, releasedWeek: state.week } : x))
  const s: GameState = { ...state, ap: state.ap - RELEASE_AP, money: state.money - RELEASE_COST, songs }
  return { ok: true, state: withLog(s, `"${song.title}" is out! Now we wait and see.`) }
}

export const STREAM_BASE = 2000
export const MONEY_PER_STREAM = 0.01
export const FANS_PER_STREAM = 0.002

/** Streams for a released song `age` weeks after release: a hype spike and a long tail. */
export function weeklyStreams(song: Song, fans: number, age: number): number {
  const appeal = (song.finalQuality ?? song.quality) / 100
  const decay = 0.15 + 0.85 * Math.pow(0.5, age / 4)
  return STREAM_BASE * appeal * appeal * (1 + fans / 100) * decay * (age === 0 ? 1.5 : 1)
}
