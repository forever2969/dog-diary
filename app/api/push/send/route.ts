import { NextRequest, NextResponse } from 'next/server'
import webpush from 'web-push'
import { createClient } from '@/lib/supabase-server'

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

export async function POST(req: NextRequest) {
  const { coupleId, title, body } = await req.json()
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // 상대방 구독 정보 조회
  const { data: subs } = await supabase
    .from('push_subscriptions')
    .select('subscription')
    .eq('couple_id', coupleId)
    .neq('user_id', user.id)

  if (!subs?.length) return NextResponse.json({ ok: true, sent: 0 })

  await Promise.allSettled(
    subs.map(({ subscription }) =>
      webpush.sendNotification(subscription, JSON.stringify({ title, body, url: '/' }))
    )
  )

  return NextResponse.json({ ok: true, sent: subs.length })
}
