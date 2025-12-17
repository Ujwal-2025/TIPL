'use client'

import { SessionProvider } from 'next-auth/react'
import { trpc } from '@/lib/trpc'
import { useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    )
}
