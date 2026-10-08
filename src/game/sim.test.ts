import { describe, expect, it } from 'vitest'
import { advanceWeek, weekOfYear, yearOf } from './sim'
import { newGame } from './types'
import { difficulties } from './data'

const make = (i = 1) =>
  newGame({
    bandName: ' Test Band ',
    genreId: 'rock',
    founderName: 'Viper',
    founderInstrument: 'guitar',
    difficulty: difficulties[i],
  })

describe('newGame', () => {
  it('uses difficulty starting money and trims names', () => {
    expect(make(0).money).toBeGreaterThan(make(2).money)
    expect(make().bandName).toBe('Test Band')
    expect(make().members).toHaveLength(1)
  })
})

describe('advanceWeek', () => {
  it('increments the week without mutating', () => {
    const s = make()
    expect(advanceWeek(s).week).toBe(2)
    expect(s.week).toBe(1)
  })
  it('computes year and week of year', () => {
    expect(yearOf(1)).toBe(1)
    expect(yearOf(53)).toBe(2)
    expect(weekOfYear(53)).toBe(1)
  })
})
