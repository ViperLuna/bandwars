import { yearOf, weekOfYear } from '../../game/sim'
import type { GameState } from '../../game/types'
import { Panel } from '../components/Panel'

export function LogPanel({ state }: { state: GameState }) {
  return (
    <Panel title="News">
      <ul className="log">
        {state.log.map((e, i) => (
          <li key={i}><span className="muted">Y{yearOf(e.week)} W{weekOfYear(e.week)}</span> {e.text}</li>
        ))}
      </ul>
    </Panel>
  )
}
