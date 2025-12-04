/**
 * Retry wrapper for Prisma queries with exponential backoff
 * Handles transient Prisma Accelerate connection errors
 */

export async function withRetry<T>(
  operation: () => Promise<T>,
  options: {
    maxRetries?: number;
    initialDelay?: number;
    maxDelay?: number;
    shouldRetry?: (error: unknown) => boolean;
  } = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelay = 100,
    maxDelay = 2000,
    shouldRetry = (error: unknown) => {
      if (error && typeof error === 'object' && 'code' in error) {
        const code = (error as { code: string }).code;
        return code === 'P5000' || code === 'P6008' || code === 'P1001';
      }
      return false;
    },
  } = options;

  let lastError: unknown;
  let delay = initialDelay;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      if (attempt === maxRetries || !shouldRetry(error)) {
        throw error;
      }

      const jitter = Math.random() * 0.3 * delay;
      const currentDelay = Math.min(delay + jitter, maxDelay);

      console.warn(
        `Retry attempt ${attempt + 1}/${maxRetries} after ${Math.round(
          currentDelay
        )}ms`,
        error
      );

      await new Promise((resolve) => setTimeout(resolve, currentDelay));
      delay *= 2;
    }
  }

  throw lastError;
}
