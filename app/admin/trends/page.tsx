import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getPrisma } from '@/lib/prisma';
import { AdminTrendsClient } from '@/components/admin/AdminTrendsClient';

export const dynamic = 'force-dynamic';

export default async function AdminTrendsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  const envSecret = process.env.ADMIN_SECRET ?? 'admin-dev-secret';

  if (token !== envSecret) {
    redirect('/admin/login');
  }

  const db = await getPrisma();
  const trends = await db.foodTrend.findMany({
    orderBy: [{ trendStartYear: 'asc' }, { trendStartMonth: 'asc' }, { sortOrder: 'asc' }],
    include: {
      _count: { select: { stores: true } },
      stores: {
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          storeName: true,
          sourceUrl: true,
          moderationStatus: true,
          createdAt: true,
        },
      },
    },
  });

  const serialized = trends.map(t => ({
    id: t.id,
    slug: t.slug,
    name: t.name,
    description: t.description,
    inventorName: t.inventorName,
    imageUrl: t.imageUrl,
    trendStartYear: t.trendStartYear,
    trendStartMonth: t.trendStartMonth,
    status: t.status,
    sortOrder: t.sortOrder,
    visible: t.visible,
    storeCount: t._count.stores,
    stores: t.stores.map(s => ({
      id: s.id,
      storeName: s.storeName,
      sourceUrl: s.sourceUrl,
      moderationStatus: s.moderationStatus,
      createdAt: s.createdAt.toISOString(),
    })),
  }));

  return (
    <main className="min-h-screen bg-[#F5F5F7]">
      <AdminTrendsClient trends={serialized} />
    </main>
  );
}
