import { getGenre } from '../../game/data'
import { fire } from '../../game/band'
import type { GameState } from '../../game/types'
import { MemberCard } from '../components/MemberCard'
import { Panel } from '../components/Panel'

interface Props { state: GameState; setState: (s: GameState) => void }

export function RosterPanel({ state, setState }: Props) {
  const genre = getGenre(state.genreId)!
  return (
    <Panel title={`Band (${state.members.length}/${genre.maxMembers})`}>
      <div className="stack">
        {state.members.map((m) => (
          <MemberCard
            key={m.id}
            member={m}
            showMood={m.id !== 'founder'}
            actions={m.id !== 'founder' && (
              <button className="secondary small" onClick={() => {
                if (!window.confirm(`Fire ${m.name}?`)) return
                const res = fire(state, m.id)
                if (res.ok) setState(res.state)
              }}>Fire</button>
            )}
          />
        ))}
      </div>
    </Panel>
  )
}
