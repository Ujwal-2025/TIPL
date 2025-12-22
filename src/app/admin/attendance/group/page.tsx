'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Calendar from 'react-calendar'
import { format } from 'date-fns'
import 'react-calendar/dist/Calendar.css'
import AttendancePieChart from '@/components/attendance/AttendancePieChart'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import AttendanceNav from '@/components/attendance/AttendanceNav'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function GroupAttendancePage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [viewMode, setViewMode] = useState<'daily' | 'monthly'>('monthly')
  const [showCalendar, setShowCalendar] = useState(false)
  
  // Hardcoded data as per requirements - in production, this would come from an API
  const attendanceData = {
    totalEmployees: 100,
    presentToday: 90,
    lateComingEmployees: 10,
    earlyCheckoutEmployees: 5,
  }

  // Monthly attendance data
  const monthlyData = {
    totalEmployees: 100,
    presentMonthly: 1840, // out of 2000 total working hours/days
    lateComingMonthly: 240,
    earlyCheckoutMonthly: 150,
  }

  const router = useRouter()

  // Get daily data for selected date (mock logic)
  const getDailyAttendanceForDate = () => {
    const day = selectedDate.getDay()
    const statuses = [
      { present: 90, late: 10, absent: 0, earlyCheckout: 5 },
      { present: 85, late: 12, absent: 2, earlyCheckout: 1 },
      { present: 92, late: 5, absent: 1, earlyCheckout: 2 },
      { present: 88, late: 8, absent: 3, earlyCheckout: 1 },
      { present: 95, late: 4, absent: 1, earlyCheckout: 0 },
    ]
    return statuses[day % statuses.length]
  }

  const dailyData = getDailyAttendanceForDate()

  // Calculate absent employees for daily
  const absentEmployees = attendanceData.totalEmployees - attendanceData.presentToday

  // Calculate absent for monthly
  const absentMonthly = monthlyData.totalEmployees * 20 - monthlyData.presentMonthly // 20 working days in month

  // Prepare data for daily pie chart
  // Present (on-time) = Present - Late - Early Checkout
  const presentOnTime = attendanceData.presentToday - attendanceData.lateComingEmployees - attendanceData.earlyCheckoutEmployees

  const dailyPieChartData = [
    {
      name: 'Present (On-time)',
      value: dailyData.present - dailyData.late - dailyData.earlyCheckout,
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
  ]

  const pieChartData = [
    {
      name: 'Present (On-time)',
      value: presentOnTime,
      color: '#10B981',
    },
    {
      name: 'Late Coming',
      value: attendanceData.lateComingEmployees,
      color: '#F59E0B',
    },
    {
      name: 'Early Checkout',
      value: attendanceData.earlyCheckoutEmployees,
      color: '#8B5CF6',
    },
    {
      name: 'Absent',
      value: absentEmployees,
      color: '#EF4444',
    },
  ]

  // Prepare data for monthly pie chart
  const monthlyPresentOnTime = monthlyData.presentMonthly - monthlyData.lateComingMonthly - monthlyData.earlyCheckoutMonthly
  
  const monthlyPieChartData = [
    {
      name: 'Present (On-time)',
      value: monthlyPresentOnTime,
      color: '#10B981',
    },
    {
      name: 'Late Coming',
      value: monthlyData.lateComingMonthly,
      color: '#F59E0B',
    },
    {
      name: 'Early Checkout',
      value: monthlyData.earlyCheckoutMonthly,
      color: '#8B5CF6',
    },
    {
      name: 'Absent',
      value: absentMonthly,
      color: '#EF4444',
    },
  ]

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#0E0F12' }}>
      <div className="max-w-7xl mx-auto">
        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={() => router.push('/luxury')}
            variant="outline"
            className="flex items-center gap-2"
            style={{ borderColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
          >
            <ChevronLeft className="w-4 h-4" />
            Home
          </Button>

          <div>
            <AttendanceNav
              scope="group"
              viewMode={viewMode}
              onViewModeChange={(v) => setViewMode(v)}
              onScopeChange={(s) => {
                if (s === 'individual') router.push('/admin/attendance/employee')
              }}
              showScope={true}
              showView={false}
            />
          </div>
        </div>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#FFFFFF' }}>
            Attendance Dashboard
          </h1>
          <p style={{ color: '#A1A1AA' }}>
            Group attendance overview for all employees
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card style={{ backgroundColor: '#1A1D23', borderColor: 'rgba(255,255,255,0.06)', borderWidth: '1px' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium" style={{ color: '#A1A1AA' }}>
                Total Employees
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" style={{ color: '#FFFFFF' }}>
                {attendanceData.totalEmployees}
              </div>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: '#1A1D23', borderColor: 'rgba(255,255,255,0.06)', borderWidth: '1px' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium" style={{ color: '#A1A1AA' }}>
                Present Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" style={{ color: '#10B981' }}>
                {viewMode === 'daily' ? dailyData.present : attendanceData.presentToday}
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
                {viewMode === 'daily' ? dailyData.late : attendanceData.lateComingEmployees}
              </div>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: '#1A1D23', borderColor: 'rgba(255,255,255,0.06)', borderWidth: '1px' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium" style={{ color: '#A1A1AA' }}>
                Early Checkout
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" style={{ color: '#8B5CF6' }}>
                {viewMode === 'daily' ? dailyData.earlyCheckout : attendanceData.earlyCheckoutEmployees}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Combined Calendar and Charts Card */}
        <Card style={{ backgroundColor: '#1A1D23', borderColor: 'rgba(255,255,255,0.06)', borderWidth: '1px' }} className="mt-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle style={{ color: '#FFFFFF' }}>Attendance Overview</CardTitle>
                <CardDescription style={{ color: '#A1A1AA' }}>
                  View daily or monthly attendance summary
                </CardDescription>
              </div>
              <Button
                onClick={() => setShowCalendar(!showCalendar)}
                style={{
                  backgroundColor: showCalendar ? '#6366F1' : '#1A1D23',
                  color: '#FFFFFF',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                {showCalendar ? 'Hide' : 'Show'} Date Picker
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className={`grid gap-8 ${showCalendar ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {/* Calendar - Hidden by default */}
              {showCalendar && (
                <div className="flex justify-center">
                  <style>{`
                    .react-calendar {
                      background-color: #0E0F12;
                      color: #FFFFFF;
                      border: 1px solid rgba(255,255,255,0.1);
                      border-radius: 8px;
                      font-family: inherit;
                    }
                    .react-calendar__month-view__days__day {
                      color: #A1A1AA;
                    }
                    .react-calendar__tile {
                      padding: 0.75em 0.5em;
                    }
                    .react-calendar__tile:hover {
                      background-color: rgba(99, 102, 241, 0.2);
                    }
                    .react-calendar__tile--active {
                      background-color: #6366F1;
                      color: #FFFFFF;
                    }
                    .react-calendar__navigation {
                      margin-bottom: 1em;
                    }
                    .react-calendar__navigation button {
                      color: #FFFFFF;
                    }
                    .react-calendar__month-view__weekdays__weekday {
                      color: #6366F1;
                      font-weight: bold;
                    }
                  `}</style>
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
              )}

              {/* Charts Section */}
              <div className={showCalendar ? 'lg:col-span-2 space-y-6' : 'space-y-6'}>
                {/* Toggle Buttons replaced by AttendanceNav for consistent look */}
                <div className="mb-4">
                  <AttendanceNav
                    scope="group"
                    viewMode={viewMode}
                    onViewModeChange={(v) => setViewMode(v)}
                    onScopeChange={(s) => { if (s === 'individual') router.push('/admin/attendance/employee') }}
                    showScope={false}
                    showView={true}
                  />
                </div>

                {/* Chart Display */}
                {viewMode === 'daily' && (
                  <div className="transition-opacity duration-300">
                    <h3 style={{ color: '#FFFFFF' }} className="font-semibold mb-4">
                      {format(selectedDate, 'EEEE, MMM dd, yyyy')}
                    </h3>
                    <AttendancePieChart
                      data={dailyPieChartData}
                      title="Daily Attendance"
                    />
                  </div>
                )}

                {viewMode === 'monthly' && (
                  <div className="transition-opacity duration-300">
                    <h3 style={{ color: '#FFFFFF' }} className="font-semibold mb-4">
                      Monthly Summary
                    </h3>
                    <AttendancePieChart
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


