/**
 * NAVER Map URL validation + lightweight parsing.
 * Enrichment (storeName, thumbnailUrl etc.) is handled by lib/naver-enrichment.ts.
 */

const NAVER_HOSTNAMES = new Set([
  'map.naver.com',
  'm.map.naver.com',
  'place.naver.com',
  'm.place.naver.com',
  'naver.me',
]);

export function isNaverMapUrl(rawUrl: string): boolean {
  try {
    const u = new URL(rawUrl.trim());
    return NAVER_HOSTNAMES.has(u.hostname);
  } catch {
    return false;
  }
}

export function sanitizeUrl(rawUrl: string): string {
  // Strip tracking params, ensure https
  try {
    const u = new URL(rawUrl.trim());
    u.protocol = 'https:';
    // Remove known tracking query params
    ['utm_source', 'utm_medium', 'utm_campaign', 'fbclid', 'gclid'].forEach(p =>
      u.searchParams.delete(p)
    );
    return u.toString();
  } catch {
    return rawUrl.trim();
  }
}
