'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { trpc } from '@/lib/trpc'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'

interface FormData {
    // Step 1: Basic Identity
    firstName: string
    lastName: string
    fatherName: string
    // Step 2: Contact & Address
    address: string
    email: string
    // Step 3: Government ID
    panNumber: string
    idType: string
    idNumber: string
    // Step 4: Work Profile
    designation: string
    department: string
    companyBranch: string
    employerName: string
    previousEmployerName: string
    // Step 5: Bank & PF
    pfId: string
    bankAccountNumber: string
    bankName: string
    ifscCode: string
    bankBranch: string
    // Step 6: Employment & Salary
    dateOfJoining: string
    salaryPerMonth: string
}

const initialFormData: FormData = {
    firstName: '',
    lastName: '',
    fatherName: '',
    address: '',
    email: '',
    panNumber: '',
    idType: '',
    idNumber: '',
    designation: '',
    department: '',
    companyBranch: '',
    employerName: '',
    previousEmployerName: '',
    pfId: '',
    bankAccountNumber: '',
    bankName: '',
    ifscCode: '',
    bankBranch: '',
    dateOfJoining: '',
    salaryPerMonth: '',
}

const TOTAL_STEPS = 6

export default function AttendanceCreationPage() {
    const [currentStep, setCurrentStep] = useState(1)
    const [formData, setFormData] = useState<FormData>(initialFormData)
    const [direction, setDirection] = useState<'forward' | 'backward'>('forward')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const createAttendance = trpc.attendance.createAttendanceRecord.useMutation()

    const updateField = (field: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const validateStep = (step: number): boolean => {
        switch (step) {
            case 1:
                return !!(formData.firstName && formData.lastName && formData.fatherName)
            case 2:
                return !!(formData.address && formData.email)
            case 3:
                return !!formData.panNumber
            case 4:
                return !!(formData.designation && formData.department && formData.companyBranch && formData.employerName)
            case 5:
                return !!(formData.pfId && formData.bankAccountNumber && formData.bankName && formData.ifscCode && formData.bankBranch)
            case 6:
                return !!(formData.dateOfJoining && formData.salaryPerMonth)
            default:
                return false
        }
    }

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setDirection('forward')
            setCurrentStep(prev => Math.min(prev + 1, TOTAL_STEPS))
        }
    }

    const handleBack = () => {
        setDirection('backward')
        setCurrentStep(prev => Math.max(prev - 1, 1))
    }

    const handleSubmit = async () => {
        if (!validateStep(6)) return

        setIsSubmitting(true)
        try {
            await createAttendance.mutateAsync({
                ...formData,
                salaryPerMonth: parseFloat(formData.salaryPerMonth),
            } as any)

            alert('Attendance record created successfully!')
            setFormData(initialFormData)
            setCurrentStep(1)
        } catch (error) {
            alert('Failed to create attendance record')
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const slideVariants = {
        enter: {
            x: direction === 'forward' ? 300 : -300,
            opacity: 0,
        },
        center: {
            x: 0,
            opacity: 1,
        },
        exit: {
            x: direction === 'forward' ? -300 : 300,
            opacity: 0,
        },
    }

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/admin/creation">
                        <Button variant="outline" className="mb-6 gap-2">
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold text-foreground">
                        New Attendance Record
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Complete all steps to create an attendance record
                    </p>
                </div>

                {/* Progress Indicator */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">
                            Step {currentStep} of {TOTAL_STEPS}
                        </span>
                        <span className="text-sm text-muted-foreground">
                            {Math.round((currentStep / TOTAL_STEPS) * 100)}%
                        </span>
                    </div>
                    <div className="flex gap-2">
                        {Array.from({ length: TOTAL_STEPS }).map((_, idx) => (
                            <div
                                key={idx}
                                className={`h-2 flex-1 rounded-full transition-all duration-300 ${idx < currentStep
                                        ? 'bg-primary'
                                        : 'bg-secondary'
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Form Steps */}
                <Card className="p-8 bg-card border border-border overflow-hidden">
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={currentStep}
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: { type: 'spring', stiffness: 300, damping: 30 },
                                opacity: { duration: 0.2 },
                            }}
                        >
                            {/* Step 1: Basic Identity */}
                            {currentStep === 1 && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-2xl font-semibold text-foreground mb-2">
                                            Basic Identity
                                        </h2>
                                        <p className="text-sm text-muted-foreground">
                                            Let's start with your basic information
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-foreground">
                                            First Name *
                                        </label>
                                        <Input
                                            placeholder="Enter first name"
                                            value={formData.firstName}
                                            onChange={(e) => updateField('firstName', e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-foreground">
                                            Last Name *
                                        </label>
                                        <Input
                                            placeholder="Enter last name"
                                            value={formData.lastName}
                                            onChange={(e) => updateField('lastName', e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-foreground">
                                            Father's Name *
                                        </label>
                                        <Input
                                            placeholder="Enter father's name"
                                            value={formData.fatherName}
                                            onChange={(e) => updateField('fatherName', e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Contact & Address */}
                            {currentStep === 2 && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-2xl font-semibold text-foreground mb-2">
                                            Contact & Address
                                        </h2>
                                        <p className="text-sm text-muted-foreground">
                                            How can we reach you?
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-foreground">
                                            Address *
                                        </label>
                                        <textarea
                                            placeholder="Enter complete address"
                                            value={formData.address}
                                            onChange={(e) => updateField('address', e.target.value)}
                                            className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-foreground">
                                            Email Address *
                                        </label>
                                        <Input
                                            type="email"
                                            placeholder="Enter email address"
                                            value={formData.email}
                                            onChange={(e) => updateField('email', e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Government ID */}
                            {currentStep === 3 && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-2xl font-semibold text-foreground mb-2">
                                            Government Identification
                                        </h2>
                                        <p className="text-sm text-muted-foreground">
                                            Secure and confidential
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-foreground">
                                            PAN Number *
                                        </label>
                                        <Input
                                            placeholder="Enter PAN number"
                                            value={formData.panNumber}
                                            onChange={(e) => updateField('panNumber', e.target.value.toUpperCase())}
                                            maxLength={10}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-foreground">
                                            ID Type (Optional)
                                        </label>
                                        <select
                                            value={formData.idType}
                                            onChange={(e) => updateField('idType', e.target.value)}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                        >
                                            <option value="">Select ID type</option>
                                            <option value="Aadhar">Aadhar</option>
                                            <option value="Passport">Passport</option>
                                        </select>
                                    </div>

                                    {formData.idType && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                        >
                                            <label className="block text-sm font-medium mb-2 text-foreground">
                                                {formData.idType} Number
                                            </label>
                                            <Input
                                                placeholder={`Enter ${formData.idType} number`}
                                                value={formData.idNumber}
                                                onChange={(e) => updateField('idNumber', e.target.value)}
                                            />
                                        </motion.div>
                                    )}
                                </div>
                            )}

                            {/* Step 4: Work Profile */}
                            {currentStep === 4 && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-2xl font-semibold text-foreground mb-2">
                                            Work Profile
                                        </h2>
                                        <p className="text-sm text-muted-foreground">
                                            Your employment details
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2 text-foreground">
                                                Designation *
                                            </label>
                                            <Input
                                                placeholder="Enter designation"
                                                value={formData.designation}
                                                onChange={(e) => updateField('designation', e.target.value)}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2 text-foreground">
                                                Department *
                                            </label>
                                            <Input
                                                placeholder="Enter department"
                                                value={formData.department}
                                                onChange={(e) => updateField('department', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-foreground">
                                            Company Branch *
                                        </label>
                                        <Input
                                            placeholder="Enter company branch"
                                            value={formData.companyBranch}
                                            onChange={(e) => updateField('companyBranch', e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-foreground">
                                            Employer Name *
                                        </label>
                                        <Input
                                            placeholder="Enter employer name"
                                            value={formData.employerName}
                                            onChange={(e) => updateField('employerName', e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-foreground">
                                            Previous Employer Name (Optional)
                                        </label>
                                        <Input
                                            placeholder="Enter previous employer name"
                                            value={formData.previousEmployerName}
                                            onChange={(e) => updateField('previousEmployerName', e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Step 5: Bank & PF Details */}
                            {currentStep === 5 && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-2xl font-semibold text-foreground mb-2">
                                            Bank & PF Details
                                        </h2>
                                        <p className="text-sm text-muted-foreground">
                                            Financial information for payroll
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-foreground">
                                            PF ID *
                                        </label>
                                        <Input
                                            placeholder="Enter PF ID"
                                            value={formData.pfId}
                                            onChange={(e) => updateField('pfId', e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-foreground">
                                            Bank Account Number *
                                        </label>
                                        <Input
                                            placeholder="Enter bank account number"
                                            value={formData.bankAccountNumber}
                                            onChange={(e) => updateField('bankAccountNumber', e.target.value)}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2 text-foreground">
                                                Bank Name *
                                            </label>
                                            <Input
                                                placeholder="Enter bank name"
                                                value={formData.bankName}
                                                onChange={(e) => updateField('bankName', e.target.value)}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2 text-foreground">
                                                IFSC Code *
                                            </label>
                                            <Input
                                                placeholder="Enter IFSC code"
                                                value={formData.ifscCode}
                                                onChange={(e) => updateField('ifscCode', e.target.value.toUpperCase())}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-foreground">
                                            Bank Branch *
                                        </label>
                                        <Input
                                            placeholder="Enter bank branch"
                                            value={formData.bankBranch}
                                            onChange={(e) => updateField('bankBranch', e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Step 6: Employment & Salary */}
                            {currentStep === 6 && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-2xl font-semibold text-foreground mb-2">
                                            Employment & Salary
                                        </h2>
                                        <p className="text-sm text-muted-foreground">
                                            Final details to complete your record
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-foreground">
                                            Date of Joining *
                                        </label>
                                        <Input
                                            type="date"
                                            value={formData.dateOfJoining}
                                            onChange={(e) => updateField('dateOfJoining', e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-foreground">
                                            Salary per Month *
                                        </label>
                                        <Input
                                            type="number"
                                            placeholder="Enter monthly salary"
                                            value={formData.salaryPerMonth}
                                            onChange={(e) => updateField('salaryPerMonth', e.target.value)}
                                        />
                                    </div>

                                    <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                                        <p className="text-sm text-foreground">
                                            <Check className="inline w-4 h-4 mr-2 text-primary" />
                                            Review all information before submitting
                                        </p>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8 pt-6 border-t border-border">
                        <Button
                            variant="outline"
                            onClick={handleBack}
                            disabled={currentStep === 1}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>

                        {currentStep < TOTAL_STEPS ? (
                            <Button
                                onClick={handleNext}
                                disabled={!validateStep(currentStep)}
                            >
                                Next
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        ) : (
                            <Button
                                onClick={handleSubmit}
                                disabled={!validateStep(currentStep) || isSubmitting}
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit'}
                                <Check className="w-4 h-4 ml-2" />
                            </Button>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    )
}
