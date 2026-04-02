'use client';

import { CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ToastState } from '@/types';

interface Props {
  toast: NonNullable<ToastState>;
}

export function SubmissionToast({ toast }: Props) {
  return (
    <div
      className={cn(
        'fixed bottom-6 left-1/2 -translate-x-1/2 z-[60]',
        'flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)]',
        'animate-in slide-in-from-bottom-4 fade-in duration-300',
        toast.type === 'success'
          ? 'bg-[#1D1D1F] text-white'
          : 'bg-red-500 text-white'
      )}
    >
      {toast.type === 'success' ? (
        <CheckCircle className="w-4 h-4 flex-shrink-0" />
      ) : (
        <XCircle className="w-4 h-4 flex-shrink-0" />
      )}
      <span className="text-[13px] font-medium whitespace-nowrap">{toast.message}</span>
    </div>
  );
}
