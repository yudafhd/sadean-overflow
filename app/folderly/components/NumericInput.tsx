"use client"
import React from 'react'
import { cn } from '@/folderly/components/ui'

type NumericInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'type'> & {
  value: number
  onChange: (value: number) => void
  allowDecimals?: boolean
  thousandSeparator?: string
  decimalSeparator?: string
}

export function NumericInput({
  value,
  onChange,
  allowDecimals = false,
  thousandSeparator = '.',
  decimalSeparator = ',',
  className,
  onBlur,
  ...rest
}: NumericInputProps) {
  const [display, setDisplay] = React.useState<string>('')

  React.useEffect(() => {
    // Keep display in sync when external value changes (format on mount/update)
    if (Number.isFinite(value)) {
      if (allowDecimals) {
        const [intPart, decPartRaw] = String(value).split('.')
        const intFormatted = Number(intPart).toLocaleString('id-ID')
        const decPart = decPartRaw ? `${decimalSeparator}${decPartRaw}` : ''
        setDisplay(`${intFormatted}${decPart}`)
      } else {
        setDisplay(Number(value || 0).toLocaleString('id-ID'))
      }
    }
  }, [value, allowDecimals, decimalSeparator])

  const parseToNumber = (input: string): number => {
    if (!input) return 0
    // Remove thousand separators and normalize decimal
    let s = input.replace(new RegExp(`\\${thousandSeparator}`, 'g'), '')
    if (allowDecimals) {
      s = s.replace(decimalSeparator, '.')
      // Keep only one dot
      const firstDot = s.indexOf('.')
      if (firstDot !== -1) {
        s = s.slice(0, firstDot + 1) + s.slice(firstDot + 1).replace(/\./g, '')
      }
    } else {
      s = s.replace(/[^0-9]/g, '')
    }
    const num = allowDecimals ? parseFloat(s) : parseInt(s || '0', 10)
    return Number.isFinite(num) ? num : 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    setDisplay(raw)
    const num = parseToNumber(raw)
    onChange(num)
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Format nicely on blur
    const num = parseToNumber(display)
    if (allowDecimals) {
      // Preserve decimals as typed count (do not trim trailing zeros aggressively)
      const parts = display.split(decimalSeparator)
      const decimals = parts[1]
      const intFormatted = Math.trunc(num).toLocaleString('id-ID')
      setDisplay(decimals !== undefined && decimals !== '' ? `${intFormatted}${decimalSeparator}${decimals.replace(/[^0-9]/g, '')}` : intFormatted)
    } else {
      setDisplay(Math.trunc(num).toLocaleString('id-ID'))
    }
    onBlur?.(e)
  }

  return (
    <input
      inputMode={allowDecimals ? 'decimal' : 'numeric'}
      className={cn(
        'w-full h-10 px-3 rounded-[var(--radius-md)] bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-[var(--lavender)]',
        className
      )}
      value={display}
      onChange={handleChange}
      onBlur={handleBlur}
      {...rest}
    />
  )
}

