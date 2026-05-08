import { createClient } from '@/lib/supabase-server'
import DiaryCalendar from '@/components/DiaryCalendar'
import WeatherCard from '@/components/WeatherCard'
import KakaoMap from '@/components/KakaoMap'
import InviteCode from '@/components/InviteCode'
import WeightChart from '@/components/WeightChart'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('couple_id')
    .eq('id', user!.id)
    .single()

  const { data: couple } = await supabase
    .from('couples')
    .select('invite_code')
    .eq('id', profile!.couple_id)
    .single()

  const { data } = await supabase
    .from('diary')
    .select('date')
    .eq('couple_id', profile!.couple_id)

  const markedDates = (data ?? []).map(row => row.date)

  const { data: weightData } = await supabase
    .from('diary')
    .select('date, weight')
    .eq('couple_id', profile!.couple_id)
    .not('weight', 'is', null)
    .order('date', { ascending: true })
    .limit(60)

  const weightEntries = (weightData ?? []).map(row => ({
    date: row.date as string,
    weight: row.weight as number,
  }))

  return (
    <div className="flex flex-col gap-4">
      <WeatherCard />
      <DiaryCalendar markedDates={markedDates} coupleId={profile!.couple_id} />
      <KakaoMap />
      <WeightChart data={weightEntries} />
      {couple?.invite_code && <InviteCode code={couple.invite_code} />}
    </div>
  )
}
