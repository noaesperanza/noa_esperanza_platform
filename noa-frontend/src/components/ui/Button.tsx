import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
}

export function Button({ className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`bg-rose-600 hover:bg-rose-700 text-white font-medium py-2 px-6 rounded-2xl shadow-md transition-all ${className}`}
      {...props}
    />
  )
}
