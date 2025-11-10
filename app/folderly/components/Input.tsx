"use client"
import React from 'react'
import { cn } from '@/folderly/components/ui'

const baseField = 'w-full text-[var(--color-text)] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-[var(--lavender)]'

export const TextInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => <input ref={ref} className={cn(baseField, 'h-10 px-3', className)} {...props} />
)
TextInput.displayName = 'TextInput'

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => <textarea ref={ref} className={cn(baseField, 'min-h-[96px] p-3', className)} {...props} />
)
Textarea.displayName = 'Textarea'

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select ref={ref} className={cn(baseField, 'h-10 px-3', className)} {...props}>
      {children}
    </select>
  )
)
Select.displayName = 'Select'

export function Checkbox({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input type="checkbox" className={cn('h-4 w-4 rounded-[6px] border border-[var(--color-border)] text-[var(--color-text)] accent-[var(--color-primary)]', className)} {...props} />
  )
}

export function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      aria-pressed={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        'w-11 h-6 rounded-full transition border border-[var(--color-border)]',
        checked ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-surface)]'
      )}
    >
      <span
        className={cn(
          'block w-5 h-5 bg-white rounded-full shadow translate-x-[2px] transition',
          checked && 'translate-x-[22px]'
        )}
      />
    </button>
  )
}

