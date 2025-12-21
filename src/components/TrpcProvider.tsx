'use client'

import { trpc } from '@/lib/trpc'
import { ReactNode } from 'react'

export function TrpcProvider({ children }: { children: ReactNode }) {
    return children
}
