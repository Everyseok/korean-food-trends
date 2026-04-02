/**
 * NAVER Map best-effort metadata enrichment service.
 *
 * Strategy (in order of reliability):
 *   1. Follow redirects to get canonical URL
 *   2. Fetch HTML and extract Open Graph tags (og:title, og:image)
 *   3. Extract JSON-LD structured data
 *   4. Extract meta description / address hints
 *   5. Parse place ID from URL structure
 *
 * This module is intentionally designed to be replaceable by:
 *   - NAVER Search API / Place API (official)
 *   - Async enrichment worker
 *   - LLM-based metadata pipeline
 *
 * IMPORTANT: Never generates fake data. Returns null for any field it cannot
 * reliably extract. Failure here NEVER blocks submission.
 *
 * TODO (future):
 *   - Replace with official NAVER Search API call
 *   - Add LLM food-match verification (verificationConfidence, verificationNote)
 *   - Trigger async enrichment queue on pending_enrichment status
 */

export interface EnrichmentResult {
  storeName: string | null;
  thumbnailUrl: string | null;
  address: string | null;
  businessHours: string | null;
  canonicalUrl: string | null;
  placeId: string | null;
  enrichmentStatus: 'complete' | 'partial' | 'failed';
  // TODO: LLM moderation fields
  // verificationConfidence?: number;  // 0–1
  // verificationNote?: string;
  // llmCheckedAt?: string;
}

const FETCH_TIMEOUT_MS = 6000;
const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

function extractPlaceIdFromUrl(url: string): string | null {
  try {
    const u = new URL(url);
    const m = u.pathname.match(/\/place\/(\d+)/);
    return m?.[1] ?? null;
  } catch {
    return null;
  }
}

function extractMetaContent(html: string, property: string): string | null {
  // og:title, og:image, og:description etc.
  const re = new RegExp(
    `<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']+)["']`,
    'i'
  );
  const alt = new RegExp(
    `<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${property}["']`,
    'i'
  );
  return html.match(re)?.[1] ?? html.match(alt)?.[1] ?? null;
}

function extractJsonLd(html: string): Record<string, unknown> | null {
  const re = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match: RegExpExecArray | null;
  while ((match = re.exec(html)) !== null) {
    try {
      const data = JSON.parse(match[1]);
      if (data?.['@type'] === 'LocalBusiness' || data?.name) return data;
    } catch {
      // ignore malformed JSON-LD
    }
  }
  return null;
}

function cleanText(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const cleaned = raw.trim().replace(/\s+/g, ' ');
  return cleaned.length > 0 ? cleaned : null;
}

function isSafeImageUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === 'https:' && !url.includes('javascript:');
  } catch {
    return false;
  }
}

export async function enrichNaverUrl(sourceUrl: string): Promise<EnrichmentResult> {
  const base: EnrichmentResult = {
    storeName: null,
    thumbnailUrl: null,
    address: null,
    businessHours: null,
    canonicalUrl: null,
    placeId: extractPlaceIdFromUrl(sourceUrl),
    enrichmentStatus: 'failed',
  };

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    const response = await fetch(sourceUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': USER_AGENT,
        Accept: 'text/html,application/xhtml+xml',
        'Accept-Language': 'ko-KR,ko;q=0.9',
      },
      redirect: 'follow',
    });
    clearTimeout(timer);

    const canonicalUrl = response.url !== sourceUrl ? response.url : null;
    if (canonicalUrl) {
      base.canonicalUrl = canonicalUrl;
      const pid = extractPlaceIdFromUrl(canonicalUrl);
      if (pid) base.placeId = pid;
    }

    const contentType = response.headers.get('content-type') ?? '';
    if (!contentType.includes('text/html')) {
      return { ...base, enrichmentStatus: base.placeId ? 'partial' : 'failed' };
    }

    const html = await response.text();

    // 1. Try og:title for store name
    const ogTitle = cleanText(extractMetaContent(html, 'og:title'));
    // NAVER map og:title often contains "| 네이버 지도" suffix — strip it
    const storeName = ogTitle
      ? ogTitle.replace(/\s*[|｜]\s*네이버.*$/i, '').trim() || null
      : null;

    // 2. Try og:image
    const ogImage = extractMetaContent(html, 'og:image');
    const thumbnailUrl =
      ogImage && isSafeImageUrl(ogImage) ? ogImage : null;

    // 3. Try JSON-LD
    const jsonLd = extractJsonLd(html);
    const ldName = cleanText(jsonLd?.name as string | undefined);
    const ldAddress = cleanText(
      (jsonLd?.address as Record<string, string> | undefined)?.streetAddress ??
      (jsonLd?.address as string | undefined)
    );

    // 4. Try og:description for address hints (NAVER often puts address there)
    const ogDesc = cleanText(extractMetaContent(html, 'og:description'));

    const finalStoreName = storeName ?? ldName;
    const finalAddress = ldAddress ?? (ogDesc && ogDesc.length < 80 ? ogDesc : null);

    const hasAny = !!(finalStoreName || thumbnailUrl || finalAddress || base.placeId);

    return {
      ...base,
      storeName: finalStoreName,
      thumbnailUrl,
      address: finalAddress,
      businessHours: null, // Requires JS rendering — leave for future enrichment
      canonicalUrl: base.canonicalUrl,
      placeId: base.placeId,
      enrichmentStatus: finalStoreName && thumbnailUrl ? 'complete' : hasAny ? 'partial' : 'failed',
    };
  } catch {
    // Timeout, network error, parsing failure — return base (never throw)
    return base;
  }
}
