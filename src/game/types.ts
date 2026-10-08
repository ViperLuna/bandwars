export interface Genre {
  id: string
  name: string
  instruments: string[]
  minMembers: number
  maxMembers: number
}

export interface Difficulty {
  id: string
  name: string
  blurb: string
  startMoney: number
  /** Multiplier on AI band stats. */
  rivalStrength: number
  /** Share (0-1) of AI bands that produce chart-competitive music. */
  rivalCompetitiveShare: number
}

export interface Rarity {
  id: string
  name: string
  skillMin: number
  skillMax: number
  salaryMin: number
  salaryMax: number
  color: string
}

export interface RecruitMethod {
  id: string
  name: string
  blurb: string
  cost: number
  count: number
  /** Odds per rarity, in the order of rarities.json. */
  weights: number[]
}

export interface Personality {
  id: string
  name: string
  quitMod: number
  dramaChance: number
  dramaMood: number
  dramaText: string
}

export interface Member {
  id: string
  name: string
  instrument: string
  portraitId?: string
  skill: number
  rarity: string
  personality: string
  /** 0-100. Low mood means quitting risk. */
  mood: number
  /** Paid weekly. */
  salary: number
}

export interface LogEntry {
  week: number
  text: string
}

export interface GameState {
  version: 2
  week: number
  money: number
  bandName: string
  genreId: string
  difficultyId: string
  members: Member[]
  /** Recruits from this week's search. Gone when the week ends. */
  candidates: Member[]
  /** One search per week. */
  searched: boolean
  log: LogEntry[]
  seed: number
  nextId: number
}

export interface NewGameOptions {
  bandName: string
  genreId: string
  founderName: string
  founderInstrument: string
  founderPortraitId?: string
  difficulty: Difficulty
  seed?: number
}

export type Result = { ok: true; state: GameState } | { ok: false; reason: string }

export const newGame = (o: NewGameOptions): GameState => ({
  version: 2,
  week: 1,
  money: o.difficulty.startMoney,
  bandName: o.bandName.trim(),
  genreId: o.genreId,
  difficultyId: o.difficulty.id,
  members: [
    {
      id: 'founder',
      name: o.founderName.trim(),
      instrument: o.founderInstrument,
      portraitId: o.founderPortraitId,
      skill: 30,
      rarity: 'common',
      personality: 'steady',
      mood: 80,
      salary: 0,
    },
  ],
  candidates: [],
  searched: false,
  log: [{ week: 1, text: `${o.bandName.trim()} is born. Time to make some noise.` }],
  seed: o.seed ?? (Date.now() & 0x7fffffff),
  nextId: 1,
})
