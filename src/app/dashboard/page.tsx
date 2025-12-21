'use client'

import { useState, useMemo } from 'react'
import { Calendar, Search, Users, Clock, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    formatTime,
    formatDate,
    getStatusBadgeColor,
    calculateSummary,
    filterByStatus,
    filterByDate,
    searchRecords,
    type AttendanceRecord,
    type AttendanceStatus,
} from '@/lib/dashboard-utils'

/**
 * Summary Card Component
 */
function SummaryCard({
    title,
    value,
    icon: Icon,
    color,
}: {
    title: string
    value: number
    icon: React.ComponentType<{ className?: string }>
    color: 'green' | 'yellow' | 'red' | 'blue'
}) {
    const colorClasses = {
        green: 'bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-200',
        yellow: 'bg-yellow-50 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-200',
        red: 'bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-200',
        blue: 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-200',
    }

    return (
        <Card className="p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    <p className="text-3xl font-bold text-foreground mt-2">{value}</p>
                </div>
                <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
                    <Icon className="h-6 w-6" />
                </div>
            </div>
        </Card>
    )
}

/**
 * Empty State Component
 */
function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground">No records found</h3>
            <p className="text-sm text-muted-foreground">
                Try adjusting your filters or date range
            </p>
        </div>
    )
}

/**
 * Loading State Component
 */
function LoadingState() {
    return (
        <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
                <div
                    key={i}
                    className="h-12 bg-muted rounded-md animate-pulse"
                />
            ))}
        </div>
    )
}

/**
 * Main Attendance Dashboard Page
 */
export default function AttendanceDashboard() {
    // State management
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
    const [statusFilter, setStatusFilter] = useState<AttendanceStatus | 'ALL'>('ALL')
    const [searchQuery, setSearchQuery] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    // Mock data - in production, this would come from tRPC
    const mockAttendanceData: AttendanceRecord[] = useMemo(() => {
        const today = new Date()
        return [
            {
                id: '1',
                employeeId: 'emp001',
                employeeName: 'Rajesh Kumar',
                sapId: 'SAP001',
                checkInTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 8, 30),
                checkOutTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 17, 45),
                status: 'PRESENT',
                location: 'SAP Office, Bangalore',
                date: today,
            },
            {
                id: '2',
                employeeId: 'emp002',
                employeeName: 'Priya Singh',
                sapId: 'SAP002',
                checkInTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 15),
                checkOutTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 18, 30),
                status: 'LATE',
                location: 'SAP Office, Bangalore',
                date: today,
            },
            {
                id: '3',
                employeeId: 'emp003',
                employeeName: 'Amit Patel',
                sapId: 'SAP003',
                checkInTime: null,
                checkOutTime: null,
                status: 'ABSENT',
                location: '-',
                date: today,
            },
            {
                id: '4',
                employeeId: 'emp004',
                employeeName: 'Neha Verma',
                sapId: 'SAP004',
                checkInTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 8, 45),
                checkOutTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 17, 30),
                status: 'PRESENT',
                location: 'SAP Office, Bangalore',
                date: today,
            },
            {
                id: '5',
                employeeId: 'emp005',
                employeeName: 'Vikram Desai',
                sapId: 'SAP005',
                checkInTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 8, 20),
                checkOutTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 17, 15),
                status: 'PRESENT',
                location: 'SAP Office, Bangalore',
                date: today,
            },
        ]
    }, [])

    // Filter and search logic
    const filteredData = useMemo(() => {
        let result = mockAttendanceData

        // Filter by date
        if (selectedDate) {
            result = filterByDate(result, selectedDate)
        }

        // Filter by status
        if (statusFilter !== 'ALL') {
            result = filterByStatus(result, statusFilter)
        }

        // Search
        result = searchRecords(result, searchQuery)

        return result
    }, [mockAttendanceData, selectedDate, statusFilter, searchQuery])

    // Calculate summary
    const summary = useMemo(() => {
        return calculateSummary(mockAttendanceData)
    }, [mockAttendanceData])

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black" style={{ backgroundColor: '#0E0F12' }}>
            <div className="space-y-6 p-6">
                {/* Page Title */}
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">
                        Attendance Dashboard
                    </h2>
                    <p className="text-muted-foreground mt-2">
                        Track employee attendance and performance metrics
                    </p>
                </div>

                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <SummaryCard
                        title="Total Present"
                        value={summary.present}
                        icon={Users}
                        color="green"
                    />
                    <SummaryCard
                        title="Late Arrivals"
                        value={summary.late}
                        icon={Clock}
                        color="yellow"
                    />
                    <SummaryCard
                        title="Absent"
                        value={summary.absent}
                        icon={AlertCircle}
                        color="red"
                    />
                    <SummaryCard
                        title="Total Employees"
                        value={summary.total}
                        icon={Users}
                        color="blue"
                    />
                </div>

                {/* Filters Section */}
                <Card className="p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Filters</h3>
                    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
                        {/* Search Input */}
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name or SAP ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        {/* Date Filter */}
                        <div className="relative">
                            <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="date"
                                value={selectedDate ? selectedDate.toISOString().split('T')[0] : ''}
                                onChange={(e) => {
                                    if (e.target.value) {
                                        const [year, month, day] = e.target.value.split('-')
                                        setSelectedDate(new Date(parseInt(year), parseInt(month) - 1, parseInt(day)))
                                    }
                                }}
                                className="pl-10"
                            />
                        </div>

                        {/* Status Filter */}
                        <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Status</SelectItem>
                                <SelectItem value="PRESENT">Present</SelectItem>
                                <SelectItem value="LATE">Late</SelectItem>
                                <SelectItem value="ABSENT">Absent</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Clear Filters */}
                        <Button
                            variant="outline"
                            onClick={() => {
                                setSelectedDate(new Date())
                                setStatusFilter('ALL')
                                setSearchQuery('')
                            }}
                        >
                            Reset Filters
                        </Button>
                    </div>
                </Card>

                {/* Attendance Table */}
                <Card>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Employee Name</TableHead>
                                    <TableHead>SAP ID</TableHead>
                                    <TableHead>Check-in Time</TableHead>
                                    <TableHead>Check-out Time</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Location</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center">
                                            <LoadingState />
                                        </TableCell>
                                    </TableRow>
                                ) : filteredData.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6}>
                                            <EmptyState />
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredData.map((record) => {
                                        const statusColor = getStatusBadgeColor(record.status)
                                        return (
                                            <TableRow key={record.id} className="hover:bg-muted/50">
                                                <TableCell className="font-medium text-foreground">
                                                    {record.employeeName}
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    {record.sapId}
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    {formatTime(record.checkInTime)}
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    {formatTime(record.checkOutTime)}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={statusColor.className}>
                                                        {statusColor.label}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground text-sm">
                                                    {record.location}
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Table Footer */}
                    {filteredData.length > 0 && (
                        <div className="border-t bg-muted/50 px-6 py-4 text-sm text-muted-foreground">
                            Showing {filteredData.length} of {mockAttendanceData.length} records
                        </div>
                    )}
                </Card>
            </div>
        </div>
    )
}
