'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [secret, setSecret] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret }),
    });
    if (res.ok) {
      router.push('/admin/trends');
    } else {
      setError('비밀번호가 올바르지 않습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-3xl p-8 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
        <h1 className="text-2xl font-semibold text-[#1D1D1F] mb-1">관리자</h1>
        <p className="text-sm text-[#8E8E93] mb-6">한국 푸드 트렌드</p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={secret}
            onChange={e => setSecret(e.target.value)}
            placeholder="관리자 비밀번호"
            className="w-full px-4 py-3 rounded-xl bg-[#F5F5F7] border border-transparent focus:border-[#0071E3] focus:bg-white outline-none text-[14px] text-[#1D1D1F] transition-colors mb-3"
          />
          {error && <p className="text-[12px] text-red-500 mb-3">{error}</p>}
          <button
            type="submit"
            className="w-full py-3 bg-[#1D1D1F] hover:bg-[#3A3A3C] text-white font-semibold rounded-2xl text-[15px] transition-colors"
          >
            로그인
          </button>
        </form>
      </div>
    </div>
  );
}
