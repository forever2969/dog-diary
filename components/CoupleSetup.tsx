'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

export default function CoupleSetup({ userId }: { userId: string }) {
  const router = useRouter()
  const [mode, setMode] = useState<'choose' | 'create' | 'join'>('choose')
  const [myCode, setMyCode] = useState('')
  const [inputCode, setInputCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleCreate() {
    setLoading(true)
    setError(null)
    const code = generateCode()
    const { data: couple, error: coupleError } = await supabase
      .from('couples')
      .insert({ invite_code: code })
      .select('id')
      .single()

    if (coupleError || !couple) {
      setError(`커플 생성 실패: ${coupleError?.message ?? '알 수 없는 오류'}`)
      setLoading(false)
      return
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({ id: userId, couple_id: couple.id })

    if (profileError) {
      setError(`프로필 저장 실패: ${profileError.message}`)
      setLoading(false)
      return
    }

    setMyCode(code)
    setLoading(false)
  }

  async function handleJoin() {
    setLoading(true)
    setError(null)
    const { data: couple } = await supabase
      .from('couples')
      .select('id')
      .eq('invite_code', inputCode.toUpperCase())
      .single()

    if (!couple) { setError('코드를 찾을 수 없어요'); setLoading(false); return }

    await supabase.from('profiles').upsert({ id: userId, couple_id: couple.id })
    router.push('/')
    router.refresh()
  }

  if (mode === 'choose') {
    return (
      <div className="flex flex-col gap-3">
        <button
          onClick={() => { setMode('create'); handleCreate() }}
          className="bg-amber-400 text-white font-semibold py-4 rounded-xl hover:bg-amber-500 transition-colors"
        >
          새로 시작하기
        </button>
        <button
          onClick={() => setMode('join')}
          className="bg-white border border-amber-200 text-amber-700 font-semibold py-4 rounded-xl"
        >
          초대 코드로 참여하기
        </button>
      </div>
    )
  }

  if (mode === 'create') {
    return (
      <div className="flex flex-col gap-4 items-center text-center">
        {loading && <p className="text-gray-400">코드 생성 중...</p>}
        {error && <p className="text-sm text-red-400 text-center">{error}</p>}
        {!loading && myCode && (
          <>
            <p className="text-sm text-gray-500">아래 코드를 상대방에게 공유해주세요</p>
            <div className="bg-amber-50 rounded-2xl px-8 py-6">
              <p className="text-3xl font-bold tracking-widest text-amber-700">{myCode}</p>
            </div>
            <button
              onClick={() => { router.push('/'); router.refresh() }}
              className="w-full bg-amber-400 text-white font-semibold py-3 rounded-xl hover:bg-amber-500 transition-colors"
            >
              시작하기
            </button>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-600">초대 코드</label>
        <input
          value={inputCode}
          onChange={e => setInputCode(e.target.value.toUpperCase())}
          placeholder="8자리 코드 입력"
          maxLength={8}
          className="border border-gray-200 rounded-xl px-4 py-3 text-base text-center tracking-widest outline-none focus:border-amber-400"
        />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button
        onClick={handleJoin}
        disabled={loading || inputCode.length !== 8}
        className="bg-amber-400 text-white font-semibold py-3 rounded-xl hover:bg-amber-500 transition-colors disabled:opacity-50"
      >
        {loading ? '확인 중...' : '참여하기'}
      </button>
    </div>
  )
}
