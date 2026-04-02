import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { secret } = await req.json();
  const envSecret = process.env.ADMIN_SECRET ?? 'admin-dev-secret';
  if (secret !== envSecret) {
    return NextResponse.json({ error: '인증 실패' }, { status: 401 });
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set('admin_token', envSecret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
  return response;
}
