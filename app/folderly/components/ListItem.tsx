"use client"
import React from 'react'
import { cn } from '@/folderly/components/ui'

export function ListItem({
  icon,
  title,
  subtitle,
  right,
  className,
  onClick,
}: {
  icon?: React.ReactNode
  title: string
  subtitle?: string
  right?: React.ReactNode
  className?: string
  onClick?: () => void
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'flex items-center justify-between gap-3 p-3 rounded-[16px] border border-[var(--color-border)] hover:bg-[var(--gray)]/30 cursor-default',
        className
      )}
    >
      <div className="flex items-center gap-3">
        {icon && <div className="w-8 h-8 rounded-[12px] bg-[var(--gray)]/40 flex items-center justify-center">{icon}</div>}
        <div>
          <div className="font-medium leading-tight">{title}</div>
          {subtitle && <div className="text-sm text-black/60 leading-tight">{subtitle}</div>}
        </div>
      </div>
      {right}
    </div>
  )
}

