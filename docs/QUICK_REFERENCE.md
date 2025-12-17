# Quick Reference Guide

Fast lookup for common commands and tasks. Keep this handy while developing!

---

## ⚡ Essential Commands

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Check for errors
npm run lint
```

---

## 🗄️ Database (Prisma)

```bash
# Generate Prisma Client (after schema changes)
npx prisma generate

# Create new migration
npx prisma migrate dev --name your_migration_name

# Apply migrations (production)
npx prisma migrate deploy

# Reset database (DELETES ALL DATA!)
npx prisma migrate reset

# Open database browser
npx prisma studio

# Seed database
npx prisma db seed

# Pull schema from database
npx prisma db pull

# Push schema to database (dev only)
npx prisma db push
```

---

## 📝 Git Commands

```bash
# Check status
git status

# Stage changes
git add .

# Commit with message
git commit -m "feat(scope): description"

# Push to GitHub
git push origin main

# Pull latest changes
git pull origin main

# View history
git log --oneline

# Undo last commit (keep changes)
git reset --soft HEAD~1
```

---

## 🎨 Common File Locations

| Task | Location |
|------|----------|
| Add new page | `src/app/[name]/page.tsx` |
| Add API endpoint | `src/server/trpc/routers/[name].ts` |
| Add UI component | `src/components/ui/[name].tsx` |
| Add utility function | `src/lib/[name].ts` |
| Add database model | `prisma/schema.prisma` |
| Add TypeScript type | `src/types/index.ts` |
| Configure environment | `.env` |

---

## 🔧 Import Paths

```typescript
// Components
import { Button } from '@/components/ui/button'

// Libraries
import { prisma } from '@/lib/prisma'
import { trpc } from '@/lib/trpc'
import { authOptions } from '@/lib/auth'

// Server
import { router } from '@/server/trpc/trpc'

// Types
import { type Employee } from '@/types'
import { type AppRouter } from '@/server/trpc/routers'
```

---

## 🎯 tRPC Usage

### Query (Fetch Data)

```tsx
'use client'
import { trpc } from '@/lib/trpc'

export default function Page() {
  const { data, isLoading, error } = trpc.employee.getAll.useQuery()
  
  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>
  
  return <div>{data.map(emp => ...)}</div>
}
```

### Mutation (Modify Data)

```tsx
'use client'
import { trpc } from '@/lib/trpc'

export default function CreateForm() {
  const utils = trpc.useUtils()
  const mutation = trpc.employee.create.useMutation({
    onSuccess: () => {
      utils.employee.getAll.invalidate() // Refetch list
    }
  })
  
  const handleSubmit = (data) => {
    mutation.mutate(data)
  }
  
  return <form onSubmit={handleSubmit}>...</form>
}
```

---

## 🎨 Tailwind CSS Quick Reference

### Layout
```tsx
<div className="flex items-center justify-between gap-4">
<div className="grid grid-cols-3 gap-6">
<div className="container mx-auto px-4">
```

### Spacing
```tsx
className="p-4"       // padding all sides
className="px-6 py-4" // padding x-axis, y-axis
className="m-2"       // margin all sides
className="space-x-4" // gap between children
```

### Colors
```tsx
className="bg-blue-500 text-white"
className="border-gray-300"
className="hover:bg-blue-600"
```

### Responsive
```tsx
className="text-sm md:text-base lg:text-lg"
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
```

---

## 🔐 Authentication

### Check if logged in

```tsx
'use client'
import { useSession } from 'next-auth/react'

export default function Component() {
  const { data: session, status } = useSession()
  
  if (status === 'loading') return <p>Loading...</p>
  if (!session) return <p>Please log in</p>
  
  return <p>Welcome {session.user.name}</p>
}
```

### Protect API route

```typescript
// src/server/trpc/routers/example.ts
export const exampleRouter = router({
  protected: protectedProcedure // Requires authentication
    .query(({ ctx }) => {
      // ctx.session.user is guaranteed to exist
      return { userId: ctx.session.user.id }
    }),
})
```

---

## 📊 Prisma Queries

### Find Many

```typescript
const employees = await prisma.employee.findMany({
  where: { department: 'IT' },
  include: { tasks: true }, // Include relations
  orderBy: { name: 'asc' },
  take: 10, // Limit results
  skip: 0,  // Offset (pagination)
})
```

### Find One

```typescript
const employee = await prisma.employee.findUnique({
  where: { id: 1 },
  include: { tasks: true, attendances: true },
})
```

### Create

```typescript
const newEmployee = await prisma.employee.create({
  data: {
    name: 'John Doe',
    email: 'john@example.com',
    department: 'IT',
  },
})
```

### Update

```typescript
const updated = await prisma.employee.update({
  where: { id: 1 },
  data: { department: 'HR' },
})
```

### Delete

```typescript
await prisma.employee.delete({
  where: { id: 1 },
})
```

---

## 🐛 Troubleshooting

### TypeScript Errors After Schema Change

```bash
npx prisma generate
# Restart VS Code TypeScript server: Ctrl+Shift+P → "TypeScript: Restart TS Server"
```

### "Module not found"

```bash
rm -rf node_modules package-lock.json
npm install
```

### Port 3000 in use

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port
PORT=3001 npm run dev
```

### Database connection failed

```bash
# Check .env has correct DATABASE_URL
# Test connection:
npx prisma db pull
```

---

## 📚 Documentation Links

| Topic | File |
|-------|------|
| Tech explanations | [TECH_STACK.md](./TECH_STACK.md) |
| Development workflow | [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) |
| System architecture | [ARCHITECTURE.md](./ARCHITECTURE.md) |
| Git conventions | [GIT_WORKFLOW.md](./GIT_WORKFLOW.md) |
| Project overview | [README.md](./README.md) |

---

## 🔗 External Resources

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [tRPC Docs](https://trpc.io/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Tailwind Docs](https://tailwindcss.com/docs)
- [NextAuth Docs](https://next-auth.js.org)

---

## 💡 Pro Tips

1. **Hot Reload**: Changes auto-refresh in dev mode
2. **Type Checking**: `npm run build` catches TypeScript errors
3. **Prisma Studio**: Visual database browser at `localhost:5555`
4. **Git Commit**: Use format `type(scope): message`
5. **Console Logs**: Remove before committing
6. **Environment**: Never commit `.env` file!

---

**Questions?** Check the detailed guides above or open an issue on GitHub!
