import { PrismaClient } from '@prisma/client';
import { PrismaD1 } from '@prisma/adapter-d1';
import type { D1Database } from './cloudflare-env';

/**
 * Returns a PrismaClient for the current runtime:
 *  - Local dev  → SQLite via DATABASE_URL
 *  - Cloudflare Workers → Cloudflare D1 via env.DB binding
 *
 * Usage: `const db = await getPrisma();`
 */
export async function getPrisma(): Promise<PrismaClient> {
  // Local dev: DATABASE_URL is set (points to ./dev.db)
  if (process.env.DATABASE_URL) {
    return _getLocalPrisma();
  }

  // Cloudflare Workers runtime — use D1 adapter
  try {
    const { getCloudflareContext } = await import('@opennextjs/cloudflare');
    const ctx = await getCloudflareContext({ async: true });
    const d1 = (ctx.env as Record<string, unknown>).DB as D1Database | undefined;
    if (d1) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const adapter = new PrismaD1(d1 as any);
      return new PrismaClient({ adapter });
    }
  } catch {
    // Not in Workers context (build time, test, etc.)
  }

  // Final fallback
  return _getLocalPrisma();
}

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
