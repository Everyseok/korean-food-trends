import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { AdminTrendsClient } from '@/components/admin/AdminTrendsClient';

export const dynamic = 'force-dynamic';

export default async function AdminTrendsPage() {
  // Auth check via cookie
  const cookieStore = cookies();
  const token = cookieStore.get('admin_token')?.value;
  const envSecret = process.env.ADMIN_SECRET ?? 'admin-dev-secret';

  if (token !== envSecret) {
    redirect('/admin/login');
  }

  const trends = await prisma.foodTrend.findMany({
    orderBy: [{ trendStartYear: 'asc' }, { trendStartMonth: 'asc' }, { sortOrder: 'asc' }],
    include: { _count: { select: { stores: true } } },
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
  }));

  return (
    <main className="min-h-screen bg-[#F5F5F7]">
      <AdminTrendsClient trends={serialized} />
    </main>
  );
}
