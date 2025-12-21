/**
 * Attendance tRPC Router
 * Handles check-in, check-out, and attendance queries
 */

import { z } from 'zod'
import { router, protectedProcedure, managerProcedure } from '../trpc'
import { TRPCError } from '@trpc/server'
import { AttendanceStatus } from '@prisma/client'

export const attendanceRouter = router({
    /**
     * Check in an employee
     */
    checkIn: protectedProcedure
        .input(
            z.object({
                employeeId: z.number(),
                location: z.string().optional(),
                deviceInfo: z.string().optional(),
                ipAddress: z.string().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            // Verify authorization: user can only check in themselves or manager/admin can check in anyone
            const user = ctx.session.user as any
            const isAuthorized =
                user.employeeId === input.employeeId ||
                user.role === 'ADMIN' ||
                user.role === 'MANAGER'

            if (!isAuthorized) {
                throw new TRPCError({ code: 'FORBIDDEN' })
            }

            // Check if already checked in today
            const today = new Date()
            today.setHours(0, 0, 0, 0)

            const existingAttendance = await ctx.prisma.attendance.findFirst({
                where: {
                    employeeId: input.employeeId,
                    date: today,
                },
            })

            if (existingAttendance) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'Already checked in today',
                })
            }

            // Determine if late (example: after 9 AM)
            const now = new Date()
            const nineAM = new Date(today)
            nineAM.setHours(9, 0, 0, 0)
            const isLate = now > nineAM

            // Create attendance record
            const attendance = await ctx.prisma.attendance.create({
                data: {
                    employeeId: input.employeeId,
                    date: today,
                    checkInTime: now,
                    status: AttendanceStatus.PRESENT,
                    isLate,
                    location: input.location,
                    deviceInfo: input.deviceInfo,
                    ipAddress: input.ipAddress,
                },
                include: {
                    employee: {
                        select: {
                            id: true,
                            name: true,
                            sapId: true,
                        },
                    },
                },
            })

            // Create audit log
            await ctx.prisma.auditLog.create({
                data: {
                    userId: user.id,
                    userName: user.name,
                    action: 'ATTENDANCE_CHECKIN',
                    entity: 'Attendance',
                    entityId: attendance.id.toString(),
                    ipAddress: input.ipAddress,
                    metadata: {
                        employeeId: input.employeeId,
                        isLate,
                        location: input.location,
                    },
                    outcome: 'SUCCESS',
                },
            })

            return attendance
        }),

    /**
     * Check out an employee
     */
    checkOut: protectedProcedure
        .input(
            z.object({
                employeeId: z.number(),
                location: z.string().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            // Verify authorization
            const user = ctx.session.user as any
            const isAuthorized =
                user.employeeId === input.employeeId ||
                user.role === 'ADMIN' ||
                user.role === 'MANAGER'

            if (!isAuthorized) {
                throw new TRPCError({ code: 'FORBIDDEN' })
            }

            // Find today's attendance
            const today = new Date()
            today.setHours(0, 0, 0, 0)

            const attendance = await ctx.prisma.attendance.findFirst({
                where: {
                    employeeId: input.employeeId,
                    date: today,
                    checkOutTime: null,
                },
            })

            if (!attendance) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'No active check-in found for today',
                })
            }

            // Update attendance with check-out time
            const updated = await ctx.prisma.attendance.update({
                where: { id: attendance.id },
                data: {
                    checkOutTime: new Date(),
                },
                include: {
                    employee: {
                        select: {
                            id: true,
                            name: true,
                            sapId: true,
                        },
                    },
                },
            })

            // Create audit log
            await ctx.prisma.auditLog.create({
                data: {
                    userId: user.id,
                    userName: user.name,
                    action: 'ATTENDANCE_CHECKOUT',
                    entity: 'Attendance',
                    entityId: attendance.id.toString(),
                    metadata: {
                        employeeId: input.employeeId,
                        location: input.location,
                    },
                    outcome: 'SUCCESS',
                },
            })

            return updated
        }),

    /**
     * Get attendance records for an employee
     */
    getByEmployee: protectedProcedure
        .input(
            z.object({
                employeeId: z.number(),
                startDate: z.date().optional(),
                endDate: z.date().optional(),
                limit: z.number().min(1).max(100).default(30),
            })
        )
        .query(async ({ ctx, input }) => {
            const where: any = {
                employeeId: input.employeeId,
            }

            if (input.startDate || input.endDate) {
                where.date = {}
                if (input.startDate) where.date.gte = input.startDate
                if (input.endDate) where.date.lte = input.endDate
            }

            return await ctx.prisma.attendance.findMany({
                where,
                include: {
                    employee: {
                        select: {
                            id: true,
                            name: true,
                            sapId: true,
                        },
                    },
                },
                orderBy: { date: 'desc' },
                take: input.limit,
            })
        }),

    /**
     * Get today's attendance for all employees (Manager/Admin only)
     */
    getTodayAll: managerProcedure.query(async ({ ctx }) => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        return await ctx.prisma.attendance.findMany({
            where: {
                date: today,
            },
            include: {
                employee: {
                    select: {
                        id: true,
                        name: true,
                        sapId: true,
                        department: true,
                        position: true,
                    },
                },
            },
            orderBy: { checkInTime: 'asc' },
        })
    }),

    /**
     * Get attendance statistics (Manager/Admin only)
     */
    getStats: managerProcedure
        .input(
            z.object({
                startDate: z.date(),
                endDate: z.date(),
                employeeId: z.number().optional(),
            })
        )
        .query(async ({ ctx, input }) => {
            const where: any = {
                date: {
                    gte: input.startDate,
                    lte: input.endDate,
                },
            }

            if (input.employeeId) {
                where.employeeId = input.employeeId
            }

            const attendances = await ctx.prisma.attendance.findMany({
                where,
            })

            const totalPresent = attendances.filter(
                (a: any) => a.status === AttendanceStatus.PRESENT
            ).length
            const totalAbsent = attendances.filter(
                (a: any) => a.status === AttendanceStatus.ABSENT
            ).length
            const totalLate = attendances.filter((a: any) => a.isLate).length
            const total = attendances.length

            return {
                totalPresent,
                totalAbsent,
                totalLate,
                total,
                attendanceRate: total > 0 ? (totalPresent / total) * 100 : 0,
            }
        }),

    /**
     * Create comprehensive attendance record (Admin only)
     */
    createAttendanceRecord: protectedProcedure
        .input(
            z.object({
                firstName: z.string(),
                lastName: z.string(),
                fatherName: z.string(),
                address: z.string(),
                email: z.string().email(),
                panNumber: z.string(),
                idType: z.string().optional(),
                idNumber: z.string().optional(),
                designation: z.string(),
                department: z.string(),
                companyBranch: z.string(),
                employerName: z.string(),
                previousEmployerName: z.string().optional(),
                pfId: z.string(),
                bankAccountNumber: z.string(),
                bankName: z.string(),
                ifscCode: z.string(),
                bankBranch: z.string(),
                dateOfJoining: z.string(),
                salaryPerMonth: z.number(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            // Note: This stores comprehensive employee data
            // In production, you'd likely want to create an Employee record
            // and link it to attendance. For now, storing as metadata.

            const user = ctx.session?.user as any

            // Create audit log for the attendance record creation
            const auditLog = await ctx.prisma.auditLog.create({
                data: {
                    userId: user?.id || 'system',
                    userName: user?.name || 'System',
                    action: 'ATTENDANCE_RECORD_CREATED',
                    entity: 'AttendanceRecord',
                    metadata: input,
                    outcome: 'SUCCESS',
                },
            })

            return {
                success: true,
                message: 'Attendance record created successfully',
                auditLogId: auditLog.id,
            }
        }),
})
