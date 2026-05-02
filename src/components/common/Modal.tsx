import type { ReactNode } from 'react'

interface Props {
  isOpen: boolean
  title?: string
  onClose?: () => void
  children: ReactNode
}

export default function Modal({ isOpen, title, onClose, children }: Props) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 animate-fade-in">
      <div className="abyss-panel w-full max-w-md p-6 animate-slide-up">
        {title && (
          <div className="flex items-center justify-between mb-4 border-b border-abyss-purple/40 pb-2">
            <h2 className="text-abyss-gold font-bold text-lg">{title}</h2>
            {onClose && (
              <button onClick={onClose} className="text-abyss-text-muted hover:text-abyss-gold transition-colors text-xl leading-none">
                ×
              </button>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
