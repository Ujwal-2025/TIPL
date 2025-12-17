# Technology Stack Guide

A comprehensive guide to all technologies used in the TIPL Employee Monitoring Web App.

---

## 📚 Table of Contents

1. [Frontend Stack](#frontend-stack)
2. [Backend Stack](#backend-stack)
3. [Database Stack](#database-stack)
4. [Authentication Stack](#authentication-stack)
5. [UI & Styling](#ui--styling)
6. [State Management](#state-management)
7. [Form Handling & Validation](#form-handling--validation)
8. [Development Tools](#development-tools)
9. [How They All Work Together](#how-they-all-work-together)

---

## Frontend Stack

### **Next.js 15** (App Router)
**What it is:** A React framework for building full-stack web applications.

**Why we use it:**
- **Server-Side Rendering (SSR)**: Pages load faster with pre-rendered HTML
- **App Router**: Modern file-based routing system (better than old Pages Router)
- **API Routes**: Backend endpoints live in the same project
- **Automatic Code Splitting**: Only loads JavaScript needed for each page
- **Built-in Optimization**: Images, fonts, and scripts are optimized automatically

**Key Concepts:**
```
src/app/
├── page.tsx          → Homepage (/)
├── layout.tsx        → Root layout wrapper
├── dashboard/
│   └── page.tsx      → Dashboard page (/dashboard)
└── api/
    ├── auth/         → Authentication endpoints
    └── trpc/         → tRPC API endpoints
```

**Files you'll work with:**
- `src/app/page.tsx` - Landing page
- `src/app/layout.tsx` - Site-wide layout (navbar, footer)
- `src/app/dashboard/page.tsx` - Dashboard UI

---

### **React 19**
**What it is:** JavaScript library for building user interfaces with components.

**Why we use it:**
- **Component-Based**: Break UI into reusable pieces
- **Declarative**: Describe what the UI should look like, React handles updates
- **Hooks**: `useState`, `useEffect`, `useMemo` for managing state and side effects

**Example Component:**
```tsx
'use client' // Marks this as a client component (interactive)

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function Counter() {
  const [count, setCount] = useState(0)
  
  return (
    <div>
      <p>Count: {count}</p>
      <Button onClick={() => setCount(count + 1)}>
        Increment
      </Button>
    </div>
  )
}
```

**Key Concepts:**
- `'use client'` - Marks components that need browser APIs or interactivity
- `'use server'` - Marks server-only functions (database queries, etc.)
- Server Components (default) - Render on server, faster initial load
- Client Components - Interactive, can use hooks and browser APIs

---

### **TypeScript 5.x**
**What it is:** JavaScript with type checking.

**Why we use it:**
- **Catch Errors Early**: TypeScript catches bugs before runtime
- **Autocomplete**: Your editor suggests available properties/methods
- **Self-Documenting**: Types serve as inline documentation
- **Refactoring Safety**: Change code confidently, compiler catches breaks

**Example:**
```typescript
// Without TypeScript (risky)
function greet(name) {
  return `Hello ${name.toUpperCase()}`
}
greet(123) // Runtime error: 123.toUpperCase() is not a function

// With TypeScript (safe)
function greet(name: string): string {
  return `Hello ${name.toUpperCase()}`
}
greet(123) // Compile error: Argument of type 'number' not assignable to 'string'
```

---

## Backend Stack

### **tRPC 11.x**
**What it is:** End-to-end type-safe API framework. No code generation, just TypeScript.

**Why we use it (instead of REST or GraphQL):**
- **Full Type Safety**: Frontend knows exact API shape automatically
- **No API Documentation Needed**: Types are the documentation
- **Auto-Complete**: Your editor suggests available API calls
- **Fast Development**: Change backend, frontend instantly sees updates

**How it works:**
```typescript
// Backend: Define API (src/server/trpc/routers/employee.ts)
export const employeeRouter = router({
  getAll: publicProcedure.query(async () => {
    return await prisma.employee.findMany()
  }),
  
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return await prisma.employee.findUnique({
        where: { id: input.id }
      })
    }),
})

// Frontend: Call API (src/app/dashboard/page.tsx)
const { data: employees } = trpc.employee.getAll.useQuery()
const { data: employee } = trpc.employee.getById.useQuery({ id: 1 })
```

**Architecture:**
```
src/server/trpc/
├── trpc.ts              → tRPC initialization
├── context.ts           → Request context (user session, etc.)
└── routers/
    ├── index.ts         → Combines all routers
    ├── employee.ts      → Employee CRUD operations
    ├── attendance.ts    → Attendance tracking
    └── task.ts          → Task management
```

**Key Concepts:**
- **Procedure**: A single API endpoint
- **Query**: Read data (GET request)
- **Mutation**: Change data (POST/PUT/DELETE)
- **Input Validation**: Zod schemas validate request data
- **Middleware**: Authentication, logging, error handling

---

### **Prisma 5.x**
**What it is:** Next-generation ORM (Object-Relational Mapping) for database access.

**Why we use it:**
- **Type-Safe Database Queries**: No raw SQL strings
- **Auto-Generated Client**: Types match your database schema
- **Migrations**: Version control for database schema
- **Studio**: Visual database browser (run `npx prisma studio`)

**How it works:**

1. **Define Schema** (prisma/schema.prisma):
```prisma
model Employee {
  id       Int      @id @default(autoincrement())
  name     String
  email    String   @unique
  tasks    Task[]   // One employee has many tasks
}

model Task {
  id         Int      @id @default(autoincrement())
  title      String
  employeeId Int
  employee   Employee @relation(fields: [employeeId], references: [id])
}
```

2. **Generate Client**:
```bash
npx prisma generate
```

3. **Use in Code** (src/lib/prisma.ts):
```typescript
// Type-safe queries
const employees = await prisma.employee.findMany({
  include: { tasks: true } // Include related tasks
})

const newEmployee = await prisma.employee.create({
  data: {
    name: 'John Doe',
    email: 'john@example.com'
  }
})
```

**Key Files:**
- `prisma/schema.prisma` - Database schema definition
- `prisma/migrations/` - Database version history
- `src/lib/prisma.ts` - Prisma client singleton
- `prisma/seed.js` - Initial data (admin user, test data)

**Common Commands:**
```bash
npx prisma migrate dev     # Create and apply migration
npx prisma studio          # Open visual database browser
npx prisma db seed         # Run seed script
npx prisma generate        # Regenerate Prisma Client
```

---

## Database Stack

### **PostgreSQL 16.x** (via Neon.tech)
**What it is:** Advanced open-source relational database.

**Why we use it:**
- **ACID Compliance**: Data integrity guarantees
- **JSON Support**: Store flexible data structures
- **Full-Text Search**: Built-in search capabilities
- **Advanced Indexing**: Fast queries on large datasets
- **Reliability**: Battle-tested in production for decades

**Your Setup:**
- **Provider**: Neon.tech (serverless Postgres)
- **Connection**: Connection pooling enabled
- **SSL**: Required for security

**Database Models:**
```
Users & Auth (NextAuth.js)
├── User            → User accounts
├── Account         → OAuth provider accounts
├── Session         → Active sessions
└── VerificationToken

Business Logic
├── Employee        → Employee profiles
├── Attendance      → Check-in/out records
├── Task            → Task assignments
└── AuditLog        → Compliance tracking
```

---

## Authentication Stack

### **NextAuth.js 4.x**
**What it is:** Complete authentication solution for Next.js.

**Why we use it:**
- **Multiple Providers**: Credentials, Google, GitHub, etc.
- **Session Management**: JWT or database sessions
- **Security Built-in**: CSRF protection, encrypted cookies
- **Callbacks**: Customize auth flow at any step

**How it works:**

1. **Configure** (src/lib/auth.ts):
```typescript
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        // Verify email/password
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })
        
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        )
        
        return isValid ? user : null
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  ],
  callbacks: {
    // Add custom data to session
    session: async ({ session, user }) => {
      session.user.role = user.role
      return session
    }
  }
}
```

2. **API Route** (src/app/api/auth/[...nextauth]/route.ts):
```typescript
import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
```

3. **Use in Components**:
```tsx
import { useSession } from 'next-auth/react'

export function Profile() {
  const { data: session, status } = useSession()
  
  if (status === 'loading') return <p>Loading...</p>
  if (!session) return <p>Not logged in</p>
  
  return <p>Welcome {session.user.name}</p>
}
```

**Key Concepts:**
- **Providers**: Authentication methods (email/password, Google, etc.)
- **Adapter**: Stores sessions in database (we use PrismaAdapter)
- **Callbacks**: Customize JWT, session, redirect behavior
- **Middleware**: Protect routes from unauthorized access

---

## UI & Styling

### **Tailwind CSS 4.x**
**What it is:** Utility-first CSS framework.

**Why we use it:**
- **No CSS Files**: Style directly in JSX
- **Consistency**: Design system built-in
- **Responsive**: Mobile-first breakpoints
- **Fast**: Only ships CSS you actually use

**Example:**
```tsx
// Traditional CSS
<div className="card">
  <h1 className="card-title">Hello</h1>
</div>
// Needs separate CSS file with .card and .card-title styles

// Tailwind CSS
<div className="bg-white rounded-lg shadow-md p-6">
  <h1 className="text-2xl font-bold text-gray-800">Hello</h1>
</div>
// All styles inline, autocompleted by editor
```

**Common Utilities:**
- Layout: `flex`, `grid`, `container`
- Spacing: `p-4` (padding), `m-2` (margin), `space-x-4` (gap)
- Colors: `bg-blue-500`, `text-gray-700`, `border-red-300`
- Typography: `text-xl`, `font-bold`, `leading-tight`
- Responsive: `md:text-lg` (medium screens+), `lg:grid-cols-3`

---

### **shadcn/ui + Radix UI**
**What it is:** Copy-paste component library built on Radix primitives.

**Why we use it:**
- **Accessible**: ARIA compliant, keyboard navigation
- **Customizable**: Components live in your repo, not node_modules
- **Unstyled Primitives**: Radix handles behavior, you style with Tailwind
- **No Lock-in**: Copy code, modify freely

**Our Components:**
```
src/components/ui/
├── button.tsx       → <Button variant="outline">
├── card.tsx         → <Card><CardHeader><CardContent>
├── input.tsx        → <Input type="email">
├── select.tsx       → <Select><SelectItem>
├── table.tsx        → <Table><TableRow><TableCell>
└── badge.tsx        → <Badge variant="success">
```

**Usage:**
```tsx
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

<Card>
  <CardHeader>
    <CardTitle>Dashboard</CardTitle>
  </CardHeader>
  <CardContent>
    <Button variant="default" size="lg">
      Get Started
    </Button>
  </CardContent>
</Card>
```

---

### **Lucide Icons**
**What it is:** Modern icon library (fork of Feather Icons).

**Example:**
```tsx
import { User, Calendar, CheckCircle } from 'lucide-react'

<div className="flex items-center gap-2">
  <User className="w-5 h-5" />
  <span>Profile</span>
</div>
```

**All icons:** https://lucide.dev/icons

---

## State Management

### **TanStack Query (React Query)**
**What it is:** Data fetching and caching library.

**Why we use it:**
- **Automatic Caching**: Fetch once, reuse everywhere
- **Background Refetching**: Keep data fresh automatically
- **Optimistic Updates**: UI updates before server responds
- **Loading/Error States**: Built-in state management

**Used by tRPC:**
```tsx
// tRPC wraps React Query
const { data, isLoading, error } = trpc.employee.getAll.useQuery()

if (isLoading) return <Spinner />
if (error) return <Error message={error.message} />

return <EmployeeList employees={data} />
```

---

### **Zustand**
**What it is:** Lightweight state management (like Redux but simpler).

**When to use:**
- Global UI state (sidebar open/closed, theme)
- Shared state across many components
- State that doesn't need server sync

**Example:**
```tsx
// store.ts
import { create } from 'zustand'

export const useStore = create((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ 
    sidebarOpen: !state.sidebarOpen 
  }))
}))

// Component
const { sidebarOpen, toggleSidebar } = useStore()
```

---

### **Jotai**
**What it is:** Atomic state management (alternative to Zustand).

**When to use:**
- Smaller, more granular state pieces
- Derived state computations
- State that needs composition

**Example:**
```tsx
import { atom, useAtom } from 'jotai'

const countAtom = atom(0)
const doubledAtom = atom((get) => get(countAtom) * 2)

function Counter() {
  const [count, setCount] = useAtom(countAtom)
  const [doubled] = useAtom(doubledAtom)
  
  return <div>{count} × 2 = {doubled}</div>
}
```

---

## Form Handling & Validation

### **React Hook Form**
**What it is:** Performant form library with minimal re-renders.

**Why we use it:**
- **Fast**: Only re-renders when needed
- **Easy Validation**: Integrates with Zod
- **Type-Safe**: Full TypeScript support

**Example:**
```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

type FormData = z.infer<typeof schema>

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema)
  })
  
  const onSubmit = (data: FormData) => {
    console.log(data) // { email: "...", password: "..." }
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <p>{errors.email.message}</p>}
      
      <input type="password" {...register('password')} />
      {errors.password && <p>{errors.password.message}</p>}
      
      <button type="submit">Login</button>
    </form>
  )
}
```

---

### **Zod**
**What it is:** TypeScript-first schema validation.

**Why we use it:**
- **Type Inference**: Schema defines both runtime and compile-time types
- **Composable**: Build complex schemas from simple ones
- **Error Messages**: Customizable validation errors

**Example:**
```typescript
import { z } from 'zod'

const employeeSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  department: z.enum(['IT', 'HR', 'Finance']),
  age: z.number().min(18).max(65),
  startDate: z.date(),
})

type Employee = z.infer<typeof employeeSchema> // TypeScript type

// Validate data
const result = employeeSchema.safeParse(data)
if (!result.success) {
  console.log(result.error.errors) // Validation errors
}
```

---

## Development Tools

### **ESLint**
**What it is:** JavaScript linter (finds code problems).

**Catches:**
- Unused variables
- Missing imports
- Code style issues
- Potential bugs

**Run:** `npm run lint`

---

### **TypeScript Compiler**
**What it is:** Type checker and JavaScript compiler.

**Catches:**
- Type mismatches
- Missing properties
- Wrong function arguments
- Null/undefined errors

**Run during build:** `npm run build`

---

## How They All Work Together

### **Full Request Flow Example**

Let's trace a user logging in:

```
1. USER CLICKS LOGIN BUTTON
   ↓
2. REACT (Frontend)
   → LoginForm.tsx renders
   → React Hook Form handles input
   → Zod validates email/password format
   ↓
3. NEXTAUTH (Authentication)
   → Receives credentials
   → Queries database via Prisma
   → bcrypt compares password hash
   ↓
4. PRISMA (ORM)
   → Generates SQL: SELECT * FROM users WHERE email = ?
   → Executes query against PostgreSQL
   ↓
5. POSTGRESQL (Database)
   → Returns user record
   ↓
6. NEXTAUTH (Authentication)
   → Creates encrypted session
   → Sets HTTP-only cookie
   → Returns session to client
   ↓
7. REACT QUERY (State)
   → Caches session data
   → Updates UI automatically
   ↓
8. NEXT.JS (Framework)
   → Redirects to /dashboard
   → Server renders dashboard with user data
   ↓
9. USER SEES DASHBOARD
```

### **Full Data Mutation Flow**

Creating a new task:

```
1. USER FILLS TASK FORM
   ↓
2. REACT HOOK FORM
   → Validates with Zod schema
   ↓
3. tRPC CLIENT (Frontend)
   → trpc.task.create.mutate({ title, description })
   ↓
4. tRPC SERVER (Backend)
   → Receives request at /api/trpc
   → Checks user authentication (context)
   → Validates input with Zod
   ↓
5. PRISMA (ORM)
   → prisma.task.create({ data: { ... } })
   → Generates SQL INSERT
   ↓
6. POSTGRESQL (Database)
   → Inserts new task record
   → Returns created task with ID
   ↓
7. tRPC SERVER
   → Transforms data with SuperJSON
   → Sends response
   ↓
8. REACT QUERY (tRPC Client)
   → Invalidates task list cache
   → Refetches tasks automatically
   ↓
9. REACT (UI)
   → Re-renders with new task in list
```

---

## 🎯 Key Takeaways

**For Frontend Development:**
- React components live in `src/app/` and `src/components/`
- Use Tailwind for styling
- Use tRPC hooks for data fetching
- Forms use React Hook Form + Zod

**For Backend Development:**
- API logic lives in `src/server/trpc/routers/`
- Database queries use Prisma
- Add types with Zod
- tRPC provides automatic type safety

**For Database:**
- Schema defined in `prisma/schema.prisma`
- Migrations track changes
- Prisma Studio visualizes data
- Seed script in `prisma/seed.js`

**For Deployment:**
- Next.js builds static/dynamic pages
- tRPC compiles to API routes
- Prisma generates database client
- Environment variables in `.env` (not committed)

---

## 📖 Further Learning

**Next.js:** https://nextjs.org/docs
**React:** https://react.dev
**TypeScript:** https://www.typescriptlang.org/docs
**tRPC:** https://trpc.io/docs
**Prisma:** https://www.prisma.io/docs
**NextAuth:** https://next-auth.js.org
**Tailwind:** https://tailwindcss.com/docs
**Zod:** https://zod.dev

---

**Questions?** Open an issue or check [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) for workflow tips!
