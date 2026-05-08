'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

type Props = {
  coupleId: string
  initialBreed: string | null
  initialNeutered: boolean
  currentWeight: number | null
  diaryCount: number
}

const BIRTHDAY = new Date(2026, 0, 30)

function calcAge(today: Date) {
  const totalDays = Math.floor((today.getTime() - BIRTHDAY.getTime()) / (1000 * 60 * 60 * 24))
  const totalWeeks = Math.floor(totalDays / 7)
  let months = (today.getFullYear() - BIRTHDAY.getFullYear()) * 12 + (today.getMonth() - BIRTHDAY.getMonth())
  if (today.getDate() < BIRTHDAY.getDate()) months--
  const years = Math.floor(months / 12)
  const remainMonths = months % 12
  return { totalDays, totalWeeks, months, years, remainMonths }
}

export default function DogProfile({ coupleId, initialBreed, initialNeutered, currentWeight, diaryCount }: Props) {
  const [breed, setBreed] = useState(initialBreed ?? '')
  const [neutered, setNeutered] = useState(initialNeutered)
  const [saved, setSaved] = useState(false)

  const { totalDays, totalWeeks, months, years, remainMonths } = calcAge(new Date())

  async function handleSave() {
    await supabase.from('dog_profiles').upsert(
      { couple_id: coupleId, breed: breed || null, neutered },
      { onConflict: 'couple_id' }
    )
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 flex flex-col gap-4">
      {/* 헤더 */}
      <div className="flex items-center gap-3">
        <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-amber-200 shrink-0">
          <img src="/pong.jpeg" alt="퐁이" className="w-full h-full object-cover" />
        </div>
        <div>
          <p className="font-bold text-lg text-amber-800">퐁이</p>
          <p className="text-xs text-gray-400">2026년 1월 30일생</p>
        </div>
      </div>

      {/* 나이 */}
      <div className="bg-amber-50 rounded-xl px-4 py-3">
        {years > 0 ? (
          <p className="text-amber-700 font-semibold">
            {years}살 {remainMonths}개월
          </p>
        ) : (
          <p className="text-amber-700 font-semibold">
            생후 {totalDays}일 · {totalWeeks}주 · {months}개월
          </p>
        )}
      </div>

      {/* 통계 */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <p className="text-xs text-gray-400 mb-1">현재 몸무게</p>
          <p className="font-bold text-gray-700">{currentWeight != null ? `${currentWeight}kg` : '-'}</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <p className="text-xs text-gray-400 mb-1">총 일지</p>
          <p className="font-bold text-gray-700">{diaryCount}일</p>
        </div>
      </div>

      {/* 편집 */}
      <div className="flex flex-col gap-3 pt-1 border-t border-gray-100">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-gray-400 font-medium">품종</label>
          <input
            type="text"
            value={breed}
            onChange={e => setBreed(e.target.value)}
            placeholder="말티푸"
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-amber-400"
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400 font-medium">중성화</span>
          <button
            type="button"
            onClick={() => setNeutered(v => !v)}
            className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${neutered ? 'bg-amber-400' : 'bg-gray-200'}`}
          >
            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${neutered ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </button>
        </div>

        <button
          onClick={handleSave}
          className={`w-full font-semibold py-2.5 rounded-xl text-sm transition-colors ${
            saved ? 'bg-green-400 text-white' : 'bg-amber-400 text-white hover:bg-amber-500'
          }`}
        >
          {saved ? '저장됐어요 ✓' : '저장'}
        </button>
      </div>
    </div>
  )
}
