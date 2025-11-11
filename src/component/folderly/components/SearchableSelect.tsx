"use client"

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/folderly/components/ui'

export type Option = { value: string; label: string }

export default function SearchableSelect({
  value,
  onChange,
  options,
  placeholder = 'Pilih...',
  className,
}: {
  value: string
  onChange: (v: string) => void
  options: Option[]
  placeholder?: string
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const rootRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState<{ top: number; left: number; width: number } | null>(null)

  const selected = useMemo(() => options.find((o) => o.value === value)?.label, [options, value])
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return options
    return options.filter((o) => o.label.toLowerCase().includes(q))
  }, [options, query])

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      const root = rootRef.current
      const panel = panelRef.current
      const target = e.target as Node
      if (!root) return
      const clickedInsideRoot = root.contains(target)
      const clickedInsidePanel = panel ? panel.contains(target) : false
      if (!clickedInsideRoot && !clickedInsidePanel) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  useEffect(() => {
    if (open) {
      const rect = rootRef.current?.getBoundingClientRect()
      if (rect) {
        let top = rect.bottom
        let left = rect.left
        const estimatedHeight = 320
        if (top + estimatedHeight > window.innerHeight) {
          top = Math.max(rect.top - estimatedHeight, 8)
        }
        setPos({ top, left, width: rect.width })
      }
      const onWin = () => {
        const r = rootRef.current?.getBoundingClientRect()
        if (!r) return
        let top = r.bottom
        const estimatedHeight = 320
        if (top + estimatedHeight > window.innerHeight) top = Math.max(r.top - estimatedHeight, 8)
        setPos({ top, left: r.left, width: r.width })
      }
      window.addEventListener('resize', onWin)
      window.addEventListener('scroll', onWin, true)
      setTimeout(() => inputRef.current?.focus(), 0)
      return () => {
        window.removeEventListener('resize', onWin)
        window.removeEventListener('scroll', onWin, true)
      }
    } else {
      setQuery('')
      setPos(null)
    }
  }, [open])

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <button
        type="button"
        className={cn('w-full h-10 px-3 text-left bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] body-sm', 'focus:outline-none focus:ring-2 focus:ring-[var(--lavender)]')}
        onClick={() => setOpen((o) => !o)}
      >
        {selected || <span className="text-gray-500">{placeholder}</span>}
      </button>
      {open && pos && typeof document !== 'undefined' && createPortal(
        <>
          <div className="fixed inset-0 z-[999]" onClick={() => setOpen(false)} />
          <div
            className="fixed z-[1000] rounded-[12px] border border-[var(--color-border)] bg-[var(--color-surface)] shadow"
            style={{ top: pos.top, left: pos.left, width: Math.max(pos.width, 260) }}
            ref={panelRef}
          >
            <div className="p-2 border-b border-[var(--color-border)]">
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari..."
                className="w-full h-9 px-3 rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--lavender)] body-sm"
              />
            </div>
            <div className="max-h-64 overflow-auto py-1">
              {filtered.length === 0 ? (
                <div className="p-3 text-sm text-gray-500">Tidak ada hasil</div>
              ) : (
                filtered.map((o) => (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() => {
                      onChange(o.value)
                      setOpen(false)
                    }}
                    className={cn('w-full text-left px-3 py-2 body-sm hover:bg-[var(--gray)]/30', value === o.value && 'bg-[var(--gray)]/40')}
                  >
                    {o.label}
                  </button>
                ))
              )}
            </div>
          </div>
        </>,
        document.body
      )}
    </div>
  )
}
