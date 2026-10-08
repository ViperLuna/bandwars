interface Props { hasSave: boolean; onContinue: () => void; onNew: () => void }

export function Title({ hasSave, onContinue, onNew }: Props) {
  return (
    <div className="screen center">
      <h1 className="logo">Band Wars</h1>
      <p className="muted">Start a band. Write the songs. Take over the charts.</p>
      <div className="stack">
        {hasSave && <button onClick={onContinue}>Continue</button>}
        <button className={hasSave ? 'secondary' : ''} onClick={onNew}>New Game</button>
      </div>
    </div>
  )
}
