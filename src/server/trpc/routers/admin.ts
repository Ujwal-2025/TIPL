import { z } from "zod";
import { adminProcedure, router } from "../trpc";
import { prisma } from "@/lib/prisma";

export const adminRouter = router({
    // EMPLOYEE MANAGEMENT
    createEmployee: adminProcedure
        .input(
            z.object({
                name: z.string().min(1, "Name is required"),
                email: z.string().email("Valid email required"),
                sapId: z.string().min(1, "SAP ID is required"),
                department: z.string().min(1, "Department is required"),
                position: z.string().min(1, "Position is required"),
                role: z.enum(["EMPLOYEE", "MANAGER", "ADMIN"]).default("EMPLOYEE"),
            })
        )
        .mutation(async ({ input }) => {
            try {
                const employee = await prisma.employee.create({
                    data: {
                        name: input.name,
                        email: input.email,
                        sapId: input.sapId,
                        department: input.department,
                        position: input.position,
                        role: input.role,
                    },
                });
                return { success: true, employee };
            } catch (error) {
                throw new Error(`Failed to create employee: ${error}`);
            }
        }),

    getAllEmployees: adminProcedure.query(async () => {
        try {
            const employees = await prisma.employee.findMany({
                include: {
                    manager: true,
                    projectAssignments: {
                        include: {
                            project: true,
                        },
                    },
                },
                orderBy: { createdAt: "desc" },
            });
            return employees;
        } catch (error) {
            throw new Error(`Failed to fetch employees: ${error}`);
        }
    }),

    // MANAGER MANAGEMENT
    createManager: adminProcedure
        .input(
            z.object({
                name: z.string().min(1, "Name is required"),
                email: z.string().email("Valid email required"),
                department: z.string().min(1, "Department is required"),
            })
        )
        .mutation(async ({ input }) => {
            try {
                const manager = await prisma.manager.create({
                    data: {
                        name: input.name,
                        email: input.email,
                        department: input.department,
                    },
                    include: {
                        managedEmployees: true,
                        projects: true,
                    },
                });
                return { success: true, manager };
            } catch (error) {
                throw new Error(`Failed to create manager: ${error}`);
            }
        }),

    getAllManagers: adminProcedure.query(async () => {
        try {
            const managers = await prisma.manager.findMany({
                include: {
                    managedEmployees: true,
                    projects: true,
                },
                orderBy: { createdAt: "desc" },
            });
            return managers;
        } catch (error) {
            throw new Error(`Failed to fetch managers: ${error}`);
        }
    }),

    // PROJECT MANAGEMENT
    createProject: adminProcedure
        .input(
            z.object({
                name: z.string().min(1, "Project name is required"),
                description: z.string().optional(),
                startDate: z.string().transform((d) => new Date(d)),
                endDate: z.string().optional().transform((d) => d ? new Date(d) : null),
                managerId: z.string().transform((id) => parseInt(id, 10)),
            })
        )
        .mutation(async ({ input }) => {
            try {
                const project = await prisma.project.create({
                    data: {
                        name: input.name,
                        description: input.description || "",
                        startDate: input.startDate,
                        endDate: input.endDate,
                        managerId: input.managerId,
                        status: "ACTIVE",
                    },
                    include: {
                        manager: true,
                        assignments: {
                            include: {
                                employee: true,
                            },
                        },
                    },
                });
                return { success: true, project };
            } catch (error) {
                throw new Error(`Failed to create project: ${error}`);
            }
        }),

    getAllProjects: adminProcedure.query(async () => {
        try {
            const projects = await prisma.project.findMany({
                include: {
                    manager: true,
                    assignments: {
                        include: {
                            employee: true,
                        },
                    },
                },
                orderBy: { createdAt: "desc" },
            });

            // Calculate completion percentage for each project
            const projectsWithProgress = projects.map((project) => {
                const totalAssignments = project.assignments.length;
                if (totalAssignments === 0) {
                    return {
                        ...project,
                        completionPercentage: 0,
                        completedAssignments: 0,
                    };
                }

                const completedAssignments = project.assignments.filter(
                    (a) => a.completionPercentage === 100
                ).length;
                const avgCompletion =
                    project.assignments.reduce((sum, a) => sum + a.completionPercentage, 0) /
                    totalAssignments;

                return {
                    ...project,
                    completionPercentage: Math.round(avgCompletion),
                    completedAssignments,
                };
            });

            return projectsWithProgress;
        } catch (error) {
            throw new Error(`Failed to fetch projects: ${error}`);
        }
    }),

    getProjectDetail: adminProcedure
        .input(z.object({ projectId: z.string().transform((id) => parseInt(id, 10)) }))
        .query(async ({ input }) => {
            try {
                const project = await prisma.project.findUnique({
                    where: { id: input.projectId },
                    include: {
                        manager: true,
                        assignments: {
                            include: {
                                employee: true,
                            },
                            orderBy: { assignedAt: "desc" },
                        },
                    },
                });

                if (!project) {
                    throw new Error("Project not found");
                }

                const completed = project?.assignments?.filter(
                    (a: any) => a.completionPercentage === 100
                ) || [];
                const pending = project?.assignments?.filter(
                    (a: any) => a.completionPercentage < 100
                ) || [];
                const avgCompletion =
                    project?.assignments && project.assignments.length > 0
                        ? Math.round(
                            project.assignments.reduce((sum: number, a: any) => sum + a.completionPercentage, 0) /
                            project.assignments.length
                        )
                        : 0;

                return {
                    ...project,
                    completionPercentage: avgCompletion,
                    completed,
                    pending,
                };
            } catch (error) {
                throw new Error(`Failed to fetch project detail: ${error}`);
            }
        }),

    // PROJECT ASSIGNMENT MANAGEMENT
    assignProjectToEmployee: adminProcedure
        .input(
            z.object({
                projectId: z.string().transform((id) => parseInt(id, 10)),
                employeeId: z.string().transform((id) => parseInt(id, 10)),
                taskDescription: z.string().optional(),
            })
        )
        .mutation(async ({ input }) => {
            try {
                const assignment = await prisma.projectAssignment.create({
                    data: {
                        projectId: input.projectId,
                        employeeId: input.employeeId,
                        taskDescription: input.taskDescription || "",
                        completionPercentage: 0,
                    },
                    include: {
                        project: true,
                        employee: true,
                    },
                });
                return { success: true, assignment };
            } catch (error) {
                throw new Error(`Failed to assign project: ${error}`);
            }
        }),

    updateProjectAssignmentProgress: adminProcedure
        .input(
            z.object({
                assignmentId: z.string().transform((id) => parseInt(id, 10)),
                completionPercentage: z.number().min(0).max(100),
            })
        )
        .mutation(async ({ input }) => {
            try {
                const assignment = await prisma.projectAssignment.update({
                    where: { id: input.assignmentId },
                    data: {
                        completionPercentage: input.completionPercentage,
                        completedAt:
                            input.completionPercentage === 100 ? new Date() : null,
                    },
                    include: {
                        project: true,
                        employee: true,
                    },
                });
                return { success: true, assignment };
            } catch (error) {
                throw new Error(`Failed to update assignment: ${error}`);
            }
        }),

    // SALARY MANAGEMENT
    getSalaryOverview: adminProcedure.query(async () => {
        try {
            const salaryRecords = await prisma.salaryRecord.findMany({
                include: {
                    employee: true,
                },
                orderBy: { month: "desc" },
            });

            const totalOwed = salaryRecords
                .filter((r) => !r.isPaid)
                .reduce((sum, r) => sum + r.totalAmount, 0);

            const totalPaid = salaryRecords
                .filter((r) => r.isPaid)
                .reduce((sum, r) => sum + r.totalAmount, 0);

            const pending = salaryRecords
                .filter((r) => !r.isPaid)
                .reduce((sum, r) => sum + 1, 0);

            return {
                totalOwed,
                totalPaid,
                pendingPayments: pending,
                records: salaryRecords,
            };
        } catch (error) {
            throw new Error(`Failed to fetch salary overview: ${error}`);
        }
    }),

    calculateSalaryRecord: adminProcedure
        .input(
            z.object({
                employeeId: z.string().transform((id) => parseInt(id, 10)),
                month: z.number().min(1).max(12),
                year: z.number().min(2000),
                baseSalary: z.number().positive(),
                attendance: z.number().nonnegative().default(0),
                completion: z.number().nonnegative().default(0),
                deduction: z.number().nonnegative().default(0),
            })
        )
        .mutation(async ({ input }) => {
            try {
                const totalAmount =
                    input.baseSalary +
                    input.attendance +
                    input.completion -
                    input.deduction;

                // Check if record exists for this month/year
                const existingRecord = await prisma.salaryRecord.findFirst({
                    where: {
                        employeeId: input.employeeId,
                        month: input.month,
                        year: input.year,
                    },
                });

                let salaryRecord;
                if (existingRecord) {
                    salaryRecord = await prisma.salaryRecord.update({
                        where: { id: existingRecord.id },
                        data: {
                            baseSalary: input.baseSalary,
                            attendance: input.attendance,
                            completion: input.completion,
                            deduction: input.deduction,
                            totalAmount,
                        },
                        include: { employee: true },
                    });
                } else {
                    salaryRecord = await prisma.salaryRecord.create({
                        data: {
                            employeeId: input.employeeId,
                            baseSalary: input.baseSalary,
                            attendance: input.attendance,
                            completion: input.completion,
                            deduction: input.deduction,
                            totalAmount,
                            month: input.month,
                            year: input.year,
                            isPaid: false,
                        },
                        include: { employee: true },
                    });
                }

                return { success: true, salaryRecord };
            } catch (error) {
                throw new Error(`Failed to calculate salary: ${error}`);
            }
        }),

    markSalaryAsPaid: adminProcedure
        .input(z.object({ salaryRecordId: z.string().transform((id) => parseInt(id, 10)) }))
        .mutation(async ({ input }) => {
            try {
                const salaryRecord = await prisma.salaryRecord.update({
                    where: { id: input.salaryRecordId },
                    data: { isPaid: true },
                    include: { employee: true },
                });
                return { success: true, salaryRecord };
            } catch (error) {
                throw new Error(`Failed to mark salary as paid: ${error}`);
            }
        }),
});
