'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const EVENT_TYPES = [
  { value: 'hospital',    label: '🏥 병원' },
  { value: 'grooming',    label: '✂️ 미용' },
  { value: 'vaccination', label: '💉 예방접종' },
  { value: 'deworming',   label: '💊 구충제' },
  { value: 'bath',        label: '🛁 목욕' },
  { value: 'other',       label: '📌 기타' },
]

type Event = { id: string; type: string; memo: string | null }

export default function SpecialEvents({ date, coupleId }: { date: string; coupleId: string }) {
  const [events, setEvents] = useState<Event[]>([])
  const [selectedType, setSelectedType] = useState('hospital')
  const [memo, setMemo] = useState('')
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    supabase
      .from('special_events')
      .select('id, type, memo')
      .eq('date', date)
      .eq('couple_id', coupleId)
      .order('created_at')
      .then(({ data }) => setEvents(data ?? []))
  }, [date, coupleId])

  async function handleAdd() {
    setError(null)
    const { data, error } = await supabase
      .from('special_events')
      .insert({ date, couple_id: coupleId, type: selectedType, memo: memo || null })
      .select('id, type, memo')
      .single()
    if (error) {
      setError(error.message)
      return
    }
    if (data) {
      setEvents(prev => [...prev, data])
      setMemo('')
      setAdding(false)
    }
  }

  async function handleDelete(id: string) {
    await supabase.from('special_events').delete().eq('id', id)
    setEvents(prev => prev.filter(e => e.id !== id))
  }

  const getLabel = (type: string) => EVENT_TYPES.find(t => t.value === type)?.label ?? type

  return (
    <div className="flex flex-col gap-2 py-5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">⭐ 특별한 날</label>
        <button
          type="button"
          onClick={() => setAdding(v => !v)}
          className="text-sm bg-amber-50 text-amber-600 font-semibold px-3 py-1.5 rounded-lg"
        >
          {adding ? '취소' : '+ 추가'}
        </button>
      </div>

      {adding && (
        <div className="flex flex-col gap-2 bg-amber-50 rounded-xl p-3">
          <div className="grid grid-cols-3 gap-1.5">
            {EVENT_TYPES.map(t => (
              <button
                key={t.value}
                type="button"
                onClick={() => setSelectedType(t.value)}
                className={`text-xs py-2 rounded-lg font-medium transition-colors ${
                  selectedType === t.value
                    ? 'bg-amber-400 text-white'
                    : 'bg-white text-gray-500 border border-gray-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={memo}
            onChange={e => setMemo(e.target.value)}
            placeholder="메모 (선택)"
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-amber-400 bg-white"
          />
          {error && <p className="text-xs text-red-500 px-1">{error}</p>}
          <button
            type="button"
            onClick={handleAdd}
            className="bg-amber-400 text-white text-sm font-semibold py-2 rounded-xl"
          >
            저장
          </button>
        </div>
      )}

      {events.length === 0 && !adding ? (
        <p className="text-sm text-gray-300 py-1">기록 없음</p>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {events.map(e => (
            <li key={e.id} className="flex items-center justify-between bg-amber-50 rounded-xl px-3 py-2.5">
              <div>
                <span className="text-sm text-gray-700 font-medium">{getLabel(e.type)}</span>
                {e.memo && <span className="text-xs text-gray-400 ml-2">{e.memo}</span>}
              </div>
              <button
                type="button"
                onClick={() => handleDelete(e.id)}
                className="text-xs text-gray-300 font-medium"
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
