"use client"
import React from 'react'
import { cn } from '@/folderly/components/ui'

export function Card({ className, children }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={cn('folderly-card p-4', className)}>{children}</div>
}

export function CardHeader({ title, subtitle, icon }: { title: string; subtitle?: string; icon?: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-3">
      {icon && <div className="w-10 h-10 rounded-[14px] bg-[var(--gray)]/40 flex items-center justify-center">{icon}</div>}
      <div>
        <h3 className="font-semibold">{title}</h3>
        {subtitle && <p className="text-sm text-black/60">{subtitle}</p>}
      </div>
    </div>
  )
}

