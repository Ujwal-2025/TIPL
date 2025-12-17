# Developer Guide

Complete guide for developing, maintaining, and contributing to the TIPL Employee Monitoring App.

---

## 📚 Table of Contents

1. [First-Time Setup](#first-time-setup)
2. [Daily Development Workflow](#daily-development-workflow)
3. [Project Structure](#project-structure)
4. [Coding Standards](#coding-standards)
5. [Git Workflow](#git-workflow)
6. [Database Management](#database-management)
7. [Testing](#testing)
8. [Common Tasks](#common-tasks)
9. [Troubleshooting](#troubleshooting)
10. [Deployment](#deployment)

---

## First-Time Setup

### Prerequisites
- **Node.js 20.x+**: Download from [nodejs.org](https://nodejs.org/)
- **Git**: Download from [git-scm.com](https://git-scm.com/)
- **VS Code** (recommended): Download from [code.visualstudio.com](https://code.visualstudio.com/)

### Initial Setup

```bash
# 1. Clone the repository
git clone https://github.com/Ujwal-2025/TIPL.git
cd TIPL

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your database URL and secrets

# 4. Generate Prisma Client
npx prisma generate

# 5. Run database migrations
npx prisma migrate dev

# 6. Seed the database (creates admin user)
npx prisma db seed

# 7. Start development server
npm run dev
```

Now open http://localhost:3000 in your browser!

### VS Code Extensions (Recommended)

Install these for the best development experience:

- **Prisma** (prisma.prisma)
- **ESLint** (dbaeumer.vscode-eslint)
- **Tailwind CSS IntelliSense** (bradlc.vscode-tailwindcss)
- **Pretty TypeScript Errors** (yoavbls.pretty-ts-errors)

---

## Daily Development Workflow

### Starting Work

```bash
# 1. Pull latest changes
git pull origin main

# 2. Install any new dependencies
npm install

# 3. Apply any new database migrations
npx prisma migrate dev

# 4. Start dev server
npm run dev
```

### Making Changes

```bash
# 1. Create a feature branch (optional but recommended)
git checkout -b feature/add-employee-search

# 2. Make your changes
# Edit files in src/, prisma/, etc.

# 3. Test your changes
npm run build     # Check for TypeScript errors
npm run lint      # Check for code style issues

# 4. Commit your changes
git add .
git commit -m "feat: add employee search functionality"

# 5. Push to GitHub
git push origin main
# or if on a branch:
git push origin feature/add-employee-search
```

---

## Project Structure

```
TIPL/
├── prisma/
│   ├── schema.prisma          # Database schema definition
│   ├── seed.js                # Database seed script
│   └── migrations/            # Database version history
│
├── public/                    # Static files (images, fonts)
│
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── page.tsx           # Landing page (/)
│   │   ├── layout.tsx         # Root layout
│   │   ├── globals.css        # Global styles
│   │   ├── dashboard/         # Dashboard pages
│   │   │   ├── page.tsx       # Dashboard UI
│   │   │   └── layout.tsx     # Dashboard layout
│   │   └── api/               # API Routes
│   │       ├── auth/          # NextAuth endpoints
│   │       └── trpc/          # tRPC HTTP handler
│   │
│   ├── components/            # React components
│   │   ├── providers.tsx      # Client-side providers
│   │   └── ui/                # UI component library
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       └── ...
│   │
│   ├── lib/                   # Utility libraries
│   │   ├── auth.ts            # NextAuth configuration
│   │   ├── prisma.ts          # Prisma client singleton
│   │   ├── trpc.ts            # tRPC client setup
│   │   ├── utils.ts           # Helper functions
│   │   └── dashboard-utils.ts # Dashboard utilities
│   │
│   ├── server/                # Server-side code
│   │   └── trpc/
│   │       ├── trpc.ts        # tRPC initialization
│   │       ├── context.ts     # Request context
│   │       └── routers/       # API route handlers
│   │           ├── index.ts   # Main router
│   │           ├── employee.ts
│   │           ├── attendance.ts
│   │           └── task.ts
│   │
│   └── types/                 # TypeScript type definitions
│       ├── index.ts           # Shared types
│       └── next-auth.d.ts     # NextAuth type extensions
│
├── .env                       # Environment variables (SECRET, not in Git)
├── .env.example               # Template for .env
├── .gitignore                 # Files Git should ignore
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
├── next.config.ts             # Next.js configuration
├── tailwind.config.ts         # Tailwind configuration
├── eslint.config.mjs          # ESLint configuration
└── README.md                  # Project overview
```

### Where to Add New Features

| Feature Type | Location | Example |
|--------------|----------|---------|
| New page | `src/app/` | `src/app/reports/page.tsx` |
| New API endpoint | `src/server/trpc/routers/` | `src/server/trpc/routers/reports.ts` |
| New UI component | `src/components/ui/` | `src/components/ui/dialog.tsx` |
| New database table | `prisma/schema.prisma` | Add new `model Report { }` |
| New utility function | `src/lib/` | `src/lib/date-utils.ts` |
| New type definition | `src/types/` | `src/types/reports.ts` |

---

## Coding Standards

### TypeScript Best Practices

✅ **DO:**
```typescript
// Use explicit return types
function getEmployee(id: number): Promise<Employee> {
  return prisma.employee.findUnique({ where: { id } })
}

// Use type inference when obvious
const count = 42  // TypeScript knows this is number

// Use interfaces for object shapes
interface EmployeeFormData {
  name: string
  email: string
  department: string
}

// Use Zod for runtime validation
const schema = z.object({
  email: z.string().email(),
  age: z.number().min(18),
})
```

❌ **DON'T:**
```typescript
// Don't use 'any' (defeats TypeScript)
function doSomething(data: any) { }

// Don't skip validation
function createUser(data) {  // No type!
  prisma.user.create({ data })  // Could fail at runtime
}
```

---

### React Component Guidelines

✅ **DO:**
```tsx
// Use descriptive component names
export function EmployeeProfileCard({ employee }: { employee: Employee }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{employee.name}</CardTitle>
      </CardHeader>
    </Card>
  )
}

// Extract reusable logic into hooks
function useEmployeeData(id: number) {
  return trpc.employee.getById.useQuery({ id })
}

// Keep components small and focused
// One responsibility per component
```

❌ **DON'T:**
```tsx
// Don't create huge components
function DashboardPageWithEverything() {
  // 500 lines of code
  // Multiple responsibilities
  // Hard to test and maintain
}

// Don't repeat yourself
<button className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
<button className="bg-blue-500 text-white px-4 py-2 rounded">Cancel</button>
// Instead: Use <Button> component
```

---

### File Naming Conventions

```
Components:          PascalCase     EmployeeCard.tsx
Utilities:           camelCase      formatDate.ts
API Routes:          camelCase      employee.ts
CSS/Config:          kebab-case     tailwind.config.ts
Types:               PascalCase     Employee.ts
Hooks:               camelCase      useEmployee.ts (start with 'use')
```

---

### Code Organization

**Group related code:**
```typescript
// ✅ Good: Grouped by feature
src/
├── features/
│   ├── employees/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── types/
│   └── attendance/
│       ├── components/
│       └── hooks/
```

**Avoid deep nesting:**
```typescript
// ❌ Bad
src/components/dashboard/employee/profile/header/title/Text.tsx

// ✅ Good
src/components/employee/ProfileTitle.tsx
```

---

## Git Workflow

### Commit Message Format

Use conventional commits:

```
<type>(<scope>): <subject>

<body>
<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code formatting (no logic change)
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**
```bash
git commit -m "feat(auth): add Google OAuth login"
git commit -m "fix(dashboard): correct attendance calculation"
git commit -m "docs: update API documentation"
git commit -m "refactor(employee): extract search logic to hook"
git commit -m "chore: upgrade Next.js to v16"
```

---

### Branch Strategy

**Main Branch:**
- `main` - Production-ready code
- Always deployable
- Protected (requires reviews for teams)

**Feature Branches** (Optional for solo dev):
```bash
# Create feature branch
git checkout -b feature/employee-export

# Work on feature
git add .
git commit -m "feat: add employee CSV export"

# Push to GitHub
git push origin feature/employee-export

# Merge when done
git checkout main
git merge feature/employee-export
git push origin main
```

---

### .gitignore Rules

Already configured, but remember:

✅ **DO COMMIT:**
- Source code (`src/`, `prisma/schema.prisma`)
- Configuration files (`package.json`, `tsconfig.json`)
- Documentation (`README.md`, `*.md`)
- Public assets (`public/`)

❌ **NEVER COMMIT:**
- `.env` (contains secrets!)
- `node_modules/` (too large)
- `.next/` (build output)
- `*.log` (log files)
- `.DS_Store` (Mac files)

---

## Database Management

### Common Prisma Commands

```bash
# Generate Prisma Client (after schema changes)
npx prisma generate

# Create and apply migration
npx prisma migrate dev --name add_employee_avatar

# Apply migrations in production
npx prisma migrate deploy

# Reset database (DELETES ALL DATA)
npx prisma migrate reset

# Open Prisma Studio (visual database browser)
npx prisma studio

# Validate schema
npx prisma validate

# Format schema file
npx prisma format
```

---

### Making Schema Changes

**Workflow:**

1. **Edit `prisma/schema.prisma`:**
```prisma
model Employee {
  id       Int    @id @default(autoincrement())
  name     String
  avatar   String?  // ← New field
}
```

2. **Create migration:**
```bash
npx prisma migrate dev --name add_employee_avatar
```

This:
- Generates SQL migration file
- Applies migration to database
- Regenerates Prisma Client

3. **Update TypeScript code:**
```typescript
// TypeScript now knows about 'avatar' field
const employee = await prisma.employee.create({
  data: {
    name: 'John',
    avatar: 'https://...'  // ← Type-safe!
  }
})
```

---

### Database Seeding

Edit `prisma/seed.js` to add test data:

```javascript
async function main() {
  // Create test employees
  await prisma.employee.createMany({
    data: [
      { name: 'John Doe', email: 'john@example.com', ... },
      { name: 'Jane Smith', email: 'jane@example.com', ... },
    ]
  })
}
```

Run: `npx prisma db seed`

---

## Testing

### Type Checking

```bash
# Check TypeScript errors
npm run build

# Watch mode (continuous checking)
npx tsc --watch
```

### Linting

```bash
# Check code style
npm run lint

# Auto-fix issues
npm run lint -- --fix
```

### Manual Testing Checklist

Before committing:

- [ ] App builds without errors (`npm run build`)
- [ ] No ESLint warnings (`npm run lint`)
- [ ] All pages load correctly
- [ ] Forms validate properly
- [ ] Database operations work
- [ ] Authentication flows work

---

## Common Tasks

### Add a New Page

```bash
# 1. Create page file
# src/app/reports/page.tsx
```

```tsx
export default function ReportsPage() {
  return (
    <div>
      <h1>Reports</h1>
    </div>
  )
}
```

Access at: http://localhost:3000/reports

---

### Add a New API Endpoint

```typescript
// 1. Create router file
// src/server/trpc/routers/reports.ts

import { router, protectedProcedure } from '../trpc'
import { z } from 'zod'

export const reportsRouter = router({
  getMonthly: protectedProcedure
    .input(z.object({
      month: z.number().min(1).max(12),
      year: z.number(),
    }))
    .query(async ({ input, ctx }) => {
      // Query database
      return await ctx.prisma.attendance.findMany({
        where: {
          date: {
            gte: new Date(input.year, input.month - 1, 1),
            lt: new Date(input.year, input.month, 1),
          }
        }
      })
    }),
})
```

```typescript
// 2. Add to main router
// src/server/trpc/routers/index.ts

import { reportsRouter } from './reports'

export const appRouter = router({
  employee: employeeRouter,
  attendance: attendanceRouter,
  task: taskRouter,
  reports: reportsRouter,  // ← Add this
})
```

```tsx
// 3. Use in component
const { data } = trpc.reports.getMonthly.useQuery({
  month: 12,
  year: 2025
})
```

---

### Add a New Database Model

```prisma
// 1. Add to prisma/schema.prisma

model Report {
  id        Int      @id @default(autoincrement())
  title     String
  content   String   @db.Text
  createdAt DateTime @default(now())
  
  @@map("reports")
}
```

```bash
# 2. Create migration
npx prisma migrate dev --name add_report_model
```

```typescript
// 3. Use in code
const report = await prisma.report.create({
  data: {
    title: 'Monthly Report',
    content: '...'
  }
})
```

---

### Add a New UI Component

```tsx
// 1. Create component file
// src/components/ui/alert.tsx

import { cn } from '@/lib/utils'

interface AlertProps {
  variant?: 'default' | 'error' | 'success'
  children: React.ReactNode
}

export function Alert({ variant = 'default', children }: AlertProps) {
  return (
    <div className={cn(
      'rounded-lg p-4',
      variant === 'error' && 'bg-red-100 text-red-800',
      variant === 'success' && 'bg-green-100 text-green-800',
      variant === 'default' && 'bg-gray-100 text-gray-800',
    )}>
      {children}
    </div>
  )
}
```

```tsx
// 2. Use in page
import { Alert } from '@/components/ui/alert'

<Alert variant="success">
  Employee created successfully!
</Alert>
```

---

## Troubleshooting

### "Module not found" Error

```bash
# Solution: Install dependencies
npm install

# If persists: Delete and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

### Prisma Client Not Generated

```bash
# Solution: Generate Prisma Client
npx prisma generate
```

---

### Database Connection Failed

```bash
# Check .env file has correct DATABASE_URL
# Ensure Neon database is running
# Test connection:
npx prisma db pull
```

---

### TypeScript Errors After Schema Change

```bash
# Regenerate Prisma Client
npx prisma generate

# Restart TypeScript server in VS Code
# Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"
```

---

### Port 3000 Already in Use

```bash
# Option 1: Use different port
PORT=3001 npm run dev

# Option 2: Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Option 2: Kill process on port 3000 (Mac/Linux)
lsof -ti:3000 | xargs kill -9
```

---

### Build Fails

```bash
# 1. Check TypeScript errors
npx tsc --noEmit

# 2. Check ESLint errors
npm run lint

# 3. Clear Next.js cache
rm -rf .next
npm run build
```

---

## Deployment

### Environment Variables

Production `.env` must have:

```env
# Database (Neon production URL)
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_SECRET="<strong-secret-here>"
NEXTAUTH_URL="https://your-domain.com"

# OAuth (if using)
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
```

---

### Deploy to Vercel (Recommended)

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel

# 4. Set environment variables in Vercel dashboard
# Visit: vercel.com/your-project/settings/environment-variables
```

---

### Build Locally

```bash
# Production build
npm run build

# Start production server
npm start
```

---

## Best Practices Summary

✅ **DO:**
- Commit early and often
- Write descriptive commit messages
- Use TypeScript types everywhere
- Validate user input with Zod
- Keep components small and focused
- Run `npm run build` before pushing
- Use meaningful variable names
- Comment complex logic
- Keep `.env` secret

❌ **DON'T:**
- Commit `.env` file
- Use `any` type in TypeScript
- Skip validation
- Write huge functions/components
- Ignore ESLint warnings
- Push broken code
- Hardcode secrets in code
- Nest code too deeply

---

## Additional Resources

- **[TECH_STACK.md](./TECH_STACK.md)** - Detailed explanation of all technologies
- **[README.md](../README.md)** - Project overview and quick start
- **[Prisma Docs](https://www.prisma.io/docs)** - Database ORM
- **[Next.js Docs](https://nextjs.org/docs)** - Framework
- **[tRPC Docs](https://trpc.io/docs)** - API layer
- **[NextAuth Docs](https://next-auth.js.org)** - Authentication

---

**Questions?** Open an issue on GitHub or reach out to the team!
