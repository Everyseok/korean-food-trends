/**
 * Cloudflare Workers runtime environment bindings.
 * Available via: const { env } = await getCloudflareContext({ async: true });
 *
 * ADMIN_SECRET must be set as an encrypted secret via:
 *   Cloudflare Dashboard → Workers → Settings → Environment Variables
 *   or: npx wrangler secret put ADMIN_SECRET
 */

// Cloudflare Workers global types (not in @types/node)
// The actual implementations are provided by the Cloudflare runtime.
export interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
  exec(query: string): Promise<D1ExecResult>;
}

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(colName?: string): Promise<T | null>;
  run<T = unknown>(): Promise<D1Result<T>>;
  all<T = unknown>(): Promise<D1Result<T>>;
  raw<T = unknown[]>(): Promise<T[]>;
}

interface D1Result<T = unknown> {
  results: T[];
  success: boolean;
  meta: Record<string, unknown>;
  error?: string;
}

interface D1ExecResult {
  count: number;
  duration: number;
}

export interface CloudflareEnv {
  DB: D1Database;
  ASSETS: { fetch: typeof fetch };
  NODE_ENV?: string;
  ADMIN_SECRET?: string;
}
