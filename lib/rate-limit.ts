import { prisma } from '@/lib/prisma';

const MAX_DAILY = 5;

function getKSTDateKey(): string {
  const now = new Date();
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().split('T')[0];
}

export async function checkRateLimit(
  fingerprint: string
): Promise<{ allowed: boolean; remaining: number }> {
  const dateKey = getKSTDateKey();
  const quota = await prisma.dailySubmissionQuota.findUnique({
    where: { fingerprint_dateKey: { fingerprint, dateKey } },
  });
  const count = quota?.count ?? 0;
  return { allowed: count < MAX_DAILY, remaining: Math.max(0, MAX_DAILY - count) };
}

export async function incrementQuota(fingerprint: string): Promise<void> {
  const dateKey = getKSTDateKey();
  await prisma.dailySubmissionQuota.upsert({
    where: { fingerprint_dateKey: { fingerprint, dateKey } },
    create: { fingerprint, dateKey, count: 1 },
    update: { count: { increment: 1 } },
  });
}
