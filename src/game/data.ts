import genresJson from '../data/genres.json'
import difficultiesJson from '../data/difficulties.json'
import type { Difficulty, Genre } from './types'

export const genres = genresJson as Genre[]
export const difficulties = difficultiesJson as Difficulty[]

export const getGenre = (id: string) => genres.find((g) => g.id === id)
export const getDifficulty = (id: string) => difficulties.find((d) => d.id === id)
