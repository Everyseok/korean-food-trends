'use client';

import { useState } from 'react';
import { Eye, EyeOff, Edit2, Plus, Save, X, Link, ChevronDown, ChevronUp } from 'lucide-react';
import { adminCreateTrend, adminToggleVisible, adminUpdateTrend } from '@/actions/admin-trends';
import { cn } from '@/lib/utils';

interface TrendStore {
  id: string;
  storeName: string;
  sourceUrl: string;
  moderationStatus: string;
  createdAt: string;
}

interface TrendRow {
  id: string;
  slug: string;
  name: string;
  description: string;
  inventorName: string;
  imageUrl: string;
  trendStartYear: number;
  trendStartMonth: number;
  status: string;
  sortOrder: number;
  visible: boolean;
  storeCount: number;
  stores: TrendStore[];
}

const STATUS_LABELS: Record<string, string> = {
  active: '인기중',
  cooling: '소강',
  archived: '종료',
};

interface FormState {
  name: string;
  slug: string;
  description: string;
  inventorName: string;
  imageUrl: string;
  trendStartYear: number;
  trendStartMonth: number;
  status: 'active' | 'cooling' | 'archived';
  sortOrder: number;
  visible: boolean;
}

const EMPTY_FORM: FormState = {
  name: '',
  slug: '',
  description: '',
  inventorName: '',
  imageUrl: 'https://placehold.co/400x300/F5F5F7/8E8E93?text=new',
  trendStartYear: new Date().getFullYear(),
  trendStartMonth: new Date().getMonth() + 1,
  status: 'active',
  sortOrder: 99,
  visible: true,
};

export function AdminTrendsClient({ trends: initial }: { trends: TrendRow[] }) {
  const [trends, setTrends] = useState(initial);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedLinksId, setExpandedLinksId] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [editForm, setEditForm] = useState<FormState>({
    slug: '', name: '', description: '', inventorName: '', imageUrl: '',
    trendStartYear: 2024, trendStartMonth: 1, status: 'active', sortOrder: 0, visible: true,
  });
  const [newForm, setNewForm] = useState<FormState>({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const getToken = () => {
    if (typeof document === 'undefined') return '';
    return document.cookie.split(';').find(c => c.trim().startsWith('admin_token='))?.split('=')[1]?.trim() ?? '';
  };

  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  const startEdit = (t: TrendRow) => {
    setEditingId(t.id);
    setEditForm({
      slug: t.slug, name: t.name, description: t.description, inventorName: t.inventorName,
      imageUrl: t.imageUrl, trendStartYear: t.trendStartYear, trendStartMonth: t.trendStartMonth,
      status: (t.status as 'active' | 'cooling' | 'archived'), sortOrder: t.sortOrder, visible: t.visible,
    });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    setSaving(true);
    const result = await adminUpdateTrend(getToken(), editingId, editForm);
    setSaving(false);
    if (result.success) {
      setTrends(prev => prev.map(t => t.id === editingId ? { ...t, ...editForm } : t));
      setEditingId(null);
      flash('저장됐습니다.');
    } else {
      flash(result.error);
    }
  };

  const saveNew = async () => {
    setSaving(true);
    const result = await adminCreateTrend(getToken(), newForm);
    setSaving(false);
    if (result.success) {
      setShowNew(false);
      setNewForm({ ...EMPTY_FORM });
      flash('추가됐습니다. 새로고침하면 목록에 반영됩니다.');
    } else {
      flash(result.error);
    }
  };

  const toggleVisible = async (t: TrendRow) => {
    const result = await adminToggleVisible(getToken(), t.id, !t.visible);
    if (result.success) {
      setTrends(prev => prev.map(r => r.id === t.id ? { ...r, visible: !r.visible } : r));
    }
  };

  const fieldClass = "w-full px-3 py-2 rounded-lg bg-[#F5F5F7] border border-transparent focus:border-[#0071E3] focus:bg-white outline-none text-[13px] text-[#1D1D1F] transition-colors";
  const labelClass = "block text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider mb-1";

  const TrendForm = ({
    form, setForm, onSave, onCancel,
  }: {
    form: FormState;
    setForm: (f: FormState) => void;
    onSave: () => void;
    onCancel: () => void;
  }) => (
    <div className="bg-[#F5F5F7] rounded-2xl p-4 mt-2 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>이름</label>
          <input className={fieldClass} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <label className={labelClass}>slug</label>
          <input className={fieldClass} value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} />
        </div>
      </div>
      <div>
        <label className={labelClass}>설명</label>
        <textarea className={cn(fieldClass, 'resize-none')} rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
      </div>
      <div>
        <label className={labelClass}>발명자 (선택)</label>
        <input className={fieldClass} placeholder="비워두기 가능" value={form.inventorName} onChange={e => setForm({ ...form, inventorName: e.target.value })} />
      </div>
      {/* Image URL + preview */}
      <div>
        <label className={labelClass}>이미지 URL</label>
        <input
          className={fieldClass}
          value={form.imageUrl}
          onChange={e => setForm({ ...form, imageUrl: e.target.value })}
          placeholder="https://..."
        />
        {form.imageUrl && (
          <div className="mt-2 flex items-start gap-3">
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#E5E5EA] flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={form.imageUrl}
                alt="preview"
                className="w-full h-full object-cover"
                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </div>
            <p className="text-[11px] text-[#AEAEB2] leading-snug mt-1">
              이미지 URL을 붙여넣으면<br />바로 미리보기가 표시됩니다.
            </p>
          </div>
        )}
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className={labelClass}>연도</label>
          <input type="number" className={fieldClass} value={form.trendStartYear} onChange={e => setForm({ ...form, trendStartYear: Number(e.target.value) })} />
        </div>
        <div>
          <label className={labelClass}>월</label>
          <input type="number" min={1} max={12} className={fieldClass} value={form.trendStartMonth} onChange={e => setForm({ ...form, trendStartMonth: Number(e.target.value) })} />
        </div>
        <div>
          <label className={labelClass}>정렬</label>
          <input type="number" className={fieldClass} value={form.sortOrder} onChange={e => setForm({ ...form, sortOrder: Number(e.target.value) })} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>상태</label>
          <select className={fieldClass} value={form.status} onChange={e => setForm({ ...form, status: e.target.value as 'active' | 'cooling' | 'archived' })}>
            <option value="active">인기중</option>
            <option value="cooling">소강</option>
            <option value="archived">종료</option>
          </select>
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.visible} onChange={e => setForm({ ...form, visible: e.target.checked })} />
            <span className="text-[13px] text-[#6E6E73]">공개</span>
          </label>
        </div>
      </div>
      <div className="flex gap-2 pt-1">
        <button onClick={onSave} disabled={saving} className="flex items-center gap-1.5 px-4 py-2 bg-[#1D1D1F] text-white rounded-xl text-[13px] font-semibold hover:bg-[#3A3A3C] transition-colors disabled:opacity-50">
          <Save className="w-3.5 h-3.5" /> {saving ? '저장중...' : '저장'}
        </button>
        <button onClick={onCancel} className="flex items-center gap-1.5 px-4 py-2 bg-[#E5E5EA] text-[#1D1D1F] rounded-xl text-[13px] font-semibold hover:bg-[#D1D1D6] transition-colors">
          <X className="w-3.5 h-3.5" /> 취소
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-[#1D1D1F]">푸드 트렌드 관리</h1>
          <p className="text-[13px] text-[#8E8E93] mt-0.5">관리자 전용 · 일반 사용자에게 노출되지 않음</p>
        </div>
        <button
          onClick={() => setShowNew(v => !v)}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#0071E3] text-white rounded-xl text-[13px] font-semibold hover:bg-[#0077ED] transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> 트렌드 추가
        </button>
      </div>

      {msg && (
        <div className="mb-4 px-4 py-2.5 bg-[#1D1D1F] text-white rounded-xl text-[13px]">{msg}</div>
      )}

      {/* New trend form */}
      {showNew && (
        <div className="mb-6 bg-white rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
          <h2 className="text-[15px] font-semibold text-[#1D1D1F] mb-3">새 트렌드 추가</h2>
          <TrendForm
            form={newForm}
            setForm={setNewForm}
            onSave={saveNew}
            onCancel={() => setShowNew(false)}
          />
        </div>
      )}

      {/* Trend list */}
      <div className="space-y-2">
        {trends.map(t => (
          <div key={t.id} className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden">
            {/* Trend row */}
            <div className="flex items-center gap-3 px-4 py-3">
              {/* Thumbnail */}
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#F5F5F7] flex-shrink-0">
                {t.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={t.imageUrl} alt="" className="w-full h-full object-cover" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[15px] font-semibold text-[#1D1D1F]">{t.name}</span>
                  <span className="text-[10px] text-[#98989D]">{t.trendStartYear}.{String(t.trendStartMonth).padStart(2, '0')}</span>
                  <span className={cn(
                    'text-[10px] px-1.5 py-0.5 rounded-full font-medium',
                    t.status === 'active' ? 'bg-emerald-50 text-emerald-600' :
                    t.status === 'cooling' ? 'bg-amber-50 text-amber-600' :
                    'bg-gray-100 text-gray-500'
                  )}>
                    {STATUS_LABELS[t.status]}
                  </span>
                  {!t.visible && <span className="text-[10px] text-[#AEAEB2]">숨김</span>}
                </div>
                <p className="text-[12px] text-[#8E8E93] mt-0.5 truncate">{t.description}</p>
                <span className="text-[11px] text-[#C7C7CC]">{t.slug}</span>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                {/* Links toggle */}
                <button
                  onClick={() => setExpandedLinksId(prev => prev === t.id ? null : t.id)}
                  className={cn(
                    'flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium transition-colors',
                    expandedLinksId === t.id
                      ? 'bg-[#E5E5EA] text-[#1D1D1F]'
                      : 'text-[#8E8E93] hover:bg-[#F5F5F7]'
                  )}
                  title="등록된 링크 보기"
                >
                  <Link className="w-3 h-3" />
                  <span>{t.storeCount}</span>
                  {expandedLinksId === t.id
                    ? <ChevronUp className="w-3 h-3" />
                    : <ChevronDown className="w-3 h-3" />
                  }
                </button>

                <button onClick={() => toggleVisible(t)} className="p-1.5 rounded-lg hover:bg-[#F5F5F7] transition-colors" title={t.visible ? '숨기기' : '공개'}>
                  {t.visible ? <Eye className="w-4 h-4 text-[#6E6E73]" /> : <EyeOff className="w-4 h-4 text-[#AEAEB2]" />}
                </button>
                <button onClick={() => editingId === t.id ? setEditingId(null) : startEdit(t)} className="p-1.5 rounded-lg hover:bg-[#F5F5F7] transition-colors">
                  <Edit2 className="w-4 h-4 text-[#6E6E73]" />
                </button>
              </div>
            </div>

            {/* Submitted links — for manual verification */}
            {expandedLinksId === t.id && (
              <div className="border-t border-[#F5F5F7] px-4 py-3">
                {t.stores.length === 0 ? (
                  <p className="text-[12px] text-[#C7C7CC]">등록된 링크가 없습니다.</p>
                ) : (
                  <div className="space-y-1.5">
                    {t.stores.map((s, idx) => (
                      <div key={s.id} className="flex items-start gap-2">
                        <span className="text-[10px] text-[#C7C7CC] w-4 pt-[2px] flex-shrink-0">{idx + 1}</span>
                        <div className="flex-1 min-w-0">
                          <a
                            href={s.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[12px] text-[#0071E3] hover:underline truncate block"
                          >
                            {s.sourceUrl}
                          </a>
                          {s.storeName && (
                            <span className="text-[11px] text-[#8E8E93]">{s.storeName}</span>
                          )}
                          <span className="text-[10px] text-[#C7C7CC] ml-1">
                            · {new Date(s.createdAt).toLocaleDateString('ko-KR')}
                          </span>
                        </div>
                        <span className={cn(
                          'text-[10px] px-1.5 py-0.5 rounded-full flex-shrink-0',
                          s.moderationStatus === 'published'
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-amber-50 text-amber-600'
                        )}>
                          {s.moderationStatus === 'published' ? '공개' : s.moderationStatus}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {editingId === t.id && (
              <div className="px-4 pb-4">
                <TrendForm
                  form={editForm}
                  setForm={setEditForm}
                  onSave={saveEdit}
                  onCancel={() => setEditingId(null)}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
