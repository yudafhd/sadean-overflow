"use client"
import React from 'react'
import { cn } from '@/folderly/components/ui'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon' | 'floating' | 'outline' | 'dangerOutline'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({ variant = 'primary', size = 'md', className, children, ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center gap-2 font-medium transition focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed'
  const sizes = {
    sm: 'h-9 px-3 rounded-[12px] text-sm',
    md: 'h-10 px-4 rounded-[16px] text-sm',
    lg: 'h-12 px-5 rounded-[16px] text-base',
  }[size]

  const variants = {
    primary: 'bg-[var(--color-primary)] text-[var(--slate)] shadow-[var(--shadow-sm)] hover:brightness-95 active:brightness-90 focus:ring-2 focus:ring-[var(--blue)]',
    secondary: 'bg-[var(--color-secondary)] text-[var(--slate)] shadow-[var(--shadow-sm)] hover:brightness-95 active:brightness-90 focus:ring-2 focus:ring-[var(--lavender)]',
    ghost: 'bg-transparent border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--gray)]/30 focus:ring-2 focus:ring-[var(--lavender)]',
    icon: 'w-10 h-10 rounded-[16px] border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--gray)]/30 focus:ring-2 focus:ring-[var(--blue)]',
    floating: 'w-14 h-14 rounded-full bg-[var(--color-accent)] text-[var(--slate)] shadow-[var(--shadow-lg)] hover:brightness-95 active:brightness-90 focus:ring-2 focus:ring-[var(--pink)]',
    outline: 'bg-white border-2 border-[color:var(--color-text)] text-[var(--color-text)] rounded-[16px] hover:bg-[var(--gray)]/20 focus:ring-2 focus:ring-[var(--lavender)]',
    dangerOutline: 'bg-white border-2 border-[var(--color-danger)] text-[var(--color-danger)] rounded-[16px] hover:bg-[var(--red)]/40 focus:ring-2 focus:ring-[var(--color-danger)]/40',
  }[variant]

  return (
    <button className={cn(base, sizes, variants, className)} {...props}>
      {children}
    </button>
  )
}
