'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { trpc } from '@/lib/trpc'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function ManagerCreationPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        department: '',
    })
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{
        type: 'success' | 'error'
        text: string
    } | null>(null)

    const createManager = trpc.admin.createManager.useMutation()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        try {
            await createManager.mutateAsync({
                name: formData.name,
                email: formData.email,
                department: formData.department,
            })

            setMessage({
                type: 'success',
                text: 'Manager created successfully!',
            })
            setFormData({
                name: '',
                email: '',
                department: '',
            })
        } catch (error: any) {
            setMessage({
                type: 'error',
                text: error.message || 'Failed to create manager',
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
                        Create Manager
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Add a new manager to the system
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
                                    Full Name *
                                </label>
                                <Input
                                    placeholder="Enter full name"
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
                                    Email *
                                </label>
                                <Input
                                    type="email"
                                    placeholder="Enter email"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            email: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-foreground">
                                    Department *
                                </label>
                                <Input
                                    placeholder="Enter department"
                                    value={formData.department}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            department: e.target.value,
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
                                {loading ? 'Creating...' : 'Create Manager'}
                            </Button>
                        </form>
                    </Card>
                </motion.div>
            </div>
        </div>
    )
}
