'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { trpc } from '@/lib/trpc'
import { AdminLayoutWrapper } from '@/components/admin/AdminLayoutWrapper'

export default function CreationPage() {
    const [activeTab, setActiveTab] = useState<
        'employee' | 'manager' | 'project'
    >('employee')

    return (
        <AdminLayoutWrapper section="creation">
            <div className="max-w-6xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground">
                        Creation Center
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Add employees, managers, and projects to the system
                    </p>
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-2 mb-8 border-b border-border">
                    {[
                        { id: 'employee', label: 'Add Employee' },
                        { id: 'manager', label: 'Add Manager' },
                        { id: 'project', label: 'Add Project' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() =>
                                setActiveTab(
                                    tab.id as
                                    | 'employee'
                                    | 'manager'
                                    | 'project'
                                )
                            }
                            className={`px-4 py-3 border-b-2 transition-colors ${activeTab === tab.id
                                ? 'border-primary text-primary'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {activeTab === 'employee' && <EmployeeForm />}
                    {activeTab === 'manager' && <ManagerForm />}
                    {activeTab === 'project' && <ProjectForm />}
                </motion.div>
            </div>
        </AdminLayoutWrapper>
    )
}

function EmployeeForm() {
    const [formData, setFormData] = useState({
        sapId: '',
        name: '',
        email: '',
        department: '',
        position: '',
        role: 'EMPLOYEE',
    })
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{
        type: 'success' | 'error'
        text: string
    } | null>(null)

    const createEmployee = trpc.admin.createEmployee.useMutation()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        try {
            await createEmployee.mutateAsync({
                sapId: formData.sapId,
                name: formData.name,
                email: formData.email,
                department: formData.department,
                position: formData.position,
                role: formData.role as 'EMPLOYEE' | 'MANAGER' | 'ADMIN',
            })

            setMessage({
                type: 'success',
                text: 'Employee created successfully!',
            })
            setFormData({
                sapId: '',
                name: '',
                email: '',
                department: '',
                position: '',
                role: 'EMPLOYEE',
            })
        } catch (error: any) {
            setMessage({
                type: 'error',
                text: error.message || 'Failed to create employee',
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="p-6 bg-card border border-border">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        placeholder="SAP ID"
                        value={formData.sapId}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                sapId: e.target.value,
                            })
                        }
                        required
                    />
                    <Input
                        placeholder="Full Name"
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

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                email: e.target.value,
                            })
                        }
                        required
                    />
                    <Input
                        placeholder="Position"
                        value={formData.position}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                position: e.target.value,
                            })
                        }
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        placeholder="Department"
                        value={formData.department}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                department: e.target.value,
                            })
                        }
                        required
                    />
                    <select
                        value={formData.role}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                role: e.target.value,
                            })
                        }
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <option value="EMPLOYEE">Employee</option>
                        <option value="MANAGER">Manager</option>
                        <option value="ADMIN">Admin</option>
                    </select>
                </div>

                {message && (
                    <div
                        className={`p-3 rounded-lg text-sm ${message.type === 'success'
                            ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                            }`}
                    >
                        {message.text}
                    </div>
                )}

                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full"
                >
                    {loading ? 'Creating...' : 'Create Employee'}
                </Button>
            </form>
        </Card>
    )
}

function ManagerForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        department: '',
        password: '',
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
                password: '',
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
        <Card className="p-6 bg-card border border-border">
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            name: e.target.value,
                        })
                    }
                    required
                />

                <Input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            email: e.target.value,
                        })
                    }
                    required
                />

                <Input
                    placeholder="Department"
                    value={formData.department}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            department: e.target.value,
                        })
                    }
                    required
                />

                <Input
                    type="password"
                    placeholder="Password (optional)"
                    value={formData.password}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            password: e.target.value,
                        })
                    }
                />

                {message && (
                    <div
                        className={`p-3 rounded-lg text-sm ${message.type === 'success'
                            ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                            }`}
                    >
                        {message.text}
                    </div>
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
    )
}

function ProjectForm() {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
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
                description: formData.description || undefined,
                startDate: formData.startDate,
                endDate: formData.endDate || undefined,
                managerId: '1',
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
        <Card className="p-6 bg-card border border-border">
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    placeholder="Project Name"
                    value={formData.name}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            name: e.target.value,
                        })
                    }
                    required
                />

                <textarea
                    placeholder="Description"
                    value={formData.description}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            description: e.target.value,
                        })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={4}
                />

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        type="date"
                        placeholder="Start Date"
                        value={formData.startDate}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                startDate: e.target.value,
                            })
                        }
                        required
                    />
                    <Input
                        type="date"
                        placeholder="End Date"
                        value={formData.endDate}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                endDate: e.target.value,
                            })
                        }
                    />
                </div>

                {message && (
                    <div
                        className={`p-3 rounded-lg text-sm ${message.type === 'success'
                            ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                            }`}
                    >
                        {message.text}
                    </div>
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
    )
}
