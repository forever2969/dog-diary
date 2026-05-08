import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'

type Props = {
  coupleId: string
}

export default async function TodayCard({ coupleId }: Props) {
  const today = new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Seoul' })
  const [year, month, day] = today.split('-').map(Number)
  const days = ['일', '월', '화', '수', '목', '금', '토']
  const dateLabel = `${month}월 ${day}일 (${days[new Date(year, month - 1, day).getDay()]})`

  const supabase = await createClient()

  const [{ data: todayDiary }, { data: latestWeight }, { data: poops }] = await Promise.all([
    supabase
      .from('diary')
      .select('weight, meal_morning, meal_lunch, meal_dinner, meal_night, memo')
      .eq('couple_id', coupleId)
      .eq('date', today)
      .single(),
    supabase
      .from('diary')
      .select('weight, date')
      .eq('couple_id', coupleId)
      .not('weight', 'is', null)
      .order('date', { ascending: false })
      .limit(1)
      .single(),
    supabase
      .from('poops')
      .select('id')
      .eq('couple_id', coupleId)
      .eq('date', today),
  ])

  const totalMeal = [
    todayDiary?.meal_morning,
    todayDiary?.meal_lunch,
    todayDiary?.meal_dinner,
    todayDiary?.meal_night,
  ].filter(Boolean).reduce((sum, v) => sum + (v ?? 0), 0)

  const poopCount = poops?.length ?? 0

  return (
    <Link href={`/diary/${today}`} className="block bg-amber-400 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-amber-100 text-xs font-medium">오늘</p>
          <p className="text-white font-bold text-lg">{dateLabel}</p>
        </div>
        <span className="text-white text-sm font-semibold bg-amber-500 px-3 py-1.5 rounded-xl">
          {todayDiary ? '수정하기 →' : '일지 쓰기 →'}
        </span>
      </div>

      {todayDiary ? (
        <div className="flex gap-3 flex-wrap">
          {todayDiary.weight && (
            <span className="bg-amber-300/60 text-white text-xs font-medium px-2.5 py-1 rounded-lg">
              ⚖️ {todayDiary.weight}kg
            </span>
          )}
          {totalMeal > 0 && (
            <span className="bg-amber-300/60 text-white text-xs font-medium px-2.5 py-1 rounded-lg">
              🍚 {totalMeal}g
            </span>
          )}
          {poopCount > 0 && (
            <span className="bg-amber-300/60 text-white text-xs font-medium px-2.5 py-1 rounded-lg">
              💩 {poopCount}회
            </span>
          )}
          {todayDiary.memo && (
            <span className="bg-amber-300/60 text-white text-xs font-medium px-2.5 py-1 rounded-lg">
              📝 메모 있음
            </span>
          )}
        </div>
      ) : (
        <div className="flex gap-3 flex-wrap">
          <span className="bg-amber-300/60 text-white text-xs font-medium px-2.5 py-1 rounded-lg">
            오늘 아직 기록이 없어요
          </span>
          {latestWeight && (
            <span className="bg-amber-300/60 text-white text-xs font-medium px-2.5 py-1 rounded-lg">
              마지막 몸무게 {latestWeight.weight}kg
            </span>
          )}
        </div>
      )}
    </Link>
  )
}
