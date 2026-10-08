import { useState } from 'react'
import { genres, getGenre } from '../../game/data'
import { Portrait } from '../components/Portrait'

export interface BandChoice {
  bandName: string
  genreId: string
  founderName: string
  founderInstrument: string
}

interface Props { onNext: (c: BandChoice) => void; onBack: () => void }

export function CreateBand({ onNext, onBack }: Props) {
  const [bandName, setBandName] = useState('')
  const [genreId, setGenreId] = useState(genres[0].id)
  const [founderName, setFounderName] = useState('')
  const instruments = getGenre(genreId)!.instruments
  const [instrument, setInstrument] = useState(instruments[0])
  const founderInstrument = instruments.includes(instrument) ? instrument : instruments[0]
  const valid = bandName.trim() !== '' && founderName.trim() !== ''

  return (
    <form className="screen narrow" onSubmit={(e) => { e.preventDefault(); if (valid) onNext({ bandName, genreId, founderName, founderInstrument }) }}>
      <h1>Form Your Band</h1>
      <div className="row">
        <Portrait name={founderName || '?'} size={72} />
        <p className="muted">Face picker coming soon.</p>
      </div>
      <label>Band name
        <input value={bandName} maxLength={40} onChange={(e) => setBandName(e.target.value)} placeholder="e.g. The Placeholders" />
      </label>
      <label>Genre
        <select value={genreId} onChange={(e) => setGenreId(e.target.value)}>
          {genres.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
        </select>
      </label>
      <label>Your name (founder)
        <input value={founderName} maxLength={30} onChange={(e) => setFounderName(e.target.value)} />
      </label>
      <label>You play
        <select value={founderInstrument} onChange={(e) => setInstrument(e.target.value)}>
          {instruments.map((i) => <option key={i} value={i}>{i}</option>)}
        </select>
      </label>
      <div className="row">
        <button type="button" className="secondary" onClick={onBack}>Back</button>
        <button type="submit" disabled={!valid}>Next</button>
      </div>
    </form>
  )
}
