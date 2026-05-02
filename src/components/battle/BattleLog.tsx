import { useEffect, useRef } from 'react'
import type { BattleLog as BattleLogType } from '../../types/battle'

interface Props {
  logs: BattleLogType[]
}

const LOG_COLOR: Record<string, string> = {
  attack: 'text-white',
  skill: 'text-purple-300',
  synergy: 'text-abyss-gold',
  item: 'text-cyan-300',
  miss: 'text-abyss-text-muted',
  critical: 'text-red-400 font-bold',
  status: 'text-yellow-300',
  system: 'text-abyss-gold/80 italic',
}

export default function BattleLog({ logs }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  return (
    <div className="abyss-panel p-2 h-36 overflow-y-auto text-xs space-y-0.5">
      {logs.map((log) => (
        <div key={log.id} className={`leading-relaxed ${LOG_COLOR[log.type] ?? 'text-white'}`}>
          {log.damage != null && <span className="text-red-400 mr-1">[-{log.damage}]</span>}
          {log.message}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  )
}
