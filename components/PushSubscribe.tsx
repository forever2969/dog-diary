'use client'

import { useState, useEffect } from 'react'

export default function PushSubscribe({ coupleId }: { coupleId: string }) {
  const [status, setStatus] = useState<'idle' | 'subscribed' | 'denied' | 'unsupported'>('idle')

  useEffect(() => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      setStatus('unsupported')
      return
    }
    if (Notification.permission === 'granted') setStatus('subscribed')
    if (Notification.permission === 'denied') setStatus('denied')
  }, [])

  async function handleSubscribe() {
    const permission = await Notification.requestPermission()
    if (permission !== 'granted') { setStatus('denied'); return }

    const reg = await navigator.serviceWorker.ready
    const existing = await reg.pushManager.getSubscription()
    const sub = existing ?? await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    })

    await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subscription: sub.toJSON(), coupleId }),
    })

    setStatus('subscribed')
  }

  if (status === 'unsupported') return null
  if (status === 'subscribed') return (
    <div className="flex items-center gap-2 text-xs text-gray-400 bg-white rounded-2xl px-4 py-3 shadow-sm">
      <span className="w-2 h-2 rounded-full bg-green-400 block" />
      알림 켜짐 — 상대방이 일지 저장하면 알려줄게요
    </div>
  )

  return (
    <button
      onClick={handleSubscribe}
      className="w-full bg-white rounded-2xl px-4 py-3 shadow-sm text-sm font-semibold text-amber-600 text-left"
    >
      🔔 푸시 알림 켜기
    </button>
  )
}
