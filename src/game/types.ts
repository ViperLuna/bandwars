export interface Genre {
  id: string
  name: string
  instruments: string[]
  minMembers: number
  maxMembers: number
}

export interface GameState {
  week: number
  money: number
  bandName: string
}

export const newGame = (bandName: string): GameState => ({
  week: 1,
  money: 500,
  bandName,
})
