"use client"
import React from 'react'
import Image from 'next/image'
import { cn } from '@/folderly/components/ui'

export function SplashGate({ children, durationMs = 4500 }: { children: React.ReactNode; durationMs?: number }) {
  const [show, setShow] = React.useState(true)
  const [msgIdx, setMsgIdx] = React.useState(0)
  const [imgError, setImgError] = React.useState(false)

  const messages = React.useMemo(
    () => [
      'Menyiapkan pemanas…',
      'Menggoreng sate…',
      'Berusaha memanaskan sate…',
      'Hampir siap…',
      'Ready! 🎉',
    ],
    []
  )

  React.useEffect(() => {
    const step = Math.max(500, Math.floor(durationMs / messages.length))
    const int = window.setInterval(() => setMsgIdx((i) => (i + 1) % messages.length), step)
    const t = window.setTimeout(() => {
      setShow(false)
      window.clearInterval(int)
    }, durationMs)
    return () => {
      window.clearInterval(int)
      window.clearTimeout(t)
    }
  }, [durationMs, messages.length])

  if (show) {
    return (
      <div className={cn('fixed inset-0 z-50 flex items-center justify-center bg-white')}>
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="font-serif text-[2.7rem] text-black">Sadean <br /> Overflow</div>
          <div className="relative w-48 h-48">
            {!imgError &&
              <Image
                src="/splash-loading-sadean.png"
                alt="Sadean loading"
                fill
                sizes="192px"
                className="object-contain"
                priority
                unoptimized
                onError={() => setImgError(true)}
              />
            }
          </div>
          <div className="font-serif text-md text-black min-h-[1.25rem]">{messages[msgIdx]}</div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
