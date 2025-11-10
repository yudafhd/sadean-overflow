"use client"

import { useCallback } from 'react'
import { useEffect, useState } from 'react'

export function useLocalStorageState<T>(key: string, initial: T) {
  // Initialize from localStorage on first client render (lazy initializer).
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initial
    try {
      const raw = window.localStorage.getItem(key)
      if (!raw) return initial
      const parsed = JSON.parse(raw) as T | null
      return (parsed ?? initial) as T
    } catch {
      return initial
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // ignore quota errors
    }
  }, [key, value])

  const set = useCallback((next: T | ((prev: T) => T)) => {
    setValue((prev) => (typeof next === 'function' ? (next as any)(prev) : next))
  }, [])

  return [value, set] as const
}
