import { describe, expect, it } from 'vitest'
import { fire, hire, search } from './band'
import { difficulties } from './data'
import { createRng } from './rng'
import { advanceWeek } from './sim'
import { newGame } from './types'

const make = (money?: number, seed = 42) => {
  const s = newGame({ bandName: 'T', genreId: 'rock', founderName: 'V', founderInstrument: 'guitar', difficulty: difficulties[1], seed })
  return money === undefined ? s : { ...s, money }
}

describe('rng', () => {
  it('is deterministic', () => {
    expect(createRng(1).next()).toBe(createRng(1).next())
  })
})

describe('search', () => {
  it('costs money, yields candidates, and is limited to once per week', () => {
    const r = search(make(1000), 'flyers')
    expect(r.ok && r.state.money).toBe(960)
    if (!r.ok) throw new Error()
    expect(r.state.candidates).toHaveLength(3)
    expect(search(r.state, 'flyers').ok).toBe(false)
    expect(advanceWeek(r.state).searched).toBe(false)
    expect(advanceWeek(r.state).candidates).toHaveLength(0)
  })
  it('rejects when too poor', () => {
    expect(search(make(10), 'local-scout').ok).toBe(false)
  })
  it('free search works with no money', () => {
    expect(search(make(0), 'word-of-mouth').ok).toBe(true)
  })
  it('industry scouts never return commons', () => {
    for (let seed = 1; seed < 40; seed++) {
      const r = search(make(5000, seed), 'industry')
      if (!r.ok) throw new Error()
      expect(r.state.candidates.every((c) => c.rarity !== 'common')).toBe(true)
    }
  })
})

describe('hire / fire', () => {
  it('hires a candidate and fires them', () => {
    const r = search(make(), 'word-of-mouth')
    if (!r.ok) throw new Error()
    const h = hire(r.state, r.state.candidates[0].id)
    if (!h.ok) throw new Error()
    expect(h.state.members).toHaveLength(2)
    expect(h.state.candidates).toHaveLength(2)
    const f = fire(h.state, h.state.members[1].id)
    expect(f.ok && f.state.members).toHaveLength(1)
  })
  it('cannot fire the founder or exceed max members', () => {
    expect(fire(make(), 'founder').ok).toBe(false)
    let s = make(5000)
    for (let i = 0; i < 10; i++) {
      const r = search({ ...s, searched: false }, 'flyers')
      if (!r.ok) throw new Error()
      const h = hire(r.state, r.state.candidates[0].id)
      if (!h.ok) { expect(s.members).toHaveLength(6); return }
      s = h.state
    }
    throw new Error('expected band to fill up')
  })
})

describe('advanceWeek economy and quitting', () => {
  it('pays salaries and adds placeholder income', () => {
    let s = make(1000)
    const r = search(s, 'word-of-mouth')
    if (!r.ok) throw new Error()
    const h = hire(r.state, r.state.candidates[0].id)
    if (!h.ok) throw new Error()
    s = h.state
    const salary = s.members[1].salary
    expect(advanceWeek(s).money).toBe(s.money + 60 - salary)
  })
  it('unhappy members eventually quit', () => {
    let s = make(0)
    const r = search(s, 'word-of-mouth')
    if (!r.ok) throw new Error()
    const h = hire(r.state, r.state.candidates[0].id)
    if (!h.ok) throw new Error()
    s = { ...h.state, money: 0, members: h.state.members.map((m) => (m.id === 'founder' ? m : { ...m, salary: 9999 })) }
    for (let i = 0; i < 60 && s.members.length > 1; i++) s = advanceWeek(s)
    expect(s.members).toHaveLength(1)
  })
})
