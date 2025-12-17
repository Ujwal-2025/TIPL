/**
 * Dashboard utilities for formatting and filtering attendance data
 */

export type AttendanceStatus = 'PRESENT' | 'LATE' | 'ABSENT'

export interface AttendanceRecord {
    id: string
    employeeId: string
    employeeName: string
    sapId: string
    checkInTime: Date | null
    checkOutTime: Date | null
    status: AttendanceStatus
    location: string
    date: Date
}

/**
 * Format time to HH:MM AM/PM format
 */
export function formatTime(date: Date | null | undefined): string {
    if (!date) return '-'
    return new Date(date).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    })
}

/**
 * Format date to DD/MM/YYYY format
 */
export function formatDate(date: Date | string): string {
    const d = new Date(date)
    return d.toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    })
}

/**
 * Get status badge color and styles
 */
export function getStatusBadgeColor(status: AttendanceStatus): {
    className: string
    label: string
} {
    const statusMap = {
        PRESENT: {
            className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            label: 'Present',
        },
        LATE: {
            className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
            label: 'Late',
        },
        ABSENT: {
            className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
            label: 'Absent',
        },
    }
    return statusMap[status]
}

/**
 * Calculate summary statistics
 */
export function calculateSummary(records: AttendanceRecord[]): {
    present: number
    late: number
    absent: number
    total: number
} {
    return {
        present: records.filter((r) => r.status === 'PRESENT').length,
        late: records.filter((r) => r.status === 'LATE').length,
        absent: records.filter((r) => r.status === 'ABSENT').length,
        total: records.length,
    }
}

/**
 * Filter attendance records by status
 */
export function filterByStatus(
    records: AttendanceRecord[],
    status: AttendanceStatus | 'ALL'
): AttendanceRecord[] {
    if (status === 'ALL') return records
    return records.filter((r) => r.status === status)
}

/**
 * Filter attendance records by date
 */
export function filterByDate(
    records: AttendanceRecord[],
    date: Date | null
): AttendanceRecord[] {
    if (!date) return records
    const filterDate = new Date(date).toDateString()
    return records.filter((r) => new Date(r.date).toDateString() === filterDate)
}

/**
 * Search attendance records
 */
export function searchRecords(
    records: AttendanceRecord[],
    query: string
): AttendanceRecord[] {
    if (!query.trim()) return records
    const lowerQuery = query.toLowerCase()
    return records.filter(
        (r) =>
            r.employeeName.toLowerCase().includes(lowerQuery) ||
            r.sapId.toLowerCase().includes(lowerQuery)
    )
}
