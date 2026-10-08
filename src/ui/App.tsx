import { useState } from 'react'
import { advanceWeek } from '../game/sim'
import { newGame } from '../game/types'
import { Panel } from './components/Panel'
import { Portrait } from './components/Portrait'

export function App() {
  const [state, setState] = useState(() => newGame('The Placeholders'))
  return (
    <main className="app">
      <h1>Band Wars</h1>
      <div className="grid">
        <Panel title="Your Band">
          <div className="row">
            <Portrait name={state.bandName} />
            <div>
              <strong>{state.bandName}</strong>
              <div>Week {state.week} · ${state.money}</div>
            </div>
          </div>
        </Panel>
        <Panel title="Calendar">
          <button onClick={() => setState(advanceWeek(state))}>Next week</button>
        </Panel>
      </div>
    </main>
  )
}
