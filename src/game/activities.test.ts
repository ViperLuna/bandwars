import { describe, expect, it } from 'vitest'
import { doActivity, recordSong, releaseSong, weeklyStreams, writeSong } from './activities'
import { difficulties } from './data'
import { advanceWeek } from './sim'
import { newGame } from './types'
import type { GameState } from './types'

const make = (money = 1000): GameState => ({
  ...newGame({ bandName: 'T', genreId: 'rock', founderName: 'V', founderInstrument: 'guitar', difficulty: difficulties[1], seed: 5 }),
  money,
})
const ok = (r: { ok: boolean } & Record<string, unknown>) => { if (!r.ok) throw new Error(String(r.reason)); return r.state as GameState }

describe('activities', () => {
  it('spends AP and money, and resets AP each week', () => {
    const s = ok(doActivity(make(), 'rehearse'))
    expect(s.ap).toBe(5)
    expect(s.money).toBe(985)
    expect(advanceWeek(s).ap).toBe(6)
  })
  it('refuses when out of AP or money', () => {
    expect(doActivity({ ...make(), ap: 0 }, 'jam').ok).toBe(false)
    expect(doActivity(make(0), 'rehearse').ok).toBe(false)
  })
  it('practice raises skill with diminishing returns', () => {
    const s = ok(doActivity(make(), 'rehearse'))
    expect(s.members[0].skill).toBeGreaterThan(30)
    expect(s.members[0].skill).toBeLessThan(31)
  })
})

describe('songs', () => {
  it('write, record, release, then earn streams', () => {
    let s = ok(writeSong(make(), 'write-song', 'founder', 'Test Song'))
    expect(s.songs[0].status).toBe('draft')
    expect(writeSong(make(), 'write-song', 'founder', '  ').ok).toBe(false)
    s = ok(recordSong(s, s.songs[0].id, 'basement'))
    expect(s.songs[0].finalQuality).toBeGreaterThan(0)
    s = ok(releaseSong(s, s.songs[0].id))
    const money = s.money
    const next = advanceWeek(s)
    expect(next.songs[0].totalStreams).toBeGreaterThan(0)
    expect(next.money).toBeGreaterThan(money)
  })
  it('locked studio cannot be used; better studio yields higher quality on average', () => {
    const s = ok(writeSong(make(), 'write-song', 'founder', 'X'))
    expect(recordSong(s, s.songs[0].id, 'label').ok).toBe(false)
    const avg = (studio: string) => {
      let t = 0
      for (let seed = 1; seed <= 30; seed++) {
        const w = ok(writeSong({ ...make(5000), seed }, 'write-song', 'founder', 'X'))
        t += ok(recordSong(w, w.songs[0].id, studio)).songs[0].finalQuality!
      }
      return t / 30
    }
    expect(avg('pro')).toBeGreaterThan(avg('basement'))
  })
  it('stream curve has a hype spike and a long tail', () => {
    const song = { finalQuality: 60, quality: 60 } as Parameters<typeof weeklyStreams>[0]
    expect(weeklyStreams(song, 0, 0)).toBeGreaterThan(weeklyStreams(song, 0, 1))
    expect(weeklyStreams(song, 0, 40)).toBeGreaterThan(0)
  })
})
