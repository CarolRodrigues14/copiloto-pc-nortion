import dotenv from 'dotenv'
dotenv.config()

const requiredEnv = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'] as const

type RequiredEnv = (typeof requiredEnv)[number]

function getEnv(key: RequiredEnv): string {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value
}

export const config = {
  supabaseUrl: getEnv('SUPABASE_URL'),
  supabaseServiceRoleKey: getEnv('SUPABASE_SERVICE_ROLE_KEY'),
  port: process.env.PORT ? Number(process.env.PORT) : 3000,
}
