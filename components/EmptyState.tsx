'use client';

import { MapPin } from 'lucide-react';

interface Props {
  onAddStore: () => void;
}

export function EmptyState({ onAddStore }: Props) {
  return (
    <button
      onClick={onAddStore}
      className="w-full flex items-center gap-2 py-2 px-0 text-left group"
    >
      <MapPin className="w-3.5 h-3.5 text-[#D1D1D6] group-hover:text-[#AEAEB2] transition-colors duration-150 flex-shrink-0" />
      <span className="text-[11px] text-[#C7C7CC] group-hover:text-[#8E8E93] transition-colors duration-150">
        첫 판매점 등록
      </span>
    </button>
  );
}
