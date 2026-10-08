import { describe, expect, it } from 'vitest'
import { advanceWeek } from './sim'
import { newGame } from './types'

describe('advanceWeek', () => {
  it('increments the week without mutating', () => {
    const s = newGame('Test Band')
    const next = advanceWeek(s)
    expect(next.week).toBe(2)
    expect(s.week).toBe(1)
  })
})
