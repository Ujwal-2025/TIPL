# Git Workflow & Commit Conventions

Best practices for version control and collaboration on the TIPL project.

---

## 🌳 Branch Strategy

### Main Branch
- **`main`** - Production-ready code
  - Always deployable
  - All tests pass
  - Code reviewed (for teams)
  - Protected from direct pushes (recommended)

### Working Branches (Optional for Solo Development)

```bash
feature/     → New features      (feature/employee-export)
fix/         → Bug fixes          (fix/login-redirect)
docs/        → Documentation     (docs/api-guide)
refactor/    → Code improvements (refactor/employee-service)
chore/       → Maintenance       (chore/upgrade-deps)
```

---

## 💬 Commit Message Format

Use **Conventional Commits** for clear, searchable history.

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type

| Type | When to Use | Example |
|------|-------------|---------|
| `feat` | New feature | `feat(auth): add Google OAuth` |
| `fix` | Bug fix | `fix(dashboard): correct attendance sum` |
| `docs` | Documentation | `docs: update setup instructions` |
| `style` | Formatting, no code change | `style: format with prettier` |
| `refactor` | Code restructuring | `refactor(employee): extract validation` |
| `test` | Add/update tests | `test(auth): add login tests` |
| `chore` | Maintenance | `chore: upgrade Next.js to v16` |
| `perf` | Performance improvement | `perf(db): add index on email` |
| `ci` | CI/CD changes | `ci: add GitHub Actions workflow` |
| `build` | Build system changes | `build: configure turbopack` |
| `revert` | Revert previous commit | `revert: undo feature X` |

### Scope (Optional)

Component or feature area:

```
auth          → Authentication
dashboard     → Dashboard
employee      → Employee management
attendance    → Attendance tracking
task          → Task management
db            → Database/migrations
ui            → UI components
api           → API routes
```

### Subject

- Use imperative mood: "add" not "added"
- Don't capitalize first letter
- No period at end
- Max 50 characters

### Body (Optional)

- Explain **what** and **why**, not how
- Wrap at 72 characters
- Separate from subject with blank line

### Footer (Optional)

- Breaking changes: `BREAKING CHANGE: <description>`
- Issue references: `Closes #123`, `Fixes #456`

---

## ✅ Good Commit Examples

```bash
# Simple feature
feat(employee): add CSV export button

# Bug fix with explanation
fix(auth): prevent session timeout on page refresh

The session was being cleared when users refreshed the page
because the cookie wasn't marked as persistent. Added
'maxAge' option to session configuration.

Fixes #234

# Breaking change
feat(api)!: change employee ID from number to string

BREAKING CHANGE: Employee IDs are now strings (UUIDs) instead
of auto-incrementing numbers. Update all API calls to use
string IDs.

# Documentation
docs: add architecture diagrams

# Refactoring
refactor(dashboard): extract chart logic to hooks

# Multiple scopes
fix(auth,session): handle expired tokens gracefully
```

---

## ❌ Bad Commit Examples

```bash
# Too vague
fix: bug fix
Update files
WIP

# Too long subject
feat(employee): add a new feature that allows users to export employee data to CSV format with filtering

# Wrong tense
Added new feature
Fixed bug
Updated docs

# No context
fix: oops
chore: stuff
```

---

## 🔄 Daily Workflow

### 1. Start of Day

```bash
# Update local code
git pull origin main

# Create feature branch (optional)
git checkout -b feature/add-reports
```

### 2. During Development

```bash
# Check what changed
git status
git diff

# Stage specific files
git add src/app/reports/page.tsx
git add src/server/trpc/routers/reports.ts

# Or stage all
git add .

# Commit with good message
git commit -m "feat(reports): add monthly attendance report"

# Continue working...
git add .
git commit -m "style(reports): improve table layout"
```

### 3. End of Day

```bash
# Push to GitHub
git push origin main

# Or if on feature branch
git push origin feature/add-reports
```

---

## 🎯 Commit Frequency

### ✅ Commit Often

```bash
# Good: Small, focused commits
git commit -m "feat(employee): add form validation"
git commit -m "feat(employee): add API endpoint"
git commit -m "feat(employee): connect form to API"
git commit -m "test(employee): add create tests"
```

**Benefits:**
- Easy to review
- Easy to revert
- Clear progress tracking
- Bisect bugs faster

### ❌ Don't Wait Too Long

```bash
# Bad: One massive commit
git commit -m "feat: add entire employee management system"
# (500 files changed, 10,000 lines)
```

**Problems:**
- Hard to review
- Hard to revert
- Lost context
- Unclear history

---

## 🔍 Useful Git Commands

### Viewing History

```bash
# View commit history
git log

# Compact view
git log --oneline

# Show changes in each commit
git log -p

# Search commits
git log --grep="employee"

# Show who changed what
git blame src/lib/auth.ts
```

### Undoing Changes

```bash
# Discard uncommitted changes to a file
git checkout -- src/app/page.tsx

# Discard all uncommitted changes
git reset --hard

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Revert a commit (creates new commit)
git revert <commit-hash>
```

### Stashing Changes

```bash
# Save work-in-progress
git stash

# List stashes
git stash list

# Apply latest stash
git stash pop

# Apply specific stash
git stash apply stash@{0}
```

### Branching

```bash
# List branches
git branch

# Create branch
git branch feature/new-feature

# Switch branch
git checkout feature/new-feature

# Create and switch
git checkout -b feature/new-feature

# Delete branch
git branch -d feature/new-feature

# Force delete unmerged branch
git branch -D feature/new-feature
```

### Merging

```bash
# Merge feature branch into main
git checkout main
git merge feature/new-feature

# Abort merge if conflicts
git merge --abort
```

---

## 🚨 Handling Merge Conflicts

### When They Happen

```bash
$ git pull origin main
Auto-merging src/app/page.tsx
CONFLICT (content): Merge conflict in src/app/page.tsx
Automatic merge failed; fix conflicts and then commit the result.
```

### How to Resolve

1. **Open conflicted file:**

```tsx
<<<<<<< HEAD
const title = "TIPL Dashboard"
=======
const title = "Employee Monitoring"
>>>>>>> feature/new-title
```

2. **Edit to keep what you want:**

```tsx
const title = "TIPL Employee Monitoring"
```

3. **Mark as resolved:**

```bash
git add src/app/page.tsx
git commit -m "fix: resolve title conflict"
```

---

## 📦 .gitignore Rules

### Already Ignored

```bash
# Dependencies
node_modules/

# Environment variables (NEVER commit!)
.env
.env.local
.env.*.local

# Build output
.next/
out/
dist/

# Logs
*.log

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
```

### Check Before Committing

```bash
# See what will be committed
git status

# Ensure .env is NOT listed!
```

---

## 🔐 Protecting Secrets

### ❌ NEVER Commit

- `.env` files
- API keys
- Database passwords
- Private keys
- Access tokens
- OAuth secrets

### ✅ DO Commit

- `.env.example` (template without real values)

```env
# .env.example (safe to commit)
DATABASE_URL="postgresql://user:password@localhost:5432/db"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
```

### If You Accidentally Commit a Secret

```bash
# 1. Remove from git (keeps local file)
git rm --cached .env

# 2. Add to .gitignore
echo ".env" >> .gitignore

# 3. Commit removal
git add .gitignore
git commit -m "chore: remove .env from git"

# 4. IMPORTANT: Rotate/change the exposed secret!
# Generate new NEXTAUTH_SECRET, change database password, etc.
```

---

## 📊 Git Workflow Summary

```
┌─────────────────────────────────────────────┐
│  1. Start: Pull latest changes              │
│     git pull origin main                    │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│  2. Work: Make changes to code              │
│     Edit files, test locally                │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│  3. Stage: Select files to commit           │
│     git add <files>                         │
│     or git add .                            │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│  4. Commit: Save changes with message       │
│     git commit -m "type(scope): message"    │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│  5. Push: Upload to GitHub                  │
│     git push origin main                    │
└─────────────────────────────────────────────┘
                 │
                 ▼
        ┌────────────────┐
        │   Repeat!      │
        └────────────────┘
```

---

## 🎓 Pro Tips

1. **Commit early, commit often**
   - Small commits are easier to understand
   - Easier to revert if something breaks

2. **Write commits for others** (including future you)
   - Explain why, not just what
   - Imagine reviewing this in 6 months

3. **Use branches for experiments**
   - Try risky changes on a branch
   - Merge when working, delete if not

4. **Pull before you push**
   - Avoid conflicts by staying up-to-date
   - `git pull` before `git push`

5. **Review before committing**
   - `git diff` shows what changed
   - Catch accidental debug code

6. **Use .gitignore early**
   - Add patterns before files exist
   - Prevents accidental commits

---

## 📚 Learn More

- [Git Documentation](https://git-scm.com/doc)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Guides](https://guides.github.com/)
- [Git Visual Guide](https://marklodato.github.io/visual-git-guide/)

---

**Questions?** Check [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) for more development workflows!
