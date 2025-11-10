"use client"
import { useCallback, useEffect, useRef, useState } from 'react'

export function useLocalStorageState<T>(key: string, initial: T) {
  // Stabilize initial value across renders to avoid effect loops.
  const initialRef = useRef(initial)

  const read = useCallback((): T => {
    if (typeof window === 'undefined') return initialRef.current
    try {
      const raw = window.localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : initialRef.current
    } catch {
      return initialRef.current
    }
  }, [key])

  // Initialize with `initial` on both server and client for hydration stability.
  // Read from localStorage after mount to avoid SSR/client mismatch.
  const [value, setValue] = useState<T>(initial)

  useEffect(() => {
    // On mount and when key changes, sync from localStorage
    setValue(read())
  }, [read])

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
