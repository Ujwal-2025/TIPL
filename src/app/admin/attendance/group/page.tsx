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

  const router = useRouter()

  // Calculate absent employees
  const absentEmployees = attendanceData.totalEmployees - attendanceData.presentToday

  // Prepare data for pie chart
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

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#0E0F12' }}>
      <div className="max-w-7xl mx-auto">
        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="flex items-center gap-2"
            style={{ borderColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
          >
            <ChevronLeft className="w-4 h-4" />
            Back
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
      </div>
    </div>
  )
}
