'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getPrisma } from '@/lib/prisma';

export async function verifyAdminToken(token: string): Promise<boolean> {
  const envSecret = process.env.ADMIN_SECRET ?? 'admin-dev-secret';
  return token === envSecret;
}

const TrendSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  description: z.string().min(1),
  inventorName: z.string().default(''),
  imageUrl: z.string().url(),
  trendStartYear: z.number().int().min(2000).max(2100),
  trendStartMonth: z.number().int().min(1).max(12),
  status: z.enum(['active', 'cooling', 'archived']),
  sortOrder: z.number().int(),
  visible: z.boolean().default(true),
});

export type AdminTrendResult =
  | { success: true }
  | { success: false; error: string };

export async function adminCreateTrend(
  adminToken: string,
  data: unknown
): Promise<AdminTrendResult> {
  if (!(await verifyAdminToken(adminToken))) {
    return { success: false, error: '인증 실패' };
  }
  const parsed = TrendSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message };
  }
  const db = await getPrisma();
  try {
    await db.foodTrend.create({ data: parsed.data });
    revalidatePath('/');
    revalidatePath('/admin/trends');
    return { success: true };
  } catch {
    return { success: false, error: 'slug가 이미 존재합니다.' };
  }
}

export async function adminUpdateTrend(
  adminToken: string,
  id: string,
  data: unknown
): Promise<AdminTrendResult> {
  if (!(await verifyAdminToken(adminToken))) {
    return { success: false, error: '인증 실패' };
  }
  const parsed = TrendSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message };
  }
  const db = await getPrisma();
  await db.foodTrend.update({ where: { id }, data: parsed.data });
  revalidatePath('/');
  revalidatePath('/admin/trends');
  return { success: true };
}

export async function adminToggleVisible(
  adminToken: string,
  id: string,
  visible: boolean
): Promise<AdminTrendResult> {
  if (!(await verifyAdminToken(adminToken))) {
    return { success: false, error: '인증 실패' };
  }
  const db = await getPrisma();
  await db.foodTrend.update({ where: { id }, data: { visible } });
  revalidatePath('/');
  revalidatePath('/admin/trends');
  return { success: true };
}
