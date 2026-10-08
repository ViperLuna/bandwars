import { useState } from 'react'
import { difficulties } from '../../game/data'
import type { Difficulty } from '../../game/types'

interface Props { onStart: (d: Difficulty) => void; onBack: () => void }

export function ChooseDifficulty({ onStart, onBack }: Props) {
  const [id, setId] = useState('normal')
  const chosen = difficulties.find((d) => d.id === id)!
  return (
    <div className="screen narrow">
      <h1>Choose Difficulty</h1>
      <div className="stack">
        {difficulties.map((d) => (
          <button key={d.id} type="button" className={`card ${d.id === id ? 'selected' : ''}`} onClick={() => setId(d.id)}>
            <strong>{d.name}</strong>
            <span className="muted">{d.blurb}</span>
            <span className="muted">Starting cash: ${d.startMoney}</span>
          </button>
        ))}
      </div>
      <div className="row">
        <button type="button" className="secondary" onClick={onBack}>Back</button>
        <button type="button" onClick={() => onStart(chosen)}>Start the Band</button>
      </div>
    </div>
  )
}
