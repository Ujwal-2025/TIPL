# 🚀 START HERE - TIPL Project Guide

Welcome! This is your **entry point** to understanding and working on the TIPL Employee Monitoring App.

---

## 📍 You Are Here

```
TIPL/
├── 👉 START_HERE.md          ← YOU ARE HERE! Read this first
├── README.md                  ← Project overview
├── package.json               ← Dependencies
├── .env                       ← Your secrets (NEVER commit!)
│
├── 📁 src/                    ← Your application code
│   ├── app/                   → Pages and routes
│   ├── components/            → Reusable UI components
│   ├── lib/                   → Utility functions
│   ├── server/                → Backend API (tRPC)
│   └── types/                 → TypeScript types
│
├── 📁 prisma/                 ← Database
│   ├── schema.prisma          → Database structure
│   ├── migrations/            → Database history
│   └── seed.js                → Initial data
│
├── 📁 docs/                   ← All documentation
│   ├── TECH_STACK.md          → Learn technologies
│   ├── DEVELOPER_GUIDE.md     → How to develop
│   ├── ARCHITECTURE.md        → System design
│   ├── GIT_WORKFLOW.md        → Git commands
│   └── QUICK_REFERENCE.md     → Quick lookup
│
└── 📁 public/                 ← Static files (images, etc.)
```

---

## 🎯 Your 5-Minute Quick Start

### Step 1: Test if Everything Works

```bash
# Open terminal in this folder and run:
npm run dev
```

Then visit: **http://localhost:3000**

✅ If you see the landing page, everything works!

### Step 2: Login to Dashboard

Visit: **http://localhost:3000/api/auth/signin**

Login with:
- **Email**: `admin@tipl.local`
- **Password**: `Admin@12345`

✅ If you can see the dashboard, database is connected!

### Step 3: View Your Database

```bash
npx prisma studio
```

Opens at: **http://localhost:5555**

✅ You should see your data tables!

---

## 📚 Learning Path (Choose Your Style)

### 🎓 Option 1: "I'm New to Everything"

Read in this order:

1. **[README.md](../README.md)** (10 min)
   - What this project does
   - What features it has

2. **[docs/TECH_STACK.md](docs/TECH_STACK.md)** (30 min)
   - What each technology does
   - How they work together
   - Start with "Frontend Stack" section

3. **[docs/QUICK_REFERENCE.md](docs/QUICK_REFERENCE.md)** (5 min)
   - Bookmark this for quick lookups
   - Common commands and code snippets

4. **[docs/DEVELOPER_GUIDE.md](docs/DEVELOPER_GUIDE.md)** (30 min)
   - Daily workflow
   - How to add features
   - Coding standards

### 💻 Option 2: "I Learn by Doing"

1. **Run the app** (see Quick Start above)

2. **Make a small change**:
   - Open `src/app/page.tsx`
   - Change the title text
   - Save and see it update automatically

3. **Look at working code**:
   - `src/app/dashboard/page.tsx` - Dashboard UI
   - `src/server/trpc/routers/employee.ts` - API endpoint
   - `prisma/schema.prisma` - Database structure

4. **Use docs when stuck**:
   - Check [docs/QUICK_REFERENCE.md](docs/QUICK_REFERENCE.md) for commands
   - Check [docs/TECH_STACK.md](docs/TECH_STACK.md) for explanations

### 🏗️ Option 3: "I Want Architecture Understanding"

1. **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** (30 min)
   - System design
   - Data flow diagrams
   - How requests flow through the app

2. **[docs/TECH_STACK.md](docs/TECH_STACK.md)** (30 min)
   - Technical details of each layer

3. **Trace a feature**:
   - Pick the employee feature
   - Follow: UI → tRPC → Prisma → Database
   - Files: `dashboard/page.tsx` → `routers/employee.ts` → `schema.prisma`

---

## 🛠️ Essential Commands

### Development
```bash
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Check for errors
npm run lint         # Check code style
```

### Database
```bash
npx prisma studio              # Open database browser
npx prisma migrate dev         # Create new migration
npx prisma generate            # Update Prisma Client
npx prisma db seed             # Add test data
```

### Git
```bash
git status                     # Check what changed
git add .                      # Stage all changes
git commit -m "type: message"  # Commit with convention
git push origin main           # Upload to GitHub
```

> 💡 Full command reference: [docs/QUICK_REFERENCE.md](docs/QUICK_REFERENCE.md)

---

## 📖 Documentation Index

| Doc | What It Covers | When to Read |
|-----|---------------|-------------|
| **[README.md](../README.md)** | Project overview | First time |
| **[TECH_STACK.md](docs/TECH_STACK.md)** | All technologies explained | Learning phase |
| **[DEVELOPER_GUIDE.md](docs/DEVELOPER_GUIDE.md)** | How to develop | Before coding |
| **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** | System design | Understanding flow |
| **[GIT_WORKFLOW.md](docs/GIT_WORKFLOW.md)** | Version control | Before committing |
| **[QUICK_REFERENCE.md](docs/QUICK_REFERENCE.md)** | Command cheat sheet | Keep open always |

---

## 🎨 Key Files to Know

### Configuration Files (Root)
- `package.json` - Dependencies and scripts
- `.env` - Your secrets (database URL, API keys)
- `tsconfig.json` - TypeScript settings
- `next.config.ts` - Next.js settings
- `prisma/schema.prisma` - Database structure

### Important Folders
- `src/app/` - All your pages and routes
- `src/components/ui/` - Reusable UI components
- `src/server/trpc/routers/` - API endpoints
- `src/lib/` - Helper functions

### Don't Touch (Auto-Generated)
- `node_modules/` - Dependencies (huge!)
- `.next/` - Build output
- `prisma/migrations/` - Database history (don't edit manually)

---

## ❓ Common Questions

### "Where do I add a new page?"
→ `src/app/[page-name]/page.tsx`

### "Where do I add a new API endpoint?"
→ `src/server/trpc/routers/[feature].ts`

### "Where do I add a new UI component?"
→ `src/components/ui/[component].tsx`

### "How do I add a database table?"
→ Edit `prisma/schema.prisma`, then run `npx prisma migrate dev`

### "I got an error, what do I do?"
→ Check [docs/DEVELOPER_GUIDE.md](docs/DEVELOPER_GUIDE.md#troubleshooting)

---

## 🚨 Important Rules

### ✅ DO:
- ✅ Run `npm run dev` to see changes live
- ✅ Use `npx prisma studio` to view database
- ✅ Read docs when confused
- ✅ Commit small changes frequently
- ✅ Follow [GIT_WORKFLOW.md](docs/GIT_WORKFLOW.md) for commits

### ❌ DON'T:
- ❌ Never commit `.env` file (has secrets!)
- ❌ Don't edit `node_modules/` or `.next/`
- ❌ Don't manually edit migration files
- ❌ Don't push broken code (run `npm run build` first)

---

## 🎯 What to Do Right Now

### If you're brand new:
1. ✅ Run `npm run dev`
2. ✅ Visit http://localhost:3000
3. ✅ Read [README.md](../README.md)
4. ✅ Read [docs/TECH_STACK.md](docs/TECH_STACK.md)

### If you want to code:
1. ✅ Open [docs/DEVELOPER_GUIDE.md](docs/DEVELOPER_GUIDE.md)
2. ✅ Follow "Daily Development Workflow"
3. ✅ Try adding a small feature
4. ✅ Keep [docs/QUICK_REFERENCE.md](docs/QUICK_REFERENCE.md) open

### If you're stuck:
1. ✅ Check [docs/QUICK_REFERENCE.md](docs/QUICK_REFERENCE.md#troubleshooting)
2. ✅ Search the relevant doc (Next.js, tRPC, Prisma)
3. ✅ Look at working examples in `src/`

---

## 🎉 You're All Set!

Your project is:
- ✅ **Organized** - Clean folder structure
- ✅ **Documented** - Every tech explained
- ✅ **Running** - Database connected
- ✅ **Ready** - Start coding!

**Next Step**: Pick a learning path above and get started! 🚀

---

**Quick Links**:
- 🌐 App: http://localhost:3000
- 🗄️ Database: http://localhost:5555 (run `npx prisma studio`)
- 💻 GitHub: https://github.com/Ujwal-2025/TIPL
- 📚 All Docs: [docs/](docs/)

**Need Help?** Read the docs or check troubleshooting sections!
