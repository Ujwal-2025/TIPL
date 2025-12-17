/**
 * Employee tRPC Router
 * Handles employee CRUD operations
 */

import { z } from 'zod'
import { router, protectedProcedure, adminProcedure, managerProcedure } from '../trpc'
import { TRPCError } from '@trpc/server'
import { UserRole, EmployeeStatus } from '@prisma/client'

export const employeeRouter = router({
    /**
     * Create a new employee (Admin only)
     */
    create: adminProcedure
        .input(
            z.object({
                sapId: z.string().min(1),
                name: z.string().min(1),
                email: z.string().email(),
                department: z.string().min(1),
                position: z.string().min(1),
                role: z.enum(['ADMIN', 'MANAGER', 'EMPLOYEE']).default('EMPLOYEE'),
            })
        )
        .mutation(async ({ ctx, input }) => {
            // Check if employee already exists
            const existing = await ctx.prisma.employee.findFirst({
                where: {
                    OR: [{ sapId: input.sapId }, { email: input.email }],
                },
            })

            if (existing) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'Employee with this SAP ID or email already exists',
                })
            }

            // Create employee
            const employee = await ctx.prisma.employee.create({
                data: {
                    sapId: input.sapId,
                    name: input.name,
                    email: input.email,
                    department: input.department,
                    position: input.position,
                    role: input.role,
                    status: EmployeeStatus.ACTIVE,
                },
            })

            // Create audit log
            const user = ctx.session.user as any
            await ctx.prisma.auditLog.create({
                data: {
                    userId: user.id,
                    userName: user.name,
                    action: 'EMPLOYEE_CREATED',
                    entity: 'Employee',
                    entityId: employee.id.toString(),
                    metadata: {
                        sapId: input.sapId,
                        name: input.name,
                        email: input.email,
                    },
                    outcome: 'SUCCESS',
                },
            })

            return employee
        }),

    /**
     * Update employee (Admin only)
     */
    update: adminProcedure
        .input(
            z.object({
                id: z.number(),
                name: z.string().min(1).optional(),
                email: z.string().email().optional(),
                department: z.string().min(1).optional(),
                position: z.string().min(1).optional(),
                role: z.string().optional(),
                status: z.nativeEnum(EmployeeStatus).optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { id, ...updateData } = input

            // Check if employee exists
            const employee = await ctx.prisma.employee.findUnique({
                where: { id },
            })

            if (!employee) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Employee not found',
                })
            }

            // Update employee
            const updated = await ctx.prisma.employee.update({
                where: { id },
                data: updateData as any,
            })

            // Create audit log
            const user = ctx.session.user as any
            await ctx.prisma.auditLog.create({
                data: {
                    userId: user.id,
                    userName: user.name,
                    action: 'EMPLOYEE_UPDATED',
                    entity: 'Employee',
                    entityId: id.toString(),
                    metadata: {
                        changes: updateData,
                    },
                    outcome: 'SUCCESS',
                },
            })

            return updated
        }),

    /**
     * Get employee by ID
     */
    getById: protectedProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ ctx, input }) => {
            const employee = await ctx.prisma.employee.findUnique({
                where: { id: input.id },
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            name: true,
                            image: true,
                        },
                    },
                },
            })

            if (!employee) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Employee not found',
                })
            }

            return employee
        }),

    /**
     * Get all employees (Manager/Admin only)
     */
    getAll: managerProcedure
        .input(
            z.object({
                status: z.nativeEnum(EmployeeStatus).optional(),
                department: z.string().optional(),
                limit: z.number().min(1).max(200).default(100),
            })
        )
        .query(async ({ ctx, input }) => {
            const where: any = {}

            if (input.status) {
                where.status = input.status
            }

            if (input.department) {
                where.department = input.department
            }

            return await ctx.prisma.employee.findMany({
                where,
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            name: true,
                        },
                    },
                },
                orderBy: { name: 'asc' },
                take: input.limit,
            })
        }),

    /**
     * Search employees
     */
    search: managerProcedure
        .input(
            z.object({
                query: z.string().min(1),
                limit: z.number().min(1).max(50).default(20),
            })
        )
        .query(async ({ ctx, input }) => {
            return await ctx.prisma.employee.findMany({
                where: {
                    OR: [
                        { name: { contains: input.query, mode: 'insensitive' } },
                        { email: { contains: input.query, mode: 'insensitive' } },
                        { sapId: { contains: input.query, mode: 'insensitive' } },
                        { department: { contains: input.query, mode: 'insensitive' } },
                    ],
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            name: true,
                        },
                    },
                },
                take: input.limit,
            })
        }),

    /**
     * Delete employee (Admin only)
     */
    delete: adminProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ ctx, input }) => {
            const employee = await ctx.prisma.employee.findUnique({
                where: { id: input.id },
            })

            if (!employee) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Employee not found',
                })
            }

            await ctx.prisma.employee.delete({
                where: { id: input.id },
            })

            // Create audit log
            const user = ctx.session.user as any
            await ctx.prisma.auditLog.create({
                data: {
                    userId: user.id,
                    userName: user.name,
                    action: 'EMPLOYEE_DELETED',
                    entity: 'Employee',
                    entityId: input.id.toString(),
                    metadata: {
                        sapId: employee.sapId,
                        name: employee.name,
                    },
                    outcome: 'SUCCESS',
                },
            })

            return { success: true }
        }),
})
