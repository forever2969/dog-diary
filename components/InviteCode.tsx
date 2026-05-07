'use client'

import { useState } from 'react'

export default function InviteCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-white rounded-2xl p-4 flex items-center justify-between">
      <div>
        <p className="text-xs text-gray-400 mb-1">초대코드</p>
        <p className="text-lg font-bold tracking-widest text-amber-700">{code}</p>
      </div>
      <button
        onClick={handleCopy}
        className="text-sm bg-amber-50 text-amber-600 font-semibold px-3 py-2 rounded-xl"
      >
        {copied ? '복사됨 ✓' : '복사'}
      </button>
    </div>
  )
}
