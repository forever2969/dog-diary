'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function BackButton() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  function handleClick() {
    setLoading(true)
    router.push('/')
  }

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-1.5 text-sm font-medium text-amber-500 bg-amber-50 px-3 py-1.5 rounded-xl active:scale-95 transition-transform"
    >
      {loading
        ? <span className="w-3.5 h-3.5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
        : '←'
      }
      뒤로
    </button>
  )
}
