-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED');

-- AlterTable
ALTER TABLE "employees" ADD COLUMN     "baseSalary" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "managerId" INTEGER;

-- CreateTable
CREATE TABLE "managers" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'MANAGER',
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "managers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "ProjectStatus" NOT NULL DEFAULT 'ACTIVE',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "managerId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_assignments" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "taskDescription" TEXT,
    "completionPercentage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "salary_records" (
    "id" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "baseSalary" DOUBLE PRECISION NOT NULL,
    "attendance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "completion" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "deduction" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "paidDate" TIMESTAMP(3),
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "salary_records_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "managers_email_key" ON "managers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "managers_userId_key" ON "managers"("userId");

-- CreateIndex
CREATE INDEX "managers_email_idx" ON "managers"("email");

-- CreateIndex
CREATE INDEX "projects_status_idx" ON "projects"("status");

-- CreateIndex
CREATE INDEX "project_assignments_projectId_idx" ON "project_assignments"("projectId");

-- CreateIndex
CREATE INDEX "project_assignments_employeeId_idx" ON "project_assignments"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "project_assignments_projectId_employeeId_key" ON "project_assignments"("projectId", "employeeId");

-- CreateIndex
CREATE INDEX "salary_records_employeeId_idx" ON "salary_records"("employeeId");

-- CreateIndex
CREATE INDEX "salary_records_isPaid_idx" ON "salary_records"("isPaid");

-- CreateIndex
CREATE UNIQUE INDEX "salary_records_employeeId_month_year_key" ON "salary_records"("employeeId", "month", "year");

-- CreateIndex
CREATE INDEX "employees_managerId_idx" ON "employees"("managerId");

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "managers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "managers" ADD CONSTRAINT "managers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "managers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_assignments" ADD CONSTRAINT "project_assignments_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_assignments" ADD CONSTRAINT "project_assignments_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salary_records" ADD CONSTRAINT "salary_records_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;
