"use client"
import React from 'react'

export function cn(...vals: Array<string | false | null | undefined>) {
  return vals.filter(Boolean).join(' ')
}

export type Variant<T extends string> = T

