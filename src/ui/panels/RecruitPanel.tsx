import { useState } from 'react'
import { hire, search } from '../../game/band'
import { rarities, recruitMethods } from '../../game/data'
import type { GameState } from '../../game/types'
import { MemberCard } from '../components/MemberCard'
import { Panel } from '../components/Panel'

interface Props { state: GameState; setState: (s: GameState) => void }

const odds = (weights: number[]) => {
  const total = weights.reduce((a, b) => a + b, 0)
  return weights.map((w, i) => (w ? `${rarities[i].name} ${Math.round((w / total) * 100)}%` : null)).filter(Boolean).join(' · ')
}

export function RecruitPanel({ state, setState }: Props) {
  const [message, setMessage] = useState('')
  const act = (res: ReturnType<typeof search>) => {
    if (res.ok) { setState(res.state); setMessage('') } else setMessage(res.reason)
  }
  return (
    <Panel title="Recruit">
      <p className="muted">One search per week. Recruits you don't hire leave when the week ends.</p>
      <div className="stack">
        {recruitMethods.map((m) => (
          <button
            key={m.id}
            className="card"
            disabled={state.searched || state.money < m.cost}
            onClick={() => act(search(state, m.id))}
          >
            <strong>{m.name} · {m.cost ? `$${m.cost}` : 'Free'}</strong>
            <span className="muted">{m.blurb}</span>
            <span className="muted small-text">{m.count} recruits · {odds(m.weights)}</span>
          </button>
        ))}
      </div>
      {message && <p className="error">{message}</p>}
      {state.candidates.length > 0 && (
        <>
          <h3>This week's recruits</h3>
          <div className="stack">
            {state.candidates.map((c) => (
              <MemberCard key={c.id} member={c} actions={
                <button className="small" onClick={() => act(hire(state, c.id))}>Hire</button>
              } />
            ))}
          </div>
        </>
      )}
      {state.searched && state.candidates.length === 0 && <p className="muted">Everyone's been hired. Nice.</p>}
    </Panel>
  )
}
