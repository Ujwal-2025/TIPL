'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Calendar from 'react-calendar'
import { format } from 'date-fns'
import 'react-calendar/dist/Calendar.css'
import EmployeeAttendancePieChart from '@/components/attendance/EmployeeAttendancePieChart'
import AttendanceNav from '@/components/attendance/AttendanceNav'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Home } from 'lucide-react'

// Mock employee data - in production, this would come from API/database
const mockEmployees = [
  {
    id: 'EMP001',
    tiplId: 'TIPL-001',
    sapId: 'SAP-0001',
    name: 'John Doe',
    totalWorkingDays: 16,
    presentDays: 10,
    lateDays: 3,
  },
  {
    id: 'EMP002',
    tiplId: 'TIPL-002',
    sapId: 'SAP-0002',
    name: 'Jane Smith',
    totalWorkingDays: 16,
    presentDays: 14,
    lateDays: 1,
  },
  {
    id: 'EMP003',
    tiplId: 'TIPL-003',
    sapId: 'SAP-0003',
    name: 'Mike Johnson',
    totalWorkingDays: 16,
    presentDays: 12,
    lateDays: 2,
  },
]

export default function SingleEmployeeAttendancePage() {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(mockEmployees[0].id)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [viewMode, setViewMode] = useState<'daily' | 'monthly'>('monthly')
  const [showCalendar, setShowCalendar] = useState(false)

  // Find selected employee
  const selectedEmployee = mockEmployees.find((emp) => emp.id === selectedEmployeeId)

  const router = useRouter()

  if (!selectedEmployee) {
    return <div>Employee not found</div>
  }

  // Calculate daily attendance data based on selected date (mock logic)
  // In production, this would fetch actual data from API
  const getDailyAttendanceForDate = () => {
    const day = selectedDate.getDay()
    // Mock logic: different attendance for different days
    const statuses = ['PRESENT', 'LATE', 'ABSENT', 'EARLY_CHECKOUT']
    const status = statuses[day % statuses.length]
    
    if (status === 'PRESENT') return { present: 1, late: 0, absent: 0, earlyCheckout: 0 }
    if (status === 'LATE') return { present: 0, late: 1, absent: 0, earlyCheckout: 0 }
    if (status === 'ABSENT') return { present: 0, late: 0, absent: 1, earlyCheckout: 0 }
    return { present: 0, late: 0, absent: 0, earlyCheckout: 1 }
  }

  const dailyData = getDailyAttendanceForDate()

  // Calculate attendance metrics
  const absentDays =
    selectedEmployee.totalWorkingDays -
    selectedEmployee.presentDays
  const earlyCheckoutDays = 2 // Mock data

  // Monthly data
  const monthlyData = {
    presentDays: selectedEmployee.presentDays,
    lateDays: selectedEmployee.lateDays,
    absentDays: absentDays,
    earlyCheckoutDays: earlyCheckoutDays,
  }

  // Prepare data for monthly pie chart
  const monthlyPieChartData = [
    {
      name: 'Present (On-time)',
      value: monthlyData.presentDays - monthlyData.lateDays,
      color: '#10B981',
    },
    {
      name: 'Late Coming',
      value: monthlyData.lateDays,
      color: '#F59E0B',
    },
    {
      name: 'Early Checkout',
      value: monthlyData.earlyCheckoutDays,
      color: '#8B5CF6',
    },
    {
      name: 'Absent',
      value: monthlyData.absentDays,
      color: '#EF4444',
    },
  ]

  // Prepare data for daily pie chart based on selected date
  const dailyPieChartData = [
    {
      name: 'Present (On-time)',
      value: dailyData.present,
      color: '#10B981',
    },
    {
      name: 'Late Coming',
      value: dailyData.late,
      color: '#F59E0B',
    },
    {
      name: 'Early Checkout',
      value: dailyData.earlyCheckout,
      color: '#8B5CF6',
    },
    {
      name: 'Absent',
      value: dailyData.absent,
      color: '#EF4444',
    },
  ].filter((item) => item.value > 0)

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#0E0F12' }}>
      <div className="max-w-7xl mx-auto">
        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mb-8">
          <button
            type="button"
            onClick={() => router.push('/luxury')}
            className="glassy-nav__item glassy-nav__item--medium flex items-center gap-2"
            style={{ color: '#FFFFFF' }}
            aria-label="Home"
          >
            <Home className="w-5 h-5" />
            Home
          </button>
          <div>
            <AttendanceNav
              scope="individual"
              viewMode={viewMode}
              onViewModeChange={(v) => setViewMode(v)}
              onScopeChange={(s) => { if (s === 'group') router.push('/admin/attendance/group') }}
              showScope={true}
              showView={false}
            />
          </div>
        </div>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#FFFFFF' }}>
            Employee Attendance Summary
          </h1>
          <p style={{ color: '#A1A1AA' }}>
            Individual attendance overview for selected employee
          </p>
        </div>

        {/* Employee Selection */}
        <Card
          className="mb-8"
          style={{
            backgroundColor: '#1A1D23',
            borderColor: 'rgba(255,255,255,0.06)',
            borderWidth: '1px',
          }}
        >
          <CardHeader>
            <CardTitle style={{ color: '#FFFFFF' }}>Select Employee</CardTitle>
          </CardHeader>
          <CardContent>
            <select
              value={selectedEmployeeId}
              onChange={(e) => setSelectedEmployeeId(e.target.value)}
              className="glassy-select"
            >
              {mockEmployees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} - {emp.tiplId}
                </option>
              ))}
            </select>
          </CardContent>
        </Card>

        {/* Employee Details */}
        <Card
          className="mb-8"
          style={{
            backgroundColor: '#1A1D23',
            borderColor: 'rgba(255,255,255,0.06)',
            borderWidth: '1px',
          }}
        >
          <CardHeader>
            <CardTitle style={{ color: '#FFFFFF' }}>
              {selectedEmployee.name}
            </CardTitle>
            <CardDescription style={{ color: '#A1A1AA' }}>
              Employee identification and metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm" style={{ color: '#A1A1AA' }}>
                  TIPL ID
                </p>
                <p className="text-lg font-semibold" style={{ color: '#FFFFFF' }}>
                  {selectedEmployee.tiplId}
                </p>
              </div>
              <div>
                <p className="text-sm" style={{ color: '#A1A1AA' }}>
                  SAP ID
                </p>
                <p className="text-lg font-semibold" style={{ color: '#FFFFFF' }}>
                  {selectedEmployee.sapId}
                </p>
              </div>
              <div>
                <p className="text-sm" style={{ color: '#A1A1AA' }}>
                  Total Working Days
                </p>
                <p className="text-lg font-semibold" style={{ color: '#FFFFFF' }}>
                  {selectedEmployee.totalWorkingDays}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card style={{ backgroundColor: '#1A1D23', borderColor: 'rgba(255,255,255,0.06)', borderWidth: '1px' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium" style={{ color: '#A1A1AA' }}>
                Present Days
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" style={{ color: '#10B981' }}>
                {selectedEmployee.presentDays}
              </div>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: '#1A1D23', borderColor: 'rgba(255,255,255,0.06)', borderWidth: '1px' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium" style={{ color: '#A1A1AA' }}>
                Late Coming
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" style={{ color: '#F59E0B' }}>
                {selectedEmployee.lateDays}
              </div>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: '#1A1D23', borderColor: 'rgba(255,255,255,0.06)', borderWidth: '1px' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium" style={{ color: '#A1A1AA' }}>
                Absent Days
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" style={{ color: '#EF4444' }}>
                {absentDays}
              </div>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: '#1A1D23', borderColor: 'rgba(255,255,255,0.06)', borderWidth: '1px' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium" style={{ color: '#A1A1AA' }}>
                Attendance Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" style={{ color: '#6366F1' }}>
                {((selectedEmployee.presentDays / selectedEmployee.totalWorkingDays) * 100).toFixed(1)}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Combined Calendar and Charts Card */}
        <Card
          style={{
            backgroundColor: '#1A1D23',
            borderColor: 'rgba(255,255,255,0.06)',
            borderWidth: '1px',
          }}
          className="mt-8"
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle style={{ color: '#FFFFFF' }}>
                  Attendance Overview
                </CardTitle>
                <CardDescription style={{ color: '#A1A1AA' }}>
                  View daily or monthly attendance summary for {selectedEmployee.name}
                </CardDescription>
              </div>
              <button
                type="button"
                onClick={() => setShowCalendar(!showCalendar)}
                className={`glassy-nav__item glassy-nav__item--medium`}
                style={{
                  color: '#FFFFFF',
                  backgroundColor: showCalendar ? 'rgba(99,102,241,0.12)' : 'transparent',
                }}
                aria-pressed={showCalendar}
              >
                {showCalendar ? 'Hide' : 'Show'} Date Picker
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className={`grid gap-8 ${showCalendar ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {/* Calendar - Hidden by default */}
              {showCalendar && (
                <div className="flex justify-center">
                  <div className="glassy-calendar glassy-calendar--minimal">
                    <Calendar
                      onChange={setSelectedDate}
                      value={selectedDate}
                      tileClassName={({ date }) => {
                        const dateStr = format(date, 'yyyy-MM-dd')
                        const selectedStr = format(selectedDate, 'yyyy-MM-dd')
                        return dateStr === selectedStr ? 'react-calendar__tile--active' : ''
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Charts Section */}
              <div className={showCalendar ? 'lg:col-span-2 space-y-6' : 'space-y-6'}>
                {/* Toggle Buttons replaced by AttendanceNav for consistent look */}
                <div className="mb-4">
                  <AttendanceNav
                    scope="individual"
                    viewMode={viewMode}
                    onViewModeChange={(v) => setViewMode(v)}
                    onScopeChange={(s) => { if (s === 'group') router.push('/admin/attendance/group') }}
                    showScope={false}
                    showView={true}
                    center={true}
                  />
                </div>

                {/* Chart Display */}
                {viewMode === 'daily' && (
                  <div className="transition-opacity duration-300">
                    <h3 style={{ color: '#FFFFFF' }} className="font-semibold mb-4">
                      {format(selectedDate, 'EEEE, MMM dd, yyyy')}
                    </h3>
                    <EmployeeAttendancePieChart
                      data={dailyPieChartData.length > 0 ? dailyPieChartData : [
                        { name: 'No Data', value: 1, color: '#6B7280' }
                      ]}
                      title="Daily Attendance"
                    />
                  </div>
                )}

                {viewMode === 'monthly' && (
                  <div className="transition-opacity duration-300">
                    <h3 style={{ color: '#FFFFFF' }} className="font-semibold mb-4">
                      Monthly Summary
                    </h3>
                    <EmployeeAttendancePieChart
                      data={monthlyPieChartData}
                      title="Monthly Attendance"
                    />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
