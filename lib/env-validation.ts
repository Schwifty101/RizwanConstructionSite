// Environment variable validation utility

interface EnvConfig {
  [key: string]: {
    required: boolean
    description: string
    defaultValue?: string
    validation?: (value: string) => boolean
  }
}

const ENV_CONFIG: EnvConfig = {
  // Supabase configuration
  NEXT_PUBLIC_SUPABASE_URL: {
    required: true,
    description: 'Supabase project URL',
    validation: (value) => value.startsWith('https://') && value.includes('supabase')
  },
  NEXT_PUBLIC_SUPABASE_ANON_KEY: {
    required: true,
    description: 'Supabase anonymous key for client-side operations'
  },
  
  // Admin configuration
  ADMIN_EMAIL: {
    required: false,
    description: 'Admin email address for authentication',
    validation: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  },
  
  // Application configuration
  NODE_ENV: {
    required: true,
    description: 'Node environment',
    defaultValue: 'development',
    validation: (value) => ['development', 'production', 'test'].includes(value)
  },
  
  
  // Optional: Email service
  SMTP_HOST: {
    required: false,
    description: 'SMTP server for contact form emails'
  },
  
  SMTP_PORT: {
    required: false,
    description: 'SMTP server port',
    validation: (value) => !isNaN(parseInt(value)) && parseInt(value) > 0
  },
  
  SMTP_USER: {
    required: false,
    description: 'SMTP username'
  },
  
  SMTP_PASSWORD: {
    required: false,
    description: 'SMTP password'
  }
}

interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  missing: string[]
}

export function validateEnvironmentVariables(isClientSide = false): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
    missing: []
  }

  for (const [key, config] of Object.entries(ENV_CONFIG)) {
    // Skip server-side only variables on client side
    if (isClientSide && !key.startsWith('NEXT_PUBLIC_')) {
      continue
    }

    const value = process.env[key]

    // Check required variables
    if (config.required && !value) {
      result.errors.push(`Missing required environment variable: ${key} (${config.description})`)
      result.missing.push(key)
      result.isValid = false
      continue
    }

    // Check optional variables
    if (!value) {
      if (!config.required) {
        result.warnings.push(`Optional environment variable not set: ${key} (${config.description})`)
      }
      continue
    }

    // Validate format if validation function provided
    if (config.validation && !config.validation(value)) {
      result.errors.push(`Invalid format for ${key}: ${config.description}`)
      result.isValid = false
    }
  }

  return result
}

export function logEnvironmentStatus(): void {
  const serverValidation = validateEnvironmentVariables(false)
  
  console.log('🔧 Environment Variable Status:')
  
  if (serverValidation.isValid) {
    console.log('✅ All required environment variables are properly configured')
  } else {
    console.error('❌ Environment validation failed:')
    serverValidation.errors.forEach(error => console.error(`  - ${error}`))
  }
  
  if (serverValidation.warnings.length > 0) {
    console.warn('⚠️  Optional variables not configured:')
    serverValidation.warnings.forEach(warning => console.warn(`  - ${warning}`))
  }
  
  // Log current environment
  console.log(`🌍 Current environment: ${process.env.NODE_ENV || 'unknown'}`)
  
  // Log Supabase connection status
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.log('✅ Supabase configuration detected')
  } else {
    console.error('❌ Supabase configuration missing')
  }
}

// Helper to get environment variable with validation
export function getEnvVar(key: keyof typeof ENV_CONFIG, fallback?: string): string {
  const config = ENV_CONFIG[key]
  const value = process.env[key] || fallback || config.defaultValue

  if (!value && config.required) {
    throw new Error(`Missing required environment variable: ${key}`)
  }

  if (value && config.validation && !config.validation(value)) {
    throw new Error(`Invalid environment variable format: ${key}`)
  }

  return value || ''
}

// Check if we're in production
export const isProduction = () => process.env.NODE_ENV === 'production'

// Check if we're in development
export const isDevelopment = () => process.env.NODE_ENV === 'development'

// Check if optional services are configured
export const hasEmailService = () => Boolean(
  process.env.SMTP_HOST && 
  process.env.SMTP_PORT && 
  process.env.SMTP_USER && 
  process.env.SMTP_PASSWORD
)