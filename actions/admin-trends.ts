'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

function checkAdminAuth(): boolean {
  const h = headers();
  const secret = h.get('x-admin-secret');
  const cookie = h.get('cookie') ?? '';
  const envSecret = process.env.ADMIN_SECRET ?? 'admin-dev-secret';
  // Check either header or cookie value
  const fromCookie = cookie
    .split(';')
    .find(c => c.trim().startsWith('admin_token='))
    ?.split('=')[1]
    ?.trim();
  return secret === envSecret || fromCookie === envSecret;
}

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
  try {
    await prisma.foodTrend.create({ data: parsed.data });
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
  await prisma.foodTrend.update({ where: { id }, data: parsed.data });
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
  await prisma.foodTrend.update({ where: { id }, data: { visible } });
  revalidatePath('/');
  revalidatePath('/admin/trends');
  return { success: true };
}

// Keep checkAdminAuth exported so it can be used if needed
export { checkAdminAuth };
