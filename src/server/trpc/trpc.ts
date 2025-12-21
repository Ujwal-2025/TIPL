/**
 * tRPC Base Configuration
 * Initializes tRPC with context, error handling, and middleware
 */

import { initTRPC, TRPCError } from '@trpc/server'
import { type Context } from './context'
import superjson from 'superjson'

const t = initTRPC.context<Context>().create({
    transformer: superjson,
    errorFormatter({ shape }) {
        return shape
    },
})

// Base router and procedure
export const router = t.router
export const publicProcedure = t.procedure

/**
 * Protected procedure - requires authentication
 */
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
    if (!ctx.session || !ctx.session.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
    }
    return next({
        ctx: {
            ...ctx,
            session: { ...ctx.session, user: ctx.session.user },
        },
    })
})

/**
 * Admin procedure - requires ADMIN role
 * TEMPORARILY DISABLED FOR TESTING
 */
export const adminProcedure = t.procedure.use(({ ctx, next }) => {
    // Temporarily allow all users for testing
    console.log('⚠️ WARNING: Admin auth is disabled for testing!')
    return next({ ctx })
})

/**
 * Manager procedure - requires ADMIN or MANAGER role
 */
export const managerProcedure = protectedProcedure.use(({ ctx, next }) => {
    const user = ctx.session.user as any
    if (user.role !== 'ADMIN' && user.role !== 'MANAGER') {
        throw new TRPCError({ code: 'FORBIDDEN' })
    }
    return next({ ctx })
})
