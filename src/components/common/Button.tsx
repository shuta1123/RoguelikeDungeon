import type { ButtonHTMLAttributes } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

const variantClass: Record<NonNullable<Props['variant']>, string> = {
  primary: 'bg-abyss-gold/20 border-abyss-gold text-abyss-gold hover:bg-abyss-gold/30',
  secondary: 'bg-abyss-purple/20 border-abyss-purple-light text-abyss-purple-light hover:bg-abyss-purple/30',
  danger: 'bg-abyss-red/20 border-abyss-red text-red-400 hover:bg-abyss-red/30',
  ghost: 'bg-transparent border-transparent text-abyss-text-muted hover:text-abyss-gold',
}

const sizeClass: Record<NonNullable<Props['size']>, string> = {
  sm: 'px-3 py-1 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

export default function Button({ variant = 'primary', size = 'md', className = '', children, ...rest }: Props) {
  return (
    <button
      className={`border font-mono transition-colors duration-150 rounded disabled:opacity-40 disabled:cursor-not-allowed ${variantClass[variant]} ${sizeClass[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
