import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center space-y-8 text-center">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
              TIPL Employee Monitoring
            </h1>
            <p className="max-w-2xl text-xl text-slate-600 dark:text-slate-400">
              Modern, real-time attendance tracking and task management for outsourced employees at SAP
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/api/auth/signin">Sign In</Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Real-Time Attendance
              </CardTitle>
              <CardDescription>
                Track check-ins and check-outs with geo-verification and device tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li>• Live status dashboard</li>
                <li>• Late arrival detection</li>
                <li>• Location verification</li>
                <li>• Automatic reporting</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                Task Management
              </CardTitle>
              <CardDescription>
                Assign, track, and verify task completion with evidence upload
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li>• Real-time task updates</li>
                <li>• Priority management</li>
                <li>• Evidence upload</li>
                <li>• Completion verification</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                Secure & Compliant
              </CardTitle>
              <CardDescription>
                Enterprise-grade security with GDPR and DPDP compliance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li>• Role-based access control</li>
                <li>• Audit logging</li>
                <li>• Passkey authentication</li>
                <li>• Data encryption</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                Analytics & Insights
              </CardTitle>
              <CardDescription>
                AI-powered productivity insights and anomaly detection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li>• Attendance statistics</li>
                <li>• Task completion rates</li>
                <li>• Predictive analytics</li>
                <li>• Custom reports</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                SAP Integration
              </CardTitle>
              <CardDescription>
                Seamless sync with SAP SuccessFactors and HR systems
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li>• Employee data sync</li>
                <li>• Payroll export</li>
                <li>• Single sign-on</li>
                <li>• API integration</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                Mobile Ready
              </CardTitle>
              <CardDescription>
                Responsive design works on any device, anywhere
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li>• Progressive Web App</li>
                <li>• Offline support</li>
                <li>• Push notifications</li>
                <li>• Touch optimized</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Tech Stack */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold mb-8">Built with Modern Technologies</h2>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-600 dark:text-slate-400">
            <span className="px-4 py-2 bg-white dark:bg-slate-800 rounded-lg border">Next.js 15</span>
            <span className="px-4 py-2 bg-white dark:bg-slate-800 rounded-lg border">React 19</span>
            <span className="px-4 py-2 bg-white dark:bg-slate-800 rounded-lg border">TypeScript</span>
            <span className="px-4 py-2 bg-white dark:bg-slate-800 rounded-lg border">tRPC</span>
            <span className="px-4 py-2 bg-white dark:bg-slate-800 rounded-lg border">Prisma</span>
            <span className="px-4 py-2 bg-white dark:bg-slate-800 rounded-lg border">PostgreSQL</span>
            <span className="px-4 py-2 bg-white dark:bg-slate-800 rounded-lg border">Tailwind CSS</span>
            <span className="px-4 py-2 bg-white dark:bg-slate-800 rounded-lg border">NextAuth.js</span>
          </div>
        </div>
      </div>
    </div>
  );
}
