/**
 * Main tRPC App Router
 * Combines all feature routers
 */

import { router } from '../trpc'
import { attendanceRouter } from './attendance'
import { taskRouter } from './task'
import { employeeRouter } from './employee'
import { adminRouter } from './admin'

export const appRouter = router({
    attendance: attendanceRouter,
    task: taskRouter,
    employee: employeeRouter,
    admin: adminRouter,
})

export type AppRouter = typeof appRouter
