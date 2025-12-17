/**
 * Task tRPC Router
 * Handles task assignment, updates, and completion
 */

import { z } from 'zod'
import { router, protectedProcedure, managerProcedure } from '../trpc'
import { TRPCError } from '@trpc/server'
import { TaskStatus, Priority } from '@prisma/client'

export const taskRouter = router({
    /**
     * Create a new task (Manager/Admin only)
     */
    create: managerProcedure
        .input(
            z.object({
                employeeId: z.number(),
                title: z.string().min(1).max(200),
                description: z.string().min(1),
                priority: z.nativeEnum(Priority).default(Priority.MEDIUM),
                dueDate: z.date().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const user = ctx.session.user as any

            // Verify employee exists
            const employee = await ctx.prisma.employee.findUnique({
                where: { id: input.employeeId },
            })

            if (!employee) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'Employee not found',
                })
            }

            // Create task
            const task = await ctx.prisma.task.create({
                data: {
                    employeeId: input.employeeId,
                    assignedById: user.employeeId,
                    title: input.title,
                    description: input.description,
                    priority: input.priority,
                    dueDate: input.dueDate,
                    status: TaskStatus.PENDING,
                },
                include: {
                    employee: {
                        select: {
                            id: true,
                            name: true,
                            sapId: true,
                        },
                    },
                    assignedBy: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            })

            // Create audit log
            await ctx.prisma.auditLog.create({
                data: {
                    userId: user.id,
                    userName: user.name,
                    action: 'TASK_CREATED',
                    entity: 'Task',
                    entityId: task.id.toString(),
                    metadata: {
                        taskTitle: input.title,
                        assignedTo: input.employeeId,
                        priority: input.priority,
                    },
                    outcome: 'SUCCESS',
                },
            })

            return task
        }),

    /**
     * Update task status
     */
    updateStatus: protectedProcedure
        .input(
            z.object({
                taskId: z.number(),
                status: z.nativeEnum(TaskStatus),
                comments: z.string().optional(),
                attachments: z.array(z.string()).optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const user = ctx.session.user as any

            // Get task
            const task = await ctx.prisma.task.findUnique({
                where: { id: input.taskId },
                include: { employee: true },
            })

            if (!task) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Task not found',
                })
            }

            // Verify authorization: task owner, assigned by, or manager/admin
            const isAuthorized =
                task.employeeId === user.employeeId ||
                task.assignedById === user.employeeId ||
                user.role === 'ADMIN' ||
                user.role === 'MANAGER'

            if (!isAuthorized) {
                throw new TRPCError({ code: 'FORBIDDEN' })
            }

            // Prepare update data
            const updateData: any = {
                status: input.status,
            }

            if (input.comments) {
                updateData.comments = input.comments
            }

            if (input.attachments) {
                updateData.attachments = input.attachments
            }

            // Set timestamps based on status
            if (input.status === TaskStatus.IN_PROGRESS && !task.startedAt) {
                updateData.startedAt = new Date()
            }

            if (input.status === TaskStatus.COMPLETED && !task.completedAt) {
                updateData.completedAt = new Date()
            }

            // Update task
            const updated = await ctx.prisma.task.update({
                where: { id: input.taskId },
                data: updateData,
                include: {
                    employee: {
                        select: {
                            id: true,
                            name: true,
                            sapId: true,
                        },
                    },
                    assignedBy: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            })

            // Create audit log
            await ctx.prisma.auditLog.create({
                data: {
                    userId: user.id,
                    userName: user.name,
                    action: 'TASK_STATUS_UPDATED',
                    entity: 'Task',
                    entityId: task.id.toString(),
                    metadata: {
                        oldStatus: task.status,
                        newStatus: input.status,
                        taskTitle: task.title,
                    },
                    outcome: 'SUCCESS',
                },
            })

            return updated
        }),

    /**
     * Get tasks by employee
     */
    getByEmployee: protectedProcedure
        .input(
            z.object({
                employeeId: z.number(),
                status: z.nativeEnum(TaskStatus).optional(),
                limit: z.number().min(1).max(100).default(50),
            })
        )
        .query(async ({ ctx, input }) => {
            const where: any = {
                employeeId: input.employeeId,
            }

            if (input.status) {
                where.status = input.status
            }

            return await ctx.prisma.task.findMany({
                where,
                include: {
                    employee: {
                        select: {
                            id: true,
                            name: true,
                            sapId: true,
                        },
                    },
                    assignedBy: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
                orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
                take: input.limit,
            })
        }),

    /**
     * Get all tasks (Manager/Admin only)
     */
    getAll: managerProcedure
        .input(
            z.object({
                status: z.nativeEnum(TaskStatus).optional(),
                priority: z.nativeEnum(Priority).optional(),
                limit: z.number().min(1).max(100).default(50),
            })
        )
        .query(async ({ ctx, input }) => {
            const where: any = {}

            if (input.status) {
                where.status = input.status
            }

            if (input.priority) {
                where.priority = input.priority
            }

            return await ctx.prisma.task.findMany({
                where,
                include: {
                    employee: {
                        select: {
                            id: true,
                            name: true,
                            sapId: true,
                            department: true,
                        },
                    },
                    assignedBy: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
                orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
                take: input.limit,
            })
        }),

    /**
     * Get task statistics (Manager/Admin only)
     */
    getStats: managerProcedure
        .input(
            z.object({
                employeeId: z.number().optional(),
                startDate: z.date().optional(),
                endDate: z.date().optional(),
            })
        )
        .query(async ({ ctx, input }) => {
            const where: any = {}

            if (input.employeeId) {
                where.employeeId = input.employeeId
            }

            if (input.startDate || input.endDate) {
                where.createdAt = {}
                if (input.startDate) where.createdAt.gte = input.startDate
                if (input.endDate) where.createdAt.lte = input.endDate
            }

            const tasks = await ctx.prisma.task.findMany({
                where,
            })

            const totalPending = tasks.filter((t: any) => t.status === TaskStatus.PENDING).length
            const totalInProgress = tasks.filter(
                (t: any) => t.status === TaskStatus.IN_PROGRESS
            ).length
            const totalCompleted = tasks.filter(
                (t: any) => t.status === TaskStatus.COMPLETED
            ).length
            const total = tasks.length

            return {
                totalPending,
                totalInProgress,
                totalCompleted,
                total,
                completionRate: total > 0 ? (totalCompleted / total) * 100 : 0,
            }
        }),

    /**
     * Delete a task (Manager/Admin only)
     */
    delete: managerProcedure
        .input(z.object({ taskId: z.number() }))
        .mutation(async ({ ctx, input }) => {
            const user = ctx.session.user as any

            const task = await ctx.prisma.task.findUnique({
                where: { id: input.taskId },
            })

            if (!task) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Task not found',
                })
            }

            await ctx.prisma.task.delete({
                where: { id: input.taskId },
            })

            // Create audit log
            await ctx.prisma.auditLog.create({
                data: {
                    userId: user.id,
                    userName: user.name,
                    action: 'TASK_DELETED',
                    entity: 'Task',
                    entityId: task.id.toString(),
                    metadata: {
                        taskTitle: task.title,
                        taskStatus: task.status,
                    },
                    outcome: 'SUCCESS',
                },
            })

            return { success: true }
        }),
})
