'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { trpc } from '@/lib/trpc'
import { AdminLayoutWrapper } from '@/components/admin/AdminLayoutWrapper'
import { motion } from 'framer-motion'

export default function ProgressPage() {
    const projectProgressQuery = trpc.admin.getAllProjects.useQuery()

    return (
        <AdminLayoutWrapper section="progress">
            <div className="max-w-6xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground">
                        Project Progress
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Monitor the overall progress of all active projects
                    </p>
                </div>

                {/* Stats Summary */}
                {projectProgressQuery.data && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <Card className="p-6 bg-card border border-border">
                            <p className="text-muted-foreground text-sm">
                                Total Projects
                            </p>
                            <p className="text-3xl font-bold text-foreground mt-2">
                                {projectProgressQuery.data.length}
                            </p>
                        </Card>
                        <Card className="p-6 bg-card border border-border">
                            <p className="text-muted-foreground text-sm">
                                Completed
                            </p>
                            <p className="text-3xl font-bold text-green-400 mt-2">
                                {
                                    projectProgressQuery.data.filter(
                                        (p: any) =>
                                            p.completionPercentage ===
                                            100
                                    ).length
                                }
                            </p>
                        </Card>
                        <Card className="p-6 bg-card border border-border">
                            <p className="text-muted-foreground text-sm">
                                Average Progress
                            </p>
                            <p className="text-3xl font-bold text-primary mt-2">
                                {Math.round(
                                    projectProgressQuery.data.reduce(
                                        (sum: number, p: any) =>
                                            sum +
                                            p.completionPercentage,
                                        0
                                    ) / projectProgressQuery.data.length || 0
                                )}
                                %
                            </p>
                        </Card>
                    </div>
                )}

                {/* Projects Grid */}
                {projectProgressQuery.isLoading && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">
                            Loading projects...
                        </p>
                    </div>
                )}

                {projectProgressQuery.data &&
                    projectProgressQuery.data.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">
                                No projects found. Create one in the
                                Creation section.
                            </p>
                        </div>
                    )}

                {projectProgressQuery.data && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {projectProgressQuery.data.map((project: any, idx: number) => (
                            <motion.div
                                key={project.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                            >
                                <Link href={`/admin/progress/${project.id}`}>
                                    <Card className="p-6 bg-card border border-border hover:border-primary transition-colors cursor-pointer h-full">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-lg font-semibold text-foreground">
                                                    {project.name}
                                                </h3>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    {project.totalAssignments}{' '}
                                                    assignments
                                                </p>
                                            </div>
                                            <span
                                                className={`text-sm font-semibold px-2 py-1 rounded ${project.status ===
                                                    'COMPLETED'
                                                    ? 'bg-green-500/10 text-green-400'
                                                    : 'bg-primary/10 text-primary'
                                                    }`}
                                            >
                                                {project.status}
                                            </span>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="mb-6">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-xs text-muted-foreground">
                                                    Progress
                                                </span>
                                                <span className="text-sm font-semibold text-foreground">
                                                    {
                                                        project.completionPercentage
                                                    }
                                                    %
                                                </span>
                                            </div>
                                            <div className="w-full bg-secondary/50 rounded-full h-2 overflow-hidden">
                                                <motion.div
                                                    className="bg-primary h-full rounded-full"
                                                    initial={{
                                                        width: 0,
                                                    }}
                                                    animate={{
                                                        width: `${project.completionPercentage}%`,
                                                    }}
                                                    transition={{
                                                        duration: 0.5,
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        {/* Stats */}
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-muted-foreground">
                                                    Completed
                                                </p>
                                                <p className="text-lg font-semibold text-foreground">
                                                    {
                                                        project.completedAssignments
                                                    }{' '}
                                                    / {project.totalAssignments}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground">
                                                    Status
                                                </p>
                                                <p className="text-lg font-semibold text-primary">
                                                    {project.status}
                                                </p>
                                            </div>
                                        </div>
                                    </Card>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </AdminLayoutWrapper>
    )
}
