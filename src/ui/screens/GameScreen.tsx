import { getDifficulty, getGenre } from '../../game/data'
import { advanceWeek, weekOfYear, yearOf } from '../../game/sim'
import type { GameState } from '../../game/types'
import { Panel } from '../components/Panel'
import { LogPanel } from '../panels/LogPanel'
import { RecruitPanel } from '../panels/RecruitPanel'
import { RosterPanel } from '../panels/RosterPanel'

interface Props { state: GameState; setState: (s: GameState) => void; onQuit: () => void }

export function GameScreen({ state, setState, onQuit }: Props) {
  return (
    <main className="app">
      <header className="topbar">
        <div>
          <h1>{state.bandName}</h1>
          <div className="muted">{getGenre(state.genreId)?.name} · {getDifficulty(state.difficultyId)?.name}</div>
        </div>
        <button className="secondary" onClick={onQuit}>Menu</button>
      </header>
      <div className="grid">
        <Panel title="Calendar">
          <p>Year {yearOf(state.week)}, Week {weekOfYear(state.week)}</p>
          <p>Cash: <strong>${state.money}</strong></p>
          <button onClick={() => setState(advanceWeek(state))}>Next week</button>
        </Panel>
        <RosterPanel state={state} setState={setState} />
        <RecruitPanel state={state} setState={setState} />
        <LogPanel state={state} />
      </div>
    </main>
  )
}
