'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

function toKorean(message: string): string {
  if (message.includes('rate limit')) return '잠시 후 다시 시도해주세요. (이메일 발송 한도 초과)'
  if (message.includes('already registered')) return '이미 가입된 이메일이에요'
  if (message.includes('Invalid login credentials')) return '이메일 또는 비밀번호가 올바르지 않아요'
  if (message.includes('Email not confirmed')) return '이메일 인증이 필요해요'
  if (message.includes('Password should be')) return '비밀번호는 6자 이상이어야 해요'
  if (message.includes('Unable to validate')) return '이메일 형식을 확인해주세요'
  return '오류가 발생했어요. 다시 시도해주세요.'
}

export default function AuthForm() {
  const router = useRouter()
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) { setError(toKorean(error.message)); setLoading(false); return }
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
      if (signInError) { setError('가입 후 로그인에 실패했어요. 다시 로그인해주세요.'); setLoading(false); return }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) { setError(toKorean(error.message)); setLoading(false); return }
    }

    router.push('/')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-600">이메일</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="example@email.com"
          required
          className="border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-amber-400"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-600">비밀번호</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="6자 이상"
          required
          className="border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-amber-400"
        />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="bg-amber-400 text-white font-semibold py-3 rounded-xl hover:bg-amber-500 transition-colors disabled:opacity-50"
      >
        {loading ? '잠시만요...' : isSignUp ? '가입하기' : '로그인'}
      </button>
      <button
        type="button"
        onClick={() => setIsSignUp(v => !v)}
        className="text-sm text-gray-400 text-center"
      >
        {isSignUp ? '이미 계정이 있어요 → 로그인' : '처음이에요 → 회원가입'}
      </button>
    </form>
  )
}
