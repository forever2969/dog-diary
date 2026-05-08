'use client'

import Calendar from 'react-calendar'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const EVENT_COLORS: Record<string, string> = {
  hospital:    'bg-red-400',
  grooming:    'bg-purple-400',
  vaccination: 'bg-blue-400',
  deworming:   'bg-green-400',
  bath:        'bg-sky-400',
  other:       'bg-gray-400',
}

type Props = {
  markedDates: string[]
  specialEvents: Record<string, string[]>
  coupleId: string
}

export default function DiaryCalendar({ markedDates: initialDates, specialEvents: initialEvents, coupleId }: Props) {
  const router = useRouter()
  const [markedDates, setMarkedDates] = useState(initialDates)
  const [specialEvents, setSpecialEvents] = useState(initialEvents)
  const [navigating, setNavigating] = useState(false)

  useEffect(() => {
    supabase
      .from('special_events')
      .select('date, type')
      .eq('couple_id', coupleId)
      .then(({ data }) => {
        if (!data) return
        const map = data.reduce<Record<string, string[]>>((acc, row) => {
          acc[row.date] = [...(acc[row.date] ?? []), row.type]
          return acc
        }, {})
        setSpecialEvents(map)
      })
  }, [coupleId])

  useEffect(() => {
    const channel = supabase
      .channel('diary-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'diary', filter: `couple_id=eq.${coupleId}` },
        payload => {
          if (payload.eventType === 'INSERT') setMarkedDates(prev => [...prev, (payload.new as { date: string }).date])
          if (payload.eventType === 'DELETE') setMarkedDates(prev => prev.filter(d => d !== (payload.old as { date: string }).date))
        }
      )
      .on('postgres_changes', { event: '*', schema: 'public', table: 'special_events', filter: `couple_id=eq.${coupleId}` },
        payload => {
          if (payload.eventType === 'INSERT') {
            const { date, type } = payload.new as { date: string; type: string }
            setSpecialEvents(prev => ({ ...prev, [date]: [...(prev[date] ?? []), type] }))
          }
          if (payload.eventType === 'DELETE') {
            const { date, type } = payload.old as { date: string; type: string }
            setSpecialEvents(prev => {
              const updated = (prev[date] ?? []).filter(t => t !== type)
              if (updated.length === 0) {
                const { [date]: _, ...rest } = prev
                return rest
              }
              return { ...prev, [date]: updated }
            })
          }
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [coupleId])

  function handleClickDay(value: Date) {
    const date = value.toLocaleDateString('sv-SE')
    setNavigating(true)
    router.push(`/diary/${date}`)
  }

  function tileContent({ date, view }: { date: Date; view: string }) {
    if (view !== 'month') return null
    const dateStr = date.toLocaleDateString('sv-SE')
    const hasDiary = markedDates.includes(dateStr)
    const eventTypes = specialEvents[dateStr] ?? []

    if (!hasDiary && eventTypes.length === 0) return null

    return (
      <div className="flex justify-center gap-0.5 mt-0.5 flex-wrap">
        {hasDiary && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 block" />}
        {[...new Set(eventTypes)].map(type => (
          <span key={type} className={`w-1.5 h-1.5 rounded-full block ${EVENT_COLORS[type] ?? 'bg-gray-400'}`} />
        ))}
      </div>
    )
  }

  return (
    <div className="relative bg-white rounded-2xl shadow-sm">
      {navigating && (
        <div className="absolute inset-0 bg-white/70 rounded-2xl flex items-center justify-center z-10">
          <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <Calendar locale="ko-KR" onClickDay={handleClickDay} tileContent={tileContent} />
      <div className="flex flex-wrap gap-x-3 gap-y-1 px-4 pb-3 pt-1">
        <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-400 block" /><span className="text-xs text-gray-400">일지</span></div>
        <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-400 block" /><span className="text-xs text-gray-400">병원</span></div>
        <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-purple-400 block" /><span className="text-xs text-gray-400">미용</span></div>
        <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-400 block" /><span className="text-xs text-gray-400">예방접종</span></div>
        <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-400 block" /><span className="text-xs text-gray-400">구충제</span></div>
        <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-sky-400 block" /><span className="text-xs text-gray-400">목욕</span></div>
      </div>
    </div>
  )
}
