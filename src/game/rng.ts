/** Small seeded RNG (mulberry32). Seed lives in GameState so saves are reproducible. */
export interface Rng {
  next(): number
  int(min: number, max: number): number
  pick<T>(arr: readonly T[]): T
  weighted(weights: readonly number[]): number
  seed(): number
}

export function createRng(seed: number): Rng {
  let a = seed >>> 0
  const next = () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  return {
    next,
    int: (min, max) => Math.floor(next() * (max - min + 1)) + min,
    pick: (arr) => arr[Math.floor(next() * arr.length)],
    weighted(weights) {
      const total = weights.reduce((s, w) => s + w, 0)
      let roll = next() * total
      for (let i = 0; i < weights.length; i++) {
        roll -= weights[i]
        if (roll < 0) return i
      }
      return weights.length - 1
    },
    seed: () => a,
  }
}
