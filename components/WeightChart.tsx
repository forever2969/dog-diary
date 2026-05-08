'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Dot,
} from 'recharts'

type Entry = {
  date: string
  weight: number
}

type Props = {
  coupleId: string
}

function formatDate(dateStr: string) {
  const [, month, day] = dateStr.split('-')
  return `${parseInt(month)}/${parseInt(day)}`
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-amber-100 rounded-xl px-3 py-2 shadow text-sm">
      <p className="text-gray-400">{payload[0].payload.date}</p>
      <p className="font-bold text-amber-700">{payload[0].value} kg</p>
    </div>
  )
}

export default function WeightChart({ coupleId }: Props) {
  const [data, setData] = useState<Entry[]>([])
  const [loading, setLoading] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    const { data: rows } = await supabase
      .from('diary')
      .select('date, weight')
      .eq('couple_id', coupleId)
      .not('weight', 'is', null)
      .order('date', { ascending: true })
      .limit(60)
    setData((rows ?? []).map(r => ({ date: r.date as string, weight: r.weight as number })))
    setLoading(false)
  }, [coupleId])

  useEffect(() => { fetchData() }, [fetchData])

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">⚖️ 몸무게 추이</p>
        <button
          onClick={fetchData}
          disabled={loading}
          className="text-xs text-amber-500 font-medium bg-amber-50 px-3 py-1.5 rounded-lg disabled:opacity-40"
        >
          {loading ? '로딩...' : '새로고침'}
        </button>
      </div>

      {data.length === 0 ? (
        <p className="text-sm text-gray-300 text-center py-6">아직 몸무게 기록이 없어요</p>
      ) : (
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[
                (min: number) => Math.floor((min - 0.1) * 10) / 10,
                (max: number) => Math.ceil((max + 0.1) * 10) / 10,
              ]}
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="weight"
              stroke="#fbbf24"
              strokeWidth={2}
              dot={<Dot r={3} fill="#fbbf24" stroke="#fff" strokeWidth={1.5} />}
              activeDot={{ r: 5, fill: '#f59e0b' }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
