import { PrismaClient } from '@prisma/client';
import { PrismaD1 } from '@prisma/adapter-d1';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { cache } from 'react';

/**
 * Returns a request-scoped PrismaClient (memoized via React cache):
 *  - Cloudflare Workers (prod + cf:dev) → D1 adapter via getCloudflareContext()
 *  - Local next dev → SQLite via DATABASE_URL
 */
export const getPrisma = cache((): PrismaClient => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { env } = getCloudflareContext() as any;
    if (env?.DB) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const adapter = new PrismaD1(env.DB as any);
      return new PrismaClient({ adapter });
    }
  } catch {
    // Not in Cloudflare Workers context — fall through to local SQLite
  }
  return _getLocalPrisma();
});

// ─── Local / dev singleton ────────────────────────────────────────────────────

const globalForPrisma = global as unknown as { _prisma?: PrismaClient };

function _getLocalPrisma(): PrismaClient {
  if (!globalForPrisma._prisma) {
    globalForPrisma._prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    });
  }
  return globalForPrisma._prisma;
}
