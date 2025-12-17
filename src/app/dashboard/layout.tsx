import { ReactNode } from 'react'

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex h-screen flex-col bg-background">
            {/* Header */}
            <header className="border-b bg-white dark:bg-slate-950">
                <div className="flex items-center justify-between px-6 py-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">TIPL Dashboard</h1>
                        <p className="text-sm text-muted-foreground">Employee Monitoring System</p>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    )
}
