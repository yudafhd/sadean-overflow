"use client"

import React from 'react'
import { Eyebrow } from '@/folderly/components/Typography'

export default function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <div className="folderly-card p-0 overflow-hidden">
        <div className="px-4 py-2 border-b folderly-border bg-[color-mix(in_oklab,var(--color-primary)_22%,var(--color-surface))]">
          <Eyebrow>{title}</Eyebrow>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </section>
  )
}
