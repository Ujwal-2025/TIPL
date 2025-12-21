# Admin Dashboard - Implementation Guide

## Overview

The admin dashboard has been fully implemented with three main sections for managing the TIPL system:

1. **Creation Area** - Add employees, managers, and projects
2. **Progress Area** - Track project progress and completion
3. **Salary Area** - Manage salary calculations and payments

## Architecture

### Database Schema Updates

The following new models have been added to Prisma:

#### Manager
- Separate model for managing managers
- Linked to User model for authentication
- Can oversee multiple employees and projects

#### Project
- Stores project information (name, description, timeline, status)
- Links to Manager (responsible manager)
- Contains multiple ProjectAssignments

#### ProjectAssignment
- Junction model between Project and Employee
- Tracks completion percentage and timeline
- Stores task descriptions

#### SalaryRecord
- Tracks monthly salary calculations for each employee
- Stores base salary, bonuses (attendance & completion), and payment status
- Unique constraint on (employeeId, month, year)

#### Updates to Employee Model
- Added `baseSalary` field for salary tracking
- Added `managerId` to link employees to managers
- Relations to ProjectAssignments and SalaryRecords

### Backend - tRPC Router

Location: `src/server/trpc/routers/admin.ts`

The admin router provides these procedures (all require ADMIN role):

#### Employee Management
- **createEmployee**: Create new employee with optional login credentials
- **getEmployees**: Fetch all employees with relations
- **getEmployee**: Get specific employee with full details

#### Manager Management
- **createManager**: Create new manager with optional credentials
- **getManagers**: Fetch all managers with their managed employees and projects

#### Project Management
- **createProject**: Create new project with timeline
- **getProjects**: Fetch all projects with assignments
- **assignEmployeeToProject**: Assign employee to project with task description
- **updateProjectAssignment**: Update completion percentage

#### Progress Tracking
- **getProjectProgress**: Get detailed progress for specific project
- **getAllProjectProgress**: Get summary progress for all projects
- Automatically calculates completion percentage based on assignments

#### Salary Management
- **calculateEmployeeSalary**: Calculate monthly salary with bonuses
  - Attendance bonus: Up to 10% of base based on attendance rate
  - Completion bonus: Up to 5% of base based on project completion
- **getSalaryOverview**: Get salary summary for specific month
- **getAllEmployeeSalaryOverview**: Get global salary statistics
- **markSalaryAsPaid**: Mark salary record as paid

### Frontend - Pages and Components

#### Admin Layout
- `src/components/admin/AdminLayoutWrapper.tsx` - Main layout wrapper
- `src/components/admin/AdminSidebar.tsx` - Navigation sidebar
- Uses existing color palette and component styling

#### Admin Pages

##### Creation Page (`/admin/creation`)
- Tab-based interface for creating employees, managers, and projects
- Employee form: SAP ID, name, email, department, position, base salary, password
- Manager form: Name, email, department, password
- Project form: Name, description, start/end dates
- Real-time feedback with success/error messages

##### Progress Page (`/admin/progress`)
- Grid view of all projects
- Displays:
  - Project name and description
  - Overall completion percentage
  - Progress bars with animations
  - Total and completed assignments
  - Project status
- Clicking project navigates to detail page

##### Progress Detail Page (`/admin/progress/[projectId]`)
- Comprehensive project view
- Overview stats (progress %, assignments, completed count)
- Timeline information
- List of pending assignments with inline edit capability
- Click percentage to edit completion status
- Auto-saves when 100% reached

##### Salary Page (`/admin/salary`)
- Month/year selector for viewing historical data
- Overall summary cards
  - Total base salary
  - Already paid amount
  - Pending payments
  - Employee count
- Detailed salary table for selected month
  - Employee name
  - Base salary breakdown
  - Attendance bonus
  - Completion bonus
  - Total amount
  - Payment status
  - Mark as paid button

## Key Features

### Access Control
- All admin routes protected by `adminProcedure` from tRPC
- Automatically checks user role for ADMIN
- Returns FORBIDDEN error for unauthorized access

### Salary Calculation
- **Attendance Bonus**: Calculated as (base salary × max(0, attendance_rate - 80%)) / 500
  - Rewards employees for attendance above 80%
  - Maximum 10% of base salary
  
- **Completion Bonus**: Calculated as (base salary × average_project_completion%) / 2000
  - Rewards project completion
  - Maximum 5% of base salary

### Visualizations
- Animated progress bars using Framer Motion
- Responsive grid layouts
- Status indicators with color coding
- Real-time data updates

### UX Improvements
- Tab-based forms for organization (Creation page)
- Inline editing for project assignments
- Month/year filtering for salary data
- Responsive design maintaining existing layout

## Usage Examples

### Create an Employee
```javascript
await trpc.admin.createEmployee.mutate({
  sapId: 'SAP123',
  name: 'John Doe',
  email: 'john@company.com',
  department: 'Engineering',
  position: 'Senior Developer',
  baseSalary: 50000,
  password: 'secure_password'
})
```

### Assign Employee to Project
```javascript
await trpc.admin.assignEmployeeToProject.mutate({
  projectId: 1,
  employeeId: 1,
  taskDescription: 'Backend development'
})
```

### Update Project Assignment Progress
```javascript
await trpc.admin.updateProjectAssignment.mutate({
  assignmentId: 1,
  completionPercentage: 75
})
```

### Calculate Monthly Salary
```javascript
await trpc.admin.calculateEmployeeSalary.mutate({
  employeeId: 1,
  month: 12,
  year: 2025
})
```

## Database Relationships

```
User (1) ──────── (1) Manager
    │                    │
    └──────(1)───────(∞) Project
           │
        Employee (1) ──────────── (∞) ProjectAssignment
           │
           └──── (∞) SalaryRecord
```

## Files Created/Modified

### New Files
- `src/server/trpc/routers/admin.ts` - Admin tRPC router
- `src/components/admin/AdminLayoutWrapper.tsx` - Layout wrapper
- `src/components/admin/AdminSidebar.tsx` - Navigation sidebar
- `src/app/admin/creation/page.tsx` - Creation page with forms
- `src/app/admin/progress/page.tsx` - Project progress overview
- `src/app/admin/progress/[projectId]/page.tsx` - Project detail page
- `src/app/admin/salary/page.tsx` - Salary management page

### Modified Files
- `prisma/schema.prisma` - Added Manager, Project, ProjectAssignment, SalaryRecord models
- `src/server/trpc/routers/index.ts` - Registered admin router
- `src/types/index.ts` - Added admin-related types

## Future Enhancements

1. **Manager Dashboard** - Managers can view their assigned projects and employee progress
2. **Employee Dashboard** - Employees can view their salary records and assigned work
3. **Bulk Operations** - Import employees from CSV, batch salary calculations
4. **Advanced Analytics** - Department-wise salary analysis, project ROI calculations
5. **Notifications** - Email alerts for pending salaries, project deadlines
6. **Audit Trail** - Track all admin actions with timestamps
7. **Role-based Views** - Customized dashboards per role
8. **Project Templates** - Reusable project configurations

## Testing Recommendations

1. **Authentication**: Verify non-admin users cannot access admin routes
2. **CRUD Operations**: Test creating/reading/updating employees, managers, projects
3. **Salary Calculation**: Verify calculations with different attendance rates and completion percentages
4. **Data Validation**: Check input validation in all forms
5. **Edge Cases**: Test with zero employees, projects without assignments, etc.

## Performance Considerations

- All database queries include proper indexing (specified in schema)
- Progress calculations are done server-side to prevent data discrepancies
- Salary records use unique constraints to prevent duplicates
- Consider paginating large result sets in future versions

