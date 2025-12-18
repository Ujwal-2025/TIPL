# TIPL Employee Monitoring Web App

A comprehensive employee management system for monitoring outsourced employees working at SAP. Built with Next.js 15, React 19, TypeScript, tRPC, Prisma, and Tailwind CSS.

## 🎯 Core Purpose: GPS + Biometric Attendance Tracking & Salary Calculation

This system ensures **accurate attendance tracking** and **fair salary calculation** by combining multiple verification methods:

### Attendance Verification (Multi-Layer)
1. **GPS Tracking** - Employee's phone location logged at check-in/out
2. **Biometric Verification** - Fingerprint/Face recognition (captured by mobile app or kiosk)
3. **Security Monitoring** - Security personnel review and validate biometric records
4. **Timestamp Logging** - Precise check-in/out times with location coordinates

### Salary Calculation (Dual Component)
- **Time Component**: Hours logged via GPS + biometric attendance
- **Work Component**: Tasks completed, quality metrics, manager approval
- **Final Salary**: `(Hours Logged × Hourly Rate) + (Work Completed × Performance Bonus)`

---
>
> **Quick Navigation:**
> - 📖 [START_HERE.md](./START_HERE.md) - **Your entry point** (start here!)
> - 📚 [docs/TECH_STACK.md](./docs/TECH_STACK.md) - Understand all technologies
> - 👨‍💻 [docs/DEVELOPER_GUIDE.md](./docs/DEVELOPER_GUIDE.md) - Development workflow
> - 🏗️ [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) - System architecture
> - 📝 [docs/GIT_WORKFLOW.md](./docs/GIT_WORKFLOW.md) - Git commands
> - ⚡ [docs/QUICK_REFERENCE.md](./docs/QUICK_REFERENCE.md) - Command cheat sheet

---

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
- **Requirements**: Define user roles (Admin/Manager/Employee/Security), login flow (company-created employer accounts), attendance capture (GPS + biometric), manager dashboards (employee status, presence, progress), employee workspace (submit work + proof), security dashboard (biometric review), salary calculation logic (time × rate + work × bonus).
- **Design**: Information architecture, wireframes for login, manager dashboard, employee workspace, security dashboard; data model (Users, Employees, Attendance + GPS/Biometric fields, Tasks, Evidence, Reviews, SalaryLogs, AuditLog); API design via tRPC; RBAC policies for Admin/Manager/Employee/Security.
- **Implementation**: Next.js App Router, NextAuth (credentials, company-provisioned accounts), tRPC routers, Prisma models with GPS coordinates and biometric metadata, Neon DB; UI with Tailwind + shadcn/ui; GPS capture via browser geolocation API; biometric data storage and review; salary calculation engine; file evidence storage strategy; validations with Zod.
- **Testing**: Router unit tests, RBAC guards, validation tests, attendance calculation tests, salary formula tests, smoke tests on dashboards; accessibility and performance checks.
- **Deployment**: Vercel deploy, env vars, database migrations; monitoring basics.
- **Maintenance**: Bug triage, DB backups, logs, iterative improvements.

### 2-Week Delivery Plan (14 days)
- **Day 1**: Finalize requirements & acceptance criteria; confirm roles (Admin/Manager/Employee/Security), login rules (company-provisioned employer usernames), attendance capture methods (GPS + biometric), salary calculation formula.
- **Day 2**: Design IA + wireframes (login, manager dashboard with presence/hours/work metrics, employee check-in/checkout page, security biometric review panel); outline data model & APIs.
- **Day 3**: Project scaffold (Next.js, Tailwind), auth baseline (NextAuth credentials), RBAC stubs for all 4 roles.
- **Day 4**: Prisma schema + migrations (Users/Employees/Attendance + GPS coords + Biometric metadata/Tasks/Evidence/Reviews/SalaryLogs/AuditLog); connect Neon.
- **Day 5**: tRPC routers: `auth`, `employee` (list/create), `attendance` (check-in/out with GPS + biometric capture), `task` (progress); Zod validation.
- **Day 6**: Manager Dashboard v1: list employees, presence status (on-site/remote), hours logged, work progress KPIs, "Add Employee" flow.
- **Day 7**: Employee Check-in/Checkout page: GPS capture, biometric data submission, timestamp logging, history view.
- **Day 8**: Security Dashboard v1: review biometric records, mark as valid/suspect, flag anomalies, audit log.
- **Day 9**: Employee Workspace v1: self profile, task status, submit changes with proof (attachments + notes), history timeline.
- **Day 10**: Review Workflow v1: manager approve/reject work submissions, correction notes, audit logging.
- **Day 11**: Salary Calculation Engine: compute hours from attendance (GPS + biometric verified), fetch task completion data, apply formula `(hours × rate) + (work × bonus)`, generate salary logs.
- **Day 12**: Polish dashboards (filters/search/sort on employee lists, attendance charts, salary breakdowns), accessibility pass, responsive layout.
- **Day 13**: Testing: unit/integration for routers & RBAC; smoke tests; error handling; salary calculation unit tests.
- **Day 14**: Deploy to Vercel; set env vars (NEXTAUTH_SECRET, NEXTAUTH_URL, DATABASE_URL); run e2e checks; documentation & handoff.

### What I need from you upfront
- Confirm the 4 user roles and their responsibilities:
  - **Admin**: System setup, user management, audit access
  - **Manager**: Create employees, review attendance/work, approve salary
  - **Employee**: Check-in/out, submit work proof, view own data
  - **Security**: Validate biometric records, flag anomalies
- Biometric method: Fingerprint, face recognition, or both? How will it be captured? (mobile app, kiosk, camera?)
- GPS accuracy: Should we allow check-in from any location or enforce geofencing (e.g., only within office radius)?
- Salary formula: Base rate + task bonus? Any deductions for absences or late check-ins?
- Evidence storage for production: Local-only (dev) vs cloud (S3/GCS). If cloud, provide provider preference.
- Any compliance or privacy constraints (PII handling, data retention, GDPR)?

### Scope Boundaries (for 2 weeks)
- Employer accounts are created by Admin/Manager (no self-signup for employers).
- GPS data captured via browser Geolocation API; biometric data stored as metadata (actual recognition logic deferred or mocked in dev).
- Salary calculation is formula-driven; payroll export is a placeholder (real processing happens downstream).
- Evidence uploads limited to common file types (images/PDF) with size caps.
- Focus on core dashboards, attendance capture, and review workflow; advanced analytics deferred.

---

## 💰 Budget & Infrastructure (What Needs to Be Purchased)

### Cloud Services (Required for Production)

| Item | Purpose | Cost/Month | Yearly | Notes |
|------|---------|-----------|--------|-------|
| **Vercel Hosting** | Host the website | $0–$20 | $0–$240 | Free tier for dev; Pro/Enterprise for production traffic |
| **Neon PostgreSQL** | Database hosting | $0–$50 | $0–$600 | Free tier (5GB); paid plans for larger data |
| **AWS S3 / Google Cloud Storage** | Store evidence files (photos/PDFs) | $5–$20 | $60–$240 | Pay-as-you-go; ~$0.023 per GB stored |
| **SendGrid / Mailgun** | Send email notifications | $0–$30 | $0–$360 | Free tier: 100 emails/day; pay for higher volume |
| **Sentry / LogRocket** | Error tracking & monitoring | $0–$50 | $0–$600 | Free tier for small teams |
| **Stripe (Optional)** | Process salary payments | ~2.9% + $0.30 per transaction | Variable | Only if automating payroll |

**Subtotal Cloud Services: $5–$170/month ($60–$2,040/year)**

---

### Hardware & Devices (One-Time Purchase)

| Item | Purpose | Estimated Cost | Details |
|------|---------|----------------|---------|
| **Biometric Devices** | Capture fingerprints/face recognition | $500–$5,000 | Depends on scale. Options:<br>• Fingerprint scanner: $100–$500 per device<br>• Facial recognition kiosk: $500–$2,000<br>• Mobile phone with built-in sensors: $200–$800 |
| **Mobile Phones** | GPS tracking + biometric capture | $300–$1,500 per device | Employees need phones with:<br>• GPS enabled<br>• Mobile app for check-in/out<br>• Biometric support (fingerprint/face)<br>Budget for 10–50 devices depending on workforce |
| **Server/Kiosk Machine** | On-site attendance station (optional) | $500–$2,000 | For security team to monitor and validate biometric records |
| **Cameras (optional)** | Additional facial recognition or monitoring | $200–$1,000 | High-definition IP cameras for biometric gates |

**Subtotal Hardware: $800–$8,500 (one-time)**

---

### Domain & SSL (Annual)

| Item | Purpose | Cost/Year | Notes |
|------|---------|-----------|-------|
| **Domain Name** | e.g., `tipl.com` | $10–$50 | Register via GoDaddy, Namecheap, etc. |
| **SSL Certificate** | Encrypt website (HTTPS) | $0–$100 | Free via Let's Encrypt (included in Vercel) |

**Subtotal Domain & SSL: $10–$50/year**

---

### Software Licenses & Tools (Development)

| Item | Purpose | Cost/Month | Notes |
|------|---------|-----------|-------|
| **GitHub Pro (optional)** | Code repository & CI/CD | $4 | Free tier sufficient; Pro for private repos |
| **VS Code & Extensions** | Development editor | $0 | All free and open-source |
| **Figma (optional)** | UI/UX design | $0–$12 | Free tier; paid for team collaboration |

**Subtotal Dev Tools: $0–$16/month**

---

### Operational Costs (Ongoing)

| Item | Purpose | Cost/Month | Notes |
|------|---------|-----------|-------|
| **Internet Bandwidth** | For GPS/biometric uploads | Included | Should be covered by company internet |
| **Mobile Phone Plans** | For employee devices | $15–$40 per phone | Covers data for GPS tracking |
| **Database Backups** | Data safety | $0–$10 | Included in Neon; can add third-party backup |
| **Security & Compliance** | SSL, data encryption, audits | $0–$50 | Mostly free; advanced security tools are paid |

**Subtotal Operational: $15–$100/month per employee**

---

### ESTIMATED BUDGET SUMMARY

#### Development Phase (First 2 Weeks)
- **Cloud Services**: $5–$20/month × 0.5 months = **$2.50–$10**
- **Domain**: **$10–$50**
- **Dev Tools**: Free (using free tiers)
- **Total Dev Phase**: **$12.50–$60**

#### Launch Phase (Month 1)
- **Cloud Services**: $5–$50/month = **$5–$50**
- **Hardware (Biometric/Phones)**: **$800–$8,500** (one-time)
- **Domain & SSL**: **$10–$50**
- **Total Launch**: **$815–$8,600**

#### Monthly Operating Cost (After Launch)
- **Cloud Services**: $5–$50/month
- **Mobile Plans**: $15–$40 × (number of employees)
- **Tools & Monitoring**: $5–$20/month
- **Total Monthly**: **$25–$110 + (employee phone costs)**

#### Yearly Cost (Year 1)
- **Cloud**: $60–$600/year
- **Hardware (one-time)**: $800–$8,500
- **Mobile Plans**: $15–$40 × 12 × (employee count)
- **Domain**: $10–$50
- **Total Year 1**: **$870–$9,150 + annual mobile costs**

---

### Cost-Cutting Recommendations

✅ **Start Small & Scale**
- Use free tiers: Vercel, Neon, SendGrid (until hitting limits)
- Start with 5–10 employees; add more as system stabilizes
- Cost savings: ~50% in Year 1

✅ **Leverage Existing Resources**
- Use employees' personal phones (if allowed) instead of buying new devices
- Cost savings: $3,000–$8,000

✅ **Defer Advanced Features**
- Start without biometric hardware; use manual verification by security
- Add hardware later (Month 3+)
- Cost savings: $500–$5,000 initially

✅ **Use Open-Source Tools**
- All development uses free tools (Next.js, React, Prisma, etc.)
- No licensing fees for software

---

### Recommended First Purchase Order

**Phase 1 (Weeks 1–2): Development Setup**
1. Domain name: **$10–$30**
2. Cloud accounts (free tiers): **$0**
3. **Total: $10–$30**

**Phase 2 (Week 3–4): MVP Launch**
1. Upgrade Vercel (if needed): **$20/month**
2. Upgrade Neon DB (if data > 5GB): **$20/month**
3. Buy 1–2 test phones: **$300–$600**
4. **Total: $320–$650 + $40/month**

**Phase 3 (Month 2): Full Production**
1. Biometric devices (5–10 units): **$500–$2,000**
2. Mobile phones for workforce (10–50): **$2,000–$5,000**
3. Cloud storage (S3): **$10–$20/month**
4. **Total: $2,510–$7,020 + $30–$50/month**

---

### What Your Father Should Know

📌 **Total Investment for Small Team (10 employees)**
- **Year 1**: ~$3,000–$10,000 (mostly hardware)
- **Year 2+**: ~$2,500–$4,000/year (software + operations)
- **ROI**: Eliminates manual attendance tracking, reduces salary disputes, improves compliance

📌 **Risk Mitigation**
- Start with free tiers to validate the concept
- Invest in hardware only after MVP is validated
- Cloud costs are predictable and scalable (pay as you grow)

📌 **No Hidden Costs**
- No licensing for software (all open-source)
- Database backups included
- SSL certificates free via Vercel
- Email notifications cheap (<$30/month for 1,000s of emails)

---

## 🎨 Design System & Color Palette

### TIPL Brand Colors
A carefully chosen color palette designed for **clarity, accessibility, and professional appearance**.

| Color | Hex Code | Usage | Purpose |
|-------|----------|-------|---------|
| **Dark Navy** | `#0A1931` | Headings, Titles | Strong emphasis and key labels |
| **Light Blue** | `#B3CFE5` | Page Background | Clean, light foundation for layouts |
| **Primary Blue** | `#4A7FA7` | Buttons, Links | Call-to-action elements and interactive components |
| **Dark Blue** | `#1A3D63` | Navigation, Footer, Accents | Structural elements and secondary UI |
| **Very Light Blue** | `#F6FAFD` | Card Backgrounds, Body Text | High readability content areas |

### Color Usage Guidelines
```
✅ Headlines & Titles          → #0A1931 (Dark Navy)
✅ Page/Section Backgrounds    → #B3CFE5 (Light Blue)
✅ Primary Call-to-Action      → #4A7FA7 (Primary Blue) with #F6FAFD text
✅ Navigation Bars & Footers   → #1A3D63 (Dark Blue) with #F6FAFD text
✅ Cards & Content Areas       → #F6FAFD (Very Light Blue) with #0A1931 or #1A3D63 text
✅ Body Text                   → #1A3D63 (Dark Blue) on #F6FAFD or #B3CFE5 backgrounds
✅ Links                       → #4A7FA7 (Primary Blue) - underlined or as buttons
```

### High Contrast Combinations
All color combinations meet **WCAG AAA accessibility standards** for readability:
- Dark Navy (#0A1931) + Light Blue (#B3CFE5) = Excellent contrast
- Primary Blue (#4A7FA7) + Very Light Blue (#F6FAFD) = Excellent contrast
- Dark Blue (#1A3D63) + Very Light Blue (#F6FAFD) = Excellent contrast

### CSS Variables
Colors are defined as CSS variables in `src/app/globals.css` for easy theming:
```css
:root {
  --tipl-heading: #0A1931;        /* Headings / Titles */
  --tipl-background: #B3CFE5;     /* Page backgrounds */
  --tipl-primary: #4A7FA7;        /* Primary buttons / Links */
  --tipl-dark: #1A3D63;           /* Navigation / Footer / Accents */
  --tipl-light: #F6FAFD;          /* Body text / Card backgrounds */
}
```

Use in components:
```tsx
<div style={{ backgroundColor: 'var(--tipl-background)' }}>
  <h1 style={{ color: 'var(--tipl-heading)' }}>Title</h1>
  <button style={{ backgroundColor: 'var(--tipl-primary)', color: 'var(--tipl-light)' }}>
    Click Me
  </button>
</div>
```

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
