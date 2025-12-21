'use client'

import { ReactNode } from 'react'
import { AdminSidebar } from '@/components/admin/AdminSidebar'

interface AdminLayoutProps {
    children: ReactNode
    section: 'creation' | 'progress' | 'salary'
}

export function AdminLayoutWrapper({
    children,
    section,
}: AdminLayoutProps) {
    return (
        <div className="flex min-h-screen bg-background">
            <AdminSidebar activeSection={section} />
            <main className="flex-1 p-8">
                {children}
            </main>
        </div>
    )
}
