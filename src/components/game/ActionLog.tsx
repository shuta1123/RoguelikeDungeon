import { useEffect, useRef } from 'react'

interface Props {
  logs: string[]
}

export default function ActionLog({ logs }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  return (
    <div className="abyss-panel p-2 h-full overflow-y-auto text-xs space-y-0.5">
      <div className="text-abyss-text-dim text-xs mb-1 border-b border-abyss-purple/20 pb-1">行動ログ</div>
      {logs.map((msg, i) => (
        <div key={i} className="text-abyss-text-muted leading-relaxed">
          {msg}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  )
}
