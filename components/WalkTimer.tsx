'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'

type Walk = {
  id: string
  start_time: string
  end_time: string | null
}

export default function WalkTimer({ date, coupleId }: { date: string; coupleId: string }) {
  const [walks, setWalks] = useState<Walk[]>([])
  const [currentWalkId, setCurrentWalkId] = useState<string | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    supabase
      .from('walks')
      .select('id, start_time, end_time')
      .eq('date', date)
      .eq('couple_id', coupleId)
      .order('start_time')
      .then(({ data }) => {
        const rows = data ?? []
        setWalks(rows)
        const ongoing = rows.find(w => !w.end_time)
        if (ongoing) {
          setCurrentWalkId(ongoing.id)
          setElapsed(Math.floor((Date.now() - new Date(ongoing.start_time).getTime()) / 1000))
        }
      })
  }, [date])

  useEffect(() => {
    if (currentWalkId) {
      intervalRef.current = setInterval(() => setElapsed(prev => prev + 1), 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [currentWalkId])

  async function handleStart() {
    const { data } = await supabase
      .from('walks')
      .insert({ date, couple_id: coupleId, start_time: new Date().toISOString() })
      .select('id, start_time, end_time')
      .single()
    if (data) {
      setWalks(prev => [...prev, data])
      setCurrentWalkId(data.id)
      setElapsed(0)
    }
  }

  async function handleStop() {
    const endTime = new Date().toISOString()
    await supabase.from('walks').update({ end_time: endTime }).eq('id', currentWalkId)
    setWalks(prev => prev.map(w => w.id === currentWalkId ? { ...w, end_time: endTime } : w))
    setCurrentWalkId(null)
    setElapsed(0)
  }

  function formatElapsed(s: number) {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${String(sec).padStart(2, '0')}`
  }

  function getDuration(walk: Walk) {
    if (!walk.end_time) return null
    const minutes = Math.round(
      (new Date(walk.end_time).getTime() - new Date(walk.start_time).getTime()) / 60000
    )
    return minutes < 60 ? `${minutes}분` : `${Math.floor(minutes / 60)}시간 ${minutes % 60}분`
  }

  function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
  }

  const completedWalks = walks.filter(w => w.end_time)

  return (
    <div className={`rounded-2xl shadow-sm p-5 flex flex-col gap-3 transition-colors ${
      currentWalkId ? 'bg-amber-400' : 'bg-white'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base">🐕</span>
          <span className={`text-sm font-medium ${currentWalkId ? 'text-white' : 'text-gray-600'}`}>
            산책
          </span>
          {currentWalkId && (
            <span className="w-2 h-2 rounded-full bg-white opacity-80 animate-pulse" />
          )}
        </div>
        {currentWalkId ? (
          <div className="flex items-center gap-3">
            <span className="text-xl font-mono font-bold text-white">{formatElapsed(elapsed)}</span>
            <button
              onClick={handleStop}
              className="bg-white text-amber-500 text-sm font-bold px-4 py-2 rounded-xl"
            >
              도착
            </button>
          </div>
        ) : (
          <button
            onClick={handleStart}
            className="bg-amber-50 text-amber-600 text-sm font-semibold px-4 py-2 rounded-xl"
          >
            출발 🐾
          </button>
        )}
      </div>
      {completedWalks.length > 0 && (
        <ul className="flex flex-col gap-1.5">
          {completedWalks.map((w, i) => (
            <li key={w.id} className={`flex items-center justify-between rounded-xl px-3 py-2 ${
              currentWalkId ? 'bg-amber-300/50' : 'bg-amber-50'
            }`}>
              <span className={`text-sm ${currentWalkId ? 'text-white' : 'text-gray-600'}`}>
                {i + 1}회 · {formatTime(w.start_time)}
              </span>
              <span className={`text-sm font-semibold ${currentWalkId ? 'text-white' : 'text-amber-600'}`}>
                {getDuration(w)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
