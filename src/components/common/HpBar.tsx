interface Props {
  current: number
  max: number
  label?: string
  color?: 'hp' | 'mp'
  className?: string
}

export default function HpBar({ current, max, label, color = 'hp', className = '' }: Props) {
  const pct = max > 0 ? Math.max(0, Math.min(100, (current / max) * 100)) : 0
  const barColor = color === 'hp'
    ? pct > 50 ? 'bg-green-600' : pct > 25 ? 'bg-yellow-500' : 'bg-red-600'
    : 'bg-blue-500'

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between text-xs text-abyss-text-muted mb-0.5">
          <span>{label}</span>
          <span>{current}/{max}</span>
        </div>
      )}
      <div className="w-full h-2 bg-black/60 border border-white/10 rounded-sm overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
