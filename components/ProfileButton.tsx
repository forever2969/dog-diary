'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ProfileButton() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  function handleClick() {
    setLoading(true)
    router.push('/profile')
  }

  return (
    <button
      onClick={handleClick}
      className="w-8 h-8 rounded-full overflow-hidden border-2 border-amber-200 active:scale-95 transition-transform"
    >
      {loading ? (
        <div className="w-full h-full bg-amber-50 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <img src="/pong.jpeg" alt="프로필" className="w-full h-full object-cover" />
      )}
    </button>
  )
}
