import genresJson from '../data/genres.json'
import difficultiesJson from '../data/difficulties.json'
import raritiesJson from '../data/rarities.json'
import recruitmentJson from '../data/recruitment.json'
import personalitiesJson from '../data/personalities.json'
import namesJson from '../data/names.json'
import type { Difficulty, Genre, Personality, Rarity, RecruitMethod } from './types'

export const genres = genresJson as Genre[]
export const difficulties = difficultiesJson as Difficulty[]
export const rarities = raritiesJson as Rarity[]
export const recruitMethods = recruitmentJson as RecruitMethod[]
export const personalities = personalitiesJson as Personality[]
export const names = namesJson as { first: string[]; last: string[] }

export const getGenre = (id: string) => genres.find((g) => g.id === id)
export const getDifficulty = (id: string) => difficulties.find((d) => d.id === id)
export const getRarity = (id: string) => rarities.find((r) => r.id === id)!
export const getMethod = (id: string) => recruitMethods.find((m) => m.id === id)
export const getPersonality = (id: string) => personalities.find((p) => p.id === id)!
