/**
 * Cloudflare Workers environment bindings.
 * Used for D1 database access in production.
 *
 * TODO: When deploying to Cloudflare Workers with D1, update prisma.ts to use
 * the Prisma D1 adapter:
 *   import { PrismaD1 } from '@prisma/adapter-d1';
 *   const adapter = new PrismaD1(env.DB);
 *   const prisma = new PrismaClient({ adapter });
 */

// Cloudflare-specific types (not available in Node.js TypeScript environment)
// These are declared here to avoid build errors; they will be resolved at
// runtime by the Cloudflare Workers environment.
type D1Database = unknown;
type Fetcher = unknown;

export interface CloudflareEnv {
  DB: D1Database;
  ASSETS: Fetcher;
  ADMIN_SECRET?: string;
  DATABASE_URL?: string;
}
