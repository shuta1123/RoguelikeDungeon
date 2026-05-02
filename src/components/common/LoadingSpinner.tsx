interface Props {
  size?: 'sm' | 'md' | 'lg'
  message?: string
}

const sizeClass = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' }

export default function LoadingSpinner({ size = 'md', message }: Props) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`${sizeClass[size]} border-2 border-abyss-purple/40 border-t-abyss-gold rounded-full animate-spin`} />
      {message && <p className="text-abyss-text-muted text-sm">{message}</p>}
    </div>
  )
}
