import { useEffect, useState } from 'react'

export type PopupType = 'damage-monster' | 'damage-player' | 'heal' | 'miss' | 'critical'

export interface PopupEntry {
  id: string
  value: string
  type: PopupType
  offsetX: number
}

interface Props {
  entries: PopupEntry[]
}

const TYPE_STYLE: Record<PopupType, string> = {
  'damage-monster': 'text-red-400 text-2xl font-bold',
  'damage-player':  'text-orange-300 text-xl font-bold',
  'heal':           'text-green-400 text-xl font-bold',
  'miss':           'text-abyss-text-muted text-base italic',
  'critical':       'text-yellow-300 text-3xl font-black',
}

function PopupItem({ entry, onDone }: { entry: PopupEntry; onDone: () => void }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => { setVisible(false); setTimeout(onDone, 200) }, 900)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <span
      className={`
        absolute pointer-events-none select-none font-mono drop-shadow-lg
        ${TYPE_STYLE[entry.type]}
        transition-all duration-200
      `}
      style={{
        left: `calc(50% + ${entry.offsetX}px)`,
        bottom: visible ? '60%' : '80%',
        opacity: visible ? 1 : 0,
        transform: 'translateX(-50%)',
        textShadow: entry.type === 'critical' ? '0 0 12px rgba(253,224,71,0.8)' : '0 2px 4px rgba(0,0,0,0.8)',
        transition: 'bottom 0.9s ease-out, opacity 0.2s ease-in',
      }}
    >
      {entry.type === 'damage-monster' || entry.type === 'damage-player' ? `-${entry.value}` : entry.value}
    </span>
  )
}

export default function DamagePopup({ entries }: Props) {
  const [active, setActive] = useState<PopupEntry[]>([])

  useEffect(() => {
    if (entries.length === 0) return
    const latest = entries[entries.length - 1]
    setActive((prev) => [...prev, latest])
  }, [entries])

  const remove = (id: string) => setActive((prev) => prev.filter((e) => e.id !== id))

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {active.map((entry) => (
        <PopupItem key={entry.id} entry={entry} onDone={() => remove(entry.id)} />
      ))}
    </div>
  )
}
