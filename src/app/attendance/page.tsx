'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, MapPin, Clock, CheckCircle2, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function AttendancePage() {
    const attendanceRecords = [
        {
            date: 'Dec 21, 2025',
            checkIn: '08:30 AM',
            checkOut: '05:45 PM',
            status: 'PRESENT',
            location: 'SAP Office, Bangalore',
        },
        {
            date: 'Dec 20, 2025',
            checkIn: '09:15 AM',
            checkOut: '06:30 PM',
            status: 'LATE',
            location: 'SAP Office, Bangalore',
        },
        {
            date: 'Dec 19, 2025',
            checkIn: '08:45 AM',
            checkOut: '05:30 PM',
            status: 'PRESENT',
            location: 'SAP Office, Bangalore',
        },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black" style={{ backgroundColor: '#0E0F12' }}>
            <div className="container mx-auto px-4 py-16">
                {/* Header */}
                <motion.div
                    className="flex items-center justify-between mb-12"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight" style={{ color: '#FFFFFF' }}>
                            Attendance Tracking
                        </h1>
                        <p className="mt-2 text-lg" style={{ color: '#A1A1AA' }}>
                            View your check-in and check-out records
                        </p>
                    </div>
                    <Button asChild style={{ backgroundColor: '#6366F1', color: '#FFFFFF' }}>
                        <Link href="/luxury">← Back to Home Page</Link>
                    </Button>
                </motion.div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.6 }}
                    >
                        <Card style={{ backgroundColor: '#1A1D23', borderColor: 'rgba(255,255,255,0.06)', borderWidth: '1px' }}>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2" style={{ color: '#FFFFFF' }}>
                                    <CheckCircle2 className="w-5 h-5" style={{ color: '#6366F1' }} />
                                    Total Days Present
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold" style={{ color: '#FFFFFF' }}>18</p>
                                <p className="text-sm mt-2" style={{ color: '#A1A1AA' }}>Out of 20 working days</p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                    >
                        <Card style={{ backgroundColor: '#1A1D23', borderColor: 'rgba(255,255,255,0.06)', borderWidth: '1px' }}>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2" style={{ color: '#FFFFFF' }}>
                                    <AlertCircle className="w-5 h-5" style={{ color: '#FBBF24' }} />
                                    Late Arrivals
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold" style={{ color: '#FFFFFF' }}>2</p>
                                <p className="text-sm mt-2" style={{ color: '#A1A1AA' }}>Last one: Dec 20</p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                    >
                        <Card style={{ backgroundColor: '#1A1D23', borderColor: 'rgba(255,255,255,0.06)', borderWidth: '1px' }}>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2" style={{ color: '#FFFFFF' }}>
                                    <Clock className="w-5 h-5" style={{ color: '#10B981' }} />
                                    Avg. Working Hours
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold" style={{ color: '#FFFFFF' }}>8.5h</p>
                                <p className="text-sm mt-2" style={{ color: '#A1A1AA' }}>Per day</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Records Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                >
                    <Card style={{ backgroundColor: '#1A1D23', borderColor: 'rgba(255,255,255,0.06)', borderWidth: '1px' }}>
                        <CardHeader>
                            <CardTitle style={{ color: '#FFFFFF' }}>Recent Records</CardTitle>
                            <CardDescription style={{ color: '#A1A1AA' }}>
                                Your last 10 attendance entries
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {attendanceRecords.map((record, idx) => (
                                    <motion.div
                                        key={idx}
                                        className="p-4 rounded-lg border"
                                        style={{
                                            backgroundColor: '#20242C',
                                            borderColor: 'rgba(255,255,255,0.06)',
                                            borderWidth: '1px',
                                        }}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.5 + idx * 0.1, duration: 0.5 }}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <p className="font-semibold flex items-center gap-2" style={{ color: '#FFFFFF' }}>
                                                    <Calendar className="w-4 h-4" style={{ color: '#6366F1' }} />
                                                    {record.date}
                                                </p>
                                                <p className="text-sm mt-2 flex items-center gap-2" style={{ color: '#A1A1AA' }}>
                                                    <MapPin className="w-4 h-4" />
                                                    {record.location}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm" style={{ color: '#A1A1AA' }}>
                                                    {record.checkIn} - {record.checkOut}
                                                </p>
                                                <span
                                                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-2 ${record.status === 'PRESENT'
                                                        ? 'bg-green-500/20 text-green-300'
                                                        : 'bg-yellow-500/20 text-yellow-300'
                                                        }`}
                                                >
                                                    {record.status}
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    )
}
