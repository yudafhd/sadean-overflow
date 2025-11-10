"use client"
import React from 'react'
import { cn } from '@/folderly/components/ui'

export function Tabs({
  value,
  onChange,
  tabs,
}: {
  value: string
  onChange: (v: string) => void
  tabs: { value: string; label: string }[]
}) {
  return (
    <div className="flex items-center gap-6 border-b border-[var(--color-border)]">
      {tabs.map((t) => {
        const active = t.value === value
        return (
          <button
            key={t.value}
            onClick={() => onChange(t.value)}
            className={cn('relative py-2 text-sm', active ? 'text-[var(--slate)]' : 'text-black/60 hover:text-black/80')}
          >
            {t.label}
            <span
              className={cn(
                'absolute left-0 right-0 -bottom-[1px] h-[3px] rounded-full bg-[var(--color-primary)] transition-opacity',
                active ? 'opacity-100' : 'opacity-0'
              )}
            />
          </button>
        )
      })}
    </div>
  )
}

export function Segmented({
  value,
  onChange,
  items,
}: {
  value: string
  onChange: (v: string) => void
  items: { value: string; label: string }[]
}) {
  return (
    <div className="inline-flex p-1 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)]">
      {items.map((it) => {
        const active = it.value === value
        return (
          <button
            key={it.value}
            onClick={() => onChange(it.value)}
            className={cn(
              'px-3 h-8 rounded-full text-sm transition',
              active ? 'bg-[var(--color-primary)] text-[var(--slate)]' : 'text-black/70 hover:bg-[var(--gray)]/40'
            )}
          >
            {it.label}
          </button>
        )
      })}
    </div>
  )
}

