'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Toast from '@/components/Toast'

type Poop = {
  id: string
  recorded_at: string
}

type Props = {
  date: string
  coupleId: string
  initial?: {
    weight: number | null
    meal_count: number | null
    meal_morning: number | null
    meal_lunch: number | null
    meal_dinner: number | null
    meal_night: number | null
    memo: string | null
  } | null
}

export default function DiaryForm({ date, coupleId, initial }: Props) {
  const router = useRouter()

  const [weight, setWeight] = useState(initial?.weight?.toString() ?? '')
  const [mealCount, setMealCount] = useState<3 | 4>((initial?.meal_count as 3 | 4) ?? 4)
  const [mealMorning, setMealMorning] = useState(initial?.meal_morning?.toString() ?? '')
  const [mealLunch, setMealLunch] = useState(initial?.meal_lunch?.toString() ?? '')
  const [mealDinner, setMealDinner] = useState(initial?.meal_dinner?.toString() ?? '')
  const [mealNight, setMealNight] = useState(initial?.meal_night?.toString() ?? '')
  const [memo, setMemo] = useState(initial?.memo ?? '')
  const [poops, setPoops] = useState<Poop[]>([])
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    supabase
      .from('poops')
      .select('id, recorded_at')
      .eq('date', date)
      .eq('couple_id', coupleId)
      .order('recorded_at')
      .then(({ data }) => setPoops(data ?? []))
  }, [date, coupleId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const { error } = await supabase.from('diary').upsert({
      date,
      couple_id: coupleId,
      weight: weight ? parseFloat(weight) : null,
      meal_count: mealCount,
      meal_morning: mealMorning ? parseInt(mealMorning) : null,
      meal_lunch: mealLunch ? parseInt(mealLunch) : null,
      meal_dinner: mealDinner ? parseInt(mealDinner) : null,
      meal_night: mealCount === 4 && mealNight ? parseInt(mealNight) : null,
      memo: memo || null,
    }, { onConflict: 'couple_id,date' })
    if (error) {
      setToast({ message: '저장 실패 😢', type: 'error' })
    } else {
      setToast({ message: '저장됐어요 ✓', type: 'success' })
    }
  }

  async function handleAddPoop() {
    const { data } = await supabase
      .from('poops')
      .insert({ date, couple_id: coupleId })
      .select('id, recorded_at')
      .single()
    if (data) setPoops(prev => [...prev, data])
  }

  async function handleDeletePoop(id: string) {
    await supabase.from('poops').delete().eq('id', id)
    setPoops(prev => prev.filter(p => p.id !== id))
  }

  function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
  }

  const meals = [
    { label: '아침', value: mealMorning, onChange: setMealMorning },
    { label: '점심', value: mealLunch, onChange: setMealLunch },
    { label: '저녁', value: mealDinner, onChange: setMealDinner },
    ...(mealCount === 4 ? [{ label: '자기전', value: mealNight, onChange: setMealNight }] : []),
  ]

  return (
    <>
    {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    <form onSubmit={handleSubmit} className="flex flex-col divide-y divide-gray-100">

      <div className="flex flex-col gap-2 pb-5">
        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">🐾 몸무게</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            step="0.1"
            value={weight}
            onChange={e => setWeight(e.target.value)}
            placeholder="0.0"
            className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-amber-400"
          />
          <span className="text-sm text-gray-400 font-medium">kg</span>
        </div>
      </div>

      <div className="flex flex-col gap-3 py-5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">🍚 급여량</label>
          <div className="flex rounded-lg overflow-hidden border border-gray-200">
            {([3, 4] as const).map(n => (
              <button
                key={n}
                type="button"
                onClick={() => setMealCount(n)}
                className={`px-4 py-1.5 text-sm font-medium transition-colors ${
                  mealCount === n ? 'bg-amber-400 text-white' : 'bg-white text-gray-400'
                }`}
              >
                {n}회
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {meals.map(meal => (
            <div key={meal.label} className="flex flex-col gap-1">
              <span className="text-xs text-gray-400 pl-1">{meal.label}</span>
              <div className="flex items-center border border-gray-200 rounded-xl focus-within:border-amber-400">
                <input
                  type="number"
                  value={meal.value}
                  onChange={e => meal.onChange(e.target.value)}
                  placeholder="0"
                  className="flex-1 px-3 py-2.5 text-base outline-none bg-transparent"
                />
                <span className="pr-2 text-xs text-gray-400">g</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2 py-5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">💩 배변활동</label>
          <button
            type="button"
            onClick={handleAddPoop}
            className="text-sm bg-amber-50 text-amber-600 font-semibold px-3 py-1.5 rounded-lg"
          >
            + 응가했어요
          </button>
        </div>
        {poops.length === 0 ? (
          <p className="text-sm text-gray-300 py-1">기록 없음</p>
        ) : (
          <ul className="flex flex-col gap-1.5">
            {poops.map((p, i) => (
              <li key={p.id} className="flex items-center justify-between bg-amber-50 rounded-xl px-3 py-2.5">
                <span className="text-sm text-gray-600">{i + 1}회 · {formatTime(p.recorded_at)}</span>
                <button
                  type="button"
                  onClick={() => handleDeletePoop(p.id)}
                  className="text-xs text-gray-300 font-medium"
                >
                  삭제
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex flex-col gap-2 py-5">
        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">📝 메모</label>
        <textarea
          value={memo}
          onChange={e => setMemo(e.target.value)}
          placeholder="오늘 특이사항을 적어주세요"
          rows={3}
          className="border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-amber-400 resize-none"
        />
      </div>

      <div className="pt-5">
        <button
          type="submit"
          className="w-full bg-amber-400 text-white font-semibold py-3.5 rounded-xl hover:bg-amber-500 transition-colors"
        >
          저장
        </button>
      </div>
    </form>
    </>
  )
}
