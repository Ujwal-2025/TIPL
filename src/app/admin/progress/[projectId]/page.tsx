'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { trpc } from '@/lib/trpc'
import { AdminLayoutWrapper } from '@/components/admin/AdminLayoutWrapper'
import { motion } from 'framer-motion'

export default function ProjectDetailPage() {
    const params = useParams()
    const router = useRouter()
    const projectId = parseInt(params.projectId as string)

    const projectProgressQuery = trpc.admin.getProjectDetail.useQuery({
        projectId: projectId.toString(),
    })
    const updateAssignment = trpc.admin.updateProjectAssignmentProgress.useMutation()

    const [editingId, setEditingId] = useState<number | null>(null)
    const [editingValue, setEditingValue] = useState<string>('')

    const handleEditStart = (
        assignmentId: number,
        currentValue: number
    ) => {
        setEditingId(assignmentId)
        setEditingValue(currentValue.toString())
    }

    const handleEditSave = async (assignmentId: number) => {
        try {
            await updateAssignment.mutateAsync({
                assignmentId: assignmentId.toString(),
                completionPercentage: parseInt(editingValue),
            })
            setEditingId(null)
            projectProgressQuery.refetch()
        } catch (error) {
            alert('Failed to update assignment')
        }
    }

    if (projectProgressQuery.isLoading) {
        return (
            <AdminLayoutWrapper section="progress">
                <div className="text-center py-12">
                    <p className="text-muted-foreground">
                        Loading project details...
                    </p>
                </div>
            </AdminLayoutWrapper>
        )
    }

    if (!projectProgressQuery.data) {
        return (
            <AdminLayoutWrapper section="progress">
                <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">
                        Project not found
                    </p>
                    <Button onClick={() => router.back()}>
                        Go Back
                    </Button>
                </div>
            </AdminLayoutWrapper>
        )
    }

    const project = projectProgressQuery.data

    return (
        <AdminLayoutWrapper section="progress">
            <div className="max-w-6xl">
                {/* Header with Back Button */}
                <div className="mb-8 flex items-start justify-between">
                    <div>
                        <button
                            onClick={() => router.back()}
                            className="text-primary hover:text-primary/80 text-sm mb-4"
                        >
                            ← Back to Projects
                        </button>
                        <h1 className="text-3xl font-bold text-foreground">
                            {project.name}
                        </h1>
                        {project.description && (
                            <p className="text-muted-foreground mt-2">
                                {project.description}
                            </p>
                        )}
                    </div>
                    <span
                        className={`text-sm font-semibold px-3 py-1 rounded ${project.status === 'COMPLETED'
                            ? 'bg-green-500/10 text-green-400'
                            : 'bg-primary/10 text-primary'
                            }`}
                    >
                        {project.status}
                    </span>
                </div>

                {/* Overview Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <Card className="p-4 bg-card border border-border">
                        <p className="text-muted-foreground text-xs">
                            Overall Progress
                        </p>
                        <p className="text-2xl font-bold text-primary mt-1">
                            {project.completionPercentage}%
                        </p>
                    </Card>
                    <Card className="p-4 bg-card border border-border">
                        <p className="text-muted-foreground text-xs">
                            Total Assignments
                        </p>
                        <p className="text-2xl font-bold text-foreground mt-1">
                            {project.assignments?.length || 0}
                        </p>
                    </Card>
                    <Card className="p-4 bg-card border border-border">
                        <p className="text-muted-foreground text-xs">
                            Completed
                        </p>
                        <p className="text-2xl font-bold text-green-400 mt-1">
                            {project.completed?.length || 0}
                        </p>
                    </Card>
                    <Card className="p-4 bg-card border border-border">
                        <p className="text-muted-foreground text-xs">
                            Pending
                        </p>
                        <p className="text-2xl font-bold text-yellow-400 mt-1">
                            {
                                (project.assignments?.length || 0) -
                                (project.completed?.length || 0)
                            }
                        </p>
                    </Card>
                </div>

                {/* Project Timeline */}
                <Card className="p-6 bg-card border border-border mb-8">
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                        Timeline
                    </h3>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Start Date
                            </p>
                            <p className="text-foreground font-medium mt-1">
                                {new Date(
                                    project.startDate
                                ).toLocaleDateString()}
                            </p>
                        </div>
                        {project.endDate && (
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    End Date
                                </p>
                                <p className="text-foreground font-medium mt-1">
                                    {new Date(
                                        project.endDate
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Pending Assignments */}
                <Card className="p-6 bg-card border border-border">
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                        Assignments ({project.pending?.length || 0}{' '}
                        pending)
                    </h3>

                    {!project.pending || project.pending.length === 0 ? (
                        <p className="text-muted-foreground text-sm">
                            All assignments are complete!
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {project.pending.map(
                                (assignment: any, idx: number) => (
                                    <motion.div
                                        key={assignment.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            delay: idx * 0.05,
                                        }}
                                        className="p-4 bg-background border border-border rounded-lg"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <p className="font-semibold text-foreground">
                                                    {
                                                        assignment.employeeName
                                                    }
                                                </p>
                                                {assignment.taskDescription && (
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        {
                                                            assignment.taskDescription
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                            {editingId === assignment.id ? (
                                                <div className="flex gap-2">
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        max="100"
                                                        value={editingValue}
                                                        onChange={(e) =>
                                                            setEditingValue(
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-20 h-8 text-sm"
                                                    />
                                                    <Button
                                                        size="sm"
                                                        onClick={() =>
                                                            handleEditSave(
                                                                assignment.id
                                                            )
                                                        }
                                                        disabled={
                                                            updateAssignment.isPending
                                                        }
                                                    >
                                                        Save
                                                    </Button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() =>
                                                        handleEditStart(
                                                            assignment.id,
                                                            assignment.completionPercentage
                                                        )
                                                    }
                                                    className="text-primary hover:text-primary/80 text-sm font-medium"
                                                >
                                                    {
                                                        assignment.completionPercentage
                                                    }
                                                    %
                                                </button>
                                            )}
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="w-full bg-secondary/50 rounded-full h-2 overflow-hidden">
                                            <motion.div
                                                className="bg-primary h-full rounded-full"
                                                initial={{
                                                    width: 0,
                                                }}
                                                animate={{
                                                    width: `${assignment.completionPercentage}%`,
                                                }}
                                                transition={{
                                                    duration: 0.5,
                                                }}
                                            />
                                        </div>

                                        <p className="text-xs text-muted-foreground mt-2">
                                            Assigned on{' '}
                                            {new Date(
                                                assignment.assignedAt
                                            ).toLocaleDateString()}
                                        </p>
                                    </motion.div>
                                )
                            )}
                        </div>
                    )}
                </Card>
            </div>
        </AdminLayoutWrapper>
    )
}
