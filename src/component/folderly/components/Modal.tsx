"use client"
import React from 'react'
import { cn } from '@/folderly/components/ui'

export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div className={cn('relative w-full max-w-md folderly-card p-4 bg-[var(--color-surface)] rounded-[20px] shadow-[var(--shadow-lg)]')}>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold">{title}</h3>
          <button className="w-8 h-8 rounded-[10px] hover:bg-[var(--gray)]/40" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  )
}

