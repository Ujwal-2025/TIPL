/**
 * Shared TypeScript type definitions for the TIPL Employee Monitoring App
 */

import type { UserRole, EmployeeStatus, AttendanceStatus, TaskStatus, Priority } from '@prisma/client'

// Re-export Prisma enums for convenience
export type { UserRole, EmployeeStatus, AttendanceStatus, TaskStatus, Priority }

// User session type
export interface SessionUser {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    role: UserRole
    employeeId?: number | null
}

// API Response types
export interface ApiResponse<T = unknown> {
    success: boolean
    data?: T
    error?: string
    message?: string
}

// Attendance types
export interface AttendanceCheckIn {
    employeeId: number
    location?: string
    deviceInfo?: string
    ipAddress?: string
}

export interface AttendanceCheckOut {
    attendanceId: number
    location?: string
}

export interface AttendanceStats {
    totalPresent: number
    totalAbsent: number
    totalLate: number
    attendanceRate: number
}

// Task types
export interface TaskCreate {
    employeeId: number
    title: string
    description: string
    priority?: Priority
    dueDate?: Date
}

export interface TaskUpdate {
    id: number
    status?: TaskStatus
    comments?: string
    attachments?: string[]
}

export interface TaskStats {
    totalPending: number
    totalInProgress: number
    totalCompleted: number
    completionRate: number
}

// Audit log types
export interface AuditLogCreate {
    userId?: string
    userName?: string
    action: string
    entity: string
    entityId?: string
    ipAddress?: string
    userAgent?: string
    location?: string
    metadata?: Record<string, unknown>
    outcome?: string
}

// Real-time subscription types
export interface AttendanceUpdateEvent {
    type: 'CHECKIN' | 'CHECKOUT'
    attendance: {
        id: number
        employeeId: number
        employeeName: string
        status: AttendanceStatus
        checkInTime: Date
        checkOutTime?: Date | null
        location?: string | null
    }
}

export interface TaskUpdateEvent {
    type: 'ASSIGNED' | 'STARTED' | 'COMPLETED' | 'CANCELLED'
    task: {
        id: number
        employeeId: number
        employeeName: string
        title: string
        status: TaskStatus
        priority: Priority
    }
}

// Dashboard types
export interface DashboardStats {
    attendance: AttendanceStats
    tasks: TaskStats
    activeEmployees: number
    pendingAlerts: number
}
