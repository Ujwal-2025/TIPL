# TIPL Employee Monitoring Web App

A modern, high-performance web application for monitoring outsourced employees working at SAP. Built with Next.js 15, React 19, TypeScript, tRPC, Prisma, and Tailwind CSS.

> ## 🚀 **NEW HERE? → [START_HERE.md](./START_HERE.md) ← READ THIS FIRST!**
>
> **Quick Navigation:**
> - 📖 [START_HERE.md](./START_HERE.md) - **Your entry point** (start here!)
> - 📚 [docs/TECH_STACK.md](./docs/TECH_STACK.md) - Understand all technologies
> - 👨‍💻 [docs/DEVELOPER_GUIDE.md](./docs/DEVELOPER_GUIDE.md) - Development workflow
> - 🏗️ [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) - System architecture
> - 📝 [docs/GIT_WORKFLOW.md](./docs/GIT_WORKFLOW.md) - Git commands
> - ⚡ [docs/QUICK_REFERENCE.md](./docs/QUICK_REFERENCE.md) - Command cheat sheet

## SDLC Overview + 2-Week Roadmap

### Software Development Life Cycle (SDLC)

**Requirements**: 
- Define 4 user roles (Admin, Manager, Security, Employee) and their permissions
- Attendance flow: employee self check-in/out → GPS capture → biometric submission → security approval
- Work tracking: employee submits work + proof → manager reviews → mark complete/needs correction
- Salary calculation: combine hours worked + task completion into transparent pay breakdown
- Data: BiometricLog, GPSLog, AttendanceRecord, WorkSubmission, SalaryRecord, AuditLog

**Design**: 
- Information architecture: login → role-based dashboard (separate for each role)
- Wireframes: employee check-in UI (GPS + biometric button), security review dashboard, manager payroll view
- Data model (Prisma): Users (roles), Employees, AttendanceRecords (with GPS/biometric fields), WorkSubmissions, SalaryCalculations, Reviews, AuditLogs
- API design (tRPC): `auth`, `attendance` (check-in/out, history), `work` (submit/review), `salary` (calculate, view), `biometric` (security logs)
- RBAC policies: employees can only check themselves in, managers review work, security monitors biometrics, only admins configure salary rules

**Implementation**: 
- Next.js 15 App Router with NextAuth (credentials, company-provisioned employee usernames)
- tRPC routers with Zod validation for all inputs
- Prisma models with GPS (lat/lng), biometric metadata, work attachments
- File storage for proof documents (local dev, cloud-ready for production)
- React UI (Tailwind + shadcn/ui) for dashboards, check-in button, approval workflows
- Salary calculation engine: formula-driven (hours + task points)

**Testing**: 
- Unit tests for salary calculation, RBAC checks, attendance flow
- Smoke tests on all dashboards
- Biometric data validation
- GPS accuracy checks
- Accessibility and performance

**Deployment**: 
- Vercel deploy
- Neon PostgreSQL
- Environment setup (NEXTAUTH_SECRET, DATABASE_URL, etc.)

**Maintenance**: 
- Monitor biometric accuracy, audit logs
- Payroll integrity checks
- Employee feedback loop

### 2-Week Delivery Plan (14 days)

| Day | Task | Deliverable |
|-----|------|-------------|
| 1 | Finalize requirements: 4 roles, attendance rules, GPS/biometric specs, salary formula | Requirements doc, acceptance criteria |
| 2 | Design: IA + wireframes (check-in, security dash, manager payroll), data model ERD, API spec | Design doc, database diagram |
| 3 | Project scaffold: Next.js 15, Tailwind, NextAuth (4 roles), RBAC middleware | Working localhost setup, auth stubs |
| 4 | Prisma schema: Users, Employees, BiometricLog, GPSLog, AttendanceRecord, WorkSubmission, SalaryRecord, Reviews, AuditLog | Migrations, seed data, Prisma Studio ready |
| 5 | tRPC routers: `auth`, `attendance.checkIn`, `attendance.checkOut`, `attendance.history`, with Zod validation | All endpoints tested in Prisma Studio |
| 6 | Employee check-in UI: button with GPS capture, biometric form stub, location map | Working check-in page on http://localhost:3000/employee/checkin |
| 7 | Security dashboard: biometric logs, approve/reject, flag suspicious, audit trail | Security role can view all submissions |
| 8 | Work submission: employees upload proof (images/PDF), manager review interface | Work submission flow end-to-end |
| 9 | Salary calculation logic: hours + task points formula, transparent breakdown | Dashboard shows salary components |
| 10 | Manager dashboard: attendance summary, work approval, payroll preview (hours + task bonus) | Manager can see team metrics |
| 11 | Polish & UX: filters, search, responsive layout, accessibility checks | Dashboards polished, mobile-friendly |
| 12 | Testing: unit tests for salary calc, RBAC checks, attendance validation; smoke tests | Tests pass, coverage > 70% |
| 13 | Deploy to Vercel, run migrations on Neon, set production env vars | Live on Vercel, database synced |
| 14 | Documentation: update START_HERE, role guides, salary formula docs, operations checklist | Handoff complete, team ready |

### What I Need From You **Before We Start Day 1**

1. **Salary Formula Details**
   - Hourly rate? (e.g., $20/hour)
   - Task/work point values? (e.g., $10 per task, or variable by type?)
   - Deductions for missing biometric verification? (e.g., -10% pay if biometric fails)
   - Weekly/monthly salary cycles?

2. **GPS & Biometric Specs**
   - GPS: just capture lat/lng at check-in/out, or continuous tracking?
   - Biometric: fingerprint, face, or both?
   - Who has biometric reader hardware (security office only, or mobile app)?
   - Can employee use phone's face unlock, or dedicated device?

3. **Attendance Rules**
   - Can employees check-in multiple times per day? (e.g., morning + afternoon shifts)
   - Minimum work hours per day to be marked "present"?
   - Grace period for late check-in? (e.g., 5 min late = still present)

4. **Work Submission**
   - File types allowed for proof? (JPEG, PNG, PDF, video?)
   - Max file size?
   - Can employee submit multiple files per task?

5. **Company Branding** (optional)
   - Logo, color scheme, app name variations?

### Scope for 2 Weeks

✅ Core: attendance check-in/out, GPS capture, biometric log, manager work approval, salary calculation  
✅ Security: biometric verification dashboard, anomaly flagging  
✅ Salary: transparent calculation, payroll preview  
❌ Out of scope: advanced analytics, mobile app native code, SMS notifications (future phase)

---

## Core Concept: Attendance + Biometric + GPS Tracking for Salary Calculation

**TIPL** is an **Employee Attendance & Monitoring System** that tracks employee presence, work completion, and calculates fair salary based on **both time spent + work delivered**.

### Key Features

**Attendance Tracking (Employee Self-Report)**
- Employees check-in/out via mobile app (phone)
- GPS location captured at check-in/out (verifies work location)
- Biometric verification (fingerprint/face) confirmed by Security personnel
- Frequency logs: how many times employee comes/goes each day/week/month

**Biometric Monitoring (Security Role)**
- Security team monitors all biometric submissions
- Flags suspicious/failed biometric attempts
- Approves or rejects attendance based on biometric authenticity
- Maintains biometric audit log

**Work Tracking (Manager Role)**
- Employees submit work completion with proof (photos, documents, evidence)
- Managers approve/reject submissions with feedback
- Track task completion, project progress, deliverables

**Intelligent Salary Calculation**
- **Not just hours!** Salary = (Hours Present × Hourly Rate) + (Tasks Completed × Task Points)
- Example: 8 hours at $20/hr = $160, + 5 tasks completed at $10/task = $50 bonus → Total = $210
- Transparency: employees can see salary breakdown in dashboard
- Managers review and finalize payroll before processing

**Role-Based Access**
- **Admin**: System setup, user management, salary templates, reports
- **Manager/Group Leader**: Approve work submissions, view team attendance, generate payroll summaries
- **Security**: Monitor biometric logs, flag anomalies, verify employee presence
- **Employee**: Check-in/out, submit work with proof, view own attendance & salary breakdown

---

## Features

### Core Functionality
- **Real-Time Attendance Tracking**: Check-in/out with geo-verification and device tracking
- **Task Management**: Assignment, tracking, and completion verification with evidence upload
- **Role-Based Access Control**: Admin, Manager, and Employee roles with fine-grained permissions
- **Secure Authentication**: NextAuth.js with support for credentials, OAuth2, and passkeys (WebAuthn)
- **Audit Logging**: Comprehensive audit trail for compliance (GDPR, DPDP)

### Technical Features
- **Type-Safe APIs**: End-to-end type safety with tRPC
- **Real-Time Updates**: WebSocket support for live attendance and task updates
- **Modern UI**: Responsive design with Tailwind CSS 4.x and shadcn/ui components
- **Database**: PostgreSQL with Prisma ORM for robust data modeling
- **Scalable Architecture**: Feature-first modular structure for maintainability

## Tech Stack

- **Frontend**: Next.js 15 (React 19), TypeScript 5.x, Tailwind CSS 4.x
- **Backend**: Next.js API Routes, tRPC 11.x, Prisma 5.x
- **Database**: PostgreSQL 16.x
- **Authentication**: NextAuth.js 4.x
- **UI Components**: shadcn/ui, Radix UI, Lucide Icons
- **State Management**: TanStack Query (React Query), Zustand/Jotai
- **Form Handling**: React Hook Form 7.x, Zod validation
- **Animations**: Framer Motion

## Getting Started

### Prerequisites

- Node.js 20.x or later
- PostgreSQL 16.x
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tipl-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and configure:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/tipl_monitoring"
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

   Generate a secure NEXTAUTH_SECRET:
   ```bash
   openssl rand -base64 32
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma Client
   npx prisma generate

   # Run migrations
   npx prisma migrate dev --name init

   # (Optional) Seed the database
   npx prisma db seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
tipl-app/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # NextAuth.js routes
│   │   │   └── trpc/          # tRPC routes
│   │   ├── dashboard/         # Dashboard pages
│   │   ├── auth/              # Authentication pages
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Homepage
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── ui/                # shadcn/ui components
│   │   └── providers.tsx      # App providers
│   ├── server/                # Server-side code
│   │   └── trpc/              # tRPC configuration
│   │       ├── context.ts     # tRPC context
│   │       ├── trpc.ts        # tRPC base setup
│   │       └── routers/       # tRPC routers
│   │           ├── attendance.ts
│   │           ├── task.ts
│   │           ├── employee.ts
│   │           └── index.ts   # Main router
│   ├── lib/                   # Utility libraries
│   │   ├── prisma.ts          # Prisma client
│   │   ├── auth.ts            # NextAuth config
│   │   ├── trpc.ts            # tRPC client
│   │   └── utils.ts           # Utility functions
│   ├── config/                # Configuration files
│   │   └── env.ts             # Environment validation
│   └── types/                 # TypeScript types
│       ├── index.ts           # Shared types
│       └── next-auth.d.ts     # NextAuth augmentation
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
└── README.md
```

## Database Schema

### Core Models

- **User**: Authentication and user profiles
- **Employee**: Employee information linked to users
- **Attendance**: Check-in/out records with verification data
- **Task**: Task assignments and completion tracking
- **AuditLog**: Comprehensive audit trail for compliance

### Enums

- **UserRole**: ADMIN, MANAGER, EMPLOYEE
- **AttendanceStatus**: PRESENT, ABSENT, REMOTE, ON_LEAVE, HALF_DAY
- **TaskStatus**: PENDING, IN_PROGRESS, COMPLETED, CANCELLED
- **Priority**: LOW, MEDIUM, HIGH, URGENT

## API Routes

### Attendance

- `attendance.checkIn`: Check in an employee
- `attendance.checkOut`: Check out an employee
- `attendance.getByEmployee`: Get attendance records for an employee
- `attendance.getTodayAll`: Get today's attendance for all employees (Manager+)
- `attendance.getStats`: Get attendance statistics (Manager+)

### Tasks

- `task.create`: Create a new task (Manager+)
- `task.updateStatus`: Update task status
- `task.getByEmployee`: Get tasks for an employee
- `task.getAll`: Get all tasks (Manager+)
- `task.getStats`: Get task statistics (Manager+)
- `task.delete`: Delete a task (Manager+)

### Employees

- `employee.create`: Create a new employee (Admin only)
- `employee.update`: Update employee (Admin only)
- `employee.getById`: Get employee by ID
- `employee.getAll`: Get all employees (Manager+)
- `employee.search`: Search employees (Manager+)
- `employee.delete`: Delete employee (Admin only)

## Authentication

### Default Roles

- **ADMIN**: Full system access, user management
- **MANAGER**: Employee monitoring, task assignment, reports
- **EMPLOYEE**: Self check-in/out, view assigned tasks

### Security Features

- Password hashing with bcrypt
- JWT-based sessions
- Role-based access control (RBAC)
- Audit logging for all sensitive actions
- Support for passkeys (WebAuthn) - ready to configure

## Development

### Running Tests
```bash
npm run test
```

### Building for Production
```bash
npm run build
npm run start
```

### Database Management
```bash
# Create a migration
npx prisma migrate dev --name migration_name

# Reset the database
npx prisma migrate reset

# Open Prisma Studio (database GUI)
npx prisma studio
```

### Type Checking
```bash
npx tsc --noEmit
```

### Linting
```bash
npm run lint
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Configure environment variables
4. Deploy!

### Database Hosting Options

- **Neon**: Serverless PostgreSQL (recommended)
- **Supabase**: PostgreSQL with built-in auth and real-time
- **AWS RDS**: Managed PostgreSQL for production
- **Railway**: Simple PostgreSQL hosting

## Roadmap

- [ ] Real-time subscriptions with WebSockets
- [ ] AI-powered analytics and anomaly detection
- [ ] SAP SuccessFactors integration
- [ ] Push notifications with FCM
- [ ] Mobile app (React Native)
- [ ] Biometric verification (WebAuthn passkeys)
- [ ] Advanced reporting and exports
- [ ] Multi-language support

## 📚 Documentation

| Document | Description |
|----------|-------------|
| **[START_HERE.md](./START_HERE.md)** | **Your entry point - read this first!** |
| [docs/TECH_STACK.md](./docs/TECH_STACK.md) | Complete guide to all technologies (Next.js, tRPC, Prisma, etc.) |
| [docs/DEVELOPER_GUIDE.md](./docs/DEVELOPER_GUIDE.md) | Development workflow, best practices, and common tasks |
| [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) | System architecture, data flow, and design patterns |
| [docs/GIT_WORKFLOW.md](./docs/GIT_WORKFLOW.md) | Git commands, commit conventions, and branching strategy |
| [docs/QUICK_REFERENCE.md](./docs/QUICK_REFERENCE.md) | Quick lookup for commands and code snippets |

## 🤝 Contributing

We welcome contributions! Please:

1. Read [START_HERE.md](./START_HERE.md) for project overview
2. Read [docs/DEVELOPER_GUIDE.md](./docs/DEVELOPER_GUIDE.md) for setup instructions
3. Follow [docs/GIT_WORKFLOW.md](./docs/GIT_WORKFLOW.md) for commit conventions
4. Check [docs/TECH_STACK.md](./docs/TECH_STACK.md) to understand the technologies
5. Submit pull requests with clear descriptions

## 📄 License

Proprietary - TIPL Employee Monitoring System

## 🆘 Support & Questions

- **New to Project?**: Start with [START_HERE.md](./START_HERE.md)
- **Technical Issues**: Check [docs/QUICK_REFERENCE.md](./docs/QUICK_REFERENCE.md#troubleshooting)
- **Learning Resources**: See [docs/TECH_STACK.md](./docs/TECH_STACK.md#further-learning)
- **Development Help**: Refer to [docs/DEVELOPER_GUIDE.md](./docs/DEVELOPER_GUIDE.md)

For support, contact your system administrator or TIPL IT support team.

---

**Built with ❤️ using modern web technologies in 2025**
