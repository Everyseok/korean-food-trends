'use client';

import { MapPin } from 'lucide-react';

interface Props {
  onAddStore: () => void;
}

export function EmptyState({ onAddStore }: Props) {
  return (
    <button
      onClick={onAddStore}
      className="w-full flex flex-col items-center gap-1.5 py-4 px-3 rounded-xl border border-dashed border-[#E5E5EA] text-[#C7C7CC] hover:text-[#AEAEB2] hover:border-[#D1D1D6] transition-colors group"
    >
      <MapPin className="w-4 h-4 group-hover:text-[#8E8E93] transition-colors" />
      <span className="text-[11px] font-medium">첫 판매점을 등록해보세요</span>
    </button>
  );
}
