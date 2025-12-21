'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { trpc } from '@/lib/trpc'
import { AdminLayoutWrapper } from '@/components/admin/AdminLayoutWrapper'
import { motion } from 'framer-motion'

export default function SalaryPage() {
    const today = new Date()
    const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1)
    const [selectedYear, setSelectedYear] = useState(today.getFullYear())

    const overviewQuery = trpc.admin.getSalaryOverview.useQuery()

    const allEmployeesQuery =
        trpc.admin.getSalaryOverview.useQuery()

    const markAsPaid = trpc.admin.markSalaryAsPaid.useMutation()

    const handleMarkAsPaid = async (salaryRecordId: string) => {
        try {
            await markAsPaid.mutateAsync({ salaryRecordId })
            overviewQuery.refetch()
            allEmployeesQuery.refetch()
        } catch (error) {
            alert('Failed to mark as paid')
        }
    }

    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ]

    return (
        <AdminLayoutWrapper section="salary">
            <div className="max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground">
                        Salary Management
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Track salary calculations, payments, and financial
                        overview
                    </p>
                </div>

                {/* Month/Year Selection */}
                <Card className="p-4 bg-card border border-border mb-8">
                    <div className="flex gap-4 items-center">
                        <div className="flex-1">
                            <label className="text-sm text-muted-foreground">
                                Select Month
                            </label>
                            <select
                                value={selectedMonth}
                                onChange={(e) =>
                                    setSelectedMonth(
                                        parseInt(e.target.value)
                                    )
                                }
                                className="mt-1 w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                {months.map((month, idx) => (
                                    <option
                                        key={idx}
                                        value={idx + 1}
                                    >
                                        {month}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex-1">
                            <label className="text-sm text-muted-foreground">
                                Select Year
                            </label>
                            <select
                                value={selectedYear}
                                onChange={(e) =>
                                    setSelectedYear(
                                        parseInt(e.target.value)
                                    )
                                }
                                className="mt-1 w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                {[2023, 2024, 2025, 2026].map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <Button
                            onClick={() => overviewQuery.refetch()}
                            className="mt-6"
                        >
                            Load
                        </Button>
                    </div>
                </Card>

                {/* Overall Summary */}
                {allEmployeesQuery.data && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        <Card className="p-6 bg-card border border-border">
                            <p className="text-muted-foreground text-sm">
                                Total Base Salary
                            </p>
                            <p className="text-2xl font-bold text-foreground mt-2">
                                ${
                                    allEmployeesQuery.data.records?.reduce((sum: number, r: any) => sum + (r.baseSalary || 0), 0).toFixed(
                                        2
                                    ) || '0.00'
                                }
                            </p>
                        </Card>
                        <Card className="p-6 bg-card border border-border">
                            <p className="text-muted-foreground text-sm">
                                Already Paid
                            </p>
                            <p className="text-2xl font-bold text-green-400 mt-2">
                                ${
                                    allEmployeesQuery.data.totalPaid?.toFixed(
                                        2
                                    ) || '0.00'
                                }
                            </p>
                        </Card>
                        <Card className="p-6 bg-card border border-border">
                            <p className="text-muted-foreground text-sm">
                                Pending Payment
                            </p>
                            <p className="text-2xl font-bold text-yellow-400 mt-2">
                                ${
                                    allEmployeesQuery.data.pendingPayments?.toFixed(
                                        2
                                    ) || '0.00'
                                }
                            </p>
                        </Card>
                        <Card className="p-6 bg-card border border-border">
                            <p className="text-muted-foreground text-sm">
                                Total Employees
                            </p>
                            <p className="text-2xl font-bold text-primary mt-2">
                                {allEmployeesQuery.data.records?.length || 0}
                            </p>
                        </Card>
                    </div>
                )}

                {/* Month-Specific Overview */}
                {overviewQuery.data && (
                    <>
                        <Card className="p-6 bg-card border border-border mb-8">
                            <h2 className="text-xl font-bold text-foreground mb-4">
                                {months[selectedMonth - 1]} {selectedYear}{' '}
                                Summary
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <p className="text-muted-foreground text-sm">
                                        Should Pay
                                    </p>
                                    <p className="text-3xl font-bold text-foreground mt-2">
                                        ${
                                            overviewQuery.data?.totalOwed?.toFixed(
                                                2
                                            ) || '0.00'
                                        }
                                    </p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground text-sm">
                                        Already Paid
                                    </p>
                                    <p className="text-3xl font-bold text-green-400 mt-2">
                                        ${
                                            overviewQuery.data?.totalPaid?.toFixed(
                                                2
                                            ) || '0.00'
                                        }
                                    </p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground text-sm">
                                        Pending
                                    </p>
                                    <p className="text-3xl font-bold text-yellow-400 mt-2">
                                        ${
                                            overviewQuery.data?.pendingPayments?.toFixed?.(
                                                2
                                            ) || '0'
                                        }
                                    </p>
                                </div>
                            </div>
                        </Card>

                        {/* Salary Records Table */}
                        <Card className="p-6 bg-card border border-border">
                            <h2 className="text-xl font-bold text-foreground mb-4">
                                Employee Salaries
                            </h2>

                            {overviewQuery.data.records.length === 0 ? (
                                <p className="text-muted-foreground text-sm">
                                    No salary records for this month. Create
                                    employees and calculate salaries.
                                </p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="border-b border-border">
                                            <tr>
                                                <th className="text-left py-3 px-4 text-muted-foreground font-medium">
                                                    Employee
                                                </th>
                                                <th className="text-right py-3 px-4 text-muted-foreground font-medium">
                                                    Base Salary
                                                </th>
                                                <th className="text-right py-3 px-4 text-muted-foreground font-medium">
                                                    Attendance Bonus
                                                </th>
                                                <th className="text-right py-3 px-4 text-muted-foreground font-medium">
                                                    Completion Bonus
                                                </th>
                                                <th className="text-right py-3 px-4 text-muted-foreground font-medium">
                                                    Total
                                                </th>
                                                <th className="text-center py-3 px-4 text-muted-foreground font-medium">
                                                    Status
                                                </th>
                                                <th className="text-center py-3 px-4 text-muted-foreground font-medium">
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {overviewQuery.data.records.map(
                                                (record, idx) => (
                                                    <motion.tr
                                                        key={record.id}
                                                        initial={{
                                                            opacity: 0,
                                                        }}
                                                        animate={{
                                                            opacity: 1,
                                                        }}
                                                        transition={{
                                                            delay:
                                                                idx * 0.05,
                                                        }}
                                                        className="border-b border-border hover:bg-background/50"
                                                    >
                                                        <td className="py-3 px-4 text-foreground">
                                                            {
                                                                record.employee
                                                                    .name
                                                            }
                                                        </td>
                                                        <td className="text-right py-3 px-4 text-foreground">
                                                            ${
                                                                record.baseSalary.toFixed(
                                                                    2
                                                                )
                                                            }
                                                        </td>
                                                        <td className="text-right py-3 px-4 text-green-400">
                                                            +$
                                                            {record.attendance.toFixed(
                                                                2
                                                            )}
                                                        </td>
                                                        <td className="text-right py-3 px-4 text-green-400">
                                                            +$
                                                            {record.completion.toFixed(
                                                                2
                                                            )}
                                                        </td>
                                                        <td className="text-right py-3 px-4 font-semibold text-foreground">
                                                            ${
                                                                record.totalAmount.toFixed(
                                                                    2
                                                                )
                                                            }
                                                        </td>
                                                        <td className="text-center py-3 px-4">
                                                            <span
                                                                className={`text-xs font-semibold px-2 py-1 rounded ${record.isPaid
                                                                    ? 'bg-green-500/10 text-green-400'
                                                                    : 'bg-yellow-500/10 text-yellow-400'
                                                                    }`}
                                                            >
                                                                {record.isPaid
                                                                    ? 'Paid'
                                                                    : 'Pending'}
                                                            </span>
                                                        </td>
                                                        <td className="text-center py-3 px-4">
                                                            {!record.isPaid && (
                                                                <Button
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        handleMarkAsPaid(
                                                                            record.id.toString()
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        markAsPaid.isPending
                                                                    }
                                                                >
                                                                    Mark Paid
                                                                </Button>
                                                            )}
                                                        </td>
                                                    </motion.tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </Card>
                    </>
                )}

                {overviewQuery.isLoading && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">
                            Loading salary data...
                        </p>
                    </div>
                )}
            </div>
        </AdminLayoutWrapper>
    )
}
