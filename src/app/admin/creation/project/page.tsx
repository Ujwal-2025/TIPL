'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { trpc } from '@/lib/trpc'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function ProjectCreationPage() {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        managerId: '1',
    })
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{
        type: 'success' | 'error'
        text: string
    } | null>(null)

    const createProject = trpc.admin.createProject.useMutation()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        try {
            await createProject.mutateAsync({
                name: formData.name,
                description: formData.description,
                startDate: formData.startDate,
                endDate: formData.endDate,
                managerId: formData.managerId,
            })

            setMessage({
                type: 'success',
                text: 'Project created successfully!',
            })
            setFormData({
                name: '',
                description: '',
                startDate: '',
                endDate: '',
                managerId: '1',
            })
        } catch (error: any) {
            setMessage({
                type: 'error',
                text: error.message || 'Failed to create project',
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-2xl mx-auto">
                {/* Back Button */}
                <Link href="/luxury">
                    <Button
                        variant="outline"
                        className="mb-6 gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Button>
                </Link>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold text-foreground">
                        Create Project
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Add a new project to the system
                    </p>
                </motion.div>

                {/* Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="p-6 bg-card border border-border">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-foreground">
                                    Project Name *
                                </label>
                                <Input
                                    placeholder="Enter project name"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            name: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-foreground">
                                    Description *
                                </label>
                                <textarea
                                    placeholder="Enter project description"
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            description: e.target.value,
                                        })
                                    }
                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-foreground">
                                        Start Date *
                                    </label>
                                    <Input
                                        type="date"
                                        value={formData.startDate}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                startDate: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-foreground">
                                        End Date *
                                    </label>
                                    <Input
                                        type="date"
                                        value={formData.endDate}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                endDate: e.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-foreground">
                                    Manager ID *
                                </label>
                                <Input
                                    placeholder="Enter manager ID"
                                    value={formData.managerId}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            managerId: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>

                            {message && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className={`p-3 rounded-lg text-sm ${message.type === 'success'
                                        ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                        }`}
                                >
                                    {message.text}
                                </motion.div>
                            )}

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full"
                            >
                                {loading ? 'Creating...' : 'Create Project'}
                            </Button>
                        </form>
                    </Card>
                </motion.div>
            </div>
        </div>
    )
}
