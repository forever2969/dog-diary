import { createClient } from '@/lib/supabase-server'
import DiaryCalendar from '@/components/DiaryCalendar'
import WeatherCard from '@/components/WeatherCard'
import KakaoMap from '@/components/KakaoMap'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('couple_id')
    .eq('id', user!.id)
    .single()

  const { data } = await supabase
    .from('diary')
    .select('date')
    .eq('couple_id', profile!.couple_id)

  const markedDates = (data ?? []).map(row => row.date)

  return (
    <div className="flex flex-col gap-4">
      <WeatherCard />
      <DiaryCalendar markedDates={markedDates} coupleId={profile!.couple_id} />
      <KakaoMap />
    </div>
  )
}
