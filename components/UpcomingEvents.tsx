import { createClient } from '@/lib/supabase-server'

const EVENT_INFO: Record<string, { label: string; color: string }> = {
  hospital:    { label: '병원',    color: 'bg-red-100 text-red-600 border-red-200' },
  grooming:    { label: '미용',    color: 'bg-purple-100 text-purple-600 border-purple-200' },
  vaccination: { label: '예방접종', color: 'bg-blue-100 text-blue-600 border-blue-200' },
  deworming:   { label: '구충제',  color: 'bg-green-100 text-green-600 border-green-200' },
  bath:        { label: '목욕',    color: 'bg-sky-100 text-sky-600 border-sky-200' },
  other:       { label: '기타',    color: 'bg-gray-100 text-gray-500 border-gray-200' },
}

const EVENT_EMOJI: Record<string, string> = {
  hospital: '🏥', grooming: '✂️', vaccination: '💉',
  deworming: '💊', bath: '🛁', other: '📌',
}

export default async function UpcomingEvents({ coupleId }: { coupleId: string }) {
  const supabase = await createClient()
  const today = new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Seoul' })

  const { data } = await supabase
    .from('special_events')
    .select('id, date, type, memo')
    .eq('couple_id', coupleId)
    .gte('date', today)
    .order('date', { ascending: true })
    .limit(5)

  if (!data?.length) return null

  function getDday(dateStr: string) {
    const diff = Math.round(
      (new Date(dateStr).getTime() - new Date(today).getTime()) / (1000 * 60 * 60 * 24)
    )
    if (diff === 0) return 'D-day'
    return `D-${diff}`
  }

  function formatDate(dateStr: string) {
    const [, m, d] = dateStr.split('-').map(Number)
    return `${m}월 ${d}일`
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">📅 다가오는 일정</p>
      <ul className="flex flex-col gap-2">
        {data.map(event => {
          const info = EVENT_INFO[event.type] ?? EVENT_INFO.other
          const dday = getDday(event.date)
          return (
            <li key={event.id} className="flex items-center gap-3">
              <span className={`text-sm font-bold w-14 text-center py-1 rounded-lg border ${info.color}`}>
                {dday}
              </span>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-gray-700">
                  {EVENT_EMOJI[event.type]} {info.label}
                </span>
                {event.memo && (
                  <span className="text-xs text-gray-400 ml-1.5 truncate">{event.memo}</span>
                )}
              </div>
              <span className="text-xs text-gray-400 shrink-0">{formatDate(event.date)}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
