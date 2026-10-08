import { useMemo, useState } from 'react'
import { RELEASE_AP, RELEASE_COST, recordSong, releaseSong, writeSong } from '../../game/activities'
import { activities, studios } from '../../game/data'
import { createRng } from '../../game/rng'
import { generateTitle } from '../../game/titles'
import type { GameState, Result, Song } from '../../game/types'
import { Panel } from '../components/Panel'

interface Props { state: GameState; setState: (s: GameState) => void }

const newTitle = () => generateTitle(createRng((Math.random() * 2 ** 31) | 0))

export function SongsPanel({ state, setState }: Props) {
  const [message, setMessage] = useState('')
  const [title, setTitle] = useState(newTitle)
  const [writer, setWriter] = useState('founder')
  const [studioFor, setStudioFor] = useState<Record<string, string>>({})
  const writes = useMemo(() => activities.filter((a) => a.kind === 'write'), [])
  const act = (res: Result, wrote = false) => {
    if (res.ok) { setState(res.state); setMessage(''); if (wrote) setTitle(newTitle()) } else setMessage(res.reason)
  }

  return (
    <Panel title="Songs">
      <h3>Write a song</h3>
      <div className="stack">
        <input
          value={title}
          maxLength={60}
          aria-label="Song title"
          onChange={(e) => setTitle(e.target.value)}
          onFocus={(e) => e.currentTarget.select()}
        />
        <div className="row">
          <select value={writer} onChange={(e) => setWriter(e.target.value)} aria-label="Songwriter">
            {state.members.map((m) => <option key={m.id} value={m.id}>{m.name} (skill {Math.round(m.skill)})</option>)}
          </select>
          <button type="button" className="secondary small" onClick={() => setTitle(newTitle())}>🎲 New title</button>
        </div>
        {writes.map((w) => (
          <button key={w.id} className="card" disabled={state.ap < w.ap || state.money < w.cost} onClick={() => act(writeSong(state, w.id, writer, title), true)}>
            <strong>{w.name} · {w.ap} AP · {w.cost ? `$${w.cost}` : 'Free'}</strong>
            <span className="muted">{w.blurb}</span>
          </button>
        ))}
      </div>
      {message && <p className="error">{message}</p>}

      <h3>Your songs</h3>
      {state.songs.length === 0 && <p className="muted">No songs yet. Write one!</p>}
      <div className="stack">
        {state.songs.map((s) => (
          <SongRow key={s.id} song={s} state={state} studio={studioFor[s.id] ?? studios[0].id}
            setStudio={(id) => setStudioFor({ ...studioFor, [s.id]: id })} act={act} />
        ))}
      </div>
    </Panel>
  )
}

function SongRow({ song, state, studio, setStudio, act }: {
  song: Song; state: GameState; studio: string; setStudio: (id: string) => void; act: (r: Result) => void
}) {
  const st = studios.find((x) => x.id === studio)!
  return (
    <div className="song">
      <strong>{song.title}</strong>
      <div className="muted">
        {song.status === 'draft' && `Draft · quality ${song.quality}`}
        {song.status === 'recorded' && `Recorded · quality ${song.finalQuality}`}
        {song.status === 'released' && `Released · quality ${song.finalQuality} · ${song.totalStreams.toLocaleString()} streams (${song.lastWeekStreams.toLocaleString()} last week)`}
      </div>
      {song.status === 'draft' && (
        <div className="row">
          <select value={studio} onChange={(e) => setStudio(e.target.value)} aria-label="Studio">
            {studios.map((x) => (
              <option key={x.id} value={x.id}>{x.name} · {x.cost ? `$${x.cost}` : 'contract'} · {x.ap} AP{x.locked ? ' 🔒' : ''}</option>
            ))}
          </select>
          <button className="small" disabled={!!st.locked || state.ap < st.ap || state.money < st.cost} onClick={() => act(recordSong(state, song.id, studio))}>Record</button>
        </div>
      )}
      {song.status === 'recorded' && (
        <button className="small" disabled={state.ap < RELEASE_AP || state.money < RELEASE_COST} onClick={() => act(releaseSong(state, song.id))}>
          Release single · {RELEASE_AP} AP · ${RELEASE_COST}
        </button>
      )}
    </div>
  )
}
