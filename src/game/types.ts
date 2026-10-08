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

export interface Member {
  id: string
  name: string
  instrument: string
  portraitId?: string
}

export interface GameState {
  version: 1
  week: number
  money: number
  bandName: string
  genreId: string
  difficultyId: string
  members: Member[]
}

export interface NewGameOptions {
  bandName: string
  genreId: string
  founderName: string
  founderInstrument: string
  founderPortraitId?: string
  difficulty: Difficulty
}

export const newGame = (o: NewGameOptions): GameState => ({
  version: 1,
  week: 1,
  money: o.difficulty.startMoney,
  bandName: o.bandName.trim(),
  genreId: o.genreId,
  difficultyId: o.difficulty.id,
  members: [
    { id: 'founder', name: o.founderName.trim(), instrument: o.founderInstrument, portraitId: o.founderPortraitId },
  ],
})
