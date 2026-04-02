import { getPrisma } from '@/lib/prisma';
import { FoodTrendTimeline } from '@/components/FoodTrendTimeline';
import type { FoodTrendData } from '@/types';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const db = await getPrisma();
  const rawTrends = await db.foodTrend.findMany({
    where: { visible: true },
    orderBy: [
      { trendStartYear: 'asc' },
      { trendStartMonth: 'asc' },
      { sortOrder: 'asc' },
    ],
    include: {
      stores: {
        where: { moderationStatus: { in: ['published', 'pending_enrichment'] } },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  const trends: FoodTrendData[] = rawTrends.map(trend => ({
    id: trend.id,
    slug: trend.slug,
    name: trend.name,
    description: trend.description,
    inventorName: trend.inventorName,
    imageUrl: trend.imageUrl,
    trendStartYear: trend.trendStartYear,
    trendStartMonth: trend.trendStartMonth,
    status: trend.status as FoodTrendData['status'],
    sortOrder: trend.sortOrder,
    visible: trend.visible,
    stores: trend.stores.map(s => ({
      id: s.id,
      foodTrendId: s.foodTrendId,
      sourceUrl: s.sourceUrl,
      sourcePlatform: s.sourcePlatform,
      storeName: s.storeName,
      address: s.address,
      businessHours: s.businessHours,
      thumbnailUrl: s.thumbnailUrl,
      moderationStatus: s.moderationStatus,
      createdAt: s.createdAt.toISOString(),
    })),
  }));

  return (
    <main className="min-h-screen">
      <FoodTrendTimeline trends={trends} />
    </main>
  );
}
