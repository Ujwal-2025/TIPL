# Website Verification Guide

Complete this checklist to verify your TIPL website is working properly.

## Prerequisites
- Node.js installed
- PostgreSQL database running
- `.env.local` file configured with `DATABASE_URL`

---

## Step 1: Start the Development Server

```powershell
cd "c:\Users\ujwal kumar reddy\OneDrive - Middlesex University\Desktop\TIPL Website\TIPL"
npm run dev
```

**Expected Result**: Server starts on `http://localhost:3000` without errors
- Look for: `▲ Next.js X.X.X` message
- Should see: `✓ ready started server on 0.0.0.0:3000`

**If it fails**:
```powershell
# Clean build cache and try again
rm -r .next -ErrorAction SilentlyContinue
npm run dev
```

---

## Step 2: Database Verification

```powershell
# Check migration status
npx prisma migrate status

# View current schema
npx prisma db push

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

**Expected**: All migrations should show as "already applied"

---

## Step 3: Test Core Pages

### Open each URL in your browser and verify:

#### Home Page
- **URL**: `http://localhost:3000`
- **Check**:
  - [ ] Page loads without errors
  - [ ] Navbar appears
  - [ ] Logo displays as "TIPL" text (if image not found)
  - [ ] Navigation links work

#### Login Page
- **URL**: `http://localhost:3000/login`
- **Check**:
  - [ ] Login form appears
  - [ ] Email/password inputs are present
  - [ ] Submit button works

#### Dashboard (Protected Route)
- **URL**: `http://localhost:3000/dashboard`
- **Check**:
  - [ ] Requires login
  - [ ] Shows dashboard after login
  - [ ] User info displays

#### Admin Section
- **URL**: `http://localhost:3000/admin/creation`
- **Check**:
  - [ ] Three forms visible: Employee, Manager, Project
  - [ ] Forms are properly styled
  - [ ] Input fields are interactive

---

## Step 4: Test Forms & API Integration

### Test Employee Creation
1. **Fill the Employee Form**:
   - Name: "John Doe"
   - Email: "john@example.com"
   - SAP ID: "SAP001"
   - Department: "Engineering"
   - Position: "Senior Engineer"
   - Role: EMPLOYEE

2. **Submit and verify**:
   - [ ] Form submits successfully
   - [ ] Success message appears: "Employee created successfully!"
   - [ ] Form clears
   - [ ] Check database: `npx prisma db query` to see the record

### Test Manager Creation
1. **Fill the Manager Form**:
   - Name: "Jane Smith"
   - Email: "jane@example.com"
   - Department: "Management"
   - **Note**: NO password field (was removed)

2. **Submit and verify**:
   - [ ] Form submits without password field error
   - [ ] Success message appears
   - [ ] Manager created in database

### Test Project Creation
1. **Fill the Project Form**:
   - Name: "Website Redesign"
   - Description: "Redesign company website"
   - Start Date: Today's date
   - End Date: 30 days from today
   - **Note**: managerId defaults to '1'

2. **Submit and verify**:
   - [ ] Form accepts date inputs
   - [ ] Form submits successfully
   - [ ] Success message appears
   - [ ] Project appears in progress page

---

## Step 5: Test Admin Pages

### Progress Page
- **URL**: `http://localhost:3000/admin/progress`
- **Verify**:
  - [ ] Projects load from database
  - [ ] Shows total projects count
  - [ ] Shows completed projects count
  - [ ] Shows average progress percentage
  - [ ] Project cards display with completion bar
  - [ ] Can click on project to view details

### Project Detail Page
- **URL**: `http://localhost:3000/admin/progress/{projectId}`
- **Verify**:
  - [ ] Page loads with selected project
  - [ ] Shows project name and timeline
  - [ ] Shows assignments list
  - [ ] Can edit assignment completion percentage
  - [ ] Updates save to database

### Salary Page
- **URL**: `http://localhost:3000/admin/salary`
- **Verify**:
  - [ ] Salary overview loads
  - [ ] Shows total owed, paid, pending amounts
  - [ ] Can select month/year
  - [ ] Employee list displays
  - [ ] Can mark salary as paid
  - [ ] "Mark Paid" button updates status

---

## Step 6: Test API Endpoints

### Open Browser DevTools (F12) and test tRPC calls:

```javascript
// In browser console on any admin page:

// Get all employees
await trpc.admin.getAllEmployees.query()

// Get all projects
await trpc.admin.getAllProjects.query()

// Get salary overview
await trpc.admin.getSalaryOverview.query()
```

**Expected**: Console shows data returned without errors

### Check Network Tab
1. Open DevTools → Network tab
2. Perform an action (create employee, update project, etc.)
3. **Verify**:
   - [ ] API call to `/api/trpc/admin.*` appears
   - [ ] Response status is 200
   - [ ] Response contains valid JSON data

---

## Step 7: Check for Console Errors

1. **Open DevTools**: Press `F12`
2. **Go to Console tab**
3. **Reload page**: `Ctrl + R`
4. **Verify**:
   - [ ] No red error messages
   - [ ] Only yellow warnings are acceptable
   - [ ] Look for specific errors about:
     - TypeScript issues
     - API failures
     - Missing dependencies

### Common Issues to Check
```
❌ "Property 'X' does not exist" → Type error
❌ "Cannot read property 'X' of undefined" → Missing data
❌ "Failed to fetch" → API error
⚠️ "You have unused variable" → Warning (OK)
```

---

## Step 8: Test Responsive Design

1. **Open DevTools**: Press `F12`
2. **Click device toolbar icon** or press `Ctrl + Shift + M`
3. **Test on different sizes**:
   - [ ] Mobile (375x667)
   - [ ] Tablet (768x1024)
   - [ ] Desktop (1920x1080)

4. **Verify on each size**:
   - [ ] All forms are accessible
   - [ ] Navigation doesn't break
   - [ ] Text is readable
   - [ ] Buttons are clickable

---

## Step 9: Build Verification

```powershell
# Test production build
npm run build
```

**Expected**: Build completes with no errors
- Look for: "✓ Final:"
- No red error messages

**If build fails**:
```powershell
# Check for TypeScript errors
npm run type-check

# Fix any issues and rebuild
npm run build
```

---

## Step 10: Database Inspection

### View tables and data:

```powershell
# Open Prisma Studio (GUI for database)
npx prisma studio
```

This opens `http://localhost:5555` with a visual database browser.

**Check these tables exist**:
- [ ] users
- [ ] employees
- [ ] managers
- [ ] projects
- [ ] projectAssignments
- [ ] salaryRecords
- [ ] attendance
- [ ] tasks

---

## Step 11: Git Status Check

```powershell
# Verify all changes are committed
git status

# Should show: "working tree clean"

# View your recent commits
git log --oneline -10
```

---

## Final Checklist

- [ ] Development server starts without errors
- [ ] All pages load and display correctly
- [ ] Forms submit successfully
- [ ] API calls return data
- [ ] Database contains created records
- [ ] No console errors
- [ ] Responsive design works
- [ ] Production build succeeds
- [ ] Git status is clean

---

## Quick Command Reference

```powershell
# Start development server
npm run dev

# Build for production
npm run build

# Run TypeScript type checking
npm run type-check

# View database
npx prisma studio

# Check migrations
npx prisma migrate status

# Generate Prisma client
npx prisma generate

# Reset database (destructive)
npx prisma migrate reset

# View git status
git status

# Commit changes
git add -A
git commit -m "your message"
```

---

## Troubleshooting

### Server won't start
```powershell
# Kill any existing node process
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

# Clear Next.js cache
rm -r .next -ErrorAction SilentlyContinue

# Reinstall dependencies
rm -r node_modules
npm install

# Try again
npm run dev
```

### Database connection error
```powershell
# Verify .env.local has DATABASE_URL
cat .env.local

# Push schema to database
npx prisma db push

# Check database is running
```

### API errors
```powershell
# Regenerate Prisma client
npx prisma generate

# Check for TypeScript errors
npm run type-check

# Restart development server
```

---

## Support Resources

- **tRPC Docs**: https://trpc.io/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **Next.js Docs**: https://nextjs.org/docs
- **NextAuth Docs**: https://next-auth.js.org
- **TypeScript Docs**: https://www.typescriptlang.org/docs
