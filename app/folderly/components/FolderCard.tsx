"use client"
import React from 'react'
import { cn } from '@/folderly/components/ui'

type Color = 'pink' | 'blue' | 'lavender' | 'butter' | 'mint'

export function FolderCard({
  title,
  count,
  color = 'pink',
  className,
  onClick,
}: {
  title: string
  count?: number
  color?: Color
  className?: string
  onClick?: () => void
}) {
  const bg = {
    pink: 'bg-[var(--pink)] text-[var(--slate)]',
    blue: 'bg-[var(--blue)] text-[var(--slate)]',
    lavender: 'bg-[var(--lavender)] text-[var(--slate)]',
    butter: 'bg-[var(--butter)] text-[var(--slate)]',
    mint: 'bg-[var(--mint)] text-[var(--slate)]',
  }[color]

  return (
    <button onClick={onClick} className={cn('folder-card p-4 text-left', bg, className)}>
      <div className="text-xs opacity-70">Folder</div>
      <div className="mt-1 font-semibold">{title}</div>
      {typeof count === 'number' && (
        <div className="mt-2 inline-flex px-2 py-1 rounded-full bg-white/60 text-xs">{count} items</div>
      )}
    </button>
  )}

