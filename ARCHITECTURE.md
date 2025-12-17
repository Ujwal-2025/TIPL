# Application Architecture

Visual guide to how the TIPL Employee Monitoring App is structured and how data flows through the system.

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER'S BROWSER                          │
└─────────────────────────────────────────────────────────────────┘
                              ▲  │
                              │  │ HTTP/WebSocket
                              │  ▼
┌─────────────────────────────────────────────────────────────────┐
│                       NEXT.JS 15 APP                            │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  CLIENT SIDE (Browser)                                  │    │
│  │  • React 19 Components                                  │    │
│  │  • tRPC Client (Type-safe API calls)                   │    │
│  │  • React Query (Caching & State)                       │    │
│  │  • Zustand/Jotai (UI State)                            │    │
│  │  • NextAuth Session                                     │    │
│  └────────────────────────────────────────────────────────┘    │
│                              │                                   │
│                              │ /api/trpc                         │
│                              ▼                                   │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  SERVER SIDE (Node.js)                                  │    │
│  │  • tRPC Server (API Routes)                            │    │
│  │  • NextAuth.js (Authentication)                        │    │
│  │  • Prisma ORM (Database Client)                        │    │
│  │  • Business Logic & Validation                         │    │
│  └────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Prisma Client
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│               POSTGRESQL (Neon.tech)                            │
│  • Users & Authentication                                       │
│  • Employees, Attendance, Tasks                                 │
│  • Audit Logs                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 Folder Structure Explained

```
TIPL/
│
├── 🗄️  prisma/                   Database Layer
│   ├── schema.prisma            → Database schema (models, relations)
│   ├── migrations/              → Version history of schema changes
│   └── seed.js                  → Initial data (admin user, etc.)
│
├── 🌐 public/                    Static Assets
│   └── (images, fonts, etc.)
│
└── 📦 src/                       Application Source Code
    │
    ├── 🎨 app/                   Next.js App Router (Pages & API)
    │   ├── page.tsx              → Landing page (/)
    │   ├── layout.tsx            → Root layout (navbar, footer)
    │   ├── globals.css           → Global styles
    │   │
    │   ├── dashboard/            → Dashboard Feature
    │   │   ├── page.tsx          → Dashboard UI (/dashboard)
    │   │   └── layout.tsx        → Dashboard layout
    │   │
    │   └── api/                  → Backend API Routes
    │       ├── auth/             → NextAuth endpoints (/api/auth/*)
    │       │   └── [...nextauth]/route.ts
    │       └── trpc/             → tRPC HTTP handler (/api/trpc/*)
    │           └── [trpc]/route.ts
    │
    ├── 🧩 components/            React Components
    │   ├── providers.tsx         → Client-side context providers
    │   └── ui/                   → Reusable UI components
    │       ├── button.tsx
    │       ├── card.tsx
    │       └── ...
    │
    ├── 🔧 lib/                   Utility Libraries
    │   ├── auth.ts               → NextAuth configuration
    │   ├── prisma.ts             → Prisma client singleton
    │   ├── trpc.ts               → tRPC client setup
    │   ├── utils.ts              → General helpers
    │   └── dashboard-utils.ts    → Dashboard-specific helpers
    │
    ├── 🖥️  server/               Server-Only Code
    │   └── trpc/
    │       ├── trpc.ts           → tRPC instance & middleware
    │       ├── context.ts        → Request context (user session)
    │       └── routers/          → API endpoint definitions
    │           ├── index.ts      → Main router (combines all)
    │           ├── employee.ts   → Employee CRUD
    │           ├── attendance.ts → Attendance tracking
    │           └── task.ts       → Task management
    │
    └── 📝 types/                 TypeScript Definitions
        ├── index.ts              → Shared type definitions
        └── next-auth.d.ts        → NextAuth type extensions
```

---

## 🔄 Data Flow Diagrams

### Authentication Flow

```
┌─────────┐
│  User   │ Enters email & password
└────┬────┘
     │
     ▼
┌─────────────────────────────────────────┐
│  LoginForm.tsx (Client Component)       │
│  • React Hook Form collects input      │
│  • Zod validates format                 │
└────┬────────────────────────────────────┘
     │ signIn('credentials', { email, password })
     ▼
┌─────────────────────────────────────────┐
│  NextAuth.js (/api/auth/callback)       │
│  • Receives credentials                 │
│  • Calls authorize() function           │
└────┬────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────┐
│  src/lib/auth.ts (CredentialsProvider)  │
│  • Queries database via Prisma          │
│  • Compares password hash (bcrypt)      │
└────┬────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────┐
│  Prisma Client → PostgreSQL             │
│  SELECT * FROM users WHERE email = ?    │
└────┬────────────────────────────────────┘
     │ Returns user record
     ▼
┌─────────────────────────────────────────┐
│  NextAuth.js                            │
│  • Creates encrypted JWT token          │
│  • Sets HTTP-only secure cookie         │
└────┬────────────────────────────────────┘
     │ Redirects to /dashboard
     ▼
┌─────────────────────────────────────────┐
│  Dashboard Page (Authenticated)         │
│  • useSession() hook provides user data │
│  • Protected by middleware               │
└─────────────────────────────────────────┘
```

---

### Data Fetching Flow (tRPC)

```
┌─────────┐
│  User   │ Opens dashboard
└────┬────┘
     │
     ▼
┌─────────────────────────────────────────────┐
│  DashboardPage.tsx (Client Component)       │
│  const { data } = trpc.employee.getAll.     │
│                     useQuery()              │
└────┬────────────────────────────────────────┘
     │ HTTP GET /api/trpc/employee.getAll
     ▼
┌─────────────────────────────────────────────┐
│  tRPC HTTP Handler (/api/trpc/[trpc])      │
│  • Parses request                           │
│  • Creates context (session, prisma)        │
└────┬────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────┐
│  employee.ts Router (Server)                │
│  getAll: publicProcedure.query(async () => {│
│    return await prisma.employee.findMany()  │
│  })                                         │
└────┬────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────┐
│  Prisma Client → PostgreSQL                 │
│  SELECT * FROM employees                    │
└────┬────────────────────────────────────────┘
     │ Returns array of employees
     ▼
┌─────────────────────────────────────────────┐
│  tRPC Server                                │
│  • Serializes data (SuperJSON)              │
│  • Sends JSON response                      │
└────┬────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────┐
│  React Query (Client Cache)                 │
│  • Stores result in cache                   │
│  • Provides loading/error states            │
│  • Auto-refetches on window focus           │
└────┬────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────┐
│  DashboardPage.tsx                          │
│  {data.map(emp => <EmployeeCard {...emp}/>)}│
└─────────────────────────────────────────────┘
```

---

### Data Mutation Flow (Creating a Task)

```
┌─────────┐
│  User   │ Submits task form
└────┬────┘
     │
     ▼
┌─────────────────────────────────────────────┐
│  TaskForm.tsx (Client Component)            │
│  • React Hook Form validates with Zod       │
│  • Calls mutation on submit                 │
│  const mutation = trpc.task.create.         │
│                     useMutation()           │
└────┬────────────────────────────────────────┘
     │ mutation.mutate({ title, description, ... })
     │ HTTP POST /api/trpc/task.create
     ▼
┌─────────────────────────────────────────────┐
│  tRPC HTTP Handler                          │
│  • Validates input with Zod schema          │
│  • Checks authentication (middleware)       │
└────┬────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────┐
│  task.ts Router (Server)                    │
│  create: protectedProcedure                 │
│    .input(z.object({ ... }))                │
│    .mutation(async ({ input, ctx }) => {    │
│      return await ctx.prisma.task.create({  │
│        data: input                          │
│      })                                     │
│    })                                       │
└────┬────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────┐
│  Prisma Client → PostgreSQL                 │
│  INSERT INTO tasks (title, ...) VALUES (...) │
└────┬────────────────────────────────────────┘
     │ Returns newly created task with ID
     ▼
┌─────────────────────────────────────────────┐
│  tRPC Server                                │
│  • Serializes response                      │
│  • Sends back to client                     │
└────┬────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────┐
│  React Query (Client)                       │
│  • Invalidates task list cache              │
│  • Triggers automatic refetch               │
│  • Calls onSuccess callback                 │
└────┬────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────┐
│  UI Updates                                 │
│  • Task appears in list instantly           │
│  • Success toast notification               │
│  • Form resets                              │
└─────────────────────────────────────────────┘
```

---

## 🔐 Security Architecture

### Authentication & Authorization

```
Request → Next.js Middleware → NextAuth Session Check
                                     │
                   ┌─────────────────┴─────────────────┐
                   │                                   │
              Not Authenticated                 Authenticated
                   │                                   │
                   ▼                                   ▼
          Redirect to /signin              Check User Role
                                                      │
                                    ┌─────────────────┼─────────────────┐
                                    │                 │                 │
                                  ADMIN           MANAGER          EMPLOYEE
                                    │                 │                 │
                                    ▼                 ▼                 ▼
                         Full Access       Department Access    Own Data Only
```

### Role-Based Access Control (RBAC)

```typescript
// Defined in Prisma schema
enum UserRole {
  ADMIN      // Full access to all features
  MANAGER    // Manage employees & view reports
  EMPLOYEE   // View own data, submit tasks
}
```

**Permission Matrix:**

| Feature | EMPLOYEE | MANAGER | ADMIN |
|---------|----------|---------|-------|
| View own attendance | ✅ | ✅ | ✅ |
| Check in/out | ✅ | ✅ | ✅ |
| View team attendance | ❌ | ✅ | ✅ |
| Create employees | ❌ | ❌ | ✅ |
| Assign tasks | ❌ | ✅ | ✅ |
| View audit logs | ❌ | ❌ | ✅ |
| Manage users | ❌ | ❌ | ✅ |

---

## 🗃️ Database Schema Relationships

```
┌─────────────┐
│    User     │ ← Authentication (NextAuth.js)
├─────────────┤
│ id          │◄──┐
│ email       │   │
│ password    │   │ 1:1
│ role        │   │
└─────────────┘   │
                  │
        ┌─────────┴─────────┐
        │                   │
┌───────▼────────┐   ┌──────────────┐
│   Employee     │   │   Account    │ OAuth accounts
├────────────────┤   ├──────────────┤
│ id             │   │ provider     │
│ userId         │   │ providerAccId│
│ sapId          │   └──────────────┘
│ name           │
│ email          │
│ department     │
│ status         │
└────────────────┘
        │
        │ 1:N
        │
        ├──────────────┬──────────────┐
        │              │              │
┌───────▼────────┐ ┌──▼─────────┐ ┌──▼────────┐
│  Attendance    │ │    Task    │ │ AuditLog  │
├────────────────┤ ├────────────┤ ├───────────┤
│ id             │ │ id         │ │ id        │
│ employeeId     │ │ employeeId │ │ userId    │
│ checkInTime    │ │ title      │ │ action    │
│ checkOutTime   │ │ status     │ │ timestamp │
│ date           │ │ priority   │ │ metadata  │
│ status         │ └────────────┘ └───────────┘
│ location       │
└────────────────┘
```

**Key Relationships:**

1. **User ↔ Employee** (1:1)
   - Each user account links to one employee profile
   - Employee can exist without a user account (pending activation)

2. **Employee ↔ Attendance** (1:N)
   - One employee has many attendance records
   - Each attendance record belongs to one employee

3. **Employee ↔ Task** (1:N)
   - One employee can have many tasks assigned
   - Each task has one assignee

4. **Task ↔ Task** (Self-relation)
   - Tasks can have subtasks
   - Tasks can block other tasks

---

## 🚀 Request Lifecycle

### Complete Flow: User Clicks "Create Employee" Button

```
1. USER INTERACTION
   └─► Click <Button> in CreateEmployeeForm.tsx
        │
        ▼
2. FORM VALIDATION (Client)
   └─► React Hook Form validates inputs
        └─► Zod schema checks:
             • Name is not empty
             • Email is valid format
             • SAP ID is unique format
        │
        ▼
3. tRPC MUTATION CALL
   └─► trpc.employee.create.mutate({ name, email, ... })
        │ Sends HTTP POST to /api/trpc/employee.create
        ▼
4. NEXT.JS API ROUTE
   └─► /api/trpc/[trpc]/route.ts receives request
        │
        ▼
5. tRPC MIDDLEWARE CHAIN
   └─► Check authentication (session exists?)
        └─► Check authorization (user is ADMIN?)
             └─► Create context (session, prisma)
                  │
                  ▼
6. tRPC PROCEDURE (Server)
   └─► employee.ts → create mutation
        └─► Validate input again (Zod)
             └─► Check business rules (SAP ID unique?)
                  │
                  ▼
7. PRISMA ORM
   └─► prisma.employee.create({ data: { ... } })
        │ Generates SQL:
        │ INSERT INTO employees (name, email, ...) VALUES (?, ?, ...)
        ▼
8. POSTGRESQL DATABASE
   └─► Executes INSERT query
        └─► Returns new employee record with ID
             │
             ▼
9. RESPONSE TRANSFORMATION
   └─► Prisma returns Employee object
        └─► SuperJSON serializes (handles Dates, BigInts)
             └─► tRPC sends JSON response
                  │
                  ▼
10. CLIENT-SIDE UPDATE
    └─► React Query receives response
         └─► Calls onSuccess callback
              └─► Invalidates employee list cache
                   └─► Triggers automatic refetch
                        │
                        ▼
11. UI UPDATE
    └─► Employee list re-renders with new employee
         └─► Success toast notification appears
              └─► Form resets for next entry
```

**Timeline:**
- Steps 1-3: ~10ms (client-side)
- Steps 4-6: ~5ms (Next.js routing)
- Steps 7-8: ~50-200ms (database round-trip)
- Steps 9-11: ~10ms (UI update)

**Total: ~75-225ms** for complete create operation

---

## 📊 State Management Strategy

### Client State

```
┌─────────────────────────────────────────────────────┐
│              Client-Side State                      │
├─────────────────────────────────────────────────────┤
│                                                     │
│  SERVER STATE (React Query via tRPC)                │
│  • Employees, attendance, tasks from database       │
│  • Cached automatically                             │
│  • Auto-refetches on window focus                   │
│  • Optimistic updates                               │
│                                                     │
│  GLOBAL UI STATE (Zustand)                          │
│  • Sidebar open/closed                              │
│  • Dark mode preference                             │
│  • Selected filters                                 │
│                                                     │
│  ATOMIC STATE (Jotai)                               │
│  • Form field values                                │
│  • Modal open state                                 │
│  • Derived computations                             │
│                                                     │
│  COMPONENT STATE (useState)                         │
│  • Dropdown open                                    │
│  • Hover state                                      │
│  • Temporary UI state                               │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Decision Tree: Which State Management to Use?**

```
Does data come from database?
├─ Yes → Use tRPC + React Query
│
└─ No → Is it shared across many components?
        ├─ Yes → Use Zustand (global store)
        │
        └─ No → Is it derived from other state?
                ├─ Yes → Use Jotai (atomic)
                │
                └─ No → Use useState (local)
```

---

## 🔄 Cache Strategy

### React Query (tRPC) Caching

```
┌──────────────────────────────────────────────┐
│         React Query Cache                    │
├──────────────────────────────────────────────┤
│                                              │
│  Key: ['employee', 'getAll']                 │
│  Data: [{ id: 1, name: '...' }, ...]         │
│  Status: 'success'                           │
│  LastFetched: 2025-12-17T10:30:00Z           │
│  StaleTime: 5 minutes                        │
│                                              │
│  → Refetch on window focus                   │
│  → Refetch on network reconnect              │
│  → Auto-refetch every 5 minutes              │
│  → Invalidate on mutation                    │
│                                              │
└──────────────────────────────────────────────┘
```

**Cache Invalidation Strategy:**

```typescript
// After creating employee
trpc.employee.create.useMutation({
  onSuccess: () => {
    // Invalidate list cache → triggers refetch
    utils.employee.getAll.invalidate()
  }
})

// After updating employee
trpc.employee.update.useMutation({
  onSuccess: (data) => {
    // Invalidate specific employee
    utils.employee.getById.invalidate({ id: data.id })
    // Also invalidate list
    utils.employee.getAll.invalidate()
  }
})
```

---

## 📈 Performance Optimization

### Code Splitting

```
Next.js automatically splits code by route:

Page Load: /              → Loads: page.tsx, layout.tsx
Page Load: /dashboard     → Loads: dashboard/page.tsx, layout.tsx
                             (+ shared components)

Dynamic imports for heavy components:
const HeavyChart = dynamic(() => import('./HeavyChart'), {
  loading: () => <Spinner />,
  ssr: false  // Don't render on server
})
```

### Image Optimization

```tsx
import Image from 'next/image'

// Next.js optimizes automatically:
// • Resizes to correct dimensions
// • Converts to WebP format
// • Lazy loads below fold
// • Serves from CDN
<Image
  src="/employee-photo.jpg"
  width={200}
  height={200}
  alt="Employee"
/>
```

### Database Query Optimization

```typescript
// ❌ N+1 Query Problem
const employees = await prisma.employee.findMany()
for (const emp of employees) {
  emp.tasks = await prisma.task.findMany({ 
    where: { employeeId: emp.id } 
  })
}
// Makes 1 + N queries (slow!)

// ✅ Use Prisma includes
const employees = await prisma.employee.findMany({
  include: { tasks: true }
})
// Makes 1 query with JOIN (fast!)
```

---

## 🎯 Summary

This application uses a **modern monolithic architecture** where:

1. **Frontend and Backend** live in the same Next.js project
2. **Type safety** flows from database → server → client
3. **API calls** use tRPC for end-to-end type safety
4. **Data access** is handled by Prisma ORM
5. **Authentication** is managed by NextAuth.js
6. **State management** uses React Query for server state
7. **Caching** happens automatically at multiple levels

**Key Benefits:**
- ✅ Fast development (full-stack TypeScript)
- ✅ Type-safe (catch errors at compile time)
- ✅ Auto-complete everywhere
- ✅ Easy deployment (single project)
- ✅ Great DX (developer experience)

For more details, see:
- [TECH_STACK.md](./TECH_STACK.md) - Technology explanations
- [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) - Development workflow
