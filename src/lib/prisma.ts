import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

// Maintain connection pool across serverless invocations in both dev & prod
globalForPrisma.prisma = prisma;

/**
 * Execute a Prisma query with automatic retry for serverless cold-start wakeups
 */
export async function withDbRetry<T>(
  fn: () => Promise<T>,
  retries = 2,
  delayMs = 1200
): Promise<T> {
  try {
    return await fn();
  } catch (err: any) {
    if (retries > 0) {
      // Wait for Neon compute to finish waking up, then retry
      await new Promise((res) => setTimeout(res, delayMs));
      return withDbRetry(fn, retries - 1, delayMs * 1.5);
    }
    throw err;
  }
}

export default prisma;
