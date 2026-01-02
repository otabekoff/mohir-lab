/**
 * Safe database operation wrapper with error handling
 */

export class DatabaseError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export class AuthorizationError extends Error {
  constructor(message: string = 'Forbidden') {
    super(message);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends Error {
  constructor(message: string = 'Not Found') {
    super(message);
    this.name = 'NotFoundError';
  }
}

/**
 * Execute a database operation with proper error handling
 */
export async function withDatabase<T>(
  operation: () => Promise<T>,
  context?: string
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    const err = error as any;
    
    // Handle specific Prisma errors
    if (err.code === 'P1017') {
      throw new DatabaseError(
        'Database server is unavailable. Please try again later.',
        'UNAVAILABLE'
      );
    }
    
    if (err.code === 'P2025') {
      throw new NotFoundError('The requested resource was not found.');
    }

    if (err.code === 'P2002') {
      throw new DatabaseError(
        'This record already exists.',
        'DUPLICATE'
      );
    }

    if (err.name === 'PrismaClientInitializationError') {
      throw new DatabaseError(
        'Failed to connect to the database. Please ensure your internet connection is working.',
        'CONNECTION_FAILED'
      );
    }

    // Re-throw known custom errors
    if (err.name === 'AuthorizationError' || err.name === 'NotFoundError') {
      throw err;
    }

    // Log unexpected errors in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`Database operation error${context ? ` in ${context}` : ''}:`, err);
    }

    throw new DatabaseError(
      `An error occurred while processing your request. ${context ? `(${context})` : ''}`,
      'UNKNOWN'
    );
  }
}
