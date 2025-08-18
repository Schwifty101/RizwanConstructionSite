// Standardized error handling utility

export interface ErrorResponse {
  error: string
  message?: string
  code?: string
}

export class AppError extends Error {
  public readonly code: string
  public readonly statusCode: number
  public readonly isOperational: boolean

  constructor(message: string, statusCode = 500, code = 'INTERNAL_ERROR', isOperational = true) {
    super(message)
    this.code = code
    this.statusCode = statusCode
    this.isOperational = isOperational

    Error.captureStackTrace(this, this.constructor)
  }
}

export function handleDatabaseError(error: unknown, operation: string): never {
  console.error(`Database error during ${operation}:`, error)
  
  // Type guard for error objects with code property
  if (error && typeof error === 'object' && 'code' in error) {
    const errorWithCode = error as { code: string }
    
    if (errorWithCode.code === 'PGRST116') {
      throw new AppError(`Resource not found during ${operation}`, 404, 'NOT_FOUND')
    }
    
    if (errorWithCode.code === '42P01') {
      throw new AppError(`Table not found during ${operation}`, 500, 'TABLE_NOT_FOUND')
    }
  }
  
  throw new AppError(`Database operation failed: ${operation}`, 500, 'DATABASE_ERROR')
}

export function handleApiError(error: unknown, operation: string): never {
  console.error(`API error during ${operation}:`, error)
  
  if (error instanceof AppError) {
    throw error
  }
  
  throw new AppError(`API operation failed: ${operation}`, 500, 'API_ERROR')
}

export async function safeAsyncOperation<T>(
  operation: () => Promise<T>,
  fallback: T,
  operationName: string
): Promise<T> {
  try {
    return await operation()
  } catch (error) {
    // Enhanced error logging with more context
    const errorDetails = {
      operation: operationName,
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack,
        name: error.name
      } : String(error)
    }
    
    console.error(`❌ Safe operation failed:`, errorDetails)
    
    // In production, you might want to send this to a logging service
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to logging service (e.g., Sentry, LogRocket, etc.)
      console.warn(`⚠️ Production error occurred in ${operationName}, falling back to default value`)
    }
    
    return fallback
  }
}

// Enhanced database error handler with better logging
export async function safeDatabaseOperation<T>(
  operation: () => Promise<T>,
  fallback: T,
  operationName: string,
  shouldThrowOnError = false
): Promise<T> {
  try {
    return await operation()
  } catch (error) {
    const errorDetails = {
      operation: operationName,
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack,
        name: error.name,
        // Supabase specific error details
        ...('details' in error && { details: (error as Record<string, unknown>).details }),
        ...('hint' in error && { hint: (error as Record<string, unknown>).hint }),
        ...('code' in error && { code: (error as Record<string, unknown>).code })
      } : String(error),
      fallbackUsed: !shouldThrowOnError
    }
    
    console.error(`🗄️ Database operation failed:`, errorDetails)
    
    // Log to external service in production
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to logging service
      console.warn(`⚠️ Database error in production for ${operationName}`)
    }
    
    if (shouldThrowOnError) {
      throw error
    }
    
    return fallback
  }
}