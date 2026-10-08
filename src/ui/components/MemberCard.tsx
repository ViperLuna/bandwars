import type { ReactNode } from 'react'
import { getPersonality, getRarity } from '../../game/data'
import type { Member } from '../../game/types'
import { Portrait } from './Portrait'

interface Props { member: Member; showMood?: boolean; actions?: ReactNode }

export function MemberCard({ member: m, showMood, actions }: Props) {
  const rarity = getRarity(m.rarity)
  const moodColor = m.mood >= 60 ? '#4ade80' : m.mood >= 40 ? '#fbbf24' : '#f87171'
  return (
    <div className="member" style={{ borderColor: rarity.color }}>
      <Portrait id={m.portraitId} name={m.name} size={52} />
      <div className="member-info">
        <strong>{m.name}</strong>
        <div className="muted">
          <span style={{ color: rarity.color }}>{rarity.name}</span> {m.instrument} · {getPersonality(m.personality).name}
        </div>
        <div className="muted">Skill {m.skill} · {m.salary ? `$${m.salary}/wk` : 'founder'}</div>
        {showMood && (
          <div className="mood" title={`Mood ${m.mood}`}><div style={{ width: `${m.mood}%`, background: moodColor }} /></div>
        )}
      </div>
      {actions}
    </div>
  )
}
