'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface AdminSidebarProps {
    activeSection: 'creation' | 'progress' | 'salary' | 'attendance'
}

export function AdminSidebar({ activeSection }: AdminSidebarProps) {
    const sections = [
        {
            id: 'creation',
            label: 'Creation',
            description: 'Add employees, managers, projects',
            href: '/admin/creation',
        },
        {
            id: 'progress',
            label: 'Progress',
            description: 'Track project progress',
            href: '/admin/progress',
        },
        {
            id: 'salary',
            label: 'Salary',
            description: 'Manage salary & payments',
            href: '/admin/salary',
        },
        {
            id: 'attendance',
            label: 'Attendance',
            description: 'View attendance charts',
            href: '/admin/attendance/group',
        },
    ]

    return (
        <aside className="w-64 bg-card border-r border-border min-h-screen p-6 glassy-sidebar">
            <div className="mb-12">
                <h2 className="text-2xl font-bold text-foreground">Admin</h2>
                <p className="text-sm text-muted-foreground mt-1">
                    System Management
                </p>
            </div>

            <nav className="space-y-2">
                {sections.map((section) => (
                    <Link
                        key={section.id}
                        href={section.href}
                        className={cn(
                            'relative block p-4 rounded-lg transition-all duration-200 glassy-nav__item',
                            activeSection === section.id
                                ? 'glassy-nav__item--active'
                                : ''
                        )}
                    >
                        <div
                            className={cn(
                                'font-semibold transition-all duration-200',
                                activeSection === section.id
                                    ? 'text-primary brightness-110'
                                    : 'text-foreground'
                            )}
                        >
                            {section.label}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {section.description}
                        </p>
                    </Link>
                ))}
            </nav>

            <div className="mt-12 pt-6 border-t border-border">
                <p className="text-xs text-muted-foreground text-center">
                    Admin Dashboard v1.0
                </p>
            </div>
        </aside>
    )
}
