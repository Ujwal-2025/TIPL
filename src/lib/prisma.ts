/**
 * Prisma Client Singleton
 * 
 * This file exports a single instance of PrismaClient to prevent
 * creating multiple database connections in development.
 * 
 * Why singleton pattern?
 * - Next.js hot-reloads files during development
 * - Without this, each reload creates a new Prisma instance
 * - Too many connections can exhaust database connection pool
 * 
 * @example
 * ```typescript
 * import { prisma } from '@/lib/prisma'
 * 
 * // Type-safe database queries
 * const employees = await prisma.employee.findMany()
 * const user = await prisma.user.findUnique({ where: { email } })
 * ```
 */

import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

/**
 * Prisma Client instance
 * 
 * Reuses existing instance in development to prevent connection exhaustion.
 * In production, creates a new instance each time.
 */
export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        log:
            process.env.NODE_ENV === 'development'
                ? ['query', 'error', 'warn'] // Log all queries in dev
                : ['error'], // Only log errors in production
    })

// Store instance globally in development
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
