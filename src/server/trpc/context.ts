/**
 * tRPC Context - Shared context for all tRPC procedures
 * Includes session, user, and database access
 */

import { type Session } from 'next-auth'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface CreateContextOptions {
    session: Session | null
}

export const createContextInner = async (opts: CreateContextOptions) => {
    return {
        session: opts.session,
        prisma,
    }
}

export const createContext = async (opts: { req: Request }) => {
    // Get session from NextAuth.js
    const session = await getServerSession(authOptions)

    return await createContextInner({
        session,
    })
}

export type Context = Awaited<ReturnType<typeof createContextInner>>
