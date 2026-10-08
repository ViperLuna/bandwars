import portraits from '../../data/portraits.json'

interface PortraitEntry { id: string; file: string }

interface Props { id?: string; name: string; size?: number }

const hue = (s: string) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 360, 7)

/** Shows the real image if registered in portraits.json, else a name-seeded placeholder. */
export function Portrait({ id, name, size = 64 }: Props) {
  const entry = (portraits as PortraitEntry[]).find((p) => p.id === id)
  if (entry) {
    return <img className="portrait" src={`portraits/${entry.file}`} alt={name} width={size} height={size} />
  }
  const initials = name.split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase()
  return (
    <div className="portrait" style={{ width: size, height: size, background: `hsl(${hue(name)} 55% 45%)`, fontSize: size * 0.4 }} aria-label={name}>
      {initials}
    </div>
  )
}
