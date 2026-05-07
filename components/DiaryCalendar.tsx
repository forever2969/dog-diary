'use client'

import Calendar from 'react-calendar'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

type Props = {
  markedDates: string[]
  coupleId: string
}

export default function DiaryCalendar({ markedDates: initialDates, coupleId }: Props) {
  const router = useRouter()
  const [markedDates, setMarkedDates] = useState(initialDates)

  useEffect(() => {
    const channel = supabase
      .channel('diary-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'diary',
          filter: `couple_id=eq.${coupleId}`,
        },
        payload => {
          if (payload.eventType === 'INSERT') {
            setMarkedDates(prev => [...prev, (payload.new as { date: string }).date])
          }
          if (payload.eventType === 'DELETE') {
            setMarkedDates(prev => prev.filter(d => d !== (payload.old as { date: string }).date))
          }
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [coupleId])

  function handleClickDay(value: Date) {
    const date = value.toLocaleDateString('sv-SE')
    router.push(`/diary/${date}`)
  }

  function tileContent({ date, view }: { date: Date; view: string }) {
    if (view !== 'month') return null
    const dateStr = date.toLocaleDateString('sv-SE')
    if (!markedDates.includes(dateStr)) return null
    return (
      <div className="flex justify-center mt-0.5">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 block" />
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm">
      <Calendar
        locale="ko-KR"
        onClickDay={handleClickDay}
        tileContent={tileContent}
      />
    </div>
  )
}
