/**
 * Main tRPC App Router
 * Combines all feature routers
 */

import { router } from '../trpc'
import { attendanceRouter } from './attendance'
import { taskRouter } from './task'
import { employeeRouter } from './employee'

export const appRouter = router({
    attendance: attendanceRouter,
    task: taskRouter,
    employee: employeeRouter,
})

export type AppRouter = typeof appRouter
