import { z } from 'zod'

const envSchema = z.object({
    // Database
    DATABASE_URL: z.string().url(),

    // NextAuth
    NEXTAUTH_SECRET: z.string().min(1),
    NEXTAUTH_URL: z.string().url(),

    // Node environment
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

    // Optional: AI/Analytics
    OPENAI_API_KEY: z.string().optional(),
    VERCEL_AI_API_KEY: z.string().optional(),

    // Optional: SAP Integration
    SAP_API_URL: z.string().url().optional(),
    SAP_API_KEY: z.string().optional(),
    SAP_CLIENT_ID: z.string().optional(),
    SAP_CLIENT_SECRET: z.string().optional(),

    // Optional: Firebase
    FCM_SERVER_KEY: z.string().optional(),
    FCM_SENDER_ID: z.string().optional(),
})

export const env = envSchema.parse(process.env)

export type Env = z.infer<typeof envSchema>
