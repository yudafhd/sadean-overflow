"use client"
import React from 'react'
import { cn } from '@/folderly/components/ui'

type Props = React.HTMLAttributes<HTMLHeadingElement | HTMLParagraphElement>

export function H1({ className, ...rest }: Props) {
  return <h1 className={cn('heading-xl', className as string)} {...rest} />
}

export function H2({ className, ...rest }: Props) {
  return <h2 className={cn('heading-lg', className as string)} {...rest} />
}

export function H3({ className, ...rest }: Props) {
  return <h3 className={cn('heading-md', className as string)} {...rest} />
}

export function H4({ className, ...rest }: Props) {
  return <h4 className={cn('heading-sm', className as string)} {...rest} />
}

export function Lead({ className, ...rest }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-prose-lg measure', className)} {...rest} />
}

export function P({ className, ...rest }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-prose measure', className)} {...rest} />
}

export function Small({ className, ...rest }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('body-sm muted', className)} {...rest} />
}

export function Muted({ className, ...rest }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn('muted', className)} {...rest} />
}

export function Eyebrow({ className, ...rest }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn('eyebrow', className)} {...rest} />
}

export default { H1, H2, H3, H4, Lead, P, Small, Muted, Eyebrow }
