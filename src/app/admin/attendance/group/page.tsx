'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AttendancePieChart from '@/components/attendance/AttendancePieChart'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function GroupAttendancePage() {
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

  // Calculate absent employees for daily
  const absentEmployees = attendanceData.totalEmployees - attendanceData.presentToday

  // Calculate absent for monthly
  const absentMonthly = monthlyData.totalEmployees * 20 - monthlyData.presentMonthly // 20 working days in month

  // Prepare data for daily pie chart
  // Present (on-time) = Present - Late - Early Checkout
  const presentOnTime = attendanceData.presentToday - attendanceData.lateComingEmployees - attendanceData.earlyCheckoutEmployees

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
          <Button
            onClick={() => router.push('/admin/attendance/employee')}
            className="flex items-center gap-2"
            style={{ backgroundColor: '#6366F1', color: '#FFFFFF', border: 'none' }}
          >
            Next: Individual View
            <ChevronRight className="w-4 h-4" />
          </Button>
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
                {attendanceData.presentToday}
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
                {attendanceData.lateComingEmployees}
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
                {attendanceData.earlyCheckoutEmployees}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pie Chart Card */}
        <Card style={{ backgroundColor: '#1A1D23', borderColor: 'rgba(255,255,255,0.06)', borderWidth: '1px' }}>
          <CardHeader>
            <CardTitle style={{ color: '#FFFFFF' }}>Today's Attendance Overview</CardTitle>
            <CardDescription style={{ color: '#A1A1AA' }}>
              Visual representation of attendance distribution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AttendancePieChart
              data={pieChartData}
              title="Today's Attendance Distribution"
            />
          </CardContent>
        </Card>

        {/* Monthly Pie Chart Card */}
        <Card style={{ backgroundColor: '#1A1D23', borderColor: 'rgba(255,255,255,0.06)', borderWidth: '1px' }} className="mt-8">
          <CardHeader>
            <CardTitle style={{ color: '#FFFFFF' }}>Monthly Attendance Overview</CardTitle>
            <CardDescription style={{ color: '#A1A1AA' }}>
              Attendance distribution for the current month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AttendancePieChart
              data={monthlyPieChartData}
              title="Monthly Attendance Distribution"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


