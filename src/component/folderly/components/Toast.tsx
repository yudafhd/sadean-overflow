"use client"
import React from 'react'
import { FiBell, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi'

export function Toast({ kind = 'info', children }: { kind?: 'info' | 'success' | 'warning'; children: React.ReactNode }) {
  const bg = {
    info: 'bg-[var(--blue)]',
    success: 'bg-[var(--mint)]',
    warning: 'bg-[var(--butter)]',
  }[kind]
  const Icon = {
    info: FiBell,
    success: FiCheckCircle,
    warning: FiAlertTriangle,
  }[kind]
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-[14px] shadow-[var(--shadow-md)] ${bg}`}>
      <Icon className="text-[var(--slate)]" />
      <span className="text-[var(--slate)] text-sm">{children}</span>
    </div>
  )
}
