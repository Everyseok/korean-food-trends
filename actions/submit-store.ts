'use server';

import { z } from 'zod';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { getPrisma } from '@/lib/prisma';
import { isNaverMapUrl, sanitizeUrl } from '@/lib/naver-parser';
import { enrichNaverUrl } from '@/lib/naver-enrichment';
import { checkRateLimit, incrementQuota } from '@/lib/rate-limit';
import type { SubmitStoreResult, StoreSubmissionData } from '@/types';

const Schema = z.object({
  foodTrendId: z.string().min(1, '트렌드 정보가 없습니다.'),
  sourceUrl: z.string().url('올바른 URL 형식이 아닙니다.').max(2000),
});

async function getFingerprint(): Promise<string> {
  const h = await headers(); // Next.js 15: headers() is async
  return (
    h.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    h.get('x-real-ip') ??
    'anonymous'
  );
}

export async function submitStore(data: unknown): Promise<SubmitStoreResult> {
  const db = await getPrisma();

  // 1. Validate input
  const parsed = Schema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message };
  }
  const { foodTrendId, sourceUrl: rawUrl } = parsed.data;

  // 2. Sanitize + validate NAVER URL
  const sourceUrl = sanitizeUrl(rawUrl);
  if (!isNaverMapUrl(sourceUrl)) {
    return { success: false, error: '네이버 지도 링크만 등록할 수 있습니다.' };
  }

  // 3. Rate limit
  const fingerprint = await getFingerprint();
  const { allowed } = await checkRateLimit(fingerprint);
  if (!allowed) {
    return {
      success: false,
      error: '오늘 최대 등록 횟수(5회)를 초과했습니다. 내일 다시 시도해주세요.',
    };
  }

  // 4. Verify food trend exists
  const trend = await db.foodTrend.findUnique({ where: { id: foodTrendId } });
  if (!trend) {
    return { success: false, error: '존재하지 않는 트렌드입니다.' };
  }

  // 5. Duplicate check
  const existing = await db.storeSubmission.findUnique({
    where: { foodTrendId_sourceUrl: { foodTrendId, sourceUrl } },
  });
  if (existing) {
    return { success: false, error: '이미 등록된 링크입니다.' };
  }

  // 6. Best-effort enrichment (never blocks submission)
  let enriched;
  try {
    enriched = await enrichNaverUrl(sourceUrl);
  } catch {
    enriched = null;
  }

  const storeName = enriched?.storeName ?? '상호명 확인 중';
  const moderationStatus =
    enriched?.enrichmentStatus === 'failed' ? 'pending_enrichment' : 'published';

  // Metadata for future LLM moderation pipeline
  const metadata = {
    placeId: enriched?.placeId,
    canonicalUrl: enriched?.canonicalUrl,
    enrichmentStatus: enriched?.enrichmentStatus ?? 'failed',
    enrichedAt: new Date().toISOString(),
    // TODO: LLM verification fields:
    // verificationConfidence: null,
    // verificationNote: null,
    // llmCheckedAt: null,
    // foodTrendSlug: trend.slug,
  };

  // 7. Persist
  const store = await db.storeSubmission.create({
    data: {
      foodTrendId,
      sourceUrl,
      sourcePlatform: 'naver_map',
      storeName,
      address: enriched?.address ?? null,
      businessHours: enriched?.businessHours ?? null,
      thumbnailUrl: enriched?.thumbnailUrl ?? null,
      metadataJson: JSON.stringify(metadata),
      moderationStatus,
      submitterFingerprint: fingerprint,
    },
  });

  // 8. Increment quota
  await incrementQuota(fingerprint);

  // 9. Revalidate
  revalidatePath('/');

  const result: StoreSubmissionData = {
    id: store.id,
    foodTrendId: store.foodTrendId,
    sourceUrl: store.sourceUrl,
    sourcePlatform: store.sourcePlatform,
    storeName: store.storeName,
    address: store.address,
    businessHours: store.businessHours,
    thumbnailUrl: store.thumbnailUrl,
    moderationStatus: store.moderationStatus,
    createdAt: store.createdAt.toISOString(),
  };

  return { success: true, store: result };
}
