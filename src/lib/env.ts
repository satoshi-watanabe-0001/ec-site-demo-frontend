import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['development', 'staging', 'production']).default('development'),
    NEXTAUTH_SECRET: z.string().min(32).optional(),
    NEXTAUTH_URL: z.string().url().optional(),
    DATABASE_URL: z.string().url().optional(),
  },

  client: {
    NEXT_PUBLIC_APP_NAME: z.string().default('Your App Name'),
    NEXT_PUBLIC_APP_VERSION: z.string().default('0.1.0'),
    NEXT_PUBLIC_API_URL: z.string().url().default('http://localhost:3001'),
    NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  },

  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    DATABASE_URL: process.env.DATABASE_URL,

    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },

  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
})

export const config = {
  isDevelopment: env.NODE_ENV === 'development',
  isStaging: env.NODE_ENV === 'staging',
  isProduction: env.NODE_ENV === 'production',

  api: {
    baseURL: env.NEXT_PUBLIC_API_URL,
    timeout: env.NODE_ENV === 'production' ? 30000 : 60000,
  },

  app: {
    name: env.NEXT_PUBLIC_APP_NAME,
    version: env.NEXT_PUBLIC_APP_VERSION,
    url: env.NEXT_PUBLIC_APP_URL,
  },
}
