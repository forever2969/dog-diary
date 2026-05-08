'use client'

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
  data: Entry[]
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

export default function WeightChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">⚖️ 몸무게 추이</p>
        <p className="text-sm text-gray-300 text-center py-6">아직 몸무게 기록이 없어요</p>
      </div>
    )
  }

  const weights = data.map(d => d.weight)
  const minWeight = Math.min(...weights)
  const maxWeight = Math.max(...weights)
  const padding = 0.1
  const yMin = Math.floor((minWeight - padding) * 10) / 10
  const yMax = Math.ceil((maxWeight + padding) * 10) / 10

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">⚖️ 몸무게 추이</p>
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
            domain={[yMin, yMax]}
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={v => `${v}`}
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
    </div>
  )
}
