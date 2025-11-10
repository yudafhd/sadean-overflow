"use client"
import React from 'react'
import { cn } from '@/folderly/components/ui'

export function TopNav({ left, right, className }: { left?: React.ReactNode; right?: React.ReactNode; className?: string }) {
  return (
    <header className={cn('h-16 top-0 z-10 flex items-center justify-between backdrop-blur border-b border-[var(--color-border)] bg-[color-mix(in_srgb, var(--color-surface)_90%, transparent)]', className)}>
      <div className="flex items-center gap-3">{left}</div>
      <div className="flex items-center gap-2">{right}</div>
    </header>
  )
}

export function Sidebar({ children, className }: React.PropsWithChildren<{ className?: string }>) {
  return <aside className={cn('w-64 shrink-0 p-4 border-r border-[var(--color-border)]', className)}>{children}</aside>
}

