import { z } from 'zod'

// In dev with stubs, we allow placeholder values for non-critical services
const isDevStub = process.env['NODE_ENV'] !== 'production'

const optionalInDev = (schema: z.ZodString) =>
  isDevStub ? schema.optional().default('stub') : schema

const envSchema = z.object({
  // App
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  APP_URL: z.string().url().optional().default('http://localhost:3000'),

  // Clerk Auth
  CLERK_SECRET_KEY: z.string().min(1),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().optional().default(''),
  NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().default('/login'),
  NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string().default('/signup'),

  // Supabase / PostgreSQL
  DATABASE_URL: z.string().url().optional().default('postgresql://stub:stub@localhost:5432/stub'),
  DIRECT_URL: z.string().url().optional().default('postgresql://stub:stub@localhost:5432/stub'),

  // Cloudflare R2
  R2_ACCOUNT_ID: optionalInDev(z.string().min(1)),
  R2_ACCESS_KEY_ID: optionalInDev(z.string().min(1)),
  R2_SECRET_ACCESS_KEY: optionalInDev(z.string().min(1)),
  R2_BUCKET_NAME: optionalInDev(z.string().min(1)),
  R2_PUBLIC_URL: z.string().url().optional().default('http://localhost'),

  // Razorpay
  RAZORPAY_KEY_ID: optionalInDev(z.string().min(1)),
  RAZORPAY_KEY_SECRET: optionalInDev(z.string().min(1)),
  RAZORPAY_WEBHOOK_SECRET: optionalInDev(z.string().min(1)),

  // Redis
  REDIS_URL: z.string().url().optional().default('redis://localhost:6379'),

  // Resend (email)
  RESEND_API_KEY: optionalInDev(z.string().min(1)),
  EMAIL_FROM: z.string().email().default('noreply@creatorosbharat.com'),

  // MSG91 (SMS/OTP)
  MSG91_AUTH_KEY: optionalInDev(z.string().min(1)),
  MSG91_TEMPLATE_ID: optionalInDev(z.string().min(1)),

  // Interakt (WhatsApp)
  INTERAKT_API_KEY: optionalInDev(z.string().min(1)),
  INTERAKT_WEBHOOK_SECRET: optionalInDev(z.string().min(1)),

  // Claude AI
  ANTHROPIC_API_KEY: optionalInDev(z.string().min(1)),

  // PostHog
  NEXT_PUBLIC_POSTHOG_KEY: optionalInDev(z.string().min(1)),
  NEXT_PUBLIC_POSTHOG_HOST: z.string().url().default('https://app.posthog.com'),

  // Security — 64 hex chars (32 bytes) for AES-256
  ENCRYPTION_KEY: z
    .string()
    .length(64)
    .optional()
    .default('0000000000000000000000000000000000000000000000000000000000000000'),
})

export type Env = z.infer<typeof envSchema>

export function validateEnv(): Env {
  const result = envSchema.safeParse(process.env)
  if (!result.success) {
    const missing = result.error.issues
      .map((i) => `  - ${i.path.join('.')}: ${i.message}`)
      .join('\n')
    throw new Error(`❌ Invalid environment variables:\n${missing}`)
  }
  return result.data
}

let _env: Env | undefined

export function getEnv(): Env {
  if (!_env) {
    _env = validateEnv()
  }
  return _env
}
