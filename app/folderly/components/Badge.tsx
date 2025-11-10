"use client"
import React from 'react'
import { cn } from '@/folderly/components/ui'

type BadgeKind = 'neutral' | 'ongoing' | 'done' | 'archived' | 'warning'

export function Badge({ kind = 'neutral', children, className }: { kind?: BadgeKind; children: React.ReactNode; className?: string }) {
  const styles = {
    neutral: 'bg-[var(--gray)]/60 text-[var(--slate)]',
    ongoing: 'bg-[var(--blue)] text-[var(--slate)]',
    done: 'bg-[var(--mint)] text-[var(--slate)]',
    archived: 'bg-[var(--lavender)] text-[var(--slate)]',
    warning: 'bg-[var(--butter)] text-[var(--slate)]',
  }[kind]
  return <span className={cn('inline-flex items-center px-2 py-1 rounded-full text-xs', styles, className)}>{children}</span>
}

