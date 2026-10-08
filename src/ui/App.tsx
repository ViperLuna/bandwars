import { useEffect, useState } from 'react'
import { backend } from '../game/storage'
import { newGame } from '../game/types'
import type { GameState } from '../game/types'
import { ChooseDifficulty } from './screens/ChooseDifficulty'
import { CreateBand } from './screens/CreateBand'
import type { BandChoice } from './screens/CreateBand'
import { GameScreen } from './screens/GameScreen'
import { Title } from './screens/Title'

type Screen = 'title' | 'create' | 'difficulty' | 'game'

export function App() {
  const [screen, setScreen] = useState<Screen>('title')
  const [state, setState] = useState<GameState | null>(null)
  const [saved, setSaved] = useState<GameState | null>(null)
  const [choice, setChoice] = useState<BandChoice | null>(null)

  useEffect(() => { backend.load().then(setSaved) }, [])
  useEffect(() => { if (state) { backend.save(state); setSaved(state) } }, [state])

  if (screen === 'game' && state) {
    return <GameScreen state={state} setState={setState} onQuit={() => setScreen('title')} />
  }
  if (screen === 'create') {
    return <CreateBand onBack={() => setScreen('title')} onNext={(c) => { setChoice(c); setScreen('difficulty') }} />
  }
  if (screen === 'difficulty' && choice) {
    return (
      <ChooseDifficulty
        onBack={() => setScreen('create')}
        onStart={(difficulty) => { setState(newGame({ ...choice, difficulty })); setScreen('game') }}
      />
    )
  }
  return (
    <Title
      hasSave={!!saved}
      onContinue={() => { setState(saved); setScreen('game') }}
      onNew={() => setScreen('create')}
    />
  )
}
