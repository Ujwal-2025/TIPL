'use client'

import { SessionProvider } from 'next-auth/react'
import { trpc } from '@/lib/trpc'

function ProvidersContent({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    )
}

export const Providers = trpc.withTRPC(ProvidersContent)
