/**
 * tRPC Client Configuration
 * Sets up tRPC client for Next.js App Router
 * 
 * This file creates the tRPC client that connects your frontend to backend API.
 * It provides type-safe API calls with autocomplete and error checking.
 * 
 * @example
 * ```tsx
 * import { trpc } from '@/lib/trpc'
 * 
 * function Component() {
 *   // Type-safe query with autocomplete
 *   const { data, isLoading } = trpc.employee.getAll.useQuery()
 *   
 *   // Type-safe mutation
 *   const mutation = trpc.employee.create.useMutation()
 * }
 * ```
 */

import { httpBatchLink } from '@trpc/client'
import { createTRPCNext } from '@trpc/next'
import { type AppRouter } from '@/server/trpc/routers'
import superjson from 'superjson'

/**
 * Get the base URL for API calls
 * - Browser: Use relative URL
 * - Vercel: Use deployment URL
 * - Local dev: Use localhost with port
 */
function getBaseUrl() {
    if (typeof window !== 'undefined') return '' // Browser uses relative URL
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
    return `http://localhost:${process.env.PORT ?? 3000}`
}

/**
 * tRPC client instance
 * 
 * Use this in your components to make type-safe API calls:
 * - trpc.employee.getAll.useQuery() - Fetch data
 * - trpc.employee.create.useMutation() - Modify data
 * 
 * All API calls are:
 * - Type-safe (TypeScript knows the shape of data)
 * - Auto-completed (IntelliSense suggests available endpoints)
 * - Validated (Zod schemas check inputs)
 * - Cached (React Query handles caching automatically)
 */
export const trpc = createTRPCNext<AppRouter>({
    config() {
        return {
            links: [
                httpBatchLink({
                    url: `${getBaseUrl()}/api/trpc`,
                    transformer: superjson, // Handles Date, BigInt serialization
                }),
            ],
        }
    },
    transformer: superjson,
    ssr: false, // Disable server-side rendering for tRPC calls
})
