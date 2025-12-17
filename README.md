# TIPL Employee Monitoring Web App

A modern, high-performance web application for monitoring outsourced employees working at SAP. Built with Next.js 15, React 19, TypeScript, tRPC, Prisma, and Tailwind CSS.

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

## Contributing

Contributions are welcome! Please follow the code style and submit pull requests.

## License

Proprietary - TIPL Employee Monitoring System

## Support

For support, contact your system administrator or TIPL IT support team.

---

**Built with ❤️ using modern web technologies in 2025**
