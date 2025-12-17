/**
 * Type augmentations for NextAuth.js
 */

import { type UserRole } from '@prisma/client'
import 'next-auth'

declare module 'next-auth' {
    interface Session {
        user: {
            id: string
            email?: string | null
            name?: string | null
            image?: string | null
            role: UserRole
            employeeId?: number | null
        }
    }

    interface User {
        role: UserRole
        employeeId?: number | null
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string
        role: UserRole
        employeeId?: number | null
    }
}
