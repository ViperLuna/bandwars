import { useState } from 'react'
import { doActivity } from '../../game/activities'
import { activities } from '../../game/data'
import type { GameState, Result } from '../../game/types'
import { Panel } from '../components/Panel'

interface Props { state: GameState; setState: (s: GameState) => void }

export function ActivitiesPanel({ state, setState }: Props) {
  const [message, setMessage] = useState('')
  const [lessonTarget, setLessonTarget] = useState('founder')
  const act = (res: Result) => { if (res.ok) { setState(res.state); setMessage('') } else setMessage(res.reason) }
  return (
    <Panel title="Activities">
      <p className="muted">Spend your action points however you like: <strong>{state.ap}</strong> left this week.</p>
      <div className="stack">
        {activities.filter((a) => a.kind !== 'write').map((a) => (
          <div key={a.id}>
            <button
              className="card full"
              disabled={state.ap < a.ap || state.money < a.cost}
              onClick={() => act(doActivity(state, a.id, a.kind === 'lessons' ? lessonTarget : undefined))}
            >
              <strong>{a.name} · {a.ap} AP · {a.cost ? `$${a.cost}` : 'Free'}</strong>
              <span className="muted">{a.blurb}</span>
            </button>
            {a.kind === 'lessons' && (
              <select value={lessonTarget} onChange={(e) => setLessonTarget(e.target.value)} aria-label="Lesson student">
                {state.members.map((m) => <option key={m.id} value={m.id}>{m.name} ({m.instrument})</option>)}
              </select>
            )}
          </div>
        ))}
      </div>
      {message && <p className="error">{message}</p>}
    </Panel>
  )
}
