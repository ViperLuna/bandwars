import { getDifficulty, getGenre } from '../../game/data'
import { advanceWeek, weekOfYear, yearOf } from '../../game/sim'
import type { GameState } from '../../game/types'
import { Panel } from '../components/Panel'
import { Portrait } from '../components/Portrait'

interface Props { state: GameState; setState: (s: GameState) => void; onQuit: () => void }

export function GameScreen({ state, setState, onQuit }: Props) {
  return (
    <main className="app">
      <header className="topbar">
        <h1>{state.bandName}</h1>
        <button className="secondary" onClick={onQuit}>Menu</button>
      </header>
      <div className="grid">
        <Panel title="Band">
          <div className="muted">{getGenre(state.genreId)?.name} · {getDifficulty(state.difficultyId)?.name}</div>
          <div className="stack">
            {state.members.map((m) => (
              <div className="row" key={m.id}>
                <Portrait id={m.portraitId} name={m.name} />
                <div><strong>{m.name}</strong><div className="muted">{m.instrument}{m.id === 'founder' ? ' · founder' : ''}</div></div>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Calendar">
          <p>Year {yearOf(state.week)}, Week {weekOfYear(state.week)}</p>
          <p>Cash: <strong>${state.money}</strong></p>
          <button onClick={() => setState(advanceWeek(state))}>Next week</button>
        </Panel>
      </div>
    </main>
  )
}
